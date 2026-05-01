using Domain.Interfaces;

namespace Application.UseCases.Tareas;

// TODO: Implement use cases for Tareas following the pattern in Auth/Login/LoginUseCase.cs
//
// Required use cases:
//   IGetTareasPagedUseCase       — paginated list filtered by project
//   IGetTareaByIdUseCase         — single task by id
//   ICreateTareaUseCase          — create (Admin + Colaborador)
//   IUpdateTareaUseCase          — update (Admin + Colaborador)
//   IDeleteTareaUseCase          — delete (Admin only)
//   IChangeEstadoTareaUseCase    — change status (Admin + Colaborador)
//
// Business rules to enforce:
//   - New tasks always start in 'Pendiente' state regardless of what is sent
//   - Cannot complete a task if its project is in 'Cancelada' state
