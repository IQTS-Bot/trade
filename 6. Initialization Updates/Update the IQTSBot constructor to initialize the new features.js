constructor() {
    // Existing code...
    
    // Add these lines at the end of the constructor
    this.aiMode = 'auto'; // Default to automatic mode
    this.initializeAIMonitor();
    this.updatePortfolio(); // Load initial portfolio data if connected
    
    // Add these to the existing activity log entries
    this.addActivity('Portfolio monitoring initialized', 'system');
    this.addActivity('Trade receipt system ready', 'system');
    this.addActivity('AI activity monitor started', 'system');
}

initializeAIMonitor() {
    // Start simulating AI activity
    setTimeout(() => this.simulateAIActivity(), 2000);
    
    // Add initial AI activity messages
    this.addAIActivity('AI system booting up...');
    this.addAIActivity('Loading neural networks...');
    this.addAIActivity('Connecting to market data feeds...');
    this.addAIActivity('Initializing trading algorithms...');
    this.addAIActivity('System ready for trading operations');
    
    // Set initial mode
    this.setAIMode('auto');
}