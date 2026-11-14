# Adrián Reyes Creativo — Sistema Empresarial Full-Stack

Sistema robusto, escalable y profesional diseñado bajo principios **SOLID** y **Clean Architecture** (Arquitectura Limpia en Capas), separando completamente el Frontend del Backend para un despliegue moderno de grado empresarial.

---

## 🏛️ Arquitectura del Sistema

```
Calendario de post y clientes/
├── INICIAR_PROYECTO.command       # Lanzador automático de 1 clic para macOS
├── backend/                       # Backend C# ASP.NET Core 8 Web API
│   ├── AdrianCrea.sln             # Solución .NET 8
│   ├── Dockerfile                 # Contenedor para despliegue en nube
│   └── src/
│       ├── AdrianCrea.Domain/         # Capa de Dominio (Entidades, Enums, Interfaces)
│       ├── AdrianCrea.Application/    # Capa de Aplicación (Casos de Uso, DTOs, Servicios)
│       ├── AdrianCrea.Infrastructure/ # Capa de Infraestructura (EF Core, SQLite Local, Repositorios)
│       └── AdrianCrea.WebApi/         # Capa de Presentación (Controladores REST, Swagger, CORS)
│
├── frontend/                      # Frontend SPA React 19 + TypeScript + Vite
│   ├── netlify.toml               # Configuración oficial para despliegue en Netlify
│   ├── dist/                      # Bundle de producción optimizado (HTML/CSS/JS)
│   └── src/
│       ├── components/            # Componentes modulares reutilizables
│       ├── views/                 # Vistas: Dashboard, Clientes, Calendario, Contratos, Contabilidad
│       ├── services/              # Clientes de API con fallback inteligente
│       └── styles/                # Sistema de diseño oscuro empresarial
```

---

## 💾 Base de Datos SQL Local (En tu Mac)

El sistema utiliza una base de datos relacional **SQL local física (`adriancrea.db`)** alojada directamente en tu Mac mediante **SQLite y Entity Framework Core 8**.

- **Archivo de base de datos:** `backend/src/AdrianCrea.WebApi/adriancrea.db`
- **Ventajas:**
  - 100% independiente: No requiere servicios en la nube externos ni credenciales.
  - Persistencia total: Guarda todos tus clientes, contratos, pagos y publicaciones de manera permanente en el disco de tu Mac.
  - Tablas relacionales estándar: `clients`, `contracts`, `payments`, `calendar_posts` y `custom_plans`.
  - Compatible con cualquier visor SQL como *DB Browser for SQLite* o extensiones de VS Code.

---

## 🚀 Cómo Iniciar el Sistema

### Opción A (Recomendada): Lanzador de 1 Clic
Haz **doble clic** en el archivo:
👉 [`INICIAR_PROYECTO.command`](file:///Users/carlosreyes/Desktop/Drive/Adrian%20Crea/Calendario%20de%20post%20y%20clientes/INICIAR_PROYECTO.command)

Esto iniciará el Backend en segundo plano, el Live Server de Vite y abrirá automáticamente tu navegador en `http://localhost:5173`.

### Opción B: Manual desde la Terminal

#### 1. Iniciar el Backend (C# .NET 8)
```bash
cd backend/src/AdrianCrea.WebApi
dotnet run
```
- **Documentación Swagger interactiva:** `http://localhost:5290`
- **Endpoints de la API:** `http://localhost:5290/api`

#### 2. Iniciar el Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
- **Aplicación web:** `http://localhost:5173`

---

## ☁️ Despliegue del Frontend en Netlify

El Frontend está listo para desplegarse de manera estática y ultra rápida en **Netlify**:

1. Conecta tu repositorio de GitHub a **Netlify** o arrastra la carpeta `frontend/dist` a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Si conectas el repositorio:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. El archivo `frontend/netlify.toml` ya incluye las reglas de redirección para enrutar el Single Page Application (`/* -> /index.html 200`).

---

## ✨ Módulos Incluidos

1. **Panel General & KPIs:** Proyección mensual, ingresos reales recaudados, saldo por cobrar y cuentas activas.
2. **Directorio CRM de Clientes:** Clasificación por estado, accesos directos a WhatsApp, llamadas telefónicas, correos y generación directa de acuerdos.
3. **Planificador de Calendario:** Programación interactiva de entregables (Posts, Reels, Historias), filtros por marca y estados de producción (Idea, Diseño, Listo, Publicado).
4. **Redactor Oficial de Contratos:** Editor en vivo de cláusulas 1 a 8, personalización instantánea de entregables acordados, datos bancarios oficiales y descarga de PDF profesional con 1 clic.
5. **Control Financiero & Recibos:** Historial de pagos por mes/año, cálculo automático de saldos y emisión oficial de Recibos de Pago en PDF con folio numerado.
