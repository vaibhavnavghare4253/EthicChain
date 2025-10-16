import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia, polygon, polygonAmoy } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Charity Blockchain',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    base,
    baseSepolia,
    polygon,
    polygonAmoy,
  ],
  ssr: true,
});

