using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CharityBlockchain.API.DTOs;
using CharityBlockchain.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Npgsql;

namespace CharityBlockchain.API.Services;

public class UserService : IUserService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserService> _logger;
    private readonly ApplicationDbContext _context;

    public UserService(IConfiguration configuration, ILogger<UserService> logger, ApplicationDbContext context)
    {
        _configuration = configuration;
        _logger = logger;
        _context = context;
    }

    public async Task<string> AuthenticateAsync(string walletAddress, string signature)
    {
        // In production, verify the signature against a message
        // For now, we'll generate a JWT token
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, walletAddress),
                new Claim("wallet", walletAddress)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return await Task.FromResult(tokenHandler.WriteToken(token));
    }

    public async Task<bool> VerifySignatureAsync(string walletAddress, string message, string signature)
    {
        // Implement Web3 signature verification using Nethereum
        // This is a placeholder
        return await Task.FromResult(true);
    }

    public async Task<UserDto> RegisterUserAsync(RegisterUserRequest request)
    {
        var passwordHash = !string.IsNullOrEmpty(request.Password) ? HashPassword(request.Password) : null;
        
        var result = await _context.Database.SqlQueryRaw<UserDto>(
            "SELECT * FROM sp_register_user({0}, {1}, {2}, {3}, {4})",
            request.WalletAddress,
            request.DisplayName,
            request.Email,
            request.AvatarUrl,
            passwordHash
        ).FirstOrDefaultAsync();

        if (result == null)
        {
            throw new InvalidOperationException("Failed to register user");
        }

        return result;
    }

    public async Task<UserDto> RegisterUserWithPasswordAsync(RegisterWithPasswordRequest request)
    {
        var passwordHash = HashPassword(request.Password);
        
        var result = await _context.Database.SqlQueryRaw<UserDto>(
            "SELECT * FROM sp_register_user_with_password({0}, {1}, {2}, {3})",
            request.Email,
            request.DisplayName,
            passwordHash,
            request.AvatarUrl
        ).FirstOrDefaultAsync();

        if (result == null)
        {
            throw new InvalidOperationException("Failed to register user with password");
        }

        return result;
    }

    public async Task<UserDto?> AuthenticateUserWithPasswordAsync(LoginWithPasswordRequest request)
    {
        // Get user by email first
        var user = await _context.Database.SqlQueryRaw<UserDto>(
            "SELECT * FROM sp_get_user_by_email({0})",
            request.Email
        ).FirstOrDefaultAsync();

        if (user == null)
        {
            return null;
        }

        // Get the stored password hash using a direct SQL query
        using var command = _context.Database.GetDbConnection().CreateCommand();
        command.CommandText = "SELECT password_hash FROM users WHERE email = @email";
        command.Parameters.Add(new Npgsql.NpgsqlParameter("@email", request.Email));
        
        await _context.Database.OpenConnectionAsync();
        var storedHash = await command.ExecuteScalarAsync() as string;
        await _context.Database.CloseConnectionAsync();

        if (string.IsNullOrEmpty(storedHash))
        {
            return null;
        }

        // Verify the password
        if (!VerifyPassword(request.Password, storedHash))
        {
            return null;
        }

        return user;
    }

    public async Task<UserDto?> GetUserByWalletAsync(string walletAddress)
    {
        return await _context.Database.SqlQueryRaw<UserDto>(
            "SELECT * FROM sp_get_user_by_wallet({0})",
            walletAddress
        ).FirstOrDefaultAsync();
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        return await _context.Database.SqlQueryRaw<UserDto>(
            "SELECT * FROM sp_get_user_by_email({0})",
            email
        ).FirstOrDefaultAsync();
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Database.SqlQueryRaw<UserDto>(
            "SELECT * FROM sp_get_user_by_id({0})",
            userId
        ).FirstOrDefaultAsync();
    }

    public async Task<UserDto> UpdateUserProfileAsync(Guid userId, UpdateUserProfileRequest request)
    {
        var result = await _context.Database.SqlQueryRaw<UserDto>(
            "SELECT * FROM sp_update_user_profile({0}, {1}, {2}, {3})",
            userId,
            request.DisplayName,
            request.Email,
            request.AvatarUrl
        ).FirstOrDefaultAsync();

        if (result == null)
        {
            throw new InvalidOperationException("Failed to update user profile");
        }

        return result;
    }

    public async Task<UserStatsDto> GetUserStatsAsync(string walletAddress)
    {
        var result = await _context.Database.SqlQueryRaw<UserStatsDto>(
            "SELECT * FROM sp_get_user_stats({0})",
            walletAddress
        ).FirstOrDefaultAsync();

        return result ?? new UserStatsDto();
    }

    public string HashPassword(string password)
    {
        // Generate a random salt
        byte[] salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Hash the password with the salt
        using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
        {
            byte[] hash = pbkdf2.GetBytes(32);
            
            // Combine salt and hash
            byte[] hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);
            
            return Convert.ToBase64String(hashBytes);
        }
    }

    public bool VerifyPassword(string password, string hash)
    {
        try
        {
            byte[] hashBytes = Convert.FromBase64String(hash);
            
            // Extract salt
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);
            
            // Hash the provided password with the extracted salt
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
            {
                byte[] testHash = pbkdf2.GetBytes(32);
                
                // Compare hashes
                for (int i = 0; i < 32; i++)
                {
                    if (hashBytes[i + 16] != testHash[i])
                        return false;
                }
                return true;
            }
        }
        catch
        {
            return false;
        }
    }
}

