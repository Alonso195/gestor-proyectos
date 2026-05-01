using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.UseCases.Tareas;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TareasController : ControllerBase
{
    // TODO: Inject and use your Tarea use cases here.
    //
    // Required endpoints:
    //   GET    /api/tareas?proyectoId=1&pagina=1&tamanoPagina=10  — by project, paginated (all roles)
    //   GET    /api/tareas/{id}                                    — by id (all roles)
    //   POST   /api/tareas                                         — create [Authorize(Roles = "Administrador,Colaborador")]
    //   PUT    /api/tareas/{id}                                    — update [Authorize(Roles = "Administrador,Colaborador")]
    //   DELETE /api/tareas/{id}                                    — delete [Authorize(Roles = "Administrador")]
    //   PATCH  /api/tareas/{id}/estado                             — change status [Authorize(Roles = "Administrador,Colaborador")]
}
