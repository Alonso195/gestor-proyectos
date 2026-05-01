using Domain.Entities;

namespace Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(Usuario usuario);
}
