# PRD — MyA Sistema de Gestión para Minimercados

| Campo | Detalle |
|-------|---------|
| **Versión** | 1.0 |
| **Fecha** | Marzo 2026 |
| **Estado** | Aprobado para Desarrollo |
| **Owner** | — |
| **Tipo** | MVP + Roadmap |

---

## 1. Resumen Ejecutivo

**MyA** es un sistema integral de gestión para minimercados locales que busca digitalizar las operaciones diarias del negocio: punto de venta, control de inventario, cierre de caja y generación de reportes. El objetivo principal es optimizar el tiempo de atención en caja, reducir errores de stock y proporcionar visibilidad financiera al propietario.

El sistema está diseñado para correr en una única PC dentro del local, con una interfaz simple y rápida para el cajero y funcionalidades administrativas para el dueño.

---

## 2. Objetivos del Negocio

### 2.1 Objetivos Estratégicos

- **Reducir tiempo de atención en caja** mediante escaneo rápido de productos
- **Evitar faltantes de stock** con alertas automáticas de reposición
- **Garantizar integridad del efectivo** con conciliación de caja al cierre de cada turno
- **Tomar decisiones basadas en datos** a través de reportes de ventas y tendencias

### 2.2 KPIs Iniciales

| Métrica | Meta |
|---------|------|
| Tiempo promedio de venta | < 30 segundos |
| Tickets por hora (punta) | ≥ 40 |
| Alertas de stock bajo resueltas en 24h | ≥ 80% |
| Diferencia promedio de caja | ≤ 1% del total |

---

## 3. Alcance del Producto

### 3.1 Funcionalidades Incluidas (MVP)

| Módulo | Descripción |
|--------|-------------|
| **POS** | Punto de venta con lector de código de barras, búsqueda manual, carrito, descuentos y múltiples métodos de pago |
| **Gestión de Productos** | CRUD de productos, categorías y proveedores |
| **Control de Stock** | Vista de inventario con alertas de stock bajo, registro de ingresos de mercadería |
| **Gestión de Caja** | Apertura/cierre de turnos, movimientos manuales (ingreso/egreso), cálculo de diferencia |
| **Reportes** | Ventas del día, evolución diaria, balance por período, ventas por categoría |
| **Autenticación** | Login con JWT, roles ADMIN y CAJERO |

### 3.2 Funcionalidades Excluidas (Fase 1)

- Facturación electrónica / comprobantes AFIP
- Gestión de proveedores avanzada (órdenes de compra)
- Módulo de clientes / fidelización
- Multi-localidad
- App móvil
- Integración con sistemas externos (ERP, bancarios)

---

## 4. Stakeholders

| Rol | Responsabilidad |
|-----|-----------------|
| **Dueño del minimercado** | Usuario ADMIN. Gestiona productos, reportes y configuración |
| **Cajero** | Usuario CAJERO. Opera el POS, maneja apertura/cierre de caja |
| **Desarrollador** | Implementación y mantenimiento del sistema |

---

## 5. Requisitos Funcionales

### 5.1 Autenticación y Usuarios

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-AUTH-01 | El sistema debe permitir iniciar sesión con email y contraseña | Mandatory |
| RF-AUTH-02 | El sistema debe gestionar dos roles: ADMIN y CAJERO | Mandatory |
| RF-AUTH-03 | El token JWT debe tener duración de 12 horas | Mandatory |
| RF-AUTH-04 | Solo ADMIN puede crear nuevos usuarios | Mandatory |

### 5.2 Punto de Venta (POS)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-POS-01 | El cajero debe poder buscar productos por código de barras escaneado | Mandatory |
| RF-POS-02 | El sistema debe mostrar indicador visual cuando el scanner está activo | Mandatory |
| RF-POS-03 | El cajero debe poder buscar productos manualmente por nombre o código | Mandatory |
| RF-POS-04 | El sistema debe mostrar productos frecuentes para acceso rápido | Mandatory |
| RF-POS-05 | El cajero debe poder agregar/remover items del carrito | Mandatory |
| RF-POS-06 | El cajero debe poder aplicar descuentos manuales (%) a la venta | Mandatory |
| RF-POS-07 | El sistema debe registrar el método de pago utilizado | Mandatory |
| RF-POS-08 | El sistema debe calcular automáticamente el cambio a devolver | Mandatory |
| RF-POS-09 | El sistema debe descontar stock al confirmar la venta | Mandatory |
| RF-POS-10 | El sistema debe emitir un ticket con el detalle de la venta | Mandatory |
| RF-POS-11 | El cajero debe poder anular una venta y reponer el stock | Mandatory |

### 5.3 Gestión de Productos

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-PROD-01 | ADMIN debe poder crear productos con: nombre, código de barras, categoría, precio, stock, stock mínimo | Mandatory |
| RF-PROD-02 | ADMIN debe poder editar todos los campos de un producto | Mandatory |
| RF-PROD-03 | ADMIN debe poder eliminar productos (baja lógica) | Mandatory |
| RF-PROD-04 | El sistema debe permitir filtrar productos por nombre o código | Mandatory |
| RF-PROD-05 | El sistema debe permitir filtrar productos por categoría | Mandatory |
| RF-PROD-06 | El sistema debe listar productos con stock bajo (≤ stock mínimo) | Mandatory |

### 5.4 Gestión de Stock

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-STOCK-01 | ADMIN debe poder registrar ingresos de mercadería | Mandatory |
| RF-STOCK-02 | El ingreso debe estar asociado a un proveedor (opcional) | Mandatory |
| RF-STOCK-03 | El ingreso debe registrar número de remito/factura | Mandatory |
| RF-STOCK-04 | El ingreso debe permitir agregar múltiples productos con cantidad y precio de compra | Mandatory |
| RF-STOCK-05 | El sistema debe incrementar el stock al confirmar el ingreso | Mandatory |
| RF-STOCK-06 | El sistema debe mostrar alertas visuales para productos con stock bajo | Mandatory |

### 5.5 Gestión de Caja

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-CAJ-01 | El sistema debe exigir abrir caja al iniciar turno | Mandatory |
| RF-CAJ-02 | El usuario debe registrar el monto inicial al abrir caja | Mandatory |
| RF-CAJ-03 | El usuario debe poder registrar ingresos/egresos manuales durante el turno | Mandatory |
| RF-CAJ-04 | Al cerrar caja, el sistema debe calcular el monto esperado | Mandatory |
| RF-CAJ-05 | El usuario debe ingresar el monto físico real para calcular diferencia | Mandatory |
| RF-CAJ-06 | El sistema debe mostrar resultado: "Caja Cuadrada", "Sobrante" o "Faltante" | Mandatory |
| RF-CAJ-07 | El cierre debe incluir resumen de ventas por método de pago | Mandatory |

### 5.6 Reportes

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-REP-01 | El sistema debe mostrar total de ventas netas en un período | Mandatory |
| RF-REP-02 | El sistema debe mostrar suma de descuentos aplicados | Mandatory |
| RF-REP-03 | El sistema debe mostrar cantidad de tickets emitidos | Mandatory |
| RF-REP-04 | El sistema debe mostrar cantidad de alertas de stock bajo | Mandatory |
| RF-REP-05 | El sistema debe mostrar gráfico de evolución de recaudación diaria | Mandatory |
| RF-REP-06 | El sistema debe mostrar desglose de ventas por método de pago | Mandatory |
| RF-REP-07 | ADMIN debe poder ver los últimos 10 tickets del período | Mandatory |
| RF-REP-08 | ADMIN debe poder ver ventas agrupadas por categoría | Mandatory |

---

## 6. Requisitos No Funcionales

### 6.1 Performance

| Requisito | Criterio |
|-----------|----------|
| Tiempo de respuesta POS | ≤ 200ms para búsqueda de producto |
| Tiempo de carga inicial | ≤ 3 segundos |
| Concurrentes | 1-2 usuarios simultáneos |

### 6.2 Seguridad

| Requisito | Criterio |
|-----------|----------|
| Contraseñas | Hasheadas con bcrypt |
| Acceso a APIs | Solo con JWT válido |
| Roles | Rutas protegidas según rol |

### 6.3 Disponibilidad

| Requisito | Criterio |
|-----------|----------|
| Horario de operación | 8:00 a 22:00 (configurable) |
| Recuperación | Backup diario de la base de datos |
| Persistencia | PostgreSQL con transacciones para consistencia |

### 6.4 UX/UI

| Requisito | Criterio |
|-----------|----------|
| Tipografía | Sora (UI), DM Mono (números) |
| Paleta | Verde `#16A34A` como color de acento |
| Layout | Sidebar oscura fija + área de contenido clara |
| Accesibilidad | Contraste suficiente, texto legible |

---

## 7. Modelo de Datos

### 7.1 Entidades

```
usuarios            → operadores del sistema (ADMIN / CAJERO)
categorias          → clasificación de productos
proveedores         → empresas que abastecen el negocio
productos           → inventario con código de barras, precio y stock
cajas               → sesiones de caja (apertura → cierre)
movimientos_caja    → ingresos/egresos manuales dentro de una caja
ventas              → transacciones del POS
venta_items         → detalle línea a línea de cada venta
ingresos_stock      → compras / reposición de mercadería
ingreso_stock_items → detalle de cada reposición
```

### 7.2 Enums

| Enum | Valores |
|------|---------|
| Rol | ADMIN, CAJERO |
| EstadoCaja | ABIERTA, CERRADA |
| TipoMovimiento | INGRESO, EGRESO |
| MetodoPago | EFECTIVO, TARJETA_DEBITO, TARJETA_CREDITO, TRANSFERENCIA, QR |
| EstadoVenta | COMPLETADA, ANULADA, PENDIENTE |

---

## 8. Arquitectura

### 8.1 Stack Tecnológico

| Capa | Tecnología |
|------|-------------|
| Frontend | React + Vite |
| Estilos | CSS-in-JS inline |
| Backend | Node.js + Express |
| ORM | Prisma 6.6.0 |
| Base de datos | PostgreSQL 15 (Alpine) |
| Contenedores | Docker + Docker Compose |
| Auth | JWT + bcryptjs |

### 8.2 Estructura del Proyecto

```
MyA/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── server.js
│   │   ├── lib/prisma.js
│   │   ├── middlewares/auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── productos.js
│   │       ├── ventas.js
│   │       ├── caja.js
│   │       ├── reportes.js
│   │       ├── catalogos.js
│   │       └── stock.js
│   ├── docker-compose.yml
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── POS.jsx
    │   │   ├── Stock.jsx
    │   │   ├── CierreCaja.jsx
    │   │   ├── Reportes.jsx
    │   │   └── Productos.jsx
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── ModalPago.jsx
    │   │   └── TicketVenta.jsx
    │   └── lib/api.js
    └── package.json
```

---

## 9. API Reference

### 9.1 Endpoints Principales

| Módulo | Endpoint Clave |
|--------|----------------|
| Auth | `POST /auth/login`, `GET /auth/me` |
| Productos | `GET /productos/barras/:codigo` (POS) |
| Ventas | `POST /ventas`, `PUT /ventas/:id/anular` |
| Caja | `POST /caja/abrir`, `POST /caja/:id/cerrar` |
| Stock | `POST /stock/ingreso` |
| Reportes | `GET /reportes/balance`, `GET /reportes/ventas-hoy` |

> Ver documento completo en `docs/api.md`

---

## 10. Flujos de Usuario

### 10.1 Flujo de Venta (POS)

1. Cajero inicia sesión
2. Sistema verifica caja abierta → Si no existe, modal "Abrir caja"
3. Cajero escanea producto → Se busca por código de barras
4. Producto se agrega al carrito
5. Repetir paso 3-4 para más productos
6. Cajero aplica descuento si corresponde (opcional)
7. Cajero confirma → Modal de pago
8. Cajero ingresa monto recibido → Sistema calcula cambio
9. Sistema registra venta, descuenta stock, emite ticket
10. Fin de turno → Cerrar caja

### 10.2 Flujo de Ingreso de Stock

1. Admin accede a módulo Stock → Nuevo Ingreso
2. Selecciona proveedor (opcional), ingresa número de remito
3. Escanea o busca cada producto
4. Ingresa cantidad y precio de compra
5. Confirma → Backend suma stock
6. Fin del ingreso

### 10.3 Flujo de Cierre de Caja

1. Cajero accede a módulo Cierre de Caja
2. Sistema muestra: monto inicial, ventas del turno, total de tickets
3. Cajero registra movimientos manuales del día (si los hay)
4. Cajero ingresa monto físico en caja
5. Sistema calcula: monto esperado vs. real
6. Sistema muestra resultado: Cuadrada / Sobrante / Faltante

---

## 11. Estrategia de Deployment

### 11.1 Ambiente Local (MVP)

| Componente | Configuración |
|------------|---------------|
| Base de datos | PostgreSQL en Docker (localhost:5432) |
| Backend | Node.js en puerto 3001 |
| Frontend | Vite en puerto 5173 |
| Ejecución | Manual (npm run dev) |

### 11.2 Ambiente de Producción (Post-MVP)

| Componente | Recomendación |
|------------|----------------|
| Base de datos | PostgreSQL gestionado (RDS, Cloud SQL) o Docker en servidor |
| Backend | Node.js con PM2 o contenedor Docker |
| Frontend | Hosting estático (Vercel, Netlify) o Nginx |
| SSL | Certbot/Let's Encrypt |
| Backup | pg_dump diario + retención de 30 días |
| Monitoreo | Logs centralizados (opcional) |

### 11.3 Consideraciones de Escalabilidad

- El diseño actual soporta un solo local con 1-2 usuarios simultáneos
- Para multi-localidad futura: agregar campo `localId`, implementar API centralizada, considerar sincronización offline
- Para alto volumen: evaluar caché Redis, lectura de réplicas

---

## 12. Roadmap

### Fase 1: MVP (Estado: Desarrollo Completado)

- [x] Autenticación JWT con roles
- [x] POS con lector de barras
- [x] CRUD de productos, categorías, proveedores
- [x] Control de stock con alertas
- [x] Apertura/cierre de caja con conciliación
- [x] Reportes básicos

### Fase 2: Estabilidad y Operaciones (Q2 2026)

- [ ] Documentación de deployment
- [ ] Script de backup automático
- [ ] Logging estructurado
- [ ] Tests de integración críticos
- [ ] Panel de configuración (ADMIN)

### Fase 3: Funcionalidades Avanzadas (Q3-Q4 2026)

- [ ] Módulo de clientes (datos, historial de compras)
- [ ] Programa de fidelización/puntos
- [ ] Facturación electrónica (AFIP)
- [ ] Integración con proveedor de tarjetas
- [ ] App móvil para inventario (lector RFId)

### Fase 4: Crecimiento (2027+)

- [ ] Multi-localidad
- [ ] Sincronización en tiempo real
- [ ] Predicción de demanda (ML)
- [ ] Portal de proveedores (pedidos automáticos)

---

## 13. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Pérdida de datos por falla del equipo | Media | Alto | Backup automático diario a cloud storage |
| Tiempo de inactividad por actualización | Baja | Medio | Ventana de mantenimiento fuera de horario |
| Error de stock por falla en transacción | Baja | Alto | Transacciones Prisma con rollback |
| Acceso no autorizado | Baja | Alto | JWT + rotación de secretos |

---

## 14. Glosario

| Término | Definición |
|---------|------------|
| **POS** | Point of Sale — Punto de venta |
| **MVP** | Minimum Viable Product — Producto mínimo viable |
| **JWT** | JSON Web Token — Estándar para autenticación stateless |
| **CRUD** | Create, Read, Update, Delete — Operaciones básicas de datos |
| **Stock Bajo** | Stock actual ≤ stock mínimo configurado |
| **Caja Cuadrada** | Monto físico igual al monto esperado |
| **Baja Lógica** | Eliminación reversible (campo `activo = false`) |

---

## 15. Referencias

- Documento de Arquitectura: `docs/architecture.md`
- Especificación de APIs: `docs/api.md`
- Modelo de Datos: `docs/db.md`
- Especificaciones Funcionales: `docs/specs.md`

---