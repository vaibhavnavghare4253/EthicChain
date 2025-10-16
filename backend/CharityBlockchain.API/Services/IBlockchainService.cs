namespace CharityBlockchain.API.Services;

public interface IBlockchainService
{
    Task<string> DeployCampaignContractAsync(Guid campaignId, decimal targetAmount, string beneficiary);
    Task<bool> VerifyDonationTransactionAsync(string txHash);
    Task<decimal> GetCampaignBalanceAsync(string contractAddress);
}

