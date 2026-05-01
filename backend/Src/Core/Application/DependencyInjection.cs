using Application.UseCases.Auth.Login;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Auth — provided
        services.AddScoped<ILoginUseCase, LoginUseCase>();

        // TODO: Register your use cases here following the same pattern.
        // Example:
        // services.AddScoped<IGetProyectosPagedUseCase, GetProyectosPagedUseCase>();

        return services;
    }
}
