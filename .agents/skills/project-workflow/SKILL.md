---
name: project-workflow
description: Reglas de flujo, diseño estético y arquitectura para el proyecto Calendario de Post de Adrian Reyes Creativo.
---

# Skill: Flujo y Estándares del Proyecto

Esta skill define las pautas de desarrollo y diseño para el proyecto **Calendario de Post**:

## Directivas Operativas
1. **Sin navegador:** No utilizar herramientas de navegador como Chrome.
2. **Resumen previo:** Presentar siempre un breve resumen antes de realizar modificaciones.
3. **Análisis previo:** Validar integridad y dependencias antes de editar archivos.
4. **Límite de líneas:** Máximo 1,000 líneas por archivo; preferir módulos de 150-300 líneas.
5. **Iconografía:** Únicamente iconos de línea (Lucide Icons SVG). No 3D.
6. **Bitácora:** Mantener actualizado `PROJECT_STATUS.md`.

## Estética y UI
- **Paleta de Colores:** Fondo suave lavanda/lila (`#F5F3FF`, `#EDE9FE`), acentos violeta (`#8B5CF6`, `#6D28D9`), tarjetas flotantes en blanco puro con sombras difuminadas suaves y bordes de gran radio (16px a 24px).
- **Tipografía:** Moderna, legible y refinada.
- **Identidad:** Integrar logo "Adrian Reyes Creativo" en la cabecera.
- **Sin fotos humanas tipo modelo:** Usar vistas de interfaz limpias, tarjetas de posts y cuadrículas funcionales.

## Arquitectura y Principios SOLID
- **Backend desacoplado:** Capas separadas para API/Rutas, Controladores, Servicios y Repositorios.
- **Acceso a Datos:** Abstracción para Google Sheets mediante Webhook / Apps Script.
