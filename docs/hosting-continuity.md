# Gyste: continuidad del alojamiento
## Estado observado
- Vercel gyste-app: producción r76 READY según API; no equivale a prueba de sesión.
- El alias gyste2025 no figura en el equipo; su asignación fue rechazada por facturación (402).
- GitHub Pages: compilación exitosa, no se ha verificado funcionamiento en navegador.
## Compatibilidad pendiente
- index.html usa rutas absolutas para manifest, iconos, páginas informativas y registro del service worker.
- El manifest y sw.js asumen raíz del dominio. Un alojamiento bajo subruta requiere adaptar rutas y alcance.
- resetPasswordForEmail usa origin + pathname; comprobar allowlist de Supabase para cualquier nuevo origen. Verificar también confirmación de registro.
- /api/boletines-caribe requiere servidor; Pages no ejecuta esa función. Mantener degradación controlada o backend compatible.
- No cambiar base de datos, políticas ni dominios existentes durante la evaluación.
## Criterios antes de recomendar nuevo enlace
1. Abrir sin sesión y sin errores de recursos.
2. Registrar e iniciar sesión con cuenta de prueba; recuperación de contraseña.
3. Dos cuentas de prueba: publicación, privacidad, comentario, mensaje y borrado.
4. Instalar PWA, probar desconexión y reconexión.
5. Verificar enlaces compartidos y boletines.
6. Confirmar coste y condiciones comerciales del alojamiento antes de migrar.
No se declara migración completada ni se autoriza gasto.
