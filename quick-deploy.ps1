# Quick Deploy Script
cd "c:\Users\Iamja\Desktop\Whatsapp Project"
Write-Host "=== Git Push ===" -ForegroundColor Cyan
git add .
git commit -m "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main
Write-Host "`nâœ… Code pushed to GitHub!" -ForegroundColor Green
Write-Host "`n=== Next Steps ===" -ForegroundColor Yellow
Write-Host "1. Wait 1-2 minutes for Vercel auto-deploy" -ForegroundColor White
Write-Host "2. Or manually redeploy from Vercel Dashboard" -ForegroundColor White
Write-Host "3. Test: https://whatsapp-booking-system.vercel.app/api/auth/login" -ForegroundColor White
