# Arquitectura y Visión General

## Visión del Proyecto
**MyA** es un sistema de gestión para un minimercado, desarrollado como MVP para presentarle al cliente. El objetivo es resolver las necesidades operativas más críticas del negocio:
- Control de stock con alertas de reposición
- Punto de venta (POS) con lector de código de barras
- Cierre de caja con conciliación de efectivo
- Reportes y balance de ventas

El sistema está pensado para correr **localmente en la PC del negocio** (deploy definitivo a definir), con una interfaz simple y rápida para el cajero y un panel de administración para el dueño.

## Stack Tecnológico
| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite | — |
| Estilos | CSS-in-JS inline (sin Tailwind por ahora) | — |
| Fuentes | Sora (UI) + DM Mono (números) vía Google Fonts | — |
| Backend | Node.js + Express | — |
| ORM | Prisma | 6.6.0 |
| Base de datos | PostgreSQL | 15 (Alpine) |
| Contenedores | Docker + Docker Compose | — |
| Auth | JWT + bcryptjs | — |

### Decisiones técnicas tomadas
- **Un solo lenguaje (JS)** en front y back para simplificar el desarrollo.
- **Prisma 6** (versión elegida por estabilidad). La `DATABASE_URL` va en `datasource db` dentro del `schema.prisma` con `url = env("DATABASE_URL")`. **No se usa `prisma.config.ts`** — si Prisma lo genera automáticamente, eliminarlo.
- **Baja lógica** en productos (campo `activo = false`) en lugar de borrado físico, para preservar historial de ventas.
- **Precio guardado en `VentaItem`** al momento de la venta, independiente de cambios futuros al producto.
- **Transacciones Prisma** (`$transaction`) en ventas e ingresos de stock para garantizar consistencia.
- **Diseño visual**: sidebar oscura fija + área de contenido clara. Fuentes Sora (textos) y DM Mono (precios/números). Paleta verde `#16A34A` como acento principal.
- **Lector de barras**: captura via eventos `keydown` globales en el frontend. No requiere librería especial.

## Estructura del Proyecto
```text
D:\MyA\
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              ← modelo de datos completo
│   │   └── seed.js                    ← datos iniciales (admin + categorías + productos demo)
│   ├── src/
│   │   ├── server.js                  ← entrada principal Express + rutas + CORS
│   │   ├── lib/
│   │   │   └── prisma.js              ← cliente Prisma singleton
│   │   ├── middlewares/
│   │   │   └── auth.js                ← JWT verify + guard soloAdmin
│   │   └── routes/
│   │       ├── auth.js                ← login, register, /me
│   │       ├── productos.js           ← ABM + búsqueda por código de barras
│   │       ├── ventas.js              ← crear venta, anular, historial
│   │       ├── caja.js                ← apertura, cierre, movimientos manuales
│   │       ├── reportes.js            ← balance, ventas por día, stock, categorías
│   │       ├── catalogos.js           ← categorías y proveedores
│   │       └── stock.js               ← ingresos de mercadería
│   ├── docker-compose.yml             ← PostgreSQL en Docker
│   ├── .env                           ← variables de entorno (no commitear)
│   ├── .env.example                   ← template del .env
│   └── package.json
│
└── frontend/                          ← en desarrollo
    ├── src/
    │   ├── main.jsx                   ← ⏳ pendiente
    │   ├── App.jsx                    ← ⏳ pendiente (estructura con sidebar + router)
    │   ├── context/
    │   │   └── AuthContext.jsx        ← ⏳ pendiente (token JWT global)
    │   ├── pages/
    │   │   ├── Login.jsx              ← ⏳ pendiente
    │   │   ├── POS.jsx                ← ✅ listo
    │   │   ├── Stock.jsx              ← ⏳ pendiente
    │   │   ├── CierreCaja.jsx         ← ⏳ pendiente
    │   │   └── Reportes.jsx           ← ⏳ pendiente
    │   ├── components/
    │   │   ├── Sidebar.jsx            ← ✅ listo (dentro de POS.jsx, extraer)
    │   │   ├── ModalPago.jsx          ← ✅ listo (dentro de POS.jsx, extraer)
    │   │   └── TicketVenta.jsx        ← ✅ listo (dentro de POS.jsx, extraer)
    │   └── lib/
    │       └── api.js                 ← ⏳ pendiente (cliente fetch centralizado)
    └── package.json
```

## Setup del Proyecto
```bash
# Prerrequisitos: Node.js + Docker Desktop corriendo

# ── BACKEND ─────────────────────────────────────────────────
cd D:\MyA\backend

npm install
copy .env.example .env          # completar con los valores correctos
docker-compose up -d            # levanta PostgreSQL
npx prisma migrate dev --name init
node prisma/seed.js             # crea admin + categorías + productos demo
npm run dev
# → http://localhost:3001/api/health

# Credenciales del seed
# Email:    admin@mya.com
# Password: admin123

# ── FRONTEND ────────────────────────────────────────────────
cd D:\MyA\frontend
npm install
npm run dev
# → http://localhost:5173

# ── HERRAMIENTAS ÚTILES ─────────────────────────────────────
npx prisma studio               # UI visual de la DB en el browser
docker ps                       # verificar que el contenedor esté corriendo
docker-compose down             # bajar la base de datos
```
