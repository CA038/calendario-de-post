using AdrianCrea.Domain.Common;

namespace AdrianCrea.Domain.Entities;

public class CustomPlan : BaseEntity
{
    public string PlanId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Posts { get; set; }
    public int Reels { get; set; }
    public int Stories { get; set; }
    public string Currency { get; set; } = "HNL";
    public string? Badge { get; set; }
    public string? FeaturesJson { get; set; }
}
