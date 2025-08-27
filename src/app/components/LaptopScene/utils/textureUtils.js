import * as THREE from 'three';
import { FLOOR_CONFIG } from '../constants/config.js';

/**
 * Creates a grid texture for the floor
 * @returns {THREE.CanvasTexture} The grid texture
 */
export const createGridTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = FLOOR_CONFIG.TEXTURE_SIZE;
  canvas.height = FLOOR_CONFIG.TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.8;
  ctx.imageSmoothingEnabled = true;

  // Draw vertical lines
  for (let x = 0; x <= canvas.width; x += FLOOR_CONFIG.GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= canvas.height; y += FLOOR_CONFIG.GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(canvas.width, y + 0.5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(FLOOR_CONFIG.REPEAT, FLOOR_CONFIG.REPEAT);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  
  return texture;
};

/**
 * Creates a normal map for the floor
 * @returns {THREE.CanvasTexture} The normal map texture
 */
export const createNormalMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = FLOOR_CONFIG.TEXTURE_SIZE;
  canvas.height = FLOOR_CONFIG.TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');

  // Normal map base color
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid pattern for normal map
  ctx.strokeStyle = '#7070dd';
  ctx.lineWidth = 2;

  // Draw vertical lines
  for (let x = 0; x <= canvas.width; x += FLOOR_CONFIG.GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= canvas.height; y += FLOOR_CONFIG.GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const normalTexture = new THREE.CanvasTexture(canvas);
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set(FLOOR_CONFIG.REPEAT, FLOOR_CONFIG.REPEAT);
  normalTexture.needsUpdate = true;
  
  return normalTexture;
};

/**
 * Creates the floor material with textures
 * @returns {THREE.MeshStandardMaterial} The floor material
 */
export const createFloorMaterial = () => {
  const gridTexture = createGridTexture();
  const normalTexture = createNormalMap();
  
  return new THREE.MeshStandardMaterial({
    map: gridTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(
      FLOOR_CONFIG.MATERIAL.NORMAL_SCALE.x, 
      FLOOR_CONFIG.MATERIAL.NORMAL_SCALE.y
    ),
    roughness: FLOOR_CONFIG.MATERIAL.ROUGHNESS,
    metalness: FLOOR_CONFIG.MATERIAL.METALNESS,
    color: FLOOR_CONFIG.MATERIAL.COLOR,
  });
};
