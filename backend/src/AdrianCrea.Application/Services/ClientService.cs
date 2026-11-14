using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using AdrianCrea.Domain.Entities;
using AdrianCrea.Domain.Interfaces;

namespace AdrianCrea.Application.Services;

public class ClientService : IClientService
{
    private readonly IUnitOfWork _unitOfWork;

    public ClientService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IReadOnlyList<ClientDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var clients = await _unitOfWork.Clients.GetAllAsync(cancellationToken);
        var dtos = clients.Select(MapToDto).ToList();
        return ApiResponse<IReadOnlyList<ClientDto>>.Ok(dtos);
    }

    public async Task<ApiResponse<ClientDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        var client = await _unitOfWork.Clients.GetByIdAsync(id, cancellationToken);
        if (client == null)
            return ApiResponse<ClientDto>.Fail("Cliente no encontrado");

        return ApiResponse<ClientDto>.Ok(MapToDto(client));
    }

    public async Task<ApiResponse<ClientDto>> CreateAsync(CreateClientDto dto, CancellationToken cancellationToken = default)
    {
        var client = new Client
        {
            Name = dto.Name,
            Description = dto.BrandName,
            ContactEmail = dto.Email,
            ContactPhone = dto.Phone,
            SecondaryPhone = dto.SecondaryPhone,
            WebsiteUrl = dto.WebsiteUrl,
            Notes = dto.Notes,
            ClientType = dto.Category ?? "active",
            BrandColor = dto.BrandColor ?? "#ff7a00",
            LogoText = string.IsNullOrWhiteSpace(dto.LogoText) ? (dto.Name.Length >= 2 ? dto.Name[..2].ToUpper() : "AR") : dto.LogoText,
            LogoUrl = dto.LogoUrl,
            PlanName = dto.PlanName ?? "Plan Crecimiento",
            TargetPostsCount = dto.MonthlyPostsLimit ?? 0,
            TargetReelsCount = dto.MonthlyReelsLimit ?? 0,
            StoriesCount = dto.StoriesCount ?? 12,
            Currency = dto.Currency ?? "HNL",
            MonthlyPrice = dto.MonthlyPrice ?? 0m,
            BillingDay = dto.BillingDay.HasValue && dto.BillingDay.Value > 0 ? dto.BillingDay.Value : 15,
            IsActive = true,
            AccessToken = $"tok_{Guid.NewGuid():N}"[..18]
        };

        var created = await _unitOfWork.Clients.AddAsync(client, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<ClientDto>.Ok(MapToDto(created), "Cliente creado exitosamente");
    }

    public async Task<ApiResponse<ClientDto>> UpdateAsync(long id, UpdateClientDto dto, CancellationToken cancellationToken = default)
    {
        var client = await _unitOfWork.Clients.GetByIdAsync(id, cancellationToken);
        if (client == null)
            return ApiResponse<ClientDto>.Fail("Cliente no encontrado para actualizar");

        client.Name = dto.Name;
        client.Description = dto.BrandName;
        client.ContactEmail = dto.Email;
        client.ContactPhone = dto.Phone;
        client.SecondaryPhone = dto.SecondaryPhone;
        client.WebsiteUrl = dto.WebsiteUrl;
        client.Notes = dto.Notes;
        client.ClientType = dto.Category ?? client.ClientType;
        client.BrandColor = dto.BrandColor ?? client.BrandColor;
        client.LogoText = dto.LogoText ?? client.LogoText;
        client.LogoUrl = dto.LogoUrl;
        client.PlanName = dto.PlanName ?? client.PlanName;
        client.TargetPostsCount = dto.MonthlyPostsLimit ?? client.TargetPostsCount;
        client.TargetReelsCount = dto.MonthlyReelsLimit ?? client.TargetReelsCount;
        client.StoriesCount = dto.StoriesCount ?? client.StoriesCount;
        client.Currency = dto.Currency ?? client.Currency;
        client.MonthlyPrice = dto.MonthlyPrice ?? client.MonthlyPrice;
        client.BillingDay = dto.BillingDay.HasValue && dto.BillingDay.Value > 0 ? dto.BillingDay.Value : client.BillingDay;
        client.IsActive = dto.IsActive;
        client.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Clients.UpdateAsync(client, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<ClientDto>.Ok(MapToDto(client), "Cliente actualizado exitosamente");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var client = await _unitOfWork.Clients.GetByIdAsync(id, cancellationToken);
        if (client == null)
            return ApiResponse<bool>.Fail("Cliente no encontrado");

        await _unitOfWork.Clients.DeleteAsync(client, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return ApiResponse<bool>.Ok(true, "Cliente eliminado exitosamente");
    }

    private static ClientDto MapToDto(Client c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        BrandName = c.Description,
        Category = c.ClientType ?? "active",
        Email = c.ContactEmail,
        Phone = c.ContactPhone,
        SecondaryPhone = c.SecondaryPhone,
        WebsiteUrl = c.WebsiteUrl,
        Notes = c.Notes,
        BrandColor = c.BrandColor,
        LogoText = c.LogoText,
        LogoUrl = c.LogoUrl,
        PlanName = c.PlanName ?? "Plan Crecimiento",
        MonthlyPostsLimit = c.TargetPostsCount,
        MonthlyReelsLimit = c.TargetReelsCount,
        StoriesCount = c.StoriesCount,
        Currency = c.Currency ?? "HNL",
        MonthlyPrice = c.MonthlyPrice,
        BillingDay = c.BillingDay,
        IsActive = c.IsActive,
        CreatedAt = c.CreatedAt
    };
}
