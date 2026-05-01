using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IProyectoRepository
{
    Task<(IEnumerable<Proyecto> Items, int Total)> GetPagedAsync(int pagina, int tamanoPagina);
    Task<Proyecto?> GetByIdAsync(int id);
    Task<int> CreateAsync(Proyecto proyecto);
    Task UpdateAsync(Proyecto proyecto);
    Task DeleteAsync(int id);
    Task<int> CountTareasPendienteOEnProgresoPorProyectoAsync(int proyectoId);
    Task<int> CountTareasNoCompletadaNiCanceladaPorProyectoAsync(int proyectoId);
}
