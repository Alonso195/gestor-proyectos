using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface ITareaRepository
{
    Task<(IEnumerable<Tarea> Items, int Total)> GetPagedByProyectoAsync(int proyectoId, int pagina, int tamanoPagina);
    Task<Tarea?> GetByIdAsync(int id);
    Task<int> CreateAsync(Tarea tarea);
    Task UpdateAsync(Tarea tarea);
    Task DeleteAsync(int id);
    Task ChangeEstadoAsync(int id, int estadoId);
}
