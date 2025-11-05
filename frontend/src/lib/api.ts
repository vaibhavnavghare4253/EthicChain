// API service for communicating with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  creatorAddress: string;
  charityName: string;
  category: string;
  deadline: string;
  isActive: boolean;
  beneficiaryAddress: string;
  ipfsHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignData {
  title: string;
  description: string;
  targetAmount: number;
  category: string;
  charityName: string;
  beneficiaryAddress: string;
  deadline: string;
  creatorAddress?: string;
  imageUrl?: string;
  ipfsHash?: string;
  milestones: {
    title: string;
    description: string;
    targetPercentage: number;
  }[];
}

export interface DonationData {
  campaignId: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
}

export interface Transaction {
  id: string;
  donorAddress: string;
  amount: number;
  txHash: string;
  message?: string;
  isAnonymous: boolean;
  timestamp: string;
  donorName?: string;
}

export interface MoneyUsage {
  id: string;
  description: string;
  amount: number;
  category: string;
  proofUrl?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'verified';
}

// User-related interfaces
export interface User {
  id: string;
  walletAddress: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalDonations: number;
  totalDonated: number;
  campaignsCreated: number;
  campaignsDonatedTo: number;
  firstDonationDate?: string;
  lastDonationDate?: string;
}

export interface LoginRequest {
  walletAddress: string;
  signature: string;
  displayName?: string;
  email?: string;
}

// Used for wallet-based registration flows
export interface RegisterRequest {
  walletAddress: string;
  signature: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface RegisterWithPasswordRequest {
  email: string;
  displayName: string;
  password: string;
  avatarUrl?: string;
}

export interface LoginWithPasswordRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  walletAddress: string;
  user: User;
}

export interface NonceResponse {
  nonce: string;
  message: string;
}

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, clear it
          localStorage.removeItem('auth_token');
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(request: RegisterRequest): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async registerWithPassword(request: RegisterWithPasswordRequest): Promise<User> {
    return this.request<User>('/auth/register-with-password', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    // Store token
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  async loginWithPassword(request: LoginWithPasswordRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login-with-password', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    // Store token
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  async getNonce(walletAddress: string): Promise<NonceResponse> {
    return this.request<NonceResponse>(`/auth/nonce/${walletAddress}`);
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>('/auth/stats');
  }

  async getUserByWallet(walletAddress: string): Promise<User> {
    return this.request<User>(`/auth/user/${walletAddress}`);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Campaign endpoints
  async getCampaigns(): Promise<Campaign[]> {
    return this.request<Campaign[]>('/campaigns');
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return this.request<Campaign[]>('/campaigns/active');
  }

  async getCampaign(id: string): Promise<Campaign> {
    return this.request<Campaign>(`/campaigns/${id}`);
  }

  async createCampaign(data: CreateCampaignData): Promise<Campaign> {
    return this.request<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Donation endpoints
  async makeDonation(data: DonationData): Promise<{ txHash: string; donationId: string }> {
    return this.request<{ txHash: string; donationId: string }>('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDonations(campaignId: string): Promise<any[]> {
    return this.request<any[]>(`/donations/campaign/${campaignId}`);
  }

  // User endpoints
  async getUserDonations(address: string): Promise<any[]> {
    return this.request<any[]>(`/donations/user/${address}`);
  }

  async getUserCampaigns(address: string): Promise<Campaign[]> {
    return this.request<Campaign[]>(`/campaigns/user/${address}`);
  }

  // Statistics
  async getStats(): Promise<{
    totalDonated: number;
    totalCampaigns: number;
    totalDonors: number;
    activeCampaigns: number;
  }> {
    return this.request<any>('/stats');
  }

  // Transaction tracking endpoints
  async getCampaignTransactions(campaignId: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/campaigns/${campaignId}/transactions`);
  }

  async getCampaignMoneyUsage(campaignId: string): Promise<MoneyUsage[]> {
    return this.request<MoneyUsage[]>(`/campaigns/${campaignId}/usage`);
  }

  async addMoneyUsage(campaignId: string, data: {
    description: string;
    amount: number;
    category: string;
    proofUrl?: string;
  }): Promise<MoneyUsage> {
    return this.request<MoneyUsage>(`/campaigns/${campaignId}/usage`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();