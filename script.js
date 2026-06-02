const WHATSAPP_NUMBER = '918340130295';
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

document.addEventListener('DOMContentLoaded', () => {
  setupPreloader();
  setupMenu();
  setupOrderBuilder();
  setupDishButtons();
  setupFAQ();
  setupMagneticButtons();

  if (!prefersReduced && window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    setupAnimations();
    setupCounters();
    setupHeroParallax();
  } else {
    document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }
});

function setupPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('hide'), 450);
  });
}

function setupMenu() {
  const toggle = document.getElementById('menuToggle');
  const links = document.querySelectorAll('#navLinks a');

  toggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupAnimations() {
  gsap.set('.line-wrap span', { yPercent: 115 });
  gsap.set('.reveal-up', { y: 38, opacity: 0 });
  gsap.set('.reveal-left', { x: -46, opacity: 0 });
  gsap.set('.reveal-right', { x: 46, opacity: 0 });
  gsap.set('.hero-visual', { opacity: 0, y: 36, rotate: 1 });

  const heroTl = gsap.timeline({ delay: 0.65, defaults: { ease: 'power4.out' } });
  heroTl
    .to('.line-wrap span', { yPercent: 0, duration: 1.1, stagger: 0.11 })
    .to('.hero .reveal-up', { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '-=0.72')
    .to('.hero-visual', { opacity: 1, y: 0, rotate: 0, duration: 1 }, '-=0.9')
    .from('.floating-ticket', { y: 20, opacity: 0, duration: 0.75, stagger: 0.12 }, '-=0.55');

  document.querySelectorAll('.reveal-up').forEach(el => {
    if (el.closest('.hero')) return;
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  document.querySelectorAll('.reveal-left').forEach(el => {
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 84%' }
    });
  });

  document.querySelectorAll('.reveal-right').forEach(el => {
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 84%' }
    });
  });

  gsap.to('.plate-card', {
    y: -22,
    rotate: 2,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  if (!isMobile) {
    gsap.to('.signature .section-head', {
      y: -70,
      ease: 'none',
      scrollTrigger: { trigger: '.signature', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    gsap.to('.gallery-tile:nth-child(odd)', {
      y: -30,
      ease: 'none',
      scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
}

function setupCounters() {
  document.querySelectorAll('[data-counter]').forEach(counter => {
    const target = Number(counter.dataset.counter);
    const decimals = String(target).includes('.') ? 1 : 0;
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(counter, { innerText: 0 }, {
          innerText: target,
          duration: 1.45,
          ease: 'power2.out',
          snap: { innerText: decimals ? 0.1 : 1 },
          onUpdate: () => {
            counter.innerText = Number(counter.innerText).toFixed(decimals).replace('.0','');
          }
        });
      }
    });
  });
}

function setupHeroParallax() {
  const visual = document.querySelector('[data-parallax]');
  if (!visual || isMobile) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to(visual, { x, y, duration: 0.8, ease: 'power3.out' });
  });
}

function setupOrderBuilder() {
  const link = document.getElementById('whatsappLink');
  const preview = document.getElementById('messagePreview');
  const fields = ['orderType', 'itemInterest', 'preferredTime', 'customerName'].map(id => document.getElementById(id));

  function buildMessage() {
    const [type, item, time, name] = fields.map(field => field?.value?.trim() || '');
    const message = `Hi Zaika House, I want to place an enquiry.\n\nName: ${name || 'Not added'}\nOrder type: ${type}\nItem interest: ${item}\nPreferred time: ${time || 'Please suggest available time'}\n\nPlease confirm availability and final price.`;
    if (preview) preview.textContent = message;
    if (link) link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  fields.forEach(field => field?.addEventListener('input', buildMessage));
  fields.forEach(field => field?.addEventListener('change', buildMessage));
  buildMessage();
}

function setupDishButtons() {
  document.querySelectorAll('.order-dish').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.dish-card');
      const item = card?.dataset.item || 'a menu item';
      const message = `Hi Zaika House, I want to order ${item}. Please confirm availability and price.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
  });
}

function setupFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const button = item.querySelector('button');
    const panel = item.querySelector('p');
    if (item.classList.contains('active') && panel) panel.style.height = panel.scrollHeight + 'px';

    button?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(other => {
        other.classList.remove('active');
        const p = other.querySelector('p');
        if (p) p.style.height = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        if (panel) panel.style.height = panel.scrollHeight + 'px';
      }
    });
  });
}

function setupMagneticButtons() {
  if (isMobile || prefersReduced) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
}
