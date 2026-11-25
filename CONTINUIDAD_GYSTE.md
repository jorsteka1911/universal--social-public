# GYSTE — continuidad del proyecto

Actualización: 25 de noviembre de 2026.
Aplicación web: https://gyste2025.vercel.app
Repositorio: jorsteka1911/universal--social-public
Archivo principal: index.html. Despliegue mediante Vercel; datos mediante Supabase.

## Propósito
Red social que reúne comunidad, aprendizaje, creatividad, cultura, entretenimiento y comercio. Mantener acceso básico gratuito y estudiar monetización sostenible cuando haya usuarios activos. Evitar gastos adicionales hasta contar con ingresos.

## Estado técnico
Última revisión publicada confirmada: commit d68eeeea2df417dd08e1e25103fc7ac700af6bf7. La siguiente revisión añade controles de eliminación y tratamiento de fallos de limpieza de medios. Las comprobaciones aisladas no sustituyen una prueba real en Android.

Implementado en código: registro, sesión persistente, recuperación de contraseña, feed, fotos y vídeos, reacciones, comentarios, seguimiento, guardados, republicaciones, envío de publicaciones públicas, privacidad de audiencia, bloqueo, denuncias, mensajes privados con archivos y voz, historias temporales, academia audiovisual con un solo reproductor activo, rutas de aprendizaje, espacios, historia documental, Frutinovelas, directorio comercial moderado, fondos locales personalizados y manifiesto web instalable.
Implementación no equivale a prueba integral. No afirmar seguridad absoluta, cifrado de extremo a extremo, instalación Android comprobada ni aprobación de Google Play.

## Prioridades de lanzamiento
1. Verificar sesión, registro y recuperación en Android; realizar pruebas entre dos cuentas autorizadas.
2. Probar RLS, bloqueos, audiencias privadas, acceso a archivos y caducidad de historias. Automatizar limpieza de archivos caducados.
3. Confirmar la identidad de la cuenta propietaria antes de asignar moderador; probar denuncias, ocultación y restauración. Los archivos públicos antiguos pueden seguir accesibles por URL directa.
4. Reforzar seguridad de adolescentes, controles de contacto, privacidad de imágenes y etiquetas. No promocionar entre menores hasta completar controles y revisión de seguridad.
5. Completar eliminación de cuenta, normas, privacidad, licencias de contenidos y requisitos legales.
6. Validar vídeos educativos y ampliar contenidos sin copiar obras ajenas.
7. Probar instalación web; preparar paquete Android firmado y verificar requisitos vigentes de Google Play.
8. Estudiar publicidad contextual, suscripciones opcionales y promoción comercial. No hay pagos activos ni garantía de ingresos.

## Cómo retomar
Abrir este repositorio con la misma cuenta de GitHub desde cualquier dispositivo. Revisar el historial de commits, descargar una copia y comprobar despliegues en Vercel. Acceder al proyecto correspondiente en Supabase con la cuenta autorizada. No guardar contraseñas, secretos, datos de usuarios ni conversaciones privadas en este repositorio público. Mantener copias de seguridad privadas de la base de datos y archivos conforme a sus permisos. Esta nota es un resumen técnico y no sustituye esas copias.

## Método
Modificar de forma incremental, conservar funciones existentes, validar sintaxis, comprobar despliegue, probar en navegador y documentar limitaciones. No introducir gastos sin autorización.

## Avances recientes y criterios de salida de beta
- Incorporados: estudio creativo con edición local de vídeos, música y voz; catálogo público de proyectos; promociones comerciales orientativas sin cobros; ayuda para instalación antes de iniciar sesión; filtros de perfil y vídeos; notificaciones con lectura manual; defensas contra solicitudes duplicadas y respuestas tardías; optimizaciones de consultas en paralelo.
- Despliegue confirmado para la revisión de notificaciones. Rendimiento real en Android todavía sin medir. El acceso firmado y las políticas de privacidad necesitan pruebas entre cuentas.
- Antes de abrir el lanzamiento público: comprobar registro, recuperación y sesión; publicación privada de texto, foto y vídeo; reacciones, comentarios y guardados; envío de voz y archivos entre dos cuentas autorizadas; bloqueo y denuncias; eliminación de publicación y sus archivos; moderador autorizado; eliminación de cuenta; privacidad definitiva y revisión de licencias. Registrar resultado real y evidencia sin datos personales.
- Sin cobros activos. Las aplicaciones independientes tendrán condiciones y costes propios; el lector de documentos original sigue pendiente de recuperación. JORDAYKAT CODE AI está en su propia rama de desarrollo. No presentar productos en preparación como disponibles en Google Play.
