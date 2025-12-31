(function() {
  const board = document.getElementById('puzzle-board');
  const container = document.getElementById('pieces-container');
  
  // 3x3 Grid = 9 pieces
  const piecesData = [
    { id: 1, icon: 'fa-heart' },
    { id: 2, icon: 'fa-heart' },
    { id: 3, icon: 'fa-heart' },
    { id: 4, icon: 'fa-heart' },
    { id: 5, icon: 'fa-heart' }, // Center
    { id: 6, icon: 'fa-heart' },
    { id: 7, icon: 'fa-heart' },
    { id: 8, icon: 'fa-heart' },
    { id: 9, icon: 'fa-heart' }
  ];

  // Specific grid positions to make a "Heart" shape visually (simplified conceptual)
  // Actually, let's just use icons to form a pattern. 
  // 1 2 3
  // 4 5 6
  // 7 8 9
  // We'll require specific IDs to go to specific slots.

  let placedCount = 0;

  function init() {
    // Create Drop Zones
    for (let i = 1; i <= 9; i++) {
      const zone = document.createElement('div');
      zone.classList.add('drop-zone');
      zone.dataset.expectedId = i;
      
      // Drag Over
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('hovered');
      });

      // Drag Leave
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('hovered');
      });

      // Drop
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('hovered');
        const id = e.dataTransfer.getData('text/plain');
        
        // Check if empty and correct piece (or any piece? Let's say any order for now, or strict?)
        // Let's do strict order for a "Puzzle" challenge.
        if (zone.hasChildNodes()) return;

        if (id == zone.dataset.expectedId) {
          const piece = document.querySelector(`.puzzle-piece[data-id="${id}"]`);
          if (piece) {
            placePiece(piece, zone);
          }
        } else {
             // Optional: Shake feedback for wrong piece
        }
      });
      
      board.appendChild(zone);
    }

    // Create Pieces (Shuffled)
    piecesData.sort(() => Math.random() - 0.5);
    piecesData.forEach(data => {
      const p = document.createElement('div');
      p.classList.add('puzzle-piece');
      p.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
      p.draggable = true;
      p.dataset.id = data.id;
      
      // Visual distinction for middle/corners if we want complexity.
      // For now simple.

      p.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', data.id);
        setTimeout(() => p.style.opacity = '0.5', 0);
      });

      p.addEventListener('dragend', () => {
        p.style.opacity = '1';
      });
      
      // Touch support for mobile (basic custom drag)
      // Implementing full touch drag drop is complex in vanilla without libraries.
      // We'll click-to-select logic for mobile fallback if drag fails?
      // Or just stick to simple click-move logic which is safer.
      
      // Let's Add Click-Based Move support for accessibility/mobile
      p.addEventListener('click', () => {
        const selected = document.querySelector('.puzzle-piece.selected');
        if (selected) selected.classList.remove('selected');
        p.classList.add('selected');
        p.style.border = "2px solid white";
      });

      container.appendChild(p);
    });
    
    // Add Click listener to zones for "Tap to Place" (Mobile friendly)
    document.querySelectorAll('.drop-zone').forEach(zone => {
      zone.addEventListener('click', () => {
        const selected = document.querySelector('.puzzle-piece.selected');
        if (selected && !zone.hasChildNodes()) {
          if (selected.dataset.id == zone.dataset.expectedId) {
            placePiece(selected, zone);
          } else {
             // Wrong spot
             zone.style.animation = "shake 0.4s";
             setTimeout(()=> zone.style.animation = "", 400);
          }
        }
      });
    });
  }

  function placePiece(piece, zone) {
    zone.appendChild(piece);
    piece.classList.add('placed');
    piece.draggable = false;
    piece.classList.remove('selected');
    piece.style.border = "none";
    
    placedCount++;
    if (placedCount === 9) {
      setTimeout(() => {
        window.showSuccess("You made my heart whole!");
      }, 500);
    }
  }

  init();
})();
