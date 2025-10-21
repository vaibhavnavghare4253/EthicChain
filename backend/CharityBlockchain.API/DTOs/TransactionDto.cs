using System.ComponentModel.DataAnnotations;

namespace CharityBlockchain.API.DTOs;

public class TransactionDto
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string DonorAddress { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string TxHash { get; set; } = string.Empty;
    public string? Message { get; set; }
    public bool IsAnonymous { get; set; }
    public DateTime Timestamp { get; set; }
    public string? DonorName { get; set; }
}

public class MoneyUsageDto
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? ProofUrl { get; set; }
    public DateTime Timestamp { get; set; }
    public string Status { get; set; } = "pending"; // pending, completed, verified
}

public class CreateMoneyUsageDto
{
    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;
    
    [Url]
    public string? ProofUrl { get; set; }
}
