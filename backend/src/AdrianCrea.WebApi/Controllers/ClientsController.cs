using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AdrianCrea.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ClientDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _clientService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<ClientDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ClientDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken)
    {
        var result = await _clientService.GetByIdAsync(id, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ClientDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<ClientDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateClientDto dto, CancellationToken cancellationToken)
    {
        var result = await _clientService.CreateAsync(dto, cancellationToken);
        return result.Success ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result) : BadRequest(result);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<ClientDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ClientDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateClientDto dto, CancellationToken cancellationToken)
    {
        var result = await _clientService.UpdateAsync(id, dto, cancellationToken);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        var result = await _clientService.DeleteAsync(id, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
