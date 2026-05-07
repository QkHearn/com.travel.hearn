/**
 * ============================================
 * AI 故事生成模块 - Kimi API
 * ============================================ */

class AIStoryGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.moonshot.cn/v1';
  }

  /**
   * 根据照片生成旅行故事
   * @param {string} imageBase64 - 照片的 base64 数据
   * @param {string} locationName - 地点名称
   * @param {string} style - 故事风格: literary(文艺) | casual(轻松) | poetic(诗意)
   */
  async generateStory(imageBase64, locationName, style = 'literary') {
    const stylePrompts = {
      literary: '写一段文艺清新风格的旅行日记',
      casual: '写一段轻松愉快的旅行记录',
      poetic: '写一段富有诗意的散文'
    };

    const prompt = `${stylePrompts[style] || stylePrompts.literary}，关于在"${locationName}"的旅行经历。根据这张照片的内容，描述场景、氛围和感受，300字左右。用第一人称"我们"叙述，语言优美，情感真挚。`;

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageBase64 }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ],
        temperature: 0.8,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API 错误: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * 批量生成（多张照片参考）
   */
  async generateStoryBatch(imageBase64List, locationName, style = 'literary') {
    if (imageBase64List.length === 0) {
      throw new Error('请至少上传一张照片');
    }

    const stylePrompts = {
      literary: '写一段文艺清新风格的旅行日记',
      casual: '写一段轻松愉快的旅行记录',
      poetic: '写一段富有诗意的散文'
    };

    const prompt = `${stylePrompts[style] || stylePrompts.literary}，关于在"${locationName}"的旅行经历。参考这些照片，描述场景、氛围和感受，300-500字。用第一人称"我们"叙述，语言优美，情感真挚。`;

    const content = imageBase64List.map(img => ({
      type: 'image_url',
      image_url: { url: img }
    }));

    content.push({ type: 'text', text: prompt });

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k-vision-preview',
        messages: [{ role: 'user', content }],
        temperature: 0.8,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API 错误: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}
