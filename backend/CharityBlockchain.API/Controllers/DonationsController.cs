using CharityBlockchain.API.DTOs;
using CharityBlockchain.API.Services;
using CharityBlockchain.API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CharityBlockchain.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationsController : ControllerBase
{
    private readonly IDonationService _donationService;
    private readonly IHubContext<DonationHub> _hubContext;
    private readonly ILogger<DonationsController> _logger;

    public DonationsController(
        IDonationService donationService,
        IHubContext<DonationHub> hubContext,
        ILogger<DonationsController> logger)
    {
        _donationService = donationService;
        _hubContext = hubContext;
        _logger = logger;
    }

    /// <summary>
    /// Get donations for a specific campaign
    /// </summary>
    [HttpGet("campaign/{campaignId}")]
    public async Task<ActionResult<IEnumerable<DonationDto>>> GetByCampaign(Guid campaignId)
    {
        try
        {
            var donations = await _donationService.GetDonationsByCampaignAsync(campaignId);
            return Ok(donations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching donations for campaign {CampaignId}", campaignId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get donations by donor address
    /// </summary>
    [HttpGet("donor/{donorAddress}")]
    public async Task<ActionResult<IEnumerable<DonationDto>>> GetByDonor(string donorAddress)
    {
        try
        {
            var donations = await _donationService.GetDonationsByDonorAsync(donorAddress);
            return Ok(donations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching donations for donor {DonorAddress}", donorAddress);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get donation statistics for a campaign
    /// </summary>
    [HttpGet("stats/{campaignId}")]
    public async Task<ActionResult<DonationStatsDto>> GetStats(Guid campaignId)
    {
        try
        {
            var stats = await _donationService.GetDonationStatsAsync(campaignId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching donation stats for campaign {CampaignId}", campaignId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new donation (called after blockchain transaction)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DonationDto>> Create([FromBody] CreateDonationDto donation)
    {
        try
        {
            var createdDonation = await _donationService.CreateDonationAsync(donation);
            
            // Send real-time notification to all connected clients
            await _hubContext.Clients.All.SendAsync("ReceiveDonation", createdDonation);
            
            return CreatedAtAction(nameof(GetByCampaign), 
                new { campaignId = donation.CampaignId }, 
                createdDonation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating donation");
            return StatusCode(500, "Internal server error");
        }
    }
}

