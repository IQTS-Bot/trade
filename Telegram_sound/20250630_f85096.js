// Trading Audio Manager Class (updated with all sounds)
class TradingAudio {
  constructor() {
    this.audioElements = {
      // Strategy entries
      scalpEntry: document.getElementById('scalpEntrySound'),
      swingEntry: document.getElementById('swingEntrySound'),
      
      // Requested sounds
      cashRegister: document.getElementById('cashRegisterSound'),
      coin: document.getElementById('coinSound'),
      warning: document.getElementById('warningSound'),
      
      // Strategic sounds
      bigLoss: document.getElementById('bigLossSound'),
      tacticChange: document.getElementById('tacticChangeSound'),
      betterDeal: document.getElementById('betterDealSound'),
      liquidityAlert: document.getElementById('liquidityAlertSound')
    };

    this.volumes = {
      scalp: 0.6,
      swing: 0.7,
      success: 0.8,
      profit: 0.7,
      error: 0.5,
      alert: 0.6
    };

    this.thresholds = {
      smallProfit: 50,
      bigProfit: 200,
      loss: -30,
      bigLoss: -100
    };
  }

  playSound(type) {
    if (!this.audioElements[type]) return;
    
    try {
      const audio = this.audioElements[type];
      audio.volume = this.volumes[type.replace('Sound','')] || 0.7;
      audio.currentTime = 0;
      audio.play().catch(e => console.warn(`Audio ${type} blocked:`, e));
    } catch (e) {
      console.error(`Audio error (${type}):`, e);
    }
  }

  // STRATEGY ENTRY POINTS
  playScalpEntry() {
    this.playSound('scalpEntry');
  }

  playSwingEntry() {
    this.playSound('swingEntry');
  }

  // TRADE OUTCOMES (with requested sounds)
  playTradeSuccess(profit) {
    if (profit >= this.thresholds.bigProfit) {
      this.playSound('cashRegister'); // Big win = cash register
    } else if (profit > 0) {
      this.playSound('coin'); // Small win = coins
    }
  }

  playTradeError() {
    this.playSound('warning'); // Warning alarm for errors
  }

  playTradeLoss(amount) {
    if (amount <= this.thresholds.bigLoss) {
      this.playSound('bigLoss'); // Sad trombone for big losses
    } else {
      this.playSound('warning'); // Warning for small losses
    }
  }

  // STRATEGIC AUDIO
  playTacticChange() {
    this.playSound('tacticChange');
  }

  playBetterDeal() {
    this.playSound('betterDeal');
  }

  playLiquidityAlert() {
    this.playSound('liquidityAlert');
  }
}

// Enhanced Trading Bot Integration
class IQTSBot {
  constructor() {
    this.audio = new TradingAudio();
    this.strategyState = {
      currentMode: 'scalp',
      lastProfit: 0
    };
  }

  // EXECUTE TRADE WITH FULL AUDIO FEEDBACK
  async executeTrade(symbol, quantity, strategy) {
    try {
      // Play entry sound based on strategy
      strategy === 'scalp' 
        ? this.audio.playScalpEntry() 
        : this.audio.playSwingEntry();

      const result = await this.simulateTradeExecution(symbol, quantity);
      
      if (result.success) {
        // SUCCESS FEEDBACK
        this.audio.playTradeSuccess(result.profit);
        
        // Check for better deals
        if (this.isBetterDeal(result.profit)) {
          this.audio.playBetterDeal();
        }
        
        return result;
      } else {
        // ERROR FEEDBACK
        this.audio.playTradeError();
        throw new Error(result.error);
      }
    } catch (error) {
      // LOSS FEEDBACK
      this.audio.playTradeLoss(error.amount || this.thresholds.bigLoss);
      throw error;
    }
  }

  // TACTICAL METHODS
  adjustTactic(newTactic) {
    this.strategyState.currentMode = newTactic;
    this.audio.playTacticChange();
    this.addActivity(`Tactic changed to ${newTactic.toUpperCase()}`, 'system');
  }

  isBetterDeal(currentProfit) {
    const isBetter = currentProfit > this.strategyState.lastProfit * 1.3;
    this.strategyState.lastProfit = currentProfit;
    return isBetter;
  }

  // LIQUIDITY MONITORING
  checkLiquidity() {
    if (this.detectLiquidityCrunch()) {
      this.audio.playLiquidityAlert();
      this.addActivity("LIQUIDITY WARNING: Reducing position sizes", 'system');
    }
  }

  // TEST METHODS (for UI buttons)
  testSuccessSounds() {
    this.audio.playTradeSuccess(this.thresholds.smallProfit + 10); // Coin sound
    setTimeout(() => {
      this.audio.playTradeSuccess(this.thresholds.bigProfit + 50); // Cash register
    }, 1000);
  }

  testErrorSounds() {
    this.audio.playTradeError();
    setTimeout(() => {
      this.audio.playTradeLoss(this.thresholds.bigLoss - 20); // Sad trombone
    }, 1000);
  }
}