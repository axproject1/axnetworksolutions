/* ═══════════════════════════════════════════════════════════════════
   AX NETWORK — PREMIUM SCRIPT & INTERACTION ENGINE
   Theme Switching, Real-Time Cotizador, Service Filtering, FAQ & Glass
   ═══════════════════════════════════════════════════════════════════ */

// 1. Theme Management (Dark by default, persistent with localStorage)
const getPreferredTheme = () => {
  const saved = localStorage.getItem('ax-theme');
  if (saved) return saved;
  return 'dark'; // Dark is default
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ax-theme', theme);

  // Update theme-color meta tag for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#07090e' : '#f8fafc');
  }
};

window.toggleTheme = function () {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const nextTheme = current === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
};

// Initialize Theme immediately to prevent flicker
setTheme(getPreferredTheme());

function initApp() {
  // ── 1. Theme Toggle (assigned with .onclick to prevent duplicate listeners) ──
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.onclick = function (e) {
      if (e) e.preventDefault();
      window.toggleTheme();
    };
  }

  // ── 2. Mobile Menu Toggle ──
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── 3. Interactive Service Category Filters ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (filterBtns.length > 0 && serviceCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || 'all';

        serviceCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category === filter || category.includes(filter)) {
            card.classList.remove('is-hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // ── 4. Interactive Quick-Quote Estimator (Cotizador Dinámico) ──
  const quoteSection = document.getElementById('cotizador');
  if (quoteSection) {
    const serviceButtons = quoteSection.querySelectorAll('[data-step="service"]');
    const modalityButtons = quoteSection.querySelectorAll('[data-step="modality"]');
    const quotePriceEl = document.getElementById('quotePrice');
    const quoteDescEl = document.getElementById('quoteDesc');
    const quoteWhatsAppBtn = document.getElementById('quoteWhatsAppBtn');

    let currentService = 'diagnostico';
    let currentModality = 'remoto';

    const pricingMatrix = {
      'diagnostico': {
        name: 'Diagnóstico & Mantenimiento',
        prices: {
          'remoto': { label: '$15 — $20', text: 'Diagnóstico remoto exprés y evaluación inicial.' },
          'domicilio': { label: '$25 — $35', text: 'Visita técnica presencial a tu domicilio u oficina en Panamá.' },
          'taller': { label: '$20 — $30', text: 'Revisión técnica minuciosa en taller AX Network con reporte escrito.' }
        }
      },
      'optimizacion': {
        name: 'Optimización de Rendimiento',
        prices: {
          'remoto': { label: '$20 — $35', text: 'Limpieza de software basura, temperaturas, Windows tuning y arranque rápido.' },
          'domicilio': { label: '$35 — $45', text: 'Optimización integral presencial + revisión física de hardware.' },
          'taller': { label: '$30 — $45', text: 'Optimización profunda con prueba de estrés y garantía de satisfacción.' }
        }
      },
      'impresiones': {
        name: 'Impresiones & Copias',
        prices: {
          'remoto': { label: 'Desde $0.50', text: 'Envíanos tus archivos por WhatsApp y los tenemos listos para entrega.' },
          'domicilio': { label: 'Según volumen', text: 'Impresión y entrega a domicilio para proyectos o empresas.' },
          'taller': { label: 'Desde $0.10', text: 'Atención directa para copias, impresiones a color o b/n de alta calidad.' }
        }
      },
      'redes': {
        name: 'Redes & Infraestructura',
        prices: {
          'remoto': { label: '$30 — $50', text: 'Configuración remota de routers, VPN, firewall y Wi-Fi.' },
          'domicilio': { label: '$50 — $80+', text: 'Inspección de cobertura, cableado estructurado y puesta en marcha in situ.' },
          'taller': { label: 'A convenir', text: 'Configuración de servidores, NAS y equipos de red previo a despliegue.' }
        }
      },
      'empresas': {
        name: 'Soporte Empresarial / Pymes',
        prices: {
          'remoto': { label: '$45+', text: 'Asistencia y soporte informático rápido por ticket o sesión remota.' },
          'domicilio': { label: 'Planes a medida', text: 'Auditoría presencial, mantenimiento preventivo y contratos SLA mensuales.' },
          'taller': { label: 'Planes a medida', text: 'Preparación de flotas de computadoras, formateo masivo y clonación.' }
        }
      }
    };

    const updateQuote = () => {
      const serviceData = pricingMatrix[currentService] || pricingMatrix['diagnostico'];
      const modalityData = serviceData.prices[currentModality] || serviceData.prices['remoto'];

      if (quotePriceEl) quotePriceEl.innerHTML = `${modalityData.label} <small>USD estimado</small>`;
      if (quoteDescEl) quoteDescEl.textContent = modalityData.text;

      if (quoteWhatsAppBtn) {
        const modalityNames = {
          'remoto': 'Remoto (Online)',
          'domicilio': 'A Domicilio / Oficina',
          'taller': 'En Taller AX Network'
        };
        const msg = encodeURIComponent(
          `Hola AX Network. Estuve usando el cotizador de la web y me interesa:\n\n` +
          `• Servicio: ${serviceData.name}\n` +
          `• Modalidad: ${modalityNames[currentModality] || currentModality}\n` +
          `• Rango estimado: ${modalityData.label} USD\n\n` +
          `¿Podrían confirmarme disponibilidad y detalles para coordinar?`
        );
        quoteWhatsAppBtn.href = `https://wa.me/50769110901?text=${msg}`;
      }
    };

    serviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        serviceButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentService = btn.getAttribute('data-value');
        updateQuote();
      });
    });

    modalityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modalityButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentModality = btn.getAttribute('data-value');
        updateQuote();
      });
    });

    updateQuote();
  }

  // ── 5. FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others for clean accordion experience
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open', !isOpen);
      });
    }
  });

  // ── 6. Apple Spotlight Cursor Tracking ──
  const spotlightTargets = document.querySelectorAll(
    '.service-card, .print-card, .price-plan, .info-card, .founder-card, .team-card, .mv-card, .value-card, .why-card, .trust-card, .testimonial-card, .metric-card, .quote-box, .stat-card, .contact-card'
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

  // ── 7. Cinematic Scroll Reveal Observer ──
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── 8. Editorial Hero Slider Interactive Controller ──
  const heroNextBtn = document.getElementById('heroNextBtn');
  const heroTrackRail = document.getElementById('heroTrackRail');
  const heroTrackThumb = document.getElementById('heroTrackThumb');
  const heroTrackCurrent = document.getElementById('heroTrackCurrent');
  const heroTrackLegend = document.getElementById('heroTrackLegend');
  const heroMainTitle = document.querySelector('.editorial-main-title');
  const heroEyebrow = document.querySelector('.editorial-eyebrow-text');
  const heroDesc = document.querySelector('.editorial-desc');
  const heroSlideImg = document.getElementById('heroSlideImg');

  if (heroNextBtn && heroSlideImg) {
    const slides = [
      {
        digit: '01',
        eyebrow: 'PROPÓSITO & COMPROMISO AX NETWORK',
        title: 'LA TECNOLOGÍA DEBE<br><span class="editorial-title-highlight">TRABAJAR PARA TI.</span>',
        desc: 'Sin caídas, sin lentitud ni complicaciones. Soporte técnico preventivo, infraestructura de redes seguras y optimización avanzada para empresas y particulares en Panamá con diagnóstico transparente y garantía por escrito.',
        img: 'img/hero-bg.webp',
        alt: 'AX Network — La tecnología debe trabajar para ti',
        legend: 'Tecnología a tu Servicio',
        thumbPos: '0%'
      },
      {
        digit: '02',
        eyebrow: 'CONECTIVIDAD EMPRESARIAL · REDES SEGURAS',
        title: 'REDES &<br><span class="editorial-title-highlight">SERVIDORES</span>',
        desc: 'Cableado estructurado, configuración de routers Cisco y MikroTik, almacenamiento centralizado Synology NAS y enlace seguro VPN para tu negocio sin caídas.',
        img: 'img/empresas-img.webp',
        alt: 'AX Network — Infraestructura de Redes y Soluciones Corporativas',
        legend: 'Infraestructura & Redes',
        thumbPos: '25%'
      },
      {
        digit: '03',
        eyebrow: 'CONTINUIDAD OPERATIVA · PLANES A MEDIDA',
        title: 'SOPORTE<br><span class="editorial-title-highlight">EMPRESARIAL</span>',
        desc: 'Mantenimiento preventivo mensual, administración de parques informáticos, acuerdos de nivel de servicio (SLA) y consultoría TI para oficinas y comercios en Panamá.',
        img: 'img/contacto-bg.webp',
        alt: 'AX Network — Soporte y Soluciones Informáticas para Empresas en Panamá',
        legend: 'Empresas & Pymes',
        thumbPos: '50%'
      },
      {
        digit: '04',
        eyebrow: 'MÁXIMA VELOCIDAD · RENDIMIENTO GARANTIZADO',
        title: 'OPTIMIZACIÓN<br><span class="editorial-title-highlight">DE COMPUTADORAS</span>',
        desc: 'Aceleración de arranque, limpieza profunda de virus y telemetría, actualización limpia de controladores y tuning térmico. Si no notas una mejora real, te devolvemos tu dinero.',
        img: 'img/optimizacion-pc.webp',
        alt: 'AX Network — Optimización de Computadoras y Rendimiento',
        legend: 'Rendimiento Garantizado',
        thumbPos: '75%'
      }
    ];

    let currentSlide = 0;

    const renderSlide = (idx) => {
      const slide = slides[idx];
      currentSlide = idx;

      if (heroSlideImg) {
        heroSlideImg.style.opacity = '0.4';
        heroSlideImg.style.transform = 'scale(0.98)';
      }
      if (heroMainTitle) {
        heroMainTitle.style.opacity = '0.3';
        heroMainTitle.style.transform = 'translateY(6px)';
      }

      setTimeout(() => {
        if (heroTrackCurrent) heroTrackCurrent.textContent = slide.digit;
        if (heroTrackLegend) heroTrackLegend.textContent = slide.legend;
        if (heroTrackThumb) heroTrackThumb.style.left = slide.thumbPos;
        if (heroEyebrow) heroEyebrow.textContent = slide.eyebrow;
        if (heroMainTitle) heroMainTitle.innerHTML = slide.title;
        if (heroDesc) heroDesc.textContent = slide.desc;
        if (heroSlideImg) {
          heroSlideImg.src = slide.img;
          heroSlideImg.alt = slide.alt;
          heroSlideImg.style.opacity = '1';
          heroSlideImg.style.transform = 'scale(1)';
        }
        if (heroMainTitle) {
          heroMainTitle.style.opacity = '1';
          heroMainTitle.style.transform = 'translateY(0)';
        }
      }, 180);
    };

    heroNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const next = (currentSlide + 1) % slides.length;
      renderSlide(next);
    });

    if (heroTrackRail) {
      heroTrackRail.addEventListener('click', () => {
        const next = (currentSlide + 1) % slides.length;
        renderSlide(next);
      });
    }
  }

  // ── 9. EmailJS Contact Form Controller ──
  const emailForm = document.getElementById('emailContactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (emailForm) {
    const EMAILJS_CONFIG = {
      serviceId: 'service_1z6pl5g',
      templateId: 'template_t7n3bu1',
      // Clave pública oficial de EmailJS
      publicKey: window.EMAILJS_PUBLIC_KEY || 'JeIBNGDL48k5cD7sI'
    };

    if (window.emailjs && EMAILJS_CONFIG.publicKey) {
      try {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      } catch (err) {
        console.warn('EmailJS init warning:', err);
      }
    }

    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!formStatus || !submitBtn) return;

      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      // Estado de carga
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';
      formStatus.style.display = 'none';
      formStatus.className = 'form-status';

      const formData = {
        from_name: document.getElementById('contactName')?.value.trim() || '',
        from_email: document.getElementById('contactEmail')?.value.trim() || '',
        phone: document.getElementById('contactPhone')?.value.trim() || 'No especificado',
        service: document.getElementById('contactService')?.value || 'Consulta General',
        message: document.getElementById('contactMessage')?.value.trim() || '',
        to_name: 'AX Network Solutions Group',
        date: new Date().toLocaleString()
      };

      try {
        const hasKey = EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY';
        if (window.emailjs && hasKey) {
          await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData, EMAILJS_CONFIG.publicKey);
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>¡Mensaje enviado con éxito!</strong><br>
            Gracias ${formData.from_name}, recibimos tu solicitud. Te responderemos a <em>${formData.from_email}</em> a la brevedad.
          `;
          formStatus.style.display = 'block';
          emailForm.reset();
        } else {
          // Fallback asistido a mailto directo si falta la clave pública en el dashboard
          const mailtoSubject = encodeURIComponent(`Consulta AX Network: ${formData.service} — ${formData.from_name}`);
          const mailtoBody = encodeURIComponent(
            `Hola AX Network,\n\n` +
            `Nombre: ${formData.from_name}\n` +
            `Correo: ${formData.from_email}\n` +
            `Teléfono: ${formData.phone}\n` +
            `Línea de Interés: ${formData.service}\n\n` +
            `Mensaje:\n${formData.message}\n\n` +
            `Enviado desde el formulario web de AX Network.`
          );

          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>¡Mensaje preparado!</strong><br>
            Se ha generado tu correo. Si tu aplicación no abrió automáticamente, <a href="mailto:ax.studios01@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}" class="status-mailto-link" target="_blank">haz clic aquí para enviar</a> o escríbenos a <a href="https://wa.me/50769110901" target="_blank">WhatsApp</a>.
          `;
          formStatus.style.display = 'block';
          window.location.href = `mailto:ax.studios01@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        }
      } catch (err) {
        console.error('EmailJS error:', err);
        const mailtoSubject = encodeURIComponent(`Consulta AX Network: ${formData.service} — ${formData.from_name}`);
        const mailtoBody = encodeURIComponent(
          `Nombre: ${formData.from_name}\n` +
          `Correo: ${formData.from_email}\n` +
          `Teléfono: ${formData.phone}\n` +
          `Servicio: ${formData.service}\n\n` +
          `Mensaje:\n${formData.message}`
        );

        formStatus.className = 'form-status error';
        formStatus.innerHTML = `
          <strong>No se pudo enviar automáticamente.</strong><br>
          Puedes <a href="mailto:ax.studios01@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}" class="status-mailto-link">enviar el correo directamente aquí</a> o escribirnos por <a href="https://wa.me/50769110901" target="_blank">WhatsApp</a>.
        `;
        formStatus.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-flex';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }
}

// Guarantee execution whether ready or still loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
