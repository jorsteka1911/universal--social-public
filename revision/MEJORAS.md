# Mejoras de usuarios v1 — revisión, no producción
- 12 recursos seleccionados por título y descripción de la fuente, 3 vídeos individuales con reproductor opt-in y enlace alternativo. No se ha reproducido cada vídeo ni verificado el permiso de incrustación. El resto son guías, canales y páginas con vídeos.
- Lista de reacciones limitada al autor de la publicación, hasta 100 nombres. Requiere revisar y aplicar el SQL y probar con cuentas separadas.
- Chat multimedia: aún no implementado. Primero ejecutar consulta de auditoría de solo lectura; después diseñar bucket privado y políticas de remitente/destinatario, prueba de terceros, bloqueo, límites y limpieza de archivos huérfanos.
- No fusionar main antes de probar navegación, carga de vídeos, likes, cuentas y permisos en entorno aislado. Vercel puede generar una vista previa de esta rama; no es aprobación para publicar.
