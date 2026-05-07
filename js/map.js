/**
 * ============================================
 * 地图页逻辑 2.0 - 清新自然风格
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initSidebar();
  initFilters();
  initAggregatePanel();
});

let map;
let markers;
let travelPath;
let currentDestinations = [...travelData.destinations];

function initMap() {
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([35, 105], 4);
  
  // 清新风格瓦片
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: 'abc'
  }).addTo(map);
  
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  
  markers = L.markerClusterGroup({
    maxClusterRadius: 60,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        className: 'custom-cluster',
        html: `<div style="
          background: linear-gradient(135deg, #7CB342, #4FC3F7);
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-ui);
          font-weight: 700;
          font-size: 0.9rem;
          border: 3px solid #fff;
          box-shadow: 0 4px 15px rgba(124, 179, 66, 0.4);
        ">${cluster.getChildCount()}</div>`,
        iconSize: [40, 40]
      });
    }
  });
  
  map.addLayer(markers);
  addMarkers(currentDestinations);
  drawTravelPath(currentDestinations);
  updateStats();
}

function addMarkers(destinations) {
  markers.clearLayers();
  
  const gradients = [
    'linear-gradient(135deg, #81C784, #4FC3F7)',
    'linear-gradient(135deg, #FFB74D, #FF8A65)',
    'linear-gradient(135deg, #BA68C8, #7986CB)',
    'linear-gradient(135deg, #4DB6AC, #81C784)',
  ];
  
  destinations.forEach((dest, index) => {
    const gradient = gradients[index % gradients.length];
    
    const marker = L.marker([dest.lat, dest.lng], {
      icon: L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="custom-marker" style="
          background: ${gradient};
          border: 3px solid #fff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          box-shadow: 0 0 0 4px rgba(124, 179, 66, 0.25);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    });
    
    const popupContent = `
      <div class="popup-card">
        <div class="popup-image" style="background: ${gradient}">
          ${dest.name.charAt(0)}
        </div>
        <div class="popup-title">${dest.name}</div>
        <div class="popup-city">${dest.province || ''} · ${dest.city || ''}</div>
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
  
  if (destinations.length > 0) {
    const group = new L.featureGroup(markers.getLayers());
    map.fitBounds(group.getBounds().pad(0.15));
  }
}

function drawTravelPath(destinations) {
  if (travelPath) {
    map.removeLayer(travelPath);
  }
  
  const sorted = sortByDate(destinations, 'asc');
  const points = sorted.map(d => [d.lat, d.lng]);
  
  if (points.length < 2) return;
  
  travelPath = L.polyline(points, {
    color: '#4FC3F7',
    weight: 2,
    opacity: 0.5,
    dashArray: '8, 4',
    className: 'travel-path'
  }).addTo(map);
}

function initSidebar() {
  renderSidebarList(currentDestinations);
  
  const sidebar = document.getElementById('map-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
}

function renderSidebarList(destinations) {
  const list = document.getElementById('sidebar-list');
  if (!list) return;
  
  const gradients = [
    'linear-gradient(135deg, #81C784, #4FC3F7)',
    'linear-gradient(135deg, #FFB74D, #FF8A65)',
    'linear-gradient(135deg, #BA68C8, #7986CB)',
    'linear-gradient(135deg, #4DB6AC, #81C784)',
  ];
  
  list.innerHTML = destinations.map((dest, index) => `
    <div class="sidebar-item" data-id="${dest.id}">
      <div class="sidebar-item-thumb" style="background: ${gradients[index % gradients.length]}">${dest.name.charAt(0)}</div>
      <div class="sidebar-item-info">
        <div class="sidebar-item-name">${dest.name}</div>
        <div class="sidebar-item-city">${dest.province || ''} · ${dest.city || ''}</div>
        <div class="sidebar-item-date">${formatDateRange(dest.date, dest.endDate)}</div>
      </div>
    </div>
  `).join('');
  
  list.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const dest = destinations.find(d => d.id === id);
      if (dest) {
        map.setView([dest.lat, dest.lng], 10);
        list.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        markers.getLayers().forEach(marker => {
          if (marker.destinationId === id) {
            marker.openPopup();
          }
        });
      }
    });
  });
}

function initFilters() {
  const filters = getFilters();
  
  const provinceSelect = document.getElementById('filter-province');
  const yearSelect = document.getElementById('filter-year');
  
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
  
  const applyFilters = () => {
    const province = provinceSelect ? provinceSelect.value : '';
    const year = yearSelect ? yearSelect.value : '';
    
    currentDestinations = travelData.destinations.filter(dest => {
      const matchProvince = !province || dest.province === province;
      const matchYear = !year || new Date(dest.date).getFullYear() === parseInt(year);
      return matchProvince && matchYear;
    });
    
    addMarkers(currentDestinations);
    drawTravelPath(currentDestinations);
    renderSidebarList(currentDestinations);
    updateStats();
  };
  
  if (provinceSelect) provinceSelect.addEventListener('change', applyFilters);
  if (yearSelect) yearSelect.addEventListener('change', applyFilters);
}

function initAggregatePanel() {
  const panel = document.getElementById('aggregate-panel');
  if (!panel) return;
  
  const tree = getLocationTree();
  
  panel.innerHTML = tree.map(node => `
    <div class="aggregate-badge" data-province="${node.name}">
      ${node.name}
      <span class="count">${node.count}</span>
    </div>
  `).join('');
  
  panel.querySelectorAll('.aggregate-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      const province = badge.dataset.province;
      const provinceSelect = document.getElementById('filter-province');
      if (provinceSelect) {
        provinceSelect.value = province;
        provinceSelect.dispatchEvent(new Event('change'));
      }
    });
  });
}

function updateStats() {
  const countEl = document.getElementById('map-count');
  if (countEl) {
    animateNumber(countEl, currentDestinations.length, 800);
  }
}
