namespace CharityBlockchain.API.DTOs;

public class DonationDto
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string DonorAddress { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string TxHash { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string? Message { get; set; }
    public bool IsAnonymous { get; set; }
    public string? CampaignTitle { get; set; }
}

public class CreateDonationDto
{
    public Guid CampaignId { get; set; }
    public string DonorAddress { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string TxHash { get; set; } = string.Empty;
    public string? Message { get; set; }
    public bool IsAnonymous { get; set; }
}

public class DonationStatsDto
{
    public decimal TotalAmount { get; set; }
    public int TotalDonations { get; set; }
    public int UniqueDonors { get; set; }
    public decimal AverageDonation { get; set; }
}

