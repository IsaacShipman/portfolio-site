import React from 'react';

/**
 * Debug panel component for development and troubleshooting
 * @param {Object} props - Component props
 * @param {Object} props.debugInfo - Debug information object
 * @param {string} props.screenComponent - Current screen component name
 * @param {number} props.scrollProgress - Current scroll progress
 * @param {Function} props.onForceUpdate - Function to force update screen content
 * @param {Function} props.onDebugShadows - Function to debug shadows
 * @param {Function} props.onTestFloorHeight - Function to test floor height
 * @param {Function} props.onForceScreenTransition - Function to force screen transition
 * @param {Function} props.onResetScreenState - Function to reset screen state
 * @returns {JSX.Element} Debug panel JSX
 */
export const DebugPanel = ({ 
  debugInfo, 
  screenComponent, 
  scrollProgress, 
  onForceUpdate,
  onDebugShadows,
  onTestFloorHeight,
  onForceScreenTransition,
  onResetScreenState
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.8)',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '12px',
      zIndex: 10,
      fontFamily: 'monospace',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>🔧 Debug Info</h3>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>CSS3D Available:</strong> 
        <span style={{ color: debugInfo.css3dAvailable ? '#00ff00' : '#ff0000' }}>
          {debugInfo.css3dAvailable ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Screen Created:</strong> 
        <span style={{ color: debugInfo.screenCreated ? '#00ff00' : '#ff0000' }}>
          {debugInfo.screenCreated ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>React Rendered:</strong> 
        <span style={{ color: debugInfo.reactRendered ? '#00ff00' : '#ff0000' }}>
          {debugInfo.reactRendered ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Current Component:</strong> {screenComponent}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Current Screen:</strong> 
        <span style={{ color: debugInfo.currentScreen ? '#00ff00' : '#ff6666' }}>
          {debugInfo.currentScreen || 'none'}
        </span>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Scroll Progress:</strong> {Math.round(scrollProgress * 100)}%
      </div>
      
      {debugInfo.errors.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong style={{ color: '#ff0000' }}>Errors:</strong>
          {debugInfo.errors.map((error, index) => (
            <div key={index} style={{ color: '#ff6666', fontSize: '10px', marginTop: '5px' }}>
              {error}
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
        Look for a yellow-bordered red rectangle on the laptop screen
      </div>
      
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={onForceUpdate}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Force Update Screen
          </button>
          <button 
            onClick={onDebugShadows}
            style={{
              padding: '8px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Debug Shadows
          </button>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '5px' }}>Test Floor Heights:</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[-1, -0.5, 0, 0.5, 1].map(height => (
              <button 
                key={height}
                onClick={() => onTestFloorHeight(height)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                Y={height}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '5px' }}>Screen Transitions:</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onForceScreenTransition('bootup')}
              style={{
                padding: '4px 8px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              Bootup
            </button>
            <button 
              onClick={() => onForceScreenTransition('homeScreen')}
              style={{
                padding: '4px 8px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              Home
            </button>
            <button 
              onClick={onResetScreenState}
              style={{
                padding: '4px 8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              Reset
            </button>
          </div>
        </div>
    </div>
  );
};
