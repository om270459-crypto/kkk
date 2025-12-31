(function() {
  const area = document.getElementById('trail-area');
  let count = 0;
  const target = 150; // Stars to create
  let done = false;

  function createStar(x, y) {
    if (done) return;
    
    const star = document.createElement('i');
    star.className = 'fa-solid fa-star star';
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    
    // Variation
    star.style.fontSize = (8 + Math.random() * 12) + 'px';
    star.style.color = Math.random() > 0.8 ? '#ff4d6d' : '#ffd700';
    
    area.appendChild(star);
    
    // Cleanup
    setTimeout(() => star.remove(), 1500);
    
    // Goal check
    count++;
    if (count > target) {
      done = true;
      window.showSuccess("You light up my world!");
    }
  }

  // Mouse
  area.addEventListener('mousemove', (e) => {
    const rect = area.getBoundingClientRect();
    createStar(e.clientX - rect.left, e.clientY - rect.top);
  });
  
  // Touch
  area.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = area.getBoundingClientRect();
    const touch = e.touches[0];
    createStar(touch.clientX - rect.left, touch.clientY - rect.top);
  });
})();
