namespace AdrianCrea.Application.DTOs;

public class ContractDto
{
    public long Id { get; set; }
    public long? ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public string PlanName { get; set; } = "Plan Crecimiento";
    public int PostsCount { get; set; }
    public int ReelsCount { get; set; }
    public int StoriesCount { get; set; }
    public string Currency { get; set; } = "HNL";
    public decimal Price { get; set; }
    public string? StartDate { get; set; }
    public string Duration { get; set; } = "3 meses";
    public string FirstMonthTerms { get; set; } = "50% de anticipo y el 50% restante 15 días después";
    public string RecurringDay { get; set; } = "cada día 15";
    public string Revisions { get; set; } = "hasta 2 rondas de correcciones menores";
    public string? CustomNotes { get; set; }
    public string Status { get; set; } = "active";
    public DateTime CreatedAt { get; set; }
}

public class CreateContractDto
{
    public long? ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public string PlanName { get; set; } = "Plan Crecimiento";
    public int PostsCount { get; set; } = 14;
    public int ReelsCount { get; set; } = 4;
    public int StoriesCount { get; set; } = 12;
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
