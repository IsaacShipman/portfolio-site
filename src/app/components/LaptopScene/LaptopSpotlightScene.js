"use client";
import React, { useRef, useEffect, useState } from 'react';

// Import hooks
import { useSceneSetup } from './hooks/useSceneSetup.js';
import { useCSS3DRenderer } from './hooks/useCSS3DRenderer.js';
import { useAnimation } from './hooks/useAnimation.js';
import { useScreenManager } from './hooks/useScreenManager.js';
import { useScreenTransition } from './hooks/useScreenTransition.js';

// Import components
import { DebugPanel } from './components/DebugPanel.jsx';
import { ScrollIndicator } from './components/ScrollIndicator.jsx';

/**
 * Main laptop spotlight scene component
 * Orchestrates the 3D scene with laptop model and interactive screen
 */
const LaptopSpotlightScene = () => {
  const mountRef = useRef(null);
  const [screenComponent, setScreenComponent] = useState('desktop');
  const [debugInfo, setDebugInfo] = useState({
    css3dAvailable: false,
    screenCreated: false,
    reactRendered: false,
    errors: []
  });

  // Initialize hooks
  const {
    sceneRef,
    rendererRef,
    cameraRef,
    setupScene,
    setupLighting,
    setupFloor,
    updateShadowSettings,
    loadLaptop,
    handleResize: handleSceneResize,
    cleanup: cleanupScene
  } = useSceneSetup(mountRef, setDebugInfo);

  const {
    css3DRendererRef,
    screenContentRef,
    setupCSS3DRenderer,
    createFallbackScreen,
    updateScreenContent: updateCSS3DScreen,
    handleResize: handleCSS3DResize,
    render: renderCSS3D,
    cleanup: cleanupCSS3D
  } = useCSS3DRenderer(mountRef, sceneRef, setDebugInfo);

  const {
    handleMouseMove,
    handleScroll,
    animate,
    initializeAnimation,
    stopAnimation,
    getScrollProgress,
    scrollProgress
  } = useAnimation();

  const {
    updateScreenContent,
    renderInitialContent,
    getAvailableComponents,
    cleanup: cleanupScreenManager
  } = useScreenManager(screenContentRef, setDebugInfo);

  const {
    handleScreenTransition,
    getCurrentScreen,
    forceScreenTransition,
    resetScreenState
  } = useScreenTransition(screenContentRef, updateScreenContent, setDebugInfo);

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    const initScene = async () => {
      try {
        // Setup Three.js scene
        const { scene, camera, renderer } = setupScene();
        setupLighting();
        setupFloor();

        // Setup CSS3D renderer
        const css3DAvailable = await setupCSS3DRenderer();
        
        if (!css3DAvailable) {
          console.log('⚠️ CSS3DRenderer not available, creating fallback screen');
          createFallbackScreen();
        } else {
          // Don't render initial content - let zoom trigger screen transitions
          console.log('✅ CSS3DRenderer setup complete - waiting for zoom trigger');
        }

        // Load laptop model
        try {
          await loadLaptop();
        } catch (error) {
          console.error('Failed to load laptop model:', error);
        }

        // Initialize animation
        initializeAnimation();
        animate(scene, camera, renderer, renderCSS3D);

      } catch (error) {
        console.error('Scene initialization failed:', error);
        setDebugInfo(prev => ({ 
          ...prev, 
          errors: [...prev.errors, `Scene Init: ${error.message}`] 
        }));
      }
    };

    initScene();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleSceneResize);
    window.addEventListener('resize', handleCSS3DResize);

    // Preload screen components to avoid bundle load jank during first transition
    (async () => {
      try {
        await Promise.allSettled([
          import('./components/HomeScreen.jsx'),
          import('./components/PdfViewer.jsx'),
          import('./components/PdfIcon.jsx'),
        ]);
      } catch {}
    })();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleSceneResize);
      window.removeEventListener('resize', handleCSS3DResize);
      
      stopAnimation();
      cleanupScene();
      cleanupCSS3D();
      cleanupScreenManager();
    };
  }, [
    setupScene,
    setupLighting,
    setupFloor,
    setupCSS3DRenderer,
    createFallbackScreen,
    renderInitialContent,
    loadLaptop,
    initializeAnimation,
    animate,
    renderCSS3D,
    handleMouseMove,
    handleScroll,
    handleSceneResize,
    handleCSS3DResize,
    stopAnimation,
    cleanupScene,
    cleanupCSS3D,
    getScrollProgress,
    handleScreenTransition,
    cleanupScreenManager
  ]);

  // Monitor scroll progress and trigger screen transitions
  useEffect(() => {
    const checkScrollProgress = () => {
      const progress = getScrollProgress();
      handleScreenTransition(progress);
    };

    // Check immediately
    checkScrollProgress();

    // Set up interval to check scroll progress
    const interval = setInterval(checkScrollProgress, 100);

    return () => clearInterval(interval);
  }, [getScrollProgress, handleScreenTransition]);

  // Update screen content when component changes (legacy - keeping for compatibility)
  useEffect(() => {
    updateScreenContent(screenComponent);
  }, [screenComponent, updateScreenContent]);

  // Force update screen content handler
  const handleForceUpdate = () => {
    updateScreenContent(screenComponent);
  };

  // Debug shadow information
  const debugShadows = () => {
    if (sceneRef.current) {
      console.log('🔍 Debugging shadows...');
      
      // Check renderer shadow settings
      if (rendererRef.current) {
        console.log('Renderer shadow settings:', {
          enabled: rendererRef.current.shadowMap.enabled,
          type: rendererRef.current.shadowMap.type
        });
      }
      
      // Check all objects in scene
      let meshCount = 0;
      let shadowCastingMeshes = 0;
      let shadowReceivingMeshes = 0;
      
      sceneRef.current.traverse((object) => {
        if (object.isMesh) {
          meshCount++;
          if (object.castShadow) shadowCastingMeshes++;
          if (object.receiveShadow) shadowReceivingMeshes++;
          
          console.log(`Mesh: ${object.name || 'unnamed'}`, {
            castShadow: object.castShadow,
            receiveShadow: object.receiveShadow,
            position: object.position,
            visible: object.visible
          });
        }
      });
      
      console.log(`Scene summary: ${meshCount} meshes, ${shadowCastingMeshes} cast shadows, ${shadowReceivingMeshes} receive shadows`);
    }
  };

  // Test different floor heights
  const testFloorHeight = (height) => {
    if (sceneRef.current) {
      console.log(`🔧 Testing floor height: ${height}`);
      
      // Find and update floor position
      sceneRef.current.traverse((object) => {
        if (object.isMesh && object.geometry.type === 'PlaneGeometry') {
          object.position.y = height;
          console.log(`✅ Updated floor position to Y: ${height}`);
        }
      });
      
      // Update shadow settings for new floor position
      updateShadowSettings(height);
    }
  };

  return (
    <div>
      {/* 3D Scene Container */}
      <div 
        ref={mountRef} 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%', 
          height: '100vh', 
          background: '#000',
          zIndex: 1
        }} 
      />
      
      {/* Scrollable content for scroll animation */}
      <div style={{ 
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%', 
        height: '400vh', // Increased for more scroll range
        pointerEvents: 'none',
        opacity: 0,
        zIndex: -1
      }} />
      
   

      {/* Scroll Progress Indicator */}
      <ScrollIndicator scrollProgress={getScrollProgress()} />
    </div>
  );
};

export default LaptopSpotlightScene;
