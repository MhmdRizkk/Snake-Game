# Snake Nexus

A classic Snake game with a futuristic neon UI.

## Features

- Classic Snake gameplay loop
- Score tracking
- Game over detection
- Pause/Resume and Restart controls
- Keyboard controls (Arrow keys / WASD)
- Mobile on-screen controls

## Tech

- Vanilla HTML, CSS, JavaScript
- Pure game logic module with lightweight tests

## Run locally

1. Install Node.js (if not installed).
2. From the project root:

```bash
npm run dev
```

3. Open:

`http://localhost:5173`

## Run tests

```bash
npm test
```

## Controls

- Move: Arrow keys or `W A S D`
- Pause/Resume: `Space`
- Restart: `R` or Restart button

## Manual verification checklist

- Snake movement works correctly
- Food spawns and score increments
- Wall/body collision triggers game over
- Restart works from HUD and overlay
- UI renders correctly on desktop and mobile
