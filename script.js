(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#nav-links');
  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
    };
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const copyButton = document.querySelector('#copy-email');
  const toast = document.querySelector('#toast');
  let toastTimer;
  const showToast = message => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  };
  const fallbackCopy = value => {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  };
  copyButton?.addEventListener('click', async () => {
    const value = 'kuzinev@yandex.ru';
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
      else if (!fallbackCopy(value)) throw new Error('Copy failed');
      showToast('Адрес скопирован');
    } catch {
      showToast(fallbackCopy(value) ? 'Адрес скопирован' : 'Не удалось скопировать адрес');
    }
  });

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-copy > *', {opacity:0,y:20,duration:.7,stagger:.11,ease:'power2.out',clearProps:'opacity,transform'});
  gsap.from('.hero-product', {opacity:0,y:30,scale:.95,duration:1,ease:'power2.out',delay:.2,clearProps:'opacity,transform'});
  if (window.matchMedia('(min-width: 769px)').matches) {
    gsap.from('.float-card', {opacity:0,x:25,duration:.65,stagger:.1,delay:.45,ease:'power2.out',clearProps:'opacity,transform'});
    gsap.to('.float-card', {y:'-=7',duration:2.4,stagger:.25,ease:'sine.inOut',repeat:-1,yoyo:true});
    gsap.to('.hero-background img', {yPercent:6,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  }

  document.querySelectorAll('.section-head,.product-copy,.product-art,.benefit-card,.life-card,.opportunity-card,.story-card,.final-content').forEach(element => {
    gsap.from(element, {opacity:0,y:22,duration:.65,ease:'power2.out',clearProps:'opacity,transform',scrollTrigger:{trigger:element,start:'top 92%',once:true}});
  });
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
})();
