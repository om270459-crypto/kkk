function showOverlay(success, message) {
  let overlay = document.querySelector('.overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    // Append to game container to cover it perfectly
    const container = document.querySelector('.game-container');
    if (container) {
      container.appendChild(overlay);
    } else {
      // Fallback
      document.getElementById('game-root').appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="overlay-content">
        <i class="overlay-icon fa-solid"></i>
        <h3></h3>
        <p></p>
        <button class="btn"></button>
      </div>
    `;
  }

  const icon = overlay.querySelector('.overlay-icon');
  const title = overlay.querySelector('h3');
  const text = overlay.querySelector('p');
  const btn = overlay.querySelector('.btn');

  // Reset logic
  overlay.className = 'overlay';
  void overlay.offsetWidth; // Force reflow

  if (success) {
    overlay.classList.add('success');
    icon.className = 'overlay-icon fa-solid fa-heart'; // Default, will override
    
    // Fun random titles
    const titles = ["Wonderful!", "Amazing!", "Perfect!", "So Sweet!"];
    title.textContent = titles[Math.floor(Math.random() * titles.length)];
    text.textContent = message || "You did it perfectly!";
    
    btn.textContent = 'Next Memory';
    btn.innerHTML = 'Next Memory <i class="fa-solid fa-arrow-right" style="margin-left:8px"></i>';
    btn.onclick = () => {
      overlay.classList.remove('active');
      setTimeout(() => window.nextGame(), 300);
    };
  } else {
    overlay.classList.add('fail');
    icon.className = 'overlay-icon fa-solid fa-heart-crack';
    title.textContent = 'Oops!';
    text.textContent = message || 'Try again, love.';
    
    btn.textContent = 'Try Again';
    btn.innerHTML = '<i class="fa-solid fa-rotate-left" style="margin-right:8px"></i> Try Again';
    btn.onclick = () => {
      overlay.classList.remove('active');
      setTimeout(() => window.retryGame(), 300);
    };
  }

  // Delay slightly for effect
  setTimeout(() => {
    overlay.classList.add('active');
  }, 100);
}

window.showSuccess = (msg) => showOverlay(true, msg);
window.showFail = (msg) => showOverlay(false, msg);
