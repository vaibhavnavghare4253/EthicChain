using CharityBlockchain.API.DTOs;

namespace CharityBlockchain.API.Services;

public class DonationService : IDonationService
{
    private readonly IStoredProcedureService _spService;
    private readonly ILogger<DonationService> _logger;

    public DonationService(IStoredProcedureService spService, ILogger<DonationService> logger)
    {
        _spService = spService;
        _logger = logger;
    }

    public async Task<DonationDto> CreateDonationAsync(CreateDonationDto donation)
    {
        var donationId = await _spService.CreateDonationAsync(donation);
        var donations = await _spService.GetDonationsByCampaignAsync(donation.CampaignId);
        var createdDonation = donations.FirstOrDefault(d => d.Id == donationId);
        
        if (createdDonation == null)
        {
            throw new Exception("Failed to create donation");
        }
        
        return createdDonation;
    }

    public async Task<IEnumerable<DonationDto>> GetDonationsByCampaignAsync(Guid campaignId)
    {
        return await _spService.GetDonationsByCampaignAsync(campaignId);
    }

    public async Task<IEnumerable<DonationDto>> GetDonationsByDonorAsync(string donorAddress)
    {
        // This would require a specific stored procedure
        // For now, we'll filter from all donations
        var allCampaigns = await _spService.GetAllCampaignsAsync();
        var allDonations = new List<DonationDto>();
        
        foreach (var campaign in allCampaigns)
        {
            var donations = await _spService.GetDonationsByCampaignAsync(campaign.Id);
            allDonations.AddRange(donations.Where(d => 
                d.DonorAddress.Equals(donorAddress, StringComparison.OrdinalIgnoreCase)));
        }
        
        return allDonations;
    }

    public async Task<DonationStatsDto> GetDonationStatsAsync(Guid campaignId)
    {
        return await _spService.GetDonationStatsAsync(campaignId);
    }
}

