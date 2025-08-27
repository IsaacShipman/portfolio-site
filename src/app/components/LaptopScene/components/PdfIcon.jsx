import React from 'react';

export const PdfIcon = ({ name, onClick, style = {} }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 60,
        height: 60,
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        background: 'url(/pdf.png) no-repeat center center',
        backgroundSize: 'contain',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
  
     
      <div style={{
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold',
        marginTop: '45px',
        textAlign: 'center',
        fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        {name}
      </div>
    </div>
  );
};
