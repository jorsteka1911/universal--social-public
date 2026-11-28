# Infraestructura portable de Gyste

Objetivo: reducir dependencia de proveedores sin interrumpir producción ni aumentar gastos sin autorización.

1. Mantener Git como formato de repositorio portable y conservar copias privadas verificadas.
2. Inventariar funciones específicas de Vercel y separar lógica de negocio de interfaces de alojamiento.
3. Mantener migraciones PostgreSQL y procedimientos de exportación y restauración de datos y objetos; proteger datos personales y secretos.
4. Preparar ejecución alternativa en servidor estándar, con HTTPS, control de acceso, actualizaciones y monitorización.
5. Mantener interfaces de IA intercambiables, ejecución local cuando resulte viable y licencias documentadas.
6. Probar restauración y funcionamiento en entorno aislado antes de cambiar producción o DNS.

Criterio de aceptación: restauración verificada, pruebas funcionales y de seguridad superadas, presupuesto autorizado y plan de reversión.

Estado: requisitos documentados; ninguna migración ejecutada. Mantener proveedores actuales hasta verificar alternativas.
