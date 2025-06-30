// Create AI Activity Monitor panel
const aiMonitorPanel = document.createElement('div');
aiMonitorPanel.className = 'ai-monitor-container glassmorphism-card';
aiMonitorPanel.innerHTML = `
    <div class="ai-monitor-header">
        <h3>
            <i class="fas fa-brain"></i>
            AI Activity Monitor - 24/7
        </h3>
        <div class="ai-mode-toggles">
            <button class="ai-mode-btn active" data-mode="realtime">Realtime</button>
            <button class="ai-mode-btn" data-mode="hourly">Hourly</button>
            <button class="ai-mode-btn" data-mode="daily">Daily</button>
        </div>
    </div>
    
    <div class="ai-performance-dashboard">
        <div class="performance-metric" data-metric="accuracy">
            <div class="metric-gauge">
                <div class="gauge-fill" style="height: 85%;"></div>
            </div>
            <span class="metric-label">Accuracy</span>
            <span class="metric-value">85.2%</span>
        </div>
        
        <div class="performance-metric" data-metric="efficiency">
            <div class="metric-gauge">
                <div class="gauge-fill" style="height: 92%;"></div>
            </div>
            <span class="metric-label">Efficiency</span>
            <span class="metric-value">92.7%</span>
        </div>
        
        <div class="performance-metric" data-metric="tasks">
            <div class="metric-counter">
                <span class="counter-value">1,248</span>
            </div>
            <span class="metric-label">Tasks Today</span>
        </div>
        
        <div class="performance-metric" data-metric="decisions">
            <div class="metric-counter">
                <span class="counter-value">87</span>
            </div>
            <span class="metric-label">Decisions</span>
        </div>
    </div>
    
    <div class="ai-activity-stats">
        <div class="stat-card" data-stat="cpu-usage">
            <div class="stat-header">
                <span>CPU Usage</span>
                <i class="fas fa-microchip"></i>
            </div>
            <div class="stat-value">45%</div>
            <div class="stat-trend">↓ 5% from avg</div>
        </div>
        
        <div class="stat-card" data-stat="memory-usage">
            <div class="stat-header">
                <span>Memory Usage</span>
                <i class="fas fa-memory"></i>
            </div>
            <div class="stat-value">62%</div>
            <div class="stat-trend">↑ 8% from avg</div>
        </div>
        
        <div class="stat-card" data-stat="response-time">
            <div class="stat-header">
                <span>Avg Response Time</span>
                <i class="fas fa-clock"></i>
            </div>
            <div class="stat-value">124ms</div>
            <div class="stat-trend">↓ 12ms from avg</div>
        </div>
        
        <div class="stat-card" data-stat="uptime">
            <div class="stat-header">
                <span>System Uptime</span>
                <i class="fas fa-server"></i>
            </div>
            <div class="stat-value">4d 0h 0m</div>
            <div class="stat-trend">100% availability</div>
        </div>
    </div>
    
    <div class="ai-task-timeline">
        <div class="timeline-header">
            <span>Task</span>
            <span>Status</span>
            <span>Duration</span>
            <span>Impact</span>
        </div>
        
        <div class="timeline-item completed">
            <div class="task-info">
                <div class="task-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <span class="task-name">Market Analysis</span>
            </div>
            <div class="task-status">
                <span class="status-badge completed">Completed</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 100%;"></div>
                </div>
            </div>
            <div class="task-duration">
                2.4s
            </div>
            <div class="task-impact">
                <div class="impact-meter high"></div>
            </div>
        </div>
    </div>
    
    <div class="task-distribution">
        <h4>Task Distribution Last 24 Hours</h4>
        <div class="distribution-chart">
            <div class="chart-bar" data-task="analysis" style="height: 65%;">
                <span class="bar-label">Analysis</span>
            </div>
            <div class="chart-bar" data-task="processing" style="height: 45%;">
                <span class="bar-label">Processing</span>
            </div>
            <div class="chart-bar" data-task="monitoring" style="height: 80%;">
                <span class="bar-label">Monitoring</span>
            </div>
            <div class="chart-bar" data-task="optimization" style="height: 55%;">
                <span class="bar-label">Optimization</span>
            </div>
            <div class="chart-bar" data-task="reporting" style="height: 35%;">
                <span class="bar-label">Reporting</span>
            </div>
        </div>
    </div>
`;

// Add to the main grid
mainGrid.appendChild(aiMonitorPanel);

// Add event listener for mode change
document.getElementById('aiMode').addEventListener('change', (e) => {
    this.setAIMode(e.target.value);
});