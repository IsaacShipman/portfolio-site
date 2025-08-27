import React, { useState } from 'react';
import { PdfIcon } from './PdfIcon.jsx';
import { PdfViewer } from './PdfViewer.jsx';
import BrowserEmulator from './BroswerEmulator.jsx';

export const HomeScreen = ({ onNavigate }) => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showBrowser, setShowBrowser] = useState(false);

  // Array of PDF documents - easy to extend
  const pdfDocuments = [
    { name: 'resume.pdf', id: 'resume' },
    { name: 'transcript.pdf', id: 'transcript' }
  ];

  const handlePdfClick = (documentName) => {
    setSelectedPdf(documentName);
  };

  const handleClosePdf = () => {
    setSelectedPdf(null);
  };

  const handleBrowserClick = () => {
    setShowBrowser(!showBrowser);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'url(/home2.png) no-repeat center top',
      backgroundSize: '100% auto',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      borderRadius: '8px',
      position: 'relative'
    }}>
      {/* PDF Icons Container */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        zIndex: 10
      }}>
        {pdfDocuments.map((doc, index) => (
          <PdfIcon
            key={doc.id}
            name={doc.name}
            onClick={() => handlePdfClick(doc.name)}
            style={{
              marginBottom: index < pdfDocuments.length - 1 ? '10px' : '0'
            }}
          />
        ))}
      </div>

      {/* Browser Icon */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '120px',
        zIndex: 10
      }}>
        <div
          onClick={handleBrowserClick}
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#4285f4',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          🌐
        </div>
      </div>

      {/* Browser Emulator */}
      {showBrowser && (
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          zIndex: 15,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 15px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Web Application</span>
            <button
              onClick={handleBrowserClick}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ height: 'calc(100% - 50px)' }}>
            <BrowserEmulator repoUrl="https://github.com/IsaacShipman/Part4Project" />
          </div>
        </div>
      )}

      {/* PDF Viewer Popup */}
      {selectedPdf && (
        <PdfViewer
          documentName={selectedPdf}
          onClose={handleClosePdf}
        />
      )}
    </div>
  );
};
