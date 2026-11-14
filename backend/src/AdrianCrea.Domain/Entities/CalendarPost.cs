using AdrianCrea.Domain.Common;

namespace AdrianCrea.Domain.Entities;

public class CalendarPost : BaseEntity
{
    public long? ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string BrandColor { get; set; } = "#ff7a00";
    public string Title { get; set; } = string.Empty;
    public string PostType { get; set; } = "post"; // post, reel, story
    public string Status { get; set; } = "idea";   // idea, design, ready, published
    public DateTime ScheduledDate { get; set; }
    public string? Notes { get; set; }

    // Relación de navegación opcional
    public virtual Client? Client { get; set; }
}
