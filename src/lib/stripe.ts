/**
 * Stripe Subscription System
 *
 * Complete subscription management with:
 * - Payment processing
 * - Webhook handling
 * - Subscription lifecycle management
 * - Usage tracking
 * - Automatic renewal
 */

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export interface CreateSubscriptionParams {
  userId: string;
  email: string;
  plan: 'basic' | 'pro' | 'enterprise';
  paymentMethodId: string;
}

export interface SubscriptionStatus {
  active: boolean;
  plan: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export class StripeService {
  /**
   * Create a new customer and subscription
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<{
    subscriptionId: string;
    clientSecret: string;
  }> {
    console.log(`[Stripe] Creating subscription for user: ${params.userId}`);

    try {
      // Create or retrieve Stripe customer
      const customer = await stripe.customers.create({
        email: params.email,
        metadata: {
          userId: params.userId,
        },
      });

      // Attach payment method to customer
      await stripe.paymentMethods.attach(params.paymentMethodId, {
        customer: customer.id,
      });

      // Set as default payment method
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: params.paymentMethodId,
        },
      });

      // Get price ID based on plan
      const priceId = this.getPriceId(params.plan);

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Save to database
      await prisma.subscription.create({
        data: {
          userId: params.userId,
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          plan: params.plan,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('[Stripe] Subscription creation failed:', error);
      throw error;
    }
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(userId: string, newPlan: 'basic' | 'pro' | 'enterprise'): Promise<void> {
    console.log(`[Stripe] Updating subscription for user ${userId} to ${newPlan}`);

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const newPriceId = this.getPriceId(newPlan);

    // Update subscription
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    });

    // Update database
    await prisma.subscription.update({
      where: { userId },
      data: { plan: newPlan },
    });
  }

  /**
   * Cancel subscription (at period end)
   */
  async cancelSubscription(userId: string): Promise<void> {
    console.log(`[Stripe] Canceling subscription for user: ${userId}`);

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: true },
    });
  }

  /**
   * Reactivate canceled subscription
   */
  async reactivateSubscription(userId: string): Promise<void> {
    console.log(`[Stripe] Reactivating subscription for user: ${userId}`);

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: false },
    });
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return null;
    }

    return {
      active: subscription.status === 'active' || subscription.status === 'trialing',
      plan: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(event: Stripe.Event): Promise<void> {
    console.log(`[Stripe] Handling webhook: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Handle subscription updated event
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }

  /**
   * Handle subscription deleted event
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
      },
    });
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeCustomerId: invoice.customer as string },
    });

    if (subscription) {
      await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          stripePaymentId: invoice.payment_intent as string,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'succeeded',
        },
      });
    }
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeCustomerId: invoice.customer as string },
    });

    if (subscription) {
      await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          stripePaymentId: invoice.payment_intent as string || `failed_${Date.now()}`,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: 'failed',
        },
      });

      // Update subscription status
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'past_due' },
      });
    }
  }

  /**
   * Get price ID for plan
   */
  private getPriceId(plan: 'basic' | 'pro' | 'enterprise'): string {
    const priceIds: Record<string, string> = {
      basic: process.env.STRIPE_BASIC_PLAN_PRICE_ID || 'price_basic',
      pro: process.env.STRIPE_PRO_PLAN_PRICE_ID || 'price_pro',
      enterprise: process.env.STRIPE_ENTERPRISE_PLAN_PRICE_ID || 'price_enterprise',
    };
    return priceIds[plan];
  }

  /**
   * Sync subscription statuses (scheduled job)
   */
  async syncSubscriptions(): Promise<void> {
    console.log('[Stripe] Syncing all subscriptions...');

    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: {
          in: ['active', 'trialing', 'past_due'],
        },
      },
    });

    for (const sub of subscriptions) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);

        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            status: stripeSub.status,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          },
        });
      } catch (error) {
        console.error(`Failed to sync subscription ${sub.id}:`, error);
      }
    }

    console.log(`[Stripe] Synced ${subscriptions.length} subscriptions`);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      // Test Stripe API connectivity
      await stripe.customers.list({ limit: 1 });

      // Test database connectivity
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
        details: {
          stripeApi: 'connected',
          database: 'connected',
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService();
