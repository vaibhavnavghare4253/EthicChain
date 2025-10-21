using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace CharityBlockchain.API.DTOs;

public class CampaignDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public string CreatorAddress { get; set; } = string.Empty;
    public string CharityName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public bool IsActive { get; set; }
    public string BeneficiaryAddress { get; set; } = string.Empty;
    public string? IpfsHash { get; set; }
    public string? ContractAddress { get; set; }
    public DateTime CreatedAt { get; set; }
    public int DonorCount { get; set; }
    public int DaysLeft { get; set; }
}

    public class CreateCampaignDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public string CreatorAddress { get; set; } = string.Empty;
        public string CharityName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public string BeneficiaryAddress { get; set; } = string.Empty;
        public string? IpfsHash { get; set; }
        public List<CreateMilestoneDto> Milestones { get; set; } = new();
    }

public class CreateMilestoneDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int TargetPercentage { get; set; }
}

public class CreateCampaignFormData
{
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string TargetAmount { get; set; } = string.Empty;
    
    [Required]
    public string CreatorAddress { get; set; } = string.Empty;
    
    [Required]
    public string CharityName { get; set; } = string.Empty;
    
    [Required]
    public string Category { get; set; } = string.Empty;
    
    [Required]
    public string Deadline { get; set; } = string.Empty;
    
    [Required]
    public string BeneficiaryAddress { get; set; } = string.Empty;
    
    public string? IpfsHash { get; set; }
    
    public string Milestones { get; set; } = string.Empty;
    
    public IFormFile? ImageFile { get; set; }
}

public class UpdateCampaignDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool? IsActive { get; set; }
}

