(function() {
  const steps = document.querySelectorAll('.timeline-step');
  const indicator = document.getElementById('step-indicator');
  let currentStep = 0;
  const total = steps.length;

  const stepsData = [
    { icon: 'fa-heart', title: 'Start of Us', text: 'That first day at the cafe...' },
    { icon: 'fa-laugh-beam', title: 'First Laugh', text: 'When you spilled the coffee...' },
    { icon: 'fa-infinity', title: 'Forever', text: 'Every moment since has been a gift.' }
  ];

  function updateIndicator() {
    indicator.textContent = `Step ${currentStep + 1} of ${total}`;
  }

  steps.forEach((step, index) => {
    step.addEventListener('click', function() {
      // Must click in order
      if (index !== currentStep) {
        if (index > currentStep) {
          this.style.animation = 'shake 0.4s';
          setTimeout(() => this.style.animation = '', 400);
        }
        return;
      }
      
      unlockStep(this, index);
    });
  });

  function unlockStep(element, index) {
    if (element.classList.contains('active')) return;

    element.classList.remove('locked');
    element.classList.add('active');
    
    // Update content
    const data = stepsData[index];
    const markerIcon = element.querySelector('.marker i');
    const title = element.querySelector('h3');
    const p = element.querySelector('p');
    
    markerIcon.className = `fa-solid ${data.icon}`;
    
    if (index > 0) {
      title.textContent = data.title;
      p.textContent = data.text;
    }
    
    currentStep++;
    // Indicator might show "4 of 3" if we increment beyond, so clamp or leave as completed state
    if (currentStep < total) updateIndicator();
    else indicator.textContent = "Completed!";
    
    if (currentStep < total) {
      const next = steps[currentStep];
      next.classList.remove('locked');
      next.querySelector('.marker i').className = 'fa-solid fa-lock-open';
      next.querySelector('.timeline-content p').textContent = "Tap to reveal...";
      
      next.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTimeout(() => {
        window.showSuccess("Every step with you is a blessing.");
      }, 1000);
    }
  }
  
  updateIndicator();
})();
