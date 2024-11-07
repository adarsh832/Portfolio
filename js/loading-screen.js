document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
        // First visit - show loading screen
        loadingScreen.style.display = 'flex';
        
        const welcomeText = document.querySelector('.welcome-text');
        const loadingMessage = document.querySelector('.loading-message');
        const progress = document.querySelector('.progress');
        
        // Create animated background circles
        const circleBg = document.createElement('div');
        circleBg.className = 'circle-bg';
        loadingScreen.appendChild(circleBg);

        // Add multiple circles
        for (let i = 0; i < 10; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.style.width = Math.random() * 100 + 50 + 'px';
            circle.style.height = circle.style.width;
            circle.style.left = Math.random() * 100 + '%';
            circle.style.top = Math.random() * 100 + '%';
            circle.style.animationDelay = Math.random() * 2 + 's';
            circleBg.appendChild(circle);
        }
        
        // Update spinner HTML
        const spinner = document.querySelector('.loading-spinner');
        spinner.innerHTML = `
            <div class="spinner-inner"></div>
            <div class="spinner-center">
                <i class="fas fa-code"></i>
            </div>
        `;

        // Update the timing sequence
        setTimeout(() => {
            welcomeText.classList.add('fade-in');
            setTimeout(() => {
                welcomeText.classList.add('typing-start');
            }, 800);
            loadingMessage.classList.add('fade-in-delay-1');
        }, 100);

        // Fun loading messages
        const messages = [
            "Brewing some code magic... ✨",
            "Gathering awesome projects... 🚀",
            "Polishing pixels to perfection... 💫",
            "Loading cool animations... 🎨",
            "Connecting neural networks... 🧠",
            "Debugging the universe... 🌌",
            "Compiling awesomeness... 🎯",
            "Generating random excuses... 😅",
            "Mining some cryptocode... ⛏️",
            "Downloading more RAM... 💾"
        ];

        // Simulate loading progress
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    document.body.style.overflow = '';
                    // Set visited flag in localStorage
                    localStorage.setItem('hasVisited', 'true');
                }, 500);
            } else {
                const increment = Math.random() * 2 + 0.5;
                width = Math.min(width + increment, 100);
                progress.style.width = width + '%';
            }
        }, 50);

        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';

        // Change loading message with fade effect
        let messageIndex = 0;
        const changeMessage = () => {
            if (width < 100) {
                loadingMessage.style.opacity = 0;
                setTimeout(() => {
                    messageIndex = (messageIndex + 1) % messages.length;
                    loadingMessage.textContent = messages[messageIndex];
                    loadingMessage.style.opacity = 1;
                }, 200);
            }
        };

        // Initial message change after 1 second
        setTimeout(() => {
            changeMessage();
            // Then change every 2 seconds
            setInterval(changeMessage, 2000);
        }, 1000);
    } else {
        // Returning visitor - hide loading screen immediately
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
    }
}); 