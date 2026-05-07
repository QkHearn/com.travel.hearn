/**
 * ============================================
 * Hearn & 瑾怡 旅行数据
 * 
 * 维护指南：
 * 1. 在 destinations 数组中添加新的旅行地点
 * 2. 每个地点需要包含：id, name, country, lat, lng, date, cover, photos, tags, story, summary
 * 3. 将照片放入 images/travels/{地点英文名称}/ 目录
 * 4. 封面图推荐尺寸 1200x800，画廊图 1200x800 或 800x1200
 * ============================================
 */

const travelData = {
  destinations: [
    {
      id: "paris-2024",
      name: "巴黎",
      country: "法国",
      lat: 48.8566,
      lng: 2.3522,
      date: "2024-05-15",
      endDate: "2024-05-20",
      cover: "images/travels/paris/cover.jpg",
      photos: [
        "images/travels/paris/1.jpg",
        "images/travels/paris/2.jpg",
        "images/travels/paris/3.jpg"
      ],
      tags: ["浪漫", "艺术", "美食", "建筑"],
      story: "五月的巴黎，梧桐树影婆娑，塞纳河畔的微风轻拂。我们在卢浮宫前驻足，在蒙马特高地看日落，在玛黑区的小巷里寻找最地道的可丽饼。巴黎是一座需要慢慢品味的城市，每一条街道都有故事，每一座建筑都是艺术。埃菲尔铁塔在夜色中闪烁，我们在塔下的草坪上野餐，感受着这座城市的浪漫气息。",
      summary: "在塞纳河畔感受艺术之都的浪漫气息"
    },
    {
      id: "kyoto-2024",
      name: "京都",
      country: "日本",
      lat: 35.0116,
      lng: 135.7681,
      date: "2024-04-02",
      endDate: "2024-04-08",
      cover: "images/travels/kyoto/cover.jpg",
      photos: [
        "images/travels/kyoto/1.jpg",
        "images/travels/kyoto/2.jpg",
        "images/travels/kyoto/3.jpg"
      ],
      tags: ["樱花", "古寺", "文化", "自然"],
      story: "樱花季的京都是粉色的梦境。我们在清水寺看夜樱，在岚山竹林中漫步，在祗园偶遇匆匆走过的艺伎。清晨的伏见稻荷大社没有游客，千本鸟居在晨光中显得格外神秘。哲学之道上的樱花隧道落英缤纷，我们骑车穿过，像穿越了一场粉色的雨。在京都的每一天，都像在画中行走。",
      summary: "樱花季的千年古都，一场粉色的梦境"
    },
    {
      id: "santorini-2023",
      name: "圣托里尼",
      country: "希腊",
      lat: 36.3932,
      lng: 25.4615,
      date: "2023-09-10",
      endDate: "2023-09-15",
      cover: "images/travels/santorini/cover.jpg",
      photos: [
        "images/travels/santorini/1.jpg",
        "images/travels/santorini/2.jpg",
        "images/travels/santorini/3.jpg"
      ],
      tags: ["海岛", "日落", "浪漫", "蓝白"],
      story: "圣托里尼的蓝白世界，像是上帝打翻了调色盘。伊亚的日落被誉为世界上最美的日落，我们在悬崖边的白色小屋阳台上，看着太阳缓缓沉入海平面，天空被染成金红色。费拉的悬崖步道蜿蜒曲折，每一步都是明信片般的风景。我们租了一辆ATV环岛骑行，在黑沙滩晒太阳，在红沙滩探险，在古老的阿克罗蒂里遗址感受三千年的文明。",
      summary: "爱琴海上的蓝白梦境，世界上最美的日落"
    },
    {
      id: "reykjavik-2023",
      name: "雷克雅未克",
      country: "冰岛",
      lat: 64.1466,
      lng: -21.9426,
      date: "2023-11-20",
      endDate: "2023-11-28",
      cover: "images/travels/reykjavik/cover.jpg",
      photos: [
        "images/travels/reykjavik/1.jpg",
        "images/travels/reykjavik/2.jpg",
        "images/travels/reykjavik/3.jpg"
      ],
      tags: ["极光", "冰川", "自然", "探险"],
      story: "冰岛是地球的异世界。我们在黑沙滩看巨浪拍打玄武岩柱，在钻石沙滩上捡晶莹剔透的冰块，在蓝湖温泉中泡着看雪花飘落。最难忘的是那个寒冷的夜晚，我们在郊外的小木屋里等待极光。当绿色的光带在天空中舞动时，整个世界都安静了。那一刻，我们明白了为什么冰岛被称为'冰与火之歌'。",
      summary: "追逐极光，在冰与火的国度感受自然的震撼"
    },
    {
      id: "marrakech-2023",
      name: "马拉喀什",
      country: "摩洛哥",
      lat: 31.6295,
      lng: -7.9811,
      date: "2023-06-05",
      endDate: "2023-06-12",
      cover: "images/travels/marrakech/cover.jpg",
      photos: [
        "images/travels/marrakech/1.jpg",
        "images/travels/marrakech/2.jpg",
        "images/travels/marrakech/3.jpg"
      ],
      tags: ["异域", "集市", "沙漠", "色彩"],
      story: "马拉喀什是一场色彩的盛宴。杰马夫纳广场日夜不息，白天是耍蛇人和 storyteller 的舞台，夜晚变成露天美食市场。我们在迷宫中般的麦地那迷失，又在每一个转角发现惊喜——精美的马赛克瓷砖、手工皮具、香气四溢的香料。出了城，撒哈拉沙漠在召唤。我们骑骆驼看日落，在柏柏尔人的帐篷里看满天繁星，那是我们见过最亮的星星。",
      summary: "红色之城，在撒哈拉沙漠边缘感受异域风情"
    },
    {
      id: "queenstown-2023",
      name: "皇后镇",
      country: "新西兰",
      lat: -45.0312,
      lng: 168.6626,
      date: "2023-02-14",
      endDate: "2023-02-22",
      cover: "images/travels/queenstown/cover.jpg",
      photos: [
        "images/travels/queenstown/1.jpg",
        "images/travels/queenstown/2.jpg",
        "images/travels/queenstown/3.jpg"
      ],
      tags: ["冒险", "湖景", "山脉", "自然"],
      story: "皇后镇是南半球的冒险之都。我们在瓦卡蒂普湖畔醒来，窗外是雪山和碧蓝的湖水。跳伞那天，从15000英尺高空跳下，整个世界在脚下旋转。蹦极、喷射快艇、冰川徒步——每一项都让我们肾上腺素飙升。但最难忘的是米尔福德峡湾的游轮之旅，瀑布从千米悬崖飞流直下，海豚在船边跳跃，那一刻，大自然的美让我们屏住了呼吸。",
      summary: "南半球的冒险天堂，雪山湖泊间的极限体验"
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
  const totalDays = travelData.destinations.reduce((sum, d) => {
    const start = new Date(d.date);
    const end = new Date(d.endDate);
    return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }, 0);
  
  return {
    countries: countries.size,
    cities: travelData.destinations.length,
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
  const years = [...new Set(travelData.destinations.map(d => 
    new Date(d.date).getFullYear()
  ))].sort((a, b) => b - a);
  
  return { countries, years };
}
