(function() { const run = () => {


    // Audio
    const clickSound = new Howl({ src: ['assets/final_click.mp3'], volume: 0.5 });
    document.getElementById('final-btn').addEventListener('click', (e) => { 
        e.preventDefault();
        clickSound.play();
        gsap.to('#final-btn', { scale: 0.9, duration: 0.1, yoyo: true });
        // Wait for sound or just brief delay
        setTimeout(() => {
            if (window.Router) {
                window.Router.navigate("../../massages/index.html");
            } else {
                window.location.href = "../../massages/index.html";
            }
        }, 500);
    });
}; if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } })();
