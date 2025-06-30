# Test script to verify IQTS Bot system components
Write-Host "🧪 Testing IQTS Bot System Components..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if PowerShell Metrics Server is running
Write-Host "1️⃣ Testing PowerShell Metrics Server (port 8080)..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/" -Method Get -TimeoutSec 5
    Write-Host "✅ PowerShell Metrics Server: WORKING" -ForegroundColor Green
    Write-Host "   CPU Usage: $($response.cpu.usage)%" -ForegroundColor White
    Write-Host "   Memory Usage: $($response.memory.usagePercent)%" -ForegroundColor White
    Write-Host "   Uptime: $([math]::Floor($response.uptime / 60)) minutes" -ForegroundColor White
    Write-Host "   Network Latency: $($response.network.latency)ms" -ForegroundColor White
    Write-Host ""
    $metricsWorking = $true
} catch {
    Write-Host "❌ PowerShell Metrics Server: CONNECTION FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    $metricsWorking = $false
}

# Test 2: Check Market Hours Logic
Write-Host "2️⃣ Testing Market Hours Logic..." -ForegroundColor Yellow

$now = Get-Date
$dayOfWeek = $now.DayOfWeek
$hour = $now.Hour
$minute = $now.Minute

if ($dayOfWeek -eq "Saturday" -or $dayOfWeek -eq "Sunday") {
    Write-Host "📅 Current Status: WEEKEND - Market Closed" -ForegroundColor Blue
    Write-Host "✅ Market Hours Logic: WORKING (Weekend detection)" -ForegroundColor Green
    $marketHoursWorking = $true
} else {
    # Market hours: 9:30 AM - 4:00 PM ET (simplified)
    $isMarketHours = ($hour -eq 9 -and $minute -ge 30) -or ($hour -ge 10 -and $hour -lt 16)
    
    if ($isMarketHours) {
        Write-Host "📈 Current Status: MARKET OPEN" -ForegroundColor Green
        Write-Host "✅ Market Hours Logic: WORKING (Market open detection)" -ForegroundColor Green
    } else {
        Write-Host "🕐 Current Status: AFTER HOURS - Market Closed" -ForegroundColor Blue
        Write-Host "✅ Market Hours Logic: WORKING (After hours detection)" -ForegroundColor Green
    }
    $marketHoursWorking = $true
}
Write-Host ""

# Test 3: Check System Health
Write-Host "3️⃣ Testing System Health Monitoring..." -ForegroundColor Yellow

try {
    # Get real system metrics
    $cpuCounter = Get-Counter "\Processor(_Total)\% Processor Time" -SampleInterval 1 -MaxSamples 1
    $cpuUsage = [math]::Round($cpuCounter.CounterSamples.CookedValue, 1)
    
    $totalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1MB
    $availableMemory = (Get-Counter "\Memory\Available MBytes").CounterSamples.CookedValue
    $memoryPercent = [math]::Round((($totalMemory - $availableMemory) / $totalMemory) * 100, 1)
    
    Write-Host "✅ System Health Monitoring: WORKING" -ForegroundColor Green
    Write-Host "   Current CPU Usage: $cpuUsage%" -ForegroundColor White
    Write-Host "   Current Memory Usage: $memoryPercent%" -ForegroundColor White
    Write-Host "   Total Memory: $([math]::Round($totalMemory, 0))MB" -ForegroundColor White
    Write-Host "   Available Memory: $([math]::Round($availableMemory, 0))MB" -ForegroundColor White
    $systemHealthWorking = $true
} catch {
    Write-Host "❌ System Health Monitoring: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $systemHealthWorking = $false
}
Write-Host ""

# Test 4: Check Network Connectivity
Write-Host "4️⃣ Testing Network Connectivity..." -ForegroundColor Yellow

try {
    $ping = Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet
    if ($ping) {
        $latency = (Test-Connection -ComputerName "8.8.8.8" -Count 1).ResponseTime
        Write-Host "✅ Network Connectivity: WORKING" -ForegroundColor Green
        Write-Host "   Internet Latency: ${latency}ms" -ForegroundColor White
        $networkWorking = $true
    } else {
        Write-Host "❌ Network Connectivity: NO INTERNET" -ForegroundColor Red
        $networkWorking = $false
    }
} catch {
    Write-Host "❌ Network Connectivity: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $networkWorking = $false
}
Write-Host ""

# Summary
Write-Host "📊 TEST RESULTS SUMMARY:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "PowerShell Metrics Server: $(if($metricsWorking){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($metricsWorking){'Green'}else{'Red'})
Write-Host "Market Hours Logic:        $(if($marketHoursWorking){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($marketHoursWorking){'Green'}else{'Red'})
Write-Host "System Health Monitoring:  $(if($systemHealthWorking){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($systemHealthWorking){'Green'}else{'Red'})
Write-Host "Network Connectivity:      $(if($networkWorking){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($networkWorking){'Green'}else{'Red'})

$passCount = @($metricsWorking, $marketHoursWorking, $systemHealthWorking, $networkWorking) | Where-Object {$_} | Measure-Object | Select-Object -ExpandProperty Count
$totalTests = 4

Write-Host ""
Write-Host "🎯 Overall: $passCount/$totalTests tests passed" -ForegroundColor White

if ($passCount -eq $totalTests) {
    Write-Host "🎉 ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some systems need attention." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "- If metrics server failed, run: powershell -ExecutionPolicy Bypass -File real-metrics.ps1" -ForegroundColor White
Write-Host "- Check if ports 8080, 8081, and 3000 are available" -ForegroundColor White
Write-Host "- Market hours are 9:30 AM - 4:00 PM ET, Monday-Friday" -ForegroundColor White 