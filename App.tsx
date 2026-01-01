import React, { useState } from 'react';
import FluxCanvas from './components/FluxCanvas';
import HUD from './components/HUD';
import { Theme, RenderMode } from './types';

const THEMES: Theme[] = [
  {
    name: 'CYBER_PUNK',
    primary: '#06b6d4', // Cyan
    secondary: '#d946ef', // Fuchsia
    bg: '#000000',
    accent: '#22d3ee'
  },
  {
    name: 'THE_MATRIX',
    primary: '#22c55e', // Green
    secondary: '#15803d', // Dark Green
    bg: '#020617',
    accent: '#4ade80'
  },
  {
    name: 'DEEP_SPACE',
    primary: '#818cf8', // Indigo
    secondary: '#6366f1', // Indigo Dark
    bg: '#0f172a',
    accent: '#a5b4fc'
  },
  {
    name: 'GOLDEN_HOUR',
    primary: '#f59e0b', // Amber
    secondary: '#ef4444', // Red
    bg: '#1c1917',
    accent: '#fbbf24'
  },
  {
    name: 'CRIMSON_TIDE',
    primary: '#f43f5e', // Rose
    secondary: '#9f1239', // Dark Rose
    bg: '#0f0505',
    accent: '#fb7185'
  }
];

const App: React.FC = () => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [renderMode, setRenderMode] = useState<RenderMode>(RenderMode.MESH);

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  const cycleRenderMode = () => {
    setRenderMode((prev) => {
      if (prev === RenderMode.NET) return RenderMode.MESH;
      if (prev === RenderMode.MESH) return RenderMode.PARTICLES;
      return RenderMode.NET;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      <div className="scanlines"></div>
      <FluxCanvas theme={THEMES[themeIndex]} renderMode={renderMode} />
      <HUD 
        theme={THEMES[themeIndex]} 
        renderMode={renderMode}
        onCycleTheme={cycleTheme} 
        onToggleMode={cycleRenderMode}
      />
    </div>
  );
};

export default App;