# Estado del Proyecto: Calendario de Post
**Cliente / Marca:** Adrian Reyes Creativo  
**Última actualización:** 2026-10-31

---

## 1. Resumen General
Sistema de gestión y aprobación de publicaciones para redes sociales con roles diferenciados, conectado a **Google Sheets en tiempo real** (mediante Google Apps Script Web App), diseño dashboard con **menú lateral (sidebar)**, respaldado en **GitHub** y desplegado en **Vercel**.

---

## 2. Repositorio Remoto y Despliegue
- **GitHub:** [https://github.com/CA038/calendario-de-post](https://github.com/CA038/calendario-de-post)
- **Vercel URL:** [https://calendario-de-post.vercel.app](https://calendario-de-post.vercel.app)
- **Rama principal:** `main`
- **Frontend:** Estático puro en raíz (`index.html`, `css/`, `js/`), servido por Vercel Edge CDN.
- **Backend Serverless:** Manejado en `api/[...path].js` y `api/index.js` con dependencias fijadas mediante `package-lock.json`.

---

## 3. Requerimientos Funcionales
- [x] **Menú Lateral (Sidebar):**
  - Accesos directos a: Calendario, Crear Nuevo Post, Crear Clientes, Crear Usuarios y Asignar Tareas.
  - Perfil de usuario con avatar dinámico, rol y botón para cerrar sesión.
- [x] **Autenticación (Login):** Acceso por credenciales y roles (Superadmin, Operario, Cliente) conectado a Google Sheets.
- [x] **Gestión de Roles y Asignaciones:**
  - **Superusuario:** Control total de clientes, operarios, metas y publicaciones.
  - **Operario:** Asignación de clientes y creación de posts con permisos restringidos.
  - **Cliente:** Acceso exclusivo a su propio calendario para ver, aprobar o rechazar publicaciones.
  - **Pestaña de Asignaciones:** Vista para consultar y gestionar qué clientes están asignados a qué operarios/usuarios.
- [x] **Calendario Multimedia:** Programación de publicaciones con foto(s), galerías y video.
- [x] **Flujo de Aprobación:**
  - Botones de Aprobado / Rechazado.
  - Sección para captura y visualización de observaciones/motivos de rechazo del cliente.
- [x] **Meta de Publicaciones:**
  - Entrada manual de la cantidad mensual/período de posts esperados por cliente.
  - Contador interactivo en tiempo real de posts faltantes, aprobados y programados.

---

## 4. Estado Actual y Verificación
- [x] Generado `package-lock.json` en la raíz para instalación determinista de dependencias en Vercel.
- [x] Despliegue automático en Vercel tras cada `git push`.
- [x] Conexión en vivo con Google Sheets verificada (`Posts`, `Users`, `Clients`, `Settings`).
- [x] Todos los archivos cumplen la regla de límite (< 1,000 líneas).
