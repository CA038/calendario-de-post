using AdrianCrea.Domain.Entities;
using AdrianCrea.Domain.Interfaces;
using AdrianCrea.Infrastructure.Persistence;
using AdrianCrea.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AdrianCrea.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data Source=adriancrea.db";

        // Configuración de Base de Datos SQL Local (SQLite) corriendo nativamente en macOS
        services.AddDbContext<AdrianCreaDbContext>(options =>
        {
            options.UseSqlite(connectionString, b => b.MigrationsAssembly(typeof(AdrianCreaDbContext).Assembly.FullName));
        });

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<IContractRepository, ContractRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<ICalendarPostRepository, CalendarPostRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }

    public static async Task SeedDevDataAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AdrianCreaDbContext>();

        // Crea el archivo físico de base de datos SQL (adriancrea.db) y todas sus tablas si no existen
        await context.Database.EnsureCreatedAsync();

        try
        {
            await context.Database.ExecuteSqlRawAsync("ALTER TABLE clients ADD COLUMN logo_url TEXT NULL;");
        }
        catch
        {
            // Columna ya existente
        }

        if (!context.Clients.Any())
        {
            var demoClient = new Client
            {
                Name = "Glow Studio",
                Description = "Estudio de Estética & Belleza",
                ContactEmail = "contacto@glowstudio.hn",
                ContactPhone = "+504 9876-5432",
                BrandColor = "#ff7a00",
                LogoText = "GS",
                PlanName = "Plan Crecimiento",
                TargetPostsCount = 14,
                TargetReelsCount = 4,
                StoriesCount = 12,
                Currency = "HNL",
                MonthlyPrice = 8500m,
                BillingDay = 15,
                IsActive = true,
                AccessToken = "tok_glowstudio_9921"
            };

            context.Clients.Add(demoClient);
            await context.SaveChangesAsync();

            context.Contracts.Add(new Contract
            {
                ClientId = demoClient.Id,
                ClientName = demoClient.Name,
                BrandName = demoClient.Description,
                PlanName = "Plan Crecimiento",
                PostsCount = 14,
                ReelsCount = 4,
                StoriesCount = 12,
                Price = 8500m,
                Currency = "HNL",
                StartDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                Duration = "3 meses",
                Status = "active"
            });

            context.Payments.Add(new Payment
            {
                ReceiptFolio = "REC-2026-1001",
                ClientId = demoClient.Id,
                ClientName = demoClient.Name,
                BrandName = demoClient.Description,
                Month = DateTime.UtcNow.Month - 1,
                Year = DateTime.UtcNow.Year,
                PaidDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                Amount = 8500m,
                Currency = "HNL",
                Method = "Transferencia",
                Status = "paid",
                Description = "Servicio Profesional de Marketing y Gestión de Redes Sociales"
            });

            // Seed de Entregables de Calendario para el mes actual
            var now = DateTime.UtcNow;
            context.CalendarPosts.AddRange(new List<CalendarPost>
            {
                new CalendarPost
                {
                    ClientId = demoClient.Id,
                    ClientName = demoClient.Name,
                    BrandColor = demoClient.BrandColor,
                    Title = "Lanzamiento Tratamiento Facial Hidratante",
                    PostType = "post",
                    Status = "published",
                    ScheduledDate = new DateTime(now.Year, now.Month, Math.Min(3, DateTime.DaysInMonth(now.Year, now.Month))),
                    Notes = "Carrusel informativo de 4 láminas con beneficios del tratamiento."
                },
                new CalendarPost
                {
                    ClientId = demoClient.Id,
                    ClientName = demoClient.Name,
                    BrandColor = demoClient.BrandColor,
                    Title = "Reel: Antes y Después Microblading",
                    PostType = "reel",
                    Status = "ready",
                    ScheduledDate = new DateTime(now.Year, now.Month, Math.Min(8, DateTime.DaysInMonth(now.Year, now.Month))),
                    Notes = "Formato 9:16 con audio en tendencia y llamada a la acción en descripción."
                },
                new CalendarPost
                {
                    ClientId = demoClient.Id,
                    ClientName = demoClient.Name,
                    BrandColor = demoClient.BrandColor,
                    Title = "Consejos de Skincare en Casa",
                    PostType = "post",
                    Status = "design",
                    ScheduledDate = new DateTime(now.Year, now.Month, Math.Min(14, DateTime.DaysInMonth(now.Year, now.Month))),
                    Notes = "Estilo minimalista con tipografía de marca."
                },
                new CalendarPost
                {
                    ClientId = demoClient.Id,
                    ClientName = demoClient.Name,
                    BrandColor = demoClient.BrandColor,
                    Title = "Reel: Tour por las nuevas instalaciones",
                    PostType = "reel",
                    Status = "idea",
                    ScheduledDate = new DateTime(now.Year, now.Month, Math.Min(20, DateTime.DaysInMonth(now.Year, now.Month))),
                    Notes = "Tomas dinámicas con estabilizador y voz en off."
                }
            });

            await context.SaveChangesAsync();
        }
    }
}
