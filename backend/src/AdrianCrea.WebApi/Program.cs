using AdrianCrea.Application;
using AdrianCrea.Infrastructure;
using AdrianCrea.WebApi.Middleware;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Fijar puerto en 5290 para evitar conflicto con AirPlay en macOS (puerto 5000)
builder.WebHost.UseUrls("http://localhost:5290");

// 1. Agregar servicios de las capas de la solución (SOLID & Inversión de Dependencias)
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// 2. Controladores REST y Serialización JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// 3. Configuración de CORS para permitir Frontend (Netlify & Localhost)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Configurar Swagger / OpenAPI Documentación Profesional
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Adrián Reyes Creativo — API Empresarial",
        Version = "v1",
        Description = "API RESTful modular construida con C# .NET 8 y Arquitectura Limpia para gestión de Clientes, Contabilidad, Calendario y Contratos.",
        Contact = new OpenApiContact
        {
            Name = "Adrián Reyes Creativo",
            Url = new Uri("https://adrianreyescreativo.com")
        }
    });
});

var app = builder.Build();

// 5. Middleware Global de Excepciones para resiliencia y respuestas homogéneas
app.UseMiddleware<ExceptionMiddleware>();

// 6. Inicializar y crear la Base de Datos SQL física en la Mac
await AdrianCrea.Infrastructure.DependencyInjection.SeedDevDataAsync(app.Services);

// 7. Pipeline HTTP y Documentación Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Adrián Reyes Creativo API v1");
    c.RoutePrefix = string.Empty; // Swagger como página de bienvenida raíz
});

app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
