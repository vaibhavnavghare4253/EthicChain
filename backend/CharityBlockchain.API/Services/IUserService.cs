namespace CharityBlockchain.API.Services;

public interface IUserService
{
    Task<string> AuthenticateAsync(string walletAddress, string signature);
    Task<bool> VerifySignatureAsync(string walletAddress, string message, string signature);
}

