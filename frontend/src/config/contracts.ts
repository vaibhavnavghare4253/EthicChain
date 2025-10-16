// Smart Contract Addresses
export const CONTRACTS = {
  // Base Mainnet
  8453: {
    CAMPAIGN_FACTORY: '0x0000000000000000000000000000000000000000', // Deploy and update
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  // Base Sepolia Testnet
  84532: {
    CAMPAIGN_FACTORY: '0x0000000000000000000000000000000000000000', // Deploy and update
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
  // Polygon Mainnet
  137: {
    CAMPAIGN_FACTORY: '0x0000000000000000000000000000000000000000', // Deploy and update
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  },
  // Polygon Amoy Testnet
  80002: {
    CAMPAIGN_FACTORY: '0x0000000000000000000000000000000000000000', // Deploy and update
    USDC: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACTS;

export const getContractAddress = (
  chainId: number,
  contract: 'CAMPAIGN_FACTORY' | 'USDC'
): string => {
  const addresses = CONTRACTS[chainId as SupportedChainId];
  if (!addresses) throw new Error(`Unsupported chain ID: ${chainId}`);
  return addresses[contract];
};

