// Camera and animation configuration
export const CAMERA_CONFIG = {
  FOV: 20,
  NEAR: 0.1,
  FAR: 1000,
  LERP_FACTOR: 0.08,
  INITIAL_HEIGHT: 2,
  BASE_RADIUS: 6,
  MAX_RADIUS: 10,
  MOUSE_SENSITIVITY_BASE: 1,
  MOUSE_SENSITIVITY_REDUCTION: 0.6,
  MAX_ANGLE_X: Math.PI * 0.3,
  MAX_ANGLE_Y: Math.PI * 0.25,
  SCROLL_HEIGHT_MULTIPLIER: 3
};

// Position and target vectors
export const POSITIONS = {
  FINAL_ZOOM: { x: 0, y: 0.2, z: 0.5 },
  INITIAL_LOOK_AT: { x: 0, y: 0, z: 0 },
  FINAL_LOOK_AT: { x: 0, y: 0.1, z: 0 },
  INITIAL_CAMERA: { x: -4, y: 2, z: 4 }
};

// Screen positioning and scaling
export const SCREEN_CONFIG = {
  WIDTH: 800,
  HEIGHT: 500,
  POSITION: { x: -0.001, y: 0.09, z: -0.1 },
  ROTATION: { x: -0.24, y: 0, z: 0 },
  SCALE: { x: 0.00033, y: 0.00033, z: 0.00033 }
};

// Lighting configuration
export const LIGHTING_CONFIG = {
  SPOTLIGHT: {
    COLOR: 0xffffff,
    INTENSITY: 200, // Increased from 50
    DISTANCE: 20,
    ANGLE: Math.PI * 0.07,
    PENUMBRA: 0.5,
    DECAY: 1,
    POSITION: { x: 0, y: 6, z: 0 },
    SHADOW_MAP_SIZE: 2048,
    SHADOW_NEAR: 0.1,
    SHADOW_FAR: 20,
    SHADOW_FOV: 45,
    SHADOW_BIAS: -0.0005,
    SHADOW_NORMAL_BIAS: 0.02
  },
  RED_LIGHT: {
    COLOR: 0xff4444,
    INTENSITY: 30,
    DISTANCE: 15,
    ANGLE: Math.PI * 0.1,
    PENUMBRA: 0.3,
    DECAY: 1.5,
    POSITION: { x: -3, y: 4, z: 2 },
    TARGET: { x: 0, y: 0, z: 0 }
  },
  BLUE_LIGHT: {
    COLOR: 0x4444ff,
    INTENSITY: 25,
    DISTANCE: 12,
    ANGLE: Math.PI * 0.08,
    PENUMBRA: 0.4,
    DECAY: 1.2,
    POSITION: { x: 3, y: 3, z: -2 },
    TARGET: { x: 0, y: 0, z: 0 }
  },
  HEMISPHERE: {
    SKY_COLOR: 0xffffff,
    GROUND_COLOR: 0xffffff,
    INTENSITY: 0.9
  }
};

// Floor configuration
export const FLOOR_CONFIG = {
  SIZE: 50,
  TEXTURE_SIZE: 1024,
  GRID_SIZE: 64,
  REPEAT: 8,
  POSITION: { x: 0, y: -0.008, z: 0 }, // Easy to adjust floor height here
  MATERIAL: {
    ROUGHNESS: 0.3,
    METALNESS: 0.8,
    COLOR: 0x333333,
    NORMAL_SCALE: { x: 0.1, y: 0.1 }
  }
};

// Model configuration
export const MODEL_CONFIG = {
  LAPTOP_PATH: '/models/macbook_dark.glb',
  SCALE: 1,
  POSITION: { x: 0, y: 0, z: 0 }
};

// Debug configuration
export const DEBUG_CONFIG = {
  LOG_FREQUENCY: 0.01, // 1% chance per frame
  FALLBACK_SCREEN: {
    WIDTH: 400,
    HEIGHT: 300,
    COLOR: 'rgba(255, 0, 255, 0.5)',
    BORDER: '5px solid cyan'
  }
};
