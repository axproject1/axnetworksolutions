/* ═══════════════════════════════════════════════════════════════════
   AX NETWORK — CINEMATIC APPLE SCRIPT
   Theme Switcher (Light Default & Dark), Spotlight, Reveals & Glass
   ═══════════════════════════════════════════════════════════════════ */

// 1. Theme Management (Light by default, persistent with localStorage)
const getPreferredTheme = () => {
  const saved = localStorage.getItem('ax-theme');
  if (saved) return saved;
  return 'light'; // Light is the default as requested
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ax-theme', theme);

  // Update theme-color meta tag for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#020408' : '#f8fafc');
  }
};

// Initialize Theme immediately
const initialTheme = getPreferredTheme();
setTheme(initialTheme);

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a navigation link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // 3. Apple Spotlight Cursor Tracking for Bento & Glass Cards
  const spotlightTargets = document.querySelectorAll(
    '.service-card, .print-card, .price-plan, .info-card, .founder-card, .team-card, .mv-card, .value-card, .why-card, .why-solution-item, .about-intro-box, .img-slot-container, .stat-card'
  );

  spotlightTargets.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. Cinematic Scroll Reveal Observer (Smooth Stagger & Blur Release)
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Calculate stagger delay if sibling cards exist
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
        const index = siblings.indexOf(entry.target);
        const delay = index > -1 ? index * 70 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
});
