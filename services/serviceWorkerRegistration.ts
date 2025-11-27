/**
 * Registro del Service Worker para cachear imágenes
 * 
 * Este módulo registra el Service Worker que cachea las imágenes de la galería.
 * El Service Worker se registra automáticamente cuando la aplicación se carga.
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registrado correctamente:', registration.scope);
          
          // Verifica si hay una actualización del Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Hay una nueva versión del SW disponible
                  console.log('[SW] Nueva versión del Service Worker disponible');
                  // Opcional: mostrar notificación al usuario para recargar
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[SW] Error al registrar Service Worker:', error);
        });
    });
  } else {
    console.warn('[SW] Service Workers no están soportados en este navegador');
  }
}

/**
 * Desregistra el Service Worker (útil para desarrollo)
 */
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[SW] Service Worker desregistrado');
      })
      .catch((error) => {
        console.error('[SW] Error al desregistrar Service Worker:', error);
      });
  }
}

