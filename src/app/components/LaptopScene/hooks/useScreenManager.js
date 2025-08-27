import { useCallback, useRef, useMemo } from 'react';
import { ScreenComponents } from '../components/ScreenComponents.jsx';

/**
 * Custom hook for managing screen content and React component rendering
 * @param {React.RefObject} screenContentRef - Reference to screen content element
 * @param {Function} setDebugInfo - Function to update debug information
 * @returns {Object} Screen management utilities
 */
export const useScreenManager = (screenContentRef, setDebugInfo) => {
  const rootRef = useRef(null);
  const currentComponentRef = useRef(null);
  const isRenderingRef = useRef(false);

  // Memoize navigation handler to prevent unnecessary re-renders
  const navigationHandler = useMemo(() => {
    return (newComponent) => {
      if (newComponent !== currentComponentRef.current && !isRenderingRef.current) {
        updateScreenContent(newComponent);
      }
    };
  }, []);

  /**
   * Updates the screen content with React components
   * @param {string} componentName - Name of the component to render
   */
  const updateScreenContent = useCallback((componentName) => {
    if (!screenContentRef.current || !ScreenComponents[componentName]) {
      return;
    }

    // Prevent concurrent renders
    if (isRenderingRef.current) {
      return;
    }

    // Skip if same component is already rendered
    if (currentComponentRef.current === componentName) {
      return;
    }

    isRenderingRef.current = true;
    currentComponentRef.current = componentName;

    // Create React root only once
    import('react-dom/client').then(({ createRoot }) => {
      try {
        if (!rootRef.current) {
          rootRef.current = createRoot(screenContentRef.current);
        }
        
        const Component = ScreenComponents[componentName];
        
        // Render with memoized navigation handler
        rootRef.current.render(
          <Component onNavigate={navigationHandler} />
        );
        
        setDebugInfo(prev => ({ 
          ...prev, 
          reactRendered: true,
          currentScreen: componentName 
        }));
        
        isRenderingRef.current = false;
      } catch (error) {
        console.error('❌ React rendering failed:', error);
        setDebugInfo(prev => ({ 
          ...prev, 
          errors: [...prev.errors, `React: ${error.message}`] 
        }));
        isRenderingRef.current = false;
      }
    }).catch(error => {
      console.error('❌ Failed to import react-dom/client:', error);
      setDebugInfo(prev => ({ 
        ...prev, 
        errors: [...prev.errors, `React DOM: ${error.message}`] 
      }));
      isRenderingRef.current = false;
    });
  }, [screenContentRef, setDebugInfo, navigationHandler]);

  /**
   * Renders initial test content to verify screen is working
   */
  const renderInitialContent = useCallback(() => {
    if (!screenContentRef.current) {
      return;
    }

    if (isRenderingRef.current) {
      return;
    }

    isRenderingRef.current = true;
    
    import('react-dom/client').then(({ createRoot }) => {
      try {
        if (!rootRef.current) {
          rootRef.current = createRoot(screenContentRef.current);
        }
        
        const InitialContent = () => (
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
            border: '2px solid red',
            fontSize: '14px'
          }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
              Welcome
            </h1>
            <p style={{ fontSize: '14px', textAlign: 'center', opacity: 0.9 }}>
              This is a test content rendered with React
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                onClick={() => console.log('Button clicked!')} 
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Test Button
              </button>
            </div>
          </div>
        );
        
        rootRef.current.render(<InitialContent />);
        setDebugInfo(prev => ({ ...prev, reactRendered: true }));
        isRenderingRef.current = false;
      } catch (error) {
        console.error('❌ React rendering failed:', error);
        setDebugInfo(prev => ({ 
          ...prev, 
          errors: [...prev.errors, `React: ${error.message}`] 
        }));
        isRenderingRef.current = false;
      }
    }).catch(error => {
      console.error('❌ Failed to import react-dom/client:', error);
      setDebugInfo(prev => ({ 
        ...prev, 
        errors: [...prev.errors, `React DOM: ${error.message}`] 
      }));
      isRenderingRef.current = false;
    });
  }, [screenContentRef, setDebugInfo]);

  /**
   * Gets available screen components
   * @returns {Object} Available screen components
   */
  const getAvailableComponents = useCallback(() => {
    return Object.keys(ScreenComponents);
  }, []);

  /**
   * Cleans up React root and resets state
   */
  const cleanup = useCallback(() => {
    if (rootRef.current) {
      try {
        rootRef.current.unmount();
      } catch (error) {
        // Ignore unmount errors
      }
      rootRef.current = null;
    }
    currentComponentRef.current = null;
    isRenderingRef.current = false;
  }, []);

  return {
    updateScreenContent,
    renderInitialContent,
    getAvailableComponents,
    cleanup
  };
};
