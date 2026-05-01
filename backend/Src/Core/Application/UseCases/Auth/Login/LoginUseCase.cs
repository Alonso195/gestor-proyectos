using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;

namespace Application.UseCases.Auth.Login;

public interface ILoginUseCase : IUseCase
{
    Task<LoginResponse> Execute(LoginRequest request);
}

public class LoginUseCase : ILoginUseCase
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;

    public LoginUseCase(
        IUsuarioRepository usuarioRepo,
        IJwtService jwtService,
        IPasswordHasher passwordHasher)
    {
        _usuarioRepo = usuarioRepo;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResponse> Execute(LoginRequest request)
    {
        var usuario = await _usuarioRepo.GetByEmailAsync(request.Email)
            ?? throw new BusinessException("Credenciales inválidas.");

        if (!usuario.Activo)
            throw new BusinessException("Usuario inactivo.");

        if (!_passwordHasher.Verify(request.Password, usuario.PasswordHash))
            throw new BusinessException("Credenciales inválidas.");

        var token = _jwtService.GenerateToken(usuario);

        return new LoginResponse(token, usuario.Nombre, usuario.Email, usuario.RolNombre);
    }
}
