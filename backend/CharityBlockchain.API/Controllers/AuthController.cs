using CharityBlockchain.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CharityBlockchain.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Authenticate user with wallet signature
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var token = await _userService.AuthenticateAsync(request.WalletAddress, request.Signature);
            
            return Ok(new AuthResponse
            {
                Token = token,
                WalletAddress = request.WalletAddress
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error authenticating user");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get nonce for wallet signature
    /// </summary>
    [HttpGet("nonce/{walletAddress}")]
    public ActionResult<NonceResponse> GetNonce(string walletAddress)
    {
        // Generate a random nonce for the user to sign
        var nonce = Guid.NewGuid().ToString();
        
        return Ok(new NonceResponse
        {
            Nonce = nonce,
            Message = $"Sign this message to authenticate with CharityChain: {nonce}"
        });
    }
}

public record LoginRequest(string WalletAddress, string Signature);
public record AuthResponse
{
    public string Token { get; init; } = string.Empty;
    public string WalletAddress { get; init; } = string.Empty;
}
public record NonceResponse
{
    public string Nonce { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
}

