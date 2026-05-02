using System.Data;
using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace DataAccess.Repositories;

public class TareaRepository : ITareaRepository
{
    private readonly string _connectionString;

    public TareaRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<(IEnumerable<Tarea> Items, int Total)> GetPagedByProyectoAsync(
        int proyectoId, int pagina, int tamanoPagina)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        using var multi = await conn.QueryMultipleAsync(
            "sp_ListarTareasPorProyectoPaginado",
            new { ProyectoId = proyectoId, Pagina = pagina, TamanoPagina = tamanoPagina },
            commandType: CommandType.StoredProcedure);

        var items = (await multi.ReadAsync<Tarea>()).ToList();
        var total = await multi.ReadSingleAsync<int>();
        return (items, total);
    }

    public async Task<Tarea?> GetByIdAsync(int id)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryFirstOrDefaultAsync<Tarea>(
            "sp_ObtenerTareaPorId",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> CreateAsync(Tarea tarea)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QuerySingleAsync<int>(
            "sp_InsertarTarea",
            new
            {
                tarea.ProyectoId,
                tarea.Titulo,
                tarea.Descripcion,
                tarea.PrioridadId,
                tarea.UsuarioAsignadoId,
                tarea.FechaLimite
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task UpdateAsync(Tarea tarea)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.ExecuteAsync(
            "sp_ActualizarTarea",
            new
            {
                tarea.Id,
                tarea.Titulo,
                tarea.Descripcion,
                tarea.PrioridadId,
                tarea.UsuarioAsignadoId,
                tarea.FechaLimite
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task DeleteAsync(int id)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.ExecuteAsync(
            "sp_EliminarTarea",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task ChangeEstadoAsync(int id, int estadoId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.ExecuteAsync(
            "sp_CambiarEstadoTarea",
            new { Id = id, EstadoId = estadoId },
            commandType: CommandType.StoredProcedure);
    }
}
