generateTradeReceipt(trade) {
    const receiptId = `TR-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date(trade.timestamp).toLocaleString();
    const pnl = trade.pnl ? trade.pnl.toFixed(2) : '0.00';
    const pnlClass = trade.pnl >= 0 ? 'profit' : 'loss';
    const pnlSign = trade.pnl >= 0 ? '+' : '';
    
    const receiptHTML = `
        <div class="position-card receipt" data-receipt-id="${receiptId}" style="border-left: 4px solid ${pnlClass === 'profit' ? 'var(--positive)' : 'var(--negative)'};">
            <div class="position-header">
                <span class="symbol">${trade.symbol}</span>
                <span class="profit-loss ${pnlClass}">${pnlSign}$${pnl}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">
                ${timestamp} • ${receiptId}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span>${trade.quantity} shares @ $${trade.price.toFixed(2)}</span>
                <span>${trade.action}</span>
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                <button class="btn save-receipt" style="padding: 4px 8px; font-size: 0.8rem; background: rgba(0,255,170,0.2); color: var(--accent);">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="btn view-details" style="padding: 4px 8px; font-size: 0.8rem; background: rgba(0,136,204,0.2); color: #0088cc;">
                    <i class="fas fa-eye"></i> Details
                </button>
            </div>
        </div>
    `;
    
    return { id: receiptId, html: receiptHTML };
}

addTradeReceipt(trade) {
    const receiptsGrid = document.getElementById('tradeReceiptsGrid');
    const receipt = this.generateTradeReceipt(trade);
    
    // Remove "no receipts" message if it exists
    if (receiptsGrid.children.length === 1 && receiptsGrid.children[0].textContent.includes('No trade receipts')) {
        receiptsGrid.innerHTML = '';
    }
    
    // Add new receipt to the top
    receiptsGrid.insertAdjacentHTML('afterbegin', receipt.html);
    
    // Add event listeners to the new receipt buttons
    const receiptElement = document.querySelector(`[data-receipt-id="${receipt.id}"]`);
    receiptElement.querySelector('.save-receipt').addEventListener('click', () => this.saveReceipt(receipt.id, trade));
    receiptElement.querySelector('.view-details').addEventListener('click', () => this.showReceiptDetails(receipt.id, trade));
}

saveReceipt(receiptId, trade) {
    // Generate a downloadable receipt
    const receiptText = this.generateReceiptText(trade);
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `IQTS-Receipt-${receiptId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.addActivity(`Saved receipt ${receiptId}`, 'system');
}

saveAllReceipts() {
    if (this.trades.length === 0) {
        this.showNotification('No trades to save', 'warning');
        return;
    }
    
    const receiptsText = this.trades.map(trade => this.generateReceiptText(trade)).join('\n\n' + '='.repeat(50) + '\n\n');
    const blob = new Blob([receiptsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `IQTS-All-Receipts-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.addActivity('Saved all trade receipts', 'system');
}

generateReceiptText(trade) {
    return `IQTS BOT TRADE RECEIPT
=========================
Trade ID: ${trade.id || 'N/A'}
Symbol: ${trade.symbol}
Action: ${trade.action}
Quantity: ${trade.quantity}
Price: $${trade.price.toFixed(2)}
Timestamp: ${new Date(trade.timestamp).toLocaleString()}
${trade.pnl !== undefined ? `P&L: ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}` : ''}
${trade.orderId ? `Order ID: ${trade.orderId}` : ''}

Risk Level: ${this.riskLevel}
Market Conditions: ${this.getMarketStatus()}

=== END OF RECEIPT ===`;
}

showReceiptDetails(receiptId, trade) {
    // Create a modal with detailed receipt information
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.zIndex = '2000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'var(--card-bg)';
    modalContent.style.border = '1px solid var(--border)';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '20px';
    modalContent.style.maxWidth = '500px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="color: var(--accent);">Trade Receipt Details</h3>
            <button id="closeModal" style="background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Receipt ID:</span>
                <span>${receiptId}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Symbol:</span>
                <span>${trade.symbol}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Action:</span>
                <span style="color: ${trade.action === 'BUY' ? 'var(--positive)' : 'var(--negative)'};">${trade.action}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Quantity:</span>
                <span>${trade.quantity}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Price:</span>
                <span>$${trade.price.toFixed(2)}</span>
            </div>
            ${trade.pnl !== undefined ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Profit/Loss:</span>
                <span style="color: ${trade.pnl >= 0 ? 'var(--positive)' : 'var(--negative)'};">${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Timestamp:</span>
                <span>${new Date(trade.timestamp).toLocaleString()}</span>
            </div>
            ${trade.orderId ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Order ID:</span>
                <span>${trade.orderId}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Risk Level:</span>
                <span>${this.riskLevel}/10</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Market Conditions:</span>
                <span>${this.getMarketStatus()}</span>
            </div>
        </div>
        <button id="saveThisReceipt" class="btn" style="width: 100%; background: rgba(0,255,170,0.2); color: var(--accent);">
            <i class="fas fa-save"></i> Save This Receipt
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('closeModal').addEventListener('click', () => modal.remove());
    document.getElementById('saveThisReceipt').addEventListener('click', () => {
        this.saveReceipt(receiptId, trade);
        modal.remove();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}