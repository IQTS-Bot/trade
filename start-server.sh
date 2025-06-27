#!/bin/bash
echo "Starting IQTS Bot Web Server..."
echo ""
echo "Access your IQTS Bot at:"
echo "http://localhost:8000"
echo "http://$(hostname -I | awk '{print $1}'):8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
python3 -m http.server 8000
