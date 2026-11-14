using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AdrianCrea.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly IContractService _contractService;

    public ContractsController(IContractService contractService)
    {
        _contractService = contractService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ContractDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _contractService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<ContractDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ContractDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken)
    {
        var result = await _contractService.GetByIdAsync(id, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ContractDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<ContractDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateContractDto dto, CancellationToken cancellationToken)
    {
        var result = await _contractService.CreateAsync(dto, cancellationToken);
        return result.Success ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result) : BadRequest(result);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<ContractDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ContractDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(long id, [FromBody] CreateContractDto dto, CancellationToken cancellationToken)
    {
        var result = await _contractService.UpdateAsync(id, dto, cancellationToken);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        var result = await _contractService.DeleteAsync(id, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
