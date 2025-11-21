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