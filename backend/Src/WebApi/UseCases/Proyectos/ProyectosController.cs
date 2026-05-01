using Application.Common.Models;
using Application.UseCases.Proyectos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.UseCases.Proyectos;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProyectosController : ControllerBase
{
    private readonly IProyectoUseCases _proyectoUseCases;

    public ProyectosController(IProyectoUseCases proyectoUseCases) => _proyectoUseCases = proyectoUseCases;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ProyectoDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPaged([FromQuery] int pagina = 1, [FromQuery] int tamanoPagina = 10)
    {
        var result = await _proyectoUseCases.GetPagedAsync(new GetProyectosPagedRequest(pagina, tamanoPagina));
        return Ok(ApiResponse<PagedResult<ProyectoDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<ProyectoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await _proyectoUseCases.GetByIdAsync(new GetProyectoByIdRequest(id));
        return Ok(ApiResponse<ProyectoDto>.Ok(result));
    }

    [HttpPost]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(typeof(ApiResponse<ProyectoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateProyectoRequest request)
    {
        var usuarioId = GetCurrentUserId();
        var result = await _proyectoUseCases.CreateAsync(request, usuarioId);
        return Ok(ApiResponse<ProyectoDto>.Ok(result));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(typeof(ApiResponse<ProyectoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] CreateProyectoRequest request)
    {
        var update = new UpdateProyectoRequest(
            id,
            request.Nombre,
            request.Descripcion,
            request.FechaInicio,
            request.FechaFin,
            request.EstadoId);
        var result = await _proyectoUseCases.UpdateAsync(update);
        return Ok(ApiResponse<ProyectoDto>.Ok(result));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await _proyectoUseCases.DeleteAsync(new DeleteProyectoRequest(id));
        return Ok(ApiResponse<object?>.Ok(null, "Proyecto eliminado."));
    }

    private int GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");
        if (string.IsNullOrEmpty(sub) || !int.TryParse(sub, out var id))
            throw new UnauthorizedAccessException("No se pudo determinar el usuario autenticado.");
        return id;
    }
}
