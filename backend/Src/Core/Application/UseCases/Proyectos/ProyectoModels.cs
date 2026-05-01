using Domain.Entities;

namespace Application.UseCases.Proyectos;

public record GetProyectosPagedRequest(int Pagina, int TamanoPagina);

public record GetProyectoByIdRequest(int Id);

public record CreateProyectoRequest(
    string Nombre,
    string? Descripcion,
    DateTime FechaInicio,
    DateTime FechaFin,
    int EstadoId);

public record UpdateProyectoRequest(
    int Id,
    string Nombre,
    string? Descripcion,
    DateTime FechaInicio,
    DateTime FechaFin,
    int EstadoId);

public record DeleteProyectoRequest(int Id);

public record ProyectoDto(
    int Id,
    string Nombre,
    string? Descripcion,
    DateTime FechaInicio,
    DateTime FechaFin,
    int EstadoId,
    string EstadoNombre,
    int CreadoPorId,
    string CreadoPorNombre,
    DateTime FechaCreacion)
{
    public static ProyectoDto FromEntity(Proyecto p) => new(
        p.Id,
        p.Nombre,
        p.Descripcion,
        p.FechaInicio,
        p.FechaFin,
        p.EstadoId,
        p.EstadoNombre,
        p.CreadoPorId,
        p.CreadoPorNombre,
        p.FechaCreacion);
}
