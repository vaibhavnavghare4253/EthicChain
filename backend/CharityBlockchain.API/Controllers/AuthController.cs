using CharityBlockchain.API.Services;
using CharityBlockchain.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
    /// Register a new user with email and password
    /// </summary>
    [HttpPost("register-with-password")]
    public async Task<ActionResult<UserDto>> RegisterWithPassword([FromBody] RegisterWithPasswordRequest request)
    {
        try
        {
            var user = await _userService.RegisterUserWithPasswordAsync(request);
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user with password");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login-with-password")]
    public async Task<ActionResult<AuthResponse>> LoginWithPassword([FromBody] LoginWithPasswordRequest request)
    {
        try
        {
            var user = await _userService.AuthenticateUserWithPasswordAsync(request);
            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var token = await _userService.AuthenticateAsync(user.Email ?? "", "password_auth");
            
            return Ok(new AuthResponse
            {
                Token = token,
                WalletAddress = user.WalletAddress,
                User = user
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error authenticating user with password");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Authenticate user with wallet signature
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            // Register/update user if display name or email provided
            if (!string.IsNullOrEmpty(request.DisplayName) || !string.IsNullOrEmpty(request.Email))
            {
                await _userService.RegisterUserAsync(new RegisterUserRequest
                {
                    WalletAddress = request.WalletAddress,
                    DisplayName = request.DisplayName,
                    Email = request.Email
                });
            }

            var token = await _userService.AuthenticateAsync(request.WalletAddress, request.Signature);
            var user = await _userService.GetUserByWalletAsync(request.WalletAddress);
            
            return Ok(new AuthResponse
            {
                Token = token,
                WalletAddress = request.WalletAddress,
                User = user ?? new UserDto { WalletAddress = request.WalletAddress }
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

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        try
        {
            var walletAddress = User.FindFirst("wallet")?.Value;
            if (string.IsNullOrEmpty(walletAddress))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserByWalletAsync(walletAddress);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update user profile
    /// </summary>
    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateUserProfileRequest request)
    {
        try
        {
            var walletAddress = User.FindFirst("wallet")?.Value;
            if (string.IsNullOrEmpty(walletAddress))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserByWalletAsync(walletAddress);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var updatedUser = await _userService.UpdateUserProfileAsync(user.Id, request);
            return Ok(updatedUser);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get user statistics
    /// </summary>
    [HttpGet("stats")]
    [Authorize]
    public async Task<ActionResult<UserStatsDto>> GetUserStats()
    {
        try
        {
            var walletAddress = User.FindFirst("wallet")?.Value;
            if (string.IsNullOrEmpty(walletAddress))
            {
                return Unauthorized();
            }

            var stats = await _userService.GetUserStatsAsync(walletAddress);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user stats");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get user by wallet address (public endpoint)
    /// </summary>
    [HttpGet("user/{walletAddress}")]
    public async Task<ActionResult<UserDto>> GetUserByWallet(string walletAddress)
    {
        try
        {
            var user = await _userService.GetUserByWalletAsync(walletAddress);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by wallet");
            return StatusCode(500, "Internal server error");
        }
    }
}

