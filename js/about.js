/**
 * ============================================
 * 关于页逻辑 2.0 - 清新自然风格
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderContinentChart();
  renderProvinceChart();
  setupRevealAnimation();
});

function renderContinentChart() {
  const container = document.getElementById('continent-chart');
  if (!container) return;
  
  const provinceStats = getProvinceStats();
  const provinces = Object.entries(provinceStats).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...provinces.map(p => p[1]));
  const total = travelData.destinations.length;
  
  const barHeight = 32;
  const barGap = 16;
  const chartHeight = provinces.length * (barHeight + barGap);
  const chartWidth = 320;
  
  let svg = `<svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs><linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#7CB342"/><stop offset="100%" style="stop-color:#4FC3F7"/></linearGradient></defs>`;
  
  provinces.forEach(([name, count], index) => {
    const y = index * (barHeight + barGap);
    const barWidth = (count / maxCount) * (chartWidth - 100);
    const percentage = Math.round((count / total) * 100);
    
    svg += `
      <rect class="chart-bar" x="0" y="${y}" width="${barWidth}" height="${barHeight}" rx="6"/>
      <text class="chart-label" x="${chartWidth - 48}" y="${y + barHeight / 2 + 5}">${name}</text>
      <text class="chart-value" x="${barWidth + 10}" y="${y + barHeight / 2 + 5}">${count} (${percentage}%)</text>
    `;
  });
  
  svg += '</svg>';
  container.innerHTML = svg;
}

function renderProvinceChart() {
  const container = document.getElementById('province-chart');
  if (!container) return;
  
  const monthCounts = new Array(12).fill(0);
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  travelData.destinations.forEach(dest => {
    const month = new Date(dest.date).getMonth();
    monthCounts[month]++;
  });
  
  const maxCount = Math.max(...monthCounts);
  const chartWidth = 320;
  const chartHeight = 200;
  const barWidth = chartWidth / 12 - 6;
  
  let svg = `<svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight + 30}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs><linearGradient id="monthGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#4FC3F7"/><stop offset="100%" style="stop-color:#7CB342"/></linearGradient></defs>`;
  
  monthCounts.forEach((count, index) => {
    const barHeight = maxCount > 0 ? (count / maxCount) * chartHeight : 0;
    const x = index * (chartWidth / 12) + 3;
    const y = chartHeight - barHeight;
    
    svg += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="url(#monthGradient)" opacity="0.85"/>
      <text class="chart-label" x="${x + barWidth / 2}" y="${chartHeight + 22}">${monthNames[index]}</text>
    `;
    
    if (count > 0) {
      svg += `<text class="chart-value" x="${x + barWidth / 2}" y="${y - 6}">${count}</text>`;
    }
  });
  
  svg += '</svg>';
  container.innerHTML = svg;
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
  }, { threshold: 0.2 });
  
  revealElements.forEach(el => observer.observe(el));
}
