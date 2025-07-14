// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function
                const ease = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
                
                window.scrollTo(0, startPosition + (distance * ease(progress)));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Navbar scroll class
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Reveal elements on scroll
const revealElements = document.querySelectorAll('.skill-category, .project-card, .info-card, .contact-form');

const revealOptions = {
    root: null, // use viewport as root
    threshold: 0.1, // trigger when 10% of element is visible
    rootMargin: '0px'
};

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target); // Stop observing once revealed
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

// Start observing elements
revealElements.forEach(element => {
    element.classList.add('reveal-hidden'); // Add initial hidden state
    revealObserver.observe(element);
});

// Add reveal classes for different directions
document.querySelectorAll('.skill-category').forEach((element, index) => {
    if (index % 2 === 0) {
        element.classList.add('reveal-left');
    } else {
        element.classList.add('reveal-right');
    }
});

document.querySelectorAll('.project-card').forEach((element, index) => {
    element.classList.add('reveal-up');
    element.style.transitionDelay = `${index * 0.1}s`; // Stagger effect
});

document.querySelectorAll('.info-card').forEach((element, index) => {
    element.classList.add('reveal-up');
    element.style.transitionDelay = `${index * 0.1}s`; // Stagger effect
});

// Animate stats when in viewport
const stats = document.querySelectorAll('.counter');
const animationDuration = 2000;

const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const end = parseInt(target.innerHTML);
            animateValue(target, 0, end, animationDuration);
            observer.unobserve(target);
        }
    });
}, observerOptions);

stats.forEach(stat => observer.observe(stat));

// Project Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});


// Add rate limiting
let lastSubmission = 0;
const SUBMISSION_COOLDOWN = 60000; // 1 minute

// Update contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check cooldown
    if (Date.now() - lastSubmission < SUBMISSION_COOLDOWN) {
        showNotification('Please wait before sending another message.', 'error');
        return;
    }
    
    // Check honeypot
    if (this.querySelector('[name="_honey"]').value) {
        return; // Silent failure for potential bots
    }
    
    // Verify reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showNotification('Please complete the reCAPTCHA.', 'error');
        return;
    }
    
    // Validate inputs
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Sanitize inputs (basic)
    const sanitizeInput = (str) => {
        return str.replace(/[<>]/g, '');
    };
    
    // Prepare template parameters with sanitized inputs
    const templateParams = {
        from_name: sanitizeInput(name),
        from_email: sanitizeInput(email),
        subject: sanitizeInput(subject),
        message: sanitizeInput(message),
        to_name: 'Adarsh Shah',
        'g-recaptcha-response': recaptchaResponse
    };

    // Rest of your existing EmailJS code...
    
    // Update last submission time
    lastSubmission = Date.now();
});

// Notification function
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add floating label effect
document.querySelectorAll('.form-group input, .form-group textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    element.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize other interactions
    initNavbarInteractions();
    initSmoothScroll();
    initProjectsScroll();
});

// Custom cursor initialization
function initCustomCursor() {
    // Create cursor elements if they don't exist
    let cursor = document.querySelector('.custom-cursor');
    let cursorDot = document.querySelector('.cursor-dot');

    if (!cursor) {
        cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
    }

    if (!cursorDot) {
        cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        document.body.appendChild(cursorDot);
    }

    // Set initial position
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .navbar, .logo, .nav-links a');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-effect');
            cursorDot.classList.add('hover-effect');
            el.classList.add('element-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-effect');
            cursorDot.classList.remove('hover-effect');
            el.classList.remove('element-hover');
        });
    });
}

// Navbar interactions
function initNavbarInteractions() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    let isExpanded = false;

    // Toggle navbar expansion
    navbar.addEventListener('click', () => {
        isExpanded = !isExpanded;
        navbar.classList.toggle('expanded', isExpanded);
    });

    // Handle link clicks
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                isExpanded = false;
                navbar.classList.remove('expanded');
            }
        });
    });
}

// Smooth scroll functionality
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Projects horizontal scroll
function initProjectsScroll() {
    const container = document.querySelector('.projects-grid-container');
    const leftBtn = document.querySelector('.scroll-left');
    const rightBtn = document.querySelector('.scroll-right');
    const scrollAmount = 400; // Adjust scroll amount as needed

    if (container && leftBtn && rightBtn) {
        // Show/hide scroll buttons based on scroll position
        function updateScrollButtons() {
            leftBtn.style.opacity = container.scrollLeft > 0 ? '1' : '0.5';
            rightBtn.style.opacity = 
                container.scrollLeft < (container.scrollWidth - container.clientWidth - 10) ? '1' : '0.5';
        }

        // Initial button state
        updateScrollButtons();

        // Scroll left
        leftBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(updateScrollButtons, 100);
        });

        // Scroll right
        rightBtn.addEventListener('click', () => {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(updateScrollButtons, 100);
        });

        // Update buttons on scroll
        container.addEventListener('scroll', updateScrollButtons);

        // Handle touch/drag scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Set initial cursor style
        container.style.cursor = 'grab';
    }
}

// Function to generate text-based favicon
function generateFavicon() {
    // Generate standard favicon (32x32)
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#15B392';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text style
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text
    ctx.fillText('AS', canvas.width/2, canvas.height/2);

    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL("image/x-icon");
    document.head.appendChild(link);

    // Generate high-resolution version (192x192) for PWA
    const canvasHD = document.createElement('canvas');
    canvasHD.width = 192;
    canvasHD.height = 192;
    const ctxHD = canvasHD.getContext('2d');

    // Set background
    ctxHD.fillStyle = '#15B392';
    ctxHD.fillRect(0, 0, canvasHD.width, canvasHD.height);

    // Set text style with larger font
    ctxHD.fillStyle = '#FFFFFF';
    ctxHD.font = 'bold 120px Poppins';
    ctxHD.textAlign = 'center';
    ctxHD.textBaseline = 'middle';

    // Draw text
    ctxHD.fillText('AS', canvasHD.width/2, canvasHD.height/2);

    // Add shadow effect
    ctxHD.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctxHD.shadowBlur = 10;
    ctxHD.shadowOffsetX = 0;
    ctxHD.shadowOffsetY = 4;

    // Set apple touch icon
    const appleTouchLink = document.querySelector("link[rel='apple-touch-icon']") || document.createElement('link');
    appleTouchLink.rel = 'apple-touch-icon';
    appleTouchLink.sizes = '192x192';
    appleTouchLink.href = canvasHD.toDataURL("image/png");
    document.head.appendChild(appleTouchLink);
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', generateFavicon);