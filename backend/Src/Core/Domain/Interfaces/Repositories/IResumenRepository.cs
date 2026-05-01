using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IResumenRepository
{
    Task<ResumenContadores> GetResumenAsync();
}
