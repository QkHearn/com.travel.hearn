/**
 * ============================================
 * 关于页逻辑
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderContinentChart();
  renderMonthChart();
  setupRevealAnimation();
});

/**
 * 渲染大洲分布图表
 */
function renderContinentChart() {
  const container = document.getElementById('continent-chart');
  if (!container) return;
  
  // 简单的国家到大洲映射
  const continentMap = {
    '法国': '欧洲',
    '希腊': '欧洲',
    '冰岛': '欧洲',
    '日本': '亚洲',
    '摩洛哥': '非洲',
    '新西兰': '大洋洲'
  };
  
  const continentCounts = {};
  travelData.destinations.forEach(dest => {
    const continent = continentMap[dest.country] || '其他';
    continentCounts[continent] = (continentCounts[continent] || 0) + 1;
  });
  
  const continents = Object.entries(continentCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...continents.map(c => c[1]));
  
  const barHeight = 30;
  const barGap = 15;
  const chartHeight = continents.length * (barHeight + barGap);
  const chartWidth = 300;
  
  let svg = `<svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">`;
  
  continents.forEach(([name, count], index) => {
    const y = index * (barHeight + barGap);
    const barWidth = (count / maxCount) * (chartWidth - 80);
    const percentage = Math.round((count / travelData.destinations.length) * 100);
    
    svg += `
      <rect class="chart-bar" x="0" y="${y}" width="${barWidth}" height="${barHeight}" rx="4"/>
      <text class="chart-label" x="${chartWidth - 40}" y="${y + barHeight / 2 + 4}">${name}</text>
      <text class="chart-value" x="${barWidth + 8}" y="${y + barHeight / 2 + 4}">${count} (${percentage}%)</text>
    `;
  });
  
  svg += '</svg>';
  container.innerHTML = svg;
}

/**
 * 渲染月份分布图表
 */
function renderMonthChart() {
  const container = document.getElementById('month-chart');
  if (!container) return;
  
  const monthCounts = new Array(12).fill(0);
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  travelData.destinations.forEach(dest => {
    const month = new Date(dest.date).getMonth();
    monthCounts[month]++;
  });
  
  const maxCount = Math.max(...monthCounts);
  const chartWidth = 300;
  const chartHeight = 200;
  const barWidth = chartWidth / 12 - 4;
  
  let svg = `<svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight + 30}" xmlns="http://www.w3.org/2000/svg">`;
  
  monthCounts.forEach((count, index) => {
    const barHeight = maxCount > 0 ? (count / maxCount) * chartHeight : 0;
    const x = index * (chartWidth / 12) + 2;
    const y = chartHeight - barHeight;
    
    svg += `
      <rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="2"/>
      <text class="chart-label" x="${x + barWidth / 2}" y="${chartHeight + 20}">${monthNames[index]}</text>
    `;
    
    if (count > 0) {
      svg += `<text class="chart-value" x="${x + barWidth / 2}" y="${y - 5}">${count}</text>`;
    }
  });
  
  svg += '</svg>';
  container.innerHTML = svg;
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
