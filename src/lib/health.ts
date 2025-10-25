/**
 * Health Monitoring System
 *
 * Comprehensive health checks for all services:
 * - Database connectivity
 * - External APIs (Claude, Stripe)
 * - Agent status
 * - System resources
 * - Service dependencies
 */

import { PrismaClient } from '@prisma/client';
import { lucyAgent } from '../agents/lucyAgent';
import { ebookAgent } from '../agents/ebookAgent';
import { stripeService } from './stripe';
import { authService } from './auth';

const prisma = new PrismaClient();

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: ServiceHealth[];
  overall: {
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  details?: any;
  lastCheck: string;
}

export class HealthMonitor {
  private healthCheckInterval?: NodeJS.Timeout;
  private readonly CHECK_INTERVAL_MS = parseInt(
    process.env.HEALTH_CHECK_INTERVAL_MS || '60000'
  );

  /**
   * Start continuous health monitoring
   */
  startMonitoring(): void {
    console.log('[Health] Starting health monitoring...');

    // Initial check
    this.performHealthCheck();

    // Schedule periodic checks
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.CHECK_INTERVAL_MS);
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      console.log('[Health] Health monitoring stopped');
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthStatus> {
    console.log('[Health] Performing health check...');
    const startTime = Date.now();

    const services: ServiceHealth[] = [];

    // Check Database
    services.push(await this.checkDatabase());

    // Check Lucy Agent
    services.push(await this.checkLucyAgent());

    // Check eBook Agent
    services.push(await this.checkEbookAgent());

    // Check Stripe Service
    services.push(await this.checkStripe());

    // Check Auth Service
    services.push(await this.checkAuth());

    // Check Anthropic API
    services.push(await this.checkAnthropicAPI());

    // Calculate overall status
    const healthy = services.filter(s => s.status === 'healthy').length;
    const degraded = services.filter(s => s.status === 'degraded').length;
    const unhealthy = services.filter(s => s.status === 'unhealthy').length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthy > 0) {
      overallStatus = 'unhealthy';
    } else if (degraded > 0) {
      overallStatus = 'degraded';
    }

    const status: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      overall: { healthy, degraded, unhealthy },
    };

    // Log to database
    await this.logHealthCheck(status);

    const duration = Date.now() - startTime;
    console.log(`[Health] Health check completed in ${duration}ms - Status: ${overallStatus}`);

    return status;
  }

  /**
   * Check database connectivity and health
   */
  private async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      // Test query
      await prisma.$queryRaw`SELECT 1`;

      // Check connection pool
      const metrics = await prisma.$metrics.json();

      const responseTime = Date.now() - startTime;

      return {
        name: 'database',
        status: responseTime < 100 ? 'healthy' : 'degraded',
        responseTime,
        details: {
          type: 'postgresql',
          metrics: metrics ? 'available' : 'unavailable',
        },
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Check Lucy Agent health
   */
  private async checkLucyAgent(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      const health = await lucyAgent.healthCheck();
      const responseTime = Date.now() - startTime;

      return {
        name: 'lucy_agent',
        status: health.status,
        responseTime,
        details: health.details,
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'lucy_agent',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Check eBook Agent health
   */
  private async checkEbookAgent(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      const health = await ebookAgent.healthCheck();
      const responseTime = Date.now() - startTime;

      return {
        name: 'ebook_agent',
        status: health.status,
        responseTime,
        details: health.details,
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'ebook_agent',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Check Stripe service health
   */
  private async checkStripe(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      const health = await stripeService.healthCheck();
      const responseTime = Date.now() - startTime;

      return {
        name: 'stripe',
        status: health.status,
        responseTime,
        details: health.details,
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'stripe',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Check Auth service health
   */
  private async checkAuth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      const health = await authService.healthCheck();
      const responseTime = Date.now() - startTime;

      return {
        name: 'auth',
        status: health.status,
        responseTime,
        details: health.details,
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'auth',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Check Anthropic API connectivity
   */
  private async checkAnthropicAPI(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      // Simple test to verify API key and connectivity
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }],
        }),
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          name: 'anthropic_api',
          status: responseTime < 2000 ? 'healthy' : 'degraded',
          responseTime,
          details: {
            apiKey: 'configured',
          },
          lastCheck: new Date().toISOString(),
        };
      } else {
        return {
          name: 'anthropic_api',
          status: 'unhealthy',
          responseTime,
          details: {
            statusCode: response.status,
            error: await response.text(),
          },
          lastCheck: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        name: 'anthropic_api',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Log health check to database
   */
  private async logHealthCheck(status: HealthStatus): Promise<void> {
    try {
      for (const service of status.services) {
        await prisma.healthCheck.create({
          data: {
            service: service.name,
            status: service.status,
            responseTime: service.responseTime,
            details: service.details as any,
          },
        });
      }

      // Clean up old health check records (keep last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      await prisma.healthCheck.deleteMany({
        where: {
          checkedAt: { lt: sevenDaysAgo },
        },
      });
    } catch (error) {
      console.error('[Health] Failed to log health check:', error);
    }
  }

  /**
   * Get health history for a service
   */
  async getServiceHistory(
    serviceName: string,
    hours: number = 24
  ): Promise<ServiceHealth[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const records = await prisma.healthCheck.findMany({
      where: {
        service: serviceName,
        checkedAt: { gte: since },
      },
      orderBy: { checkedAt: 'desc' },
    });

    return records.map(record => ({
      name: record.service,
      status: record.status as 'healthy' | 'degraded' | 'unhealthy',
      responseTime: record.responseTime || undefined,
      details: record.details as any,
      lastCheck: record.checkedAt.toISOString(),
    }));
  }

  /**
   * Get service uptime percentage
   */
  async getServiceUptime(serviceName: string, hours: number = 24): Promise<number> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const total = await prisma.healthCheck.count({
      where: {
        service: serviceName,
        checkedAt: { gte: since },
      },
    });

    const healthy = await prisma.healthCheck.count({
      where: {
        service: serviceName,
        checkedAt: { gte: since },
        status: 'healthy',
      },
    });

    return total > 0 ? (healthy / total) * 100 : 100;
  }
}

// Export singleton instance
export const healthMonitor = new HealthMonitor();
