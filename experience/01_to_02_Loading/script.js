(function() { const run = async () => {
    await tsParticles.load("tsparticles", {
        particles: {
            number: { value: 40 }, color: { value: "#ffffff" },
            opacity: { value: 0.6, random: true },
            size: { value: 2 }, move: { enable: true, speed: 2, direction: "bottom" }
        },
        interactivity: { events: { onhover: { enable: false } } }
    });

    gsap.to(".progress-bar-fill", { width: "100%", duration: 2.5, ease: "linear" }); // Fast 2.5s
    gsap.to("h1", { opacity: 0.5, duration: 0.4, yoyo: true, repeat: -1 });

    setTimeout(() => {
        gsap.to(".container", { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
          if (window.Router) {
            window.Router.navigate("../02_Floating_Lanterns/index.html");
          } else {
            window.location.href = "../02_Floating_Lanterns/index.html";
          }
        }});
    }, 2500);
}; if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } })();
