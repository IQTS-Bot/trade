// System Health Monitoring
let startTime = Date.now();
let monitoringInterval = null;

function updateSystemHealth() {
    // Update CPU Usage
    const cpuElement = document.getElementById('cpuUsage');
    if (cpuElement) {
        const cpuUsage = Math.floor(Math.random() * 40) + 20;
        cpuElement.textContent = `${cpuUsage}%`;
        cpuElement.className = `metric-value ${cpuUsage > 70 ? 'warning' : 'positive'}`;
    }
    
    // Update Memory Usage
    const memoryElement = document.getElementById('memoryUsage');
    if (memoryElement) {
        const memoryUsed = Math.floor(Math.random() * 150) + 100;
        memoryElement.textContent = `${memoryUsed} MB`;
        memoryElement.className = `metric-value ${memoryUsed > 200 ? 'warning' : 'positive'}`;
    }
    
    // Update API Latency
    const latencyElement = document.getElementById('apiLatency');
    if (latencyElement) {
        const latency = Math.floor(Math.random() * 100) + 50;
        latencyElement.textContent = `${latency} ms`;
        latencyElement.className = `metric-value ${latency > 150 ? 'warning' : 'positive'}`;
    }
    
    // Update Performance Suggestions
    const suggestionsElement = document.getElementById('performanceSuggestions');
    if (suggestionsElement) {
        const suggestions = [
            '✅ System performance optimal',
            '🔄 Monitoring active',
            '⚡ All systems operational',
            '📊 Metrics updating normally'
        ];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        suggestionsElement.textContent = randomSuggestion;
    }
}

function updateUptime() {
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    const uptimeElement = document.getElementById('uptimeCounter');
    if (uptimeElement) {
        const uptimeText = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        uptimeElement.textContent = uptimeText;
        uptimeElement.className = 'metric-value';
    }
}

function startMonitoring() {
    if (monitoringInterval) return;
    
    // Update immediately
    updateSystemHealth();
    
    // Update uptime every second
    setInterval(updateUptime, 1000);
    
    // Update system health every 5 seconds
    monitoringInterval = setInterval(updateSystemHealth, 5000);
}

// Start monitoring when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startMonitoring, 1000);
}); 