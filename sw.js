// SILESCO Service Worker — Push Notifications
self.addEventListener('push', function(event) {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch(e) {
    data = { title: 'SILESCO', body: event.data.text() };
  }
  const options = {
    body: data.body || '',
    tag: data.tag || 'silesco',
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'SILESCO', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
