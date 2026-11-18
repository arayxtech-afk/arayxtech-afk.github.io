/* ARAYX Kâr Paneli bildirim çalışanı: yalnız bildirim gösterir, sayfa trafiğine karışmaz (fetch dinlemez). */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try {
    d = e.data ? e.data.json() : {};
  } catch (x) {
    d = { govde: e.data ? e.data.text() : "" };
  }
  e.waitUntil(
    self.registration.showNotification(d.baslik || "ARAYX Kâr Paneli", {
      body: d.govde || "Yeni sipariş var.",
      icon: "kar-ikon-192.png",
      badge: "kar-ikon-192.png",
      tag: d.etiket || undefined,
      data: { url: d.url || "kar.html" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const hedef = new URL((e.notification.data && e.notification.data.url) || "kar.html", self.registration.scope).href;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((liste) => {
      for (const c of liste) if (c.url.includes("kar.html") && "focus" in c) return c.focus();
      return self.clients.openWindow(hedef);
    })
  );
});
