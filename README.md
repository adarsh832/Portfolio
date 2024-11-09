# 🚀 Modern Portfolio Website

A sleek, responsive, and interactive portfolio website built with HTML, CSS, and JavaScript. Features modern design elements, smooth animations, and a great user experience.

![Portfolio Preview](preview.gif)

## ✨ Features

### 🎯 Core Features
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI/UX**: Clean and professional interface
- **Interactive Elements**: Engaging user interactions
- **Performance Optimized**: Fast loading and smooth animations
- **Cross-Browser Compatible**: Works on all modern browsers

### 🎨 Design Elements
- **Loading Screen**: Custom animated welcome screen for first-time visitors
- **Smooth Scrolling**: Fluid navigation throughout the site
- **Animated Sections**: Elements animate as they enter viewport
- **Dynamic Skills Bars**: Interactive skill representation
- **Project Showcase**: Filterable project gallery
- **Custom 404 Page**: Space-themed error page with interactive elements

### 📱 Key Sections
1. **Hero Section**
   - Professional introduction
   - Call-to-action buttons
   - Social media links
   - Animated background

2. **About Section**
   - Professional summary
   - Key information
   - Education timeline
   - Experience stats

3. **Projects Section**
   - Project filtering
   - Project cards with hover effects
   - Live demo & code links
   - Technology tags

4. **Skills Section**
   - Categorized skills
   - Animated progress bars
   - Tool proficiency
   - Technology stack

5. **Contact Section**
   - Contact form with EmailJS integration
   - Social media links
   - Location information
   - Professional email

## 🛠️ Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  
- **Libraries & APIs**:
  - Font Awesome
  - Google Fonts
  - EmailJS
  - reCAPTCHA

- **Security**:
  - Content Security Policy
  - XSS Protection
  - CSRF Protection
  - Rate Limiting

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/adarsh832/portfolio.git
   ```

2. **Setup EmailJS**
   - Create an EmailJS account
   - Set up an email service
   - Create an email template
   - Update credentials in `script.js`

3. **Customize Content**
   - Update personal information
   - Add project details
   - Modify skills and percentages
   - Add your own images

4. **Deploy**
   - Host on GitHub Pages
   - Or deploy to Netlify/Vercel

## 📂 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── 404.html               # Custom 404 error page
├── checklist.txt          # Development checklist
├── preview.gif            # Portfolio preview
├── .htaccess              # Apache server configuration
├── web.config             # IIS server configuration
├── netlify.toml           # Netlify configuration
├── vercel.json            # Vercel configuration
├── css/
│   ├── style.css         # Main stylesheet
│   ├── loading-screen.css # Loading screen styles
│   └── 404.css           # 404 page styles
├── js/
│   ├── script.js         # Main JavaScript file
│   ├── loading-screen.js # Loading screen functionality
│   └── 404.js           # 404 page interactions
├── images/
│   ├── profile.jpg       # Profile picture
│   ├── about-image.jpg   # About section image
│   ├── project1.jpg      # Project screenshot
│   ├── project2.jpg      # Project screenshot
│   └── project3.jpg      # Project screenshot
└── templates/
    └── email.html        # EmailJS template
```

### 📁 Directory Structure Explanation

#### Root Files
- `index.html`: Main entry point
- `404.html`: Custom error page
- Configuration files for different hosting platforms

#### CSS Directory
- Organized stylesheets for different components
- Modular approach for better maintenance

#### JavaScript Directory
- Separated functionality into logical modules
- Enhanced maintainability and debugging

#### Images Directory
- Optimized images for web
- Project screenshots and personal photos

#### Templates Directory
- Email templates for contact form
- Customizable message formats

## 🔧 Development Setup

1. **Prerequisites**
   - Web browser
   - Text editor (VS Code recommended)
   - Basic knowledge of HTML, CSS, JS

2. **Local Development**
   ```bash
   # Clone repository
   git clone https://github.com/adarsh832/portfolio.git

   # Navigate to project
   cd portfolio

   # Open in browser
   # Use Live Server or similar tool
   ```

3. **File Organization**
   - Keep images in `/images`
   - Styles in `/css`
   - Scripts in `/js`
   - Templates in `/templates`

4. **Best Practices**
   - Comment your code
   - Use consistent naming
   - Optimize images
   - Validate HTML/CSS
   - Test cross-browser compatibility
