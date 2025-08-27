"use client";
import { useEffect, useRef } from "react";

export default function BootupOverlay({ onClose }) {
  const overlayRef = useRef(null);

  // Handle escape key to close overlay
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Boot screen overlay - positioned to match laptop screen */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          top: '6.31%', // 71px / 1132px * 100
          left: '14%', // 145px / 1629px * 100
          width: '71.43%', // (1471 - 145) / 1629px * 100
          height: '78.65%', // (950 - 71) / 1132px * 100
          backgroundColor: '#1a1a1a', // Slightly lighter black for boot screen
          borderRadius: '16px',
          boxShadow: '0 0 20px rgba(35, 35, 35, 0.01)',
          transform: 'perspective(1000px) rotateX(0.2deg)',
          transformOrigin: 'center bottom',
        }}
      >
        {/* Boot screen content */}
        <div className="text-center">
          {/* Boot logo/name */}
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold tracking-wider">
              isaacshipman.dev
            </h1>
          </div>
          
          {/* Loading indicator */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Boot text */}
          <p className="text-gray-400 text-sm mt-4 font-mono">
            Starting up...
          </p>
        </div>
      </div>
    </div>
  );
}
