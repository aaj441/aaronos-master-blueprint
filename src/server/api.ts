/**
 * API Server Handler
 * Handles tRPC API requests and Stripe webhooks
 */

import { eventHandler, toWebRequest, setResponseStatus, setHeader, readBody } from 'vinxi/http';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './router';
import { stripeService } from '../lib/stripe';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export default eventHandler(async (event) => {
  const request = toWebRequest(event);
  const url = new URL(request.url);

  // Handle Stripe webhooks
  if (url.pathname === '/api/webhooks/stripe' && request.method === 'POST') {
    try {
      const body = await readBody(event);
      const signature = request.headers.get('stripe-signature');

      if (!signature) {
        setResponseStatus(event, 400);
        return { error: 'Missing signature' };
      }

      const stripeEvent = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      await stripeService.handleWebhook(stripeEvent);

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      setResponseStatus(event, 400);
      return { error: 'Webhook error' };
    }
  }

  // Handle tRPC requests
  if (url.pathname.startsWith('/api/trpc')) {
    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req: request,
      router: appRouter,
      createContext: () => ({}),
      onError: ({ error, path }) => {
        console.error(`tRPC Error on ${path}:`, error);
      },
    });
  }

  // Health check endpoint
  if (url.pathname === '/api/health') {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  setResponseStatus(event, 404);
  return { error: 'Not found' };
});
