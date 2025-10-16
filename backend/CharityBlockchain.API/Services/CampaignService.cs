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
        var createdCampaign = await _spService.GetCampaignByIdAsync(campaignId);
        
        if (createdCampaign == null)
        {
            throw new Exception("Failed to create campaign");
        }
        
        return createdCampaign;
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
}

