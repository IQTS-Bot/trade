// Add trade receipts section to the main grid
const receiptsContainer = document.createElement('div');
receiptsContainer.className = 'glassmorphism-card';
receiptsContainer.style.gridColumn = 'span 1';
receiptsContainer.style.height = '400px';
receiptsContainer.style.minHeight = '300px';
receiptsContainer.innerHTML = `
    <div class="card-header">
        <h2 class="card-title">
            <i class="fas fa-receipt"></i>
            Trade Receipts
        </h2>
        <button id="saveAllReceipts" class="btn" style="background: rgba(0,255,170,0.2); color: var(--accent); padding: 8px 16px;">
            <i class="fas fa-download"></i>
            Save All
        </button>
    </div>
    <div class="positions-grid" id="tradeReceiptsGrid" style="height: calc(100% - 60px);">
        <div style="text-align: center; color: var(--text-secondary); padding: 20px;">
            No trade receipts yet
        </div>
    </div>
`;

// Insert after the positions container in the main grid
const mainGrid = document.querySelector('.main-grid');
const positionsContainer = document.querySelector('.positions-container');
mainGrid.insertBefore(receiptsContainer, positionsContainer.nextSibling);

// Add event listener for save all button
document.getElementById('saveAllReceipts').addEventListener('click', () => this.saveAllReceipts());