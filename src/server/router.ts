/**
 * tRPC API Router
 *
 * Unified API for all AaronOS services
 */

import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { lucyAgent } from '../agents/lucyAgent';
import { ebookAgent } from '../agents/ebookAgent';
import { wcagAgent } from '../agents/wcagAgent';
import { stripeService } from '../lib/stripe';
import { authService } from '../lib/auth';
import { healthMonitor } from '../lib/health';
import { jobScheduler } from './scheduler';

const prisma = new PrismaClient();
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  // Health & System Status
  health: router({
    check: publicProcedure.query(async () => {
      return await healthMonitor.performHealthCheck();
    }),

    serviceHistory: publicProcedure
      .input(z.object({
        service: z.string(),
        hours: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await healthMonitor.getServiceHistory(input.service, input.hours);
      }),

    uptime: publicProcedure
      .input(z.object({
        service: z.string(),
        hours: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await healthMonitor.getServiceUptime(input.service, input.hours);
      }),
  }),

  // Authentication
  auth: router({
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await authService.register(input);
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await authService.login(input);
      }),

    logout: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        await authService.logout(input.token);
        return { success: true };
      }),

    validateSession: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        return await authService.validateSession(input.token);
      }),

    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        return await authService.requestPasswordReset(input);
      }),

    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        await authService.resetPassword(input.token, input.newPassword);
        return { success: true };
      }),

    changePassword: publicProcedure
      .input(z.object({
        userId: z.string(),
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        await authService.changePassword(
          input.userId,
          input.currentPassword,
          input.newPassword
        );
        return { success: true };
      }),
  }),

  // Subscription Management
  subscription: router({
    create: publicProcedure
      .input(z.object({
        userId: z.string(),
        email: z.string().email(),
        plan: z.enum(['basic', 'pro', 'enterprise']),
        paymentMethodId: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await stripeService.createSubscription(input);
      }),

    update: publicProcedure
      .input(z.object({
        userId: z.string(),
        plan: z.enum(['basic', 'pro', 'enterprise']),
      }))
      .mutation(async ({ input }) => {
        await stripeService.updateSubscription(input.userId, input.plan);
        return { success: true };
      }),

    cancel: publicProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        await stripeService.cancelSubscription(input.userId);
        return { success: true };
      }),

    reactivate: publicProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        await stripeService.reactivateSubscription(input.userId);
        return { success: true };
      }),

    status: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return await stripeService.getSubscriptionStatus(input.userId);
      }),
  }),

  // Lucy AI Research
  lucy: router({
    createResearch: publicProcedure
      .input(z.object({
        userId: z.string(),
        query: z.string(),
        includeCompetitors: z.boolean().optional(),
        includeMarketData: z.boolean().optional(),
        depth: z.enum(['basic', 'standard', 'deep']).optional(),
      }))
      .mutation(async ({ input }) => {
        // Create research record
        const research = await prisma.lucyResearch.create({
          data: {
            userId: input.userId,
            title: input.query.substring(0, 100),
            query: input.query,
            status: 'pending',
            progress: 0,
          },
        });

        // Execute research asynchronously
        lucyAgent.executeResearch({
          id: research.id,
          userId: input.userId,
          query: input.query,
          includeCompetitors: input.includeCompetitors,
          includeMarketData: input.includeMarketData,
          depth: input.depth || 'standard',
        }).catch(err => console.error('Lucy research failed:', err));

        return { researchId: research.id };
      }),

    getResearch: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await prisma.lucyResearch.findUnique({
          where: { id: input.id },
        });
      }),

    listResearch: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return await prisma.lucyResearch.findMany({
          where: { userId: input.userId },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
      }),
  }),

  // eBook Machine
  ebook: router({
    create: publicProcedure
      .input(z.object({
        userId: z.string(),
        title: z.string(),
        outline: z.object({
          title: z.string(),
          author: z.string().optional(),
          chapters: z.array(z.object({
            number: z.number(),
            title: z.string(),
            sections: z.array(z.string()),
            keyPoints: z.array(z.string()).optional(),
          })),
          style: z.enum(['professional', 'casual', 'academic', 'narrative']).optional(),
          targetLength: z.number().optional(),
        }),
        format: z.enum(['pdf', 'docx', 'epub']).optional(),
      }))
      .mutation(async ({ input }) => {
        // Create eBook record
        const ebook = await prisma.ebook.create({
          data: {
            userId: input.userId,
            title: input.title,
            outline: input.outline as any,
            status: 'draft',
            progress: 0,
            format: input.format || 'pdf',
          },
        });

        // Generate eBook asynchronously
        ebookAgent.generateEbook(
          ebook.id,
          input.userId,
          input.outline,
          input.format || 'pdf'
        ).catch(err => console.error('eBook generation failed:', err));

        return { ebookId: ebook.id };
      }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await prisma.ebook.findUnique({
          where: { id: input.id },
        });
      }),

    list: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return await prisma.ebook.findMany({
          where: { userId: input.userId },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
      }),
  }),

  // WCAG Scanner
  wcag: router({
    createScan: publicProcedure
      .input(z.object({
        userId: z.string(),
        targetUrl: z.string().url(),
        domains: z.array(z.string()),
        benchmark: z.string().optional(),
        maxPages: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        // Create scan record
        const scan = await prisma.wcagScan.create({
          data: {
            userId: input.userId,
            targetUrl: input.targetUrl,
            domains: input.domains as any,
            status: 'queued',
            progress: 0,
            benchmark: input.benchmark,
          },
        });

        // Execute scan asynchronously
        wcagAgent.executeScan({
          id: scan.id,
          userId: input.userId,
          targetUrl: input.targetUrl,
          domains: input.domains,
          benchmark: input.benchmark,
          maxPages: input.maxPages,
        }).catch(err => console.error('WCAG scan failed:', err));

        return { scanId: scan.id };
      }),

    getScan: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await prisma.wcagScan.findUnique({
          where: { id: input.id },
        });
      }),

    listScans: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return await prisma.wcagScan.findMany({
          where: { userId: input.userId },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
      }),
  }),

  // Job Scheduler
  jobs: router({
    list: publicProcedure.query(async () => {
      return await jobScheduler.getAllJobsStatus();
    }),

    get: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        return await jobScheduler.getJobStatus(input.name);
      }),
  }),
});

export type AppRouter = typeof appRouter;
