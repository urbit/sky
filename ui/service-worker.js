const CACHE_NAME = "athens-cache-v1"
const assetsToCache = [
  "/index.html",
  "./src/main.tsx",
  "./src/App.tsx",
  "./src/App.css",
  "./src/style/hollow.css",
  "./src/style/spine.css",
  "./src/style/feather.css",
  "./src/style/wind.css"
]

// Install the service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache)
    })
  )
})

// Intercept fetch requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

// Activate and clean up old caches
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
