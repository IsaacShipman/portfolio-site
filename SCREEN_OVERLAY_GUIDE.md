# Dynamic Screen Overlay System

This document explains how the new dynamic screen overlay system works and how to use it effectively.

## Overview

The dynamic screen overlay system automatically calculates the correct position, size, and orientation of React components to fit perfectly on the laptop screen in the 3D scene. This system works with any laptop model and automatically adapts to browser window resizing.

## Key Features

- **Model-Agnostic**: Works with any laptop model (macbook_dark.glb, macbook_pro_2021.glb, etc.)
- **Responsive**: Automatically adjusts when the browser window is resized
- **Calibrated**: Uses precise screen corner coordinates for accurate positioning
- **Real-time**: Updates position and orientation in real-time as the camera moves
- **Flexible**: Easy to add new overlay components

## How It Works

### 1. Screen Calibration
The system uses calibrated screen corner coordinates to determine the exact position and size of the laptop screen in 3D space:

```javascript
const screenCorners = {
  topLeft: { x: -0.195, y: 0.125, z: 0.01 },
  topRight: { x: 0.195, y: 0.125, z: 0.01 },
  bottomLeft: { x: -0.195, y: -0.02, z: 0.01 },
  bottomRight: { x: 0.195, y: -0.02, z: 0.01 }
};
```

### 2. Dynamic Calculation
The system calculates the screen position in real-time by:
- Projecting 3D screen corners to 2D screen coordinates
- Calculating the appropriate scale based on camera distance and FOV
- Determining rotation to match the laptop screen orientation

### 3. CSS Transform Application
The calculated position, scale, and rotation are applied as CSS transforms to position the React overlay exactly on the laptop screen.

## Components

### BaseScreenOverlay
The base component that handles all the dynamic positioning logic. All screen overlays should extend this component.

### DynamicBootupOverlay
A bootup screen overlay that displays during the startup sequence.

### DynamicHomeScreen
The main home screen overlay that displays the PDF viewer.

## Usage

### Basic Usage
```javascript
import { DynamicBootupOverlay, DynamicHomeScreen } from './ScreenOverlay';

// In your component
{showBootup && (
  <DynamicBootupOverlay 
    sceneRefs={sceneRefs}
    currentModel={currentModel}
    onClose={handleCloseOverlay}
  />
)}

{showHomeScreen && (
  <DynamicHomeScreen 
    sceneRefs={sceneRefs}
    currentModel={currentModel}
    onClose={handleCloseOverlay}
  />
)}
```

### Creating Custom Overlays
To create a custom overlay, extend the BaseScreenOverlay component:

```javascript
function CustomOverlay({ onClose, sceneRefs, currentModel }) {
  return (
    <BaseScreenOverlay onClose={onClose} sceneRefs={sceneRefs} currentModel={currentModel}>
      <div className="w-full h-full p-4">
        <h1>Your Custom Content</h1>
        <p>This will be positioned perfectly on the laptop screen!</p>
      </div>
    </BaseScreenOverlay>
  );
}
```

## Model Configuration

### Adding New Models
To add support for a new laptop model:

1. Add the model configuration to `DEFAULT_SCREEN_CONFIGS` in `ScreenOverlay.js`:

```javascript
const DEFAULT_SCREEN_CONFIGS = {
  'your_new_model.glb': {
    topLeft: { x: -0.18, y: 0.11, z: 0.015 },
    topRight: { x: 0.18, y: 0.11, z: 0.015 },
    bottomLeft: { x: -0.18, y: -0.015, z: 0.015 },
    bottomRight: { x: 0.18, y: -0.015, z: 0.015 }
  }
};
```

2. Add the model configuration to `modelConfigs` in `macbookscene.js`:

```javascript
const modelConfigs = {
  'your_new_model.glb': {
    rotation: [0, 0, 0],
    position: [0, -0.1, 0],
    scale: [1, 1, 1]
  }
};
```

### Calibrating Screen Corners
Use the calibration panel to fine-tune screen corner positions:

1. Enable calibration mode
2. Adjust the corner positions using the sliders
3. The overlays will update in real-time
4. Save the calibrated positions for future use

## Debugging

### Console Functions
Several debug functions are available in the browser console:

- `debugScreenPosition()`: Logs current screen position data
- `testOverlays()`: Manually triggers the overlay sequence
- `switchLaptopModel('model_name.glb')`: Switches to a different laptop model
- `addScreenCalibration()`: Shows calibration markers
- `removeScreenCalibration()`: Hides calibration markers

### Common Issues

1. **Overlay not appearing**: Check that `sceneRefs.current.screenCorners` is properly set
2. **Wrong position**: Use the calibration panel to adjust screen corners
3. **Wrong size**: Adjust the `cssScale` value in `calculateScreenTransform`
4. **Performance issues**: The system uses `requestAnimationFrame` for smooth updates

## Performance Considerations

- The system updates the overlay position every frame (60fps)
- CSS transforms are hardware-accelerated for smooth performance
- The calculation is lightweight and shouldn't impact performance significantly
- Consider throttling updates if performance becomes an issue

## Browser Compatibility

The system uses modern CSS features and should work in all modern browsers:
- CSS transforms
- requestAnimationFrame
- ES6+ JavaScript features

## Future Enhancements

Potential improvements to consider:
- Support for multiple screens (dual monitors)
- Dynamic content scaling based on screen size
- Touch interaction support for mobile devices
- Animation easing for smoother transitions
- Support for different aspect ratios
