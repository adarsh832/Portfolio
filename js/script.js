// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with delay (using GSAP for smoothness)
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: "power2.out"
    });
});

// Hover effects for cursor
const hoverElements = document.querySelectorAll('a, button, .project-card, .phone-mockup');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, {
            scale: 1.5,
            backgroundColor: "rgba(0, 255, 136, 0.1)",
            duration: 0.2
        });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, {
            scale: 1,
            backgroundColor: "transparent",
            duration: 0.2
        });
    });
});

// Navbar Scroll Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hero Animations
const heroTimeline = gsap.timeline();

heroTimeline
    .from(".hero-title .line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
    })
    .from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.5")
    .from(".hero-cta a", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.6")
    .from(".scroll-indicator", {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");

// Apdate Section Animations
gsap.from(".apdate-content", {
    scrollTrigger: {
        trigger: ".apdate-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".phone-mockup", {
    scrollTrigger: {
        trigger: ".apdate-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    x: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.2
});

// Projects Animations
gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out"
    });
});

// About Section Animations
gsap.from(".about-text", {
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    x: -30,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".skill-tags span", {
    scrollTrigger: {
        trigger: ".about-skills",
        start: "top 85%",
        toggleActions: "play none none reverse"
    },
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: "back.out(1.7)"
});

// Contact Form Submission (Placeholder)
function submitForm(event) {
    event.preventDefault();
    // In a real scenario, you would send the form data to a server here.
    // For now, we'll just show a success message.
    const form = event.target;
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Sending...';
    
    setTimeout(() => {
        btn.innerText = 'Message Sent!';
        btn.style.backgroundColor = '#00ff88';
        btn.style.color = '#0a0a0a';
        form.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 3000);
    }, 1500);
    
    return false;
}

// Advanced Animations

// 7. Draggable Physics Shapes
const shapes = document.querySelectorAll(".shape");

shapes.forEach((shape) => {
    // Initial random placement
    gsap.set(shape, {
        x: gsap.utils.random(-100, window.innerWidth),
        y: gsap.utils.random(-100, window.innerHeight),
        rotation: gsap.utils.random(0, 360)
    });

    // Physics state
    let state = {
        isDragging: false,
        x: gsap.getProperty(shape, "x"),
        y: gsap.getProperty(shape, "y"),
        vx: gsap.utils.random(-2, 2),
        vy: gsap.utils.random(-2, 2),
        lastX: 0,
        lastY: 0,
        friction: 0.98,
        bounce: 0.8
    };

    // Animation Loop for this shape
    function physicsLoop() {
        if (!state.isDragging) {
            // Apply velocity
            state.x += state.vx;
            state.y += state.vy;

            // Apply friction
            state.vx *= state.friction;
            state.vy *= state.friction;

            // Minimal velocity keep-alive (ambient float)
            if (Math.abs(state.vx) < 0.1 && Math.abs(state.vy) < 0.1) {
                // Add tiny random push to keep it floating
                state.vx += (Math.random() - 0.5) * 0.1;
                state.vy += (Math.random() - 0.5) * 0.1;
            }

            // Boundary Check (Bounce)
            const rect = shape.getBoundingClientRect();
            const parentWidth = window.innerWidth;
            const parentHeight = window.innerHeight;

            if (state.x < -rect.width/2) { state.x = -rect.width/2; state.vx *= -1; }
            if (state.x > parentWidth - rect.width/2) { state.x = parentWidth - rect.width/2; state.vx *= -1; }
            if (state.y < -rect.height/2) { state.y = -rect.height/2; state.vy *= -1; }
            if (state.y > parentHeight - rect.height/2) { state.y = parentHeight - rect.height/2; state.vy *= -1; }

            // Update DOM
            shape.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.x * 0.1}deg)`;
        }
        
        requestAnimationFrame(physicsLoop);
    }
    physicsLoop();

    // Drag Interaction
    shape.addEventListener("mousedown", (e) => {
        state.isDragging = true;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        shape.style.cursor = "grabbing";
        
        // Stop any conflicting GSAP tweens if any
        gsap.killTweensOf(shape);
    });

    window.addEventListener("mousemove", (e) => {
        if (state.isDragging) {
            const dx = e.clientX - state.lastX;
            const dy = e.clientY - state.lastY;
            
            state.x += dx;
            state.y += dy;
            
            // Calculate throw velocity
            state.vx = dx;
            state.vy = dy;
            
            state.lastX = e.clientX;
            state.lastY = e.clientY;
            
            shape.style.transform = `translate(${state.x}px, ${state.y}px)`;
        }
    });

    window.addEventListener("mouseup", () => {
        if (state.isDragging) {
            state.isDragging = false;
            shape.style.cursor = "grab";
        }
    });
});
/*
// 2. Magnetic Buttons
*/
const buttons = document.querySelectorAll(".btn, .nav-link");

buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// 3. Cinematic Text Reveal
function splitTextToSpans(targetElement) {
    if(targetElement.classList.contains('split-done')) return;
    
    const text = targetElement.innerText;
    targetElement.innerHTML = '';
    targetElement.classList.add('reveal-text', 'split-done');
    
    text.split('').forEach(char => {
        if(char === ' ') {
            targetElement.innerHTML += '<span>&nbsp;</span>';
        } else {
            targetElement.innerHTML += `<span>${char}</span>`;
        }
    });
}

document.querySelectorAll(".section-title, .hero-title .line").forEach(title => {
    // Split text
    splitTextToSpans(title);
    
    // Animate on view
    gsap.fromTo(title.querySelectorAll('span'), 
        {
            rotationX: -90,
            opacity: 0,
            y: 50
        },
        {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            rotationX: 0,
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: "back.out(1.7)" // Bouncy flip effect
        }
    );
});

// 4. Project Card 3D Tilt
document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 1000,
            transformOrigin: "center"
        });
    });
    
    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
        });
    });
});

// 5. Premium Vector Wave Reveal
const imageWrapper = document.querySelector(".about-image-wrapper");
const overlayImage = document.querySelector(".img-overlay");

if (imageWrapper && overlayImage) {
    let wavePhase = 0;
    let waveAmplitude = 0;
    let targetPercent = 100; // Initially hidden (100% down)
    let currentPercent = 100;
    let animationFrame;
    let isHovering = false;

    // Configuration
    const waveFrequency = 0.05; // Tightness of waves
    const responsiveness = 0.1; // Ease factor for height

    function animateWave() {
        if (!isHovering && Math.abs(currentPercent - targetPercent) < 0.1 && waveAmplitude < 0.1) {
            // Stop animation when settled and not hovering
            currentPercent = targetPercent;
            waveAmplitude = 0;
            updateClipPath(currentPercent, 0, 0);
            return; 
        }

        // Smoothly interpolate current percentage
        currentPercent += (targetPercent - currentPercent) * responsiveness;
        
        // Animate wave phase (flow)
        wavePhase += 0.2;

        // Dynamic Amplitude: Higher when moving, lower when settled
        const movement = Math.abs(targetPercent - currentPercent);
        const targetAmplitude = isHovering ? (10 + movement * 0.5) : 0; // Settles to 0 when not hovering
        waveAmplitude += (targetAmplitude - waveAmplitude) * 0.1;

        updateClipPath(currentPercent, waveAmplitude, wavePhase);
        
        animationFrame = requestAnimationFrame(animateWave);
    }

    function updateClipPath(percent, amp, phase) {
        // Generate polygon points for the wave
        let points = [];
        const steps = 30; // Resolution of the wave
        const height = imageWrapper.offsetHeight || 300; // Fallback height
        const width = imageWrapper.offsetWidth || 300;

        // Convert percent to pixel Y position (baseline of the wave)
        const baselineY = (percent / 100) * height;

        // Start point (Bottom Left)
        points.push(`0% 100%`);

        // Wave points
        for (let i = 0; i <= steps; i++) {
            const xPct = (i / steps) * 100;
            const xPx = (i / steps) * width;
            
            // Math: y = Baseline - Sine Wave
            // We subtract because Y grows downwards in CSS
            const waveY = Math.sin(xPx * waveFrequency + phase) * amp;
            const yPx = baselineY + waveY;
            
            // Clamp Y to be within visual bounds (optional, but looks cleaner)
            const yPct = (yPx / height) * 100;
            
            points.push(`${xPct}% ${yPct}%`);
        }

        // End point (Bottom Right)
        points.push(`100% 100%`);

        const polygonString = `polygon(${points.join(', ')})`;
        overlayImage.style.clipPath = polygonString;
    }

    imageWrapper.addEventListener("mousemove", (e) => {
        isHovering = true;
        const rect = imageWrapper.getBoundingClientRect();
        const yPos = e.clientY - rect.top;
        // Target is where the mouse is. 0% is top, 100% is bottom.
        let percent = (yPos / rect.height) * 100;
        targetPercent = Math.max(0, Math.min(100, percent));
        
        if (!animationFrame) loop();
    });

    imageWrapper.addEventListener("mouseenter", () => {
        isHovering = true;
        loop();
    });
    
    imageWrapper.addEventListener("mouseleave", () => {
        isHovering = false;
        targetPercent = 100; // Hide completely
        // Keep loop running until it settles
    });

    function loop() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animateWave();
    }
}

// 6. Interactive Particle Playground
const canvas = document.getElementById("interaction-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    
    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // Mouse tracking
    let mouse = { x: undefined, y: undefined, lastX: undefined, lastY: undefined };
    window.addEventListener("mousemove", (e) => {
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Calculate velocity
        const vx = (mouse.x - mouse.lastX) * 0.1 || 0;
        const vy = (mouse.y - mouse.lastY) * 0.1 || 0;

        // Spawn particles based on speed
        const speed = Math.sqrt(vx*vx + vy*vy);
        const count = Math.min(5, Math.floor(speed)); // More particles for faster movement

        for (let i = 0; i < count; i++) {
            particles.push(new Particle(mouse.x, mouse.y, vx, vy));
        }
    });

    class Particle {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            // Add some randomness to spread
            this.vx = vx * 0.5 + (Math.random() - 0.5) * 2;
            this.vy = vy * 0.5 + (Math.random() - 0.5) * 2;
            this.size = Math.random() * 3 + 1;
            this.life = 1; // 100% opacity
            this.decay = Math.random() * 0.02 + 0.01;
            
            // Random cyberpunk colors
            const colors = ["#00f3ff", "#ff00aa", "#ffffff"];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.95; // Shrink
        }

        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Use 'lighter' for glowing effect
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}