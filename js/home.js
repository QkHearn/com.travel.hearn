/**
 * ============================================
 * 首页逻辑
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderLatestDestinations();
  renderFeaturedPhotos();
});

/**
 * 渲染统计数据
 */
function renderStats() {
  const stats = getStats();
  
  // 更新目标值
  document.querySelectorAll('.stat-number').forEach(el => {
    const statType = el.dataset.stat;
    const target = stats[statType] || 0;
    el.dataset.target = target;
  });
  
  // 数字滚动动画
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
  
  container.innerHTML = latest.map(dest => `
    <a href="stories.html#${dest.id}" class="latest-card" data-reveal>
      <div class="latest-card-placeholder" style="background: linear-gradient(135deg, ${getRandomGradient()})">
        <span style="font-size: 2rem; opacity: 0.5">${dest.name.charAt(0)}</span>
      </div>
      <div class="latest-card-overlay">
        <div class="latest-card-country">${dest.country}</div>
        <div class="latest-card-name">${dest.name}</div>
        <div class="latest-card-date">${formatDateRange(dest.date, dest.endDate)}</div>
        <div class="latest-card-summary">${dest.summary}</div>
      </div>
    </a>
  `).join('');
  
  // 重新初始化滚动显示
  setupRevealAnimation();
}

/**
 * 渲染精选照片
 */
function renderFeaturedPhotos() {
  const container = document.getElementById('featured-photos');
  if (!container) return;
  
  const allPhotos = getAllPhotos();
  // 随机选择6张
  const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
  const featured = shuffled.slice(0, 6);
  
  container.innerHTML = featured.map((photo, index) => `
    <div class="featured-item" data-reveal style="animation-delay: ${index * 0.1}s">
      <div class="featured-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      <div class="featured-item-overlay">
        <div class="featured-item-info">
          <div class="featured-item-location">${photo.country} · ${photo.destination}</div>
          <div class="featured-item-title">${formatDate(photo.date, { year: 'numeric', month: 'short' })}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  setupRevealAnimation();
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
  }, { threshold: 0.2 });
  
  revealElements.forEach(el => observer.observe(el));
}

/**
 * 随机渐变颜色（用于图片占位符）
 */
function getRandomGradient() {
  const gradients = [
    '#12183a, #6b4c7f',
    '#0a0e27, #1b5e20',
    '#12183a, #8b4513',
    '#0a0e27, #4a0e4e',
    '#12183a, #1a472a',
    '#0a0e27, #6b4423'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}
