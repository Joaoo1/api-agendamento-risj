export default {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.2,
  maxBreadcrumbs: 50,
};
