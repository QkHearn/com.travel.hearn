/**
 * ============================================
 * 编辑页面逻辑
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSteps();
  initGitHubConfig();
  initMapPicker();
  initPhotoUpload();
  initAIGenerate();
  initPreviewAndSubmit();
  loadSavedConfig();
});

// 全局状态
let currentStep = 1;
let githubAPI = null;
let aiGenerator = null;
let selectedPhotos = [];
let map = null;
let selectedMarker = null;

// 地点数据
let destinationData = {
  id: '',
  name: '',
  country: '中国',
  province: '',
  city: '',
  district: '',
  lat: 0,
  lng: 0,
  date: '',
  endDate: '',
  cover: '',
  photos: [],
  tags: [],
  story: '',
  summary: ''
};

/**
 * 步骤切换
 */
function initSteps() {
  const steps = document.querySelectorAll('.step-item');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = parseInt(step.dataset.step);
      if (stepNum <= currentStep || stepNum === currentStep + 1) {
        goToStep(stepNum);
      }
    });
  });
}

function goToStep(step) {
  document.querySelectorAll('.admin-step').forEach((el, index) => {
    el.classList.toggle('hidden', index + 1 !== step);
  });
  
  document.querySelectorAll('.step-item').forEach((el, index) => {
    const num = index + 1;
    el.classList.remove('active', 'completed');
    if (num < step) {
      el.classList.add('completed');
      el.querySelector('.step-number').innerHTML = '✓';
    } else if (num === step) {
      el.classList.add('active');
      el.querySelector('.step-number').textContent = num;
    } else {
      el.querySelector('.step-number').textContent = num;
    }
  });
  
  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * GitHub 配置
 */
function initGitHubConfig() {
  const btnTest = document.getElementById('btn-test-connection');
  const btnNext = document.getElementById('btn-step1-next');
  
  btnTest.addEventListener('click', async () => {
    const token = document.getElementById('github-token').value.trim();
    const repo = document.getElementById('github-repo').value.trim();
    const branch = document.getElementById('github-branch').value.trim() || 'main';
    
    if (!token || !repo) {
      showStatus('请填写 Token 和仓库地址', 'error');
      return;
    }
    
    showStatus('正在测试连接...', '');
    
    githubAPI = new GitHubAPI(token, repo, branch);
    const result = await githubAPI.testConnection();
    
    if (result.success) {
      showStatus('✓ 连接成功！可以提交到 ' + repo, 'success');
      btnNext.disabled = false;
      saveConfig();
    } else {
      showStatus('✗ 连接失败: ' + result.error, 'error');
      btnNext.disabled = true;
    }
  });
  
  btnNext.addEventListener('click', () => goToStep(2));
}

function showStatus(message, type) {
  const status = document.getElementById('connection-status');
  status.textContent = message;
  status.className = 'connection-status ' + type;
}

function saveConfig() {
  const config = {
    token: document.getElementById('github-token').value,
    repo: document.getElementById('github-repo').value,
    branch: document.getElementById('github-branch').value,
    kimiKey: document.getElementById('kimi-api-key').value
  };
  localStorage.setItem('travel_journal_config', JSON.stringify(config));
}

function loadSavedConfig() {
  try {
    const config = JSON.parse(localStorage.getItem('travel_journal_config'));
    if (config) {
      document.getElementById('github-token').value = config.token || '';
      document.getElementById('github-repo').value = config.repo || '';
      document.getElementById('github-branch').value = config.branch || 'main';
      document.getElementById('kimi-api-key').value = config.kimiKey || '';
    }
  } catch (e) {}
}

/**
 * 地图选点
 */
function initMapPicker() {
  document.getElementById('btn-step2-prev').addEventListener('click', () => goToStep(1));
  document.getElementById('btn-step2-next').addEventListener('click', () => {
    if (destinationData.lat && destinationData.lng) {
      goToStep(3);
    }
  });
  
  document.getElementById('btn-search').addEventListener('click', searchLocation);
  document.getElementById('location-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchLocation();
  });
  
  // 初始化地图
  setTimeout(() => {
    map = L.map('admin-map').setView([35, 105], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);
    
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setLocation(lat, lng);
    });
  }, 100);
}

function setLocation(lat, lng) {
  destinationData.lat = lat;
  destinationData.lng = lng;
  
  document.getElementById('coord-lat').textContent = lat.toFixed(4);
  document.getElementById('coord-lng').textContent = lng.toFixed(4);
  
  if (selectedMarker) {
    map.removeLayer(selectedMarker);
  }
  
  selectedMarker = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 10);
  
  // 尝试反向地理编码
  reverseGeocode(lat, lng);
  
  document.getElementById('btn-step2-next').disabled = false;
}

async function reverseGeocode(lat, lng) {
  try {
    // 使用高德地图 API 进行反向地理编码（免费，无需 key 用于简单查询）
    // 或使用 Nominatim
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=zh-CN`);
    const data = await response.json();
    
    if (data.address) {
      const addr = data.address;
      destinationData.province = addr.state || addr.province || '';
      destinationData.city = addr.city || addr.county || '';
      destinationData.district = addr.district || addr.suburb || '';
      
      document.getElementById('coord-province').textContent = destinationData.province || '--';
      document.getElementById('coord-city').textContent = destinationData.city || '--';
    }
  } catch (e) {
    console.log('反向地理编码失败', e);
  }
}

async function searchLocation() {
  const query = document.getElementById('location-search').value.trim();
  if (!query) return;
  
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=zh-CN`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      setLocation(lat, lng);
    } else {
      alert('未找到该地点，请尝试其他关键词');
    }
  } catch (e) {
    alert('搜索失败，请检查网络');
  }
}

/**
 * 照片上传
 */
function initPhotoUpload() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('photo-input');
  
  zone.addEventListener('click', () => input.click());
  
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  
  input.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
  
  document.getElementById('btn-step3-prev').addEventListener('click', () => goToStep(2));
  document.getElementById('btn-step3-next').addEventListener('click', () => {
    // 保存基本信息
    destinationData.name = document.getElementById('input-name').value.trim();
    destinationData.country = document.getElementById('input-country').value.trim();
    destinationData.province = document.getElementById('input-province').value.trim();
    destinationData.city = document.getElementById('input-city').value.trim();
    destinationData.date = document.getElementById('input-date').value;
    destinationData.endDate = document.getElementById('input-end-date').value;
    destinationData.tags = document.getElementById('input-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    destinationData.summary = document.getElementById('input-summary').value.trim();
    
    if (!destinationData.name || !destinationData.date) {
      alert('请填写必填项：地点名称和开始日期');
      return;
    }
    
    goToStep(4);
  });
  
  document.getElementById('btn-step4-prev').addEventListener('click', () => goToStep(3));
  document.getElementById('btn-step4-next').addEventListener('click', () => goToStep(5));
}

function handleFiles(files) {
  Array.from(files).forEach(async (file, index) => {
    if (!file.type.startsWith('image/')) return;
    
    const base64 = await fileToBase64(file);
    const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.85 });
    const compressedBase64 = await blobToBase64(compressed);
    
    const photo = {
      file,
      name: `${index + 1}.jpg`,
      base64: compressedBase64,
      preview: base64,
      isCover: selectedPhotos.length === 0
    };
    
    selectedPhotos.push(photo);
    renderPhotoPreview();
  });
}

function renderPhotoPreview() {
  const grid = document.getElementById('photo-preview');
  grid.innerHTML = selectedPhotos.map((photo, index) => `
    <div class="photo-preview-item ${photo.isCover ? 'cover' : ''}" data-index="${index}">
      <img src="${photo.preview}" alt="">
      ${photo.isCover ? '<span class="cover-badge">封面</span>' : ''}
      <span class="remove-btn" onclick="removePhoto(${index})">✕</span>
    </div>
  `).join('');
  
  // 点击设置封面
  grid.querySelectorAll('.photo-preview-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) return;
      const index = parseInt(item.dataset.index);
      selectedPhotos.forEach((p, i) => p.isCover = i === index);
      renderPhotoPreview();
    });
  });
}

function removePhoto(index) {
  selectedPhotos.splice(index, 1);
  if (selectedPhotos.length > 0 && !selectedPhotos.some(p => p.isCover)) {
    selectedPhotos[0].isCover = true;
  }
  renderPhotoPreview();
}

/**
 * AI 生成故事
 */
function initAIGenerate() {
  const btnAI = document.getElementById('btn-ai-generate');
  const kimiKey = document.getElementById('kimi-api-key').value;
  
  btnAI.disabled = !kimiKey || selectedPhotos.length === 0;
  
  btnAI.addEventListener('click', async () => {
    const key = document.getElementById('kimi-api-key').value;
    if (!key) {
      alert('请先配置 Kimi API Key');
      return;
    }
    
    if (selectedPhotos.length === 0) {
      alert('请先上传照片');
      return;
    }
    
    aiGenerator = new AIStoryGenerator(key);
    
    document.getElementById('ai-loading').classList.remove('hidden');
    btnAI.disabled = true;
    
    try {
      const coverPhoto = selectedPhotos.find(p => p.isCover) || selectedPhotos[0];
      const story = await aiGenerator.generateStory(coverPhoto.preview, destinationData.name);
      document.getElementById('input-story').value = story;
    } catch (error) {
      alert('AI 生成失败: ' + error.message);
    } finally {
      document.getElementById('ai-loading').classList.add('hidden');
      btnAI.disabled = false;
    }
  });
  
  document.getElementById('btn-step5-prev').addEventListener('click', () => goToStep(4));
  document.getElementById('btn-step5-next').addEventListener('click', () => {
    destinationData.story = document.getElementById('input-story').value.trim();
    updatePreview();
    goToStep(6);
  });
}

/**
 * 预览和提交
 */
function initPreviewAndSubmit() {
  document.getElementById('btn-step6-prev').addEventListener('click', () => goToStep(5));
  document.getElementById('btn-submit').addEventListener('click', submitToGitHub);
}

function updatePreview() {
  const dest = destinationData;
  dest.id = generateIdFromName(dest.name);
  dest.photos = selectedPhotos.map((p, i) => `images/travels/${dest.id}/${p.name}`);
  dest.cover = dest.photos[0] || '';
  
  document.getElementById('preview-name').textContent = dest.name;
  document.getElementById('preview-location').textContent = `${dest.province || ''} · ${dest.city || ''}`;
  document.getElementById('preview-date').textContent = formatDateRange(dest.date, dest.endDate);
  document.getElementById('preview-summary').textContent = dest.summary;
  document.getElementById('preview-tags').innerHTML = dest.tags.map(t => `<span class="tag">${t}</span>`).join('');
  document.getElementById('preview-photos').innerHTML = selectedPhotos.map(p => `<img src="${p.preview}" alt="">`).join('');
}

async function submitToGitHub() {
  if (!githubAPI) {
    alert('GitHub 未配置，请返回第一步');
    return;
  }
  
  const btn = document.getElementById('btn-submit');
  const progress = document.getElementById('submit-progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const result = document.getElementById('submit-result');
  
  btn.disabled = true;
  progress.classList.remove('hidden');
  result.className = 'submit-result';
  result.textContent = '';
  
  try {
    const onProgress = (percent, message) => {
      progressFill.style.width = percent + '%';
      progressText.textContent = message;
    };
    
    await githubAPI.commitNewDestination(destinationData, selectedPhotos, onProgress);
    
    result.classList.add('success');
    result.innerHTML = `
      <p>✓ 提交成功！</p>
      <p style="margin-top: 0.5rem; font-size: 0.9rem;">
        数据已推送到 GitHub，大约 1-2 分钟后网站会自动更新。<br>
        <a href="index.html" style="color: var(--grass-green); text-decoration: underline;">返回首页查看</a>
      </p>
    `;
    
    // 重置表单
    setTimeout(() => {
      if (confirm('是否继续添加下一个地点？')) {
        location.reload();
      }
    }, 2000);
    
  } catch (error) {
    result.classList.add('error');
    result.innerHTML = `
      <p>✗ 提交失败</p>
      <p style="margin-top: 0.5rem; font-size: 0.85rem;">${error.message}</p>
    `;
    btn.disabled = false;
  }
}

function generateIdFromName(name) {
  const pinyin = name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-').toLowerCase();
  return pinyin.replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);
}
