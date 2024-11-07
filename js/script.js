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
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
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