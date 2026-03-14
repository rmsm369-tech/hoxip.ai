const CACHE_NAME = "hoxchat-v1";

// 1. Install: Skip the strict 'addAll' pre-caching entirely to prevent 404 crashes
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Forces the SW to activate immediately
});

// 2. Activate: Take control of the app instantly
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// 3. Fetch: "Stale-While-Revalidate" Strategy (Gets PWABuilder points!)
self.addEventListener("fetch", (event) => {
  // Only cache standard GET requests (ignore Supabase POST requests, etc.)
  if (event.request.method !== "GET" || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Fetch the newest version from the network
     const fetchPromise = fetch(event.request).then((networkResponse) => {
  if (networkResponse && networkResponse.ok) {
    const responseClone = networkResponse.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(event.request, responseClone);
    });
  }
  return networkResponse;
}).catch(() => {
  console.log("App is currently offline.");
    // Optionally, you could return a fallback page here if you have one cached                                                                                                                                                                 
        return networkResponse;
      }).catch((error) => {
        console.log("App is currently offline.");
      });

      // Instantly return the cached version if we have it, otherwise wait for the network
      return cachedResponse || fetchPromise;
    })
  );
});


// Daily 5 PM notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  clients.openWindow('/hoxip.ai/index.html');
});