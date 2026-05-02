using Application.Common.Catalogs;
using Application.Common.Exceptions;
using Application.Common.Models;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;

namespace Application.UseCases.Tareas;

public interface ITareaUseCases : IUseCase
{
    Task<PagedResult<TareaDto>> GetPagedAsync(GetTareasPagedRequest request);
    Task<TareaDto> GetByIdAsync(GetTareaByIdRequest request);
    Task<TareaDto> CreateAsync(CreateTareaRequest request);
    Task<TareaDto> UpdateAsync(UpdateTareaRequest request);
    Task DeleteAsync(DeleteTareaRequest request);
    Task<TareaDto> ChangeEstadoAsync(ChangeEstadoTareaRequest request);
}

public class TareaUseCases : ITareaUseCases
{
    private readonly ITareaRepository _tareas;
    private readonly IProyectoRepository _proyectos;

    public TareaUseCases(ITareaRepository tareas, IProyectoRepository proyectos)
    {
        _tareas = tareas;
        _proyectos = proyectos;
    }

    public async Task<PagedResult<TareaDto>> GetPagedAsync(GetTareasPagedRequest request)
    {
        if (await _proyectos.GetByIdAsync(request.ProyectoId) is null)
            throw new NotFoundException($"No se encontró el proyecto con id {request.ProyectoId}.");

        var pagina = Math.Max(1, request.Pagina);
        var tamano = Math.Clamp(request.TamanoPagina, 1, 100);
        var (items, total) = await _tareas.GetPagedByProyectoAsync(request.ProyectoId, pagina, tamano);
        return new PagedResult<TareaDto>
        {
            Items = items.Select(TareaDto.FromEntity),
            Total = total,
            Pagina = pagina,
            TamanoPagina = tamano
        };
    }

    public async Task<TareaDto> GetByIdAsync(GetTareaByIdRequest request)
    {
        var t = await _tareas.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"No se encontró la tarea con id {request.Id}.");
        return TareaDto.FromEntity(t);
    }

    public async Task<TareaDto> CreateAsync(CreateTareaRequest request)
    {
        if (await _proyectos.GetByIdAsync(request.ProyectoId) is null)
            throw new NotFoundException($"No se encontró el proyecto con id {request.ProyectoId}.");

        var entity = new Tarea
        {
            ProyectoId = request.ProyectoId,
            Titulo = request.Titulo,
            Descripcion = request.Descripcion,
            PrioridadId = request.PrioridadId,
            EstadoId = EstadosCatalogo.Pendiente,
            UsuarioAsignadoId = request.UsuarioAsignadoId,
            FechaLimite = request.FechaLimite
        };

        var id = await _tareas.CreateAsync(entity);
        var created = await _tareas.GetByIdAsync(id)
            ?? throw new NotFoundException("No se pudo recuperar la tarea recién creada.");
        return TareaDto.FromEntity(created);
    }

    public async Task<TareaDto> UpdateAsync(UpdateTareaRequest request)
    {
        var existing = await _tareas.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"No se encontró la tarea con id {request.Id}.");

        var updated = new Tarea
        {
            Id = request.Id,
            ProyectoId = existing.ProyectoId,
            Titulo = request.Titulo,
            Descripcion = request.Descripcion,
            PrioridadId = request.PrioridadId,
            EstadoId = existing.EstadoId,
            UsuarioAsignadoId = request.UsuarioAsignadoId,
            FechaLimite = request.FechaLimite,
            FechaCreacion = existing.FechaCreacion
        };

        await _tareas.UpdateAsync(updated);
        var result = await _tareas.GetByIdAsync(request.Id)
            ?? throw new NotFoundException($"No se encontró la tarea con id {request.Id}.");
        return TareaDto.FromEntity(result);
    }

    public async Task DeleteAsync(DeleteTareaRequest request)
    {
        if (await _tareas.GetByIdAsync(request.Id) is null)
            throw new NotFoundException($"No se encontró la tarea con id {request.Id}.");
        await _tareas.DeleteAsync(request.Id);
    }

    public async Task<TareaDto> ChangeEstadoAsync(ChangeEstadoTareaRequest request)
    {
        var tarea = await _tareas.GetByIdAsync(request.TareaId)
            ?? throw new NotFoundException($"No se encontró la tarea con id {request.TareaId}.");

        if (!IsValidEstadoTransition(tarea.EstadoId, request.EstadoId))
            throw new BusinessException("La transición de estado solicitada no es válida.");

        if (request.EstadoId == EstadosCatalogo.Completada)
        {
            var proyecto = await _proyectos.GetByIdAsync(tarea.ProyectoId)
                ?? throw new NotFoundException($"No se encontró el proyecto con id {tarea.ProyectoId}.");
            if (proyecto.EstadoId == EstadosCatalogo.Cancelada)
                throw new BusinessException("No se puede completar una tarea cuyo proyecto está cancelado.");
        }

        await _tareas.ChangeEstadoAsync(request.TareaId, request.EstadoId);
        var result = await _tareas.GetByIdAsync(request.TareaId)
            ?? throw new NotFoundException($"No se encontró la tarea con id {request.TareaId}.");
        return TareaDto.FromEntity(result);
    }

    private static bool IsValidEstadoTransition(int desde, int hacia)
    {
        if (desde == hacia)
            return true;

        return desde switch
        {
            EstadosCatalogo.Pendiente => hacia is EstadosCatalogo.EnProgreso or EstadosCatalogo.Cancelada,
            EstadosCatalogo.EnProgreso => hacia is EstadosCatalogo.Pendiente
                or EstadosCatalogo.Completada
                or EstadosCatalogo.Cancelada,
            EstadosCatalogo.Completada => false,
            EstadosCatalogo.Cancelada => false,
            _ => false
        };
    }
}
