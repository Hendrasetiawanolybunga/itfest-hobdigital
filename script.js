'use strict';

// 1. DOMCONTENTLOADED — ENTRY POINT
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSmoothScroll();
  initHamburgerMenu();
  initActiveNavLink();
  initScrollAnimations();
  initPortfolioFilter();
  initBackToTop();
  initContactForm();
});

// 2. GLASSMORPHISM NAVBAR SAAT SCROLL
function initNavbarScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  let ticking = false;

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  handleScroll();
}

// 3. SMOOTH SCROLLING
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const NAVBAR_HEIGHT = 72;

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetElement = document.querySelector(href);
      if (!targetElement) return;

      e.preventDefault();

      const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });

      closeMobileMenu();
    });
  });
}

// 4. HAMBURGER MENU MOBILE TOGGLE
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks     = document.getElementById('nav-links');

function initHamburgerMenu() {
  if (!hamburgerBtn || !navLinks) return;

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    toggleMobileMenu(!isOpen);
  });

  document.addEventListener('click', (e) => {
    const isMenuOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    if (!isMenuOpen) return;

    const clickedInsideNav = navLinks.contains(e.target);
    const clickedHamburger = hamburgerBtn.contains(e.target);

    if (!clickedInsideNav && !clickedHamburger) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

function toggleMobileMenu(open) {
  if (!hamburgerBtn || !navLinks) return;
  hamburgerBtn.setAttribute('aria-expanded', String(open));
  hamburgerBtn.classList.toggle('is-open', open);
  navLinks.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMobileMenu() {
  toggleMobileMenu(false);
}

// 5. ACTIVE NAV LINK — INTERSECTIONOBSERVER
function initActiveNavLink() {
  const sections   = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinkEls.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-72px 0px -40% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const sectionId = entry.target.getAttribute('id');

      navLinkEls.forEach((link) => link.classList.remove('active'));

      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// 6. ANIMASI SCROLL — INTERSECTION OBSERVER
function initScrollAnimations() {
  const elementsToAnimate = [
    '.section-header',
    '.service-card',
    '.portfolio-item',
    '.tentang-visual',
    '.tentang-text',
    '.kontak-info',
    '.kontak-form-wrap',
    '.hero-stats',
    '.jam-operasional',
  ];

  const targets = document.querySelectorAll(elementsToAnimate.join(', '));

  targets.forEach((el) => el.classList.add('animate-on-scroll'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    }
  );

  targets.forEach((el) => observer.observe(el));
}

// 7. FILTER TAB PORTOFOLIO
function initPortfolioFilter() {
  const tabButtons     = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (!tabButtons.length || !portfolioItems.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      portfolioItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'semua' || category === filter;

        if (shouldShow) {
          item.classList.remove('hidden');
          item.style.transitionDelay = `${index * 0.05}s`;
        } else {
          item.classList.add('hidden');
          item.style.transitionDelay = '0s';
        }
      });
    });
  });
}

// 8. BACK TO TOP BUTTON
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  let ticking = false;

  function handleBackToTopVisibility() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleBackToTopVisibility);
      ticking = true;
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 9. VALIDASI FORMULIR KONTAK
function initContactForm() {
  const form       = document.getElementById('contact-form');
  if (!form) return;

  const namaInput  = document.getElementById('input-nama');
  const emailInput = document.getElementById('input-email');
  const pesanInput = document.getElementById('input-pesan');
  const submitBtn  = document.getElementById('submit-btn');

  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  function showError(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
    input.classList.add('is-error');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input, errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = '';
    input.classList.remove('is-error');
    input.removeAttribute('aria-invalid');
  }

  function validateNama() {
    const value = namaInput.value.trim();
    if (!value) {
      showError(namaInput, 'error-nama', 'Nama lengkap wajib diisi.');
      return false;
    }
    if (value.length < 2) {
      showError(namaInput, 'error-nama', 'Nama minimal 2 karakter.');
      return false;
    }
    clearError(namaInput, 'error-nama');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      showError(emailInput, 'error-email', 'Alamat email wajib diisi.');
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      showError(emailInput, 'error-email', 'Format email tidak valid. Contoh: nama@domain.com');
      return false;
    }
    clearError(emailInput, 'error-email');
    return true;
  }

  function validatePesan() {
    const value = pesanInput.value.trim();
    if (!value) {
      showError(pesanInput, 'error-pesan', 'Pesan wajib diisi.');
      return false;
    }
    if (value.length < 10) {
      showError(pesanInput, 'error-pesan', 'Pesan terlalu singkat. Minimal 10 karakter.');
      return false;
    }
    clearError(pesanInput, 'error-pesan');
    return true;
  }

  namaInput.addEventListener('blur',  validateNama);
  emailInput.addEventListener('blur', validateEmail);
  pesanInput.addEventListener('blur', validatePesan);

  namaInput.addEventListener('input',  () => clearError(namaInput,  'error-nama'));
  emailInput.addEventListener('input', () => clearError(emailInput, 'error-email'));
  pesanInput.addEventListener('input', () => clearError(pesanInput, 'error-pesan'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNamaValid  = validateNama();
    const isEmailValid = validateEmail();
    const isPesanValid = validatePesan();

    if (!isNamaValid || !isEmailValid || !isPesanValid) {
      if (!isNamaValid)       namaInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else                    pesanInput.focus();
      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText ? btnText.textContent : 'Kirim Pesan';

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    if (btnText) btnText.textContent = 'Mengirim...';

    await delay(1500);

    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    if (btnText) btnText.textContent = originalText;

    showSuccessMessage();
    form.reset();
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showSuccessMessage() {
  const existing = document.getElementById('success-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'success-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  Object.assign(toast.style, {
    position:      'fixed',
    bottom:        '32px',
    left:          '50%',
    transform:     'translateX(-50%) translateY(20px)',
    background:    'linear-gradient(135deg, #0A192F 0%, #112240 100%)',
    border:        '1px solid rgba(0, 216, 255, 0.4)',
    borderRadius:  '12px',
    padding:       '16px 24px',
    color:         '#00D8FF',
    fontSize:      '0.9rem',
    fontWeight:    '600',
    fontFamily:    "'Inter', sans-serif",
    boxShadow:     '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0, 216, 255, 0.2)',
    zIndex:        '9999',
    maxWidth:      '90vw',
    textAlign:     'center',
    opacity:       '0',
    transition:    'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    pointerEvents: 'none',
    whiteSpace:    'nowrap',
  });

  toast.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> Pesan berhasil dikirim! Kami akan segera menghubungi Anda.';
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// 10. CURSOR GLOW EFFECT
function initCursorGlow() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:      'fixed',
    pointerEvents: 'none',
    width:         '300px',
    height:        '300px',
    borderRadius:  '50%',
    background:    'radial-gradient(circle, rgba(0,216,255,0.06) 0%, transparent 70%)',
    transform:     'translate(-50%, -50%)',
    zIndex:        '0',
    transition:    'left 0.1s ease, top 0.1s ease',
    willChange:    'left, top',
  });

  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initCursorGlow);
