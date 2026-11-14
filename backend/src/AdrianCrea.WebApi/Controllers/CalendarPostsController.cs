using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AdrianCrea.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CalendarPostsController : ControllerBase
{
    private readonly ICalendarPostService _calendarPostService;

    public CalendarPostsController(ICalendarPostService calendarPostService)
    {
        _calendarPostService = calendarPostService;
    }

    /// <summary>
    /// Obtiene todas las publicaciones programadas en el calendario.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CalendarPostDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _calendarPostService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene publicaciones programadas para un mes y año específicos.
    /// </summary>
    [HttpGet("month")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CalendarPostDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByMonth([FromQuery] int year, [FromQuery] int month, CancellationToken cancellationToken)
    {
        var result = await _calendarPostService.GetByMonthAsync(year, month, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene las publicaciones asociadas a un cliente específico.
    /// </summary>
    [HttpGet("client/{clientId:long}")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CalendarPostDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByClient(long clientId, CancellationToken cancellationToken)
    {
        var result = await _calendarPostService.GetByClientIdAsync(clientId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene el detalle de una publicación por su identificador.
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<CalendarPostDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CalendarPostDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken)
    {
        var result = await _calendarPostService.GetByIdAsync(id, cancellationToken);
        if (!result.Success)
            return NotFound(result);

        return Ok(result);
    }

    /// <summary>
    /// Crea y programa una nueva publicación o reel en el calendario.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CalendarPostDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<CalendarPostDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateCalendarPostDto dto, CancellationToken cancellationToken)
    {
        var result = await _calendarPostService.CreateAsync(dto, cancellationToken);
        if (!result.Success)
            return BadRequest(result);

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    /// <summary>
    /// Actualiza el estado, tipo, fecha u observaciones de una publicación programada.
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<CalendarPostDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CalendarPostDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCalendarPostDto dto, CancellationToken cancellationToken)
    {
        var result = await _calendarPostService.UpdateAsync(id, dto, cancellationToken);
        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Elimina una publicación del calendario.
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        var result = await _calendarPostService.DeleteAsync(id, cancellationToken);
        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}
