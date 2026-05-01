using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.UseCases.Proyectos;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProyectosController : ControllerBase
{
    // TODO: Inject and use your Proyecto use cases here.
    //
    // Required endpoints:
    //   GET    /api/proyectos?pagina=1&tamanoPagina=10   — paginated list (all roles)
    //   GET    /api/proyectos/{id}                       — by id (all roles)
    //   POST   /api/proyectos                            — create [Authorize(Roles = "Administrador")]
    //   PUT    /api/proyectos/{id}                       — update [Authorize(Roles = "Administrador")]
    //   DELETE /api/proyectos/{id}                       — delete [Authorize(Roles = "Administrador")]
}
