import React, { useState, useEffect } from 'react';

export const PdfViewer = ({ documentName = "Sample Document.pdf", onClose, style = {} }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const cardGlassStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.4s ease-out',
        ...style
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(120, 119, 198, 0.3), 0 20px 40px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 30px rgba(120, 119, 198, 0.5), 0 25px 50px rgba(0, 0, 0, 0.15); }
        }
        .glass-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .primary-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .primary-button:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }
        .document-card {
          animation: slideUp 0.6s ease-out 0.2s both;
        }
        .viewer-container {
          animation: glow 4s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="viewer-container"
        style={{
          width: '70%',
          maxWidth: '900px',
          height: '75%',
          ...glassStyle,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transform: isHovered ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)'
          }} />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
              boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #feca57, #ff9ff3)',
              boxShadow: '0 2px 8px rgba(254, 202, 87, 0.3)'
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #48dbfb, #0abde3)',
              boxShadow: '0 2px 8px rgba(72, 219, 251, 0.3)'
            }} />
          </div>
          
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
            letterSpacing: '-0.02em'
          }}>
            {documentName.replace('.pdf', '')} • PDF Reader
          </div>
          
          <button
            onClick={onClose}
            className="glass-button"
            style={{
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.8)',
              padding: '8px 12px',
              borderRadius: '12px',
              fontWeight: '500'
            }}
          >
            ✕
          </button>
        </div>

        {/* Glass Toolbar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button 
            className="primary-button glass-button"
            style={{
              padding: '8px 16px',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
              fontWeight: '500',
              letterSpacing: '-0.01em'
            }}
          >
            📤 Share
          </button>
          
          <button 
            className="glass-button"
            style={{
              padding: '8px 16px',
              color: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
              fontWeight: '500',
              letterSpacing: '-0.01em'
            }}
          >
            💾 Export
          </button>

          <div style={{ flex: 1 }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '13px',
            fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif'
          }}>
            <button className="glass-button" style={{
              padding: '6px 10px',
              border: 'none',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
              🔍 Zoom
            </button>
            <span>100%</span>
          </div>
        </div>

        {/* PDF Content Area */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '24px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Floating background elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.1), rgba(255, 3, 112, 0.1))',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'glow 6s ease-in-out infinite'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(255, 3, 112, 0.1), rgba(120, 119, 198, 0.1))',
            borderRadius: '50%',
            filter: 'blur(30px)',
            animation: 'glow 4s ease-in-out infinite reverse'
          }} />

          {/* Document Card */}
          <div 
            className="document-card"
            style={{
              width: '100%',
              maxWidth: '600px',
              ...cardGlassStyle,
              borderRadius: '16px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Card shine effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              animation: 'slideRight 3s ease-in-out infinite',
              animationDelay: '2s'
            }} />
            
            <style>{`
              @keyframes slideRight {
                0% { left: -100%; }
                50% { left: 100%; }
                100% { left: 100%; }
              }
            `}</style>

            {/* Document Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '28px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent)',
                zIndex: -1
              }} />
              
              <h1 style={{
                fontSize: '26px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #2d3748, #4a5568)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 10px 0',
                fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
                letterSpacing: '-0.02em'
              }}>
                {documentName.replace('.pdf', '')}
              </h1>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '4px 12px',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)'
                }} />
                <p style={{
                  fontSize: '12px',
                  color: '#667eea',
                  margin: 0,
                  fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
                  fontWeight: '500'
                }}>
                  Interactive Preview
                </p>
              </div>
            </div>

            {/* Document Content */}
            <div style={{
              lineHeight: '1.6',
              color: '#2d3748',
              fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
              fontSize: '14px'
            }}>
              <p style={{ 
                marginBottom: '18px',
                padding: '16px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '10px',
                borderLeft: '3px solid #667eea'
              }}>
                ✨ This is an enhanced preview of "{documentName}". The glassomorphic interface 
                provides a modern, immersive experience for document viewing with beautiful 
                visual effects and smooth interactions.
              </p>
              
              <p style={{ marginBottom: '18px' }}>
                The document rendering engine delivers high-fidelity display with advanced 
                typography and layout preservation. Interactive elements respond fluidly to 
                user input, creating an engaging and professional viewing experience.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                margin: '24px 0'
              }}>
                {['📄 High Quality', '🎨 Beautiful UI', '⚡ Fast Rendering'].map((feature, i) => (
                  <div key={i} style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Page Indicator */}
            <div style={{
              textAlign: 'center',
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(102, 126, 234, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif'
              }}>
                Page 1 of 1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};