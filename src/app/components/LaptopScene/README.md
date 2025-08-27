# Laptop Scene Component

A modular, well-structured 3D laptop scene component built with Three.js and React.

## Structure

```
LaptopScene/
├── constants/
│   └── config.js              # Configuration constants
├── hooks/
│   ├── useAnimation.js        # Camera animation and interactions
│   ├── useCSS3DRenderer.js    # CSS3D renderer management
│   ├── useSceneSetup.js       # Three.js scene setup
│   └── useScreenManager.js    # Screen content management
├── components/
│   ├── ScreenComponents.jsx   # Screen UI components
│   ├── DebugPanel.jsx         # Debug interface
│   └── ScrollIndicator.jsx    # Scroll progress indicator
├── utils/
│   └── textureUtils.js        # Texture creation utilities
├── LaptopSpotlightScene.js    # Main orchestrator component
├── index.js                   # Export file
└── README.md                  # This file
```

## Components

### Main Component
- **`LaptopSpotlightScene.js`** - The main orchestrator that coordinates all other pieces

### Hooks
- **`useSceneSetup`** - Manages Three.js scene, camera, renderer, lighting, and floor setup
- **`useCSS3DRenderer`** - Handles CSS3D renderer setup and screen element creation
- **`useAnimation`** - Manages camera animation, mouse movement, and scroll interactions
- **`useScreenManager`** - Handles React component rendering on the laptop screen

### UI Components
- **`ScreenComponents`** - Collection of React components that can be rendered on the laptop screen:
  - `Desktop` - Main welcome screen
  - `App` - Dashboard interface
  - `Browser` - Web browser simulation
- **`DebugPanel`** - Development debug interface
- **`ScrollIndicator`** - Scroll progress display

### Utilities
- **`textureUtils`** - Functions for creating grid textures and materials
- **`config`** - Centralized configuration constants

## Usage

```jsx
import { LaptopSpotlightScene } from './components/LaptopScene';

function App() {
  return <LaptopSpotlightScene />;
}
```

## Features

- **3D Laptop Model** - Renders a realistic laptop model with proper lighting
- **Interactive Screen** - React components rendered directly on the laptop screen
- **Smooth Animations** - Camera movement based on mouse and scroll input
- **Modular Architecture** - Clean separation of concerns with custom hooks
- **Debug Tools** - Built-in debugging interface for development
- **Fallback Support** - Graceful degradation when 3D features aren't available

## Configuration

All configuration is centralized in `constants/config.js`:

- Camera settings (FOV, position, animation)
- Lighting configuration
- Screen positioning and scaling
- Floor texture settings
- Model loading paths

## Adding New Screen Components

1. Add your component to `components/ScreenComponents.jsx`
2. Export it from the `ScreenComponents` object
3. The component will automatically be available for rendering

Example:
```jsx
export const MyNewComponent = ({ onNavigate }) => (
  <div style={{ /* your styles */ }}>
    <h1>My New Component</h1>
    <button onClick={() => onNavigate('desktop')}>
      Back to Desktop
    </button>
  </div>
);

export const ScreenComponents = {
  desktop: Desktop,
  app: App,
  browser: Browser,
  myNewComponent: MyNewComponent  // Add here
};
```

## Development

The component includes comprehensive debugging tools:
- Real-time status indicators
- Error logging
- Force update capabilities
- Scroll progress tracking

## Performance

- Efficient Three.js resource management
- Proper cleanup on unmount
- Optimized animation loops
- Lazy loading of heavy dependencies
