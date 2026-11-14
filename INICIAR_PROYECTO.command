#!/bin/bash
# ==============================================================================
# Adrián Reyes Creativo — Iniciador Automático del Sistema Empresarial
# ==============================================================================

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Cargar rutas estándar de macOS para Node.js, npm y .NET SDK
export PATH="/usr/local/bin:/opt/homebrew/bin:$HOME/.dotnet:$PATH"

# Cargar NVM si está instalado en el usuario
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh"
fi

clear
echo "=================================================================="
echo " 🚀 ADRIÁN REYES CREATIVO — INICIANDO SISTEMA EMPRESARIAL"
echo "=================================================================="
echo ""

# 1. Iniciar Backend C# en segundo plano si está disponible .NET
if command -v dotnet >/dev/null 2>&1; then
  echo " [1/2] ⚙️  Iniciando Backend C# .NET 8 (API & Base de Datos SQL en Mac)..."
  cd "$DIR/backend/src/AdrianCrea.WebApi"
  dotnet run --no-launch-profile > /dev/null 2>&1 &
  BACKEND_PID=$!
  echo "       ✅ Backend iniciado (PID: $BACKEND_PID)"
else
  echo " [1/2] ⚡ .NET no detectado en PATH directo; el frontend usará persistencia local en localhost."
fi

# 2. Iniciar Frontend Vite (React 19 + TypeScript)
echo " [2/2] 🎨 Iniciando Servidor en Vivo (Vite + React)..."
cd "$DIR/frontend"

# Función de salida limpia al cerrar la terminal o presionar Ctrl+C
cleanup() {
  echo ""
  echo " 🛑 Deteniendo sistema..."
  if [ -n "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null
  fi
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Abrir el navegador automáticamente en 2 segundos
(sleep 2 && open "http://localhost:5173") &

echo ""
echo "=================================================================="
echo "  🟢 ¡SISTEMA ONLINE Y CORRIENDO EN TU NAVEGADOR!"
echo "     👉 Frontend (Live Server): http://localhost:5173"
echo "     👉 Base de Datos SQL Mac:  backend/src/AdrianCrea.WebApi/adriancrea.db"
echo "     👉 Swagger API Backend:   http://localhost:5290"
echo "=================================================================="
echo " ℹ️  Mantén esta ventanita abierta mientras estés usando el sistema."
echo "     Para detenerlo, simplemente cierra esta ventana o presiona Ctrl+C."
echo "=================================================================="
echo ""

# Ejecutar el servidor de desarrollo Vite con Live Reload
npm run dev
