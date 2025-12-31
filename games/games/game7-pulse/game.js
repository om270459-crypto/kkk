(function() {
  const heart = document.getElementById('big-heart');
  const fill = document.getElementById('love-fill');
  const wrapper = document.querySelector('.pulse-wrapper');
  
  let score = 0;
  const target = 50; // 50 clicks/hovers
  let done = false;
  
  // Interaction
  function pump() {
    if (done) return;
    score++;
    
    // Update Meter
    const pct = Math.min((score / target) * 100, 100);
    fill.style.width = pct + '%';
    
    // Spawn particle
    spawnMiniHeart();
    
    // Speed up pulse
    if (score % 5 === 0) {
      const dur = 1.5 - (score/target);
      heart.style.animationDuration = Math.max(dur, 0.3) + 's';
    }
    
    if (score >= target) {
      done = true;
      explodeLove();
    }
  }
  
  function spawnMiniHeart() {
    const minih = document.createElement('i');
    minih.className = 'fa-solid fa-heart mini-heart';
    
    // Random position near center
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 50;
    
    minih.style.left = `calc(50% + ${x}px)`;
    minih.style.top = `calc(50% + ${y}px)`;
    
    wrapper.appendChild(minih);
    setTimeout(() => minih.remove(), 1000);
  }
  
  function explodeLove() {
    heart.style.animation = 'scaleUp 1s forwards';
    window.showSuccess("My heart is full because of you!");
    // The overlay 'Next' button will trigger nextGame, which loader handles as redirect since index > length
  }
  
  heart.addEventListener('mousedown', pump);
  heart.addEventListener('touchstart', (e) => { e.preventDefault(); pump(); });
})();
