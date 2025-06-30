class SecurityMiddleware {
    static harden() {
        return (req, res, next) => {
            // Basic security headers
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            
            next();
        };
    }

    static validateMessage(message) {
        try {
            // Basic message validation
            if (typeof message !== 'string') {
                throw new Error('Invalid message format');
            }
            
            if (message.length > 10000) {
                throw new Error('Message too long');
            }
            
            // Check for potential malicious content
            const dangerousPatterns = [
                /<script/i,
                /javascript:/i,
                /on\w+\s*=/i,
                /eval\s*\(/i
            ];
            
            for (const pattern of dangerousPatterns) {
                if (pattern.test(message)) {
                    throw new Error('Potentially malicious content detected');
                }
            }
            
            return true;
        } catch (error) {
            console.error('Message validation failed:', error.message);
            return false;
        }
    }

    static rateLimit() {
        const requests = new Map();
        
        return (req, res, next) => {
            const clientIp = req.ip || req.connection.remoteAddress;
            const now = Date.now();
            const windowMs = 60 * 1000; // 1 minute
            const maxRequests = 100;
            
            if (!requests.has(clientIp)) {
                requests.set(clientIp, []);
            }
            
            const clientRequests = requests.get(clientIp);
            
            // Remove old requests outside the window
            const validRequests = clientRequests.filter(timestamp => now - timestamp < windowMs);
            
            if (validRequests.length >= maxRequests) {
                return res.status(429).json({ error: 'Too many requests' });
            }
            
            validRequests.push(now);
            requests.set(clientIp, validRequests);
            
            next();
        };
    }
}

module.exports = { SecurityMiddleware }; 