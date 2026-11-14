using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AdrianCrea.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<PaymentDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _paymentService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto, CancellationToken cancellationToken)
    {
        var result = await _paymentService.CreateAsync(dto, cancellationToken);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(long id, [FromBody] CreatePaymentDto dto, CancellationToken cancellationToken)
    {
        var result = await _paymentService.UpdateAsync(id, dto, cancellationToken);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        var result = await _paymentService.DeleteAsync(id, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
