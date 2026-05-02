using Application.Common.Models;
using Application.UseCases.Tareas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.UseCases.Tareas;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TareasController : ControllerBase
{
    private readonly ITareaUseCases _tareaUseCases;

    public TareasController(ITareaUseCases tareaUseCases) => _tareaUseCases = tareaUseCases;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<TareaDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int proyectoId,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanoPagina = 10)
    {
        var result = await _tareaUseCases.GetPagedAsync(new GetTareasPagedRequest(proyectoId, pagina, tamanoPagina));
        return Ok(ApiResponse<PagedResult<TareaDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<TareaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await _tareaUseCases.GetByIdAsync(new GetTareaByIdRequest(id));
        return Ok(ApiResponse<TareaDto>.Ok(result));
    }

    [HttpPost]
    [Authorize(Roles = "Administrador,Colaborador")]
    [ProducesResponseType(typeof(ApiResponse<TareaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateTareaRequest request)
    {
        var result = await _tareaUseCases.CreateAsync(request);
        return Ok(ApiResponse<TareaDto>.Ok(result));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Administrador,Colaborador")]
    [ProducesResponseType(typeof(ApiResponse<TareaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateTareaRequestBody body)
    {
        var update = new UpdateTareaRequest(
            id,
            body.Titulo,
            body.Descripcion,
            body.PrioridadId,
            body.UsuarioAsignadoId,
            body.FechaLimite);
        var result = await _tareaUseCases.UpdateAsync(update);
        return Ok(ApiResponse<TareaDto>.Ok(result));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await _tareaUseCases.DeleteAsync(new DeleteTareaRequest(id));
        return Ok(ApiResponse<object?>.Ok(null, "Tarea eliminada."));
    }

    [HttpPatch("{id:int}/estado")]
    [Authorize(Roles = "Administrador,Colaborador")]
    [ProducesResponseType(typeof(ApiResponse<TareaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> PatchEstado([FromRoute] int id, [FromBody] ChangeEstadoBody body)
    {
        var result = await _tareaUseCases.ChangeEstadoAsync(new ChangeEstadoTareaRequest(id, body.EstadoId));
        return Ok(ApiResponse<TareaDto>.Ok(result));
    }
}

public record UpdateTareaRequestBody(
    string Titulo,
    string? Descripcion,
    int PrioridadId,
    int? UsuarioAsignadoId,
    DateTime FechaLimite);

public record ChangeEstadoBody(int EstadoId);
