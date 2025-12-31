const GAMES = [
  '/games/games/game1-puzzle',
  '/games/games/game2-maze',
  '/games/games/game3-wheel',
  '/games/games/game4-rain',
  '/games/games/game5-trail',
  '/games/games/game6-orbit',
  '/games/games/game7-pulse',
  // Original 5 Games
  '/games/games/game1-memory',
  '/games/games/game2-catch-moment',
  '/games/games/game4-love-wheel',
  '/games/games/game5-hidden-message',
  '/games/games/game3-year-together'
];

let currentGameIndex = 0;
const gameRoot = document.getElementById('game-root');

// Dynamically load CSS
function loadCSS(path, id) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  link.id = id;
  document.head.appendChild(link);
}

// Ensure global CSS is loaded
const globalCSS = document.createElement('link');
globalCSS.rel = 'stylesheet';
globalCSS.href = '/games/core/global-games.css';
document.head.appendChild(globalCSS);

const overlayCSS = document.createElement('link');
overlayCSS.rel = 'stylesheet';
overlayCSS.href = '/games/core/overlay.css';
document.head.appendChild(overlayCSS);

// Preload the next game assets to ensure smooth transition
async function preloadGame(index) {
  if (index >= GAMES.length) return;
  const gamePath = GAMES[index];
  console.log(`Preloading game ${index}...`);
  try {
    fetch(`${gamePath}/index.html`);
    fetch(`${gamePath}/game.css`);
    fetch(`${gamePath}/media.css`); // Preload media css
    fetch(`${gamePath}/game.js?v=${Date.now()}`);
  } catch (e) {
    console.warn('Preload failed for', gamePath);
  }
}

async function loadGame(index) {
  if (index >= GAMES.length) {
    window.location.href = '/games/final.html';
    return;
  }
  
  // Clean up previous game styles/scripts if needed
  const oldCss = document.getElementById('current-game-css');
  if (oldCss) oldCss.remove();
  const oldMediaCss = document.getElementById('current-game-media-css');
  if (oldMediaCss) oldMediaCss.remove();
  
  const gamePath = GAMES[index];
  
  try {
    // Load HTML
    const response = await fetch(`${gamePath}/index.html`);
    const html = await response.text();
    gameRoot.innerHTML = html;
    
    // Load CSS
    loadCSS(`${gamePath}/game.css`, 'current-game-css');
    loadCSS(`${gamePath}/media.css`, 'current-game-media-css');
    
    // Load JS
    const script = document.createElement('script');
    script.src = `${gamePath}/game.js?v=${Date.now()}`; // bust cache
    gameRoot.appendChild(script);

    // Trigger preload for the next game
    preloadGame(index + 1);
    
  } catch (e) {
    console.error('Failed to load game:', e);
    gameRoot.innerHTML = '<p>Error loading game. Please refresh.</p>';
  }
}

// Exposed globally so overlay can call it
window.nextGame = function() {
  currentGameIndex++;
  loadGame(currentGameIndex);
};

window.retryGame = function() {
  loadGame(currentGameIndex);
};

// Start
loadGame(currentGameIndex);
