const os = require('os');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

// Real system monitoring server
class SystemMonitor {
    constructor() {
        this.clients = new Set();
        this.startTime = Date.now();
        this.setupWebSocketServer();
        this.startMonitoring();
    }

    setupWebSocketServer() {
        // Create WebSocket server on different port to avoid conflict with PowerShell metrics
        this.wss = new WebSocket.Server({ port: 8081 });
        
        this.wss.on('connection', (ws) => {
            console.log('Client connected to system monitor');
            this.clients.add(ws);
            
            // Send initial data
            this.sendSystemData(ws);
            
            ws.on('close', () => {
                this.clients.delete(ws);
                console.log('Client disconnected');
            });
        });
        
        console.log('System Monitor WebSocket server running on ws://localhost:8081');
    }

    async getRealSystemMetrics() {
        const metrics = {
            timestamp: Date.now(),
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            
            // Real CPU usage
            cpu: {
                usage: await this.getCPUUsage(),
                cores: os.cpus().length,
                model: os.cpus()[0].model,
                speed: os.cpus()[0].speed
            },
            
            // Real memory usage
            memory: {
                total: Math.round(os.totalmem() / 1024 / 1024), // MB
                free: Math.round(os.freemem() / 1024 / 1024), // MB
                used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024), // MB
                usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
            },
            
            // System info
            system: {
                platform: os.platform(),
                arch: os.arch(),
                hostname: os.hostname(),
                loadAverage: os.loadavg()
            },
            
            // Network interfaces
            network: this.getNetworkInfo()
        };

        return metrics;
    }

    async getCPUUsage() {
        return new Promise((resolve) => {
            const startMeasure = this.cpuAverage();
            
            setTimeout(() => {
                const endMeasure = this.cpuAverage();
                const idleDifference = endMeasure.idle - startMeasure.idle;
                const totalDifference = endMeasure.total - startMeasure.total;
                const usage = 100 - ~~(100 * idleDifference / totalDifference);
                resolve(usage);
            }, 1000);
        });
    }

    cpuAverage() {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;

        cpus.forEach((cpu) => {
            for (type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });

        return {
            idle: totalIdle / cpus.length,
            total: totalTick / cpus.length
        };
    }

    getNetworkInfo() {
        const interfaces = os.networkInterfaces();
        const networkData = {};
        
        for (const [name, addresses] of Object.entries(interfaces)) {
            networkData[name] = addresses.filter(addr => !addr.internal);
        }
        
        return networkData;
    }

    async testNetworkLatency() {
        const start = Date.now();
        
        return new Promise((resolve) => {
            const req = http.get('http://google.com', (res) => {
                const latency = Date.now() - start;
                resolve(latency);
            });
            
            req.on('error', () => {
                resolve(999); // Error indicator
            });
            
            req.setTimeout(5000, () => {
                req.abort();
                resolve(999);
            });
        });
    }

    async sendSystemData(ws = null) {
        try {
            const metrics = await this.getRealSystemMetrics();
            const latency = await this.testNetworkLatency();
            
            const data = {
                ...metrics,
                network: {
                    ...metrics.network,
                    latency: latency
                }
            };

            const message = JSON.stringify(data);
            
            if (ws) {
                ws.send(message);
            } else {
                this.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            }
        } catch (error) {
            console.error('Error getting system metrics:', error);
        }
    }

    startMonitoring() {
        // Send real system data every 3 seconds
        setInterval(() => {
            this.sendSystemData();
        }, 3000);
        
        console.log('Real system monitoring started...');
    }
}

// Start the system monitor
new SystemMonitor(); 