(function() {
  const box = document.getElementById('hidden-msg');
  const lockScreen = document.querySelector('.lock-layer');
  const lockIcon = document.getElementById('lock-icon');
  const ring = document.querySelector('.lock-ring');
  const btn = document.getElementById('reveal-btn');
  
  let unlocked = false;

  btn.addEventListener('click', () => {
    if (unlocked) return;
    unlocked = true;
    
    // 1. Animate Lock opening
    lockIcon.className = 'fa-solid fa-lock-open';
    lockIcon.style.color = 'var(--accent-color)';
    lockIcon.style.transform = 'scale(1.2) rotate(-10deg)';
    
    // Stop ring spin and expand it
    ring.style.animation = 'none';
    ring.style.transform = 'scale(2)';
    ring.style.opacity = '0';
    ring.style.transition = 'all 0.5s ease';

    // 2. Fade out overlay and reveal text
    setTimeout(() => {
      box.classList.add('unlocked');
      
      // 3. Final success message after reading time
      setTimeout(() => {
        window.showSuccess("My heart is an open book for you.");
      }, 30000);  
    }, 600);
  });
})();
