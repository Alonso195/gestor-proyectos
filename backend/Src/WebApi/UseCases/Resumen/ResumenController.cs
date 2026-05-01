using Application.Common.Models;
using Application.UseCases.Resumen;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.UseCases.Resumen;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResumenController : ControllerBase
{
    private readonly IResumenUseCases _resumen;

    public ResumenController(IResumenUseCases resumen) => _resumen = resumen;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ResumenDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get()
    {
        var data = await _resumen.GetAsync();
        return Ok(ApiResponse<ResumenDto>.Ok(data));
    }
}
