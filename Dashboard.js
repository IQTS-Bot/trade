import React, { useEffect, useState } from 'react';
import { AudioPlayer } from '../utils/audio';
import { TelegramConnect } from '../services/telegram';

const Dashboard = () => {
  const [positions, setPositions] = useState([]);
  const [performance, setPerformance] = useState({});

  useEffect(() => {
    const ws = new WebSocket('wss://your-vps-ip:3000');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.type === 'position_update') {
        setPositions(data.positions);
      }
      if(data.type === 'audio_alert') {
        AudioPlayer.play(data.alertType);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="dashboard">
      <LiveChart positions={positions} />
      <PerformanceMetrics data={performance} />
      <TelegramConnect />
    </div>
  );
};