# ==============================================================================
# Dockerfile Multi-Stage para Backend C# ASP.NET Core 8
# Compatible con Render, Railway, Fly.io y Azure App Service
# ==============================================================================

# 1. Etapa de Compilación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar archivos de proyectos para restaurar dependencias
COPY *.sln .
COPY src/AdrianCrea.Domain/*.csproj src/AdrianCrea.Domain/
COPY src/AdrianCrea.Application/*.csproj src/AdrianCrea.Application/
COPY src/AdrianCrea.Infrastructure/*.csproj src/AdrianCrea.Infrastructure/
COPY src/AdrianCrea.WebApi/*.csproj src/AdrianCrea.WebApi/

RUN dotnet restore

# Copiar todo el código fuente y compilar release
COPY . .
WORKDIR /app/src/AdrianCrea.WebApi
RUN dotnet publish -c Release -o /app/publish

# 2. Etapa de Ejecución
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AdrianCrea.WebApi.dll"]
