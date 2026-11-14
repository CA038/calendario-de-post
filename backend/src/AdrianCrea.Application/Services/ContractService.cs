using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using AdrianCrea.Domain.Entities;
using AdrianCrea.Domain.Interfaces;

namespace AdrianCrea.Application.Services;

public class ContractService : IContractService
{
    private readonly IUnitOfWork _unitOfWork;

    public ContractService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IReadOnlyList<ContractDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var contracts = await _unitOfWork.Contracts.GetAllAsync(cancellationToken);
        var dtos = contracts.Select(MapToDto).ToList();
        return ApiResponse<IReadOnlyList<ContractDto>>.Ok(dtos);
    }

    public async Task<ApiResponse<ContractDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        var contract = await _unitOfWork.Contracts.GetByIdAsync(id, cancellationToken);
        if (contract == null)
            return ApiResponse<ContractDto>.Fail("Contrato no encontrado");

        return ApiResponse<ContractDto>.Ok(MapToDto(contract));
    }

    public async Task<ApiResponse<ContractDto>> CreateAsync(CreateContractDto dto, CancellationToken cancellationToken = default)
    {
        var contract = new Contract
        {
            ClientId = dto.ClientId,
            ClientName = dto.ClientName,
            BrandName = dto.BrandName,
            PlanName = dto.PlanName,
            PostsCount = dto.PostsCount,
            ReelsCount = dto.ReelsCount,
            StoriesCount = dto.StoriesCount,
            Currency = dto.Currency,
            Price = dto.Price,
            StartDate = dto.StartDate,
            Duration = dto.Duration,
            FirstMonthTerms = dto.FirstMonthTerms,
            RecurringDay = dto.RecurringDay,
            Revisions = dto.Revisions,
            CustomNotes = dto.CustomNotes,
            Status = dto.Status ?? "active"
        };

        var created = await _unitOfWork.Contracts.AddAsync(contract, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<ContractDto>.Ok(MapToDto(created), "Contrato creado exitosamente");
    }

    public async Task<ApiResponse<ContractDto>> UpdateAsync(long id, CreateContractDto dto, CancellationToken cancellationToken = default)
    {
        var contract = await _unitOfWork.Contracts.GetByIdAsync(id, cancellationToken);
        if (contract == null)
            return ApiResponse<ContractDto>.Fail("Contrato no encontrado para actualizar");

        contract.ClientId = dto.ClientId;
        contract.ClientName = dto.ClientName;
        contract.BrandName = dto.BrandName;
        contract.PlanName = dto.PlanName;
        contract.PostsCount = dto.PostsCount;
        contract.ReelsCount = dto.ReelsCount;
        contract.StoriesCount = dto.StoriesCount;
        contract.Currency = dto.Currency;
        contract.Price = dto.Price;
        contract.StartDate = dto.StartDate;
        contract.Duration = dto.Duration;
        contract.FirstMonthTerms = dto.FirstMonthTerms;
        contract.RecurringDay = dto.RecurringDay;
        contract.Revisions = dto.Revisions;
        contract.CustomNotes = dto.CustomNotes;
        contract.Status = dto.Status ?? contract.Status;
        contract.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Contracts.UpdateAsync(contract, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<ContractDto>.Ok(MapToDto(contract), "Contrato actualizado exitosamente");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var contract = await _unitOfWork.Contracts.GetByIdAsync(id, cancellationToken);
        if (contract == null)
            return ApiResponse<bool>.Fail("Contrato no encontrado");

        await _unitOfWork.Contracts.DeleteAsync(contract, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<bool>.Ok(true, "Contrato eliminado exitosamente");
    }

    private static ContractDto MapToDto(Contract ct) => new()
    {
        Id = ct.Id,
        ClientId = ct.ClientId,
        ClientName = ct.ClientName,
        BrandName = ct.BrandName,
        PlanName = ct.PlanName,
        PostsCount = ct.PostsCount,
        ReelsCount = ct.ReelsCount,
        StoriesCount = ct.StoriesCount,
        Currency = ct.Currency,
        Price = ct.Price,
        StartDate = ct.StartDate,
        Duration = ct.Duration,
        FirstMonthTerms = ct.FirstMonthTerms,
        RecurringDay = ct.RecurringDay,
        Revisions = ct.Revisions,
        CustomNotes = ct.CustomNotes,
        Status = ct.Status,
        CreatedAt = ct.CreatedAt
    };
}
