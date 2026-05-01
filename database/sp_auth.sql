-- ============================================================
-- Stored Procedures provistos (auth) — NO modificar
-- ============================================================

USE GestionProyectos;
GO

CREATE OR ALTER PROCEDURE sp_ObtenerUsuarioPorEmail
    @Email NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.Id,
        u.Nombre,
        u.Email,
        u.PasswordHash,
        u.RolId,
        r.Nombre AS RolNombre,
        u.Activo
    FROM Usuarios u
    INNER JOIN Roles r ON r.Id = u.RolId
    WHERE u.Email = @Email;
END
GO
