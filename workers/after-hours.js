class AnalysisWorker {
    constructor({ alpaca, telegram }) {
        this.alpaca = alpaca;
        this.telegram = telegram;
        this.isRunning = false;
        this.interval = null;
    }

    start() {
        if (this.isRunning) return;
        
        console.log('Starting after-hours analysis worker...');
        this.isRunning = true;
        
        // Run analysis every 30 minutes during after-hours
        this.interval = setInterval(() => {
            this.performAnalysis();
        }, 30 * 60 * 1000);
        
        // Initial analysis
        this.performAnalysis();
    }

    stop() {
        if (!this.isRunning) return;
        
        console.log('Stopping after-hours analysis worker...');
        this.isRunning = false;
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async performAnalysis() {
        try {
            console.log('Performing after-hours analysis...');
            
            // Check if it's actually after hours
            const now = new Date();
            const hours = now.getHours();
            const isAfterHours = hours < 9 || hours >= 16;
            
            if (!isAfterHours) {
                console.log('Market is open, skipping after-hours analysis');
                return;
            }

            // Simulate analysis
            const analysis = {
                timestamp: now.toISOString(),
                marketSentiment: this.calculateMarketSentiment(),
                newsImpact: this.analyzeNews(),
                technicalSignals: this.getTechnicalSignals()
            };

            console.log('After-hours analysis complete:', analysis);
            
            // Send analysis to Telegram if significant
            if (analysis.marketSentiment.strength > 0.7) {
                await this.telegram.sendMessage(`📈 After-Hours Analysis Alert:\nSentiment: ${analysis.marketSentiment.direction}\nStrength: ${analysis.marketSentiment.strength}`);
            }

        } catch (error) {
            console.error('Error in after-hours analysis:', error);
        }
    }

    calculateMarketSentiment() {
        // Simulate market sentiment calculation
        const directions = ['bullish', 'bearish', 'neutral'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const strength = Math.random();
        
        return { direction, strength };
    }

    analyzeNews() {
        // Simulate news analysis
        return {
            positiveCount: Math.floor(Math.random() * 10),
            negativeCount: Math.floor(Math.random() * 5),
            neutralCount: Math.floor(Math.random() * 15)
        };
    }

    getTechnicalSignals() {
        // Simulate technical analysis
        return {
            rsi: Math.random() * 100,
            macd: (Math.random() - 0.5) * 2,
            volume: Math.random() * 1000000
        };
    }
}

module.exports = { AnalysisWorker }; 