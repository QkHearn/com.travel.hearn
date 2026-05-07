/**
 * ============================================
 * 画廊页逻辑
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initGallery();
  initLightbox();
});

const PHOTOS_PER_PAGE = 24;
let currentPhotos = [];
let filteredPhotos = [];
let currentPage = 1;

/**
 * 初始化筛选器
 */
function initFilters() {
  const filters = getFilters();
  const tags = getAllTags();
  
  const destSelect = document.getElementById('filter-dest');
  const yearSelect = document.getElementById('filter-year');
  const tagSelect = document.getElementById('filter-tag');
  
  // 填充目的地选项
  travelData.destinations.forEach(dest => {
    const option = document.createElement('option');
    option.value = dest.id;
    option.textContent = `${dest.name} (${dest.country})`;
    destSelect.appendChild(option);
  });
  
  // 填充年份选项
  filters.years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year + '年';
    yearSelect.appendChild(option);
  });
  
  // 填充标签选项
  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  });
  
  // 筛选事件
  const applyFilters = () => {
    const destId = destSelect.value;
    const year = yearSelect.value;
    const tag = tagSelect.value;
    
    filteredPhotos = currentPhotos.filter(photo => {
      const dest = travelData.destinations.find(d => d.name === photo.destination);
      const matchDest = !destId || dest?.id === destId;
      const matchYear = !year || new Date(photo.date).getFullYear() === parseInt(year);
      const matchTag = !tag || photo.tags.includes(tag);
      return matchDest && matchYear && matchTag;
    });
    
    currentPage = 1;
    renderGallery();
    renderPagination();
    updateCount();
  };
  
  destSelect.addEventListener('change', applyFilters);
  yearSelect.addEventListener('change', applyFilters);
  tagSelect.addEventListener('change', applyFilters);
}

/**
 * 初始化画廊
 */
function initGallery() {
  currentPhotos = getAllPhotos();
  filteredPhotos = [...currentPhotos];
  renderGallery();
  renderPagination();
  updateCount();
}

/**
 * 渲染画廊
 */
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  
  const start = (currentPage - 1) * PHOTOS_PER_PAGE;
  const end = start + PHOTOS_PER_PAGE;
  const photos = filteredPhotos.slice(start, end);
  
  grid.innerHTML = photos.map((photo, index) => `
    <div class="gallery-item" data-index="${start + index}" data-reveal>
      <div class="gallery-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      <div class="gallery-item-overlay">
        <div class="gallery-item-location">${photo.country} · ${photo.destination}</div>
        <div class="gallery-item-title">${formatDate(photo.date)}</div>
        <div class="gallery-item-tags">
          ${photo.tags.slice(0, 3).map(t => `<span class="tag gallery-item-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  // 滚动显示动画
  setupRevealAnimation();
}

/**
 * 渲染分页
 */
function renderPagination() {
  const container = document.getElementById('gallery-pagination');
  if (!container) return;
  
  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // 上一页
  html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="prev">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`;
  
  // 页码
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="pagination-btn" style="cursor: default;">...</span>`;
    }
  }
  
  // 下一页
  html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="next">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>`;
  
  container.innerHTML = html;
  
  // 分页事件
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page === 'prev') {
        if (currentPage > 1) currentPage--;
      } else if (page === 'next') {
        if (currentPage < totalPages) currentPage++;
      } else {
        currentPage = parseInt(page);
      }
      renderGallery();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/**
 * 更新照片数量
 */
function updateCount() {
  const countEl = document.getElementById('photo-count');
  if (countEl) {
    animateNumber(countEl, filteredPhotos.length, 800);
  }
}

/**
 * 初始化 Lightbox
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxInfo = document.getElementById('lightbox-info');
  let currentIndex = 0;
  
  // 点击照片打开
  document.getElementById('gallery-grid').addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    
    currentIndex = parseInt(item.dataset.index);
    openLightbox(currentIndex);
  });
  
  function openLightbox(index) {
    const photo = filteredPhotos[index];
    if (!photo) return;
    
    lightboxImg.src = photo.src;
    lightboxInfo.innerHTML = `
      <div class="lightbox-info-location">${photo.country} · ${photo.destination}</div>
      <div class="lightbox-info-title">${formatDate(photo.date)}</div>
    `;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function prevPhoto() {
    currentIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    openLightbox(currentIndex);
  }
  
  function nextPhoto() {
    currentIndex = (currentIndex + 1) % filteredPhotos.length;
    openLightbox(currentIndex);
  }
  
  // 事件绑定
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    prevPhoto();
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    nextPhoto();
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // 键盘导航
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
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
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => observer.observe(el));
}
