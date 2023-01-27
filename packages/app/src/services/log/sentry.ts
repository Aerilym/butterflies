import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://4421819c1603443d845687a1a44ff738@o4504506343227392.ingest.sentry.io/4504506362036224',
  release: 'dev',
  enableInExpoDevelopment: false,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

export { Sentry };
