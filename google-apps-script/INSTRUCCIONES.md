# Cómo implementar el Script en Google Sheets

1. Abre tu hoja de Google Sheets.
2. Ve a **Extensiones** > **Apps Script**.
3. Borra el código existente y pega todo el contenido de `Code.gs`.
4. Haz clic en **Implementar** (botón azul arriba a la derecha) > **Nueva implementación**.
5. Selecciona el tipo: **Aplicación web**.
6. Configura:
   - **Ejecutar como:** Yo (tu correo).
   - **Quién tiene acceso:** **Cualquier usuario** (Anyone).
7. Haz clic en **Implementar**, autoriza los permisos y copia la **URL de la aplicación web**.
8. Pega esa URL en tu archivo `.env` del backend como `GOOGLE_SCRIPT_WEBAPP_URL`.
