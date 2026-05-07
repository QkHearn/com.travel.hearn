/**
 * ============================================
 * GitHub API 封装
 * ============================================ */

class GitHubAPI {
  constructor(token, repo, branch = 'main') {
    this.token = token;
    this.repo = repo;
    this.branch = branch;
    this.baseURL = 'https://api.github.com';
  }

  async request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * 测试连接
   */
  async testConnection() {
    try {
      await this.request(`/repos/${this.repo}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取文件内容
   */
  async getFileContent(path) {
    const data = await this.request(`/repos/${this.repo}/contents/${path}?ref=${this.branch}`);
    const content = atob(data.content);
    return { content, sha: data.sha };
  }

  /**
   * 创建或更新文件
   */
  async createOrUpdateFile(path, content, message) {
    let sha = null;
    try {
      const existing = await this.getFileContent(path);
      sha = existing.sha;
    } catch (e) {
      // 文件不存在，创建新文件
    }

    const body = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: this.branch
    };

    if (sha) {
      body.sha = sha;
    }

    return this.request(`/repos/${this.repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  /**
   * 上传图片（Base64）
   */
  async uploadImage(path, base64Content, message = `Upload image: ${path}`) {
    // 移除 data:image/xxx;base64, 前缀
    const pureBase64 = base64Content.replace(/^data:image\/\w+;base64,/, '');
    
    return this.createOrUpdateFile(path, pureBase64, message);
  }

  /**
   * 提交新的旅行地点
   * @param {Object} destData - 地点数据对象
   * @param {Array} photos - 照片数组 [{name, base64}]
   * @param {Function} onProgress - 进度回调 (step, message)
   */
  async commitNewDestination(destData, photos, onProgress) {
    onProgress?.(0, '正在读取当前数据...');
    
    // 1. 获取当前 data.js
    const { content: dataJsContent, sha: dataJsSha } = await this.getFileContent('js/data.js');
    
    onProgress?.(10, '解析数据文件...');
    
    // 2. 解析并插入新地点
    const newDataJs = this.insertDestination(dataJsContent, destData);
    
    // 3. 上传照片
    const photoResults = [];
    const destId = destData.id;
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const progress = 10 + Math.round((i / photos.length) * 60);
      onProgress?.(progress, `上传照片 ${i + 1}/${photos.length}: ${photo.name}`);
      
      const photoPath = `images/travels/${destId}/${photo.name}`;
      await this.uploadImage(photoPath, photo.base64, `Add photo: ${photoPath}`);
      photoResults.push(photoPath);
    }
    
    onProgress?.(80, '更新数据文件...');
    
    // 4. 更新 data.js
    await this.request(`/repos/${this.repo}/contents/js/data.js`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Add destination: ${destData.name}`,
        content: btoa(unescape(encodeURIComponent(newDataJs))),
        sha: dataJsSha,
        branch: this.branch
      })
    });
    
    onProgress?.(100, '提交完成！');
    
    return {
      destination: destData,
      photos: photoResults
    };
  }

  /**
   * 在 data.js 中插入新地点
   */
  insertDestination(dataJsContent, newDest) {
    // 找到 destinations: [ 后的第一个 ]
    const destinationsMatch = dataJsContent.match(/destinations:\s*\[/);
    if (!destinationsMatch) {
      throw new Error('无法找到 destinations 数组');
    }
    
    const insertPos = dataJsContent.indexOf(destinationsMatch[0]) + destinationsMatch[0].length;
    
    // 生成新地点的 JS 代码
    const destCode = this.generateDestinationCode(newDest);
    
    // 插入到数组开头
    const before = dataJsContent.substring(0, insertPos);
    const after = dataJsContent.substring(insertPos);
    
    // 检查数组是否为空
    const nextChar = after.trim()[0];
    if (nextChar === ']') {
      // 空数组
      return before + '\n    ' + destCode + '\n  ' + after;
    }
    
    // 非空数组，在前面加逗号
    return before + '\n    ' + destCode + ',\n' + after;
  }

  /**
   * 生成地点对象的 JS 代码字符串
   */
  generateDestinationCode(dest) {
    const photosStr = dest.photos.map(p => `      "${p}"`).join(',\n');
    const tagsStr = dest.tags.map(t => `"${t}"`).join(', ');
    
    return `{
      id: "${dest.id}",
      name: "${dest.name}",
      country: "${dest.country}",
      province: "${dest.province}",
      city: "${dest.city}",
      ${dest.district ? `district: "${dest.district}",\n      ` : ''}lat: ${dest.lat},
      lng: ${dest.lng},
      date: "${dest.date}",
      endDate: "${dest.endDate}",
      cover: "${dest.cover}",
      photos: [
${photosStr}
      ],
      tags: [${tagsStr}],
      story: "${dest.story.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
      summary: "${dest.summary}"
    }`;
  }
}
