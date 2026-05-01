using Application.UseCases.Auth.Login;
using Application.UseCases.Proyectos;
using Application.UseCases.Resumen;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ILoginUseCase, LoginUseCase>();

        services.AddScoped<IProyectoUseCases, ProyectoUseCases>();
        services.AddScoped<IResumenUseCases, ResumenUseCases>();

        return services;
    }
}
