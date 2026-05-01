using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.UseCases.Resumen;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResumenController : ControllerBase
{
    // TODO: Inject and use IGetResumenUseCase here.
    //
    // Required endpoint:
    //   GET /api/resumen  — returns ProyectosActivos, TareasVencidas, TareasPendientes (all roles)
}
