import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { 
  CAMERA_CONFIG, 
  POSITIONS, 
  LIGHTING_CONFIG, 
  FLOOR_CONFIG,
  MODEL_CONFIG 
} from '../constants/config.js';
import { createFloorMaterial } from '../utils/textureUtils.js';

/**
 * Custom hook for managing Three.js scene setup
 * @param {React.RefObject} mountRef - Reference to the mount element
 * @param {Function} setDebugInfo - Function to update debug information
 * @returns {Object} Scene setup utilities
 */
export const useSceneSetup = (mountRef, setDebugInfo) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  /**
   * Sets up the Three.js scene
   * @returns {Object} Scene, camera, and renderer references
   */
  const setupScene = useCallback(() => {
    if (!mountRef.current) {
      throw new Error('Mount ref not available');
    }

    console.log('🔧 Starting scene setup...');

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      CAMERA_CONFIG.FOV,
      window.innerWidth / window.innerHeight,
      CAMERA_CONFIG.NEAR,
      CAMERA_CONFIG.FAR
    );
    
    camera.position.set(
      POSITIONS.INITIAL_CAMERA.x,
      POSITIONS.INITIAL_CAMERA.y,
      POSITIONS.INITIAL_CAMERA.z
    );
    
    // Enable camera to see all layers
    camera.layers.enableAll();
    
    cameraRef.current = camera;

    // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.2;
        rendererRef.current = renderer;
    
        console.log('✅ Renderer setup complete with shadows enabled');

    mountRef.current.appendChild(renderer.domElement);

    return { scene, camera, renderer };
  }, [mountRef]);

  /**
   * Sets up global ambient lighting for the entire scene
   */
  const setupGlobalLighting = useCallback(() => {
    if (!sceneRef.current) return;

    // Basic ambient light for overall illumination
    const globalAmbientLight = new THREE.AmbientLight(0x404040, 0.4);
    globalAmbientLight.layers.enableAll();
    sceneRef.current.add(globalAmbientLight);
    
    // Hemisphere light for realistic sky/ground lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x404040, 0.6);
    hemisphereLight.layers.enableAll();
    sceneRef.current.add(hemisphereLight);
    
    // Layer-specific lights for fine-tuning
    const laptopAmbientLight = new THREE.AmbientLight(0x404040, 0.2);
    laptopAmbientLight.layers.set(1); // Only laptop layer
    sceneRef.current.add(laptopAmbientLight);
    
    const floorAmbientLight = new THREE.AmbientLight(0x606060, 0.3);
    floorAmbientLight.layers.set(0); // Only floor layer
    sceneRef.current.add(floorAmbientLight);
    
    console.log('✅ Global lighting setup complete');
  }, []);

  /**
   * Sets up lighting for the scene
   */
  const setupLighting = useCallback(() => {
    if (!sceneRef.current) return;

    // Setup global ambient lighting first
    setupGlobalLighting();

    // Main Spotlight
    const spotLight = new THREE.SpotLight(
      LIGHTING_CONFIG.SPOTLIGHT.COLOR,
      LIGHTING_CONFIG.SPOTLIGHT.INTENSITY,
      LIGHTING_CONFIG.SPOTLIGHT.DISTANCE,
      LIGHTING_CONFIG.SPOTLIGHT.ANGLE,
      LIGHTING_CONFIG.SPOTLIGHT.PENUMBRA,
      LIGHTING_CONFIG.SPOTLIGHT.DECAY
    );
    spotLight.position.set(
      LIGHTING_CONFIG.SPOTLIGHT.POSITION.x,
      LIGHTING_CONFIG.SPOTLIGHT.POSITION.y,
      LIGHTING_CONFIG.SPOTLIGHT.POSITION.z
    );
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    
    // Configure spotlight to only affect layer 0 (floor and other objects)
    spotLight.layers.set(0);
    
    // Shadow configuration
    spotLight.shadow.mapSize.width = LIGHTING_CONFIG.SPOTLIGHT.SHADOW_MAP_SIZE;
    spotLight.shadow.mapSize.height = LIGHTING_CONFIG.SPOTLIGHT.SHADOW_MAP_SIZE;
    spotLight.shadow.camera.fov = LIGHTING_CONFIG.SPOTLIGHT.SHADOW_FOV;
    
    // Store spotlight reference for later adjustments
    sceneRef.current.spotLight = spotLight;
    
    sceneRef.current.add(spotLight);
    sceneRef.current.add(spotLight.target);

    // // Red Light
    // const redLight = new THREE.SpotLight(
    //   LIGHTING_CONFIG.RED_LIGHT.COLOR,
    //   LIGHTING_CONFIG.RED_LIGHT.INTENSITY,
    //   LIGHTING_CONFIG.RED_LIGHT.DISTANCE,
    //   LIGHTING_CONFIG.RED_LIGHT.ANGLE,
    //   LIGHTING_CONFIG.RED_LIGHT.PENUMBRA,
    //   LIGHTING_CONFIG.RED_LIGHT.DECAY
    // );
    // redLight.position.set(
    //   LIGHTING_CONFIG.RED_LIGHT.POSITION.x,
    //   LIGHTING_CONFIG.RED_LIGHT.POSITION.y,
    //   LIGHTING_CONFIG.RED_LIGHT.POSITION.z
    // );
    // redLight.target.position.set(
    //   LIGHTING_CONFIG.RED_LIGHT.TARGET.x,
    //   LIGHTING_CONFIG.RED_LIGHT.TARGET.y,
    //   LIGHTING_CONFIG.RED_LIGHT.TARGET.z
    // );
    // redLight.castShadow = false; // No shadows for colored lights to avoid complexity
    // redLight.layers.enableAll(); // Affect all layers
    
    // sceneRef.current.add(redLight);
    // sceneRef.current.add(redLight.target);

    // Blue Light
    const blueLight = new THREE.SpotLight(
      LIGHTING_CONFIG.BLUE_LIGHT.COLOR,
      LIGHTING_CONFIG.BLUE_LIGHT.INTENSITY,
      LIGHTING_CONFIG.BLUE_LIGHT.DISTANCE,
      LIGHTING_CONFIG.BLUE_LIGHT.ANGLE,
      LIGHTING_CONFIG.BLUE_LIGHT.PENUMBRA,
      LIGHTING_CONFIG.BLUE_LIGHT.DECAY
    );
    blueLight.position.set(
      LIGHTING_CONFIG.BLUE_LIGHT.POSITION.x,
      LIGHTING_CONFIG.BLUE_LIGHT.POSITION.y,
      LIGHTING_CONFIG.BLUE_LIGHT.POSITION.z
    );
    blueLight.target.position.set(
      LIGHTING_CONFIG.BLUE_LIGHT.TARGET.x,
      LIGHTING_CONFIG.BLUE_LIGHT.TARGET.y,
      LIGHTING_CONFIG.BLUE_LIGHT.TARGET.z
    );
    blueLight.castShadow = false; // No shadows for colored lights to avoid complexity
    blueLight.layers.enableAll(); // Affect all layers
    
    sceneRef.current.add(blueLight);
    sceneRef.current.add(blueLight.target);

    console.log('✅ Lighting setup complete with red and blue accent lights');
  }, [setupGlobalLighting]);

  /**
   * Updates shadow camera settings based on floor position
   * @param {number} floorY - Y position of the floor
   */
  const updateShadowSettings = useCallback((floorY = 0) => {
    if (!sceneRef.current?.spotLight) return;

    const spotLight = sceneRef.current.spotLight;
    const lightY = spotLight.position.y;
    const laptopY = MODEL_CONFIG.POSITION.y;
    
    // // Calculate the distance from light to floor
    // const lightToFloor = lightY - floorY;
    // const lightToLaptop = lightY - laptopY;
    
    // // Set shadow camera near/far based on scene bounds
    // const near = Math.max(0.1, lightToLaptop - 2); // Slightly before laptop
    // const far = lightToFloor + 2; // Slightly beyond floor
    
    // spotLight.shadow.camera.near = near;
    // spotLight.shadow.camera.far = far;
    
    // // Adjust bias based on distance
    // const distance = lightToFloor;
    // const bias = -0.0001 * (distance / 6); // Scale bias with distance
    // const normalBias = 0.02 * (distance / 6); // Scale normal bias with distance
    
    // spotLight.shadow.bias = bias;
    //spotLight.shadow.normalBias = normalBias;
    
    console.log('✅ Shadow settings updated:', {
      floorY,
      lightY,
      laptopY,
      //bias,
      //normalBias,
      //lightToFloor: lightToFloor
    });
  }, []);

  /**
   * Sets up the floor with grid texture
   */
  const setupFloor = useCallback((floorY = FLOOR_CONFIG.POSITION.y) => {
    if (!sceneRef.current) return;

    const floorGeometry = new THREE.PlaneGeometry(FLOOR_CONFIG.SIZE, FLOOR_CONFIG.SIZE);
    const floorMaterial = createFloorMaterial();
    
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = -Math.PI / 2.0;
    floorMesh.position.set(
      FLOOR_CONFIG.POSITION.x,
      floorY,
      FLOOR_CONFIG.POSITION.z
    );
    
    // Keep floor on layer 0 (affected by spotlight)
    //floorMesh.layers.set(0);
    
    sceneRef.current.add(floorMesh);

    // Update shadow settings after floor is positioned
    updateShadowSettings(floorY);

    console.log('✅ Floor setup complete at Y:', floorY);
  }, [updateShadowSettings]);

  /**
   * Loads the laptop model
   * @returns {Promise<void>}
   */
  const loadLaptop = useCallback(async () => {
    if (!sceneRef.current) return;

    try {
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      
      return new Promise((resolve, reject) => {
        loader.load(
          MODEL_CONFIG.LAPTOP_PATH,
          (gltf) => {
            const laptop = gltf.scene;
            
            // Configure shadows and layer for all meshes in the loaded model
            laptop.traverse((child) => {
              if (child.isMesh) {
                // child.castShadow = true;
                // child.receiveShadow = true;
                
                // Make laptop materials much darker
                if (child.material) {
                  child.material.envMapIntensity = 0.2; // Much lower environmental reflection
                  child.material.emissiveIntensity = 0.2; // No self-illumination
                  
                  // Darken the material if it has a color
                  if (child.material.color) {
                    child.material.color.multiplyScalar(0.6); // Make 70% darker
                  }
                  
                  // Alternative: use a darker color multiplier for all materials
                  child.material.color.multiplyScalar(0.6); // Less darkening (was 0.7)
                  
                  // For textured materials, also adjust the texture intensity
                  if (child.material.map) {
                    // Make the texture darker by adjusting the material's overall brightness
                    child.material.transparent = true;
                    child.material.opacity = 0.3; // Less transparent (was 0.5)
                  }
                }
                
                // Keep laptop on layer 1 (not affected by spotlight)
                child.layers.set(1);
                
                console.log(`✅ Enabled shadows and set layer 1 for mesh: ${child.name || 'unnamed'}`);
              }
            });
            
            // Set the laptop group to layer 1 as well
            laptop.layers.set(1);
            
            laptop.position.set(
              MODEL_CONFIG.POSITION.x,
              MODEL_CONFIG.POSITION.y,
              MODEL_CONFIG.POSITION.z
            );
            laptop.scale.setScalar(MODEL_CONFIG.SCALE);
            
            // Ensure the laptop is above the floor for proper shadows
            console.log('✅ Laptop positioned at:', laptop.position);
            
            sceneRef.current.add(laptop);

            // if (rendererRef.current && cameraRef.current && sceneRef.current) {
            //   try {
            //     rendererRef.current.compile(sceneRef.current, cameraRef.current);
            //   } catch (error) {
            //     console.error('Error compiling renderer:', error);
            //   }
            //   console.log('✅ Renderer, camera, and scene are available');
            // } else {
            //   console.log('❌ Renderer, camera, or scene is not available');
            // }

            console.log('✅ Laptop model loaded successfully on layer 1 (no spotlight interaction)');
            resolve();
          },
          (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
          },
          (error) => {
            console.error('Error loading laptop model:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Error importing GLTFLoader:', error);
      throw error;
    }
  }, []);

  /**
   * Handles window resize
   */
  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
  }, []);

  /**
   * Cleans up scene resources
   */
  const cleanup = useCallback(() => {
    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }
    
    if (sceneRef.current) {
      sceneRef.current.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
  }, [mountRef]);

  return {
    sceneRef,
    rendererRef,
    cameraRef,
    setupScene,
    setupLighting,
    setupFloor,
    updateShadowSettings,
    loadLaptop,
    handleResize,
    cleanup
  };
};