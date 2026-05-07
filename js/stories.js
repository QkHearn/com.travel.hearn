/**
 * ============================================
 * 故事页逻辑 2.0 - 清新自然风格
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initYearFilters();
  renderTimeline();
  initModal();
  checkHash();
});

let currentYear = 'all';
let currentDestIndex = 0;
let sortedDestinations = [];

function initYearFilters() {
  const container = document.getElementById('year-filters');
  if (!container) return;
  
  const { years } = getFilters();
  
  let html = `<button class="year-filter active" data-year="all">全部</button>`;
  years.forEach(year => {
    html += `<button class="year-filter" data-year="${year}">${year}</button>`;
  });
  
  container.innerHTML = html;
  
  container.querySelectorAll('.year-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.year-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentYear = btn.dataset.year;
      renderTimeline();
    });
  });
}

function renderTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  
  sortedDestinations = sortByDate(travelData.destinations, 'desc');
  
  let filtered = sortedDestinations;
  if (currentYear !== 'all') {
    filtered = sortedDestinations.filter(d => 
      new Date(d.date).getFullYear() === parseInt(currentYear)
    );
  }
  
  const grouped = groupByYear(filtered);
  const years = Object.keys(grouped).sort((a, b) => b - a);
  
  const gradients = [
    'linear-gradient(135deg, #81C784, #4FC3F7)',
    'linear-gradient(135deg, #FFB74D, #FF8A65)',
    'linear-gradient(135deg, #BA68C8, #7986CB)',
    'linear-gradient(135deg, #4DB6AC, #81C784)',
  ];
  
  let html = '';
  years.forEach(year => {
    html += `
      <div class="timeline-year" data-reveal>
        <div class="timeline-year-label">${year}</div>
      </div>
    `;
    
    grouped[year].forEach((dest, index) => {
      const gradient = gradients[index % gradients.length];
      html += `
        <div class="timeline-item" data-id="${dest.id}" data-reveal style="animation-delay: ${index * 0.1}s">
          <div class="story-card" onclick="openStoryModal('${dest.id}')">
            <div class="story-card-image" style="background: ${gradient}">${dest.name.charAt(0)}</div>
            <div class="story-card-body">
              <div class="story-card-date">${formatDateRange(dest.date, dest.endDate)}</div>
              <div class="story-card-title">${dest.name}</div>
              <div class="story-card-location">${dest.province || ''} · ${dest.city || ''}</div>
              <div class="story-card-excerpt">${truncate(dest.story, 120)}</div>
              <div class="story-card-tags">
                ${dest.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
              <span class="story-card-readmore">阅读全文 →</span>
            </div>
          </div>
        </div>
      `;
    });
  });
  
  timeline.innerHTML = html;
  setupRevealAnimation();
}

function initModal() {
  const modal = document.getElementById('story-modal');
  const closeBtn = modal.querySelector('.story-modal-close');
  
  closeBtn.addEventListener('click', closeStoryModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeStoryModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeStoryModal();
    }
  });
}

function openStoryModal(destId) {
  const modal = document.getElementById('story-modal');
  const body = document.getElementById('story-modal-body');
  
  const dest = travelData.destinations.find(d => d.id === destId);
  if (!dest) return;
  
  currentDestIndex = sortedDestinations.findIndex(d => d.id === destId);
  
  const gradients = [
    'linear-gradient(135deg, #81C784, #4FC3F7)',
    'linear-gradient(135deg, #FFB74D, #FF8A65)',
    'linear-gradient(135deg, #BA68C8, #7986CB)',
    'linear-gradient(135deg, #4DB6AC, #81C784)',
  ];
  const gradient = gradients[currentDestIndex % gradients.length];
  
  body.innerHTML = `
    <div class="story-modal-header">
      <div class="story-modal-date">${formatDateRange(dest.date, dest.endDate)}</div>
      <div class="story-modal-title">${dest.name}</div>
      <div class="story-modal-location">${dest.province || ''} · ${dest.city || ''}</div>
    </div>
    <div class="story-modal-cover" style="background: ${gradient}">${dest.name.charAt(0)}</div>
    <div class="story-modal-text">
      <p>${dest.story}</p>
    </div>
    <div class="story-modal-photos">
      ${dest.photos.map(() => `
        <div class="story-modal-photo">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </div>
      `).join('')}
    </div>
    <div class="story-modal-footer">
      <div class="story-modal-nav">
        <button onclick="navigateStory(-1)">← 上一篇</button>
        <button onclick="navigateStory(1)">下一篇 →</button>
      </div>
      <div class="story-modal-tags">
        ${dest.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
  const modal = document.getElementById('story-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateStory(direction) {
  currentDestIndex += direction;
  
  if (currentDestIndex < 0) {
    currentDestIndex = sortedDestinations.length - 1;
  } else if (currentDestIndex >= sortedDestinations.length) {
    currentDestIndex = 0;
  }
  
  openStoryModal(sortedDestinations[currentDestIndex].id);
}

function checkHash() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    setTimeout(() => {
      const dest = travelData.destinations.find(d => d.id === hash);
      if (dest) {
        openStoryModal(hash);
      }
    }, 500);
  }
}

function setupRevealAnimation() {
  const revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  revealElements.forEach(el => observer.observe(el));
}
