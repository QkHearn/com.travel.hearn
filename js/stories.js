/**
 * ============================================
 * 故事页逻辑
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

/**
 * 初始化年份筛选
 */
function initYearFilters() {
  const container = document.getElementById('year-filters');
  if (!container) return;
  
  const { years } = getFilters();
  
  let html = `<button class="year-filter active" data-year="all">全部</button>`;
  years.forEach(year => {
    html += `<button class="year-filter" data-year="${year}">${year}</button>`;
  });
  
  container.innerHTML = html;
  
  // 筛选事件
  container.querySelectorAll('.year-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.year-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentYear = btn.dataset.year;
      renderTimeline();
    });
  });
}

/**
 * 渲染时间线
 */
function renderTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  
  sortedDestinations = sortByDate(travelData.destinations, 'desc');
  
  // 按年份筛选
  let filtered = sortedDestinations;
  if (currentYear !== 'all') {
    filtered = sortedDestinations.filter(d => 
      new Date(d.date).getFullYear() === parseInt(currentYear)
    );
  }
  
  // 按年份分组
  const grouped = groupByYear(filtered);
  const years = Object.keys(grouped).sort((a, b) => b - a);
  
  let html = '';
  years.forEach(year => {
    html += `
      <div class="timeline-year" data-reveal>
        <div class="timeline-year-label">${year}</div>
      </div>
    `;
    
    grouped[year].forEach((dest, index) => {
      html += `
        <div class="timeline-item" data-id="${dest.id}" data-reveal style="animation-delay: ${index * 0.1}s">
          <div class="story-card" onclick="openStoryModal('${dest.id}')">
            <div class="story-card-image">${dest.name.charAt(0)}</div>
            <div class="story-card-body">
              <div class="story-card-date">${formatDateRange(dest.date, dest.endDate)}</div>
              <div class="story-card-title">${dest.name}</div>
              <div class="story-card-location">${dest.country}</div>
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

/**
 * 初始化弹窗
 */
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

/**
 * 打开故事弹窗
 */
function openStoryModal(destId) {
  const modal = document.getElementById('story-modal');
  const body = document.getElementById('story-modal-body');
  
  const dest = travelData.destinations.find(d => d.id === destId);
  if (!dest) return;
  
  currentDestIndex = sortedDestinations.findIndex(d => d.id === destId);
  
  body.innerHTML = `
    <div class="story-modal-header">
      <div class="story-modal-date">${formatDateRange(dest.date, dest.endDate)}</div>
      <div class="story-modal-title">${dest.name}</div>
      <div class="story-modal-location">${dest.country}</div>
    </div>
    <div class="story-modal-cover">${dest.name.charAt(0)}</div>
    <div class="story-modal-text">
      <p>${dest.story}</p>
    </div>
    <div class="story-modal-photos">
      ${dest.photos.map(() => `
        <div class="story-modal-photo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
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

/**
 * 关闭故事弹窗
 */
function closeStoryModal() {
  const modal = document.getElementById('story-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * 导航故事
 */
function navigateStory(direction) {
  currentDestIndex += direction;
  
  if (currentDestIndex < 0) {
    currentDestIndex = sortedDestinations.length - 1;
  } else if (currentDestIndex >= sortedDestinations.length) {
    currentDestIndex = 0;
  }
  
  openStoryModal(sortedDestinations[currentDestIndex].id);
}

/**
 * 检查 URL hash
 */
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

/**
 * 设置滚动显示动画
 */
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
