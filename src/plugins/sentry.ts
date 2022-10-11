import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { SentryLink } from 'apollo-link-sentry';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0
  });
}

export const apolloLink = new SentryLink();
