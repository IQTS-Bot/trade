# Real System Metrics Server for Windows
# Gets actual CPU, Memory, and Network metrics

Add-Type -AssemblyName System.Net.Http
Add-Type -AssemblyName System.Web

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()

Write-Host "🔥 REAL System Metrics Server Started on http://localhost:8080" -ForegroundColor Green
Write-Host "📊 Getting live CPU, Memory, and Network data..." -ForegroundColor Cyan

$startTime = Get-Date

while ($listener.IsListening) {
    try {
        # Wait for request
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Set CORS headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
        $response.ContentType = "application/json"
        
        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }
        
        # Get REAL system metrics
        Write-Host "📈 Getting real system data..." -ForegroundColor Yellow
        
        # Real CPU Usage
        $cpuCounter = Get-Counter "\Processor(_Total)\% Processor Time" -SampleInterval 1 -MaxSamples 2
        $cpuUsage = [math]::Round(($cpuCounter | Select-Object -Last 1).CounterSamples.CookedValue, 1)
        
        # Real Memory Usage
        $totalMemory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1MB
        $availableMemory = (Get-Counter "\Memory\Available MBytes").CounterSamples.CookedValue
        $usedMemory = $totalMemory - $availableMemory
        $memoryPercent = [math]::Round(($usedMemory / $totalMemory) * 100, 1)
        
        # System uptime
        $uptime = (Get-Date) - $startTime
        $uptimeSeconds = [math]::Floor($uptime.TotalSeconds)
        
        # Network test (ping to Google)
        $ping = Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet
        $latency = if ($ping) {
            (Test-Connection -ComputerName "8.8.8.8" -Count 1).ResponseTime
        } else { 999 }
        
        # System info
        $computerInfo = Get-ComputerInfo
        $cpuInfo = Get-CimInstance Win32_Processor | Select-Object -First 1
        
        # Create JSON response with REAL data
        $metrics = @{
            timestamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
            uptime = $uptimeSeconds
            cpu = @{
                usage = $cpuUsage
                cores = $cpuInfo.NumberOfCores
                model = $cpuInfo.Name
                speed = $cpuInfo.MaxClockSpeed
            }
            memory = @{
                total = [math]::Round($totalMemory, 0)
                used = [math]::Round($usedMemory, 0)
                free = [math]::Round($availableMemory, 0)
                usagePercent = $memoryPercent
            }
            network = @{
                latency = $latency
                connected = $ping
            }
            system = @{
                hostname = $env:COMPUTERNAME
                platform = "Windows"
                version = $computerInfo.WindowsVersion
                architecture = $env:PROCESSOR_ARCHITECTURE
            }
        }
        
        $jsonResponse = $metrics | ConvertTo-Json -Depth 3
        
        # Send response
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.Close()
        
        Write-Host "✅ Sent real metrics: CPU: $cpuUsage%, Memory: $([math]::Round($usedMemory))MB, Latency: ${latency}ms" -ForegroundColor Green
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        try {
            $response.StatusCode = 500
            $response.Close()
        } catch { }
    }
}

$listener.Stop()
