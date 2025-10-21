using System.ComponentModel.DataAnnotations.Schema;

namespace CharityBlockchain.API.DTOs;

public record UserDto
{
    [Column("id")]
    public Guid Id { get; init; }
    
    [Column("wallet_address")]
    public string? WalletAddress { get; init; }
    
    [Column("display_name")]
    public string? DisplayName { get; init; }
    
    [Column("email")]
    public string? Email { get; init; }
    
    [Column("avatar_url")]
    public string? AvatarUrl { get; init; }
    
    [Column("is_verified")]
    public bool IsVerified { get; init; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; init; }
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; init; }
}

public record UserStatsDto
{
    [Column("total_donations")]
    public long TotalDonations { get; init; }
    
    [Column("total_donated")]
    public decimal TotalDonated { get; init; }
    
    [Column("campaigns_created")]
    public long CampaignsCreated { get; init; }
    
    [Column("campaigns_donated_to")]
    public long CampaignsDonatedTo { get; init; }
    
    [Column("first_donation_date")]
    public DateTime? FirstDonationDate { get; init; }
    
    [Column("last_donation_date")]
    public DateTime? LastDonationDate { get; init; }
}

public record RegisterUserRequest
{
    public string? WalletAddress { get; init; }
    public string? DisplayName { get; init; }
    public string? Email { get; init; }
    public string? AvatarUrl { get; init; }
    public string? Password { get; init; }
}

public record RegisterWithPasswordRequest
{
    public string Email { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

public record UpdateUserProfileRequest
{
    public string? DisplayName { get; init; }
    public string? Email { get; init; }
    public string? AvatarUrl { get; init; }
}

public record LoginRequest
{
    public string? WalletAddress { get; init; }
    public string? Signature { get; init; }
    public string? DisplayName { get; init; }
    public string? Email { get; init; }
}

public record LoginWithPasswordRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public record AuthResponse
{
    public string Token { get; init; } = string.Empty;
    public string? WalletAddress { get; init; }
    public UserDto User { get; init; } = new();
}

public record NonceResponse
{
    public string Nonce { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
}
