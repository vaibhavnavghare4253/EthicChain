using CharityBlockchain.API.DTOs;

namespace CharityBlockchain.API.Services;

public interface IDonationService
{
    Task<DonationDto> CreateDonationAsync(CreateDonationDto donation);
    Task<IEnumerable<DonationDto>> GetDonationsByCampaignAsync(Guid campaignId);
    Task<IEnumerable<DonationDto>> GetDonationsByDonorAsync(string donorAddress);
    Task<DonationStatsDto> GetDonationStatsAsync(Guid campaignId);
}

