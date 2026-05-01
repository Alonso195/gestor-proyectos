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
