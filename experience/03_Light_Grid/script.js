
(function() { const run = () => {
    // Setup
    const container = document.getElementById('grid-container');
    const cols = Math.ceil(window.innerWidth / 50);
    const rows = Math.ceil(window.innerHeight / 50);
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    const cells = [];
    for(let i=0; i<rows*cols; i++) {
        const div = document.createElement('div');
        div.classList.add('grid-cell');
        div.innerHTML = `<i class="fa-solid ${['fa-sleigh','fa-gift','fa-candy-cane'][Math.floor(Math.random()*3)]}"></i>`;
        container.appendChild(div);
        cells.push(div);
        div.addEventListener('mouseenter', () => ripple(i));
        div.addEventListener('click', () => ripple(i, true));
    }


    // Vanta Net
    try {
        VANTA.NET({
            el: "#vanta-net",
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.00, minWidth: 200.00,
            scale: 1.00, scaleMobile: 1.00,
            color: 0xffffff, backgroundColor: 0x000000, backgroundAlpha: 0.0, // Transparent BG to see Rainbow
            points: 10.00, maxDistance: 22.00, spacing: 18.00
        });
    } catch(e) {}

    // Timeline V5 (Fast)
    const start = Date.now();
    const events = new Set();
    
    // 0.25s: Fade In BG
    gsap.to(container, { opacity: 1, duration: 2, delay: 0.25 });
    
    function loop() {
        const elapsed = (Date.now() - start) / 1000;
        
        // 4.0s: Texts Enabled Check (Handled in ripple)
        if(elapsed > 4 && !events.has(4)) events.add(4);
        
        // 7.5s: Pulse
        if(elapsed > 7.5 && !events.has(7.5)) {
             document.body.style.animationDuration = "1.5s"; // Fast Pulse
             events.add(7.5);
        }

        // 12.5s: Waves
        if(elapsed > 12.5 && !events.has(12.5)) {
             events.add(12.5);
             let w = 0;
             const waveInt = setInterval(() => {
                 ripple(Math.floor(Math.random() * cells.length));
                 w++; if(w>5) clearInterval(waveInt);
             }, 300);
        }

        // 17.5s: Finale
        if(elapsed > 17.5 && !events.has(17.5)) { gather(); events.add(17.5); }

        // 20.0s: Button
        if(elapsed > 20 && !events.has(20)) { showBtn(); events.add(20); }

        requestAnimationFrame(loop);
    }
    loop();

    function ripple(index, force=false) {
        const origin = cells[index];
        origin.classList.add('active-cell');
        setTimeout(() => origin.classList.remove('active-cell'), 200);
        
        const r = Math.floor(index / cols); const c = index % cols;
        const targets = [];
        for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) {
            if(dr===0&&dc===0) continue;
            const nr=r+dr, nc=c+dc;
            if(nr>=0 && nr<rows && nc>=0 && nc<cols) targets.push(cells[nr*cols+nc]);
        }
        anime({ targets: targets, backgroundColor: ['rgba(0,0,0,0.85)', 'rgba(255,255,255,0.4)'], duration: 200, easing: 'linear' });

        // 4.0s Spawn Text
        if(force || (events.has(4) && Math.random()>0.85)) {
             const t = document.createElement('div');
             t.innerText = ["Joy", "Peace", "Happy Holidays"][Math.floor(Math.random()*3)];
             t.className = 'glass-panel';
             t.style.cssText = `position:absolute; left:${origin.getBoundingClientRect().left}px; top:${origin.getBoundingClientRect().top}px; color:white; font-weight:bold; pointer-events:none; z-index:100; font-size:1rem; padding:5px 10px;`;
             document.body.appendChild(t);
             anime({ targets: t, translateY: -60, opacity: [1,0], duration: 1000, complete:()=>t.remove() });
        }
    }

    function gather() {
        anime({
            targets: '.grid-cell',
            translateX: (el, i) => (cols/2 - (i%cols)) * 50,
            translateY: (el, i) => (rows/2 - Math.floor(i/cols)) * 50,
            scale: 0, opacity: 0, delay: anime.stagger(1, {grid: [cols, rows], from: 'center'}), duration: 2000
        });
        const msgWrap = document.getElementById('final-wrapper');
        msgWrap.classList.remove('hidden');
        anime({ targets: msgWrap, scale: [0, 1], opacity: [0, 1], delay: 1500, duration: 1500 });
    }

    function showBtn() {
        const btnWrap = document.getElementById('btn-wrapper');
        btnWrap.classList.remove('hidden');
        anime({ targets: btnWrap, translateY: [50, 0], opacity: [0, 1], duration: 1000 });
        document.getElementById('final-btn').onclick = () => {
          if (window.Router) {
            window.Router.navigate('massages.html');
          } else {
            window.location.href = 'massages.html';
          }
        };
    }
}; if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } })();

