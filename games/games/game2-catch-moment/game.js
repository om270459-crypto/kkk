(function() {
  const heart = document.querySelector('.moving-bar');
  const btn = document.getElementById('catch-btn');
  const target = document.querySelector('.target-zone');
  
  let animationId;
  let time = 0;
  let running = true;
  
  // Sine wave movement for smoother "natural" feel
  // Position goes from 0 to 100.
  // We can use Math.sin wrapped to 0-1 range
  
  function animate() {
    if (!running) return;

    time += 0.03; // Speed
    // Normalize sin(-1 to 1) to (0 to 100)
    // 50 + 50 * sin(time)
    const position = 50 + 45 * Math.sin(time); // Keep slightly within bounds padding
    
    heart.style.left = position + '%';
    animationId = requestAnimationFrame(animate);
  }

  btn.addEventListener('click', () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(animationId);
    
    const heartRect = heart.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const heartCenter = heartRect.left + heartRect.width / 2;
    
    // Check overlap
    if (heartCenter >= targetRect.left && heartCenter <= targetRect.right) {
      heart.classList.add('caught');
      // Play ding sound if we had one.
      
      setTimeout(() => {
        window.showSuccess("Caught at the perfect moment!");
      }, 500);
    } else {
      heart.style.color = 'var(--error-color)';
      heart.style.animation = 'shake 0.5s';
      
      setTimeout(() => {
        window.showFail("Too fast! Or too slow... Timing is key.");
      }, 800);
    }
  });

  animate();
})();
