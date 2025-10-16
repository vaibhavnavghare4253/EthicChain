using CharityBlockchain.API.DTOs;

namespace CharityBlockchain.API.Services;

public interface ICampaignService
{
    Task<IEnumerable<CampaignDto>> GetAllCampaignsAsync();
    Task<CampaignDto?> GetCampaignByIdAsync(Guid id);
    Task<CampaignDto> CreateCampaignAsync(CreateCampaignDto campaign);
    Task<bool> UpdateCampaignAsync(UpdateCampaignDto campaign);
    Task<IEnumerable<CampaignDto>> GetCampaignsByCategoryAsync(string category);
    Task<IEnumerable<CampaignDto>> GetActiveCampaignsAsync();
}

