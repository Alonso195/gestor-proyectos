-- ============================================================
-- Stored procedures — Proyectos (Prueba Técnica Vadi)
-- Ejecutar contra GestionProyectos después de init.sql y sp_auth.sql
-- ============================================================

USE GestionProyectos;
GO

-- ------------------------------------------------------------
-- Helpers para reglas de negocio (tareas por proyecto)
-- ------------------------------------------------------------

CREATE OR ALTER PROCEDURE sp_ContarTareasPendienteOEnProgresoPorProyecto
    @ProyectoId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT COUNT(1) AS Cnt
    FROM Tareas
    WHERE ProyectoId = @ProyectoId AND EstadoId IN (1, 2); -- Pendiente, En Progreso
END
GO

CREATE OR ALTER PROCEDURE sp_ContarTareasNoCompletadaNiCanceladaPorProyecto
    @ProyectoId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT COUNT(1) AS Cnt
    FROM Tareas
    WHERE ProyectoId = @ProyectoId AND EstadoId NOT IN (3, 4); -- Completada, Cancelada
END
GO

-- ------------------------------------------------------------
-- Proyectos — CRUD y listado
-- ------------------------------------------------------------

CREATE OR ALTER PROCEDURE sp_ListarProyectosPaginado
    @Pagina INT,
    @TamanoPagina INT
AS
BEGIN
    SET NOCOUNT ON;
    IF @Pagina < 1 SET @Pagina = 1;
    IF @TamanoPagina < 1 SET @TamanoPagina = 10;

    DECLARE @Offset INT = (@Pagina - 1) * @TamanoPagina;

    SELECT
        p.Id,
        p.Nombre,
        p.Descripcion,
        p.FechaInicio,
        p.FechaFin,
        p.EstadoId,
        e.Nombre AS EstadoNombre,
        p.CreadoPorId,
        u.Nombre AS CreadoPorNombre,
        p.FechaCreacion
    FROM Proyectos p
    INNER JOIN Estados e ON e.Id = p.EstadoId
    INNER JOIN Usuarios u ON u.Id = p.CreadoPorId
    ORDER BY p.Id
    OFFSET @Offset ROWS FETCH NEXT @TamanoPagina ROWS ONLY;

    SELECT COUNT(1) AS Total FROM Proyectos;
END
GO

CREATE OR ALTER PROCEDURE sp_ObtenerProyectoPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        p.Id,
        p.Nombre,
        p.Descripcion,
        p.FechaInicio,
        p.FechaFin,
        p.EstadoId,
        e.Nombre AS EstadoNombre,
        p.CreadoPorId,
        u.Nombre AS CreadoPorNombre,
        p.FechaCreacion
    FROM Proyectos p
    INNER JOIN Estados e ON e.Id = p.EstadoId
    INNER JOIN Usuarios u ON u.Id = p.CreadoPorId
    WHERE p.Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE sp_InsertarProyecto
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(500) = NULL,
    @FechaInicio DATE,
    @FechaFin DATE,
    @EstadoId INT,
    @CreadoPorId INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Proyectos (Nombre, Descripcion, FechaInicio, FechaFin, EstadoId, CreadoPorId)
    OUTPUT INSERTED.Id
    VALUES (@Nombre, @Descripcion, @FechaInicio, @FechaFin, @EstadoId, @CreadoPorId);
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarProyecto
    @Id INT,
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(500) = NULL,
    @FechaInicio DATE,
    @FechaFin DATE,
    @EstadoId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Proyectos
    SET
        Nombre = @Nombre,
        Descripcion = @Descripcion,
        FechaInicio = @FechaInicio,
        FechaFin = @FechaFin,
        EstadoId = @EstadoId
    WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarProyecto
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Proyectos WHERE Id = @Id;
END
GO

-- ------------------------------------------------------------
-- Resumen — contadores (COUNT, GROUP BY, GETDATE)
-- ------------------------------------------------------------

CREATE OR ALTER PROCEDURE sp_ObtenerResumen
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH ProyectosPorEstado AS (
        SELECT
            e.Id,
            e.Nombre,
            COUNT(p.Id) AS Cantidad
        FROM Estados e
        LEFT JOIN Proyectos p ON p.EstadoId = e.Id
        GROUP BY e.Id, e.Nombre
    )
    SELECT
        (
            SELECT COALESCE(SUM(pe.Cantidad), 0)
            FROM ProyectosPorEstado pe
            WHERE pe.Nombre IN (N'Pendiente', N'En Progreso')
        ) AS ProyectosActivos,
        (
            SELECT COUNT(*)
            FROM Tareas t
            WHERE t.FechaLimite < CAST(GETDATE() AS DATE)
              AND t.EstadoId NOT IN (3, 4)
        ) AS TareasVencidas,
        (
            SELECT COUNT(*)
            FROM Tareas t
            WHERE t.EstadoId = 1
        ) AS TareasPendientes;
END
GO

-- ------------------------------------------------------------
-- Tareas — CRUD, listado por proyecto, cambio de estado
-- ------------------------------------------------------------

CREATE OR ALTER PROCEDURE sp_ListarTareasPorProyectoPaginado
    @ProyectoId INT,
    @Pagina INT,
    @TamanoPagina INT
AS
BEGIN
    SET NOCOUNT ON;
    IF @Pagina < 1 SET @Pagina = 1;
    IF @TamanoPagina < 1 SET @TamanoPagina = 10;

    DECLARE @Offset INT = (@Pagina - 1) * @TamanoPagina;

    SELECT
        t.Id,
        t.ProyectoId,
        p.Nombre AS ProyectoNombre,
        t.Titulo,
        t.Descripcion,
        t.PrioridadId,
        pr.Nombre AS PrioridadNombre,
        t.EstadoId,
        e.Nombre AS EstadoNombre,
        t.UsuarioAsignadoId,
        u.Nombre AS UsuarioAsignadoNombre,
        t.FechaLimite,
        t.FechaCreacion
    FROM Tareas t
    INNER JOIN Proyectos p ON p.Id = t.ProyectoId
    INNER JOIN Prioridades pr ON pr.Id = t.PrioridadId
    INNER JOIN Estados e ON e.Id = t.EstadoId
    LEFT JOIN Usuarios u ON u.Id = t.UsuarioAsignadoId
    WHERE t.ProyectoId = @ProyectoId
    ORDER BY t.Id
    OFFSET @Offset ROWS FETCH NEXT @TamanoPagina ROWS ONLY;

    SELECT COUNT(1) AS Total FROM Tareas WHERE ProyectoId = @ProyectoId;
END
GO

CREATE OR ALTER PROCEDURE sp_ObtenerTareaPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        t.Id,
        t.ProyectoId,
        p.Nombre AS ProyectoNombre,
        t.Titulo,
        t.Descripcion,
        t.PrioridadId,
        pr.Nombre AS PrioridadNombre,
        t.EstadoId,
        e.Nombre AS EstadoNombre,
        t.UsuarioAsignadoId,
        u.Nombre AS UsuarioAsignadoNombre,
        t.FechaLimite,
        t.FechaCreacion
    FROM Tareas t
    INNER JOIN Proyectos p ON p.Id = t.ProyectoId
    INNER JOIN Prioridades pr ON pr.Id = t.PrioridadId
    INNER JOIN Estados e ON e.Id = t.EstadoId
    LEFT JOIN Usuarios u ON u.Id = t.UsuarioAsignadoId
    WHERE t.Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE sp_InsertarTarea
    @ProyectoId INT,
    @Titulo NVARCHAR(150),
    @Descripcion NVARCHAR(500) = NULL,
    @PrioridadId INT,
    @UsuarioAsignadoId INT = NULL,
    @FechaLimite DATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Tareas (ProyectoId, Titulo, Descripcion, PrioridadId, EstadoId, UsuarioAsignadoId, FechaLimite)
    OUTPUT INSERTED.Id
    VALUES (@ProyectoId, @Titulo, @Descripcion, @PrioridadId, 1 /* Pendiente */, @UsuarioAsignadoId, @FechaLimite);
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarTarea
    @Id INT,
    @Titulo NVARCHAR(150),
    @Descripcion NVARCHAR(500) = NULL,
    @PrioridadId INT,
    @UsuarioAsignadoId INT = NULL,
    @FechaLimite DATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Tareas
    SET
        Titulo = @Titulo,
        Descripcion = @Descripcion,
        PrioridadId = @PrioridadId,
        UsuarioAsignadoId = @UsuarioAsignadoId,
        FechaLimite = @FechaLimite
    WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarTarea
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Tareas WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE sp_CambiarEstadoTarea
    @Id INT,
    @EstadoId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Tareas SET EstadoId = @EstadoId WHERE Id = @Id;
END
GO
