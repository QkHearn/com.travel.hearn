/**
 * ============================================
 * 主逻辑 - 通用功能 2.0
 * 清新自然风格
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSkyCanvas();
  initScrollEffects();
  initBackToTop();
  initMobileMenu();
  initPetals();
});

/**
 * 导航栏
 */
function initNavigation() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, 100));
  
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
  
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

/**
 * 天空 Canvas 动画
 * 阿尔卑斯少女风格：飘动云朵、远山、阳光、飞鸟
 */
function initSkyCanvas() {
  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let clouds = [];
  let mountains = [];
  let birds = [];
  let sunRays = [];
  let animationId;
  let isVisible = true;
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initClouds();
    initMountains();
    initSunRays();
  }
  
  function initClouds() {
    clouds = [];
    const count = Math.min(Math.floor(width / 250), 12);
    
    for (let i = 0; i < count; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        width: Math.random() * 150 + 100,
        height: Math.random() * 40 + 30,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
        puffCount: Math.floor(Math.random() * 3) + 3
      });
    }
  }
  
  function initMountains() {
    mountains = [];
    const layers = 3;
    
    for (let layer = 0; layer < layers; layer++) {
      const points = [];
      const segmentWidth = width / 8;
      
      for (let i = 0; i <= 8; i++) {
        points.push({
          x: i * segmentWidth,
          y: height * (0.65 + layer * 0.08) - Math.random() * 80 * (3 - layer)
        });
      }
      
      mountains.push({
        points,
        color: layer === 0 ? 'rgba(124, 179, 66, 0.15)' :
               layer === 1 ? 'rgba(124, 179, 66, 0.1)' :
                             'rgba(96, 125, 139, 0.06)'
      });
    }
  }
  
  function initSunRays() {
    sunRays = [];
    for (let i = 0; i < 5; i++) {
      sunRays.push({
        x: width * 0.8,
        y: height * 0.15,
        angle: Math.random() * Math.PI * 2,
        length: Math.random() * 200 + 150,
        width: Math.random() * 2 + 1,
        opacity: Math.random() * 0.08 + 0.02,
        speed: Math.random() * 0.002 + 0.001
      });
    }
  }
  
  function initBirds() {
    if (birds.length < 3 && Math.random() < 0.01) {
      birds.push({
        x: -50,
        y: Math.random() * height * 0.4,
        speed: Math.random() * 1.5 + 1,
        wingPhase: Math.random() * Math.PI * 2,
        size: Math.random() * 3 + 2
      });
    }
  }
  
  function drawCloud(cloud) {
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = '#FFFFFF';
    
    for (let i = 0; i < cloud.puffCount; i++) {
      const offsetX = (i - cloud.puffCount / 2) * cloud.width * 0.3;
      const offsetY = Math.sin(i * 1.5) * cloud.height * 0.2;
      const radius = cloud.height * (0.5 + Math.sin(i) * 0.2);
      
      ctx.beginPath();
      ctx.arc(
        cloud.x + offsetX,
        cloud.y + offsetY,
        radius,
        0, Math.PI * 2
      );
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  function drawMountain(mountain) {
    ctx.fillStyle = mountain.color;
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    mountain.points.forEach((point, i) => {
      if (i === 0) {
        ctx.lineTo(point.x, point.y);
      } else {
        const prev = mountain.points[i - 1];
        const cpX = (prev.x + point.x) / 2;
        const cpY = Math.min(prev.y, point.y) - 20;
        ctx.quadraticCurveTo(cpX, cpY, point.x, point.y);
      }
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  }
  
  function drawSun() {
    const sunX = width * 0.8;
    const sunY = height * 0.12;
    const sunRadius = 45;
    
    // 太阳光晕
    const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
    gradient.addColorStop(0, 'rgba(255, 213, 79, 0.3)');
    gradient.addColorStop(0.3, 'rgba(255, 213, 79, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 太阳本体
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
    sunGradient.addColorStop(0, '#FFF8E1');
    sunGradient.addColorStop(0.7, '#FFE082');
    sunGradient.addColorStop(1, '#FFD54F');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  function drawSunRays(time) {
    sunRays.forEach(ray => {
      ray.angle += ray.speed;
      const endX = ray.x + Math.cos(ray.angle) * ray.length;
      const endY = ray.y + Math.sin(ray.angle) * ray.length;
      
      ctx.save();
      ctx.globalAlpha = ray.opacity * (0.5 + 0.5 * Math.sin(time * 0.001 + ray.angle));
      ctx.strokeStyle = '#FFD54F';
      ctx.lineWidth = ray.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ray.x, ray.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    });
  }
  
  function drawBird(bird) {
    ctx.save();
    ctx.strokeStyle = 'rgba(44, 62, 80, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    
    const wingY = Math.sin(bird.wingPhase) * bird.size * 2;
    
    ctx.beginPath();
    ctx.moveTo(bird.x - bird.size * 2, bird.y + wingY);
    ctx.quadraticCurveTo(bird.x, bird.y - bird.size, bird.x + bird.size * 2, bird.y + wingY);
    ctx.stroke();
    ctx.restore();
  }
  
  function draw(time) {
    if (!isVisible) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // 渐变天空背景
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#E3F2FD');
    skyGradient.addColorStop(0.4, '#E8F4FD');
    skyGradient.addColorStop(0.7, '#F0F8FF');
    skyGradient.addColorStop(1, '#FAFBFC');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);
    
    // 太阳
    drawSun();
    
    // 阳光射线
    drawSunRays(time);
    
    // 远山
    mountains.forEach(m => drawMountain(m));
    
    // 云朵
    clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > width + cloud.width) {
        cloud.x = -cloud.width;
        cloud.y = Math.random() * height * 0.5;
      }
      drawCloud(cloud);
    });
    
    // 飞鸟
    initBirds();
    birds = birds.filter(bird => {
      bird.x += bird.speed;
      bird.y += Math.sin(bird.wingPhase) * 0.3;
      bird.wingPhase += 0.15;
      drawBird(bird);
      return bird.x < width + 50;
    });
    
    animationId = requestAnimationFrame(draw);
  }
  
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
 * 滚动显示动画
 */
function initScrollEffects() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  
  revealElements.forEach(el => observer.observe(el));
}

/**
 * 返回顶部
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 400) {
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
 * 花瓣飘落效果
 */
function initPetals() {
  const colors = ['#F8BBD0', '#FCE4EC', '#FFCDD2', '#E1BEE7', '#FFF8E1'];
  
  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 8 + 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50% 0 50% 50%;
      left: ${Math.random() * 100}vw;
      top: -20px;
      opacity: ${Math.random() * 0.5 + 0.3};
      animation: fall ${Math.random() * 8 + 6}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
      z-index: 999;
    `;
    document.body.appendChild(petal);
    
    setTimeout(() => petal.remove(), 14000);
  }
  
  // 每 3-6 秒生成一片花瓣
  function schedulePetal() {
    const delay = Math.random() * 3000 + 3000;
    setTimeout(() => {
      createPetal();
      schedulePetal();
    }, delay);
  }
  
  schedulePetal();
}

/**
 * 页面切换动画
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
