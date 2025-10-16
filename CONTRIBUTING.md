# 🤝 Contributing to Charity Blockchain

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Charity Blockchain platform.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Bug Reports](#bug-reports)
8. [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Accepting constructive criticism gracefully
- ✅ Focusing on what's best for the community
- ❌ Harassment or discriminatory behavior

---

## Getting Started

### Prerequisites

- Read the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Read the [ARCHITECTURE.md](./ARCHITECTURE.md)
- Set up your local development environment

### Fork and Clone

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/charity-blockchain.git

# Add upstream remote
git remote add upstream https://github.com/original/charity-blockchain.git

# Verify remotes
git remote -v
```

---

## Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-recurring-donations`
- `fix/wallet-connection-timeout`
- `docs/update-api-documentation`

### 2. Make Changes

- Write clean, readable code
- Follow code style guidelines
- Add tests for new features
- Update documentation as needed
- Commit frequently with clear messages

### 3. Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

**Examples:**

```bash
feat(frontend): add donation form validation

- Add validation for amount field
- Check wallet balance before submission
- Display user-friendly error messages

Closes #123
```

```bash
fix(backend): resolve database connection timeout

- Increase connection pool size
- Add retry logic for failed connections
- Log connection errors

Fixes #456
```

### 4. Push Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

---

## Code Standards

### TypeScript/JavaScript (Frontend)

```typescript
// ✅ Good
interface CampaignProps {
  id: string;
  title: string;
  amount: bigint;
}

export function CampaignCard({ id, title, amount }: CampaignProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="campaign-card">
      <h2>{title}</h2>
      <p>{formatEther(amount)} ETH</p>
    </div>
  );
}

// ❌ Bad
function Card(props: any) {
  return <div>{props.title}</div>;
}
```

### C# (Backend)

```csharp
// ✅ Good
public async Task<ActionResult<CampaignDto>> GetCampaign(Guid id)
{
    try
    {
        var campaign = await _campaignService.GetCampaignByIdAsync(id);
        
        if (campaign == null)
        {
            return NotFound($"Campaign {id} not found");
        }
        
        return Ok(campaign);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching campaign {CampaignId}", id);
        return StatusCode(500, "Internal server error");
    }
}

// ❌ Bad
public CampaignDto GetCampaign(Guid id)
{
    return _campaignService.GetCampaignByIdAsync(id).Result;
}
```

### Solidity (Smart Contracts)

```solidity
// ✅ Good
/// @notice Donate to this campaign
/// @param _message Optional message from donor
function donate(string memory _message) 
    external 
    payable 
    campaignActive 
    nonReentrant 
{
    require(msg.value > 0, "Donation must be > 0");
    
    // Logic here...
    
    emit DonationReceived(msg.sender, msg.value, block.timestamp, _message);
}

// ❌ Bad
function donate(string memory _message) external payable {
    // No checks, no events, no documentation
}
```

### General Guidelines

- **Naming:**
  - Use descriptive names
  - camelCase for variables/functions
  - PascalCase for types/classes
  - UPPER_CASE for constants

- **Comments:**
  - Comment "why", not "what"
  - Use JSDoc/XML documentation
  - Keep comments up-to-date

- **File Organization:**
  - One component per file
  - Group related functionality
  - Use index files for exports

---

## Testing Guidelines

### Frontend Tests

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { CampaignCard } from '@/components/campaigns/CampaignCard';

describe('CampaignCard', () => {
  it('displays campaign information correctly', () => {
    const campaign = {
      id: '1',
      title: 'Test Campaign',
      amount: 1000n
    };
    
    render(<CampaignCard {...campaign} />);
    
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });
});
```

### Backend Tests

```csharp
[Fact]
public async Task GetCampaignById_ReturnsCorrectCampaign()
{
    // Arrange
    var campaignId = Guid.NewGuid();
    var expectedCampaign = new CampaignDto { Id = campaignId };
    _mockService.Setup(s => s.GetCampaignByIdAsync(campaignId))
        .ReturnsAsync(expectedCampaign);
    
    // Act
    var result = await _controller.GetById(campaignId);
    
    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result.Result);
    var campaign = Assert.IsType<CampaignDto>(okResult.Value);
    Assert.Equal(campaignId, campaign.Id);
}
```

### Smart Contract Tests

```solidity
function testDonation() public {
    uint256 donationAmount = 1 ether;
    
    vm.deal(donor1, donationAmount);
    vm.prank(donor1);
    campaign.donate{value: donationAmount}("Great cause!");
    
    assertEq(campaign.totalRaised(), donationAmount);
    assertEq(campaign.donorContributions(donor1), donationAmount);
}
```

### Test Coverage

- Aim for **80%+ code coverage**
- Test edge cases and error conditions
- Test user workflows end-to-end

---

## Pull Request Process

### 1. Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Added tests for new features
- [ ] Updated documentation
- [ ] No console.log or debugging code
- [ ] Branch is up-to-date with main

```bash
# Update your branch
git checkout main
git pull upstream main
git checkout feature/your-feature-name
git rebase main
```

### 2. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #123
```

### 3. Code Review

- Address reviewer feedback promptly
- Push updates to the same branch
- Request re-review when ready

### 4. Merge

- Squash commits if requested
- Ensure CI/CD passes
- Wait for maintainer approval

---

## Bug Reports

### Before Reporting

1. Check existing issues
2. Try latest version
3. Verify it's reproducible

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Actual behavior**
What actually happens

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node Version: [e.g. 18.17.0]
- Wallet: [e.g. MetaMask 11.0]

**Additional context**
Any other relevant information
```

---

## Feature Requests

### Template

```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What problem does this address?

**Proposed Solution**
How would you implement this?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, etc.
```

---

## Development Tips

### Running Locally

```bash
# Backend
cd backend/CharityBlockchain.API
dotnet watch run

# Frontend
cd frontend
npm run dev

# Smart Contracts
cd contracts
forge test --watch
```

### Debugging

**Frontend:**
- Use React DevTools
- Check browser console
- Use debugger statements

**Backend:**
- Use Visual Studio debugger
- Check Serilog logs
- Use Postman for API testing

**Smart Contracts:**
- Use `console.log` in Foundry tests
- Use `forge test -vvvv` for verbose output
- Check transaction traces

---

## Getting Help

- 💬 **Discussions:** GitHub Discussions
- 🐛 **Issues:** GitHub Issues
- 📖 **Docs:** Check documentation
- 💡 **Ideas:** Start a discussion

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**

