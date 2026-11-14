using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using AdrianCrea.Domain.Entities;
using AdrianCrea.Domain.Interfaces;

namespace AdrianCrea.Application.Services;

public class CalendarPostService : ICalendarPostService
{
    private readonly IUnitOfWork _unitOfWork;

    public CalendarPostService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IReadOnlyList<CalendarPostDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var posts = await _unitOfWork.CalendarPosts.GetAllAsync(cancellationToken);
            var dtos = posts.OrderBy(p => p.ScheduledDate).Select(MapToDto).ToList();
            return ApiResponse<IReadOnlyList<CalendarPostDto>>.Ok(dtos);
        }
        catch (Exception ex)
        {
            return ApiResponse<IReadOnlyList<CalendarPostDto>>.Fail($"Error al cargar publicaciones del calendario: {ex.Message}");
        }
    }

    public async Task<ApiResponse<IReadOnlyList<CalendarPostDto>>> GetByMonthAsync(int year, int month, CancellationToken cancellationToken = default)
    {
        try
        {
            var posts = await _unitOfWork.CalendarPosts.GetByMonthAsync(year, month, cancellationToken);
            var dtos = posts.OrderBy(p => p.ScheduledDate).Select(MapToDto).ToList();
            return ApiResponse<IReadOnlyList<CalendarPostDto>>.Ok(dtos);
        }
        catch (Exception ex)
        {
            return ApiResponse<IReadOnlyList<CalendarPostDto>>.Fail($"Error al filtrar publicaciones: {ex.Message}");
        }
    }

    public async Task<ApiResponse<IReadOnlyList<CalendarPostDto>>> GetByClientIdAsync(long clientId, CancellationToken cancellationToken = default)
    {
        try
        {
            var posts = await _unitOfWork.CalendarPosts.GetByClientIdAsync(clientId, cancellationToken);
            var dtos = posts.OrderBy(p => p.ScheduledDate).Select(MapToDto).ToList();
            return ApiResponse<IReadOnlyList<CalendarPostDto>>.Ok(dtos);
        }
        catch (Exception ex)
        {
            return ApiResponse<IReadOnlyList<CalendarPostDto>>.Fail($"Error al cargar publicaciones del cliente: {ex.Message}");
        }
    }

    public async Task<ApiResponse<CalendarPostDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        try
        {
            var post = await _unitOfWork.CalendarPosts.GetByIdAsync(id, cancellationToken);
            if (post == null)
            {
                return ApiResponse<CalendarPostDto>.Fail("Publicación no encontrada.");
            }

            return ApiResponse<CalendarPostDto>.Ok(MapToDto(post));
        }
        catch (Exception ex)
        {
            return ApiResponse<CalendarPostDto>.Fail($"Error al consultar publicación: {ex.Message}");
        }
    }

    public async Task<ApiResponse<CalendarPostDto>> CreateAsync(CreateCalendarPostDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return ApiResponse<CalendarPostDto>.Fail("El título de la publicación es obligatorio.");
            }

            var post = new CalendarPost
            {
                ClientId = dto.ClientId,
                ClientName = dto.ClientName,
                BrandColor = dto.BrandColor ?? "#ff7a00",
                Title = dto.Title.Trim(),
                PostType = dto.PostType?.ToLower() ?? "post",
                Status = dto.Status?.ToLower() ?? "idea",
                ScheduledDate = dto.ScheduledDate,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.CalendarPosts.AddAsync(post, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            return ApiResponse<CalendarPostDto>.Ok(MapToDto(post), "Publicación programada exitosamente.");
        }
        catch (Exception ex)
        {
            return ApiResponse<CalendarPostDto>.Fail($"No se pudo registrar la publicación: {ex.Message}");
        }
    }

    public async Task<ApiResponse<CalendarPostDto>> UpdateAsync(long id, UpdateCalendarPostDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var post = await _unitOfWork.CalendarPosts.GetByIdAsync(id, cancellationToken);
            if (post == null)
            {
                return ApiResponse<CalendarPostDto>.Fail("Publicación no encontrada.");
            }

            post.Title = dto.Title.Trim();
            post.PostType = dto.PostType?.ToLower() ?? "post";
            post.Status = dto.Status?.ToLower() ?? "idea";
            post.ScheduledDate = dto.ScheduledDate;
            post.Notes = dto.Notes;
            post.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.CalendarPosts.UpdateAsync(post, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            return ApiResponse<CalendarPostDto>.Ok(MapToDto(post), "Publicación actualizada exitosamente.");
        }
        catch (Exception ex)
        {
            return ApiResponse<CalendarPostDto>.Fail($"Error al actualizar la publicación: {ex.Message}");
        }
    }

    public async Task<ApiResponse<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        try
        {
            var post = await _unitOfWork.CalendarPosts.GetByIdAsync(id, cancellationToken);
            if (post == null)
            {
                return ApiResponse<bool>.Fail("Publicación no encontrada.");
            }

            await _unitOfWork.CalendarPosts.DeleteAsync(post, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            return ApiResponse<bool>.Ok(true, "Publicación eliminada correctamente.");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Fail($"Error al eliminar la publicación: {ex.Message}");
        }
    }

    private static CalendarPostDto MapToDto(CalendarPost post)
    {
        return new CalendarPostDto
        {
            Id = post.Id,
            ClientId = post.ClientId,
            ClientName = post.ClientName,
            BrandColor = post.BrandColor,
            Title = post.Title,
            PostType = post.PostType,
            Status = post.Status,
            ScheduledDate = post.ScheduledDate,
            Notes = post.Notes,
            CreatedAt = post.CreatedAt
        };
    }
}
