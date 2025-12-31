(function() { const run = async () => {
    await tsParticles.load("tsparticles", {
        particles: {
            number: { value: 50 }, color: { value: ["#ffffff", "#ffd700"] },
            shape: { type: ["circle", "square"] },
            opacity: { value: 0.6, random: true },
            size: { value: 3 }, move: { enable: true, speed: 2, direction: "bottom" }
        },
        interactivity: { events: { onhover: { enable: false } } }
    });

    gsap.to(".progress-bar-fill", { width: "100%", duration: 2.5, ease: "linear" }); // Fast

    setTimeout(() => {
        gsap.to(".container", { opacity: 0, scale: 0.9, duration: 0.5, onComplete: () => {
          if (window.Router) {
            window.Router.navigate("../03_Light_Grid/index.html");
          } else {
            window.location.href = "../03_Light_Grid/index.html";
          }
        }});
    }, 2500);
}; if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } })();
