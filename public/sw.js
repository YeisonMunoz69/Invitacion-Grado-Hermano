/**
 * Service Worker para cachear imágenes de la galería
 * 
 * ESTRATEGIA DE CACHE:
 * - Cache-First: Las imágenes se sirven desde cache si están disponibles
 * - Si no están en cache, se descargan de la red y se guardan en cache
 * - Las imágenes se cachean indefinidamente (max-age=31536000 desde el servidor)
 * 
 * CONFIGURACIÓN DE HEADERS EN SUPABASE:
 * Para configurar los headers de cache en Supabase Storage:
 * 1. Ve a tu proyecto en Supabase Dashboard
 * 2. Storage > Policies > Crea una política para el bucket 'fotos'
 * 3. O usa la API de Supabase para configurar los headers:
 *    - Cache-Control: public, max-age=31536000, immutable
 *    - ETag: se genera automáticamente por Supabase
 * 
 * NOTA: Los headers se configuran en el servidor (Supabase), no en el Service Worker.
 * El Service Worker solo maneja el cache local del navegador.
 */

const CACHE_NAME = 'galeria-fotos-v1';
const IMAGE_URLS = [
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/1.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/2.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/3.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/4.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/5.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/6.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/7.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/8.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/9.webp',
  'https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/10.webp',
];

// Instalación del Service Worker
// Pre-cachea todas las imágenes al instalar el SW
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-cacheando imágenes...');
        // Pre-cachea las imágenes en segundo plano (no bloquea la instalación)
        return Promise.allSettled(
          IMAGE_URLS.map((url) =>
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch((err) => {
                console.warn(`[SW] Error cacheando ${url}:`, err);
              })
          )
        );
      })
      .then(() => {
        console.log('[SW] Service Worker instalado correctamente');
        // Fuerza la activación inmediata del nuevo SW
        return self.skipWaiting();
      })
  );
});

// Activación del Service Worker
// Limpia caches antiguos al activar
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log(`[SW] Eliminando cache antiguo: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activado');
        // Toma control de todas las páginas inmediatamente
        return self.clients.claim();
      })
  );
});

// Intercepta las requests de imágenes
// Estrategia: Cache-First con fallback a red
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Solo intercepta requests de imágenes de Supabase
  if (url.hostname === 'eceokylztrtzfdjsyikh.supabase.co' && 
      url.pathname.includes('/fotos/') && 
      url.pathname.endsWith('.webp')) {
    
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Si está en cache, devuelve la versión cacheada
          if (cachedResponse) {
            console.log(`[SW] Sirviendo desde cache: ${url.pathname}`);
            return cachedResponse;
          }
          
          // Si no está en cache, descarga de la red
          console.log(`[SW] Descargando de la red: ${url.pathname}`);
          return fetch(event.request)
            .then((response) => {
              // Verifica que la respuesta sea válida
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clona la respuesta porque solo se puede leer una vez
              const responseToCache = response.clone();
              
              // Guarda en cache para futuras requests
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                  console.log(`[SW] Imagen guardada en cache: ${url.pathname}`);
                });
              
              return response;
            })
            .catch((error) => {
              console.error(`[SW] Error al descargar ${url.pathname}:`, error);
              // Puedes devolver una imagen placeholder aquí si lo deseas
              throw error;
            });
        })
    );
  }
  // Para otras requests, usa la estrategia por defecto (red)
});

