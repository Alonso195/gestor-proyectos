namespace Domain.Entities;

public class Proyecto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public int EstadoId { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public int CreadoPorId { get; set; }
    public string CreadoPorNombre { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
}
