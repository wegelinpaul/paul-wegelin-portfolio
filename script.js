// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade sections
document.addEventListener('DOMContentLoaded', () => {
    const fadeSections = document.querySelectorAll('.fade-section');
    fadeSections.forEach(section => {
        observer.observe(section);
    });

    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });

        // Add shadow to navbar on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu after clicking a link
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Logo click scrolls to top
    document.querySelector('.nav-logo').addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
    });

    // Load theme preference from localStorage - default to dark mode
    const themeSwitch = document.getElementById('theme-switch');
    const savedTheme = localStorage.getItem('theme');

    // Default to dark mode if no preference is saved
    if (savedTheme === 'light') {
        themeSwitch.checked = false;
    } else {
        // Default to dark mode (when savedTheme is null or 'dark')
        themeSwitch.checked = true;
        if (!savedTheme) {
            localStorage.setItem('theme', 'dark');
        }
    }

    // Save theme preference
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Lightbox for private project images
    const privateImages = document.querySelectorAll('.private-card .project-image img');
    privateImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'lightbox-close';
            closeBtn.textContent = '\u00d7';
            closeBtn.setAttribute('aria-label', 'Close image');

            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;

            overlay.appendChild(closeBtn);
            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);

            // Trigger animation
            requestAnimationFrame(() => overlay.classList.add('active'));

            const closeLightbox = () => {
                overlay.classList.remove('active');
                overlay.addEventListener('transitionend', () => overlay.remove());
            };

            overlay.addEventListener('click', closeLightbox);
            closeBtn.addEventListener('click', closeLightbox);
            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    });

    // Animate stat numbers on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
});

// Animate numbers counting up
function animateNumber(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasStar = text.includes('★');
    const target = parseFloat(text.replace(/[^\d.]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        let displayValue;
        if (target % 1 !== 0) {
            displayValue = current.toFixed(1);
        } else {
            displayValue = Math.round(current);
        }

        element.textContent = displayValue + (hasPlus ? '+' : '') + (hasStar ? '★' : '');
    }, 16);
}
