# GYSTE — control de lanzamiento r38
Fecha: 2026-11-26. Base pública inspeccionada: r27. Rama de pruebas: beta-r28-startup-security. r37 corresponde a archivos candidatos de servidor, no a una interfaz activa. La vista previa comparte Supabase de producción: no usar datos privados ni ejecutar operaciones destructivas. Este registro consolida el resumen de auditorías y las observaciones disponibles; no es una transcripción de Gemini, DeepSeek o Vercel Agent.
## P0: puertas obligatorias antes del piloto público
- [ ] Verificar copia de seguridad y restauración en entorno aislado. No contratar una rama de pago sin aprobación.
- [ ] Invitación real en Auth: probar invitado adulto, rechazo de registro directo/no invitado, acceso y recuperación existentes, expiración y reuso; revisar si Auth es compartida con otros proyectos. La UI r31 no impone bloqueo de servidor.
- [ ] Audiencia atómica r31: probar SQL candidato y API con tres cuentas sintéticas y anon; selected/except, fallo transaccional, reintento, archivos firmados. Activar solo tras prueba. No declarar resuelto por el despliegue Vercel.
- [ ] Eliminación integral: r32 consulta de solicitudes y controles desactivados; definir operador, canal de privacidad, revocación de sesiones, almacenamiento y retención, verificar residuos. No borrar datos reales como prueba.
- [ ] Moderación humana, denuncias, bloqueos y privacidad; responsables y tiempos de respuesta. Menores: no ampliar piloto hasta medidas específicas, evaluación y revisión legal.
- [ ] Revisar RLS con cuentas A/B/anon, buckets públicos/privados, acceso a archivos y expiración de enlaces. Confirmar cabeceras HTTP reales; CSP en modo informe antes de endurecer.
- [ ] Completar privacidad, condiciones, identidad/contacto del responsable, proveedores, bases legales, retención y derechos. No atribuir cumplimiento legal sin revisión.
## P1: calidad y regresión
- [ ] Android y iPhone: arranque, sesión, registro autorizado, restablecer contraseña, perfil/portada y menú de tres puntos (scroll interno).
- [ ] Mensajes y fotos: enviar/recibir, no desaparecer sin confirmación, reintentos, cancelación, pérdida de conexión al 10/50/95%, reabrir navegador, no duplicar ni cruzar cuentas. Revisar salida con pendientes.
- [ ] Feed: texto, fotos, vídeo, Reels, reacciones, guardar, comentarios, eliminar, seguir, público/privado; no perder funciones existentes. Probar contenido sintético propio.
- [ ] Bandeja: 200 mensajes de una persona + contacto antiguo, paginación, fechas con microsegundos, contadores parciales, permisos. r38 corrige orden local y limita perfiles a grupos de 50; no equivale a prueba contra Supabase.
- [ ] Rendimiento: medir apertura y navegación reales, red lenta, consultas chat, datos por sesión, modo texto, vídeos bajo demanda, recuperación de reproducción; evitar auto cache de contenido privado. Revisar paginación feed e índices después de medir.
- [ ] Herramientas IA: bromas y códigos de juegos, contraseñas y OTP, falso positivo, avisos no punitivos; traducción cancelable y expiración, botones táctiles. Google «Analizando» en foto de perfil sigue sin reproducirse; obtener captura sin datos privados y comprobar si es función del SO/navegador.
- [ ] Accesibilidad: lector de pantalla, contraste, tamaño, foco, descripciones/transcripción manual. Subtítulos sincronizados automáticos aún pendientes.
## P2: IA generativa controlada
- [ ] r37: SQL de cuotas y endpoint candidatos; validar modelo, precios, privacidad/DPA, límites reales, concurrencia, seguridad, cero reintentos automáticos, apagado; probar primero sin llamadas al proveedor. No habilitar ni incurrir en gastos por defecto.
- [ ] Integrar revisión manual de guion con consentimiento explícito; sin analizar conversaciones/fotos privadas en nube. Imágenes, vídeo generativo, subtítulos automáticos y asistente general después del piloto.
## Puerta de publicación
- [ ] Evidencia de cada prueba (fecha, versión, dispositivo, resultado), corregir fallos y repetir. Vercel success significa despliegue, no prueba funcional.
- [ ] Promover solo cambios validados, con rollback a r27 disponible. No lanzar masivamente ni anunciar Google Play hasta superar requisitos y pruebas correspondientes.
