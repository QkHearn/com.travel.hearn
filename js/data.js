/**
 * ============================================
 * Hearn & 瑾怡 旅行数据 2.0
 * 
 * 数据结构（新增 province/city/district 支持聚合统计）：
 * {
 *   id: "唯一标识",
 *   name: "地点名称",
 *   country: "国家",
 *   province: "省/州",      // 新增，用于聚合统计
 *   city: "市",             // 新增
 *   district: "区县",       // 可选
 *   lat: 纬度,
 *   lng: 经度,
 *   date: "开始日期",
 *   endDate: "结束日期",
 *   cover: "封面图路径",
 *   photos: ["照片路径数组"],
 *   tags: ["标签数组"],
 *   story: "旅行故事",
 *   summary: "一句话总结"
 * }
 * ============================================
 */

const travelData = {
  destinations: [
    {
      id: "chengdu-jinli",
      name: "锦里古街",
      country: "中国",
      province: "四川",
      city: "成都",
      district: "武侯区",
      lat: 30.6456,
      lng: 104.0494,
      date: "2024-10-01",
      endDate: "2024-10-02",
      cover: "images/travels/chengdu-jinli/cover.jpg",
      photos: [
        "images/travels/chengdu-jinli/1.jpg",
        "images/travels/chengdu-jinli/2.jpg",
        "images/travels/chengdu-jinli/3.jpg"
      ],
      tags: ["古街", "美食", "文化", "夜景"],
      story: "锦里的夜晚，红灯笼高高挂起，古街的青石板路被暖黄色的灯光映照得格外温馨。我们在小吃摊前排队，等待着那一碗热气腾腾的担担面。皮影戏的老艺人在街边表演，引来围观的人群阵阵掌声。这里的每一块砖、每一片瓦，都诉说着三国时期的故事。",
      summary: "在锦里古街感受成都的热闹与烟火气"
    },
    {
      id: "chengdu-panda",
      name: "大熊猫繁育基地",
      country: "中国",
      province: "四川",
      city: "成都",
      district: "成华区",
      lat: 30.7345,
      lng: 104.1474,
      date: "2024-10-03",
      endDate: "2024-10-03",
      cover: "images/travels/chengdu-panda/cover.jpg",
      photos: [
        "images/travels/chengdu-panda/1.jpg",
        "images/travels/chengdu-panda/2.jpg"
      ],
      tags: ["自然", "动物", "亲子", "可爱"],
      story: "清晨六点就起床，只为看大熊猫吃早茶。当第一只滚滚抱着竹子慢悠悠地出现时，所有的困意都烟消云散了。它们或躺或坐，憨态可掬，偶尔还会表演一个标准的\"翻滚\`。阳光透过竹林洒下斑驳的光影，整个基地弥漫着竹子的清香。",
      summary: "与国宝大熊猫的亲密接触"
    },
    {
      id: "chengdu-wide-narrow",
      name: "宽窄巷子",
      country: "中国",
      province: "四川",
      city: "成都",
      district: "青羊区",
      lat: 30.6698,
      lng: 104.0556,
      date: "2024-10-04",
      endDate: "2024-10-04",
      cover: "images/travels/chengdu-wide-narrow/cover.jpg",
      photos: [
        "images/travels/chengdu-wide-narrow/1.jpg",
        "images/travels/chengdu-wide-narrow/2.jpg",
        "images/travels/chengdu-wide-narrow/3.jpg"
      ],
      tags: ["历史", "建筑", "茶馆", "慢生活"],
      story: "宽巷子、窄巷子、井巷子，三条平行的老街构成了成都最独特的文化名片。我们在宽巷子的茶馆里泡了一下午，看着掏耳朵的老师傅在顾客脸上施展绝技，听着邻桌大爷们摆龙门阵。窄巷子的文创店里，每一件小物件都承载着老成都的记忆。",
      summary: "在宽窄巷子体验老成都的慢生活"
    },
    {
      id: "yaan-bifengxia",
      name: "碧峰峡",
      country: "中国",
      province: "四川",
      city: "雅安",
      district: "雨城区",
      lat: 30.0817,
      lng: 102.9931,
      date: "2024-10-05",
      endDate: "2024-10-06",
      cover: "images/travels/yaan-bifengxia/cover.jpg",
      photos: [
        "images/travels/yaan-bifengxia/1.jpg",
        "images/travels/yaan-bifengxia/2.jpg"
      ],
      tags: ["峡谷", "瀑布", "自然", "徒步"],
      story: "碧峰峡的瀑布从百米悬崖飞流直下，水雾在阳光下折射出彩虹。我们沿着峡谷栈道徒步，两旁是茂密的原始森林，空气中负氧离子爆表。雅安是大熊猫的发现地，峡谷深处的野生动物园里，小熊猫在树上悠闲地打盹。",
      summary: "碧峰峡的瀑布与原始森林"
    },
    {
      id: "yaan-shangli",
      name: "上里古镇",
      country: "中国",
      province: "四川",
      city: "雅安",
      district: "雨城区",
      lat: 30.0654,
      lng: 102.9543,
      date: "2024-10-07",
      endDate: "2024-10-07",
      cover: "images/travels/yaan-shangli/cover.jpg",
      photos: [
        "images/travels/yaan-shangli/1.jpg",
        "images/travels/yaan-shangli/2.jpg",
        "images/travels/yaan-shangli/3.jpg"
      ],
      tags: ["古镇", "水乡", "宁静", "摄影"],
      story: "上里古镇是茶马古道的起点之一，古老的石板桥横跨清澈的河水。这里没有 commercial 的喧嚣，只有当地老人在桥头下棋、聊天。傍晚时分，炊烟袅袅升起，整个古镇笼罩在一层金色的暮光中，时间仿佛在这里静止了。",
      summary: "茶马古道上的宁静水乡"
    },
    {
      id: "lijiang-old-town",
      name: "丽江古城",
      country: "中国",
      province: "云南",
      city: "丽江",
      district: "古城区",
      lat: 26.8721,
      lng: 100.2295,
      date: "2024-04-10",
      endDate: "2024-04-15",
      cover: "images/travels/lijiang-old-town/cover.jpg",
      photos: [
        "images/travels/lijiang-old-town/1.jpg",
        "images/travels/lijiang-old-town/2.jpg",
        "images/travels/lijiang-old-town/3.jpg"
      ],
      tags: ["古城", "纳西", "雪山", "浪漫"],
      story: "丽江古城的四月，樱花和杜鹃竞相开放。清晨的四方街还没有游客，只有纳西族老奶奶在河边洗菜。我们爬到狮子山顶，远眺玉龙雪山在云雾中若隐若现。夜晚的酒吧街热闹非凡，但我们更喜欢在客栈的天台上，听着远处传来的纳西古乐，仰望满天繁星。",
      summary: "在丽江古城邂逅纳西风情与玉龙雪山"
    }
  ]
};

/**
 * 获取所有照片（用于画廊）
 */
function getAllPhotos() {
  const photos = [];
  travelData.destinations.forEach(dest => {
    dest.photos.forEach((photo, index) => {
      photos.push({
        src: photo,
        destination: dest.name,
        city: dest.city,
        province: dest.province,
        country: dest.country,
        date: dest.date,
        tags: dest.tags,
        story: dest.story,
        id: `${dest.id}-${index}`
      });
    });
  });
  return photos;
}

/**
 * 获取统计数据
 */
function getStats() {
  const countries = new Set(travelData.destinations.map(d => d.country));
  const provinces = new Set(travelData.destinations.map(d => d.province).filter(Boolean));
  const cities = new Set(travelData.destinations.map(d => d.city).filter(Boolean));
  const totalDays = travelData.destinations.reduce((sum, d) => {
    const start = new Date(d.date);
    const end = new Date(d.endDate);
    return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }, 0);
  
  return {
    countries: countries.size,
    provinces: provinces.size,
    cities: cities.size,
    destinations: travelData.destinations.length,
    days: totalDays
  };
}

/**
 * 获取所有标签
 */
function getAllTags() {
  const tags = new Set();
  travelData.destinations.forEach(d => d.tags.forEach(t => tags.add(t)));
  return Array.from(tags);
}

/**
 * 获取所有国家和年份（用于筛选）
 */
function getFilters() {
  const countries = [...new Set(travelData.destinations.map(d => d.country))];
  const provinces = [...new Set(travelData.destinations.map(d => d.province).filter(Boolean))];
  const cities = [...new Set(travelData.destinations.map(d => d.city).filter(Boolean))];
  const years = [...new Set(travelData.destinations.map(d => 
    new Date(d.date).getFullYear()
  ))].sort((a, b) => b - a);
  
  return { countries, provinces, cities, years };
}

/**
 * ============================================
 * 聚合统计功能（新增）
 * ============================================
 */

/**
 * 按省份聚合统计
 * @returns {Object} { 四川: 5, 云南: 3, ... }
 */
function getProvinceStats() {
  const stats = {};
  travelData.destinations.forEach(dest => {
    const province = dest.province || '其他';
    stats[province] = (stats[province] || 0) + 1;
  });
  return stats;
}

/**
 * 按城市聚合统计（在指定省份内）
 * @param {string} province - 省份名称
 * @returns {Object} { 成都: 3, 雅安: 2 }
 */
function getCityStats(province) {
  const stats = {};
  travelData.destinations
    .filter(dest => dest.province === province)
    .forEach(dest => {
      const city = dest.city || '其他';
      stats[city] = (stats[city] || 0) + 1;
    });
  return stats;
}

/**
 * 获取层级树形结构
 * @returns {Array} [{name: '四川', count: 5, children: [{name: '成都', count: 3}, ...]}, ...]
 */
function getLocationTree() {
  const tree = [];
  const provinceMap = {};
  
  travelData.destinations.forEach(dest => {
    const province = dest.province || '其他';
    const city = dest.city || '其他';
    
    if (!provinceMap[province]) {
      provinceMap[province] = { name: province, count: 0, children: {} };
    }
    provinceMap[province].count++;
    
    if (!provinceMap[province].children[city]) {
      provinceMap[province].children[city] = { name: city, count: 0 };
    }
    provinceMap[province].children[city].count++;
  });
  
  for (const province in provinceMap) {
    const children = [];
    for (const city in provinceMap[province].children) {
      children.push(provinceMap[province].children[city]);
    }
    tree.push({
      name: province,
      count: provinceMap[province].count,
      children: children.sort((a, b) => b.count - a.count)
    });
  }
  
  return tree.sort((a, b) => b.count - a.count);
}
