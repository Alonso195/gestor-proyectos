using Application.Common.Catalogs;
using Application.Common.Exceptions;
using Application.Common.Models;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;

namespace Application.UseCases.Proyectos;

public interface IProyectoUseCases : IUseCase
{
    Task<PagedResult<ProyectoDto>> GetPagedAsync(GetProyectosPagedRequest request);
    Task<ProyectoDto> GetByIdAsync(GetProyectoByIdRequest request);
    Task<ProyectoDto> CreateAsync(CreateProyectoRequest request, int creadoPorUsuarioId);
    Task<ProyectoDto> UpdateAsync(UpdateProyectoRequest request);
    Task DeleteAsync(DeleteProyectoRequest request);
}

public class ProyectoUseCases : IProyectoUseCases
{
    private readonly IProyectoRepository _repo;

    public ProyectoUseCases(IProyectoRepository repo) => _repo = repo;

    public async Task<PagedResult<ProyectoDto>> GetPagedAsync(GetProyectosPagedRequest request)
    {
        var pagina = Math.Max(1, request.Pagina);
        var tamano = Math.Clamp(request.TamanoPagina, 1, 100);
        var (items, total) = await _repo.GetPagedAsync(pagina, tamano);
        return new PagedResult<ProyectoDto>
        {
            Items = items.Select(ProyectoDto.FromEntity),
            Total = total,
            Pagina = pagina,
            TamanoPagina = tamano
        };
    }

    public async Task<ProyectoDto> GetByIdAsync(GetProyectoByIdRequest request)
    {
        var proyecto = await _repo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"No se encontró el proyecto con id {request.Id}.");
        return ProyectoDto.FromEntity(proyecto);
    }

    public async Task<ProyectoDto> CreateAsync(CreateProyectoRequest request, int creadoPorUsuarioId)
    {
        EnsureFechasProyectoValidas(request.FechaInicio, request.FechaFin);

        var entity = new Proyecto
        {
            Nombre = request.Nombre,
            Descripcion = request.Descripcion,
            FechaInicio = request.FechaInicio,
            FechaFin = request.FechaFin,
            EstadoId = request.EstadoId,
            CreadoPorId = creadoPorUsuarioId
        };

        var id = await _repo.CreateAsync(entity);
        var created = await _repo.GetByIdAsync(id)
            ?? throw new NotFoundException("No se pudo recuperar el proyecto recién creado.");
        return ProyectoDto.FromEntity(created);
    }

    public async Task<ProyectoDto> UpdateAsync(UpdateProyectoRequest request)
    {
        EnsureFechasProyectoValidas(request.FechaInicio, request.FechaFin);

        var existing = await _repo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"No se encontró el proyecto con id {request.Id}.");

        var isCompleting = request.EstadoId == EstadosCatalogo.Completada
            && existing.EstadoId != EstadosCatalogo.Completada;

        if (isCompleting)
        {
            var bloqueadas = await _repo.CountTareasNoCompletadaNiCanceladaPorProyectoAsync(request.Id);
            if (bloqueadas > 0)
                throw new BusinessException(
                    "No se puede completar el proyecto mientras existan tareas que no estén en estado Completada o Cancelada.");
        }

        var updated = new Proyecto
        {
            Id = request.Id,
            Nombre = request.Nombre,
            Descripcion = request.Descripcion,
            FechaInicio = request.FechaInicio,
            FechaFin = request.FechaFin,
            EstadoId = request.EstadoId,
            CreadoPorId = existing.CreadoPorId,
            FechaCreacion = existing.FechaCreacion
        };

        await _repo.UpdateAsync(updated);
        var result = await _repo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"No se encontró el proyecto con id {request.Id}.");
        return ProyectoDto.FromEntity(result);
    }

    public async Task DeleteAsync(DeleteProyectoRequest request)
    {
        if (await _repo.GetByIdAsync(request.Id) is null)
            throw new NotFoundException($"No se encontró el proyecto con id {request.Id}.");

        var activas = await _repo.CountTareasPendienteOEnProgresoPorProyectoAsync(request.Id);
        if (activas > 0)
            throw new BusinessException(
                "No se puede eliminar el proyecto porque tiene tareas en estado Pendiente o En Progreso.");

        await _repo.DeleteAsync(request.Id);
    }

    private static void EnsureFechasProyectoValidas(DateTime fechaInicio, DateTime fechaFin)
    {
        if (fechaFin < fechaInicio)
            throw new BusinessException("La fecha de fin debe ser mayor o igual a la fecha de inicio.");
    }
}
