/**
 * Job Scheduler
 *
 * Automated task scheduling system:
 * - Database backups
 * - Subscription synchronization
 * - Session cleanup
 * - Health monitoring
 * - Data retention policies
 */

import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { stripeService } from '../lib/stripe';
import { authService } from '../lib/auth';
import { healthMonitor } from '../lib/health';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export class JobScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private readonly BACKUP_DIR = process.env.BACKUP_DIR || '/tmp/backups';

  /**
   * Initialize and start all scheduled jobs
   */
  async start(): Promise<void> {
    console.log('[Scheduler] Starting job scheduler...');

    if (process.env.ENABLE_SCHEDULER !== 'true') {
      console.log('[Scheduler] Scheduler disabled via environment variable');
      return;
    }

    // Ensure backup directory exists
    await this.ensureBackupDir();

    // Register all jobs
    this.registerJobs();

    console.log(`[Scheduler] ${this.jobs.size} jobs scheduled`);
  }

  /**
   * Stop all scheduled jobs
   */
  stop(): void {
    console.log('[Scheduler] Stopping all jobs...');
    this.jobs.forEach((task, name) => {
      task.stop();
      console.log(`[Scheduler] Stopped: ${name}`);
    });
    this.jobs.clear();
  }

  /**
   * Register all scheduled jobs
   */
  private registerJobs(): void {
    // Database backup - Daily at 2 AM
    this.scheduleJob('database_backup', '0 2 * * *', () => this.backupDatabase());

    // Sync Stripe subscriptions - Every hour
    this.scheduleJob('sync_subscriptions', '0 * * * *', () => this.syncSubscriptions());

    // Clean up expired sessions - Every 6 hours
    this.scheduleJob('cleanup_sessions', '0 */6 * * *', () => this.cleanupSessions());

    // Clean up expired password resets - Daily at 1 AM
    this.scheduleJob('cleanup_password_resets', '0 1 * * *', () => this.cleanupPasswordResets());

    // Health monitoring - Every 5 minutes
    this.scheduleJob('health_check', '*/5 * * * *', () => this.runHealthCheck());

    // Clean up old health checks - Daily at 3 AM
    this.scheduleJob('cleanup_health_checks', '0 3 * * *', () => this.cleanupOldHealthChecks());

    // Clean up old job runs - Weekly on Sunday at 4 AM
    this.scheduleJob('cleanup_job_runs', '0 4 * * 0', () => this.cleanupOldJobRuns());

    // Archive completed research/ebooks - Daily at 5 AM
    this.scheduleJob('archive_completed_work', '0 5 * * *', () => this.archiveCompletedWork());
  }

  /**
   * Schedule a job with error handling and logging
   */
  private scheduleJob(name: string, schedule: string, handler: () => Promise<void>): void {
    const task = cron.schedule(schedule, async () => {
      await this.executeJob(name, handler);
    });

    this.jobs.set(name, task);
    console.log(`[Scheduler] Registered: ${name} (${schedule})`);

    // Log to database
    this.registerJobInDB(name, schedule).catch(err =>
      console.error(`Failed to register job ${name} in DB:`, err)
    );
  }

  /**
   * Execute job with error handling and tracking
   */
  private async executeJob(name: string, handler: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    console.log(`[Scheduler] Starting job: ${name}`);

    let jobRun;
    try {
      // Create job run record
      const job = await prisma.scheduledJob.findUnique({ where: { name } });
      if (job) {
        jobRun = await prisma.jobRun.create({
          data: {
            jobId: job.id,
            status: 'running',
          },
        });
      }

      // Execute job
      await handler();

      const duration = Date.now() - startTime;
      console.log(`[Scheduler] Job completed: ${name} (${duration}ms)`);

      // Update job run as success
      if (jobRun) {
        await prisma.jobRun.update({
          where: { id: jobRun.id },
          data: {
            status: 'success',
            endedAt: new Date(),
            duration,
          },
        });
      }

      // Update scheduled job
      if (job) {
        await prisma.scheduledJob.update({
          where: { id: job.id },
          data: {
            lastRunAt: new Date(),
            lastStatus: 'success',
          },
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Scheduler] Job failed: ${name}`, error);

      // Update job run as failed
      if (jobRun) {
        await prisma.jobRun.update({
          where: { id: jobRun.id },
          data: {
            status: 'failed',
            endedAt: new Date(),
            duration,
            error: errorMessage,
          },
        });
      }

      // Update scheduled job
      const job = await prisma.scheduledJob.findUnique({ where: { name } });
      if (job) {
        await prisma.scheduledJob.update({
          where: { id: job.id },
          data: {
            lastRunAt: new Date(),
            lastStatus: 'failed',
          },
        });
      }
    }
  }

  /**
   * Register job in database
   */
  private async registerJobInDB(name: string, schedule: string): Promise<void> {
    await prisma.scheduledJob.upsert({
      where: { name },
      update: { schedule },
      create: {
        name,
        schedule,
        enabled: true,
      },
    });
  }

  /**
   * Backup database
   */
  private async backupDatabase(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.sql`;
    const filepath = path.join(this.BACKUP_DIR, filename);

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    console.log(`[Scheduler] Creating database backup: ${filename}`);

    try {
      // Use pg_dump for PostgreSQL backup
      const { stdout, stderr } = await execAsync(
        `pg_dump "${dbUrl}" > "${filepath}"`
      );

      if (stderr) {
        console.warn('[Scheduler] Backup warnings:', stderr);
      }

      // Get file size
      const stats = await fs.stat(filepath);

      // Log backup
      await prisma.databaseBackup.create({
        data: {
          filename,
          size: BigInt(stats.size),
          status: 'success',
        },
      });

      console.log(`[Scheduler] Backup completed: ${filename} (${stats.size} bytes)`);

      // Clean up old backups (keep last 30 days)
      await this.cleanupOldBackups();
    } catch (error) {
      await prisma.databaseBackup.create({
        data: {
          filename,
          size: BigInt(0),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Clean up old backups
   */
  private async cleanupOldBackups(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldBackups = await prisma.databaseBackup.findMany({
      where: { createdAt: { lt: thirtyDaysAgo } },
    });

    for (const backup of oldBackups) {
      try {
        const filepath = path.join(this.BACKUP_DIR, backup.filename);
        await fs.unlink(filepath);
        await prisma.databaseBackup.delete({ where: { id: backup.id } });
        console.log(`[Scheduler] Deleted old backup: ${backup.filename}`);
      } catch (error) {
        console.error(`Failed to delete backup ${backup.filename}:`, error);
      }
    }
  }

  /**
   * Sync Stripe subscriptions
   */
  private async syncSubscriptions(): Promise<void> {
    console.log('[Scheduler] Syncing Stripe subscriptions...');
    await stripeService.syncSubscriptions();
  }

  /**
   * Clean up expired sessions
   */
  private async cleanupSessions(): Promise<void> {
    console.log('[Scheduler] Cleaning up expired sessions...');
    await authService.cleanupExpiredSessions();
  }

  /**
   * Clean up expired password resets
   */
  private async cleanupPasswordResets(): Promise<void> {
    console.log('[Scheduler] Cleaning up expired password resets...');
    await authService.cleanupExpiredResets();
  }

  /**
   * Run health check
   */
  private async runHealthCheck(): Promise<void> {
    console.log('[Scheduler] Running health check...');
    await healthMonitor.performHealthCheck();
  }

  /**
   * Clean up old health checks
   */
  private async cleanupOldHealthChecks(): Promise<void> {
    console.log('[Scheduler] Cleaning up old health checks...');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await prisma.healthCheck.deleteMany({
      where: { checkedAt: { lt: sevenDaysAgo } },
    });

    console.log(`[Scheduler] Deleted ${result.count} old health check records`);
  }

  /**
   * Clean up old job runs
   */
  private async cleanupOldJobRuns(): Promise<void> {
    console.log('[Scheduler] Cleaning up old job runs...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.jobRun.deleteMany({
      where: { startedAt: { lt: thirtyDaysAgo } },
    });

    console.log(`[Scheduler] Deleted ${result.count} old job run records`);
  }

  /**
   * Archive completed work older than 90 days
   */
  private async archiveCompletedWork(): Promise<void> {
    console.log('[Scheduler] Archiving old completed work...');
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Archive old research
    const oldResearch = await prisma.lucyResearch.count({
      where: {
        status: 'completed',
        completedAt: { lt: ninetyDaysAgo },
      },
    });

    // Archive old ebooks
    const oldEbooks = await prisma.ebook.count({
      where: {
        status: 'completed',
        completedAt: { lt: ninetyDaysAgo },
      },
    });

    console.log(`[Scheduler] Found ${oldResearch} old research and ${oldEbooks} old ebooks`);
    // TODO: Implement actual archival to S3 or similar
  }

  /**
   * Ensure backup directory exists
   */
  private async ensureBackupDir(): Promise<void> {
    try {
      await fs.mkdir(this.BACKUP_DIR, { recursive: true });
    } catch (error) {
      console.error('Failed to create backup directory:', error);
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(name: string): Promise<any> {
    const job = await prisma.scheduledJob.findUnique({
      where: { name },
      include: {
        runs: {
          take: 10,
          orderBy: { startedAt: 'desc' },
        },
      },
    });

    return job;
  }

  /**
   * Get all jobs status
   */
  async getAllJobsStatus(): Promise<any[]> {
    const jobs = await prisma.scheduledJob.findMany({
      include: {
        runs: {
          take: 1,
          orderBy: { startedAt: 'desc' },
        },
      },
    });

    return jobs;
  }
}

// Create singleton instance
export const jobScheduler = new JobScheduler();

// Start scheduler if running as main module
if (require.main === module) {
  console.log('[Scheduler] Starting standalone scheduler...');
  jobScheduler.start().catch(error => {
    console.error('[Scheduler] Failed to start:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[Scheduler] Received SIGTERM, shutting down...');
    jobScheduler.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('[Scheduler] Received SIGINT, shutting down...');
    jobScheduler.stop();
    process.exit(0);
  });
}
