# 🎨 Charity Blockchain - Frontend

Modern Next.js 14 frontend with Web3 integration for the Charity Blockchain platform.

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **RainbowKit** - Beautiful wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Hot Toast** - Notifications

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Get your WalletConnect Project ID from: https://cloud.walletconnect.com/

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Web3 providers
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── home/             # Home page components
│   ├── campaigns/        # Campaign components
│   └── ui/               # Reusable UI components
├── config/               # Configuration
│   ├── wagmi.ts         # Wagmi config
│   └── contracts.ts     # Contract addresses
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript types
└── styles/              # Global styles
```

## 🎯 Key Features

### Wallet Connection
- Multiple wallet support (MetaMask, Coinbase, WalletConnect)
- Network switching
- Account management

### Campaign Management
- Browse campaigns
- Create new campaigns
- View campaign details
- Track donations

### Blockchain Integration
- Read from smart contracts
- Write transactions
- Listen to events
- Handle transaction states

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🌐 Supported Networks

- **Base** (Mainnet & Sepolia)
- **Polygon** (Mainnet & Amoy)
- **Ethereum** (Mainnet & Sepolia)

## 📝 Adding New Components

1. Create component in appropriate folder
2. Use TypeScript for type safety
3. Follow naming conventions (PascalCase)
4. Export from component file

Example:
```tsx
// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
}
```

## 🎨 Styling Guidelines

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Use custom color palette from tailwind.config.ts
- Maintain consistent spacing

## 🔐 Security Best Practices

- Never commit private keys
- Validate all user inputs
- Use environment variables for sensitive data
- Sanitize data before rendering
- Implement proper error handling

## 🐛 Debugging

Enable verbose logging:
```tsx
// Add to providers.tsx
const config = getDefaultConfig({
  // ... existing config
  logger: {
    warn: console.warn,
    error: console.error,
  },
});
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit Docs](https://rainbowkit.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [TailwindCSS Docs](https://tailwindcss.com)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

