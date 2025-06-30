// Add portfolio display section to the control panel
const portfolioSection = document.createElement('div');
portfolioSection.className = 'telegram-panel';
portfolioSection.innerHTML = `
    <div class="telegram-status" style="cursor: pointer;" onclick="togglePanel('portfolioPanel')">
        <i class="fas fa-wallet"></i>
        <span>Portfolio Summary</span>
        <i class="fas fa-chevron-down" id="portfolioPanelIcon" style="margin-left: auto; transition: transform 0.3s;"></i>
    </div>
    <div id="portfolioPanel" class="panel-content">
        <div id="portfolioSummary" style="padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Cash:</span>
                <span id="portfolioCash">Loading...</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Equity:</span>
                <span id="portfolioEquity">Loading...</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Buying Power:</span>
                <span id="portfolioBuyingPower">Loading...</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Portfolio Value:</span>
                <span id="portfolioValue">Loading...</span>
            </div>
        </div>
        <button id="refreshPortfolio" class="btn" style="width: 100%; margin-top: 10px; background: rgba(0,255,170,0.2); color: var(--accent);">
            <i class="fas fa-sync-alt"></i> Refresh Portfolio
        </button>
    </div>
`;

// Insert after the Telegram panel in the control panel
const controlPanel = document.querySelector('.control-panel');
const telegramPanel = document.querySelector('.telegram-panel');
controlPanel.insertBefore(portfolioSection, telegramPanel.nextSibling);

// Add event listener for refresh button
document.getElementById('refreshPortfolio').addEventListener('click', () => this.updatePortfolio());