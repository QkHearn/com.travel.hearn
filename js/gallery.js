/**
 * ============================================
 * 画廊页逻辑 2.0 - 清新自然风格
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

function initFilters() {
  const filters = getFilters();
  const tags = getAllTags();
  
  const destSelect = document.getElementById('filter-dest');
  const provinceSelect = document.getElementById('filter-province');
  const yearSelect = document.getElementById('filter-year');
  const tagSelect = document.getElementById('filter-tag');
  
  if (destSelect) {
    travelData.destinations.forEach(dest => {
      const option = document.createElement('option');
      option.value = dest.id;
      option.textContent = `${dest.name} (${dest.city || dest.province})`;
      destSelect.appendChild(option);
    });
  }
  
  if (provinceSelect) {
    filters.provinces.forEach(province => {
      const option = document.createElement('option');
      option.value = province;
      option.textContent = province;
      provinceSelect.appendChild(option);
    });
  }
  
  if (yearSelect) {
    filters.years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year + '年';
      yearSelect.appendChild(option);
    });
  }
  
  if (tagSelect) {
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagSelect.appendChild(option);
    });
  }
  
  const applyFilters = () => {
    const destId = destSelect ? destSelect.value : '';
    const province = provinceSelect ? provinceSelect.value : '';
    const year = yearSelect ? yearSelect.value : '';
    const tag = tagSelect ? tagSelect.value : '';
    
    filteredPhotos = currentPhotos.filter(photo => {
      const dest = travelData.destinations.find(d => d.name === photo.destination);
      const matchDest = !destId || dest?.id === destId;
      const matchProvince = !province || photo.province === province;
      const matchYear = !year || new Date(photo.date).getFullYear() === parseInt(year);
      const matchTag = !tag || photo.tags.includes(tag);
      return matchDest && matchProvince && matchYear && matchTag;
    });
    
    currentPage = 1;
    renderGallery();
    renderPagination();
    updateCount();
  };
  
  if (destSelect) destSelect.addEventListener('change', applyFilters);
  if (provinceSelect) provinceSelect.addEventListener('change', applyFilters);
  if (yearSelect) yearSelect.addEventListener('change', applyFilters);
  if (tagSelect) tagSelect.addEventListener('change', applyFilters);
}

function initGallery() {
  currentPhotos = getAllPhotos();
  filteredPhotos = [...currentPhotos];
  renderGallery();
  renderPagination();
  updateCount();
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  
  const start = (currentPage - 1) * PHOTOS_PER_PAGE;
  const end = start + PHOTOS_PER_PAGE;
  const photos = filteredPhotos.slice(start, end);
  
  const bgColors = [
    'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
    'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    'linear-gradient(135deg, #FFF8E1, #FFECB3)',
    'linear-gradient(135deg, #FCE4EC, #F8BBD0)',
    'linear-gradient(135deg, #E0F2F1, #B2DFDB)',
    'linear-gradient(135deg, #F3E5F5, #E1BEE7)',
  ];
  
  grid.innerHTML = photos.map((photo, index) => `
    <div class="gallery-item" data-index="${start + index}" data-reveal>
      <div class="gallery-placeholder" style="background: ${bgColors[(start + index) % bgColors.length]}; aspect-ratio: ${index % 3 === 0 ? '3/4' : '4/3'};">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="opacity: 0.3;">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      <div class="gallery-item-overlay">
        <div class="gallery-item-location">${photo.province || photo.country} · ${photo.city || photo.destination}</div>
        <div class="gallery-item-title">${formatDate(photo.date)}</div>
        <div class="gallery-item-tags">
          ${photo.tags.slice(0, 3).map(t => `<span class="tag gallery-item-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  setupRevealAnimation();
}

function renderPagination() {
  const container = document.getElementById('gallery-pagination');
  if (!container) return;
  
  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="prev">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="pagination-btn" style="cursor: default; border: none; background: transparent;">...</span>`;
    }
  }
  
  html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="next">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
  </button>`;
  
  container.innerHTML = html;
  
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

function updateCount() {
  const countEl = document.getElementById('photo-count');
  if (countEl) {
    animateNumber(countEl, filteredPhotos.length, 800);
  }
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxInfo = document.getElementById('lightbox-info');
  let currentIndex = 0;
  
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
      <div class="lightbox-info-location">${photo.province || photo.country} · ${photo.city || photo.destination}</div>
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
  
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });
  lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  });
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
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => observer.observe(el));
}
