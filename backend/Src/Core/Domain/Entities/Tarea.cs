namespace Domain.Entities;

public class Tarea
{
    public int Id { get; set; }
    public int ProyectoId { get; set; }
    public string ProyectoNombre { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public int PrioridadId { get; set; }
    public string PrioridadNombre { get; set; } = string.Empty;
    public int EstadoId { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public int? UsuarioAsignadoId { get; set; }
    public string? UsuarioAsignadoNombre { get; set; }
    public DateTime FechaLimite { get; set; }
    public DateTime FechaCreacion { get; set; }
}
