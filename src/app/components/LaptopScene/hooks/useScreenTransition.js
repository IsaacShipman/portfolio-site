import { useRef, useCallback, useEffect } from 'react';
import { startTransition } from 'react';

/**
 * Custom hook for managing screen transitions based on zoom progress
 * @param {React.RefObject} screenContentRef - Reference to screen content element
 * @param {Function} updateScreenContent - Function to update screen content
 * @param {Function} setDebugInfo - Function to update debug information
 * @returns {Object} Screen transition utilities
 */
export const useScreenTransition = (screenContentRef, updateScreenContent, setDebugInfo) => {
  const currentScreenRef = useRef('none');
  const hasTriggeredBootupRef = useRef(false);
  const lastTransitionTimeRef = useRef(0);
  const transitionInProgressRef = useRef(false);
  const lastProgressRef = useRef(0);

  /**
   * Debounced screen update to prevent rapid transitions
   * @param {string} screenName - Screen to transition to
   * @param {number} progress - Current zoom progress
   */
  const debouncedScreenUpdate = useCallback((screenName, progress) => {
    const now = performance.now();
    const timeSinceLastTransition = now - lastTransitionTimeRef.current;
    const progressDelta = Math.abs(progress - lastProgressRef.current);
    
    // Only transition if enough time has passed or significant progress change
    if (timeSinceLastTransition > 100 || progressDelta > 0.05) {
      if (currentScreenRef.current !== screenName && !transitionInProgressRef.current) {
        transitionInProgressRef.current = true;
        lastTransitionTimeRef.current = now;
        
        // Use React's startTransition to keep UI responsive
        startTransition(() => {
          currentScreenRef.current = screenName;
          updateScreenContent(screenName);
          transitionInProgressRef.current = false;
        });
        
        // Only log significant transitions to reduce console noise
        if (progressDelta > 0.1) {
          console.log('🔄 Screen transition:', screenName, 'at', Math.round(progress * 100) + '%');
        }
      }
    }
    
    lastProgressRef.current = progress;
  }, [updateScreenContent]);

  /**
   * Handles screen transitions based on zoom progress
   * @param {number} zoomProgress - Current zoom progress (0-1)
   */
  const handleScreenTransition = useCallback((zoomProgress) => {
    // Early exit if transition is in progress to prevent conflicts
    if (transitionInProgressRef.current) {
      return;
    }

    // At 40% zoom progress, trigger bootup sequence
    if (zoomProgress >= 0.4 && !hasTriggeredBootupRef.current) {
      hasTriggeredBootupRef.current = true;
      debouncedScreenUpdate('bootup', zoomProgress);

      // Use rAF-based timing instead of setTimeout for better performance
      const triggerHomeScreen = () => {
        if (hasTriggeredBootupRef.current && currentScreenRef.current === 'bootup') {
          debouncedScreenUpdate('homeScreen', zoomProgress);
        }
      };
      
      // Schedule home screen transition using rAF for better timing
      requestAnimationFrame(() => {
        setTimeout(triggerHomeScreen, 2000);
      });

    } else if (zoomProgress < 0.35 && hasTriggeredBootupRef.current) {
      // Reset sequence when zoomed out (with hysteresis to prevent flickering)
      hasTriggeredBootupRef.current = false;
      debouncedScreenUpdate('none', zoomProgress);
    }
  }, [debouncedScreenUpdate]);

  /**
   * Gets the current screen state
   * @returns {string} Current screen name
   */
  const getCurrentScreen = useCallback(() => {
    return currentScreenRef.current;
  }, []);

  /**
   * Manually trigger a screen transition (for debugging)
   * @param {string} screenName - Name of the screen to transition to
   */
  const forceScreenTransition = useCallback((screenName) => {
    console.log('🔧 Force transitioning to screen:', screenName);
    transitionInProgressRef.current = false; // Reset transition lock
    currentScreenRef.current = screenName;
    
    startTransition(() => {
      updateScreenContent(screenName);
    });
    
    setDebugInfo(prev => ({ ...prev, currentScreen: screenName }));
  }, [updateScreenContent, setDebugInfo]);

  /**
   * Reset the screen transition state
   */
  const resetScreenState = useCallback(() => {
    hasTriggeredBootupRef.current = false;
    currentScreenRef.current = 'none';
    transitionInProgressRef.current = false;
    lastTransitionTimeRef.current = 0;
    lastProgressRef.current = 0;
    
    setDebugInfo(prev => ({ ...prev, currentScreen: 'none' }));
  }, [setDebugInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      transitionInProgressRef.current = false;
    };
  }, []);

  return {
    handleScreenTransition,
    getCurrentScreen,
    forceScreenTransition,
    resetScreenState
  };
};
