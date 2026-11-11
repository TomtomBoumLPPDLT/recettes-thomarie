// Mode hors ligne : tout le nécessaire est mis en cache à la première ouverture.
// Pour publier une nouvelle version de l'application, changer VERSION.
const VERSION = "2026-11-07-1";
const CACHE = "thomarie-" + VERSION;
const FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png", "./icons/favicon-64.png",
  "./fonts/Lora-Regular.woff", "./fonts/Lora-Bold.woff", "./fonts/Lora-Italic.woff"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("thomarie-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(c => c || fetch(r).then(rep => { if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(k => k.put(r, copie)); } return rep; }).catch(() => caches.match("./index.html"))));
});
