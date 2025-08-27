import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { CAMERA_CONFIG, POSITIONS, DEBUG_CONFIG } from '../constants/config.js';

/**
 * Custom hook for managing camera animation and interactions
 * @returns {Object} Animation utilities
 */
export const useAnimation = () => {
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const mouseTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentPositionRef = useRef(new THREE.Vector3(
    POSITIONS.INITIAL_CAMERA.x,
    POSITIONS.INITIAL_CAMERA.y,
    POSITIONS.INITIAL_CAMERA.z
  ));
  const currentLookAtRef = useRef(new THREE.Vector3(
    POSITIONS.INITIAL_LOOK_AT.x,
    POSITIONS.INITIAL_LOOK_AT.y,
    POSITIONS.INITIAL_LOOK_AT.z
  ));

  // Target vectors
  const finalZoomPosition = new THREE.Vector3(
    POSITIONS.FINAL_ZOOM.x,
    POSITIONS.FINAL_ZOOM.y,
    POSITIONS.FINAL_ZOOM.z
  );
  const initialLookAt = new THREE.Vector3(
    POSITIONS.INITIAL_LOOK_AT.x,
    POSITIONS.INITIAL_LOOK_AT.y,
    POSITIONS.INITIAL_LOOK_AT.z
  );
  const finalLookAt = new THREE.Vector3(
    POSITIONS.FINAL_LOOK_AT.x,
    POSITIONS.FINAL_LOOK_AT.y,
    POSITIONS.FINAL_LOOK_AT.z
  );

  /**
   * Handles mouse movement for camera positioning
   * @param {MouseEvent} event - Mouse event
   */
  const handleMouseMove = useCallback((event) => {
    const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    mouseRef.current.x = normalizedX;
    mouseRef.current.y = normalizedY;
    
    // Dynamic radius based on scroll progress - camera moves further away as you scroll
    const radius = CAMERA_CONFIG.BASE_RADIUS + 
      (CAMERA_CONFIG.MAX_RADIUS - CAMERA_CONFIG.BASE_RADIUS) * scrollProgress.current;
    
    // Adjust movement sensitivity based on scroll progress
    const mouseSensitivity = CAMERA_CONFIG.MOUSE_SENSITIVITY_BASE - 
      (scrollProgress.current * CAMERA_CONFIG.MOUSE_SENSITIVITY_REDUCTION);
    const maxAngleX = CAMERA_CONFIG.MAX_ANGLE_X * mouseSensitivity;
    const maxAngleY = CAMERA_CONFIG.MAX_ANGLE_Y * mouseSensitivity;
    
    const angleX = normalizedX * maxAngleX;
    const angleY = normalizedY * maxAngleY * 0.5;
    
    // Base height changes with scroll
    const currentBaseHeight = CAMERA_CONFIG.INITIAL_HEIGHT + 
      (scrollProgress.current * CAMERA_CONFIG.SCROLL_HEIGHT_MULTIPLIER);
    
    const x = radius * Math.sin(angleX) * Math.cos(angleY);
    const y = currentBaseHeight + radius * Math.sin(angleY) * 0.3;
    const z = radius * Math.cos(angleX) * Math.cos(angleY);
    
    mouseTargetRef.current.set(x, y, z);
  }, []);

  /**
   * Handles scroll for zoom animation
   */
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / Math.max(scrollHeight, 1), 1);
    
    scrollProgress.current = progress;
  }, []);

  /**
   * Main animation loop
   * @param {THREE.Scene} scene - Three.js scene
   * @param {THREE.Camera} camera - Three.js camera
   * @param {THREE.WebGLRenderer} renderer - Three.js renderer
   * @param {Function} css3DRender - CSS3D render function
   */
  const animate = useCallback((scene, camera, renderer, css3DRender) => {
    animationRef.current = requestAnimationFrame(() => 
      animate(scene, camera, renderer, css3DRender)
    );
    
    // Calculate the starting position (from mouse movement)
    const startPosition = mouseTargetRef.current;
    
    // Interpolate from mouse position to zoom target based on scroll
    const targetPosition = new THREE.Vector3();
    targetPosition.lerpVectors(startPosition, finalZoomPosition, scrollProgress.current);
    
    // Smooth camera movement
    currentPositionRef.current.lerp(targetPosition, CAMERA_CONFIG.LERP_FACTOR);
    camera.position.copy(currentPositionRef.current);
    
    // Smooth look-at transition based on scroll progress
    const targetLookAt = new THREE.Vector3();
    targetLookAt.lerpVectors(initialLookAt, finalLookAt, scrollProgress.current);
    
    // Smooth look-at movement
    currentLookAtRef.current.lerp(targetLookAt, CAMERA_CONFIG.LERP_FACTOR);
    camera.lookAt(currentLookAtRef.current);

    renderer.render(scene, camera);
    
    // Render CSS3D scene if available
    if (css3DRender) {
      css3DRender(scene, camera);
      
      // Debug: Log screen object position occasionally
      // if (Math.random() < DEBUG_CONFIG.LOG_FREQUENCY) {
      //   const screenObject = scene.children.find(child => child.isCSS3DObject);
      //   if (screenObject) {
      //     console.log('📍 Screen object position:', screenObject.position);
      //     console.log('📍 Camera position:', camera.position);
      //     console.log('📍 Camera looking at:', currentLookAtRef.current);
      //   }
      // }
    }
  }, []);

  /**
   * Initializes animation state
   */
  const initializeAnimation = useCallback(() => {
    mouseTargetRef.current.copy(currentPositionRef.current);
    currentLookAtRef.current.copy(initialLookAt);
    
    // Trigger initial calculations
    handleScroll();
  }, [handleScroll]);

  /**
   * Stops the animation loop
   */
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  /**
   * Gets current scroll progress
   * @returns {number} Scroll progress (0-1)
   */
  const getScrollProgress = useCallback(() => {
    return scrollProgress.current;
  }, []);

  return {
    handleMouseMove,
    handleScroll,
    animate,
    initializeAnimation,
    stopAnimation,
    getScrollProgress,
    mouseRef,
    scrollProgress
  };
};
