using Microsoft.AspNetCore.SignalR;

namespace CharityBlockchain.API.Hubs;

public class DonationHub : Hub
{
    private readonly ILogger<DonationHub> _logger;

    public DonationHub(ILogger<DonationHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Subscribe to campaign updates
    /// </summary>
    public async Task SubscribeToCampaign(string campaignId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"campaign_{campaignId}");
        _logger.LogInformation("Client {ConnectionId} subscribed to campaign {CampaignId}", 
            Context.ConnectionId, campaignId);
    }

    /// <summary>
    /// Unsubscribe from campaign updates
    /// </summary>
    public async Task UnsubscribeFromCampaign(string campaignId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"campaign_{campaignId}");
        _logger.LogInformation("Client {ConnectionId} unsubscribed from campaign {CampaignId}", 
            Context.ConnectionId, campaignId);
    }
}

