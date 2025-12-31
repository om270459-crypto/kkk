(function() {
  const sky = document.getElementById('sky');
  const scoreEl = document.getElementById('score');
  
  let score = 0;
  const target = 10;
  let isActive = true;
  let spawnRate = 800;
  let lastSpawn = 0;
  
  // Array to track hearts if we wanted JS logic, but DOM elements + CSS animation or JS animation?
  // Let's use JS for position updates for smoother "game" feel vs CSS keyframes which are harder to interact with consistently?
  // Actually pure JS loop is best for "Catching".
  
  const hearts = [];
  
  function createHeart() {
    const h = document.createElement('div');
    h.classList.add('falling-heart');
    h.innerHTML = '<i class="fa-solid fa-heart"></i>';
    h.style.left = Math.random() * (sky.offsetWidth - 30) + 'px';
    h.style.top = '-30px';
    
    // Random speed
    const speed = 2 + Math.random() * 3;
    
    sky.appendChild(h);
    
    // Add Click Listener
    h.addEventListener('mousedown', () => catchHeart(h, obj));
    h.addEventListener('touchstart', () => catchHeart(h, obj)); // Mobile
    
    const obj = { el: h, speed: speed, active: true };
    hearts.push(obj);
  }
  
  function catchHeart(el, obj) {
    if(!obj.active) return;
    obj.active = false;
    
    score++;
    scoreEl.textContent = score;
    el.classList.add('caught');
    
    if (score >= target) {
      winGame();
    }
  }
  
  function winGame() {
    isActive = false;
    setTimeout(() => {
      window.showSuccess("You caught all my love!");
    }, 500);
  }

  function gameLoop(timestamp) {
    if (!isActive) return;
    
    // Spawn
    if (timestamp - lastSpawn > spawnRate) {
      createHeart();
      lastSpawn = timestamp;
      if (spawnRate > 300) spawnRate -= 10; // Get harder
    }
    
    // Update positions
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      if (!h.active && h.el.parentNode) {
         // It's caught and animating out, ignore logic
         if(h.el.classList.contains('caught') && getComputedStyle(h.el).opacity == 0) {
            h.el.remove();
            hearts.splice(i, 1);
         }
         continue;
      }
      
      let top = parseFloat(h.el.style.top);
      top += h.speed;
      h.el.style.top = top + 'px';
      
      // Remove if falls off screen
      if (top > sky.offsetHeight) {
        h.el.remove();
        hearts.splice(i, 1);
      }
    }
    
    requestAnimationFrame(gameLoop);
  }
  
  requestAnimationFrame(gameLoop);
})();
