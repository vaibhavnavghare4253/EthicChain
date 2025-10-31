#!/bin/bash

# Database Migration Script for Charity Blockchain
# This script will run the stored procedures to set up the database

echo "🚀 Setting up Charity Blockchain Database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) is not installed or not in PATH"
    exit 1
fi

# Database connection parameters
DB_HOST="localhost"
DB_NAME="EthicChain"
DB_USER="postgres"
DB_PASSWORD="Root@123"

# Set PGPASSWORD environment variable
export PGPASSWORD=$DB_PASSWORD

echo "📊 Running database schema..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully"
else
    echo "❌ Failed to create database schema"
    exit 1
fi

echo "🔧 Running stored procedures..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f database/stored_procedures.sql

if [ $? -eq 0 ]; then
    echo "✅ Stored procedures created successfully"
else
    echo "❌ Failed to create stored procedures"
    exit 1
fi

echo "📝 Inserting sample data..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f database/sample_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Sample data inserted successfully"
else
    echo "⚠️  Sample data insertion failed (this is optional)"
fi

echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend API: cd backend/CharityBlockchain.API && dotnet run"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Visit http://localhost:3000 to see the application"
