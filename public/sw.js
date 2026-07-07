// Minimal no-op service worker: exists only so Chrome/Android will treat this
// site as installable. It intentionally does no caching (that's a later,
// deliberate addition, not something to grow here incrementally).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // No-op: let the browser handle the request normally.
});
