# Clariflo

A browser-based aesthetic productivity dashboard inspired by Flocus, built with React, Vite, Tailwind CSS, Zustand, and Howler.js.

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Audio Assets Requirements

To enable the ambient soundscape and timer capabilities, Clariflo expects 14 specific `.mp3` files located in the `public/sounds/` directory.

You can download suitable alternatives from royalty-free sound providers like **Pixabay**.

### Place within `public/sounds/`:
- `rain-light.mp3`
- `rain-heavy.mp3`
- `rain-window.mp3`
- `fire-fireplace.mp3`
- `fire-campfire.mp3`
- `cafe-coffeeshop.mp3`
- `cafe-library.mp3`
- `focus-white.mp3`
- `focus-brown.mp3`
- `focus-fan.mp3`
- `nature-ocean.mp3`
- `nature-birds.mp3`
- `nature-wind.mp3`

### Place within `public/sounds/alerts/`:
- `chime.mp3` (Plays when the Pomodoro timer switches modes)
