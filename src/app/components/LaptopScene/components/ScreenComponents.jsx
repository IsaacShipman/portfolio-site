import React from 'react';
import { Bootup } from './Bootup.jsx';
import { HomeScreen } from './HomeScreen.jsx';

// Desktop component - main welcome screen
export const Desktop = ({ onNavigate }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
    border: '2px solid red' // Debug border
  }}>
    <h1 style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>
      Welcome
    </h1>
    <p style={{ fontSize: '18px', textAlign: 'center', opacity: 0.9 }}>
      This is a React component rendered on the laptop screen
    </p>
    <div style={{ 
      marginTop: '30px', 
      display: 'flex', 
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      <button 
        onClick={() => onNavigate('app')}
        style={{
          padding: '12px 24px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Open App
      </button>
      <button 
        onClick={() => onNavigate('browser')}
        style={{
          padding: '12px 24px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Browser
      </button>
    </div>
  </div>
);

// App component - dashboard interface
export const App = ({ onNavigate }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: '#1a1a1a',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'monospace',
    border: '2px solid blue' // Debug border
  }}>
    <div style={{ 
      backgroundColor: '#333', 
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: 0, fontSize: '18px' }}>My App</h2>
      <button 
        onClick={() => onNavigate('desktop')}
        style={{
          backgroundColor: '#ff5555',
          border: 'none',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        ✕
      </button>
    </div>
    <div style={{ 
      flex: 1, 
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Dashboard</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '15px'
        }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              backgroundColor: '#2a2a2a',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
              <div>Widget {i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Browser component - web browser interface
export const Browser = ({ onNavigate }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    border: '2px solid green' // Debug border
  }}>
    <div style={{ 
      backgroundColor: '#e0e0e0', 
      padding: '8px 15px',
      borderBottom: '1px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f57' }}></div>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28ca42' }}></div>
      </div>
      <div style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        padding: '4px 8px', 
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #ccc'
      }}>
        https://mywebsite.com
      </div>
    </div>
    <div style={{ 
      flex: 1, 
      backgroundColor: 'white',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>My Website</h1>
      <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.6' }}>
        This is a simulated browser showing a website rendered as a React component
        directly on the laptop screen in the 3D scene.
      </p>
      <button 
        onClick={() => onNavigate('desktop')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Back to Desktop
      </button>
    </div>
  </div>
);

// Screen components mapping
export const ScreenComponents = {
  desktop: Desktop,
  app: App,
  browser: Browser,
  bootup: Bootup,
  homeScreen: HomeScreen
};
