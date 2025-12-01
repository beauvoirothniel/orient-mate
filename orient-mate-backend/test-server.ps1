# test-server.ps1
Write-Host "🧪 Testing OrientMate Backend..." -ForegroundColor Cyan

# Test health endpoint
try {
    $health = Invoke-WebRequest -Uri "http://const API_BASE_URL = 'http://localhost:5001/api';/api/health" -UseBasicParsing
    Write-Host "✅ Health Check: $($health.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test AI endpoint
try {
    $body = @{
        message = "Bonjour, peux-tu m'aider avec l'orientation ?"
    } | ConvertTo-Json

    $aiTest = Invoke-WebRequest -Uri "http://const API_BASE_URL = 'http://localhost:5001/api';/api/test-ai" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing
    Write-Host "✅ AI Test: $($aiTest.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ AI Test Failed: $_" -ForegroundColor Red
}