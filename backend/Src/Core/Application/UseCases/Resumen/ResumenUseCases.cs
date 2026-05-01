using Domain.Interfaces;
using Domain.Interfaces.Repositories;

namespace Application.UseCases.Resumen;

public interface IResumenUseCases : IUseCase
{
    Task<ResumenDto> GetAsync();
}

public class ResumenUseCases : IResumenUseCases
{
    private readonly IResumenRepository _repo;

    public ResumenUseCases(IResumenRepository repo) => _repo = repo;

    public async Task<ResumenDto> GetAsync()
    {
        var r = await _repo.GetResumenAsync();
        return new ResumenDto(r.ProyectosActivos, r.TareasVencidas, r.TareasPendientes);
    }
}
