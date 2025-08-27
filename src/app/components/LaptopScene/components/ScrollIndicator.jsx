import React from 'react';

/**
 * Scroll progress indicator component
 * @param {Object} props - Component props
 * @param {number} props.scrollProgress - Current scroll progress (0-1)
 * @returns {JSX.Element} Scroll indicator JSX
 */
export const ScrollIndicator = ({ scrollProgress }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(255,255,255,0.1)',
      padding: '10px',
      borderRadius: '5px',
      color: 'white',
      fontSize: '12px',
      zIndex: 10,
      fontFamily: 'monospace'
    }}>
      Scroll: {Math.round(scrollProgress * 100)}%
    </div>
  );
};
