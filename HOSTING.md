# Gyste — alojamiento alternativo

La aplicación principal es estática (index.html), con Supabase como backend. No se encontró package.json ni vercel.json en la raíz al revisar r32.

## Cloudflare Pages / Netlify
- Conectar el repositorio existente y seleccionar una rama de prueba.
- Sin framework ni comando de compilación para la aplicación estática. Publicar únicamente los archivos públicos necesarios; revisar el árbol antes de elegir el directorio de salida. No publicar documentación interna, pruebas, SQL ni secretos.
- Mantener Vercel y el dominio anterior hasta verificar el nuevo alojamiento.
- Añadir la URL HTTPS exacta de prueba a las redirecciones permitidas de Supabase Auth; no eliminar las existentes. Revisar Site URL antes del cambio definitivo.
- No cambiar la base de datos, Storage ni las políticas RLS para migrar el frontend.

## Verificación antes de cambiar de dominio
1. Abrir portada, manifest, iconos y service worker.
2. Probar registro, inicio de sesión, recuperación y cierre de sesión.
3. Probar publicaciones, fotos, vídeos, reels, chat y enlaces compartidos.
4. Probar conexión lenta y recuperación de transferencias. Los pendientes locales y sesiones dependen del origen: no asumir que migran automáticamente.
5. Verificar facturación, límites y términos comerciales del proveedor.
6. Mantener un procedimiento de reversión y no anunciar el nuevo enlace hasta completar las pruebas.

Estado: documentación preparatoria; no se ha creado ni desplegado un sitio alternativo.
