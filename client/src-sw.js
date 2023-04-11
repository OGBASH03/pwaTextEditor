const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

//THIS IS PAGE CACHE
// THIS CODE DEFINES A CACHE-FIRST STRATEGY FOR PAGES AND SETS AN EXPIRATION POLICY TO 30 DAYS
const pageCache = new CacheFirst({
  // IT USES THE CACHE NAME 'page-cache' AND INCLUDES PLUGINS TO CACHE RESPONSES WITH STATUS CODES 0 AND 200
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    // AND SETS AN EXPIRATION POLICY OF 30 DAYS USING THE ExpirationPlugin PLUGIN
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);
//THIS IS ASSET CACHE
//THIS FUNCTION FILTERS REQUESTS THAT HAVE A DESTINATION OF 'STYLE', 'SCRIPT', OR 'WORKER'
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  //THIS CACHING STRATEGY USES THE STALE-WHILE-REVALIDATE STRATEGY
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    //THIS CACHEABLE RESPONSE PLUGIN ENSURES THAT RESPONSES WITH STATUSES 0 AND 200 WILL BE CACHED
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute();
