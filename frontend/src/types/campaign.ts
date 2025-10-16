export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: bigint;
  currentAmount: bigint;
  creatorAddress: string;
  charityName: string;
  category: string;
  deadline: Date;
  isActive: boolean;
  milestones: Milestone[];
  donations: Donation[];
  beneficiaryAddress: string;
  ipfsHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  targetAmount: bigint;
  isCompleted: boolean;
  completedAt?: Date;
  proof?: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorAddress: string;
  amount: bigint;
  txHash: string;
  timestamp: Date;
  message?: string;
  isAnonymous: boolean;
}

export interface CreateCampaignInput {
  title: string;
  description: string;
  targetAmount: string;
  category: string;
  deadline: Date;
  charityName: string;
  beneficiaryAddress: string;
  imageFile?: File;
  milestones: {
    title: string;
    description: string;
    targetPercentage: number;
  }[];
}

