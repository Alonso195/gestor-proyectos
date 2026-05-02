using Domain.Entities;

namespace Application.UseCases.Tareas;

public record GetTareasPagedRequest(int ProyectoId, int Pagina, int TamanoPagina);

public record GetTareaByIdRequest(int Id);

public record CreateTareaRequest(
    int ProyectoId,
    string Titulo,
    string? Descripcion,
    int PrioridadId,
    int? UsuarioAsignadoId,
    DateTime FechaLimite);

public record UpdateTareaRequest(
    int Id,
    string Titulo,
    string? Descripcion,
    int PrioridadId,
    int? UsuarioAsignadoId,
    DateTime FechaLimite);

public record DeleteTareaRequest(int Id);

public record ChangeEstadoTareaRequest(int TareaId, int EstadoId);

public record TareaDto(
    int Id,
    int ProyectoId,
    string ProyectoNombre,
    string Titulo,
    string? Descripcion,
    int PrioridadId,
    string PrioridadNombre,
    int EstadoId,
    string EstadoNombre,
    int? UsuarioAsignadoId,
    string? UsuarioAsignadoNombre,
    DateTime FechaLimite,
    DateTime FechaCreacion)
{
    public static TareaDto FromEntity(Tarea t) => new(
        t.Id,
        t.ProyectoId,
        t.ProyectoNombre,
        t.Titulo,
        t.Descripcion,
        t.PrioridadId,
        t.PrioridadNombre,
        t.EstadoId,
        t.EstadoNombre,
        t.UsuarioAsignadoId,
        t.UsuarioAsignadoNombre,
        t.FechaLimite,
        t.FechaCreacion);
}
