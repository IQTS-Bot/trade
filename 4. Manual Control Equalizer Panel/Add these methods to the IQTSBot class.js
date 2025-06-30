applyManualSettings(aggressiveness, frequency, diversification) {
    // Calculate impact score (1-100)
    const impactScore = Math.round(
        (parseInt(aggressiveness) * 0.5 + 
         parseInt(frequency) * 0.3 + 
         parseInt(diversification) * 0.2) * 10
    );
    
    // Determine impact level
    let impactLevel, impactColor;
    if (impactScore > 80) {
        impactLevel = "High Impact";
        impactColor = "var(--positive)";
    } else if (impactScore > 50) {
        impactLevel = "Moderate Impact";
        impactColor = "var(--warning)";
    } else {
        impactLevel = "Low Impact";
        impactColor = "var(--text-secondary)";
    }
    
    // Show feedback
    const feedback = document.getElementById('manualSettingsFeedback');
    feedback.style.display = 'block';
    feedback.style.border = `1px solid ${impactColor}`;
    feedback.style.color = impactColor;
    feedback.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Settings Applied:</span>
            <span>Impact Score: ${impactScore}/100</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Aggressiveness: ${aggressiveness}/10</span>
            <span>${impactLevel}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>Frequency: ${frequency}/10</span>
            <span>Diversification: ${diversification}/10</span>
        </div>
    `;
    
    this.addActivity(`Manual settings applied: Aggressiveness=${aggressiveness}, Frequency=${frequency}, Diversification=${diversification}`, 'system');
    this.addAIActivity(`Strategy adjusted based on manual settings (Score: ${impactScore}/100)`);
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 5000);
}

// Update setAIMode to show/hide manual controls
setAIMode(mode) {
    this.aiMode = mode;
    this.addActivity(`AI mode changed to ${mode === 'auto' ? 'Full Automatic' : 'Manual Control'}`, 'system');
    
    const statusElement = document.getElementById('aiStatus');
    const manualPanel = document.getElementById('manualControlPanel');
    
    if (statusElement) {
        const dot = statusElement.querySelector('.status-dot');
        const text = statusElement.querySelector('span');
        
        if (mode === 'auto') {
            dot.style.background = 'var(--positive)';
            text.textContent = 'Full Automatic';
            this.addAIActivity('Switched to full automatic mode - AI has full control');
            if (manualPanel) manualPanel.style.display = 'none';
        } else {
            dot.style.background = 'var(--warning)';
            text.textContent = 'Manual Control';
            this.addAIActivity('Switched to manual control mode - human supervision required');
            if (manualPanel) manualPanel.style.display = 'block';
        }
    }
}