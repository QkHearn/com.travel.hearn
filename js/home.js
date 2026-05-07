/**
 * ============================================
 * 首页逻辑 2.0 - 清新自然风格
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderLatestDestinations();
  renderFeaturedPhotos();
  init3DTiltCards();
});

/**
 * 渲染统计数据
 */
function renderStats() {
  const stats = getStats();
  
  document.querySelectorAll('.stat-number').forEach(el => {
    const statType = el.dataset.stat;
    const target = stats[statType] || 0;
    el.dataset.target = target;
  });
  
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target.querySelector('.stat-number');
        if (el && el.dataset.target) {
          animateNumber(el, parseInt(el.dataset.target), 2000);
        }
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
  });
}

/**
 * 渲染最新旅程
 */
function renderLatestDestinations() {
  const container = document.getElementById('latest-destinations');
  if (!container) return;
  
  const sorted = sortByDate(travelData.destinations, 'desc');
  const latest = sorted.slice(0, 4);
  
  const gradients = [
    'linear-gradient(135deg, #81C784, #4FC3F7)',
    'linear-gradient(135deg, #FFB74D, #FF8A65)',
    'linear-gradient(135deg, #BA68C8, #7986CB)',
    'linear-gradient(135deg, #4DB6AC, #81C784)',
  ];
  
  container.innerHTML = latest.map((dest, index) => `
    <a href="stories.html#${dest.id}" class="latest-card" data-reveal>
      <div class="latest-card-placeholder" style="background: ${gradients[index % gradients.length]}">
        <span style="font-size: 3rem; opacity: 0.9; text-shadow: 0 4px 20px rgba(0,0,0,0.2);">${dest.name.charAt(0)}</span>
      </div>
      <div class="latest-card-overlay">
        <div class="latest-card-province">${dest.province || dest.country} · ${dest.city || ''}</div>
        <div class="latest-card-name">${dest.name}</div>
        <div class="latest-card-date">${formatDateRange(dest.date, dest.endDate)}</div>
        <div class="latest-card-summary">${dest.summary}</div>
      </div>
    </a>
  `).join('');
  
  setupRevealAnimation();
}

/**
 * 渲染精选照片
 */
function renderFeaturedPhotos() {
  const container = document.getElementById('featured-photos');
  if (!container) return;
  
  const allPhotos = getAllPhotos();
  const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
  const featured = shuffled.slice(0, 6);
  
  const bgColors = [
    'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
    'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    'linear-gradient(135deg, #FFF8E1, #FFECB3)',
    'linear-gradient(135deg, #FCE4EC, #F8BBD0)',
    'linear-gradient(135deg, #E0F2F1, #B2DFDB)',
    'linear-gradient(135deg, #F3E5F5, #E1BEE7)',
  ];
  
  container.innerHTML = featured.map((photo, index) => `
    <div class="featured-item" data-reveal style="animation-delay: ${index * 0.1}s">
      <div class="featured-placeholder" style="background: ${bgColors[index % bgColors.length]}">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.4;">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      <div class="featured-item-overlay">
        <div class="featured-item-info">
          <div class="featured-item-location">${photo.province || photo.country} · ${photo.city || photo.destination}</div>
          <div class="featured-item-title">${formatDate(photo.date, { year: 'numeric', month: 'short' })}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  setupRevealAnimation();
}

/**
 * 3D Tilt 卡片效果
 */
function init3DTiltCards() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  document.querySelectorAll('.stat-card, .latest-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
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
