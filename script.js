/* =========================================================
   SerinSound / Index-First (Long Document) variant
   Studied DNA: usehallmark.com/_tests/06-anya-portfolio
   Dress: user's own Iosevka + cream/teal. Reuses data.json.
   ========================================================= */
const FEATURED_VIDEOS = [
  { id: 'bW8bLXIvt9c', title: 'a[NN]ime | Anime SFX Neural Synthesis' },
  { id: 'EeGkg0ya-Po', title: 'Auditory Environmental Storytelling | Do Fallen Leaves Tell a Story?' },
  { id: 'yVBhrGbOptU', title: 'Articulated Through Engine | Downshifting an Instrument' },
  { id: 'v7bAAhoWD_o', title: 'Engine Articulation | Building an Instrument' },
];

const SECTION_ORDER = ['exhibitions', 'commercial', 'performances', 'events', 'personal'];

document.addEventListener('DOMContentLoaded', function () {
  renderVideos();
  loadProjects();
  setupThemeToggle();
  setupScrollSpy();
  setupLightbox();
  setupDocLinks();
});

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------- ANALYTICS (GoatCounter custom events) ---------- */
function track(path, title) {
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: path, title: title, event: true });
    }
  } catch (e) {}
}
function slug(s) {
  return String(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // strip diacritics (e-acute -> e, c-cedilla -> c)
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

/* ---------- VIDEOS (facade) ---------- */
function renderVideos() {
  const wrap = document.getElementById('videos');
  if (!wrap) return;
  wrap.innerHTML = '';
  FEATURED_VIDEOS.forEach(v => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'video-card';
    card.setAttribute('aria-label', 'Play: ' + v.title);
    card.innerHTML = `
      <span class="video-thumb">
        <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
        <span class="video-play" aria-hidden="true">▶</span>
      </span>
      <span class="video-cap">${esc(v.title)}</span>`;
    card.addEventListener('click', () => {
      track('video/' + slug(v.title), 'Video: ' + v.title);
      const thumb = card.querySelector('.video-thumb');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
      iframe.title = v.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      thumb.replaceWith(iframe);
    }, { once: true });
    wrap.appendChild(card);
  });
}

/* ---------- WORKS ---------- */
async function loadProjects() {
  const list = document.getElementById('worklist');
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Could not load data.json. Run a local web server.');
    const projects = await res.json();
    projects.forEach((p, i) => (p._key = 'p' + i));

    const grouped = {};
    projects.forEach(p => (grouped[p.section] = grouped[p.section] || []).push(p));
    const order = SECTION_ORDER.filter(s => grouped[s])
      .concat(Object.keys(grouped).filter(s => !SECTION_ORDER.includes(s)));

    list.innerHTML = '';
    order.forEach(section => {
      const g = document.createElement('li');
      g.className = 'worklist__group';
      g.innerHTML = `<span>${esc(section)}</span><span class="g-count">${String(grouped[section].length).padStart(2, '0')}</span>`;
      list.appendChild(g);
      grouped[section].forEach(p => list.appendChild(createWork(p)));
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = `<li class="status">Error: ${esc(err.message)}</li>`;
  }
}

function createWork(project) {
  const li = document.createElement('li');
  li.className = 'work';
  li.dataset.key = project._key;

  const head = document.createElement('button');
  head.type = 'button';
  head.className = 'work__head';
  head.setAttribute('aria-expanded', 'false');
  head.innerHTML = `
    <span class="work__year">${esc(project.year || 'n.d.')}</span>
    <span class="work__title">${esc(project.title)}</span>
    <span class="work__role">${esc(project.role || '')}</span>`;

  const detail = document.createElement('div');
  detail.className = 'work__detail';

  if (project.description) {
    const d = document.createElement('p');
    d.className = 'work__desc';
    d.textContent = project.description;
    detail.appendChild(d);
  }
  if (project.images && project.images.length) {
    const g = document.createElement('div');
    g.className = 'work__gallery';
    project.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src; img.alt = project.title; img.loading = 'lazy';
      img.onerror = () => img.remove();
      g.appendChild(img);
    });
    detail.appendChild(g);
  }
  if (project.links && project.links.length) {
    const l = document.createElement('div');
    l.className = 'work__links';
    project.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = link.title;
      l.appendChild(a);
    });
    detail.appendChild(l);
  }

  head.addEventListener('click', () => {
    const open = li.classList.toggle('open');
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) track('work/' + slug(project.title), 'Work: ' + project.title);
  });

  li.appendChild(head);
  li.appendChild(detail);
  return li;
}

/* ---------- THEME ---------- */
function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark-mode');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });
}

/* ---------- DOCUMENT OPEN TRACKING ---------- */
function setupDocLinks() {
  document.querySelectorAll('.doc__open').forEach(a => {
    a.addEventListener('click', () => {
      const head = a.closest('.doc__head');
      const t = head ? head.querySelector('.doc__title').textContent.trim() : 'document';
      track('doc/' + slug(t), 'Document: ' + t);
    });
  });
}

/* ---------- SCROLLSPY (highlight active TOC entry) ---------- */
function setupScrollSpy() {
  const links = Array.from(document.querySelectorAll('.toc__list a'));
  const map = {};
  links.forEach(a => { map[a.getAttribute('href').slice(1)] = a; });
  const sections = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('is-active'));
        if (map[e.target.id]) map[e.target.id].classList.add('is-active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
  sections.forEach(s => io.observe(s));
}

/* ---------- LIGHTBOX (click a gallery image to preview full size) ---------- */
function setupLightbox() {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.innerHTML =
    '<button class="lightbox__close" type="button" aria-label="Close preview">✕</button>' +
    '<img class="lightbox__img" src="" alt="">';
  document.body.appendChild(box);
  const img = box.querySelector('.lightbox__img');
  const closeBtn = box.querySelector('.lightbox__close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';   // lock background scroll
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    img.removeAttribute('src');
    document.body.style.overflow = '';
  }

  // Gallery images are added dynamically, so delegate from the document.
  document.addEventListener('click', e => {
    const g = e.target.closest('.work__gallery img');
    if (g) { open(g.currentSrc || g.src, g.alt); }
  });
  // Close on backdrop click or the close button (not when clicking the image itself).
  box.addEventListener('click', e => {
    if (e.target === box || e.target.closest('.lightbox__close')) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !box.hidden) close();
  });
}
