using CharityBlockchain.API.Data;
using CharityBlockchain.API.DTOs;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace CharityBlockchain.API.Services;

public class StoredProcedureService : IStoredProcedureService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<StoredProcedureService> _logger;

    public StoredProcedureService(ApplicationDbContext context, ILogger<StoredProcedureService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<CampaignDto>> GetAllCampaignsAsync()
    {
        try
        {
            var campaigns = new List<CampaignDto>();
            
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM sp_get_all_campaigns()";
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                campaigns.Add(MapToCampaignDto(reader));
            }
            
            return campaigns;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaigns from stored procedure");
            throw;
        }
    }

    public async Task<CampaignDto?> GetCampaignByIdAsync(Guid id)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM sp_get_campaign_by_id(@p_campaign_id)";
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", id));
            
            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapToCampaignDto(reader);
            }
            
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaign {CampaignId}", id);
            throw;
        }
    }

    public async Task<Guid> CreateCampaignAsync(CreateCampaignDto campaign)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT sp_create_campaign(
                    @p_title, @p_description, @p_image_url, @p_target_amount,
                    @p_creator_address, @p_charity_name, @p_category,
                    @p_deadline, @p_beneficiary_address, @p_ipfs_hash
                )";
            
            command.Parameters.Add(new NpgsqlParameter("p_title", campaign.Title));
            command.Parameters.Add(new NpgsqlParameter("p_description", campaign.Description));
            command.Parameters.Add(new NpgsqlParameter("p_image_url", campaign.ImageUrl));
            command.Parameters.Add(new NpgsqlParameter("p_target_amount", campaign.TargetAmount));
            command.Parameters.Add(new NpgsqlParameter("p_creator_address", campaign.CreatorAddress));
            command.Parameters.Add(new NpgsqlParameter("p_charity_name", campaign.CharityName));
            command.Parameters.Add(new NpgsqlParameter("p_category", campaign.Category));
            var deadlineParam = new NpgsqlParameter("p_deadline", NpgsqlTypes.NpgsqlDbType.Timestamp);
            deadlineParam.Value = DateTime.SpecifyKind(campaign.Deadline, DateTimeKind.Unspecified);
            command.Parameters.Add(deadlineParam);
            command.Parameters.Add(new NpgsqlParameter("p_beneficiary_address", campaign.BeneficiaryAddress));
            var ipfsHashParam = new NpgsqlParameter("p_ipfs_hash", NpgsqlTypes.NpgsqlDbType.Text);
            ipfsHashParam.Value = string.IsNullOrEmpty(campaign.IpfsHash) ? DBNull.Value : campaign.IpfsHash;
            command.Parameters.Add(ipfsHashParam);
            
            var result = await command.ExecuteScalarAsync();
            return (Guid)result!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating campaign");
            throw;
        }
    }

    public async Task<bool> UpdateCampaignAsync(UpdateCampaignDto campaign)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT sp_update_campaign(
                    @p_campaign_id, @p_title, @p_description,
                    @p_image_url, @p_is_active
                )";
            
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", campaign.Id));
            command.Parameters.Add(new NpgsqlParameter("p_title", (object?)campaign.Title ?? DBNull.Value));
            command.Parameters.Add(new NpgsqlParameter("p_description", (object?)campaign.Description ?? DBNull.Value));
            command.Parameters.Add(new NpgsqlParameter("p_image_url", (object?)campaign.ImageUrl ?? DBNull.Value));
            command.Parameters.Add(new NpgsqlParameter("p_is_active", (object?)campaign.IsActive ?? DBNull.Value));
            
            var result = await command.ExecuteScalarAsync();
            return (bool)result!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating campaign {CampaignId}", campaign.Id);
            throw;
        }
    }

    public async Task<IEnumerable<DonationDto>> GetDonationsByCampaignAsync(Guid campaignId)
    {
        try
        {
            var donations = new List<DonationDto>();
            
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM sp_get_donations_by_campaign(@p_campaign_id)";
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", campaignId));
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                donations.Add(MapToDonationDto(reader));
            }
            
            return donations;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching donations for campaign {CampaignId}", campaignId);
            throw;
        }
    }

    public async Task<Guid> CreateDonationAsync(CreateDonationDto donation)
    {
        try
        {
            // First check if this transaction hash already exists
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var checkCommand = connection.CreateCommand();
            checkCommand.CommandText = "SELECT id FROM donations WHERE tx_hash = @p_tx_hash LIMIT 1";
            checkCommand.Parameters.Add(new NpgsqlParameter("p_tx_hash", donation.TxHash));
            
            var existingId = await checkCommand.ExecuteScalarAsync();
            if (existingId != null)
            {
                _logger.LogWarning("Donation with transaction hash {TxHash} already exists. Returning existing donation ID: {DonationId}", 
                    donation.TxHash, existingId);
                return (Guid)existingId;
            }
            
            // Create new donation
            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT sp_create_donation(
                    @p_campaign_id, @p_donor_address, @p_amount,
                    @p_tx_hash, @p_message, @p_is_anonymous
                )";
            
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", donation.CampaignId));
            command.Parameters.Add(new NpgsqlParameter("p_donor_address", donation.DonorAddress));
            command.Parameters.Add(new NpgsqlParameter("p_amount", donation.Amount));
            command.Parameters.Add(new NpgsqlParameter("p_tx_hash", donation.TxHash));
            command.Parameters.Add(new NpgsqlParameter("p_message", (object?)donation.Message ?? DBNull.Value));
            command.Parameters.Add(new NpgsqlParameter("p_is_anonymous", donation.IsAnonymous));
            
            var result = await command.ExecuteScalarAsync();
            return (Guid)result!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating donation");
            throw;
        }
    }

    public async Task<DonationStatsDto> GetDonationStatsAsync(Guid campaignId)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM sp_get_donation_stats(@p_campaign_id)";
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", campaignId));
            
            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new DonationStatsDto
                {
                    TotalAmount = reader.GetDecimal(0),
                    TotalDonations = reader.GetInt32(1),
                    UniqueDonors = reader.GetInt32(2),
                    AverageDonation = reader.GetDecimal(3)
                };
            }
            
            return new DonationStatsDto();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching donation stats for campaign {CampaignId}", campaignId);
            throw;
        }
    }

    public async Task<Guid> CreateMilestoneAsync(Guid campaignId, CreateMilestoneDto milestone)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT sp_create_milestone(
                    @p_campaign_id, @p_title, @p_description, @p_target_percentage
                )";
            
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", campaignId));
            command.Parameters.Add(new NpgsqlParameter("p_title", milestone.Title));
            command.Parameters.Add(new NpgsqlParameter("p_description", milestone.Description));
            command.Parameters.Add(new NpgsqlParameter("p_target_percentage", milestone.TargetPercentage));
            
            var result = await command.ExecuteScalarAsync();
            return (Guid)result!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating milestone for campaign {CampaignId}", campaignId);
            throw;
        }
    }

    private static CampaignDto MapToCampaignDto(System.Data.Common.DbDataReader reader)
    {
        return new CampaignDto
        {
            Id = reader.GetGuid(reader.GetOrdinal("id")),
            Title = reader.GetString(reader.GetOrdinal("title")),
            Description = reader.GetString(reader.GetOrdinal("description")),
            ImageUrl = reader.GetString(reader.GetOrdinal("image_url")),
            TargetAmount = reader.GetDecimal(reader.GetOrdinal("target_amount")),
            CurrentAmount = reader.GetDecimal(reader.GetOrdinal("current_amount")),
            CreatorAddress = reader.GetString(reader.GetOrdinal("creator_address")),
            CharityName = reader.GetString(reader.GetOrdinal("charity_name")),
            Category = reader.GetString(reader.GetOrdinal("category")),
            Deadline = reader.GetDateTime(reader.GetOrdinal("deadline")),
            IsActive = reader.GetBoolean(reader.GetOrdinal("is_active")),
            BeneficiaryAddress = reader.GetString(reader.GetOrdinal("beneficiary_address")),
            IpfsHash = reader.IsDBNull(reader.GetOrdinal("ipfs_hash")) ? null : reader.GetString(reader.GetOrdinal("ipfs_hash")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
        };
    }

    private static DonationDto MapToDonationDto(System.Data.Common.DbDataReader reader)
    {
        return new DonationDto
        {
            Id = reader.GetGuid(reader.GetOrdinal("id")),
            CampaignId = reader.GetGuid(reader.GetOrdinal("campaign_id")),
            DonorAddress = reader.GetString(reader.GetOrdinal("donor_address")),
            Amount = reader.GetDecimal(reader.GetOrdinal("amount")),
            TxHash = reader.GetString(reader.GetOrdinal("tx_hash")),
            Timestamp = reader.GetDateTime(reader.GetOrdinal("donation_timestamp")),
            Message = reader.IsDBNull(reader.GetOrdinal("message")) ? null : reader.GetString(reader.GetOrdinal("message")),
            IsAnonymous = reader.GetBoolean(reader.GetOrdinal("is_anonymous"))
        };
    }

    public async Task<IEnumerable<TransactionDto>> GetCampaignTransactionsAsync(Guid campaignId)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM sp_get_campaign_transactions(@p_campaign_id)";
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", campaignId));
            
            var transactions = new List<TransactionDto>();
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                transactions.Add(new TransactionDto
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CampaignId = reader.GetGuid(reader.GetOrdinal("campaign_id")),
                    DonorAddress = reader.GetString(reader.GetOrdinal("donor_address")),
                    Amount = reader.GetDecimal(reader.GetOrdinal("amount")),
                    TxHash = reader.GetString(reader.GetOrdinal("tx_hash")),
                    Message = reader.IsDBNull(reader.GetOrdinal("message")) ? null : reader.GetString(reader.GetOrdinal("message")),
                    IsAnonymous = reader.GetBoolean(reader.GetOrdinal("is_anonymous")),
                    Timestamp = reader.GetDateTime(reader.GetOrdinal("timestamp")),
                    DonorName = reader.IsDBNull(reader.GetOrdinal("donor_name")) ? null : reader.GetString(reader.GetOrdinal("donor_name"))
                });
            }
            
            return transactions;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching transactions for campaign {CampaignId}", campaignId);
            throw;
        }
    }

    public async Task<IEnumerable<MoneyUsageDto>> GetCampaignMoneyUsageAsync(Guid campaignId)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM sp_get_campaign_money_usage(@p_campaign_id)";
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", campaignId));
            
            var usage = new List<MoneyUsageDto>();
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                usage.Add(new MoneyUsageDto
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CampaignId = reader.GetGuid(reader.GetOrdinal("campaign_id")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    Amount = reader.GetDecimal(reader.GetOrdinal("amount")),
                    Category = reader.GetString(reader.GetOrdinal("category")),
                    ProofUrl = reader.IsDBNull(reader.GetOrdinal("proof_url")) ? null : reader.GetString(reader.GetOrdinal("proof_url")),
                    Timestamp = reader.GetDateTime(reader.GetOrdinal("timestamp")),
                    Status = reader.GetString(reader.GetOrdinal("status"))
                });
            }
            
            return usage;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching money usage for campaign {CampaignId}", campaignId);
            throw;
        }
    }

    public async Task<MoneyUsageDto> AddMoneyUsageAsync(Guid campaignId, CreateMoneyUsageDto usage)
    {
        try
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT sp_add_money_usage(@p_campaign_id, @p_description, @p_amount, @p_category, @p_proof_url)";
            
            command.Parameters.Add(new NpgsqlParameter("p_campaign_id", campaignId));
            command.Parameters.Add(new NpgsqlParameter("p_description", usage.Description));
            command.Parameters.Add(new NpgsqlParameter("p_amount", usage.Amount));
            command.Parameters.Add(new NpgsqlParameter("p_category", usage.Category));
            command.Parameters.Add(new NpgsqlParameter("p_proof_url", (object?)usage.ProofUrl ?? DBNull.Value));
            
            var usageId = (Guid)await command.ExecuteScalarAsync()!;
            
            return new MoneyUsageDto
            {
                Id = usageId,
                CampaignId = campaignId,
                Description = usage.Description,
                Amount = usage.Amount,
                Category = usage.Category,
                ProofUrl = usage.ProofUrl,
                Timestamp = DateTime.UtcNow,
                Status = "pending"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding money usage for campaign {CampaignId}", campaignId);
            throw;
        }
    }
}

