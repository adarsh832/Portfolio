# Adarsh Shah | Creative Engineer Portfolio

A high-performance, cinematic personal portfolio website designed to showcase engineering precision and creative system design. Built with a focus on motion, typography, and interactive storytelling.

![Portfolio Preview](screenshot.png) 
*(Note: Add a screenshot of your hero section here named screenshot.png)*

## 🚀 Features

*   **Cinematic Experience**: Heavy use of **GSAP** (GreenSock) for high-end scroll animations, parallax effects, and magnetic interactions.
*   **"Creative Engineer" Aesthetic**: A dark, architectural design system using a "Racing Green" and "Obsidian" palette.
*   **Interactive Project Gallery**: Custom-designed SVG illustrations for projects (APDATE, TRACKMANIA, GEMINI) that react to hover states.
*   **Functional Contact Form**: Integrated with **Formspree** via AJAX for seamless, no-redirect email submissions.
*   **Theme System**: Built-in Dark/Light mode toggle with persistence.
*   **Performance**: Pure HTML/JS structure with no heavy framework overhead. Tailwind CSS via CDN for rapid styling.

## 🛠️ Tech Stack

*   **Core**: HTML5, Vanilla JavaScript (ES6+)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
*   **Motion**: 
    *   [GSAP](https://greensock.com/gsap/) (Core, ScrollTrigger)
    *   [Lenis](https://github.com/studio-freight/lenis) (Smooth Scroll)
*   **Icons**: Material Icons Outlined, Custom SVGs
*   **Backend (Form)**: [Formspree](https://formspree.io/)

## 📂 Project Structure

```text
d:\Porfolio\
├── images/                 # Image Assets Directory
│   ├── favicon.svg         # Custom "AS" Monogram Favicon
│   ├── pp.jpeg             # Profile Picture
│   ├── project_apdate.svg  # App Illustration
│   ├── project_trackmania.svg # AI Racing Illustration
│   └── project_gemini.svg  # Linux Assistant Illustration
├── index.html              # Main application entry point
├── resume.pdf              # Downloadable CV
└── README.md               # Project Documentation
```

## ⚡ Quick Start

1.  **Clone or Download** this repository.
2.  **Open locally**:
    Simply double-click `index.html` to open it in your default browser.
    *   *Tip: For the best experience with smooth scrolling, use a local server (e.g., Live Server extension in VS Code).*

## 🔧 Customization

### 1. Contact Form
The form is currently connected to a demo Formspree endpoint. To make it yours:
1.  Go to [formspree.io](https://formspree.io) and create a form.
2.  Open `index.html` and search for `<form id="contact-form"`.
3.  Replace the `action` URL with your own:
    ```html
    <form action="https://formspree.io/f/YOUR_NEW_CODE" ...>
    ```

### 2. Updating Projects
Edit the `data-` attributes in the `#work` section of `index.html`:
```html
<div class="group ..." 
    data-title="NEW PROJECT" 
    data-desc="Description here..." 
    data-image="images/new_image.svg" 
    data-github="https://github.com/..."
>
```

### 3. Adding Resume
Ensure your PDF resume is named `resume.pdf` and placed in the root directory. The download button links to it automatically.

## 🎨 Design Philosophy

*   **Typography**: *Archivo Black* (Headlines) & *Inter* (Body) for a structured, industrial feel.
*   **Motion**: Animations are "weighted" to feel physical and deliberate, avoiding cheap, fast transitions.
*   **Visuals**: "Engineering" themes—grids, terminals, schematics, and clean lines.

## 📝 License

© 2026 Adarsh Shah. All Rights Reserved.
