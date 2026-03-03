/**
 * 病院ホームページ 共通JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFadeIn();
  initHeroSlider();
  initFaqAccordion();
  initBackToTop();
  initContactForm();
});

/* ---- Header ---- */
function initHeader() {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');

  // Scroll shadow
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // Hamburger menu
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close on overlay click
    nav.addEventListener('click', (e) => {
      if (e.target === nav) {
        hamburger.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ---- Fade-in on Scroll ---- */
function initFadeIn() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ---- Hero Slider (Fade) ---- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length <= 1) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, 5000);
}

/* ---- FAQ Accordion ---- */
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');

      // Close all
      document.querySelectorAll('.faq-item.is-open').forEach(el => {
        el.classList.remove('is-open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* ---- Back to Top ---- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Contact Form ---- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const confirmPanel = document.getElementById('confirm-panel');
  const successMessage = document.getElementById('success-message');
  const confirmBtn = document.getElementById('confirm-submit');
  const backBtn = document.getElementById('confirm-back');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showConfirmation(form, confirmPanel);
    }
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      confirmPanel.classList.remove('is-visible');
      form.style.display = '';
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmPanel.classList.remove('is-visible');
      if (successMessage) {
        successMessage.classList.add('is-visible');
      }
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('[data-required]');

  // Clear previous errors
  form.querySelectorAll('.form-error').forEach(el => el.classList.remove('is-visible'));
  form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));

  fields.forEach(field => {
    const value = field.value.trim();
    const errorEl = field.parentElement.querySelector('.form-error');

    if (!value) {
      field.classList.add('is-error');
      if (errorEl) {
        errorEl.textContent = 'この項目は必須です';
        errorEl.classList.add('is-visible');
      }
      isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add('is-error');
        if (errorEl) {
          errorEl.textContent = '正しいメールアドレスを入力してください';
          errorEl.classList.add('is-visible');
        }
        isValid = false;
      }
    }

    // Phone validation
    if (field.dataset.type === 'tel' && value) {
      const telRegex = /^[0-9\-+() ]+$/;
      if (!telRegex.test(value)) {
        field.classList.add('is-error');
        if (errorEl) {
          errorEl.textContent = '正しい電話番号を入力してください';
          errorEl.classList.add('is-visible');
        }
        isValid = false;
      }
    }
  });

  if (!isValid) {
    const firstError = form.querySelector('.is-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return isValid;
}

function showConfirmation(form, panel) {
  if (!panel) return;

  const fields = form.querySelectorAll('[data-label]');
  const container = panel.querySelector('.confirm-panel__body') || panel;

  // Clear previous
  const existingItems = panel.querySelectorAll('.confirm-panel__item');
  existingItems.forEach(el => el.remove());

  const actionsEl = panel.querySelector('.confirm-panel__actions');

  fields.forEach(field => {
    const item = document.createElement('div');
    item.className = 'confirm-panel__item';
    item.innerHTML = `
      <div class="confirm-panel__label">${escapeHtml(field.dataset.label)}</div>
      <div class="confirm-panel__value">${escapeHtml(field.value)}</div>
    `;
    if (actionsEl) {
      actionsEl.before(item);
    } else {
      panel.appendChild(item);
    }
  });

  form.style.display = 'none';
  panel.classList.add('is-visible');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
