# Script to create admin account
Write-Host "Creating admin account..." -ForegroundColor Cyan

$body = @{
    email = "admin@example.com"
    password = "Admin123!"
    name = "Admin User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "`n✅ Admin account created successfully!" -ForegroundColor Green
    Write-Host "Email: admin@example.com" -ForegroundColor White
    Write-Host "Password: Admin123!" -ForegroundColor White
    Write-Host "`n⚠️  Please change the password after first login!" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "`n⚠️  Admin account already exists!" -ForegroundColor Yellow
        Write-Host "Use existing credentials or login directly." -ForegroundColor White
    } else {
        Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Make sure the backend server is running on http://localhost:5000" -ForegroundColor Yellow
    }
}
