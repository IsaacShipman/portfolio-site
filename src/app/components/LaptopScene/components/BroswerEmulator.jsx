// BrowserEmulator.jsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

export default function BrowserEmulator({ repoUrl }) {
  const [webcontainerInstance, setWebcontainerInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef();

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize WebContainer
        const wc = await WebContainer.boot();
        setWebcontainerInstance(wc);

        // Clone the repository
        const cloneProcess = await wc.spawn('git', ['clone', repoUrl, 'project']);
        await cloneProcess.exit;
        
        // Install dependencies
        const installProcess = await wc.spawn('npm', ['install'], { cwd: '/project' });
        await installProcess.exit;

        // Start the development server
        const startProcess = await wc.spawn('npm', ['run', 'dev'], { cwd: '/project' });
        
        // Wait a moment for the server to start
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get the URL for the running application
        const url = await wc.host.port(3000);
        
        if (iframeRef.current) {
          iframeRef.current.src = url;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('WebContainer initialization failed:', err);
        setError(err.message || 'Failed to initialize WebContainer');
        setIsLoading(false);
      }
    }

    if (repoUrl) {
      init();
    }
  }, [repoUrl]);

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        color: '#d32f2f',
        fontSize: '14px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h3>Error Loading Application</h3>
          <p>{error}</p>
          <p>Please check your internet connection and try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        color: '#666',
        fontSize: '14px'
      }}>
        <div>
          <div style={{ marginBottom: '10px' }}>Loading application...</div>
          <div style={{ fontSize: '12px' }}>This may take a few moments</div>
        </div>
      </div>
    );
  }

  return (
    <iframe 
      ref={iframeRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        border: 'none',
        borderRadius: '4px'
      }} 
      title="Web Application"
    />
  );
}
