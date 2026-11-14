using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;

namespace AdrianCrea.Application.Interfaces;

public interface IClientService
{
    Task<ApiResponse<IReadOnlyList<ClientDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ApiResponse<ClientDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<ApiResponse<ClientDto>> CreateAsync(CreateClientDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<ClientDto>> UpdateAsync(long id, UpdateClientDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default);
}

public interface IContractService
{
    Task<ApiResponse<IReadOnlyList<ContractDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ApiResponse<ContractDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<ApiResponse<ContractDto>> CreateAsync(CreateContractDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<ContractDto>> UpdateAsync(long id, CreateContractDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default);
}

public interface IPaymentService
{
    Task<ApiResponse<IReadOnlyList<PaymentDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ApiResponse<PaymentDto>> CreateAsync(CreatePaymentDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<PaymentDto>> UpdateAsync(long id, CreatePaymentDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default);
    Task<ApiResponse<AccountingSummaryDto>> GetMonthlySummaryAsync(int month, int year, CancellationToken cancellationToken = default);
}

public interface ICalendarPostService
{
    Task<ApiResponse<IReadOnlyList<CalendarPostDto>>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ApiResponse<IReadOnlyList<CalendarPostDto>>> GetByMonthAsync(int year, int month, CancellationToken cancellationToken = default);
    Task<ApiResponse<IReadOnlyList<CalendarPostDto>>> GetByClientIdAsync(long clientId, CancellationToken cancellationToken = default);
    Task<ApiResponse<CalendarPostDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<ApiResponse<CalendarPostDto>> CreateAsync(CreateCalendarPostDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<CalendarPostDto>> UpdateAsync(long id, UpdateCalendarPostDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default);
}
