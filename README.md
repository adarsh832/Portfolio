# Adarsh Shah - Creative Engineering Portfolio

This portfolio is built with a focus on high-performance, cinematic GSAP motion design. It utilizes a custom global animation configuration to ensure seamless scroll continuity, depth perception, and premium interactive elements.

Below is a detailed breakdown of the animation systems and interactions applied to each section of the site.

---

## 🌐 Global Motion & Transition System

To unify the visual experience, the entire application strictly adheres to a shared motion language.

- **Global Config**: Core animations use a standardized duration (`0.8s`) and easing curve (`power3.out`) for consistent momentum.
- **Scroll Continuity (Standard Exits)**: As a user scrolls from one major section to the next, the exiting section doesn't just disappear. It gently scales down to `0.97`, reduces opacity, and physically pushes backward into the screen to give the next section priority.
- **3D Depth Engine**: Elements are placed on different depth planes using `translateZ`. Foreground elements pop in from positive Z indices while background environments sit deep in negative space.
- **Universal Idle Breathing**: The portfolio is never truly static. Once scrolling stops, containers, text layers, and decorative elements initiate a randomized, asynchronous `sine.inOut` floating motion (looping between 6 to 12 seconds).

---

## 🖋️ Loading Sequence & Initialization
- **Vector Signature Reveal**: SVG path drawing animation (`strokeDashoffset`) traces a signature to reveal the site.
- **Synchronized Audio**: A mechanical/pen sound effect is perfectly timed alongside the drawing timeline, giving tactile feedback to the visual load.

---

## 🎬 01. Hero Scene
- **Architectural Draw-in**: The engineering grid and UI frames animate in via `clip-path` inset reveals.
- **Cinematic Mouse Parallax**: The background noise layer, the middle heavy typography layer, the portrait photo, and the top grid layer all move at different physical ratios based on the user's cursor position.
- **Foreground Reveal**: Text and sub-headers sequentially stagger upward from the bottom with a slight 3D flip.
- **Interactive Nodes**: Floating wireframe icons operate on discrete sine-wave loops. Hovering over them triggers a focus mode (dimming the rest of the scene) and pulls up a frosted-glass information panel.

---

## 🪪 02. Identity & About Section
- **Chapter Panning**: Navigating from the Hero to the About section utilizes a pinned, horizontal split-screen scroll timeline.
- **Physics ID Card**: A 3D ID card drops in with rigid body physics, simulating gravity and authentic pendulum swinging before naturally settling.
- **Scroll-Storytelling**: Instead of generic text blocks, the About text is broken into a scroll-controlled story. 
  - As you scroll, the active paragraph pops out (`translateZ: 20px`), scales to `1.0`, and receives a bright highlight. 
  - Spent paragraphs fade to `0.3` opacity, shrink slightly, and move backward on the Z-axis (`translateZ: -20px`).
- **File System Interaction**: Clicking the ID card gracefully swaps the entire left-hand UI out for a collapsible, terminal-style directory system with smooth height/opacity interpolation.

---

## 🛠️ 03. Selected Works (Projects)
- **Organic Stagger Entry**: Project cards rise and rotate onto the canvas with slightly randomized micro-delays to make the load feel fluid and organic rather than robotic.
- **Inside Card Parallax**: While scrolling past the grid, the image inside each card slowly shifts relative to its container frame, providing a window-like depth effect.
- **Card Hover Physics**: Hovering lifts the card and increases drop shadow. Crucially, the CSS rotation is locked during this phase to prevent jagged snapping boundaries.
- **Cinematic Project Modal**: Clicking any card triggers an expanding overlay. The image, heading, and action buttons load sequentially in a fast `power2.out` timeline alongside a locked body scroll for focus.
- **Transitional Marquee**: Below the projects, a kinetic typography band horizontally linked aggressively against the scrub scroll progress acting as a visual palette cleanser.

---

## 📞 04. Contact & Resolution
- **Focused Attention Approach**: As the Contact section enters the viewport, the previous Work section dynamically blurs (`2px`) and dims (`0.3` opacity), forcefully pulling the user's eyes into the final form.
- **Elastic Magnetic Button**: The "Initiate Collaboration" button uses cursor proximity bounding box calculations. 
  - The button body actively "pulls" toward your mouse. 
  - The text *inside* the button moves at half the speed of the outer border, creating an internal 3D refraction effect.
  - Hover exit triggers an aggressive bouncing elastic release (`elastic.out(1, 0.3)`).
  - Mouse down triggers realistic foam-like compression (`scale: 0.95`).
- **Atmospheric Exit Glow**: At the absolute physical bottom of the webpage scroll, a background depth-overlay darkens the scene to `0.8` opacity, serving as a subtle lighting cue that the experience has successfully concluded.
