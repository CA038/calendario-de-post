namespace AdrianCrea.Application.DTOs;

public class PaymentDto
{
    public long Id { get; set; }
    public string ReceiptFolio { get; set; } = string.Empty;
    public long? ClientId { get; set; }
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
    public DateTime CreatedAt { get; set; }
}

public class CreatePaymentDto
{
    public long? ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public string? PaidDate { get; set; }
    public string Currency { get; set; } = "HNL";
    public decimal Amount { get; set; }
    public string Method { get; set; } = "Transferencia";
    public string Status { get; set; } = "paid";
    public string? Reference { get; set; }
    public string? Description { get; set; }
}

public class AccountingSummaryDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal TotalProjected { get; set; }
    public decimal TotalCollected { get; set; }
    public decimal PendingAmount { get; set; }
    public int TotalClientsActive { get; set; }
    public List<PaymentDto> Payments { get; set; } = new();
}
