# Especificaciones Funcionales y de Módulos

## Roles de Usuario
| Rol | Permisos |
|-----|----------|
| `ADMIN` | Todo: productos, reportes, usuarios, configuración |
| `CAJERO` | POS, apertura/cierre de caja, consulta de stock |

La autenticación usa **JWT con duración de 12hs**. El token se envía como `Bearer` en el header `Authorization`.

## Factores de Entorno / Env Vars
Archivo: `backend/.env`
```env
DATABASE_URL="postgresql://mya_user:mya_pass123@localhost:5432/mya_db"
JWT_SECRET="mya_super_secret_key_2024"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

## Frontend — Estado y Detalle por Módulo

### POS.jsx ✅ Listo
Funcionalidades implementadas:
- Sidebar oscura fija con navegación entre módulos
- Captura del lector de barras via `keydown` global con buffer y debounce 150ms
- Indicador visual "Scanner listo / Leyendo..."
- Búsqueda manual y productos frecuentes
- Carrito con lógica completa
- Descuento manual y Modal de pago
- Integrado con APIs (Mock items removidos).

### AuthContext.jsx ✅ Listo
Context global de React que proveerá:
- `token` — JWT para los headers de cada request
- `usuario` — `{ id, nombre, email, rol }`
- `cajaActiva` — ID de la caja abierta
- `login(email, password)` — fetch a `/auth/login`, guarda token
- `logout()` — limpia estado y redirige al login

### lib/api.js ✅ Listo
Cliente fetch centralizado.

### Login.jsx ✅ Listo
- Formulario email + password
- Redirige al POS si ya hay sesión activa

### Stock.jsx ✅ Listo
- Panel superior con dos barras de navegación: "Vista de Inventario" y "Nuevo Ingreso".
- **Inventario:** Tabla de productos con su stock actual e indicadores gráficos (BAJO u OK). Filtro dual: nombre/código de barras y selector de categorías. Checkbox interactivo para ver solo stock faltante.
- **Ingreso de Mercadería:** Componente de alta que registra ingresos atados a "Proveedores" y número de factura. Buscador con "lista flotante" conectada a la base de datos para agregar productos al array de ingreso, calculando su precio unitario, y finalizando a través del endpoint `POST /stock/ingreso` protegido (`ADMIN`).

### CierreCaja.jsx ✅ Listo
- Pantalla interactiva para "Abrir Turno" con monto inicial.
- Panel de la caja activa con recuento de monto inicial, suma de ventas y total de tickets emitidos.
- Formulario flotante para registrar nuevos Movimientos de Caja manuales (Ingreso / Egreso).
- Panel de cierre que requiere especificar el Efectivo Físico real para calcular el esperado.
- Tarjeta de resultado remarcando la `Diferencia` ("CAJA CUADRADA", "SOBRANTE" o "FALTANTE").
### Reportes.jsx ✅ Listo
- Panel superior con selectores de fechas `Desde` y `Hasta`.
- Bloques resumen: Total de Ventas Netas, sumatoria de Descuentos, Tickets Emitidos, y conteo de alertas de Stock Bajo.
- Gráfico dinámico de "Evolución de Recaudación Diaria" utilizando la librería `recharts` (`<AreaChart>`).
- Dos listados secundarios para la vista detallada del día: desglose de ventas por método de pago y tabla con los últimos 10 tickets emitidos registrados para cruzar montos fácil.

### Productos.jsx ✅ Listo (solo ADMIN)
- Listado general de productos con filtrado doble (Búsqueda textual + Select de Categorías).
- Funcionalidad CRUD expuesta a través de modales.
- Nuevo Producto / Editar Producto con campos dinámicos: nombre, código de barras, categoría, precio final, stock físico y mínimo.
- Botón de Borrar ejecutando eliminación lógica (activo = false).

## Flujos de Trabajo

### Flujo POS
1. Cajero inicia sesión → JWT guardado en AuthContext
2. App verifica caja abierta
   └── Si no hay caja → modal "Abrir caja"
3. Por cada producto escaneado:
   a. Lector dispara eventos keydown → buffer acumula → Enter confirma
   b. GET `/productos/barras/:codigo`
   c. Producto se agrega al carrito
4. Confirmar venta:
   → POST `/ventas`
   → Backend descuenta stock
   → Frontend muestra ticket
5. Cierre de turno:
   → Cajero cuenta el efectivo físico
   → POST `/caja/:id/cerrar`

### Flujo Ingreso de Stock
1. Admin accede a módulo Stock → Nuevo Ingreso
2. Selecciona proveedor (opcional), ingresa número de remito
3. Escanea o busca cada producto, ingresa cantidad y precio de compra
4. Confirma → POST `/stock/ingreso`
   → Backend suma stock

## Lector de Barras — Implementación
Usa un `useEffect` escuchando `keydown` en `POS.jsx`.
Acumula 150ms o hasta detectar "Enter", evalúa si la longitud del buffer es suficiente, e invoca al buscador por código.

## Estado Actual del Proyecto y Próximos Pasos

### Backend
Completado en su totalidad (rutas, auth, prisma en `6.6.0`, seed, db corriendo via docker-compose).

### Frontend
- Listo: POS, navegación básica, AuthContext, api.js, Login, CierreCaja, Stock, ABM Productos, Reportes
- Pendientes: ¡Ninguno! Implementación Frontend finalizada al 100%.

## Errores Conocidos y Soluciones
| Error | Solución |
|-------|----------|
| `datasource property url is no longer supported` | Bajar a Prisma 6 (`@prisma/client@^6`). Eliminar `prisma.config.ts`. |
