# 🗄️ Charity Blockchain - Database

PostgreSQL database schema and stored procedures for the Charity Blockchain platform.

## 📋 Database Schema

### Tables

#### users
Stores user profile information linked to wallet addresses.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| wallet_address | VARCHAR(42) | Ethereum wallet address (unique) |
| display_name | VARCHAR(100) | User display name |
| email | VARCHAR(255) | Email address |
| avatar_url | TEXT | Profile picture URL |
| is_verified | BOOLEAN | KYC verification status |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

#### campaigns
Main table for charity campaigns.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Campaign title |
| description | TEXT | Campaign description |
| image_url | TEXT | Campaign image |
| target_amount | DECIMAL(20,8) | Target funding amount |
| current_amount | DECIMAL(20,8) | Current raised amount |
| creator_address | VARCHAR(42) | Creator's wallet |
| charity_name | VARCHAR(255) | Charity organization name |
| category | VARCHAR(100) | Campaign category |
| deadline | TIMESTAMP | Campaign end date |
| is_active | BOOLEAN | Campaign active status |
| beneficiary_address | VARCHAR(42) | Fund recipient address |
| ipfs_hash | TEXT | IPFS hash for details |
| contract_address | VARCHAR(42) | Smart contract address |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### milestones
Campaign milestones for phased fund release.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to campaigns |
| title | VARCHAR(255) | Milestone title |
| description | TEXT | Milestone description |
| target_percentage | INTEGER | Target percentage (1-100) |
| is_completed | BOOLEAN | Completion status |
| completed_at | TIMESTAMP | Completion time |
| proof_url | TEXT | Proof of completion |
| created_at | TIMESTAMP | Creation time |

#### donations
All donations made to campaigns.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to campaigns |
| donor_address | VARCHAR(42) | Donor's wallet |
| amount | DECIMAL(20,8) | Donation amount |
| tx_hash | VARCHAR(66) | Blockchain transaction hash |
| message | TEXT | Optional donor message |
| is_anonymous | BOOLEAN | Anonymous donation flag |
| timestamp | TIMESTAMP | Donation time |

## 🔧 Installation

### Prerequisites
- PostgreSQL 14 or higher
- psql command-line tool

### Setup

```bash
# Database already created as EthicChain

# Run schema (from the database directory)
psql -U postgres -d EthicChain -f schema.sql

# Run stored procedures
psql -U postgres -d EthicChain -f stored_procedures.sql
```

### Using Docker

```bash
# Start PostgreSQL
docker run --name charity-postgres \
  -e POSTGRES_PASSWORD=Root@123 \
  -e POSTGRES_DB=EthicChain \
  -p 5432:5432 \
  -d postgres:14

# Run migrations
docker exec -i charity-postgres psql -U postgres -d EthicChain < schema.sql
docker exec -i charity-postgres psql -U postgres -d EthicChain < stored_procedures.sql
```

## 📝 Stored Procedures

### Campaign Procedures

```sql
-- Get all campaigns with calculated fields
SELECT * FROM sp_get_all_campaigns();

-- Get specific campaign
SELECT * FROM sp_get_campaign_by_id('campaign-uuid');

-- Create campaign
SELECT sp_create_campaign(
    'Campaign Title',
    'Description',
    'https://image.url',
    50000.00,
    '0xCreatorAddress',
    'Charity Name',
    'Category',
    '2025-12-31 23:59:59',
    '0xBeneficiaryAddress',
    'QmIPFSHash'
);

-- Update campaign
SELECT sp_update_campaign(
    'campaign-uuid',
    'New Title',
    NULL,
    NULL,
    FALSE
);

-- Get active campaigns only
SELECT * FROM sp_get_active_campaigns();
```

### Donation Procedures

```sql
-- Get donations for a campaign (returns donation_timestamp instead of timestamp)
SELECT * FROM sp_get_donations_by_campaign('campaign-uuid');

-- Create donation
SELECT sp_create_donation(
    'campaign-uuid',
    '0xDonorAddress',
    1.5,
    '0xTransactionHash',
    'Great cause!',
    FALSE
);

-- Get donation statistics
SELECT * FROM sp_get_donation_stats('campaign-uuid');

-- Get donations by donor (returns donation_timestamp instead of timestamp)
SELECT * FROM sp_get_donations_by_donor('0xDonorAddress');
```

### Milestone Procedures

```sql
-- Get milestones
SELECT * FROM sp_get_milestones('campaign-uuid');

-- Create milestone
SELECT sp_create_milestone(
    'campaign-uuid',
    'Milestone Title',
    'Description',
    50
);

-- Complete milestone
SELECT sp_complete_milestone('milestone-uuid', 'https://proof.url');
```

### Analytics Procedures

```sql
-- Get platform statistics
SELECT * FROM sp_get_platform_stats();

-- Get top campaigns
SELECT * FROM sp_get_top_campaigns(10);
```

### User Procedures

```sql
-- Upsert user
SELECT sp_upsert_user(
    '0xWalletAddress',
    'Display Name',
    'email@example.com',
    'https://avatar.url'
);

-- Get user by wallet
SELECT * FROM sp_get_user_by_wallet('0xWalletAddress');
```

## 🔍 Key Features

### Auto-updating Fields
- **current_amount** - Automatically updated via trigger when donations are inserted
- **updated_at** - Automatically updated on row modifications

### Triggers
- `update_campaign_amount_on_donation` - Updates campaign total when donation is made
- `update_users_updated_at` - Updates timestamp on user changes
- `update_campaigns_updated_at` - Updates timestamp on campaign changes

### Indexes
Optimized indexes for:
- Wallet address lookups
- Campaign filtering by category, status, deadline
- Donation queries by campaign and donor
- Transaction hash lookups

## 🛡️ Security

- Input validation via CHECK constraints
- Foreign key constraints for data integrity
- Unique constraints on wallet addresses and transaction hashes
- Parameterized stored procedures prevent SQL injection

## 📊 Sample Queries

### Get campaign progress
```sql
SELECT 
    title,
    current_amount,
    target_amount,
    ROUND((current_amount / target_amount) * 100, 2) as progress_percentage
FROM campaigns
WHERE id = 'campaign-uuid';
```

### Get top donors for a campaign
```sql
SELECT 
    donor_address,
    SUM(amount) as total_donated,
    COUNT(*) as donation_count
FROM donations
WHERE campaign_id = 'campaign-uuid'
GROUP BY donor_address
ORDER BY total_donated DESC
LIMIT 10;
```

### Get campaigns ending soon
```sql
SELECT * FROM sp_get_active_campaigns()
WHERE days_left <= 7
ORDER BY days_left ASC;
```

## 🔄 Migrations

For schema changes, create migration files:

```sql
-- migrations/001_add_field.sql
ALTER TABLE campaigns ADD COLUMN new_field VARCHAR(100);
```

## 🧪 Testing

Sample test queries:

```sql
-- Test campaign creation
SELECT sp_create_campaign(
    'Test Campaign',
    'Test Description',
    'https://test.com/image.jpg',
    1000.00,
    '0x1234567890123456789012345678901234567890',
    'Test Charity',
    'Testing',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    '0x1234567890123456789012345678901234567890',
    'QmTestHash'
);

-- Verify creation
SELECT * FROM sp_get_all_campaigns();
```

## 📈 Performance Tips

1. **Use stored procedures** - Faster than multiple roundtrips
2. **Leverage indexes** - All common queries are indexed
3. **Connection pooling** - Use PgBouncer or similar
4. **Regular VACUUM** - Keep statistics updated
5. **Monitor slow queries** - Use pg_stat_statements

## 🔧 Maintenance

```sql
-- Vacuum tables
VACUUM ANALYZE campaigns;
VACUUM ANALYZE donations;

-- Reindex if needed
REINDEX TABLE campaigns;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 📄 Backup & Restore

```bash
# Backup
pg_dump -U postgres EthicChain > backup.sql

# Restore
psql -U postgres EthicChain < backup.sql
```

## 📚 Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PL/pgSQL Guide](https://www.postgresql.org/docs/current/plpgsql.html)

## 📄 License

MIT License

