using CharityBlockchain.API.DTOs;

namespace CharityBlockchain.API.Services;

public interface IUserService
{
    Task<string> AuthenticateAsync(string walletAddress, string signature);
    Task<bool> VerifySignatureAsync(string walletAddress, string message, string signature);
    Task<UserDto> RegisterUserAsync(RegisterUserRequest request);
    Task<UserDto> RegisterUserWithPasswordAsync(RegisterWithPasswordRequest request);
    Task<UserDto?> AuthenticateUserWithPasswordAsync(LoginWithPasswordRequest request);
    Task<UserDto?> GetUserByWalletAsync(string walletAddress);
    Task<UserDto?> GetUserByEmailAsync(string email);
    Task<UserDto?> GetUserByIdAsync(Guid userId);
    Task<UserDto> UpdateUserProfileAsync(Guid userId, UpdateUserProfileRequest request);
    Task<UserStatsDto> GetUserStatsAsync(string walletAddress);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}

