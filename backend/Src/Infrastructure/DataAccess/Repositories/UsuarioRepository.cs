using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace DataAccess.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly string _connectionString;

    public UsuarioRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    public async Task<Usuario?> GetByEmailAsync(string email)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryFirstOrDefaultAsync<Usuario>(
            "sp_ObtenerUsuarioPorEmail",
            new { Email = email },
            commandType: System.Data.CommandType.StoredProcedure
        );
    }
}
