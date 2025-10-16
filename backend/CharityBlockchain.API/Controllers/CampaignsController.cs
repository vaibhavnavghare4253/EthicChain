using CharityBlockchain.API.DTOs;
using CharityBlockchain.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CharityBlockchain.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _campaignService;
    private readonly ILogger<CampaignsController> _logger;

    public CampaignsController(ICampaignService campaignService, ILogger<CampaignsController> logger)
    {
        _campaignService = campaignService;
        _logger = logger;
    }

    /// <summary>
    /// Get all campaigns
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CampaignDto>>> GetAll()
    {
        try
        {
            var campaigns = await _campaignService.GetAllCampaignsAsync();
            return Ok(campaigns);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaigns");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get active campaigns only
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<CampaignDto>>> GetActive()
    {
        try
        {
            var campaigns = await _campaignService.GetActiveCampaignsAsync();
            return Ok(campaigns);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching active campaigns");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get campaign by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CampaignDto>> GetById(Guid id)
    {
        try
        {
            var campaign = await _campaignService.GetCampaignByIdAsync(id);
            
            if (campaign == null)
            {
                return NotFound($"Campaign with ID {id} not found");
            }
            
            return Ok(campaign);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaign {CampaignId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get campaigns by category
    /// </summary>
    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<CampaignDto>>> GetByCategory(string category)
    {
        try
        {
            var campaigns = await _campaignService.GetCampaignsByCategoryAsync(category);
            return Ok(campaigns);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaigns by category {Category}", category);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new campaign
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CampaignDto>> Create([FromBody] CreateCampaignDto campaign)
    {
        try
        {
            var createdCampaign = await _campaignService.CreateCampaignAsync(campaign);
            return CreatedAtAction(nameof(GetById), new { id = createdCampaign.Id }, createdCampaign);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating campaign");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing campaign
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateCampaignDto campaign)
    {
        try
        {
            if (id != campaign.Id)
            {
                return BadRequest("ID mismatch");
            }
            
            var success = await _campaignService.UpdateCampaignAsync(campaign);
            
            if (!success)
            {
                return NotFound($"Campaign with ID {id} not found");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating campaign {CampaignId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

