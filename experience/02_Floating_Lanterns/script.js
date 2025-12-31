(function() { const run = async () => {
    const startTime = Date.now();
    
    // Audio
    const sounds = {
        bg: new Howl({ src: ['assets/wind_chimes.mp3'], loop: true, volume: 0.4 }),
        pop: new Howl({ src: ['assets/pop.mp3'], volume: 0.6 })
    };
    function enableAudio() { if(!sounds.bg.playing()) sounds.bg.play(); }
    document.body.addEventListener('click', enableAudio);



    // Vanta
    try { VANTA.FOG({ el: "#vanta-bg", highlightColor: 0xffc300, midtoneColor: 0xff6f00, lowlightColor: 0x87ceeb, baseColor: 0xffffff, blurFactor: 0.6, speed: 1.5, zoom: 0.8 }); } catch(e){}
    await tsParticles.load("tsparticles", { particles: { number: { value: 60 }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.8 }, size: { value: 3 }, move: { enable: true, speed: 1, direction: "bottom" } }, interactivity: { events: { onhover: { enable: false } } } });

    // V5 TIMELINE (Fast)
    const tl = gsap.timeline();
    const container = document.getElementById('lanterns-container');
    const intro = document.getElementById('intro-text');
    let spawning = true;

    // 0.25s: Fade in
    tl.to(intro, { opacity: 1, duration: 1 }, 0.25);

    // 1.5s: Spawn
    tl.call(() => {
        const intv = setInterval(() => {
            if(!spawning) { clearInterval(intv); return; }
            spawnLantern();
        }, 400); // Faster spawn
    }, null, 1.5);

    // 12.5s: Gather (was 25s)
    tl.call(() => { spawning = false; gatherAll(); }, null, 12.5);

    // 17.5s: Exit (was 35s)
    tl.to("body", { opacity: 0, duration: 2, delay: 3, onComplete: () => {
      if (window.Router) {
        window.Router.navigate("../02_to_03_Loading/index.html");
      } else {
        window.location.href = "../02_to_03_Loading/index.html";
      }
    }}, 17.5);

    const holidayIcons = ['fa-heart', 'fa-tree', 'fa-lightbulb', 'fa-star'];
    function spawnLantern() {
        const l = document.createElement('div');
        l.classList.add('lantern');
        l.style.left = (Math.random()*80+10)+'%'; l.style.bottom = '-100px';
        l.innerHTML = `<i class="fa-solid ${holidayIcons[Math.floor(Math.random()*holidayIcons.length)]}"></i>`;
        container.appendChild(l);
        
        gsap.to(l, { bottom: '120%', x: (Math.random()-0.5)*100, rotation: (Math.random()-0.5)*20, duration: 8+Math.random()*2, ease: "none", onComplete: ()=>l.remove() });

        // 4.0s: Hover
        l.addEventListener('mouseenter', () => gsap.to(l, { scale: 1.2, rotation: 15 }));

        // 7.5s: Click Burst
        l.addEventListener('click', (e) => {
            if(Date.now() - startTime < 7500) return; // Wait 7.5s
            sounds.pop.play();
            spawnText(e.clientX, e.clientY);
            gsap.to(l, { scale: 2, opacity: 0, duration: 0.3, onComplete: ()=>l.remove() });
        });
    }

    function spawnText(x, y) {
        const t = document.createElement('div');
        t.innerText = ["Hope", "Peace", "Joy"][Math.floor(Math.random()*3)];
        t.className = 'glass-panel'; // Add Glass Class
        t.style.position='absolute'; t.style.left=x+'px'; t.style.top=y+'px';
        t.style.color='#fff'; t.style.textShadow='0 0 10px gold'; t.style.fontSize='1.5rem'; t.style.pointerEvents='none'; t.style.zIndex=100;
        document.body.appendChild(t);
        anime({ targets: t, translateY: -50, opacity: [1, 0], duration: 1500, easing: 'easeOutExpo', complete: ()=>t.remove() });
    }

    function gatherAll() {
        gsap.to(intro, { opacity: 0, duration: 1 });
        const wrapper = document.createElement('div');
        wrapper.className = 'glass-panel';
        wrapper.style.cssText = "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:100; opacity:0;";
        
        const text = document.createElement('div');
        text.innerText = "Happy Holidays!";
        text.style.cssText = "font-size:3rem; color:#ffd700; text-shadow:0 0 30px #ff6f00; font-weight:bold;";
        
        wrapper.appendChild(text);
        document.body.appendChild(wrapper);
        gsap.to(wrapper, { opacity: 1, scale: 1.2, duration: 2, delay: 0.5, ease: 'elastic.out' });
    }
}; if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } })();
