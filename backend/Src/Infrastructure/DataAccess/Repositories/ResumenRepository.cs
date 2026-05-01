using System.Data;
using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace DataAccess.Repositories;

public class ResumenRepository : IResumenRepository
{
    private readonly string _connectionString;

    public ResumenRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<ResumenContadores> GetResumenAsync()
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QuerySingleAsync<ResumenContadores>(
            "sp_ObtenerResumen",
            commandType: CommandType.StoredProcedure);
    }
}
