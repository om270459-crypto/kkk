(function() { const run = async () => {
    // 1. Audio
    const sounds = {
        bgm: new Howl({ src: ['assets/space_drone.mp3'], loop: true, volume: 0.3 }),
        boom: new Howl({ src: ['assets/firework_boom.mp3'], volume: 0.5 })
    };
    function enableAudio() { if(Howler.ctx.state === 'suspended') Howler.ctx.resume(); if(!sounds.bgm.playing()) sounds.bgm.play(); }
    document.body.addEventListener('click', enableAudio);
    


    // 3. Particles
    await tsParticles.load("tsparticles", {
        background: { color: { value: "transparent" } },
        particles: {
            number: { value: 120 }, color: { value: "#ffffff" },
            shape: { type: "star" }, opacity: { value: 0.8 },
            size: { value: 2, random: true }, move: { enable: true, speed: 0.1, direction: "none", random: true, out_mode: "out" }
        },
        interactivity: { events: { onhover: { enable: false } } }
    });

    // 4. TIMELINE V5 (Halved)
    const tl = gsap.timeline();
    const introWrap = document.getElementById('intro-wrapper');
    const joyWrap = document.getElementById('joy-wrapper');
    let act = false;

    // 0.25s: Fade-in Text (Glass)
    tl.to(introWrap, { autoAlpha: 1, scale: 1.1, duration: 1, ease: "power2.out" }, 0.25);

    // 1.5s: Interaction Enable
    tl.call(() => { act = true; }, null, 1.5);

    // 4.0s: Floating "Joy!"
    tl.to(introWrap, { autoAlpha: 0, duration: 0.5 }, 3.5)
      .call(() => {
          gsap.set(joyWrap, { autoAlpha: 1 });
          anime({
              targets: '#joy-wrapper', translateY: [-20, 20], rotate: [-5, 5], opacity: [0, 1, 0.8],
              duration: 2000, direction: 'alternate', loop: true, easing: 'easeInOutSine'
          });
      }, null, 4.0);

    // 7.5s: Auto Fireworks Loop
    tl.call(() => {
        setInterval(() => {
            if(!act) return;
            const x = Math.random(); const y = Math.random() * 0.5;
            confetti({ particleCount: 50, spread: 70, origin: { x, y }, colors: ['#ffffff', '#ff0000', '#00ff00'] }); 
            if(Math.random()>0.5) sounds.boom.play();
        }, 2500); // Faster loop
    }, null, 7.5);

    // 17.5s: Finale Exit
    tl.call(() => {
        act = false;
        confetti({ particleCount: 300, spread: 180, origin: { y: 0.6 }, shapes: ['star'] });
        sounds.boom.play();
        gsap.to("body", { opacity: 0, duration: 2, delay: 1, onComplete: () => {
          if (window.Router) {
            window.Router.navigate("../01_to_02_Loading/index.html");
          } else {
            window.location.href = "../01_to_02_Loading/index.html";
          }
        }});
    }, null, 17.5);


    // INTERACTION LOGIC
    const icons = ['fa-star', 'fa-bell', 'fa-snowflake'];
    window.addEventListener('pointerdown', (e) => {
        enableAudio();
        if(!act) return;

        // Visual Feedback
        const i = document.createElement('i');
        i.className = `fa-solid ${icons[Math.floor(Math.random()*icons.length)]}`;
        i.style.cssText = `position:absolute; left:${e.clientX}px; top:${e.clientY}px; color:white; font-size:2rem; pointer-events:none; z-index:50;`;
        document.body.appendChild(i);
        gsap.to(i, { y: -100, x:(Math.random()-0.5)*60, opacity:0, duration:0.5, onComplete:()=>i.remove() });
        confetti({ particleCount: 20, spread: 40, origin: { x: e.clientX/window.innerWidth, y: e.clientY/window.innerHeight } });

        // Ripple (12.5s logic)
        const rip = document.createElement('div');
        rip.classList.add('ripple');
        rip.style.left = e.clientX+'px'; rip.style.top = e.clientY+'px';
        document.body.appendChild(rip);
        gsap.fromTo(rip, {width:0,height:0,opacity:0.8}, {width:1500,height:1500,opacity:0,duration:1.5, ease:"power2.out", onComplete:()=>rip.remove()});
    });
}; if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } })();
