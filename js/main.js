// --- 1. CONFIGURATION & UTILS ---
gsap.registerPlugin(ScrollTrigger);

// --- SIGNATURE LOADER LOGIC ---
function initLoader() {
    // PRE-INIT DARK MODE
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Force scroll to top on load to prevent GSAP FOUC / layout breaks
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const loader = document.querySelector('#loading-screen');
    const content = document.querySelector('#smooth-wrapper');
    const signatureMaskPath = document.querySelector('#signature-mask-path'); 
    const signatureUnderline = document.querySelector('#signature-underline');

    // Preload Audio
    const signSound = new Audio('pen-sign.mp3');
    signSound.volume = 0.8; // Increased volume as requested
    signSound.preload = 'auto';
    signSound.muted = false;

    // Check Session Storage (Bypass for user testing)
    if (false) { 
        if (loader) loader.style.display = 'none';
        if (content) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(content, 
                { opacity: 0, scale: 0.85 }, 
                { 
                    opacity: 1, 
                    scale: 1, 
                    duration: 1.4, 
                    ease: "power3.inOut",
                    clearProps: "scale",
                    onComplete: () => {
                        document.body.style.overflow = '';
                        initApp();
                    }
                }
            );
        } else {
            initApp();
        }
    } else {
        if (loader && content && signatureMaskPath && signatureUnderline) {
            const pathLength = signatureMaskPath.getTotalLength();
            const underlineLength = signatureUnderline.getTotalLength();
            
            gsap.set(signatureMaskPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
            gsap.set(signatureUnderline, { strokeDasharray: underlineLength, strokeDashoffset: underlineLength });

            const tl = gsap.timeline({
                paused: true,
                onComplete: () => {
                   // Fail-safe sound stop
                   signSound.pause();
                   signSound.currentTime = 0;

                   gsap.to(loader, { 
                        opacity: 0, 
                        duration: 1.0, 
                        onComplete: () => {
                            loader.style.display = 'none';
                            // Scroll trigger init is delayed until scale intro finishes
                        }
                    });
                    
                    // Cinematic Center Opening Transition
                    document.body.style.overflow = 'hidden';
                    gsap.fromTo(content, 
                        { opacity: 0, scale: 0.85 }, 
                        { 
                            opacity: 1, 
                            scale: 1, 
                            duration: 1.4, 
                            ease: "power3.inOut", 
                            clearProps: "scale",
                            onComplete: () => {
                                // Unlock scroll and initialize pins only after transforms are cleared 
                                // to prevent position: fixed context bugs with CSS transforms
                                document.body.style.overflow = '';
                                initApp();
                            }
                        }
                    );
                }
            });

            // Tightened timeline for more realistic writing speed
            tl.to(signatureMaskPath, { strokeDashoffset: 0, duration: 3.0, ease: "power1.inOut" })
              .to(signatureUnderline, { strokeDashoffset: 0, duration: 1.0, ease: "power2.out" }, "-=0.5")
              .call(() => {
                  // STOP SOUND IMMEDIATELY when underline finishes
                  signSound.pause();
                  signSound.currentTime = 0;
              })
              .to({}, { duration: 0.5 }); // Final pause for visual balance

            // 1. Automatic Start (1s Delay)
            setTimeout(() => {
                tl.play();
                signSound.play().catch(() => {});
            }, 1000);

            // 2. Sync fallback
            const unmuteOnInteraction = () => {
                if (tl.isActive() && signSound.paused) {
                    signSound.currentTime = tl.time();
                    signSound.play().catch(() => {});
                }
                document.removeEventListener('click', unmuteOnInteraction);
            };
            document.addEventListener('click', unmuteOnInteraction);
            
            // 3. Stop sound if user clicks/navigates away early (fail-safe)
            tl.eventCallback("onUpdate", () => {
                if (tl.progress() > 0.95) { // At 95% progress, start fading out or preparation to stop
                    // Handled by .call() for precision but this is a backup
                }
            });

        } else {
             if (loader) loader.style.display = 'none';
             if (content) {
                 document.body.style.overflow = 'hidden';
                 gsap.fromTo(content, 
                     { opacity: 0, scale: 0.85 }, 
                     { 
                         opacity: 1, 
                         scale: 1, 
                         duration: 1.4, 
                         ease: "power3.inOut",
                         clearProps: "scale",
                         onComplete: () => {
                             document.body.style.overflow = '';
                             initApp();
                         }
                     }
                 );
             } else {
                 initApp();
             }
        }
    }
}

function initApp() {
    // --- GLOBAL MOTION CONFIGURATION ---
    const GLOBAL_EASE = "power3.out";
    const GLOBAL_DUR = 0.8;
    const IDLE_MIN = 6;
    const IDLE_MAX = 12;

    // Apply global 3D perspective to scenes
    gsap.set('section', { perspective: 1000, transformStyle: "preserve-3d" });

    // CINEMATIC SCROLL CONFIG
    const SCENE_CONFIG = {
        scrub: 1.5, // Heavy, weighted scroll
        ease: GLOBAL_EASE
    };

    // Custom Cursor Logic (Preserved)
    const cursor = document.getElementById('cursor-dot');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover Effects (Preserved & Enhanced)
    const interactiveElements = document.querySelectorAll('a, button, .group, [data-cursor-text]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const cursorText = el.getAttribute('data-cursor-text');
            if (cursorText) {
                // Large circular cursor with text
                cursor.style.width = '70px';
                cursor.style.height = '70px';
                cursor.style.opacity = '1';
                cursor.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000';
                
                const textSpan = cursor.querySelector('.cursor-text');
                if (textSpan) {
                    textSpan.style.color = document.documentElement.classList.contains('dark') ? '#000000' : '#ffffff';
                    textSpan.innerText = cursorText;
                    textSpan.classList.remove('hidden', 'opacity-0');
                    textSpan.classList.add('opacity-100');
                }
            } else {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.opacity = '0.5';
            }
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '8px';
            cursor.style.height = '8px';
            cursor.style.opacity = '1';
            cursor.style.backgroundColor = ''; // Reset to CSS default
            
            const textSpan = cursor.querySelector('.cursor-text');
            if (textSpan) {
                textSpan.classList.remove('opacity-100');
                textSpan.classList.add('opacity-0');
                setTimeout(() => { 
                    if (textSpan.classList.contains('opacity-0')) textSpan.classList.add('hidden'); 
                }, 300); // Wait for fade
            }
        });
    });

    // --- 2. MENU LOGIC (Preserved) ---
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    const menuLinks = document.querySelectorAll('.menu-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            menuOverlay.classList.add('open');
            line1.style.transform = "translateY(7px) rotate(45deg)";
            line2.style.opacity = "0";
            line3.style.transform = "translateY(-7px) rotate(-45deg)";
            gsap.to(menuLinks, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "expo.out", delay: 0.4 });
        } else {
            menuOverlay.classList.remove('open');
            line1.style.transform = "none";
            line2.style.opacity = "1";
            line3.style.transform = "none";
            gsap.to(menuLinks, { y: 20, opacity: 0, duration: 0.3, overwrite: true });
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    // NEW: Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // NEW: Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !menuOverlay.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            toggleMenu();
        }
    });


    // --- 3. SCENE 1 & 2: HERO -> IDENTITY (Horizontal Chapter Shift) ---
    // Setup initial positions for "Chapter 2"
    // --- CINEMATIC ID CARD CONFIG ---
    // Initial "Suspended" drops state
    // 1. Card State
    gsap.set("#id-card", { 
        x: 50,          
        y: -120,        
        rotation: 15,   
        opacity: 0,
        transformOrigin: "50% -100px", // Pivot from string top
        force3D: true, // Hardware acceleration
        rotationZ: 15 // Ensure Z axis rotation
    });

    // 2. String State (Syncs with Card)
    gsap.set("#id-card-string", {
        x: 50,
        y: -120, // Moves with the system
        rotation: 15,
        opacity: 0,
        transformOrigin: "top center", // Pivots at its own top
        force3D: true,
        rotationZ: 15
    });

    // Helper to animate both as a rigid body
    const physicsObj = ["#id-card", "#id-card-string"];

    let idCardEntered = false;
    function playIdCardEntry() {
        if (idCardEntered) return;
        idCardEntered = true;

        const tl = gsap.timeline();

        // 1. GRAVITY FALL (Both drop together)
        tl.to(physicsObj, {
            y: 0,
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut", // "Decelerates naturally as it approaches"
        })
        // 2. SWING PHASE (Synced Oscillation)
        // First swing wider
        .to(physicsObj, {
            rotation: -6,  
            rotationZ: -6,
            duration: 0.5,
            ease: "power1.inOut" // Natural harmonic turn
        })
        .to(physicsObj, {
            rotation: 3,   
            rotationZ: 3,
            duration: 0.5,
            ease: "power1.inOut"
        })
        .to(physicsObj, {
            rotation: -1.5,
            rotationZ: -1.5, 
            duration: 0.5,
            ease: "power1.inOut"
        })
        .to(physicsObj, {
            rotation: 0.5,
            rotationZ: 0.5, 
            duration: 0.5,
            ease: "power1.inOut"
        })
        // 3. SETTLE
        .to(physicsObj, {
            rotation: 0,   
            rotationZ: 0,
            duration: 0.8,
            ease: "power1.out"
        });
    }

    gsap.set(".reveal-text", { y: 0, opacity: 1 }); // Reset old reveal-text CSS since we use story-blocks now

    // Storytelling scroll block setups
    const storyBlocks = gsap.utils.toArray('.story-block');
    gsap.set(storyBlocks, { 
        y: 60, 
        opacity: 0, 
        scale: 0.98,
        filter: "brightness(1) drop-shadow(0px 0px 0px rgba(0,0,0,0))"
    });

    const chapterTL = gsap.timeline({
        scrollTrigger: {
            trigger: "#chapter-wrapper",
            start: "top top",
            end: "+=400%", // Increased scroll distance for storytelling
            pin: true,
            scrub: 1.5, // Smooth scrub
            anticipatePin: 1
        }
    });

    chapterTL
        // 1. Pan Camera Left
        .to("#chapter-wrapper", { 
            xPercent: -50, 
            ease: "none",
            duration: 3 // Normalize pan to duration 3
        })
        // 2. Hero Exit Effects (Concurrent Depth Exit)
        .to("#hero-content-wrapper", { 
            scale: 0.97, // standardized exit scale
            opacity: 0.4, 
            y: -50,
            x: -150, 
            z: -40, // push back into depth
            duration: 1.5,
            ease: GLOBAL_EASE
        }, 0)
        .to("#hero-bg-layer", {
            y: -50,
            scale: 0.95, // moves back slightly more
            opacity: 0,
            z: -80, // push further back
            duration: 1.5,
            ease: GLOBAL_EASE
        }, 0)
        .to(["#hero-footer", "#scroll-indicator"], {
            opacity: 0,
            duration: 1.0,
            ease: GLOBAL_EASE
        }, 0)
        // 3. Trigger Cinematic Entry roughly when profile is reached
        .call(playIdCardEntry, null, 2.5);

    // 4. Storytelling Sequence
    let currentTime = 3.0; // Start sequencing right after pan finishes

    // Subtle Parallax Depth on ID card column
    chapterTL.to(".lg\\:col-span-5", { // It has 5 story blocks. 5 * 1.4 = 7.0 scrub time.
        y: -40,
        ease: "none",
        duration: storyBlocks.length * 1.5
    }, currentTime);

    storyBlocks.forEach((block, index) => {
        // Entering (Active focus with 3D Pop)
        chapterTL.to(block, {
            y: 0,
            z: 20, // pop out
            opacity: 1,
            scale: 1,
            filter: "brightness(1.15) drop-shadow(0px 10px 20px rgba(0,0,0,0.05))",
            duration: GLOBAL_DUR,
            ease: GLOBAL_EASE
        }, currentTime);

        // Exiting (Muted & pushed back)
        if (index < storyBlocks.length - 1) {
            chapterTL.to(block, {
                y: -40,
                z: -20, // push back
                opacity: 0.3,
                scale: 0.98,
                filter: "brightness(0.85) drop-shadow(0px 0px 0px rgba(0,0,0,0))",
                duration: GLOBAL_DUR,
                ease: "power2.inOut" // keeping sine-like for overlapping flow
            }, currentTime + 1.2); 
            
            currentTime += 1.4; 
        } else {
            // Keep the last block active until the section exit
            currentTime += 1.4;
        }
    });

    // 5. Scroll Exit Transition (Standardized 0.97 Scale format)
    chapterTL.to('#profile', {
        y: -100, 
        scale: 0.97, // standardized exit scale
        z: -50,
        opacity: 0.0, 
        duration: 2.0,
        ease: "power2.inOut"
    }, currentTime + 0.5);

    // 6. Idle Floating Motion Upgrade
    gsap.to('#about-text-content', {
        y: "-=12",
        rotationZ: 0.5,
        duration: gsap.utils.random(IDLE_MIN, IDLE_MAX),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    // --- HERO INTERACTION (Cinematic Hover) ---
    const heroSection = document.querySelector('#hero-scene');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Subtle Parallax for Layers (Depth: Back < Portrait < Front)
            
            // 1. Background Moves Slower
            gsap.to('#hero-bg-layer', {
                x: -x * 5, 
                y: -y * 5,
                duration: 2.0,
                ease: "power2.out",
                overwrite: "auto"
            });

            // 2. Back Text (Mid) - Moves slightly more
            gsap.to('#hero-text-back', {
                x: -x * 12, 
                y: -y * 12,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto"
            });

            // 3. Portrait (Foreground) - Moves most
            gsap.to('#hero-portrait-container', {
                x: -x * 20,
                y: -y * 20,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto"
            });
            
            // Grid Micro-Parallax
            gsap.to('#global-grid-layer', {
                x: -x * 8,
                y: -y * 8,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto"
            });

            // Icons Parallax
            gsap.utils.toArray('.hero-icon').forEach(icon => {
                const speed = icon.classList.contains('icon-blur') ? 5 : 15;
                const xMove = icon.classList.contains('icon-pos-2') ? x * speed : -x * speed;
                
                gsap.to(icon, {
                    x: xMove,
                    y: -y * speed,
                    duration: 2.0,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        });
        
        // --- CINEMATIC ENTRY SEQUENCE (Revised for Layers) ---
        // Architectural Alignment: Relies on CSS positioning (Bottom-Left)
        
        // --- CINEMATIC ENTRY SEQUENCE WITH GSAP TEXT SPLIT ---
        // Splitting main heading text
        const heroTitleBlocks = document.querySelectorAll('#hero-text-back h2 .block');
        const headingChars = [];
        heroTitleBlocks.forEach(block => {
            const text = block.innerText;
            block.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                block.appendChild(span);
                headingChars.push(span);
            });
        });
        
        // Ensure text container is visible so characters can individually be opacity masked
        gsap.set('#hero-text-back h2', { opacity: 1, y: 0 });
        // Set icons initial state for CTA-like buttons
        gsap.set('.hero-icon', { scale: 0.9, opacity: 0 });

        const heroEntryTL = gsap.timeline({ 
            delay: 0.5,
            onComplete: () => {
                // Idle Animation (Critical Upgrade - Global System)
                gsap.to('#hero-composition', {
                    y: "-=12",
                    rotationZ: 0.2,
                    duration: gsap.utils.random(IDLE_MIN, IDLE_MAX),
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: gsap.utils.random(0, 0.5) 
                });
                // Background breathe
                gsap.to('#hero-bg-layer', {
                    scale: 1.05,
                    rotationZ: 1,
                    opacity: 0.8,
                    duration: IDLE_MAX,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                });
            }
        }); 
        
        // 1. Grid Fades In
        heroEntryTL.to('#global-grid-layer', {
            opacity: 1, 
            duration: 2.0,
            ease: "power2.inOut"
        })
        // 2. Borders Draw In
        .fromTo('#hero-frame', 
            { clipPath: "inset(0 50% 0 50%)", opacity: 0 }, 
            { clipPath: "inset(0 0 0 0)", opacity: 1, duration: 1.5, ease: "expo.out" },
            "-=1.5"
        )
        // 3. Portrait Appears
        .fromTo('#hero-portrait-container', 
            { opacity: 0, x: -20, y: 20 }, 
            { opacity: 1, x: 0, y: 0, duration: 2.0, ease: "power2.out" }, 
            "-=1.0"
        )
        // 4. Structural Depth Planes
        .fromTo('#hero-plane-portrait', 
            { opacity: 0, x: -10 }, 
            { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }, 
            "-=1.2"
        )
        .fromTo('#hero-plane-strip', 
            { scaleY: 0, transformOrigin: "top center" }, 
            { scaleY: 1, duration: 2.0, ease: "expo.out" }, 
            "-=1.8"
        )
        // 5. Main Text Animate (Start Delay + Shared Motion + Depth)
        .fromTo(headingChars, 
            { opacity: 0, y: 80, rotationZ: () => gsap.utils.random(-4, 4), z: 50 }, 
            { 
                opacity: 1, 
                y: 0, 
                rotationZ: 0, 
                z: 0,
                stagger: { amount: 0.8, from: "start" }, 
                duration: 1.8,  // Slightly longer for hero
                delay: 0.2, // Start delay anticipation
                ease: GLOBAL_EASE 
            }, 
            "-=1.5"
        )
        // 6. Icons Materialize (CTA buttons appear with small scale)
        .to('.hero-icon', {
            opacity: 1,
            scale: 1,
            y: 0, 
            z: 30, // push icons slightly forward
            stagger: 0.15, 
            duration: 1.5,
            ease: GLOBAL_EASE
        }, "-=1.0")
        // Micro delays for subheadings/footer text
        .fromTo('#hero-footer span',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 1.0, ease: GLOBAL_EASE },
            "-=1.0"
        );

        // --- FLOATING ICON LOOPS ---
        document.querySelectorAll('.hero-icon').forEach((icon) => {
            const duration = 3 + Math.random() * 2; 
            const yDist = 5 + Math.random() * 5; 
            const delay = Math.random() * 2;

            gsap.to(icon, {
                y: `+=${yDist}`,
                duration: duration,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                delay: delay
            });
        });

        // --- SCROLL INDICATOR REVEAL ---
        gsap.to('#scroll-indicator', {
            opacity: 1,
            duration: 2.0,
            delay: 2.5, 
            ease: "power2.out"
        });
        
        // --- SCROLL CURSOR LOOP ---
        gsap.to('#scroll-cursor', {
            y: 48, 
            yPercent: 600, 
            duration: 2.0,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 0.5
        });
    }


    // --- 5. SCENE 3: WORK (Stacking Photo Frames) ---
    const workSection = document.getElementById("work");
    const workFrames = gsap.utils.toArray(".work-frame");
    const workStack = document.getElementById("work-stack");

    workFrames.forEach(frame => {
        frame.style.transition = "none";
    });

    // --- INTERACTIVE SYSTEM NODES (Logic) ---
    const icons = document.querySelectorAll('.hero-icon');
    let activeIcon = null;

    function closePanel(icon) {
        if (!icon) return;
        const panel = icon.querySelector('.micro-panel');
        
        // Animate Out
        gsap.to(panel, {
            autoAlpha: 0,
            y: 0, // Return to center/down
            duration: 0.3,
            ease: "power2.in"
        });
        
        // Reset Icon State
        icon.classList.remove('active');
    }

    function openPanel(icon) {
        const panel = icon.querySelector('.micro-panel');
        
        // Animate In
        gsap.to(panel, {
            autoAlpha: 1,
            y: -6, // Slide up slightly
            duration: 0.4,
            ease: "power2.out"
        });
        
        // Set Icon State
        icon.classList.add('active');
    }

    function updateFocusMode(newActiveIcon) {
        // Dim others
        icons.forEach(icon => {
            if (icon === newActiveIcon) {
                icon.classList.remove('dimmed');
            } else {
                if (newActiveIcon) {
                    icon.classList.add('dimmed');
                } else {
                    icon.classList.remove('dimmed');
                }
            }
        });
    }

    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            // Close previous if any (though hover usually means only one at a time)
            if (activeIcon && activeIcon !== icon) closePanel(activeIcon);
            
            // Open new
            openPanel(icon);
            activeIcon = icon;
            updateFocusMode(icon);
        });

        icon.addEventListener('mouseleave', () => {
            // Close current
            closePanel(icon);
            activeIcon = null;
            updateFocusMode(null);
        });
    });

    // --- SCROLL STACKING LOGIC ---
    let frameMm = gsap.matchMedia();

    // Rotations for natural photo stack
    const frameRotations = [-2, 1, -1.5, 2];

    frameMm.add("(min-width: 768px)", () => {
        // Desktop Stacking Snapshot
        gsap.set(workFrames, { 
            y: (i) => i === 0 ? 0 : window.innerHeight, 
            scale: (i) => i === 0 ? 1 : 0.85,
            opacity: (i) => i === 0 ? 1 : 0,
            rotation: (i) => i === 0 ? frameRotations[0] : 0
        });

        const stackTl = gsap.timeline({
            scrollTrigger: {
                trigger: workSection,
                start: "center center", // Pin when section is perfectly centered
                end: "+=200%",          // Length of the scroll animation
                scrub: 1,
                pin: true,              // Crucial: locks the section to prevent layout jumps/overlapping
                anticipatePin: 1
            }
        });

        workFrames.forEach((frame, i) => {
            if (i === 0) return;
            const stackOffset = i * -25;
            const targetRot = frameRotations[i % frameRotations.length];
            
            stackTl.to(frame, {
                y: stackOffset,
                scale: 1,
                opacity: 1,
                rotation: targetRot,
                duration: 1,
                ease: "power2.out"
            }, (i - 1) * 0.8);
        });

        // Hover Effect on Desktop Stack
        workFrames.forEach((frame, i) => {
            const baseRot = frameRotations[i % frameRotations.length];
            frame.addEventListener("mouseenter", () => {
                const limitY = i === 0 ? 0 : (i * -25);
                gsap.to(frame, { y: limitY - 15, scale: 1.02, rotation: baseRot, duration: 0.3, overwrite: "auto", boxShadow: "0 25px 40px -10px rgba(0, 0, 0, 0.2)" });
            });
            frame.addEventListener("mouseleave", () => {
                const limitY = i === 0 ? 0 : (i * -25);
                gsap.to(frame, { y: limitY, scale: 1, rotation: baseRot, duration: 0.3, overwrite: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" });
            });
        });

        return () => { gsap.set(workFrames, { clearProps: "all" }); };
    });

    frameMm.add("(max-width: 767px)", () => {
        // Mobile Fallback Fade
        gsap.set(workFrames, { y: 40, opacity: 0 });
        ScrollTrigger.batch(workFrames, {
            onEnter: (elements) => {
                gsap.to(elements, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: GLOBAL_EASE, overwrite: "auto" });
            },
            start: "top 85%",
            once: true
        });
        return () => { gsap.set(workFrames, { clearProps: "all" }); };
    });



    // --- 6. SCENE 4: CONTACT (Resolution) ---
    const contactSection = document.getElementById('contact');
    const contactH2 = document.querySelector('#contact h2');
    const contactP = document.querySelector('#contact p.font-body');
    const contactBtn = document.getElementById('initiate-contact-btn');
    const contactFooterElements = document.querySelector('.mt-40').children; // The 3 columns
    const prevSection = document.getElementById('work');

    // 1. Overlap / Slide-Up Transition Logic
    // Keep the Work section visually stationary by translating it down precisely as the page scrolls up.
    // This removes the gap issues of nested pins and beautifully overlays Contact like a rising curtain.
    gsap.set(contactSection, { zIndex: 100 });
    gsap.fromTo(prevSection, 
        { y: 0 },
        {
            y: () => window.innerHeight,
            ease: "none",
            scrollTrigger: {
                trigger: contactSection,
                start: "top bottom",
                end: "top top", 
                scrub: true,
                invalidateOnRefresh: true
            }
        }
    );

    // 2. Scroll Entrance Content Form Animation (Sequenced)
    // Hide initially with depth push
    gsap.set([contactH2, contactP, contactBtn, ...contactFooterElements], { y: 60, opacity: 0, z: -20 });

    const contactEntryTL = gsap.timeline({
        scrollTrigger: {
            trigger: contactSection,
            start: "top 60%", // Triggers well into view
            toggleActions: "play reverse play reverse",
            onEnter: () => {
                // Focused Attention Effect: Dim previous section slightly
                gsap.to(prevSection, { opacity: 0.3, filter: "blur(2px)", duration: GLOBAL_DUR, ease: GLOBAL_EASE });
            },
            onLeaveBack: () => {
                // Restore previous section
                gsap.to(prevSection, { opacity: 1, filter: "blur(0px)", duration: GLOBAL_DUR, ease: GLOBAL_EASE });
            }
        }
    });

    contactEntryTL
        // Header Animates Upward with start delay
        .to(contactH2, { y: 0, z: 0, opacity: 1, duration: GLOBAL_DUR, ease: GLOBAL_EASE, delay: 0.2 })
        // Paragraph follows shortly
        .to(contactP, { y: 0, z: 0, opacity: 1, duration: GLOBAL_DUR, ease: GLOBAL_EASE }, "-=0.6")
        // Button fades in
        .to(contactBtn, { y: 0, z: 0, opacity: 1, duration: GLOBAL_DUR, ease: GLOBAL_EASE }, "-=0.5")
        // Footer links stagger smoothly
        .to(contactFooterElements, { y: 0, z: 0, opacity: 1, duration: GLOBAL_DUR, stagger: 0.15, ease: GLOBAL_EASE }, "-=0.4");

    // 2. Magnetic Button Interaction (CRITICAL UPGRADE)
    if (contactBtn) {
        let bounds;
        const buttonText = contactBtn.innerText; // Keep original text
        
        // Wrap text to animate it separately from the button boundary if needed
        contactBtn.innerHTML = `<span>${buttonText}</span>`;
        const btnTextSpan = contactBtn.querySelector('span');

        const mouseMove = (e) => {
            const x = e.clientX - bounds.left - bounds.width / 2;
            const y = e.clientY - bounds.top - bounds.height / 2;

            // Elastic pull on hover
            gsap.to(contactBtn, {
                x: x * 0.4, // small distance follow
                y: y * 0.4,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto"
            });
            
            // Text moves slightly faster inside the button for depth
            gsap.to(btnTextSpan, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto"
            });
        };

        contactBtn.addEventListener("mouseenter", () => {
            bounds = contactBtn.getBoundingClientRect();
            document.addEventListener("mousemove", mouseMove);
            // Visual pop on hover
            gsap.to(contactBtn, { scale: 1.05, duration: 0.4, ease: "back.out(2)" });
        });

        contactBtn.addEventListener("mouseleave", () => {
            document.removeEventListener("mousemove", mouseMove);
            // Elastic return home
            gsap.to(contactBtn, {
                x: 0, y: 0, scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                overwrite: "auto"
            });
            gsap.to(btnTextSpan, {
                x: 0, y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                overwrite: "auto"
            });
        });

        // 3. Submission Feedback (Soft compression)
        contactBtn.addEventListener("mousedown", () => {
             gsap.to(contactBtn, { scale: 0.95, duration: 0.1, ease: "power2.out", overwrite: "auto" });
        });
        contactBtn.addEventListener("mouseup", () => {
             gsap.to(contactBtn, { scale: 1.05, duration: 0.4, ease: "back.out(3)" }); // Bounces back past normal scale since mouse is still hovered
        });
    }

    // 4. Idle Motion (Slow Floating)
    // Applies to the background "SHAH" text and the container itself faintly
    const backgroundShah = document.querySelector('#contact h1');
    if (backgroundShah) {
        gsap.to(backgroundShah, {
            y: "-=20",
            rotation: 0.5,
            duration: gsap.utils.random(IDLE_MIN, IDLE_MAX),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    const contactWrapper = document.querySelector('#contact .relative.z-10'); // Inner content wrapper
    if (contactWrapper) {
          gsap.to(contactWrapper, {
            y: "-=10",
            duration: IDLE_MIN,
            delay: 1, // stagger floating
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // 5. Final Exit Feeling (Scroll bottom glow expansion)
    // Use the contact's black depth overlay to simulate a soft lighting conclusion entirely
    const finishGlow = document.getElementById('contact-depth-overlay');
    if (finishGlow) {
        gsap.to(finishGlow, {
            scrollTrigger: {
                trigger: contactSection,
                start: "center center", 
                end: "bottom bottom",
                scrub: 1
            },
            opacity: 0.8, // Darkens background creating an inverse glow feel as it closes the design
            filter: "brightness(0.5)",
            ease: "power1.inOut"
        });
    }

    // --- THEME TOGGLE LOGIC ---
    const themeToogleBtn = document.getElementById('theme-toggle');

    function toggleTheme() {
        // Toggle Class
        const isNowDark = !document.documentElement.classList.contains('dark');
        
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }

        // Animate Hero Text to match new theme
        const heroTextBack = document.querySelector('#hero-text-back h2');
        const heroTextFront = document.querySelector('#hero-text-front h2');
        
        if (heroTextBack && heroTextFront) {
            const targetColor = isNowDark ? "#f0f0f0" : "#1a1a1a";
            // Update Text Shadow for Back Layer only (Front is transparent/stroked)
            const targetShadow = isNowDark 
                ? "-1px -1px 1px rgba(255,255,255,0.2), 1px 1px 0px rgba(0,0,0,0.5), 2px 2px 0px rgba(0,0,0,0.3), 0px 10px 30px rgba(0,0,0,0.5)" 
                : "-1px -1px 1px rgba(255, 255, 255, 0.1), 1px 1px 0px rgba(0, 0, 0, 0.1), 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 10px 30px rgba(0, 0, 0, 0.2)";
            
            gsap.to(heroTextBack, {
                color: targetColor,
                textShadow: targetShadow,
                duration: 0.5,
                ease: "power2.out"
            });
            
             gsap.to(heroTextFront, {
                // Front keeps stroke, maybe adjust stroke color if needed, but currently it's white/black dependent on mix-blend or just pure stroke.
                // If front has color: transparent, we just leave it. 
                // Maybe update stroke color?
                webkitTextStrokeColor: isNowDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                duration: 0.5
            });
        }
    }

    if (themeToogleBtn) {
        themeToogleBtn.addEventListener('click', toggleTheme);
    }

    // --- CINEMATIC CONTACT FRAME (Compositional Boundary) ---
    const contactFrameTL = gsap.timeline({
        scrollTrigger: {
            trigger: "#contact",
            start: "top 60%", // Starts as section enters focus
            toggleActions: "play reverse play reverse" // Fade in/out naturally
        }
    });

    // 1. Top Border Draws (Left -> Right)
    contactFrameTL
        .to("#cf-top", { scaleX: 1, duration: 1.2, ease: "power2.inOut" })
        
        // 2. Side Borders Drop (Top -> Bottom) - Slight overlap
        .to(["#cf-right", "#cf-left"], { 
            scaleY: 1, 
            duration: 1.0, 
            ease: "power2.out",
            stagger: 0.2 
        }, "-=0.4")
        
        // 3. Bottom Border Completes (Left -> Right to close loop)
        .to("#cf-bottom", { 
            scaleX: 1, 
            duration: 1.2, 
            ease: "power2.out" 
        }, "-=0.6")

        // 4. Atmosphere Shift (Depth & Focus)
        .to("#contact-depth-overlay", { opacity: 1, duration: 1.5 }, 0)
        .to("#initiate-contact-btn", { 
            filter: "contrast(110%) drop-shadow(0 0 10px rgba(255,255,255,0.2))", // Subtle "Hot" Focus
            duration: 1.5 
        }, 0.5);

    // --- 7. ROLLING TEXT ANIMATION ---
    function initRollingText() {
        const rollingElements = document.querySelectorAll('.rolling-text');
        
        rollingElements.forEach(el => {
            const originalContent = el.innerHTML;
            const lines = originalContent.split(/<br\s*\/?>/i);
            
            el.innerHTML = ''; // Clear container
            
            const allChars = []; // Store all char elements for staggering

            lines.forEach((lineContent, lineIndex) => {
                const cleanLine = lineContent.trim();
                if (!cleanLine) return;

                const lineWrapper = document.createElement('div');
                lineWrapper.className = 'roll-line';
                
                // Split into words to preserve spacing structure
                const words = cleanLine.split(/\s+/);
                
                words.forEach((word, wordIndex) => {
                    const wordWrapper = document.createElement('span');
                    wordWrapper.className = 'roll-word';
                    
                    // Split word into characters
                    const chars = word.split('');
                    
                    chars.forEach(char => {
                        const charWrapper = document.createElement('span');
                        charWrapper.className = 'roll-char';
                        
                        const inner = document.createElement('span');
                        inner.className = 'roll-inner';
                        
                        const text1 = document.createElement('span');
                        text1.className = 'roll-text';
                        text1.innerHTML = char;
                        
                        const text2 = document.createElement('span');
                        text2.className = 'roll-text absolute top-full left-0 w-full';
                        text2.innerHTML = char;
                        text2.ariaHidden = "true";

                        inner.appendChild(text1);
                        inner.appendChild(text2);
                        charWrapper.appendChild(inner);
                        wordWrapper.appendChild(charWrapper);
                        
                        allChars.push(inner);
                    });
                    
                    lineWrapper.appendChild(wordWrapper);
                });
                
                el.appendChild(lineWrapper);
            });

            // Hover Interaction
            el.addEventListener('mouseenter', () => {
                gsap.to(allChars, {
                    y: "-100%",
                    duration: 0.6,
                    stagger: 0.02,
                    ease: "power3.inOut"
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(allChars, {
                    y: "0%",
                    duration: 0.6,
                    stagger: {
                        each: 0.02,
                        from: "end" // Reverse stagger on exit
                    },
                    ease: "power3.inOut"
                });
            });
        });
    }

    // Initialize after DOM load
    initRollingText();

    // --- 13. PROJECT MODAL LOGIC ---
    // Project Modal Logic
    const workItems = document.querySelectorAll('.work-frame, #work-grid .group');
    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalGithub = document.getElementById('modal-github');
    let isModalOpen = false;

    function openModal(card) {
        if (!card) return;
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const imgSrc = card.getAttribute('data-image');
        const github = card.getAttribute('data-github');

        if (!title) return; // Ignore non-project clicks like the archive card

        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modalImage.src = imgSrc;
        modalGithub.href = github;

        // Hide cursor to prevent overlap clashing during modal
        cursor.style.opacity = '0';
        
        projectModal.style.pointerEvents = 'auto';
        isModalOpen = true;

        // Animate elements inside (autoAlpha handles visibility: visible and opacity: 1 seamlessly)
        gsap.to(projectModal, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
        gsap.fromTo(modalImage, { scale: 1.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo(modalTitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.4 });
        gsap.fromTo(modalDesc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 });
        gsap.fromTo(modalGithub, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.6 });
        
        // Prevent body scroll (lock in place)
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        projectModal.style.pointerEvents = 'none';
        isModalOpen = false;
        
        gsap.to(projectModal, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
        
        // Restore cursor
        cursor.style.opacity = '1';
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Use Event Delegation to ensure clicks are registered even if GSAP alters the DOM or nodes
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.work-frame, #work-grid .group');
        if (card) {
            e.preventDefault();
            openModal(card);
        }
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // --- 9. CINEMATIC CONTACT FORM LOGIC ---
    const contactModalBtn = document.getElementById('initiate-contact-btn');
    const contactModal = document.getElementById('contact-form-modal');
    const contactBackdrop = document.getElementById('contact-backdrop');
    const contactCard = document.getElementById('contact-form-card');
    const closeContactBtn = document.getElementById('close-contact-btn');
    const contactTitle = document.getElementById('contact-title');
    const contactDivider = document.getElementById('contact-divider');
    const contactInputs = document.querySelectorAll('.contact-input-group'); // Includes button

    let isContactOpen = false;

    // Timeline for Contact Modal
    const contactTL = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

    // Build Timeline once
    contactTL
        .set(contactModal, { display: "flex" })
        .to(contactBackdrop, { opacity: 1, duration: 0.5 })
        .to(contactCard, { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            duration: 0.6, 
            ease: "power2.out" 
        }, "-=0.3")
        .to(contactTitle, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")
        .to(contactDivider, { width: "100%", duration: 0.6, ease: "expo.out" }, "-=0.3")
        .to(contactInputs, { 
            y: 0, 
            opacity: 1, 
            stagger: 0.1, 
            duration: 0.5 
        }, "-=0.4");

    function openContact() {
        if (isContactOpen) return;
        isContactOpen = true;
        
        // Button Press Effect
        gsap.to(contactModalBtn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

        contactModal.style.pointerEvents = "auto";
        document.body.style.overflow = "hidden"; // Lock scroll
        contactTL.play();
    }

    function closeContact() {
        if (!isContactOpen) return;
        isContactOpen = false;

        contactModal.style.pointerEvents = "none";
        document.body.style.overflow = ""; // Unlock scroll
        contactTL.reverse();
    }

    if (contactModalBtn) {
        contactModalBtn.addEventListener('click', openContact);
    }

    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', closeContact);
    }

    // Close on backdrop click
    if (contactBackdrop) {
        contactBackdrop.addEventListener('click', closeContact);
    }

    // --- 10. CONTACT FORM AJAX HANDLER ---
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // Loading State
            submitBtn.disabled = true;
            submitBtn.innerText = "TRANSMITTING...";
            submitBtn.style.opacity = "0.7";

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success Animation
                    gsap.to(contactForm, {
                        height: 0,
                        opacity: 0,
                        duration: 0.5,
                        overflow: 'hidden',
                        onComplete: () => {
                            contactForm.classList.add('hidden');
                            contactForm.style.height = 'auto'; // Reset for next time if needed
                            contactForm.style.opacity = '1';
                            
                            contactSuccess.classList.remove('hidden');
                            gsap.fromTo(contactSuccess, 
                                { opacity: 0, scale: 0.9 },
                                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                            );

                            // AUTO-CLOSE LOGIC ADDED HERE
                            setTimeout(() => {
                                if (contactTL) {
                                    contactTL.reverse(); // Close Modal
                                }
                                
                                // Reset UI after modal is closed (delay matching reverse duration approx)
                                setTimeout(() => {
                                    resetForm();
                                }, 1000); 
                            }, 2500); // Wait 2.5s for user to read message
                        }
                    });
                    
                    contactForm.reset();
                } else {
                    throw new Error('Server returned ' + response.status);
                }
            } catch (error) {
                console.error('Submission failed:', error);
                alert('Transmission failed. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                submitBtn.style.opacity = "1";
            }
        });
    }

    function resetForm() {
        // Hide success, show form
        gsap.to(contactSuccess, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                contactSuccess.classList.add('hidden');
                contactForm.classList.remove('hidden');
                gsap.fromTo(contactForm,
                    { opacity: 0, height: 0 },
                    { opacity: 1, height: 'auto', duration: 0.5 }
                );
            }
        });
    }

    // --- 11. ID CARD PHYSICS & INTERACTION ---
    const idCard = document.getElementById('id-card');
    const idCardString = document.getElementById('id-card-string');
    const idCardContainer = idCard ? idCard.parentElement : null;

    if (idCard && idCardContainer) {
        // Physics Logic
        idCardContainer.addEventListener('mousemove', (e) => {
            const rect = idCardContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate Normalized Coordinates (-1 to 1)
            const xPct = (x / rect.width - 0.5) * 2;
            const yPct = (y / rect.height - 0.5) * 2;

            // Apply Physics Rotation to BOTH
            const targetRotX = -yPct * 6;
            const targetRotY = xPct * 6;

            gsap.to([idCard, idCardString], {
                rotationX: targetRotX, 
                rotationY: targetRotY,
                duration: 2, // Heavy Inertia
                ease: "power2.out"
            });
        });

        idCardContainer.addEventListener('mouseleave', () => {
            // Return to Rest
            gsap.to([idCard, idCardString], {
                rotationX: 0,
                rotationY: 0,
                duration: 2.5, 
                ease: "power2.out"
            });
        });
    }

    // --- 12. ID CARD FILE SYSTEM INTERACTION ---
    const idCardElement = document.getElementById('id-card');
    const aboutTextContent = document.getElementById('about-text-content');
    const fileSystemView = document.getElementById('file-system-view');
    const closeDirectoryBtn = document.getElementById('close-directory-btn');
    const directoryFolders = document.querySelectorAll('.directory-folder');

    let isDirectoryOpen = false;

    // Interaction: Click ID Card to Open Directory
    if (idCardElement) {
        idCardElement.addEventListener('click', () => {
            if (isDirectoryOpen) return; // Already open
            isDirectoryOpen = true;

            // 1. Fade Out About Text
            gsap.to(aboutTextContent, {
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.5,
                ease: "power2.out"
            });

            // 2. Shift ID Card (Physics Safe)
            gsap.to(["#id-card", "#id-card-string"], {
                x: -40, // Shift left
                duration: 0.8,
                ease: "power3.out"
            });

            // 3. Reveal File System
            fileSystemView.classList.remove('hidden');
            fileSystemView.style.pointerEvents = "auto";
            
            // Animate Container
            gsap.fromTo(fileSystemView, 
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
            );

            // Stagger Folders
            gsap.fromTo(directoryFolders, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, delay: 0.3, ease: "power2.out" }
            );
        });
    }

    // Interaction: Close Directory
    if (closeDirectoryBtn) {
        closeDirectoryBtn.addEventListener('click', () => {
            if (!isDirectoryOpen) return;
            isDirectoryOpen = false;

            // 1. Hide File System
            gsap.to(fileSystemView, {
                opacity: 0,
                x: 10,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    fileSystemView.classList.add('hidden');
                    fileSystemView.style.pointerEvents = "none";
                    // Reset folders
                    directoryFolders.forEach(folder => {
                        folder.classList.remove('open');
                        const content = folder.querySelector('.folder-content');
                        gsap.set(content, { height: 0, opacity: 0 });
                    });
                }
            });

            // 2. Reset ID Card Position
            gsap.to(["#id-card", "#id-card-string"], {
                x: 0, // Return to center/original flow
                duration: 0.8,
                ease: "power3.out"
            });

            // 3. Fade In About Text
            gsap.to(aboutTextContent, {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.8,
                delay: 0.2,
                ease: "power2.out"
            });
        });
    }

    // Interaction: Folder Expansion
    directoryFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            const isOpen = folder.classList.contains('open');
            const content = folder.querySelector('.folder-content');

            // Close all others
            directoryFolders.forEach(otherFolder => {
                if (otherFolder !== folder && otherFolder.classList.contains('open')) {
                    otherFolder.classList.remove('open');
                    gsap.to(otherFolder.querySelector('.folder-content'), {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    });
                }
            });

            if (isOpen) {
                // Close
                folder.classList.remove('open');
                gsap.to(content, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in"
                });
            } else {
                // Open
                folder.classList.add('open');
                gsap.to(content, {
                    height: "auto",
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    });

    // --- 13. ID CARD ATMOSPHERIC HERO PARALLAX ---
    // (Included in previous section logic, ensuring listeners are unique or shared carefully)
    // We already have a 'heroScene' listener at the top.
    // The physics for ID card are separate.

    // --- 14. TRANSITION BAND LOGIC ---
    // Smoothly fade in to prevent intro scaling FOUC
    gsap.to('#transition-band', { opacity: 1, duration: 1.5, ease: "power2.inOut", delay: 0.5 });

    // Scroll-driven kinetic typography
    gsap.to(".marquee-row", {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: "#transition-band",
            start: "top bottom",
            end: "bottom top",
            scrub: 1 // Moves smoothly with scroll
        }
    });
}
document.addEventListener("DOMContentLoaded", initLoader);
