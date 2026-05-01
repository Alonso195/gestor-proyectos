using Domain.Interfaces;

namespace Application.UseCases.Proyectos;

// TODO: Implement use cases for Proyectos following the pattern in Auth/Login/LoginUseCase.cs
//
// Required use cases:
//   IGetProyectosPagedUseCase  — paginated list
//   IGetProyectoByIdUseCase    — single project by id
//   ICreateProyectoUseCase     — create (Admin only)
//   IUpdateProyectoUseCase     — update (Admin only)
//   IDeleteProyectoUseCase     — delete with business rule validation (Admin only)
//
// Business rules to enforce:
//   - Cannot delete a project that has tasks in 'Pendiente' or 'En Progreso' state
//   - Completing a project requires all its tasks to be 'Completada' or 'Cancelada'
