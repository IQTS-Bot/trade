setAIMode(mode) {
    this.aiMode = mode;
    this.addActivity(`AI mode changed to ${mode === 'auto' ? 'Full Automatic' : 'Manual Control'}`, 'system');
    
    const statusElement = document.getElementById('aiStatus');
    if (statusElement) {
        const dot = statusElement.querySelector('.status-dot');
        const text = statusElement.querySelector('span');
        
        if (mode === 'auto') {
            dot.style.background = 'var(--positive)';
            text.textContent = 'Full Automatic';
            this.addAIActivity('Switched to full automatic mode - AI has full control');
        } else {
            dot.style.background = 'var(--warning)';
            text.textContent = 'Manual Control';
            this.addAIActivity('Switched to manual control mode - human supervision required');
        }
    }
}

addAIActivity(message) {
    const log = document.getElementById('aiActivityLog');
    if (!log) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    const entry = document.createElement('div');
    entry.style.marginBottom = '5px';
    entry.style.wordBreak = 'break-word';
    entry.innerHTML = `<span style="color: var(--accent);">[${timeString}]</span> ${message}`;
    
    log.appendChild(entry);
    
    // Auto-scroll to bottom
    log.scrollTop = log.scrollHeight;
    
    // Update progress bar randomly to simulate activity
    this.updateAIProgress();
}

updateAIProgress() {
    const progressBar = document.getElementById('aiProgressBar');
    if (!progressBar) return;
    
    // Random progress for demonstration
    const currentWidth = parseInt(progressBar.style.width) || 0;
    let newWidth;
    
    if (this.aiMode === 'auto') {
        // More aggressive progress in auto mode
        newWidth = currentWidth + Math.random() * 20;
        if (newWidth > 100) newWidth = 0;
    } else {
        // Slower progress in manual mode
        newWidth = currentWidth + Math.random() * 5;
        if (newWidth > 100) newWidth = 100;
    }
    
    progressBar.style.width = `${newWidth}%`;
    
    // Change color based on progress
    if (newWidth > 80) {
        progressBar.style.background = 'var(--positive)';
    } else if (newWidth > 50) {
        progressBar.style.background = 'var(--accent)';
    } else {
        progressBar.style.background = 'var(--warning)';
    }
}

simulateAIActivity() {
    if (!this.isRunning) return;
    
    const activities = [
        "Analyzing market trends...",
        "Processing historical data...",
        "Calculating risk parameters...",
        "Evaluating trading opportunities...",
        "Optimizing portfolio allocation...",
        "Running backtests...",
        "Updating prediction models...",
        "Generating trade signals...",
        "Assessing market sentiment...",
        "Adjusting strategy parameters..."
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    this.addAIActivity(randomActivity);
    
    // Schedule next activity
    const delay = this.aiMode === 'auto' ? 
        Math.random() * 3000 + 1000 : // 1-4 seconds in auto mode
        Math.random() * 5000 + 2000;  // 2-7 seconds in manual mode
        
    setTimeout(() => this.simulateAIActivity(), delay);
}

// Update the AI Activity Monitor panel
updateAIActivityMonitor() {
    const container = document.querySelector('.ai-monitor-container');
    if (!container) return;

    // Update performance metrics
    const accuracyEl = container.querySelector('[data-metric="accuracy"] .gauge-fill');
    const efficiencyEl = container.querySelector('[data-metric="efficiency"] .gauge-fill');
    const tasksEl = container.querySelector('[data-metric="tasks"] .counter-value');
    const decisionsEl = container.querySelector('[data-metric="decisions"] .counter-value');
    
    if (accuracyEl) accuracyEl.style.height = `${this.aiMetrics.accuracy}%`;
    if (efficiencyEl) efficiencyEl.style.height = `${this.aiMetrics.efficiency}%`;
    if (tasksEl) tasksEl.textContent = this.aiMetrics.tasksCompleted.toLocaleString();
    if (decisionsEl) decisionsEl.textContent = this.aiMetrics.decisionsCount.toLocaleString();

    // Update activity stats
    const cpuUsageEl = container.querySelector('[data-stat="cpu-usage"] .stat-value');
    const memoryUsageEl = container.querySelector('[data-stat="memory-usage"] .stat-value');
    const responseTimeEl = container.querySelector('[data-stat="response-time"] .stat-value');
    const uptimeEl = container.querySelector('[data-stat="uptime"] .stat-value');

    if (cpuUsageEl) cpuUsageEl.textContent = `${this.aiMetrics.cpuUsage}%`;
    if (memoryUsageEl) memoryUsageEl.textContent = `${this.aiMetrics.memoryUsage}%`;
    if (responseTimeEl) responseTimeEl.textContent = `${this.aiMetrics.avgResponseTime}ms`;
    if (uptimeEl) uptimeEl.textContent = this.formatUptime(this.aiMetrics.uptime);

    // Update task distribution
    const distributionBars = container.querySelectorAll('.chart-bar');
    distributionBars.forEach(bar => {
        const taskType = bar.getAttribute('data-task');
        const height = this.aiMetrics.taskDistribution[taskType] || 0;
        bar.style.height = `${height}%`;
    });
}

// Format uptime into readable string
formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
}

// Initialize AI metrics object
initializeAIMetrics() {
    this.aiMetrics = {
        accuracy: 85,
        efficiency: 92,
        tasksCompleted: 1248,
        decisionsCount: 87,
        cpuUsage: 45,
        memoryUsage: 62,
        avgResponseTime: 124,
        uptime: 345600, // 4 days in seconds
        taskDistribution: {
            analysis: 65,
            processing: 45,
            monitoring: 80,
            optimization: 55,
            reporting: 35
        }
    };
}

// Add this to your constructor
constructor() {
    // ... existing code ...
    this.initializeAIMetrics();
    
    // Update metrics every 5 seconds
    setInterval(() => {
        this.updateAIActivityMonitor();
    }, 5000);
}