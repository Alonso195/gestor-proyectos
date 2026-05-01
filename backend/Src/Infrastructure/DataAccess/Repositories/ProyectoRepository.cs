using System.Data;
using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace DataAccess.Repositories;

public class ProyectoRepository : IProyectoRepository
{
    private readonly string _connectionString;

    public ProyectoRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<(IEnumerable<Proyecto> Items, int Total)> GetPagedAsync(int pagina, int tamanoPagina)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        using var multi = await conn.QueryMultipleAsync(
            "sp_ListarProyectosPaginado",
            new { Pagina = pagina, TamanoPagina = tamanoPagina },
            commandType: CommandType.StoredProcedure);

        var items = (await multi.ReadAsync<Proyecto>()).ToList();
        var total = await multi.ReadSingleAsync<int>();
        return (items, total);
    }

    public async Task<Proyecto?> GetByIdAsync(int id)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryFirstOrDefaultAsync<Proyecto>(
            "sp_ObtenerProyectoPorId",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> CreateAsync(Proyecto proyecto)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QuerySingleAsync<int>(
            "sp_InsertarProyecto",
            new
            {
                proyecto.Nombre,
                proyecto.Descripcion,
                proyecto.FechaInicio,
                proyecto.FechaFin,
                proyecto.EstadoId,
                CreadoPorId = proyecto.CreadoPorId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task UpdateAsync(Proyecto proyecto)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.ExecuteAsync(
            "sp_ActualizarProyecto",
            new
            {
                proyecto.Id,
                proyecto.Nombre,
                proyecto.Descripcion,
                proyecto.FechaInicio,
                proyecto.FechaFin,
                proyecto.EstadoId
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task DeleteAsync(int id)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.ExecuteAsync(
            "sp_EliminarProyecto",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> CountTareasPendienteOEnProgresoPorProyectoAsync(int proyectoId)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.ExecuteScalarAsync<int>(
            "sp_ContarTareasPendienteOEnProgresoPorProyecto",
            new { ProyectoId = proyectoId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> CountTareasNoCompletadaNiCanceladaPorProyectoAsync(int proyectoId)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.ExecuteScalarAsync<int>(
            "sp_ContarTareasNoCompletadaNiCanceladaPorProyecto",
            new { ProyectoId = proyectoId },
            commandType: CommandType.StoredProcedure);
    }
}
