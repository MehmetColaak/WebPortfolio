/* =========================================================
   FEATURED VIDEOS  —  edit this list to curate the carousel.
   Get an ID from a video URL: youtu.be/<ID>  or  watch?v=<ID>
   ========================================================= */
const FEATURED_VIDEOS = [
  { id: 'bW8bLXIvt9c', title: 'a[NN]ime — Anime SFX Neural Synthesis' },
  { id: 'EeGkg0ya-Po', title: 'Auditory Environmental Storytelling — Fallen Leaves' },
  { id: 'yVBhrGbOptU', title: 'Articulated Through Engine — Downshifting an Instrument' },
  { id: 'v7bAAhoWD_o', title: 'Engine Articulation — Building an Instrument' },
];

document.addEventListener('DOMContentLoaded', function () {

  renderVideoCarousel();
  loadProjects();
  setupTabs();
  setupThemeToggle();

  /* ---------------------------------------------------------
     TABS
     --------------------------------------------------------- */
  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(targetTab + '-tab').classList.add('active');
      });
    });
  }

  /* ---------------------------------------------------------
     VIDEO CAROUSEL  (lightweight facade — iframe loads on click)
     --------------------------------------------------------- */
  function renderVideoCarousel() {
    const track = document.getElementById('video-track');
    if (!track || !FEATURED_VIDEOS.length) return;
    track.innerHTML = '';

    FEATURED_VIDEOS.forEach(v => {
      const card = document.createElement('button');
      card.className = 'video-card';
      card.type = 'button';
      card.setAttribute('aria-label', 'Play: ' + v.title);
      card.innerHTML = `
        <span class="video-thumb">
          <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
          <span class="video-play" aria-hidden="true">▶</span>
        </span>
        <span class="video-title">${v.title}</span>`;

      card.addEventListener('click', () => {
        const thumb = card.querySelector('.video-thumb');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
        iframe.title = v.title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        thumb.replaceWith(iframe);
      }, { once: true });

      track.appendChild(card);
    });

    // Prev / next scroll buttons
    document.querySelectorAll('.carousel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = track.clientWidth * 0.8;
        track.scrollBy({ left: btn.dataset.dir === 'next' ? amount : -amount, behavior: 'smooth' });
      });
    });
  }

  /* ---------------------------------------------------------
     PROJECTS
     --------------------------------------------------------- */
  async function loadProjects() {
    const contentContainer = document.getElementById('dynamic-content');
    const featuredContainer = document.getElementById('featured-works');
    contentContainer.innerHTML = '<p style="text-align:center;">Loading projects…</p>';

    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error('Could not load data.json — run a local web server.');

      const projects = await response.json();
      projects.forEach((p, i) => (p._key = 'p' + i)); // stable id for linking
      contentContainer.innerHTML = '';

      renderFeaturedWorks(projects.filter(p => p.featured), featuredContainer);

      // Group full list by section
      const grouped = {};
      projects.forEach(p => (grouped[p.section] = grouped[p.section] || []).push(p));

      for (const sectionName in grouped) {
        const wrapper = document.createElement('div');
        wrapper.className = 'works-subsection';

        const h3 = document.createElement('h3');
        h3.innerText = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        wrapper.appendChild(h3);

        const ul = document.createElement('ul');
        grouped[sectionName].forEach(p => ul.appendChild(createProjectTreeItem(p)));
        wrapper.appendChild(ul);
        contentContainer.appendChild(wrapper);
      }
    } catch (error) {
      console.error(error);
      contentContainer.innerHTML = `<p style="color:#c0392b;">Error: ${error.message}</p>`;
    }
  }

  function renderFeaturedWorks(featured, container) {
    if (!container) return;
    if (!featured.length) { container.hidden = true; return; }
    container.hidden = false;
    container.innerHTML = '<h3 class="featured-heading">Featured Works</h3>';

    const grid = document.createElement('div');
    grid.className = 'featured-grid';

    featured.forEach(p => {
      const cover = (p.images && p.images[0]) || '';
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'featured-card';
      card.innerHTML = `
        ${cover ? `<span class="featured-cover"><img src="${cover}" alt="" loading="lazy"></span>` : ''}
        <span class="featured-meta">
          <span class="featured-year-role">${[p.year, p.role].filter(Boolean).join(' · ')}</span>
          <span class="featured-title">${p.title}</span>
        </span>`;
      // Open the matching accordion item in the Works tab.
      card.addEventListener('click', () => openProject(p._key));
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function openProject(key) {
    // Ensure the Works tab is visible.
    document.querySelector('.tab-button[data-tab="portfolio"]').click();
    const li = document.querySelector(`.project-item[data-key="${key}"]`);
    if (!li) return;
    li.classList.add('open');
    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
    li.querySelector('.project-trigger').classList.add('flash');
    setTimeout(() => li.querySelector('.project-trigger').classList.remove('flash'), 900);
  }

  function createProjectTreeItem(project) {
    const li = document.createElement('li');
    li.className = 'project-item';
    li.dataset.key = project._key;

    const trigger = document.createElement('div');
    trigger.className = 'project-trigger';

    const triggerHeader = document.createElement('div');
    triggerHeader.className = 'trigger-header';

    const yearRoleRow = document.createElement('div');
    yearRoleRow.className = 'trigger-year-role';
    yearRoleRow.innerText = (project.year ? project.year + ' - ' : '') + (project.role || '');

    const titleSpan = document.createElement('h4');
    titleSpan.className = 'trigger-title';
    titleSpan.innerText = project.title;

    triggerHeader.appendChild(yearRoleRow);
    triggerHeader.appendChild(titleSpan);
    trigger.appendChild(triggerHeader);
    li.appendChild(trigger);

    const details = document.createElement('div');
    details.className = 'project-details';

    if (project.description) {
      const desc = document.createElement('div');
      desc.className = 'project-description';
      desc.innerHTML = project.description;
      details.appendChild(desc);
    }

    if (project.images && project.images.length > 0) {
      const gallery = document.createElement('div');
      gallery.className = 'project-gallery';
      project.images.forEach(imgPath => {
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = project.title;
        img.loading = 'lazy';
        img.onerror = () => img.remove(); // drop broken images instead of showing a broken icon
        gallery.appendChild(img);
      });
      details.appendChild(gallery);
    }

    if (project.links && project.links.length > 0) {
      const linksContainer = document.createElement('div');
      linksContainer.className = 'project-links';
      const iconSvg = `
        <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>`;
      project.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'link-btn';
        a.innerHTML = iconSvg + link.title;
        linksContainer.appendChild(a);
      });
      details.appendChild(linksContainer);
    }

    li.appendChild(details);
    trigger.addEventListener('click', () => li.classList.toggle('open'));
    return li;
  }

  /* ---------------------------------------------------------
     DARK MODE  (initial theme is set in <head> before paint)
     --------------------------------------------------------- */
  function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    btn.addEventListener('click', function () {
      const isDark = document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

});
