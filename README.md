# Prueba Técnica — Ingeniería de Software
**Vadi · 2026**

---

## Perfil requerido
Angular 19 · .NET 8 · Transact-SQL con Dapper

---

## Contexto

En Vadi desarrollamos una plataforma SaaS para la gestión de procesos regulatorios. Esta prueba evalúa tu capacidad para construir una aplicación fullstack con buenas prácticas de arquitectura, manejo de estado, seguridad por roles y calidad de código.

Tendrás entre **24 y 48 horas** para entregar.

---

## Objetivo

Completar una mini aplicación de **Gestión de Proyectos y Tareas** partiendo del proyecto base provisto en este repositorio.

El proyecto base ya incluye:
- Estructura de capas (Clean Architecture en backend, NgRx en frontend)
- Autenticación completa: `POST /api/auth/login` → JWT
- Guard de autenticación (`authGuard`)
- Interceptor HTTP para adjuntar el token
- Estado de sesión en NgRx (actions, effects, reducers, selectors)
- Estado inicial de proyectos en NgRx (actions, effects, reducers, selectors) — para extender
- Pantalla de login funcional
- Base de datos con schema, datos de prueba y stored procedure de auth

**Tu trabajo es implementar todo lo demás.**

---

## Base de datos

Ejecuta `database/init.sql` en una instancia local de SQL Server (o Docker):

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

Luego ejecuta `database/init.sql` y `database/sp_auth.sql`.

### Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@vadi.com | Admin123! | Administrador | Rolid=1
| colab@vadi.com | Admin123! | Colaborador | rolid=2
| visual@vadi.com | Admin123! | Visualizador | rolid=3

---

## Parte 1 — Backend (.NET 8)

### Arquitectura
El proyecto sigue Clean Architecture. Respeta la separación de capas:

```
Domain      →  Entities, Interfaces (sin dependencias externas)
Application →  Use cases (IUseCase / Execute())
DataAccess  →  Repositories con Dapper
Infrastructure → JWT, servicios externos
WebApi      →  Controllers, Middlewares
```

### Lo que debes implementar

#### Repositorios (`DataAccess/Repositories/`)
- `ProyectoRepository` implementando `IProyectoRepository`
- `TareaRepository` implementando `ITareaRepository`
- `ResumenRepository` implementando `IResumenRepository`

Todos los accesos a BD **deben usar stored procedures** (`CommandType.StoredProcedure`). Sigue el patrón de `UsuarioRepository.cs`.

#### Use Cases (`Application/UseCases/`)

**Proyectos:**
- `GetProyectosPagedUseCase` — listado paginado
- `GetProyectoByIdUseCase`
- `CreateProyectoUseCase`
- `UpdateProyectoUseCase`
- `DeleteProyectoUseCase` — valida regla de negocio

**Tareas:**
- `GetTareasPagedUseCase` — paginado por proyecto
- `GetTareaByIdUseCase`
- `CreateTareaUseCase` — fuerza estado inicial `Pendiente`
- `UpdateTareaUseCase`
- `DeleteTareaUseCase`
- `ChangeEstadoTareaUseCase` — valida regla de negocio

**Resumen:**
- `GetResumenUseCase` — contadores para la pantalla de inicio

#### Reglas de negocio (obligatorias)
1. **No se puede eliminar** un proyecto con tareas en estado `Pendiente` o `En Progreso`
2. **No se puede completar** una tarea si su proyecto está en estado `Cancelada`
3. Al crear una tarea, el estado siempre es `Pendiente` independientemente de lo enviado
4. **No se puede completar** un proyecto si tiene tareas que no están en `Completada` o `Cancelada`

#### Controllers (`WebApi/UseCases/`)

| Endpoint | Método | Autorización |
|---|---|---|
| `GET /api/proyectos` | Paginado | Todos los roles |
| `GET /api/proyectos/{id}` | Por id | Todos los roles |
| `POST /api/proyectos` | Crear | Solo Administrador |
| `PUT /api/proyectos/{id}` | Actualizar | Solo Administrador |
| `DELETE /api/proyectos/{id}` | Eliminar | Solo Administrador |
| `GET /api/tareas` | Paginado por proyecto | Todos los roles |
| `GET /api/tareas/{id}` | Por id | Todos los roles |
| `POST /api/tareas` | Crear | Administrador, Colaborador |
| `PUT /api/tareas/{id}` | Actualizar | Administrador, Colaborador |
| `DELETE /api/tareas/{id}` | Eliminar | Solo Administrador |
| `PATCH /api/tareas/{id}/estado` | Cambiar estado | Administrador, Colaborador |
| `GET /api/resumen` | Contadores | Todos los roles |

#### Registrar dependencias
Registra tus repositorios y use cases en los respectivos `DependencyInjection.cs` de cada capa.

---

## Parte 2 — T-SQL (Stored Procedures)

Entrega tus stored procedures en un archivo `database/stored_procedures.sql`.

### Proyectos
- `sp_ListarProyectosPaginado` — con `OFFSET/FETCH`, retorna total de registros
- `sp_ObtenerProyectoPorId` — join con Estado y Usuario creador
- `sp_InsertarProyecto` — retorna el id insertado con `OUTPUT INSERTED.Id`
- `sp_ActualizarProyecto`
- `sp_EliminarProyecto`

### Tareas
- `sp_ListarTareasPorProyectoPaginado` — filtrado por ProyectoId, paginado
- `sp_ObtenerTareaPorId` — joins con Estado, Prioridad, Usuario asignado
- `sp_InsertarTarea` — ignora el EstadoId recibido, siempre inserta con estado `Pendiente`
- `sp_ActualizarTarea`
- `sp_EliminarTarea`
- `sp_CambiarEstadoTarea`

### Resumen
- `sp_ObtenerResumen` — retorna en una sola consulta: proyectos activos, tareas vencidas, tareas pendientes. Debe usar `COUNT`, `GROUP BY` y `GETDATE()`

---

## Parte 3 — Frontend (Angular 19)

### Pantalla de inicio (`/home`)
- 3 tarjetas con contadores: Proyectos activos, Tareas vencidas, Tareas pendientes
- Datos obtenidos de `GET /api/resumen` a través de un NgRx effect
- Muestra estado de carga mientras se obtienen los datos

### Módulo Proyectos (`/proyectos`)
- Tabla paginada server-side (Angular Material `mat-table` + `mat-paginator`)
- Botones de crear/editar/eliminar visibles solo para Administrador
- Formulario reactivo con validaciones:
  - Nombre: requerido, mínimo 3 caracteres
  - FechaFin debe ser ≥ FechaInicio (validator custom)
- Mostrar mensaje de error si el backend rechaza una operación por regla de negocio

### Módulo Tareas (`/proyectos/:proyectoId/tareas`)
- Tabla paginada server-side filtrada por proyecto
- Resaltar visualmente tareas vencidas (`FechaLimite < hoy` y no Completada/Cancelada)
- Botón de cambio de estado separado del formulario de edición
- Botones de crear/editar restringidos por rol (Colaborador puede, Visualizador no)
- Botón de eliminar solo para Administrador

### NgRx
- Crea estados propios para proyectos, tareas y resumen
- Sigue el patrón del estado de sesión ya provisto
- Los componentes NO deben hacer llamadas HTTP directas — todo vía effects

### Guards de rutas
- `authGuard` ya está implementado y protege todas las rutas del `AppModule`
- `roleGuard` está declarado. Impleméntalo para restringir rutas según rol
- `alreadyAuthGuard` está declarado. Impleméntalo para redirigir a `/home` si el usuario ya tiene sesión activa al intentar acceder a `/login`

### Interceptores HTTP
- `jwtInterceptor` ya está registrado en la aplicación
- `httpErrorInterceptor` está declarado. Impleméntalo para manejar errores HTTP globalmente (401, 403, 500)

---

## Entrega

Sube tu código a un repositorio **público en GitHub** con la siguiente estructura:

```
├── README.md             ← instrucciones para ejecutar
├── database/
│   ├── init.sql          ← ya provisto, no modificar
│   ├── sp_auth.sql       ← ya provisto, no modificar
│   └── stored_procedures.sql  ← TU ENTREGA: todos tus stored procedures
├── backend/
└── frontend/
```

Tu `README.md` debe incluir:
- Pasos para levantar y ejecutar el proyecto

---

## Criterios de evaluación

| Área | Aspectos evaluados |
|---|---|
| **Arquitectura** | Respeto de capas, separación de responsabilidades, registro correcto de DI |
| **Backend** | Use cases bien estructurados, reglas de negocio aplicadas, respuestas HTTP correctas |
| **T-SQL** | Stored procedures correctos, paginación server-side, validaciones dentro del SP |
| **Frontend** | NgRx correcto (effects, selectors), formularios con validaciones, paginación server-side |
| **Seguridad** | Autorización por roles en backend y frontend, bugs corregidos |
| **Git** | Commits atómicos y descriptivos, ramas, `.gitignore` correcto |

---

## Notas

- No se requieren tests unitarios
- Puedes agregar librerías adicionales si lo justificas en el README
- Ante cualquier duda de requisitos, documenta tu decisión en el README
