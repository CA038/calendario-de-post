using AdrianCrea.Domain.Common;

namespace AdrianCrea.Domain.Entities;

public class Contract : BaseEntity
{
    public long? ClientId { get; set; }
    public Client? Client { get; set; }

    public string ClientName { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public string PlanName { get; set; } = "Plan Crecimiento";

    // Entregables
    public int PostsCount { get; set; } = 14;
    public int ReelsCount { get; set; } = 4;
    public int StoriesCount { get; set; } = 12;

    // Términos comerciales
    public string Currency { get; set; } = "HNL";
    public decimal Price { get; set; } = 8500m;
    public string? StartDate { get; set; }
    public string Duration { get; set; } = "3 meses";
    public string FirstMonthTerms { get; set; } = "50% de anticipo y el 50% restante 15 días después";
    public string RecurringDay { get; set; } = "cada día 15";
    public string Revisions { get; set; } = "hasta 2 rondas de correcciones menores";
    public string? CustomNotes { get; set; }
    public string Status { get; set; } = "active";
}
