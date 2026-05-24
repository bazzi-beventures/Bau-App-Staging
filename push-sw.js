// Web-Push-Handler für den Service Worker.
// Wird vom generierten Workbox-SW via importScripts geladen
// (siehe vite.config.ts → workbox.importScripts).

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = {}
  }
  const title = data.title || 'Bau-App'
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag || 'bau-app',
    data: { url: data.url || '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Bereits offenes Fenster fokussieren statt ein neues zu öffnen.
        for (const client of windowClients) {
          if ('focus' in client) {
            client.focus()
            if ('navigate' in client) client.navigate(target)
            return
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(target)
      })
  )
})
