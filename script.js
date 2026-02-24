/* ============================================
   Alex Claudio Ventures LLC — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initModals();
  initContactForm();
});

/* --- Navigation scroll effect + active link --- */
function initNav() {
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Frosted glass on scroll
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --- Mobile menu --- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Smooth scroll for anchor links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* --- Scroll reveal (IntersectionObserver) --- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(el => observer.observe(el));
}

/* --- Modals (Privacy Policy + Terms of Service) --- */
function initModals() {
  // Open modals
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal + 'Modal';
      const modal = document.getElementById(modalId);
      if (modal) modal.showModal();
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('dialog').close();
    });
  });

  // Close on backdrop click
  document.querySelectorAll('.legal-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  });

  // Close on Escape (native dialog behavior, but ensure body scroll restores)
  document.querySelectorAll('.legal-modal').forEach(modal => {
    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });
}

/* --- Contact form --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showFormStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Build subject line from dropdown
    const subjectMap = {
      'app-support': 'App Support Request',
      'wit-feedback': 'Wit App Feedback',
      'tadam-feedback': 'Tadam App Feedback',
      'business': 'Business Inquiry',
      'other': 'General Inquiry'
    };

    const subjectLine = subjectMap[subject] || subject;

    // mailto fallback
    const mailto = 'mailto:support@alexclaudioventuresllc.com'
      + '?subject=' + encodeURIComponent(subjectLine + ' - from ' + name)
      + '&body=' + encodeURIComponent(
        message + '\n\n---\nFrom: ' + name + '\nReply to: ' + email
      );

    window.location.href = mailto;
    showFormStatus('Opening your email client...', 'success');

    // Reset form after short delay
    setTimeout(() => form.reset(), 2000);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormStatus(message, type) {
  const status = document.getElementById('formStatus');
  if (!status) return;
  status.className = 'form-status form-status-' + type;
  status.textContent = message;
  setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
}
