# 🌟 Blockchain Charity & Funding Platform

A transparent, decentralized charity platform built with modern Web3 technologies, enabling donors to track their contributions on-chain and charities to receive funds with complete transparency.

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with server components
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **Ethers.js** - Blockchain interactions

### Backend
- **ASP.NET Core 8.0** - Web API
- **PostgreSQL** - Database
- **Stored Procedures** - Database logic
- **JWT Authentication** - Security
- **SignalR** - Real-time updates

### Blockchain
- **Base/Polygon** - Layer 2 networks (low fees)
- **Solidity** - Smart contracts
- **Foundry** - Development framework
- **TheGraph** - Blockchain data indexing
- **IPFS** - Decentralized storage

## 📁 Project Structure

```
charity-app/
├── frontend/                 # Next.js 14 application
├── backend/                  # ASP.NET Core Web API
├── contracts/                # Solidity smart contracts
├── database/                 # PostgreSQL scripts & migrations
├── subgraph/                 # TheGraph indexing
└── docs/                     # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- .NET 8.0 SDK
- PostgreSQL 14+
- Foundry (for smart contracts)
- MetaMask wallet

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend Setup
```bash
cd backend
dotnet restore
dotnet run
# Runs on http://localhost:5000
```

### Smart Contracts Setup
```bash
cd contracts
forge install
forge build
forge test
```

### Database Setup
```bash
cd database
psql -U postgres -f schema.sql
psql -U postgres -f stored_procedures.sql
```

## 🎯 Key Features

- ✅ **Wallet Connection** - MetaMask, WalletConnect, Coinbase Wallet
- ✅ **Create Campaigns** - Charities can create fundraising campaigns
- ✅ **Donate Crypto** - Donate ETH, USDC, DAI, etc.
- ✅ **Track Donations** - Real-time blockchain tracking
- ✅ **Milestone-Based Release** - Funds released based on milestones
- ✅ **Transparency Dashboard** - View all transactions on-chain
- ✅ **Fiat On-Ramp** - Accept credit card donations (converted to crypto)
- ✅ **Multi-Chain Support** - Works on Polygon, Base, Ethereum

## 🔐 Security

- Smart contracts audited
- Multi-signature wallet support
- KYC/AML compliance for charities
- Rate limiting on API
- SQL injection prevention (stored procedures)

## 📊 Environment Variables

See `.env.example` files in each directory for required environment variables.

## 📖 Documentation

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Smart Contracts Documentation](./contracts/README.md)
- [Database Schema](./database/README.md)

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ for transparency in charitable giving

