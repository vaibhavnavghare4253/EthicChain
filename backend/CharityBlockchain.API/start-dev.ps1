# Start Charity Blockchain API in Development Mode
# This script sets the environment to Development and starts the API

Write-Host "Starting Charity Blockchain API..." -ForegroundColor Green

# Set environment to Development (enables Swagger UI)
$env:ASPNETCORE_ENVIRONMENT = "Development"

# Navigate to the API directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check if PostgreSQL is running
$pgService = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq "Running") {
    Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "⚠ Warning: PostgreSQL service not found or not running!" -ForegroundColor Yellow
    Write-Host "  Please ensure PostgreSQL is installed and running." -ForegroundColor Yellow
}

# Check if port 5000 is already in use
$portInUse = netstat -ano | Select-String ":5000.*LISTENING"
if ($portInUse) {
    Write-Host "⚠ Port 5000 is already in use!" -ForegroundColor Yellow
    Write-Host "  Attempting to stop existing process..." -ForegroundColor Yellow
    
    # Extract PID and kill the process
    $pid = ($portInUse -split '\s+')[-1]
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Stopped process $pid" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

Write-Host "`nStarting API server..." -ForegroundColor Cyan
Write-Host "Swagger UI will be available at: http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

# Start the application
dotnet run

