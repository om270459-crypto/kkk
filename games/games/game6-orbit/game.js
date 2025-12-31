(function() {
  const btn = document.getElementById('orbit-action-btn');
  const path = document.querySelector('.orbit-path');
  const orbiter = document.querySelector('.orbiter');
  const scoreEl = document.getElementById('orbit-score');
  
  let score = 0;
  const target = 3;
  
  btn.addEventListener('click', checkAlign);
  
  function checkAlign() {
    // We can compute rotation angle or check screen positions
    // Simple way: get bounding rects
    const orbRect = orbiter.getBoundingClientRect();
    const sysRect = document.querySelector('.orbit-system').getBoundingClientRect();
    
    // Target is 'Top' center of system.
    const targetX = sysRect.left + sysRect.width / 2;
    const targetY = sysRect.top; // Top edge
    
    const orbX = orbRect.left + orbRect.width / 2;
    const orbY = orbRect.top + orbRect.height / 2;
    
    const dist = Math.hypot(orbX - targetX, orbY - targetY);
    
    // Allow tolerance (orbit radius 125, so we need to be close to top)
    if (dist < 30) {
      // Hit
      score++;
      scoreEl.textContent = score;
      
      // Visual feedback
      orbiter.style.background = '#fff';
      setTimeout(() => orbiter.style.background = 'var(--accent-color)', 200);
      
      // Speed up?
      path.style.animationDuration = (3 - score*0.5) + 's';
      
      if (score >= target) {
        path.style.animationPlayState = 'paused';
        setTimeout(() => window.showSuccess("Our orbits are perfectly aligned."), 300);
      }
    } else {
      // Miss
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 400);
    }
  }
})();
