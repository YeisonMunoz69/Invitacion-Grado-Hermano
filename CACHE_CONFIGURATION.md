# Configuración de Cache para Imágenes de la Galería

Este documento explica cómo configurar el cache de imágenes para optimizar la carga de la galería.

## Estrategia de Cache Implementada

### 1. Cache del Navegador (Service Worker)
- **Ubicación**: `public/sw.js`
- **Estrategia**: Cache-First
- **Funcionamiento**: 
  - Las imágenes se descargan una vez y se guardan en el Cache API del navegador
  - En recargas posteriores, las imágenes se sirven desde el cache local
  - Si una imagen no está en cache, se descarga de la red y se guarda para futuras visitas

### 2. Headers HTTP del Servidor (Supabase Storage)
- **Ubicación**: Configuración en Supabase Dashboard o API
- **Headers requeridos**:
  - `Cache-Control: public, max-age=31536000, immutable`
  - `ETag`: Generado automáticamente por Supabase
  - `Last-Modified`: Generado automáticamente por Supabase

## Configuración de Headers en Supabase

### Opción 1: Usando Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Storage** > **Buckets**
3. Selecciona el bucket `fotos`
4. Ve a **Settings** o **Policies**
5. Configura los headers de cache para el bucket

### Opción 2: Usando la API de Supabase

Puedes configurar los headers usando la API REST de Supabase o el SDK. Aquí hay un ejemplo usando el SDK de JavaScript:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eceokylztrtzfdjsyikh.supabase.co',
  'TU_SUPABASE_ANON_KEY'
);

// Nota: La configuración de headers de cache generalmente se hace a nivel de bucket
// o usando políticas de Storage. Consulta la documentación de Supabase Storage
// para la versión específica de tu proyecto.
```

### Opción 3: Usando Supabase CLI

```bash
# Instala Supabase CLI si no lo tienes
npm install -g supabase

# Configura los headers del bucket
supabase storage update bucket fotos --public true
```

### Headers Específicos a Configurar

Para cada objeto en el bucket `fotos`, los headers deben ser:

```
Cache-Control: public, max-age=31536000, immutable
```

**Explicación de los headers:**
- `public`: Indica que la respuesta puede ser cacheada por cualquier cache (navegador, CDN, etc.)
- `max-age=31536000`: Cache válido por 1 año (31536000 segundos)
- `immutable`: Indica que el recurso nunca cambiará, permitiendo cache agresivo

## Verificación de Headers

Puedes verificar que los headers estén configurados correctamente usando:

### En el navegador (DevTools):
1. Abre las DevTools (F12)
2. Ve a la pestaña **Network**
3. Recarga la página
4. Haz clic en una imagen (ej: `1.webp`)
5. Verifica en **Headers** que aparezca:
   - `Cache-Control: public, max-age=31536000, immutable`
   - `ETag` (opcional pero recomendado)

### Usando curl:
```bash
curl -I https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/1.webp
```

Deberías ver algo como:
```
HTTP/2 200
cache-control: public, max-age=31536000, immutable
etag: "abc123..."
content-type: image/webp
```

## Optimizaciones Implementadas en el Frontend

### 1. Atributos de Imagen (`components/Gallery.tsx`)
- `loading="lazy"`: Carga diferida de imágenes fuera del viewport
- `decoding="async"`: Decodificación asíncrona para no bloquear el render

### 2. Service Worker (`public/sw.js`)
- Pre-cachea todas las imágenes al instalar
- Intercepta requests de imágenes y las sirve desde cache
- Descarga y cachea automáticamente imágenes nuevas

### 3. Registro Automático (`services/serviceWorkerRegistration.ts`)
- Se registra automáticamente al cargar la aplicación
- Maneja actualizaciones del Service Worker

## Flujo de Cache Completo

1. **Primera visita**:
   - El Service Worker se instala
   - Las imágenes se descargan desde Supabase (con headers de cache)
   - Las imágenes se guardan en el Cache API del navegador
   - El navegador también cachea las imágenes según los headers HTTP

2. **Visitas posteriores**:
   - El Service Worker intercepta las requests de imágenes
   - Sirve las imágenes desde el Cache API (más rápido)
   - Si no están en cache del SW, el navegador las sirve desde su cache HTTP
   - Solo si no están en ningún cache, se descargan de la red

## Troubleshooting

### Las imágenes no se cachean
1. Verifica que el Service Worker esté registrado (DevTools > Application > Service Workers)
2. Verifica que los headers estén configurados en Supabase
3. Revisa la consola del navegador para errores del SW

### El Service Worker no se registra
1. Asegúrate de que estés sirviendo la aplicación desde HTTPS (o localhost)
2. Verifica que el archivo `sw.js` esté en la carpeta `public/`
3. Revisa la consola del navegador para errores

### Las imágenes se descargan en cada recarga
1. Verifica los headers HTTP en la pestaña Network
2. Asegúrate de que `Cache-Control` esté configurado correctamente
3. Verifica que el Service Worker esté activo y funcionando

## Notas Importantes

- **HTTPS requerido**: Los Service Workers solo funcionan en HTTPS (o localhost en desarrollo)
- **Actualización de imágenes**: Si actualizas una imagen, cambia el nombre del archivo o actualiza la versión del cache en `sw.js` (CACHE_NAME)
- **Tamaño de cache**: El navegador puede eliminar el cache si se queda sin espacio. El Service Worker maneja esto automáticamente.

## Referencias

- [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN: Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Web.dev: HTTP Caching](https://web.dev/http-cache/)

