# Base de Datos — Modelo de Datos

## Entidades principales
```text
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

## Diagrama simplificado
```text
usuarios ──< cajas ──< ventas ──< venta_items >── productos
                  \                                    |
                   └──< movimientos_caja    categorias ┘
                                            proveedores ─< ingresos_stock ──< ingreso_stock_items
```

## Enums
| Enum | Valores |
|------|---------|
| `Rol` | `ADMIN`, `CAJERO` |
| `EstadoCaja` | `ABIERTA`, `CERRADA` |
| `TipoMovimiento` | `INGRESO`, `EGRESO` |
| `MetodoPago` | `EFECTIVO`, `TARJETA_DEBITO`, `TARJETA_CREDITO`, `TRANSFERENCIA`, `QR` |
| `EstadoVenta` | `COMPLETADA`, `ANULADA`, `PENDIENTE` |
