// Cache Name
const cacheName = 'phone_v1_3'

const cacheAssets = [
  '/#{shopInfoBean.versionPath}static/build/css/page-phone.min.css',
  '/#{shopInfoBean.versionPath}static/build/js/ux-phone.min.js',
  '/#{shopInfoBean.versionPath}static/build/sprites/sprite-2x.png',
  '/#{shopInfoBean.versionPath}assets/build/svg/map-payments.svg',
  '/#{shopInfoBean.versionPath}assets/img/logo/palitlig-service.png',
  '/#{shopInfoBean.versionPath}assets/img/logo/bast-i-test.png',
  '/#{shopInfoBean.versionPath}assets/img/backgrounds/bestcanvas-se-trustpilot.svg',
  '/#{shopInfoBean.versionPath}assets/build/svg/map-page.svg'
];

// Call Install Event
// no-cors for fetching a resource from a third party URL
//   cache.addAll(cacheAssets.map(function(cacheAssets) {
//     return new Request(cacheAssets, { mode: 'no-cors' });
// }))

self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});


