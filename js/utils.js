/**
 * ============================================
 * 工具函数
 * ============================================ */

function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function formatDate(dateStr, options = {}) {
  const date = new Date(dateStr);
  const defaults = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('zh-CN', { ...defaults, ...options });
}

function formatDateRange(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  
  if (sameMonth) {
    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}-${end.getDate()}日`;
  }
  if (sameYear) {
    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
  }
  return `${formatDate(startStr)} - ${formatDate(endStr)}`;
}

function setupLazyLoad(selector = 'img[data-src]') {
  const images = document.querySelectorAll(selector);
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    
    images.forEach(img => observer.observe(img));
  } else {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
}

function truncate(text, maxLength = 150, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
}

function groupByYear(destinations) {
  return groupBy(destinations, d => new Date(d.date).getFullYear());
}

function sortByDate(destinations, order = 'desc') {
  return [...destinations].sort((a, b) => {
    const diff = new Date(b.date) - new Date(a.date);
    return order === 'desc' ? diff : -diff;
  });
}

const Easing = {
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutQuart: t => 1 - Math.pow(1 - t, 4),
  easeOutBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
};

function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = Easing.easeOutQuart(progress);
    const current = Math.round(start + (target - start) * eased);
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function isInViewport(element, threshold = 0.2) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight * (1 - threshold);
}

function createElement(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'textContent') {
      el.textContent = value;
    } else if (key === 'innerHTML') {
      el.innerHTML = value;
    } else {
      el.setAttribute(key, value);
    }
  });
  return el;
}

/**
 * ============================================
 * 新增：照片压缩工具
 * ============================================
 */

/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {Object} options - 配置 { maxWidth, maxHeight, quality }
 * @returns {Promise<Blob>} 压缩后的图片 Blob
 */
function compressImage(file, options = {}) {
  const { maxWidth = 1600, maxHeight = 1200, quality = 0.85 } = options;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 将 Blob 转为 Base64
 */
function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * 将 File 转为 Base64
 */
function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
