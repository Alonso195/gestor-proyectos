using DataAccess.Repositories;
using Domain.Interfaces.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace DataAccess;

public static class DependencyInjection
{
    public static IServiceCollection AddDataAccessServices(this IServiceCollection services)
    {
        // Auth — provided
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();

        // TODO: Register your repository implementations here.
        // Example:
        // services.AddScoped<IProyectoRepository, ProyectoRepository>();
        // services.AddScoped<ITareaRepository, TareaRepository>();
        // services.AddScoped<IResumenRepository, ResumenRepository>();

        return services;
    }
}
