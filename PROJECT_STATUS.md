# Estado del Proyecto: Calendario de Post
**Cliente / Marca:** Adrian Reyes Creativo  
**Última actualización:** 2026-10-30

---

## 1. Resumen General
Sistema de gestión y aprobación de publicaciones para redes sociales con roles diferenciados, conectado a **Google Sheets en tiempo real** (mediante Google Apps Script Web App), diseño dashboard con **menú lateral (sidebar)**, respaldado en **GitHub** y desplegado en **Vercel**.

---

## 2. Repositorio Remoto y Despliegue
- **GitHub:** [https://github.com/CA038/calendario-de-post](https://github.com/CA038/calendario-de-post)
- **Vercel URL:** [https://calendario-de-post.vercel.app](https://calendario-de-post.vercel.app)
- **Rama principal:** `main`
- **Frontend Estático:** Archivos servidos directamente en la raíz (`index.html`, `css/`, `js/`) por el CDN de Vercel.
- **Backend Serverless:** Manejado en `api/index.js` mediante Express con soporte dual de rutas (`/api/*` y `/*`).

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
- [x] Estructura estática en la raíz para servir index.html directamente desde la CDN de Vercel.
- [x] URL de Google Sheets integrada en el backend para auto-conexión.
- [x] Despliegue automático en Vercel tras cada `git push`.
- [x] Verificación de código sin romper dependencias y con menos de 1,000 líneas por archivo.
