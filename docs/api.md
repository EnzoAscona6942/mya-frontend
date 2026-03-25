# API REST — Referencia de Endpoints

Base URL: `http://localhost:3001/api`
Todos los endpoints (excepto `/auth/login`) requieren header: `Authorization: Bearer <token>`

## Auth
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| POST | `/auth/login` | Login, retorna JWT | Público |
| GET | `/auth/me` | Datos del usuario autenticado | Todos |
| POST | `/auth/register` | Crear nuevo usuario | ADMIN |

## Productos
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/productos` | Listar (filtros: `busqueda`, `categoriaId`, `stockBajo`) | Todos |
| GET | `/productos/stock-bajo` | Productos con stock ≤ stockMínimo | Todos |
| GET | `/productos/barras/:codigo` | Buscar por código de barras ← **clave para el POS** | Todos |
| GET | `/productos/:id` | Detalle de un producto | Todos |
| POST | `/productos` | Crear producto | ADMIN |
| PUT | `/productos/:id` | Actualizar producto | ADMIN |
| DELETE | `/productos/:id` | Baja lógica (`activo=false`) | ADMIN |

## Ventas
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| POST | `/ventas` | Registrar venta (descuenta stock automáticamente) | Todos |
| GET | `/ventas` | Historial (filtros: `desde`, `hasta`, `cajaId`, `estado`) | Todos |
| GET | `/ventas/:id` | Detalle de una venta | Todos |
| PUT | `/ventas/:id/anular` | Anular venta (repone stock) | Todos |

**Body para crear venta:**
```json
{
  "cajaId": 1,
  "metodoPago": "EFECTIVO",
  "descuento": 0,
  "montoRecibido": 1000,
  "items": [
    { "productoId": 3, "cantidad": 2 },
    { "productoId": 7, "cantidad": 1 }
  ]
}
```

## Caja
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/caja/activa` | Caja abierta actual con resumen de ventas | Todos |
| POST | `/caja/abrir` | Abrir caja con monto inicial | Todos |
| POST | `/caja/:id/cerrar` | Cerrar caja con monto final real | Todos |
| POST | `/caja/:id/movimiento` | Registrar ingreso/egreso manual | Todos |
| GET | `/caja` | Historial de cajas | Todos |

**Respuesta del cierre de caja incluye:**
- Total de ventas por método de pago
- Efectivo esperado vs real
- Diferencia (sobrante/faltante)

## Reportes
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/reportes/ventas-hoy` | Resumen del día + últimas 20 ventas | Todos |
| GET | `/reportes/balance?desde=&hasta=` | Balance del período + top productos | ADMIN |
| GET | `/reportes/ventas-por-dia?desde=&hasta=` | Serie temporal de ventas | Todos |
| GET | `/reportes/stock` | Estado del stock con alertas | Todos |
| GET | `/reportes/categorias?desde=&hasta=` | Ventas agrupadas por categoría | Todos |

## Catálogos
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/categorias` | Listar categorías | Todos |
| POST | `/categorias` | Crear categoría | ADMIN |
| PUT | `/categorias/:id` | Actualizar categoría | ADMIN |
| DELETE | `/categorias/:id` | Eliminar categoría | ADMIN |
| GET | `/proveedores` | Listar proveedores activos | Todos |
| POST | `/proveedores` | Crear proveedor | ADMIN |
| PUT | `/proveedores/:id` | Actualizar proveedor | ADMIN |

## Stock
| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| POST | `/stock/ingreso` | Registrar ingreso de mercadería (suma stock) | ADMIN |
| GET | `/stock/ingresos` | Historial de ingresos | Todos |
