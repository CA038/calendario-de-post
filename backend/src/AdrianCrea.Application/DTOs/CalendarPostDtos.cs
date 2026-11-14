namespace AdrianCrea.Application.DTOs;

public class CalendarPostDto
{
    public long Id { get; set; }
    public long? ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string BrandColor { get; set; } = "#ff7a00";
    public string Title { get; set; } = string.Empty;
    public string PostType { get; set; } = "post";
    public string Status { get; set; } = "idea";
    public DateTime ScheduledDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCalendarPostDto
{
    public long? ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string BrandColor { get; set; } = "#ff7a00";
    public string Title { get; set; } = string.Empty;
    public string PostType { get; set; } = "post"; // post, reel, story
    public string Status { get; set; } = "idea";   // idea, design, ready, published
    public DateTime ScheduledDate { get; set; }
    public string? Notes { get; set; }
}

public class UpdateCalendarPostDto
{
    public string Title { get; set; } = string.Empty;
    public string PostType { get; set; } = "post";
    public string Status { get; set; } = "idea";
    public DateTime ScheduledDate { get; set; }
    public string? Notes { get; set; }
}
