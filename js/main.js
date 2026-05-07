/**
 * ============================================
 * 主逻辑 - 通用功能
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStarryCanvas();
  initScrollEffects();
  initBackToTop();
  initMobileMenu();
});

/**
 * 导航栏
 */
function initNavigation() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  
  // 滚动时添加样式
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, 100));
  
  // 高亮当前页面导航
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

/**
 * 移动端菜单
 */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  
  // 点击链接后关闭菜单
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

/**
 * 星空 Canvas 动画
 * 灵感来自梵高《星夜》
 */
function initStarryCanvas() {
  const canvas = document.getElementById('starry-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let nebula = [];
  let animationId;
  let isVisible = true;
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
    initNebula();
  }
  
  function initStars() {
    stars = [];
    const count = Math.min(Math.floor((width * height) / 6000), 200);
    
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }
  
  function initNebula() {
    nebula = [];
    const count = 5;
    
    for (let i = 0; i < count; i++) {
      nebula.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 200 + 100,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        color: i % 2 === 0 ? 'rgba(107, 76, 127, 0.08)' : 'rgba(212, 160, 23, 0.05)'
      });
    }
  }
  
  function drawStar(star, time) {
    const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
    const opacity = star.opacity * (0.5 + 0.5 * twinkle);
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 240, ${opacity})`;
    ctx.fill();
    
    // 大星星发光效果
    if (star.size > 1.5) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 3
      );
      gradient.addColorStop(0, `rgba(255, 255, 240, ${opacity * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 255, 240, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
  
  function drawNebula(cloud, time) {
    cloud.angle += cloud.rotationSpeed;
    
    ctx.save();
    ctx.translate(cloud.x, cloud.y);
    ctx.rotate(cloud.angle);
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, cloud.radius);
    gradient.addColorStop(0, cloud.color);
    gradient.addColorStop(0.5, cloud.color.replace(/[\d.]+\)$/, '0.03)'));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-cloud.radius, -cloud.radius, cloud.radius * 2, cloud.radius * 2);
    ctx.restore();
  }
  
  function drawSwirl(cx, cy, radius, time) {
    const points = 100;
    const rotations = 3;
    
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      const angle = t * Math.PI * 2 * rotations + time * 0.0001;
      const r = radius * (0.3 + 0.7 * t);
      const wave = Math.sin(angle * 5 + time * 0.001) * 10;
      const x = cx + Math.cos(angle) * (r + wave);
      const y = cy + Math.sin(angle) * (r + wave);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    const gradient = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    gradient.addColorStop(0, 'rgba(107, 76, 127, 0.15)');
    gradient.addColorStop(0.5, 'rgba(212, 160, 23, 0.1)');
    gradient.addColorStop(1, 'rgba(107, 76, 127, 0.15)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  
  function draw(time) {
    if (!isVisible) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // 绘制星云
    nebula.forEach(cloud => drawNebula(cloud, time));
    
    // 绘制旋涡（星夜风格）
    drawSwirl(width * 0.2, height * 0.3, 150, time);
    drawSwirl(width * 0.8, height * 0.7, 120, time + 1000);
    drawSwirl(width * 0.5, height * 0.5, 80, time + 2000);
    
    // 绘制星星
    stars.forEach(star => drawStar(star, time));
    
    animationId = requestAnimationFrame(draw);
  }
  
  // 页面可见性优化
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      animationId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationId);
    }
  });
  
  window.addEventListener('resize', debounce(resize, 200));
  resize();
  requestAnimationFrame(draw);
}

/**
 * 滚动效果
 */
function initScrollEffects() {
  // 滚动显示动画
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;
  
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
 * 返回顶部
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 100));
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 页面切换动画（用于SPA风格的多页面）
 */
function initPageTransitions() {
  document.querySelectorAll('a[href^="./"], a[href^="/"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.includes('#') || href.startsWith('http')) return;
      
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}
