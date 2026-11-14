using AdrianCrea.Application.Common;
using AdrianCrea.Application.DTOs;
using AdrianCrea.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AdrianCrea.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountingController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public AccountingController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(ApiResponse<AccountingSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary([FromQuery] int? month, [FromQuery] int? year, CancellationToken cancellationToken)
    {
        var targetMonth = month ?? DateTime.UtcNow.Month - 1; // 0-indexed month
        var targetYear = year ?? DateTime.UtcNow.Year;

        var result = await _paymentService.GetMonthlySummaryAsync(targetMonth, targetYear, cancellationToken);
        return Ok(result);
    }
}
