using CharityBlockchain.API.DTOs;

namespace CharityBlockchain.API.Services;

public interface IStoredProcedureService
{
    Task<IEnumerable<CampaignDto>> GetAllCampaignsAsync();
    Task<CampaignDto?> GetCampaignByIdAsync(Guid id);
    Task<Guid> CreateCampaignAsync(CreateCampaignDto campaign);
    Task<bool> UpdateCampaignAsync(UpdateCampaignDto campaign);
    Task<IEnumerable<DonationDto>> GetDonationsByCampaignAsync(Guid campaignId);
    Task<Guid> CreateDonationAsync(CreateDonationDto donation);
    Task<DonationStatsDto> GetDonationStatsAsync(Guid campaignId);
    Task<Guid> CreateMilestoneAsync(Guid campaignId, CreateMilestoneDto milestone);
    
    // Transaction tracking methods
    Task<IEnumerable<TransactionDto>> GetCampaignTransactionsAsync(Guid campaignId);
    Task<IEnumerable<MoneyUsageDto>> GetCampaignMoneyUsageAsync(Guid campaignId);
    Task<MoneyUsageDto> AddMoneyUsageAsync(Guid campaignId, CreateMoneyUsageDto usage);
}

