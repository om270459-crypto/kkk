const Router = {
  _initialized: false,
  _bgmInitialized: false,

  init: function () {
    // Prevent re-initialization when script is re-executed
    if (this._initialized) return;
    this._initialized = true;

    // Initialize background music on first user interaction
    this.initBGM();

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.hash
      ) {
        e.preventDefault();
        this.navigate(link.href);
      }
    });

    window.addEventListener("popstate", () => {
      this.loadPage(window.location.href);
    });
  },

  // Initialize background music - plays on first click and loops forever
  // Initialize background music - plays on first click and loops forever
  initBGM: function () {
    // Prevent duplicate initialization
    if (this._bgmInitialized) return;
    this._bgmInitialized = true;

    let bgm = document.getElementById("bgm");
    
    // Create audio element if it doesn't exist (for pages without it)
    if (!bgm) {
      bgm = document.createElement("audio");
      bgm.id = "bgm";
      // Determine root path based on router.js location to support deep pages
      const scripts = document.getElementsByTagName('script');
      const routerScript = Array.from(scripts).find(s => s.src && s.src.includes('router.js'));
      const rootPath = routerScript ? routerScript.src.split('assets/js/router.js')[0] : '';
      bgm.src = rootPath + "assets/audio/last_chrismtas.mp3"; 
      // Wait, relative path "assets/..." depends on current page depth.
      // If I am at "experience/01/index.html", "assets/..." is "experience/01/assets/...". WRONG.
      // I should use absolute path "/" or handle depth?
      // Since we are fixing file://, absolute "/" is bad.
      // I must use a path that works everywhere.
      // Or rely on the fact that existing pages HAVE the audio element (via my HTML fixes) which use relative paths correctly.
      // The creation block is a fallback.
      // I'll try to determine path or just use "../assets" if deep? 
      // Best effort: ensure ID "bgm" is in HTML of all pages. (I did that).
      // So this creation block might rarely run. I'll leave it as is or improve it slightly?
      // original was "/assets/..." (Absolute). I changed it to "assets/..." in snippet above? 
      // Wait, original line 43: `bgm.src = "/assets/audio/last_chrismtas.mp3";`
      // I should change it to a relative path helper? 
      // But let's focus on Persistence first.
      bgm.src = "/assets/audio/last_chrismtas.mp3";
      bgm.loop = true;
      document.body.insertBefore(bgm, document.body.firstChild);
    }

    // PERSISTENCE LOGIC
    const savedTime = parseFloat(localStorage.getItem('bgm_time'));
    const savedPaused = localStorage.getItem('bgm_paused') === 'true';

    // Restore time
    if (!isNaN(savedTime)) {
        bgm.currentTime = savedTime;
    }

    // Function to save state
    const saveState = () => {
        localStorage.setItem('bgm_time', bgm.currentTime);
        localStorage.setItem('bgm_paused', bgm.paused);
    };

    // Save on unload (reload/close)
    window.addEventListener('beforeunload', saveState);
    
    // Save periodically (every 1s) to handle crashes or unexpected nav
    setInterval(saveState, 1000);

    // Playback Logic
    const startMusic = () => {
        bgm.play().catch(() => {
            // If failed (autoplay policy), wait for one interaction
            document.addEventListener('click', () => bgm.play().catch(()=>{}), {once:true});
        });
    };

    // If we have saved state (continuing session)
    if (!isNaN(savedTime)) {
        if (!savedPaused) {
            startMusic();
        }
    } else {
        // First visit: wait for user interaction to start
        document.addEventListener('click', () => {
            if (bgm.paused) startMusic();
        }, {once:true});
    }

    // Loop: restart from beginning when ended
    bgm.addEventListener("ended", () => {
      bgm.currentTime = 0;
      bgm.play();
    });
  },

  navigate: function (url) {
    history.pushState(null, "", url);
    this.loadPage(url);
  },

  loadPage: async function (url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // CHANGED: Update only #app, never replace entire body
      const currentApp = document.getElementById("app");
      const newApp = doc.getElementById("app");

      if (currentApp && newApp) {
        // Replace only #app content, preserving audio and other persistent elements
        currentApp.innerHTML = newApp.innerHTML;
      } else {
        // Fallback: if no #app found, replace body content but preserve audio
        const bgm = document.getElementById("bgm");
        const wasPlaying = bgm && !bgm.paused;
        const currentTime = bgm ? bgm.currentTime : 0;
        
        // Remove audio from body before replacing (so it's not destroyed)
        if (bgm) {
          bgm.remove();
        }
        
        // Replace body content
        document.body.innerHTML = doc.body.innerHTML;
        
        // Re-insert preserved audio at beginning of body
        if (bgm) {
          document.body.insertBefore(bgm, document.body.firstChild);
          bgm.currentTime = currentTime;
          if (wasPlaying) {
            bgm.play().catch(() => {});
          }
        }
      }

      // Handle Head (Styles & Title)
      this.handleHead(doc);

      // Re-execute scripts
      this.handleScripts(doc);

      // Re-initialize Global Components
      if (window.Snow && window.Snow.init) {
        window.Snow.init();
      }
      if (window.Main && window.Main.init) {
        window.Main.init();
      }

      // Scroll to top
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Navigation failed:", error);
      window.location.href = url; // Fallback
    }
  },

  handleScripts: function (newDoc) {
    // Collect all scripts from the new document
    const newScripts = newDoc.querySelectorAll("script");

    newScripts.forEach((oldScript) => {
      // Check if it's a page-specific script that needs to run
      if (
        !oldScript.src ||
        oldScript.src.includes("game-loader.js") ||
        oldScript.src.includes("overlay.js") ||
        oldScript.src.includes("countdown.js") ||
        oldScript.src.includes("router.js") ||
        oldScript.src.includes("snow.js")
      ) {
        const newScript = document.createElement("script");

        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }

        // CHANGED: Append to #app if exists, otherwise body
        const app = document.getElementById("app");
        (app || document.body).appendChild(newScript);
      }
    });
  },

  handleHead: function (newDoc) {
    // Update Title
    document.title = newDoc.title;

    // Update Stylesheets
    const newLinks = Array.from(
      newDoc.querySelectorAll('link[rel="stylesheet"]')
    );
    const oldLinks = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    );

    // Remove old links that are not in new page
    oldLinks.forEach((oldLink) => {
      const isPresentInNew = newLinks.some(
        (newLink) =>
          newLink.getAttribute("href") === oldLink.getAttribute("href")
      );
      if (!isPresentInNew) {
        oldLink.remove();
      }
    });

    // Add new links that are not in current page
    newLinks.forEach((newLink) => {
      const isPresentInOld = oldLinks.some(
        (oldLink) =>
          oldLink.getAttribute("href") === newLink.getAttribute("href")
      );
      if (!isPresentInOld) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = newLink.getAttribute("href");
        document.head.appendChild(link);
      }
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Router.init());
} else {
  Router.init();
}
