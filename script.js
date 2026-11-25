const menuBtn=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰'});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');if(menuBtn)menuBtn.textContent='☰'}));const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.getElementById('year').textContent=new Date().getFullYear();

// Resource slider: swipe/scroll on touch devices and arrow navigation on all screens.
(() => {
  const track = document.getElementById('resourceSliderTrack');
  if (!track) return;
  const prev = document.querySelector('.resource-prev');
  const next = document.querySelector('.resource-next');
  const progress = document.getElementById('resourceSliderProgress');
  const step = () => {
    const card = track.querySelector('.resource-slide');
    return card ? card.getBoundingClientRect().width + 18 : track.clientWidth * 0.8;
  };
  prev?.addEventListener('click', () => track.scrollBy({left: -step(), behavior: 'smooth'}));
  next?.addEventListener('click', () => track.scrollBy({left: step(), behavior: 'smooth'}));
  const update = () => {
    if (!progress) return;
    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? (track.scrollLeft / max) * 80 + 20 : 100;
    progress.style.width = pct + '%';
  };
  track.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();


// Automatic resource slider: advance one card every 2 seconds.
(() => {
  const track = document.getElementById('resourceSliderTrack');
  if (!track) return;

  let autoTimer = null;
  let resumeTimer = null;

  const getStep = () => {
    const card = track.querySelector('.resource-slide');
    if (!card) return track.clientWidth * 0.8;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 18;
    return card.getBoundingClientRect().width + gap;
  };

  const stopAuto = () => {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = null;
    if (resumeTimer) window.clearTimeout(resumeTimer);
    resumeTimer = null;
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = window.setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 2) return;
      if (track.scrollLeft >= maxScroll - 3) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getStep(), behavior: 'smooth' });
      }
    }, 2000);
  };

  const pauseAndResume = () => {
    stopAuto();
    resumeTimer = window.setTimeout(startAuto, 5000);
  };

  track.addEventListener('pointerdown', pauseAndResume);
  track.addEventListener('touchstart', pauseAndResume, { passive: true });
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  track.addEventListener('focusin', stopAuto);
  track.addEventListener('focusout', startAuto);

  document.querySelector('.resource-prev')?.addEventListener('click', pauseAndResume);
  document.querySelector('.resource-next')?.addEventListener('click', pauseAndResume);

  startAuto();
})();
