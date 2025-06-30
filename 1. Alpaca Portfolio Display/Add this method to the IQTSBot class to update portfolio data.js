async updatePortfolio() {
    if (!this.alpacaAPI) {
        document.getElementById('portfolioCash').textContent = 'Not connected';
        document.getElementById('portfolioEquity').textContent = 'Not connected';
        document.getElementById('portfolioBuyingPower').textContent = 'Not connected';
        document.getElementById('portfolioValue').textContent = 'Not connected';
        return;
    }

    try {
        const account = await this.alpacaAPI.getAccount();
        
        // Format currency values
        const formatCurrency = (value) => {
            return parseFloat(value).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        document.getElementById('portfolioCash').textContent = formatCurrency(account.cash);
        document.getElementById('portfolioEquity').textContent = formatCurrency(account.equity);
        document.getElementById('portfolioBuyingPower').textContent = formatCurrency(account.buying_power);
        document.getElementById('portfolioValue').textContent = formatCurrency(account.portfolio_value);
        
        this.addActivity('Portfolio data refreshed', 'system');
    } catch (error) {
        console.error('Failed to update portfolio:', error);
        this.addActivity('Failed to update portfolio data', 'system');
    }
}