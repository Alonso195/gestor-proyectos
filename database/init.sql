-- ============================================================
-- Prueba Técnica — Vadi
-- Base de datos: GestionProyectos
-- ============================================================

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'GestionProyectos')
BEGIN
    ALTER DATABASE GestionProyectos SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE GestionProyectos;
END
GO

CREATE DATABASE GestionProyectos;
GO

USE GestionProyectos;
GO

-- ------------------------------------------------------------
-- Catálogos
-- ------------------------------------------------------------

CREATE TABLE Roles (
    Id   INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE Estados (
    Id     INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE Prioridades (
    Id     INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL
);
GO

-- ------------------------------------------------------------
-- Usuarios
-- ------------------------------------------------------------

CREATE TABLE Usuarios (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    Nombre       NVARCHAR(100) NOT NULL,
    Email        NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(256) NOT NULL,
    RolId        INT NOT NULL,
    Activo       BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Usuarios_Roles FOREIGN KEY (RolId) REFERENCES Roles(Id)
);
GO

-- ------------------------------------------------------------
-- Proyectos
-- ------------------------------------------------------------

CREATE TABLE Proyectos (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    Nombre      NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    FechaInicio DATE NOT NULL,
    FechaFin    DATE NOT NULL,
    EstadoId    INT NOT NULL,
    CreadoPorId INT NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Proyectos_Estados   FOREIGN KEY (EstadoId)    REFERENCES Estados(Id),
    CONSTRAINT FK_Proyectos_Usuarios  FOREIGN KEY (CreadoPorId) REFERENCES Usuarios(Id),
    CONSTRAINT CK_Proyectos_Fechas    CHECK (FechaFin >= FechaInicio)
);
GO

-- ------------------------------------------------------------
-- Tareas
-- ------------------------------------------------------------

CREATE TABLE Tareas (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    ProyectoId        INT NOT NULL,
    Titulo            NVARCHAR(150) NOT NULL,
    Descripcion       NVARCHAR(500) NULL,
    PrioridadId       INT NOT NULL,
    EstadoId          INT NOT NULL,
    UsuarioAsignadoId INT NULL,
    FechaLimite       DATE NOT NULL,
    FechaCreacion     DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Tareas_Proyectos  FOREIGN KEY (ProyectoId)        REFERENCES Proyectos(Id),
    CONSTRAINT FK_Tareas_Prioridades FOREIGN KEY (PrioridadId)      REFERENCES Prioridades(Id),
    CONSTRAINT FK_Tareas_Estados    FOREIGN KEY (EstadoId)          REFERENCES Estados(Id),
    CONSTRAINT FK_Tareas_Usuarios   FOREIGN KEY (UsuarioAsignadoId) REFERENCES Usuarios(Id)
);
GO

-- ------------------------------------------------------------
-- Seed: Catálogos
-- ------------------------------------------------------------

INSERT INTO Roles (Nombre) VALUES
    ('Administrador'),
    ('Colaborador'),
    ('Visualizador');
GO

INSERT INTO Estados (Nombre) VALUES
    ('Pendiente'),
    ('En Progreso'),
    ('Completada'),
    ('Cancelada');
GO

INSERT INTO Prioridades (Nombre) VALUES
    ('Baja'),
    ('Media'),
    ('Alta'),
    ('Crítica');
GO

-- ------------------------------------------------------------
-- Seed: Usuarios (contraseña para todos: Admin123!)
-- ------------------------------------------------------------

INSERT INTO Usuarios (Nombre, Email, PasswordHash, RolId) VALUES
    ('Carlos Admin',      'admin@vadi.com',    '$2b$11$m3qjdZTXfKIPVMPy1ABIBOPTjkFSJxO4nSJ1hSNBgBKJuz5WTZbG.', 1),
    ('María Colaborador', 'colab@vadi.com',    '$2b$11$m3qjdZTXfKIPVMPy1ABIBOPTjkFSJxO4nSJ1hSNBgBKJuz5WTZbG.', 2),
    ('Juan Visualizador', 'visual@vadi.com',   '$2b$11$m3qjdZTXfKIPVMPy1ABIBOPTjkFSJxO4nSJ1hSNBgBKJuz5WTZbG.', 3);
GO

-- ------------------------------------------------------------
-- Seed: Proyectos y Tareas de ejemplo
-- ------------------------------------------------------------

INSERT INTO Proyectos (Nombre, Descripcion, FechaInicio, FechaFin, EstadoId, CreadoPorId) VALUES
    ('Portal de Clientes',    'Rediseño del portal web de clientes',         '2026-01-10', '2026-06-30', 2, 1),
    ('Migración de Datos',    'Migración de BD legada a SQL Server 2022',    '2026-02-01', '2026-04-30', 2, 1),
    ('App Móvil v2',          'Nueva versión de la aplicación móvil',        '2026-03-01', '2026-12-31', 1, 1),
    ('Auditoría de Seguridad','Revisión completa de seguridad del sistema',  '2025-11-01', '2026-01-31', 3, 1);
GO

INSERT INTO Tareas (ProyectoId, Titulo, Descripcion, PrioridadId, EstadoId, UsuarioAsignadoId, FechaLimite) VALUES
    (1, 'Diseño de wireframes',       'Crear wireframes de todas las pantallas',    2, 3, 2, '2026-02-15'),
    (1, 'Implementar módulo de login','Login con OAuth y 2FA',                      3, 2, 2, '2026-03-01'),
    (1, 'Integración con API',        'Conectar con los endpoints del backend',     3, 1, 2, '2026-04-15'),
    (1, 'QA y pruebas',               'Pruebas funcionales y de carga',             2, 1, 3, '2026-05-30'),
    (2, 'Mapeo de tablas origen',     'Documentar esquema de la BD legada',         2, 3, 2, '2026-02-10'),
    (2, 'Scripts ETL',                'Crear scripts de transformación',            3, 2, 2, '2026-03-15'),
    (2, 'Validación de datos',        'Verificar integridad tras migración',        4, 1, 1, '2026-04-20'),
    (3, 'Definición de requisitos',   'Reunión con stakeholders',                   2, 3, 1, '2026-03-10'),
    (3, 'Prototipo UI',               'Prototipo navegable en Figma',               2, 1, 2, '2026-05-01'),
    (4, 'Revisión de dependencias',   'Audit de paquetes con vulnerabilidades',     4, 3, 1, '2025-11-30'),
    (4, 'Informe final',              'Entrega del informe de auditoría',           3, 3, 1, '2026-01-25');
GO
