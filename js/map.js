/**
 * ============================================
 * 地图页逻辑
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initSidebar();
  initFilters();
});

let map;
let markers;
let currentDestinations = [...travelData.destinations];

/**
 * 初始化地图
 */
function initMap() {
  // 初始化 Leaflet 地图
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([30, 0], 2);
  
  // 添加暗色主题瓦片
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map);
  
  // 添加缩放控件到右侧
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  
  // 初始化标记聚类
  markers = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        className: 'custom-cluster',
        html: `<div style="
          background: var(--van-gogh-gold);
          color: var(--starry-night-dark);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.9rem;
          border: 2px solid var(--text-white);
          box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.3);
        ">${cluster.getChildCount()}</div>`,
        iconSize: [36, 36]
      });
    }
  });
  
  map.addLayer(markers);
  
  // 添加目的地标记
  addMarkers(currentDestinations);
  
  // 更新统计
  updateStats();
}

/**
 * 添加标记
 */
function addMarkers(destinations) {
  markers.clearLayers();
  
  destinations.forEach(dest => {
    const marker = L.marker([dest.lat, dest.lng], {
      icon: L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="custom-marker" style="
          background: var(--van-gogh-gold);
          border: 2px solid var(--text-white);
          border-radius: 50%;
          width: 14px;
          height: 14px;
          box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.3);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      })
    });
    
    // 弹窗内容
    const popupContent = `
      <div class="popup-card">
        <div class="popup-image" style="background: linear-gradient(135deg, ${getDestColor(dest.id)}); display: flex; align-items: center; justify-content: center; color: var(--van-gogh-gold); font-family: var(--font-display); font-size: 1.5rem;">
          ${dest.name.charAt(0)}
        </div>
        <div class="popup-title">${dest.name}</div>
        <div class="popup-country">${dest.country}</div>
        <div class="popup-date">${formatDateRange(dest.date, dest.endDate)}</div>
        <div class="popup-summary">${dest.summary}</div>
        <a href="stories.html#${dest.id}" class="popup-link">阅读故事 →</a>
      </div>
    `;
    
    marker.bindPopup(popupContent, {
      maxWidth: 280,
      className: 'custom-popup'
    });
    
    marker.destinationId = dest.id;
    markers.addLayer(marker);
  });
  
  // 调整视图以包含所有标记
  if (destinations.length > 0) {
    const group = new L.featureGroup(markers.getLayers());
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

/**
 * 获取目的地颜色（用于占位符）
 */
function getDestColor(id) {
  const colors = [
    '#12183a, #6b4c7f',
    '#0a0e27, #1b5e20',
    '#12183a, #8b4513',
    '#0a0e27, #4a0e4e',
    '#12183a, #1a472a',
    '#0a0e27, #6b4423'
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * 初始化侧边栏
 */
function initSidebar() {
  renderSidebarList(currentDestinations);
  
  // 侧边栏折叠
  const sidebar = document.getElementById('map-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
}

/**
 * 渲染侧边栏列表
 */
function renderSidebarList(destinations) {
  const list = document.getElementById('sidebar-list');
  if (!list) return;
  
  list.innerHTML = destinations.map(dest => `
    <div class="sidebar-item" data-id="${dest.id}">
      <div class="sidebar-item-thumb">${dest.name.charAt(0)}</div>
      <div class="sidebar-item-info">
        <div class="sidebar-item-name">${dest.name}</div>
        <div class="sidebar-item-country">${dest.country}</div>
        <div class="sidebar-item-date">${formatDateRange(dest.date, dest.endDate)}</div>
      </div>
    </div>
  `).join('');
  
  // 点击定位到地图
  list.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const dest = destinations.find(d => d.id === id);
      if (dest) {
        map.setView([dest.lat, dest.lng], 8);
        
        // 高亮当前项
        list.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // 打开对应弹窗
        markers.getLayers().forEach(marker => {
          if (marker.destinationId === id) {
            marker.openPopup();
          }
        });
      }
    });
  });
}

/**
 * 初始化筛选器
 */
function initFilters() {
  const filters = getFilters();
  
  const countrySelect = document.getElementById('filter-country');
  const yearSelect = document.getElementById('filter-year');
  
  // 填充选项
  filters.countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
  
  filters.years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year + '年';
    yearSelect.appendChild(option);
  });
  
  // 筛选事件
  const applyFilters = () => {
    const country = countrySelect.value;
    const year = yearSelect.value;
    
    currentDestinations = travelData.destinations.filter(dest => {
      const matchCountry = !country || dest.country === country;
      const matchYear = !year || new Date(dest.date).getFullYear() === parseInt(year);
      return matchCountry && matchYear;
    });
    
    addMarkers(currentDestinations);
    renderSidebarList(currentDestinations);
    updateStats();
  };
  
  countrySelect.addEventListener('change', applyFilters);
  yearSelect.addEventListener('change', applyFilters);
}

/**
 * 更新统计
 */
function updateStats() {
  const countEl = document.getElementById('map-count');
  if (countEl) {
    animateNumber(countEl, currentDestinations.length, 1000);
  }
}
