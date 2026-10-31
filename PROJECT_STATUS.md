# Estado del Proyecto: Calendario de Post
**Cliente / Marca:** Adrian Reyes Creativo  
**Última actualización:** 2026-10-30

---

## 1. Resumen General
Sistema de gestión y aprobación de publicaciones para redes sociales con roles diferenciados, conectado a **Google Sheets en tiempo real** (mediante Google Apps Script Web App), diseño dashboard con **menú lateral (sidebar)** y respaldado en **GitHub**.

---

## 2. Repositorio Remoto
- **GitHub:** [https://github.com/CA038/calendario-de-post](https://github.com/CA038/calendario-de-post)
- **Rama principal:** `main`
- **Autenticación:** Clave SSH segura (`ed25519`) configurada y vinculada a tu Mac.

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

## 4. Arquitectura y Tecnologías
- **Frontend:** HTML5, Vanilla CSS (estética lila/violeta pastel, layout dos columnas con menú lateral sticky, tarjetas redondeadas de 20-26px), JavaScript modular, Lucide Icons (línea).
- **Backend:** Node.js con Express, arquitectura desacoplada bajo principios SOLID:
  - Rutas / API (`src/routes/`)
  - Controladores (`src/controllers/`)
  - Servicios de Negocio (`src/services/`)
  - Repositorio Google Sheets (`src/repositories/GoogleSheetsRepository.js`).
- **Base de Datos:** Google Sheets activo mediante Apps Script Web App.

---

## 5. Estado Actual y Verificación
- [x] Repositorio Git inicializado y sincronizado con GitHub (`origin/main`).
- [x] Conexión en vivo con Google Sheets verificada (`Posts`, `Users`, `Clients`, `Settings`).
- [x] Menú lateral implementado e integrado con apertura de modales y cambio de pestañas.
- [x] Todos los archivos cumplen la regla de límite (< 1,000 líneas).
