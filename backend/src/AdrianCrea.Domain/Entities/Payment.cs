using AdrianCrea.Domain.Common;

namespace AdrianCrea.Domain.Entities;

public class Payment : BaseEntity
{
    public string ReceiptFolio { get; set; } = string.Empty;
    public long? ClientId { get; set; }
    public Client? Client { get; set; }

    public string ClientName { get; set; } = string.Empty;
    public string? BrandName { get; set; }

    public int Month { get; set; }
    public int Year { get; set; }
    public string PaidDate { get; set; } = string.Empty;

    public string Currency { get; set; } = "HNL";
    public decimal Amount { get; set; }
    public string Method { get; set; } = "Transferencia";
    public string Status { get; set; } = "paid";
    public string? Reference { get; set; }
    public string? Description { get; set; }
}
