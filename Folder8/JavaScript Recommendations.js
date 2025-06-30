// Enhanced Equalizer Functionality
class TradingEqualizer {
    constructor() {
        this.sliders = document.querySelectorAll('.eq-slider');
        this.presetButtons = document.querySelectorAll('.eq-preset-btn');
        this.init();
    }
    
    init() {
        // Initialize sliders
        this.sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateSliderVisuals(e.target);
                this.updateStrategySummary();
            });
            
            // Set initial values
            this.updateSliderVisuals(slider);
        });
        
        // Preset buttons
        this.presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.applyPreset(e.target.dataset.preset);
            });
        });
        
        // Initial summary update
        this.updateStrategySummary();
    }
    
    updateSliderVisuals(slider) {
        const container = slider.closest('.eq-slider-container');
        const valueElement = container.querySelector('.slider-value');
        const visualIndicator = container.querySelector('.indicator-bar');
        
        const value = slider.value;
        const max = slider.max;
        const percentage = (value / max) * 100;
        
        valueElement.textContent = value;
        visualIndicator.style.width = `${percentage}%`;
        
        // Update impact color based on value
        if (value > max * 0.7) {
            visualIndicator.style.background = 'var(--negative)';
        } else if (value > max * 0.4) {
            visualIndicator.style.background = 'var(--warning)';
        } else {
            visualIndicator.style.background = 'var(--positive)';
        }
    }
    
    applyPreset(preset) {
        const presetValues = {
            conservative: { risk: 3, size: 15, stop: 2, profit: 4 },
            balanced: { risk: 5, size: 25, stop: 3, profit: 6 },
            aggressive: { risk: 8, size: 40, stop: 5, profit: 10 }
        };
        
        const values = presetValues[preset];
        
        this.sliders.forEach(slider => {
            const param = slider.dataset.param;
            if (values[param]) {
                slider.value = values[param];
                this.updateSliderVisuals(slider);
            }
        });
        
        this.updateStrategySummary();
    }
    
    updateStrategySummary() {
        // Calculate strategy metrics based on slider values
        const risk = parseInt(document.querySelector('[data-param="risk"]').value);
        const size = parseInt(document.querySelector('[data-param="size"]').value);
        const stop = parseInt(document.querySelector('[data-param="stop"]').value);
        const profit = parseInt(document.querySelector('[data-param="profit"]').value);
        
        // Update risk meter
        const riskMeter = document.querySelector('.risk-level');
        riskMeter.style.width = `${risk * 10}%`;
        
        const riskLabel = document.querySelector('.risk-label');
        if (risk > 7) riskLabel.textContent = "High Risk";
        else if (risk > 4) riskLabel.textContent = "Medium Risk";
        else riskLabel.textContent = "Low Risk";
        
        // Update stats (simplified calculations)
        document.querySelector('.stat-value:nth-child(1)').textContent = `${size}%`;
        document.querySelector('.stat-value:nth-child(2)').textContent = `-${stop}%`;
        document.querySelector('.stat-value:nth-child(3)').textContent = `${Math.min(95, 50 + (profit * 3) - (stop * 2))}%`;
    }
}

// Enhanced AI Monitor
class AIMonitor {
    constructor() {
        this.tasks = [
            { name: "Market Analysis", icon: "fa-chart-line", frequency: 5000 },
            { name: "Data Processing", icon: "fa-database", frequency: 4000 },
            { name: "Risk Assessment", icon: "fa-shield-alt", frequency: 6000 },
            { name: "Signal Generation", icon: "fa-bolt", frequency: 3000 }
        ];
        
        this.modeButtons = document.querySelectorAll('.ai-mode-btn');
        this.init();
    }
    
    init() {
        // Initialize mode buttons
        this.modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.setMode(e.target.dataset.mode);
            });
        });
        
        // Start task simulation
        this.simulateTasks();
        
        // Initialize timeline
        this.updateTimeline();
    }
    
    setMode(mode) {
        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Adjust simulation based on mode
        this.currentMode = mode;
    }
    
    simulateTasks() {
        this.tasks.forEach(task => {
            setInterval(() => {
                this.runTask(task);
            }, task.frequency);
        });
    }
    
    runTask(task) {
        // Update task status to processing
        this.updateTaskStatus(task.name, 'processing', 0);
        
        // Simulate processing
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                this.completeTask(task);
            }
            this.updateTaskStatus(task.name, 'processing', progress);
        }, 100);
    }
    
    completeTask(task) {
        // Update task status to completed
        this.updateTaskStatus(task.name, 'completed', 100);
        
        // Add to timeline
        this.addTimelineEvent(task, 'completed');
        
        // After 1 second, reset to idle
        setTimeout(() => {
            this.updateTaskStatus(task.name, 'idle', 0);
        }, 1000);
    }
    
    updateTaskStatus(taskName, status, progress) {
        // Find all elements related to this task
        const taskElements = document.querySelectorAll(`[data-task="${taskName.toLowerCase().replace(' ', '-')}"]`);
        
        taskElements.forEach(element => {
            // Update status class
            element.classList.remove('idle', 'processing', 'completed');
            element.classList.add(status);
            
            // Update progress if element has progress bar
            const progressBar = element.querySelector('.progress-fill');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        });
    }
    
    addTimelineEvent(task, status) {
        const timeline = document.querySelector('.ai-task-timeline');
        const eventElement = document.createElement('div');
        
        eventElement.className = `timeline-item ${status}`;
        eventElement.innerHTML = `
            <div class="task-info">
                <div class="task-icon">
                    <i class="fas ${task.icon}"></i>
                </div>
                <span class="task-name">${task.name}</span>
            </div>
            <div class="task-status">
                <span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${status === 'completed' ? 100 : 0}%;"></div>
                </div>
            </div>
            <div class="task-duration">
                ${(task.frequency / 1000).toFixed(1)}s
            </div>
            <div class="task-impact">
                <div class="impact-meter ${Math.random() > 0.7 ? 'high' : 'medium'}"></div>
            </div>
        `;
        
        timeline.insertBefore(eventElement, timeline.children[1]);
        
        // Limit timeline items
        while (timeline.children.length > 10) {
            timeline.removeChild(timeline.lastChild);
        }
    }
    
    updateTimeline() {
        // Simulate initial timeline events
        this.tasks.forEach(task => {
            this.addTimelineEvent(task, Math.random() > 0.5 ? 'completed' : 'processing');
        });
    }
}