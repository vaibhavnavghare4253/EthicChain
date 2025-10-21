using CharityBlockchain.API.DTOs;

namespace CharityBlockchain.API.Services;

public class CampaignService : ICampaignService
{
    private readonly IStoredProcedureService _spService;
    private readonly ILogger<CampaignService> _logger;

    public CampaignService(IStoredProcedureService spService, ILogger<CampaignService> logger)
    {
        _spService = spService;
        _logger = logger;
    }

    public async Task<IEnumerable<CampaignDto>> GetAllCampaignsAsync()
    {
        return await _spService.GetAllCampaignsAsync();
    }

    public async Task<CampaignDto?> GetCampaignByIdAsync(Guid id)
    {
        return await _spService.GetCampaignByIdAsync(id);
    }

    public async Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto campaign)
    {
        var campaignId = await _spService.CreateCampaignAsync(campaign);
        
        // Create milestones if provided
        if (campaign.Milestones?.Any() == true)
        {
            foreach (var milestone in campaign.Milestones)
            {
                await _spService.CreateMilestoneAsync(campaignId, milestone);
            }
        }
        
        // Return a basic campaign DTO with the created ID
        // In a real scenario, you might want to fetch the full campaign details
        return new CampaignDto
        {
            Id = campaignId,
            Title = campaign.Title,
            Description = campaign.Description,
            ImageUrl = campaign.ImageUrl,
            TargetAmount = campaign.TargetAmount,
            CurrentAmount = 0,
            CreatorAddress = campaign.CreatorAddress,
            CharityName = campaign.CharityName,
            Category = campaign.Category,
            Deadline = campaign.Deadline,
            IsActive = true,
            BeneficiaryAddress = campaign.BeneficiaryAddress,
            IpfsHash = campaign.IpfsHash,
            ContractAddress = string.Empty,
            CreatedAt = DateTime.UtcNow,
            DonorCount = 0,
            DaysLeft = Math.Max(0, (int)(campaign.Deadline - DateTime.UtcNow).TotalDays)
        };
    }

    public async Task<bool> UpdateCampaignAsync(UpdateCampaignDto campaign)
    {
        return await _spService.UpdateCampaignAsync(campaign);
    }

    public async Task<IEnumerable<CampaignDto>> GetCampaignsByCategoryAsync(string category)
    {
        var allCampaigns = await _spService.GetAllCampaignsAsync();
        return allCampaigns.Where(c => c.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<CampaignDto>> GetActiveCampaignsAsync()
    {
        var allCampaigns = await _spService.GetAllCampaignsAsync();
        return allCampaigns.Where(c => c.IsActive && c.Deadline > DateTime.UtcNow);
    }

    public async Task<IEnumerable<TransactionDto>> GetCampaignTransactionsAsync(Guid campaignId)
    {
        return await _spService.GetCampaignTransactionsAsync(campaignId);
    }

    public async Task<IEnumerable<MoneyUsageDto>> GetCampaignMoneyUsageAsync(Guid campaignId)
    {
        return await _spService.GetCampaignMoneyUsageAsync(campaignId);
    }

    public async Task<MoneyUsageDto> AddMoneyUsageAsync(Guid campaignId, CreateMoneyUsageDto usage)
    {
        return await _spService.AddMoneyUsageAsync(campaignId, usage);
    }
}

