(function() {
  const gridEl = document.getElementById('maze-grid');
  const size = 10;
  
  // 1 = Wall, 0 = Path, 2 = Player Start, 3 = Goal
  const map = [
    [2,0,1,0,0,0,1,0,0,0],
    [0,0,1,0,1,0,1,0,1,0],
    [0,0,0,0,1,0,0,0,1,0],
    [1,1,1,0,1,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,0,1,1,1],
    [0,0,0,0,0,1,0,0,0,0],
    [1,0,1,1,0,1,1,1,1,0],
    [1,0,0,1,0,0,0,0,0,0],
    [1,1,0,1,1,1,1,0,1,3]
  ];
  
  let playerPos = {x: 0, y: 0};
  
  function render() {
    gridEl.innerHTML = '';
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        if (map[y][x] === 1) cell.classList.add('wall');
        if (map[y][x] === 3) {
           cell.classList.add('goal');
           cell.innerHTML = '<i class="fa-solid fa-house-heart"></i>';
        }
        
        if (x === playerPos.x && y === playerPos.y) {
          cell.classList.add('player');
          cell.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
        
        gridEl.appendChild(cell);
      }
    }
  }
  
  function move(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    // Bounds check
    if (newX < 0 || newX >= size || newY < 0 || newY >= size) return;
    
    // Wall check
    if (map[newY][newX] === 1) return;
    
    playerPos = {x: newX, y: newY};
    render();
    
    // Goal check
    if (map[newY][newX] === 3) {
      setTimeout(() => {
        window.showSuccess("You navigated the path to my heart!");
      }, 200);
    }
  }
  
  // Keyboard Controls
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowUp': move(0, -1); break;
      case 'ArrowDown': move(0, 1); break;
      case 'ArrowLeft': move(-1, 0); break;
      case 'ArrowRight': move(1, 0); break;
    }
  });

  // Touch/Swipe Controls (Simple tap quadrants)
  gridEl.addEventListener('click', (e) => {
    const rect = gridEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX;
    const y = e.clientY;
    
    if (Math.abs(x - centerX) > Math.abs(y - centerY)) {
      // Horizontal
      if (x > centerX) move(1, 0); else move(-1, 0);
    } else {
      // Vertical
      if (y > centerY) move(0, 1); else move(0, -1);
    }
  });

  // Find start
  for(let y=0; y<size; y++) {
    for(let x=0; x<size; x++) {
      if(map[y][x] === 2) playerPos = {x, y};
    }
  }
  
  render();
})();
