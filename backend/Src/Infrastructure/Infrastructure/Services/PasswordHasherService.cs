using Application.Common.Interfaces;

namespace Infrastructure.Services;

public class PasswordHasherService : IPasswordHasher
{
    public bool Verify(string password, string hash) =>
        BCrypt.Net.BCrypt.Verify(password, hash);
}
