# 🔐 SecureSplit Vault

Enterprise credential management frontend built with React 18 + Vite + TailwindCSS.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 🔑 Demo Credentials

```
Username: admin
Password: Admin123!
```

## 📦 Stack

- **React 18** + Vite
- **TailwindCSS v4**
- **React Router DOM v7**
- **Framer Motion** — animaciones
- **Zustand** — estado global
- **React Hook Form** + **Zod** — formularios y validación
- **i18next** — internacionalización (ES, EN, FR)
- **Lucide React** — íconos

## 🌍 Idiomas

Español · English · Français — selector en la UI

## 📁 Estructura

```
src/
├── api/           # Axios client con interceptores JWT
├── components/
│   ├── modals/    # ViewSecret, EditSecret, DeleteSecret
│   └── ui/        # Toast, Skeleton, SessionTimer, etc.
├── i18n/          # Configuración i18next
├── layouts/       # AppLayout (sidebar + topbar)
├── pages/         # Login, Register, Dashboard, Secrets, Certificate, Settings
├── routes/        # AppRouter + ProtectedRoute
├── services/      # Mock service (reemplaza con tu backend)
├── store/         # Zustand auth store (JWT en memoria)
├── translations/  # es.js, en.js, fr.js
└── utils/
```

## 🔒 Seguridad

- JWT almacenado **solo en memoria** (no localStorage)
- Auto-logout al expirar la sesión (10 min)
- Banner de advertencia 2 min antes de expirar
- Valores de secretos con auto-blur (10 seg)
- Protected routes con redirección automática
- Axios interceptors para 401

## 🔌 Conectar Backend

Edita `src/services/mockService.js` → reemplaza las funciones mock con llamadas reales a tu API REST (Node.js / Spring Boot / .NET).

También configura `VITE_API_URL` en `.env`.

## 🏗️ Build

```bash
npm run build
```
