import React, { useEffect, useState } from 'react';

export const Bootup = ({ onNavigate }) => {
  const [progress, setProgress] = useState(0);
  const [bootText, setBootText] = useState('Initializing...');

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1000; // 1 second

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      // Update boot text based on progress
      if (newProgress < 0.3) {
        setBootText('Initializing system...');
      } else if (newProgress < 0.6) {
        setBootText('Loading modules...');
      } else if (newProgress < 0.9) {
        setBootText('Starting services...');
      } else {
        setBootText('Ready');
      }

      if (newProgress >= 1) {
        clearInterval(interval);
        // Navigate to home screen after 1 second
        setTimeout(() => {
          onNavigate('homeScreen');
        }, 100);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onNavigate]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#000',
      color: '#00ff00',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
       borderRadius: '8px'    }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
          SYSTEM BOOT
        </h1>
        <div style={{ fontSize: '16px', marginBottom: '10px' }}>
          {bootText}
        </div>
      </div>
      
      <div style={{
        width: '80%',
        height: '20px',
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #00ff00'
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: '#00ff00',
          transition: 'width 0.1s ease-out'
        }} />
      </div>
      
      <div style={{
        marginTop: '20px',
        fontSize: '14px',
        opacity: 0.8
      }}>
        {Math.round(progress * 100)}%
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '12px',
        opacity: 0.6
      }}>
        Press any key to continue...
      </div>
    </div>
  );
};
