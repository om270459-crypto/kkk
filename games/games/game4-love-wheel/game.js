(function() {
  const wheel = document.getElementById('love-wheel');
  const btn = document.getElementById('spin-btn');
  const pointer = document.querySelector('.pointer');
  
  let spinning = false;
  let currentRotation = 0;
  const friction = 0.985;
  let velocity = 0;
  
  function animate() {
    if (!spinning && velocity < 0.1) return;
    
    velocity *= friction;
    currentRotation += velocity;
    
    if (velocity < 0.1 && spinning) {
      spinning = false;
      finishSpin();
      return;
    }

    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    if (velocity > 2) {
      const wiggle = Math.sin(currentRotation * 0.5) * 5;
      pointer.style.transform = `translateX(-50%) rotate(${wiggle}deg)`;
    } else {
      pointer.style.transform = `translateX(-50%) rotate(0deg)`;
    }

    requestAnimationFrame(animate);
  }

  function finishSpin() {
    wheel.classList.remove('spinning');
    setTimeout(() => {
      window.showSuccess("Jackpot! My heart is yours forever.");
    }, 500);
  }

  btn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    wheel.classList.add('spinning');
    velocity = 30 + Math.random() * 20;
    animate();
  });
})();
