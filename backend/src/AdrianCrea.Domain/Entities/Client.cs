using AdrianCrea.Domain.Common;
using AdrianCrea.Domain.Enums;

namespace AdrianCrea.Domain.Entities;

public class Client : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } // Marca o descripción del negocio
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? SecondaryPhone { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? Notes { get; set; }
    public string ClientType { get; set; } = "active_client";
    public bool IsActive { get; set; } = true;
    public string BrandColor { get; set; } = "#ff7a00";
    public string LogoText { get; set; } = "AR";
    public string? LogoUrl { get; set; }
    public string AccessToken { get; set; } = string.Empty;

    // Métricas y plan
    public int TargetPostsCount { get; set; }
    public int TargetReelsCount { get; set; }
    public int StoriesCount { get; set; } = 12;
    public decimal MonthlyPrice { get; set; } = 8500m;
    public int BillingDay { get; set; } = 15;
    public string Currency { get; set; } = "HNL";
    public string PlanName { get; set; } = "Plan Crecimiento";

    // Navegación
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
