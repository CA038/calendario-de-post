using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using AdrianCrea.Domain.Entities;
using AdrianCrea.Domain.Interfaces;

namespace AdrianCrea.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;

    public PaymentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IReadOnlyList<PaymentDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var payments = await _unitOfWork.Payments.GetAllAsync(cancellationToken);
        var dtos = payments.Select(MapToDto).ToList();
        return ApiResponse<IReadOnlyList<PaymentDto>>.Ok(dtos);
    }

    public async Task<ApiResponse<PaymentDto>> CreateAsync(CreatePaymentDto dto, CancellationToken cancellationToken = default)
    {
        var year = dto.Year > 0 ? dto.Year : DateTime.UtcNow.Year;
        var folio = $"REC-{year}-{Random.Shared.Next(1000, 9999)}";

        var payment = new Payment
        {
            ReceiptFolio = folio,
            ClientId = dto.ClientId,
            ClientName = dto.ClientName,
            BrandName = dto.BrandName,
            Month = dto.Month,
            Year = year,
            PaidDate = dto.PaidDate ?? DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Currency = dto.Currency,
            Amount = dto.Amount,
            Method = dto.Method ?? "Transferencia",
            Status = dto.Status ?? "paid",
            Reference = dto.Reference,
            Description = dto.Description
        };

        var created = await _unitOfWork.Payments.AddAsync(payment, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<PaymentDto>.Ok(MapToDto(created), "Pago registrado exitosamente");
    }

    public async Task<ApiResponse<PaymentDto>> UpdateAsync(long id, CreatePaymentDto dto, CancellationToken cancellationToken = default)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id, cancellationToken);
        if (payment == null)
            return ApiResponse<PaymentDto>.Fail("Pago no encontrado para actualizar");

        payment.ClientId = dto.ClientId;
        payment.ClientName = dto.ClientName;
        payment.BrandName = dto.BrandName;
        payment.Month = dto.Month;
        payment.Year = dto.Year;
        payment.PaidDate = dto.PaidDate ?? payment.PaidDate;
        payment.Currency = dto.Currency;
        payment.Amount = dto.Amount;
        payment.Method = dto.Method ?? payment.Method;
        payment.Status = dto.Status ?? payment.Status;
        payment.Reference = dto.Reference;
        payment.Description = dto.Description;
        payment.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Payments.UpdateAsync(payment, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<PaymentDto>.Ok(MapToDto(payment), "Pago actualizado exitosamente");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id, cancellationToken);
        if (payment == null)
            return ApiResponse<bool>.Fail("Pago no encontrado");

        await _unitOfWork.Payments.DeleteAsync(payment, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<bool>.Ok(true, "Pago eliminado exitosamente");
    }

    public async Task<ApiResponse<AccountingSummaryDto>> GetMonthlySummaryAsync(int month, int year, CancellationToken cancellationToken = default)
    {
        var allPayments = await _unitOfWork.Payments.GetByMonthAndYearAsync(month, year, cancellationToken);
        var allClients = await _unitOfWork.Clients.GetAllAsync(cancellationToken);

        var activeClients = allClients.Where(c => c.IsActive && c.ClientType != "lead" && c.ClientType != "inactive").ToList();

        decimal projected = activeClients.Sum(c => c.MonthlyPrice);
        decimal collected = allPayments.Where(p => p.Status == "paid").Sum(p => p.Amount);
        decimal pending = Math.Max(0, projected - collected);

        var summary = new AccountingSummaryDto
        {
            Month = month,
            Year = year,
            TotalProjected = projected,
            TotalCollected = collected,
            PendingAmount = pending,
            TotalClientsActive = activeClients.Count,
            Payments = allPayments.Select(MapToDto).ToList()
        };

        return ApiResponse<AccountingSummaryDto>.Ok(summary);
    }

    private static PaymentDto MapToDto(Payment p) => new()
    {
        Id = p.Id,
        ReceiptFolio = p.ReceiptFolio,
        ClientId = p.ClientId,
        ClientName = p.ClientName,
        BrandName = p.BrandName,
        Month = p.Month,
        Year = p.Year,
        PaidDate = p.PaidDate,
        Currency = p.Currency,
        Amount = p.Amount,
        Method = p.Method,
        Status = p.Status,
        Reference = p.Reference,
        Description = p.Description,
        CreatedAt = p.CreatedAt
    };
}
