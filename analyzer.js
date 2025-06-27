const tf = require('@tensorflow/tfjs-node');
const { TechnicalAnalyzer } = require('./technical');
const { SentimentAnalyzer } = require('./sentiment');

class LearningEngine {
  constructor() {
    this.model = this.buildModel();
    this.parameterSpace = {
      rsiPeriod: { min: 5, max: 25, current: 14 },
      macdFast: { min: 8, max: 16, current: 12 }
    };
  }

  buildModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });
    return model;
  }

  async dailyOptimization(tradeHistory) {
    const { features, labels } = this.preprocessData(tradeHistory);
    await this.model.fit(features, labels, { epochs: 20 });
    
    const bestParams = this.geneticAlgorithm();
    this.parameterSpace = bestParams;
  }

  async generateSignals(marketData) {
    const predictions = await this.model.predict(
      this.prepareInput(marketData)
    );
    
    return this.interpretPredictions(predictions);
  }
}