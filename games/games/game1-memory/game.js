(function() {
  const cards = [
    { icon: 'fa-heart', id: 1 },
    { icon: 'fa-heart', id: 1 },
    { icon: 'fa-star', id: 2 },
    { icon: 'fa-star', id: 2 },
    { icon: 'fa-gem', id: 3 }, // Changed from infinity to gem for variety
    { icon: 'fa-gem', id: 3 },
    { icon: 'fa-gift', id: 4 },
    { icon: 'fa-gift', id: 4 }
  ];

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let matchesFound = 0;
  let moves = 0;
  const totalPairs = 4;

  const grid = document.querySelector('.memory-grid');
  const attemptsDisplay = document.getElementById('attempt-counter');

  function initGame() {
    grid.innerHTML = '';
    cards.sort(() => 0.5 - Math.random());
    
    cards.forEach((card, index) => {
      // Delay entrance animation for staggered memory effect
      setTimeout(() => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('memory-card');
        cardEl.dataset.id = card.id;
        
        cardEl.innerHTML = `
          <div class="front"><i class="fa-solid ${card.icon}"></i></div>
          <div class="back"></div>
        `;
        
        cardEl.addEventListener('click', flipCard);
        grid.appendChild(cardEl);
      }, index * 100);
    });
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    incrementAttempts();
    checkForMatch();
  }

  function incrementAttempts() {
    moves++;
    attemptsDisplay.textContent = moves;
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    lockBoard = true; // Temporary lock to prevent spam clicking during success anim
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    // Add visual success state
    setTimeout(() => {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      resetBoard();
    }, 500);

    matchesFound++;
    
    if (matchesFound === totalPairs) {
      setTimeout(() => {
        window.showSuccess(`You found them all in ${moves} moves!`);
      }, 1500);
    }
  }

  function unflipCards() {
    lockBoard = true;
    
    // Add shake effect
    setTimeout(() => {
      firstCard.classList.add('shake');
      secondCard.classList.add('shake');
    }, 400);

    setTimeout(() => {
      firstCard.classList.remove('flip', 'shake');
      secondCard.classList.remove('flip', 'shake');
      resetBoard();
    }, 1200);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  initGame();
})();
