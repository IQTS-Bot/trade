// Add manual control panel (hidden by default)
const manualControlPanel = document.createElement('div');
manualControlPanel.id = 'manualControlPanel';
manualControlPanel.className = 'glassmorphism-card';
manualControlPanel.style.gridColumn = 'span 2';
manualControlPanel.style.display = 'none';
manualControlPanel.innerHTML = `
    <div class="card-header">
        <h2 class="card-title">
            <i class="fas fa-sliders-h"></i>
            Manual Strategy Adjustments
        </h2>
    </div>
    <div style="padding: 15px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div class="input-group">
                <label for="aggressiveness">Aggressiveness</label>
                <input type="range" min="1" max="10" value="5" class="slider" id="aggressiveness">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary);">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                </div>
            </div>
            <div class="input-group">
                <label for="frequency">Trade Frequency</label>
                <input type="range" min="1" max="10" value="5" class="slider" id="frequency">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary);">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>
            <div class="input-group">
                <label for="diversification">Diversification</label>
                <input type="range" min="1" max="10" value="5" class="slider" id="diversification">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary);">
                    <span>Focused</span>
                    <span>Diverse</span>
                </div>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button id="applyManualSettings" class="btn" style="flex: 1; background: var(--accent); color: #000;">
                <i class="fas fa-check"></i> Apply Settings
            </button>
            <button id="resetManualSettings" class="btn" style="flex: 1; background: rgba(255,85,85,0.2); color: var(--negative);">
                <i class="fas fa-undo"></i> Reset to Default
            </button>
        </div>
        <div id="manualSettingsFeedback" style="margin-top: 15px; padding: 10px; border-radius: 8px; display: none;"></div>
    </div>
`;

// Insert after the AI Monitor panel
const aiMonitor = document.querySelector('.glassmorphism-card:nth-last-child(2)');
mainGrid.insertBefore(manualControlPanel, aiMonitor.nextSibling);

// Add event listeners for manual controls
document.getElementById('applyManualSettings').addEventListener('click', () => {
    const aggressiveness = document.getElementById('aggressiveness').value;
    const frequency = document.getElementById('frequency').value;
    const diversification = document.getElementById('diversification').value;
    
    this.applyManualSettings(aggressiveness, frequency, diversification);
});

document.getElementById('resetManualSettings').addEventListener('click', () => {
    document.getElementById('aggressiveness').value = 5;
    document.getElementById('frequency').value = 5;
    document.getElementById('diversification').value = 5;
    
    this.applyManualSettings(5, 5, 5);
});