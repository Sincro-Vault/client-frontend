# SecureSplit Vault — Frontend

Aplicación de escritorio en **React 19 + Vite** para el Sistema Distribuido de Gestión de Secretos.
Corre en el PC del empleado y consume la API REST del **backend cliente .NET**.

> Parte del proyecto **Sincro-Vault** — Universidad Manuela Beltrán, Sistemas Distribuidos UMB 2026-1.
> Cliente real: **Aldeamo S.A.S.** (Bogotá D.C.)

---

## ¿Qué hace este componente?

- Es la **interfaz visual** que usa el empleado para gestionar sus credenciales.
- Hace login con JWT (10 min), maneja sesión en memoria (nunca localStorage).
- Muestra la **bóveda de secretos** con filtros, búsqueda y paginación.
- Anima la **reconstrucción distribuida** paso a paso (F1 local + F2 servidor → AES decrypt).
- Permite **crear, ver, editar y eliminar** secretos.
- Captura **geolocalización GPS** del navegador para enviarla al backend (geofencing).
- Soporta **3 idiomas**: español, inglés, francés.

NO toca directamente la base de datos. NO conoce el servidor central. Solo habla con el backend cliente.

---

## Instalación (2 minutos)

### Requisito previo
[Node.js 20+](https://nodejs.org/) instalado.

### Setup
```powershell
npm install
copy .env.example .env
npm run dev
```

Abre http://localhost:5173.

---

## Cómo conectarse a los otros componentes

El frontend habla **únicamente** con el **backend cliente .NET** vía REST.

```
[ Frontend React :5173 ]
        │  HTTP REST + JWT
        ▼
[ Backend Cliente .NET :8080 ]   ←─ ESTE es el que configuras
        │
        ▼
[ Servidor Python :9000 ]   ←─ A este NUNCA llama el frontend
```

### Configurar URL del backend cliente

Edita `.env`:

```
VITE_API_URL=http://localhost:8080/api
```

- **Si el frontend y el backend cliente corren en la MISMA PC** → `localhost:8080`.
- **Si están en PCs distintas** (ej: el backend en una PC dedicada) → pon la IP de la PC del backend, ej `192.168.1.10:8080`.

> **¡Importante!** Vite no recarga `.env` en caliente. Después de cambiarlo:
> ```powershell
> # Mata el dev server (Ctrl+C) y vuelve a levantarlo
> npm run dev
> ```

### Credenciales de prueba

```
Usuario:    admin
Contraseña: Admin123!
```

(Tienen que existir previamente en el backend cliente. Si la BD está limpia, registra una cuenta primero.)

---

## Demo end-to-end

Para que el frontend funcione completamente necesitas que los **otros 2 componentes** estén corriendo:

1. **Servidor Python** ([repo](https://github.com/Sincro-Vault/servidor)) en `:9000`
2. **Backend Cliente .NET** ([repo](https://github.com/Sincro-Vault/cliente)) en `:8080`
3. Este **Frontend** en `:5173`

Levanta en ese orden (servidor → cliente → frontend).

---

## Stack

- **React 19** + **Vite 8**
- **TailwindCSS v4** (con styles inline para componentes críticos por compatibilidad)
- **React Router DOM v7** (protected routes + auto-logout en 401)
- **Zustand** (estado global, JWT en memoria)
- **React Hook Form + Zod** (validación)
- **Framer Motion** (animaciones)
- **i18next + react-i18next** (3 idiomas)
- **Axios** (con interceptors JWT y auto-logout 401)
- **Lucide React** (íconos)

---

## Estructura

```
src/
├── api/client.js                  # Axios + interceptors JWT
├── components/
│   ├── modals/
│   │   ├── ViewSecretModal.jsx    # Anima la reconstruccion en 4 pasos
│   │   ├── EditSecretModal.jsx
│   │   └── DeleteSecretModal.jsx  # Anima la doble eliminacion (F1+F2)
│   └── ui/                        # Toast, Skeleton, SessionTimer, LanguageSelector
├── i18n/
├── layouts/
│   └── AppLayout.jsx              # Sidebar + topbar
├── pages/
│   ├── Login.jsx                  # Split-screen enterprise
│   ├── Register.jsx
│   ├── Dashboard.jsx              # Stats + System status + Activity feed
│   ├── Secrets.jsx                # Boveda con tabla paginada
│   ├── CreateSecret.jsx
│   ├── Certificate.jsx            # Carga de cert RSA
│   ├── Settings.jsx
│   └── SessionExpired.jsx
├── routes/
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
├── services/
│   └── mockService.js             # authService, secretsService, certificateService (axios real)
├── store/
│   └── authStore.js               # Zustand: JWT en memoria + countdown 10 min
└── translations/
    ├── es.js
    ├── en.js
    └── fr.js
```

---

## Seguridad

- **JWT en memoria Zustand** — nunca en localStorage ni cookies
- **Auto-logout** al expirar el token (10 min) o en HTTP 401
- **Banner de advertencia** 2 min antes de expirar
- **Valores de secretos con auto-blur** después de 10 seg al revelarlos
- **Captura de geolocalización** del navegador (opcional, para geofencing)
- **CORS** restringido por el backend, no por el frontend

---

## Comandos útiles

```powershell
npm run dev       # Levantar dev server (Vite + HMR)
npm run build     # Build de producción → dist/
npm run preview   # Servir el build
npm run lint      # ESLint
```

---

## Equipo

| Nombre | Rol |
|---|---|
| Harold Camargo | Líder |
| Samuel Ortiz | API e Integración |
| Michael Ramírez | Seguridad y Criptografía |
| Juan Stiven Castro | Desarrollo |
| Jose | Datos y Persistencia |
