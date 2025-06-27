# Check logs
docker-compose logs -f trading-bot

# Performance metrics
curl -X GET "http://localhost:3000/api/performance" \
  -H "X-Signature: your-signed-key"

# Manual control
curl -X POST "http://localhost:3000/api/control" \
  -d '{"action":"stop"}' \
  -H "Content-Type: application/json"