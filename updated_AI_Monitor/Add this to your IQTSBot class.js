// Strategy-Specific Updates
updateStrategyMetrics() {
    // Toggle between scalp/swing modes
    document.querySelectorAll('.ai-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            document.querySelectorAll('.ai-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update UI based on mode
            if (mode === 'scalp') {
                document.querySelector('[data-metric="scalp-speed"]').style.display = 'block';
                document.querySelector('[data-metric="hold-time"]').style.display = 'none';
            } else {
                document.querySelector('[data-metric="scalp-speed"]').style.display = 'none';
                document.querySelector('[data-metric="hold-time"]').style.display = 'block';
            }
        });
    });

    // Simulate live trading activity
    setInterval(() => {
        // Update scalp execution speed (28ms ± 5ms)
        const speed = 28 + (Math.sin(Date.now() / 3000) * 5;
        document.querySelector('[data-metric="scalp-speed"] .counter-value').textContent = 
            `${Math.abs(speed.toFixed(0))}ms`;

        // Update swing hold time (4.2h ± 1.2h)
        const holdTime = 4.2 + (Math.sin(Date.now() / 5000) * 1.2;
        document.querySelector('[data-metric="hold-time"] .counter-value').textContent = 
            `${holdTime.toFixed(1)}h`;
    }, 2000);
}

// Initialize in your constructor
constructor() {
    // ... existing code ...
    this.updateStrategyMetrics();
}