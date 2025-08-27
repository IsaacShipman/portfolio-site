import { useRef, useCallback } from 'react';
import { SCREEN_CONFIG } from '../constants/config.js';

/**
 * Custom hook for managing CSS3D renderer setup
 * @param {React.RefObject} mountRef - Reference to the mount element
 * @param {React.RefObject} sceneRef - Reference to the Three.js scene
 * @param {Function} setDebugInfo - Function to update debug information
 * @returns {Object} CSS3D renderer utilities
 */
export const useCSS3DRenderer = (mountRef, sceneRef, setDebugInfo) => {
  const css3DRendererRef = useRef(null);
  const screenContentRef = useRef(null);

  /**
   * Attempts to import CSS3DRenderer from different possible paths
   * @returns {Promise<Object>} CSS3DRenderer and CSS3DObject classes
   */
  const importCSS3DRenderer = async () => {
    try {
      console.log('🔧 Attempting to import CSS3DRenderer...');
      
      // Try multiple import paths
      try {
        const module = await import('three/addons/renderers/CSS3DRenderer.js');
        console.log('✅ CSS3DRenderer imported successfully from three/addons/renderers/CSS3DRenderer.js');
        return {
          CSS3DRenderer: module.CSS3DRenderer,
          CSS3DObject: module.CSS3DObject
        };
      } catch (error1) {
        console.log('❌ First import path failed, trying alternative...');
        try {
          const module = await import('three/examples/jsm/renderers/CSS3DRenderer.js');
          console.log('✅ CSS3DRenderer imported successfully from three/examples/jsm/renderers/CSS3DRenderer.js');
          return {
            CSS3DRenderer: module.CSS3DRenderer,
            CSS3DObject: module.CSS3DObject
          };
        } catch (error2) {
          console.log('❌ Second import path failed, trying direct import...');
          const module = await import('three-stdlib');
          console.log('✅ CSS3DRenderer imported successfully from three-stdlib');
          return {
            CSS3DRenderer: module.CSS3DRenderer,
            CSS3DObject: module.CSS3DObject
          };
        }
      }
    } catch (error) {
      console.error('❌ All CSS3DRenderer import attempts failed:', error);
      throw error;
    }
  };

  /**
   * Sets up the CSS3D renderer and screen element
   * @returns {Promise<boolean>} Success status
   */
  const setupCSS3DRenderer = useCallback(async () => {
    try {
      if (!mountRef.current || !sceneRef.current) {
        throw new Error('Mount or scene ref not available');
      }

      const { CSS3DRenderer, CSS3DObject } = await importCSS3DRenderer();
      
      if (!CSS3DRenderer || !CSS3DObject) {
        throw new Error('CSS3DRenderer or CSS3DObject not found');
      }
      
      // Create CSS3D renderer
      const css3DRenderer = new CSS3DRenderer();
      css3DRenderer.setSize(window.innerWidth, window.innerHeight);
      css3DRenderer.domElement.style.position = 'absolute';
      css3DRenderer.domElement.style.top = '0';
      css3DRenderer.domElement.style.left = '0';
      css3DRenderer.domElement.style.pointerEvents = 'none';
      css3DRenderer.domElement.style.zIndex = '2';
      css3DRendererRef.current = css3DRenderer;
      
      mountRef.current.appendChild(css3DRenderer.domElement);
      console.log('✅ CSS3DRenderer DOM element added to mount');

      // Create screen content div
      const screenDiv = document.createElement('div');
      screenDiv.style.width = `${SCREEN_CONFIG.WIDTH}px`;
      screenDiv.style.height = `${SCREEN_CONFIG.HEIGHT}px`;
      screenDiv.style.pointerEvents = 'auto';
      screenContentRef.current = screenDiv;

      // Create CSS3D object for the screen
      const screenObject = new CSS3DObject(screenDiv);
      
      // Position and orient the screen
      screenObject.position.set(
        SCREEN_CONFIG.POSITION.x,
        SCREEN_CONFIG.POSITION.y,
        SCREEN_CONFIG.POSITION.z
      );
      screenObject.rotation.x = SCREEN_CONFIG.ROTATION.x;
      screenObject.rotation.y = SCREEN_CONFIG.ROTATION.y;
      screenObject.rotation.z = SCREEN_CONFIG.ROTATION.z;
      screenObject.scale.set(
        SCREEN_CONFIG.SCALE.x,
        SCREEN_CONFIG.SCALE.y,
        SCREEN_CONFIG.SCALE.z
      );
      
      sceneRef.current.add(screenObject);
      console.log('✅ Screen object added to scene at position:', screenObject.position);
      
      setDebugInfo(prev => ({ ...prev, css3dAvailable: true, screenCreated: true }));
      
      return true;
    } catch (error) {
      console.error('❌ CSS3DRenderer setup failed:', error);
      setDebugInfo(prev => ({ 
        ...prev, 
        errors: [...prev.errors, `CSS3DRenderer: ${error.message}`] 
      }));
      return false;
    }
  }, [mountRef, sceneRef, setDebugInfo]);

  /**
   * Creates a fallback screen element for debugging
   */
  const createFallbackScreen = useCallback(() => {
    console.log('🔧 Creating fallback screen element...');
    
    if (!mountRef.current) return;
    
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.position = 'absolute';
    fallbackDiv.style.top = '50%';
    fallbackDiv.style.left = '50%';
    fallbackDiv.style.transform = 'translate(-50%, -50%)';
    fallbackDiv.style.width = '400px';
    fallbackDiv.style.height = '300px';
    fallbackDiv.style.backgroundColor = 'rgba(255, 0, 255, 0.5)';
    fallbackDiv.style.border = '5px solid cyan';
    fallbackDiv.style.zIndex = '1000';
    fallbackDiv.style.pointerEvents = 'auto';
    fallbackDiv.innerHTML = '<h2 style="color: white; text-align: center; margin-top: 50px;">Fallback Screen</h2>';
    
    mountRef.current.appendChild(fallbackDiv);
    console.log('✅ Fallback screen element created');
  }, [mountRef]);

  /**
   * Updates the screen content with React components
   * @param {string} componentName - Name of the component to render
   */
  const updateScreenContent = useCallback((componentName) => {
    // This function is now handled by useScreenManager
    // Keeping it for compatibility but it's a no-op
    if (screenContentRef.current) {
      // The actual React rendering is managed by useScreenManager
      // This ensures we don't create duplicate React roots
    }
  }, []);
  /**
   * Handles window resize for CSS3D renderer
   */
  const handleResize = useCallback(() => {
    if (css3DRendererRef.current) {
      css3DRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  /**
   * Renders the CSS3D scene
   * @param {THREE.Scene} scene - Three.js scene
   * @param {THREE.Camera} camera - Three.js camera
   */
  const render = useCallback((scene, camera) => {
    if (css3DRendererRef.current) {
      css3DRendererRef.current.render(scene, camera);
    }
  }, []);

  /**
   * Cleans up CSS3D renderer resources
   */
  const cleanup = useCallback(() => {
    if (css3DRendererRef.current && mountRef.current) {
      mountRef.current.removeChild(css3DRendererRef.current.domElement);
      css3DRendererRef.current.domElement.remove();
    }
  }, [mountRef]);

  return {
    css3DRendererRef,
    screenContentRef,
    setupCSS3DRenderer,
    createFallbackScreen,
    updateScreenContent,
    handleResize,
    render,
    cleanup
  };
};
