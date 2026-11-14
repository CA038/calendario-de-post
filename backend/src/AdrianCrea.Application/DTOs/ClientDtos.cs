namespace AdrianCrea.Application.DTOs;

public class ClientDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public string Category { get; set; } = "active";
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? SecondaryPhone { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? Notes { get; set; }
    public string BrandColor { get; set; } = "#ff7a00";
    public string LogoText { get; set; } = "AR";
    public string? LogoUrl { get; set; }
    public string PlanName { get; set; } = "Plan Crecimiento";
    public int MonthlyPostsLimit { get; set; }
    public int MonthlyReelsLimit { get; set; }
    public int StoriesCount { get; set; } = 12;
    public string Currency { get; set; } = "HNL";
    public decimal MonthlyPrice { get; set; }
    public int BillingDay { get; set; } = 15;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
}

public class CreateClientDto
{
    public string Name { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public string Category { get; set; } = "active";
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? SecondaryPhone { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? Notes { get; set; }
    public string BrandColor { get; set; } = "#ff7a00";
    public string LogoText { get; set; } = "AR";
    public string? LogoUrl { get; set; }
    public string PlanName { get; set; } = "Plan Crecimiento";
    public int? MonthlyPostsLimit { get; set; } = 14;
    public int? MonthlyReelsLimit { get; set; } = 4;
    public int? StoriesCount { get; set; } = 12;
    public string Currency { get; set; } = "HNL";
    public decimal? MonthlyPrice { get; set; } = 8500m;
    public int? BillingDay { get; set; } = 15;
}

public class UpdateClientDto : CreateClientDto
{
    public bool IsActive { get; set; } = true;
}
