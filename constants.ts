import { PhonemeTarget } from './types';

export const APP_NAME = "YuYin 语音康复";

// Helper to create consistent structure
// Level 1: Monosyllabic, Level 2: Disyllabic, Level 3: Trisyllabic
export const INITIALS: PhonemeTarget[] = [
  { 
    id: 'b', label: 'b', category: 'initial',
    examples: [
      { text: '爸', pinyin: 'bà', level: 1 },
      { text: '笔', pinyin: 'bǐ', level: 1 },
      { text: '包', pinyin: 'bāo', level: 1 },
      { text: '杯子', pinyin: 'bēi zi', level: 2 },
      { text: '菠萝', pinyin: 'bō luó', level: 2 },
      { text: '饼干', pinyin: 'bǐng gān', level: 2 },
      { text: '爸爸', pinyin: 'bà ba', level: 2 },
      { text: '拔萝卜', pinyin: 'bá luó bo', level: 3 },
      { text: '冰激凌', pinyin: 'bīng jī líng', level: 3 },
      { text: '博物馆', pinyin: 'bó wù guǎn', level: 3 }
    ]
  },
  { 
    id: 'p', label: 'p', category: 'initial',
    examples: [
      { text: '爬', pinyin: 'pá', level: 1 },
      { text: '跑', pinyin: 'pǎo', level: 1 },
      { text: '盆', pinyin: 'pén', level: 1 },
      { text: '婆婆', pinyin: 'pó po', level: 2 },
      { text: '苹果', pinyin: 'píng guǒ', level: 2 },
      { text: '葡萄', pinyin: 'pú tao', level: 2 },
      { text: '排排坐', pinyin: 'pái pái zuò', level: 3 },
      { text: '爬山虎', pinyin: 'pá shān hǔ', level: 3 },
      { text: '乒乓球', pinyin: 'pīng pāng qiú', level: 3 },
      { text: '喷泉水', pinyin: 'pēn quán shuǐ', level: 3 }
    ]
  },
  { 
    id: 'm', label: 'm', category: 'initial',
    examples: [
      { text: '妈', pinyin: 'mā', level: 1 },
      { text: '马', pinyin: 'mǎ', level: 1 },
      { text: '门', pinyin: 'mén', level: 1 },
      { text: '猫咪', pinyin: 'māo mī', level: 2 },
      { text: '面包', pinyin: 'miàn bāo', level: 2 },
      { text: '蚂蚁', pinyin: 'mǎ yǐ', level: 2 },
      { text: '蘑菇汤', pinyin: 'mó gu tāng', level: 3 },
      { text: '梅花鹿', pinyin: 'méi huā lù', level: 3 },
      { text: '摩托车', pinyin: 'mó tuō chē', level: 3 },
      { text: '满天星', pinyin: 'mǎn tiān xīng', level: 3 }
    ]
  },
  { 
    id: 'f', label: 'f', category: 'initial',
    examples: [
      { text: '飞', pinyin: 'fēi', level: 1 },
      { text: '佛', pinyin: 'fó', level: 1 },
      { text: '饭', pinyin: 'fàn', level: 1 },
      { text: '蜜蜂', pinyin: 'mì fēng', level: 2 }, // f in second syllable usually accepted for variation, but let's stick to initials for purity where possible
      { text: '飞机', pinyin: 'fēi jī', level: 2 },
      { text: '房子', pinyin: 'fáng zi', level: 2 },
      { text: '风车', pinyin: 'fēng chē', level: 2 },
      { text: '发脾气', pinyin: 'fā pí qi', level: 3 },
      { text: '番茄酱', pinyin: 'fān qié jiàng', level: 3 },
      { text: '风景画', pinyin: 'fēng jǐng huà', level: 3 }
    ]
  },
  { 
    id: 'd', label: 'd', category: 'initial',
    examples: [
      { text: '蛋', pinyin: 'dàn', level: 1 },
      { text: '灯', pinyin: 'dēng', level: 1 },
      { text: '刀', pinyin: 'dāo', level: 1 },
      { text: '大豆', pinyin: 'dà dòu', level: 2 },
      { text: '弟弟', pinyin: 'dì di', level: 2 },
      { text: '蛋糕', pinyin: 'dàn gāo', level: 2 },
      { text: '袋鼠', pinyin: 'dài shǔ', level: 2 },
      { text: '打地鼠', pinyin: 'dǎ dì shǔ', level: 3 },
      { text: '大灰狼', pinyin: 'dà huī láng', level: 3 },
      { text: '电视机', pinyin: 'diàn shì jī', level: 3 }
    ]
  },
  { 
    id: 't', label: 't', category: 'initial',
    examples: [
      { text: '兔', pinyin: 'tù', level: 1 },
      { text: '糖', pinyin: 'táng', level: 1 },
      { text: '跳', pinyin: 'tiào', level: 1 },
      { text: '太阳', pinyin: 'tài yáng', level: 2 },
      { text: '踢球', pinyin: 'tī qiú', level: 2 },
      { text: '特别', pinyin: 'tè bié', level: 2 },
      { text: '天鹅', pinyin: 'tiān é', level: 2 },
      { text: '太阳镜', pinyin: 'tài yáng jìng', level: 3 },
      { text: '太妃糖', pinyin: 'tài fēi táng', level: 3 },
      { text: '图书馆', pinyin: 'tú shū guǎn', level: 3 }
    ]
  },
  { 
    id: 'n', label: 'n', category: 'initial',
    examples: [
      { text: '奶', pinyin: 'nǎi', level: 1 },
      { text: '牛', pinyin: 'niú', level: 1 },
      { text: '鸟', pinyin: 'niǎo', level: 1 },
      { text: '牛奶', pinyin: 'niú nǎi', level: 2 },
      { text: '奶奶', pinyin: 'nǎi nai', level: 2 },
      { text: '泥土', pinyin: 'ní tǔ', level: 2 },
      { text: '南瓜', pinyin: 'nán guā', level: 2 },
      { text: '南瓜车', pinyin: 'nán guā chē', level: 3 },
      { text: '泥娃娃', pinyin: 'ní wá wa', level: 3 },
      { text: '暖洋洋', pinyin: 'nuǎn yáng yáng', level: 3 }
    ]
  },
  { 
    id: 'l', label: 'l', category: 'initial',
    examples: [
      { text: '梨', pinyin: 'lí', level: 1 },
      { text: '路', pinyin: 'lù', level: 1 },
      { text: '狼', pinyin: 'láng', level: 1 },
      { text: '拉手', pinyin: 'lā shǒu', level: 2 },
      { text: '快乐', pinyin: 'kuài lè', level: 2 }, // l in second syllable
      { text: '老虎', pinyin: 'lǎo hǔ', level: 2 },
      { text: '蓝天', pinyin: 'lán tiān', level: 2 },
      { text: '老好人', pinyin: 'lǎo hǎo rén', level: 3 },
      { text: '溜滑梯', pinyin: 'liū huá tī', level: 3 },
      { text: '绿油油', pinyin: 'lǜ yóu yóu', level: 3 }
    ]
  },
  { 
    id: 'g', label: 'g', category: 'initial',
    examples: [
      { text: '哥', pinyin: 'gē', level: 1 },
      { text: '狗', pinyin: 'gǒu', level: 1 },
      { text: '鼓', pinyin: 'gǔ', level: 1 },
      { text: '哥哥', pinyin: 'gē ge', level: 2 },
      { text: '故宫', pinyin: 'gù gōng', level: 2 },
      { text: '刚刚', pinyin: 'gāng gāng', level: 2 },
      { text: '刮风', pinyin: 'guā fēng', level: 2 },
      { text: '公共汽车', pinyin: 'gōng gòng qì chē', level: 3 }, 
      { text: '咕噜噜', pinyin: 'gū lū lū', level: 3 },
      { text: '过家家', pinyin: 'guò jiā jiā', level: 3 }
    ]
  },
  { 
    id: 'k', label: 'k', category: 'initial',
    examples: [
      { text: '看', pinyin: 'kàn', level: 1 },
      { text: '开', pinyin: 'kāi', level: 1 },
      { text: '口', pinyin: 'kǒu', level: 1 },
      { text: '蝌蚪', pinyin: 'kē dǒu', level: 2 },
      { text: '卡车', pinyin: 'kǎ chē', level: 2 },
      { text: '可乐', pinyin: 'kě lè', level: 2 },
      { text: '考试', pinyin: 'kǎo shì', level: 2 },
      { text: '考拉熊', pinyin: 'kǎo lā xióng', level: 3 },
      { text: '开开心', pinyin: 'kāi kāi xīn', level: 3 },
      { text: '空凋机', pinyin: 'kōng diào jī', level: 3 }
    ]
  },
  { 
    id: 'h', label: 'h', category: 'initial',
    examples: [
      { text: '喝', pinyin: 'hē', level: 1 },
      { text: '海', pinyin: 'hǎi', level: 1 },
      { text: '红', pinyin: 'hóng', level: 1 },
      { text: '喝水', pinyin: 'hē shuǐ', level: 2 },
      { text: '红花', pinyin: 'hóng huā', level: 2 },
      { text: '猴子', pinyin: 'hóu zi', level: 2 },
      { text: '海豚', pinyin: 'hǎi tún', level: 2 },
      { text: '哈密瓜', pinyin: 'hā mì guā', level: 3 },
      { text: '蝴蝶结', pinyin: 'hú dié jié', level: 3 },
      { text: '红绿灯', pinyin: 'hóng lǜ dēng', level: 3 }
    ]
  },
  { 
    id: 'j', label: 'j', category: 'initial',
    examples: [
      { text: '鸡', pinyin: 'jī', level: 1 },
      { text: '家', pinyin: 'jiā', level: 1 },
      { text: '九', pinyin: 'jiǔ', level: 1 },
      { text: '积木', pinyin: 'jī mù', level: 2 },
      { text: '姐姐', pinyin: 'jiě jie', level: 2 },
      { text: '鸡蛋', pinyin: 'jī dàn', level: 2 },
      { text: '金鱼', pinyin: 'jīn yú', level: 2 },
      { text: '机器人', pinyin: 'jī qì rén', level: 3 },
      { text: '救护车', pinyin: 'jiù hù chē', level: 3 },
      { text: '讲故事', pinyin: 'jiǎng gù shi', level: 3 }
    ]
  },
  { 
    id: 'q', label: 'q', category: 'initial',
    examples: [
      { text: '七', pinyin: 'qī', level: 1 },
      { text: '球', pinyin: 'qiú', level: 1 },
      { text: '去', pinyin: 'qù', level: 1 },
      { text: '气球', pinyin: 'qì qiú', level: 2 },
      { text: '企鹅', pinyin: 'qǐ é', level: 2 },
      { text: '汽车', pinyin: 'qì chē', level: 2 },
      { text: '秋千', pinyin: 'qiū qiān', level: 2 },
      { text: '跷跷板', pinyin: 'qiāo qiāo bǎn', level: 3 },
      { text: '巧克力', pinyin: 'qiǎo kè lì', level: 3 },
      { text: '七色花', pinyin: 'qī sè huā', level: 3 }
    ]
  },
  { 
    id: 'x', label: 'x', category: 'initial',
    examples: [
      { text: '鞋', pinyin: 'xié', level: 1 },
      { text: '雪', pinyin: 'xuě', level: 1 },
      { text: '虾', pinyin: 'xiā', level: 1 },
      { text: '西瓜', pinyin: 'xī guā', level: 2 },
      { text: '星星', pinyin: 'xīng xing', level: 2 },
      { text: '熊猫', pinyin: 'xióng māo', level: 2 },
      { text: '香蕉', pinyin: 'xiāng jiāo', level: 2 },
      { text: '洗衣机', pinyin: 'xǐ yī jī', level: 3 },
      { text: '消防车', pinyin: 'xiāo fáng chē', level: 3 },
      { text: '向日葵', pinyin: 'xiàng rì kuí', level: 3 }
    ]
  },
  { 
    id: 'z', label: 'z', category: 'initial',
    examples: [
      { text: '字', pinyin: 'zì', level: 1 },
      { text: '嘴', pinyin: 'zuǐ', level: 1 },
      { text: '紫', pinyin: 'zǐ', level: 1 },
      { text: '走路', pinyin: 'zǒu lù', level: 2 },
      { text: '祖国', pinyin: 'zǔ guó', level: 2 },
      { text: '自己', pinyin: 'zì jǐ', level: 2 },
      { text: '紫色', pinyin: 'zǐ sè', level: 2 },
      { text: '自行车', pinyin: 'zì xíng chē', level: 3 },
      { text: '捉迷藏', pinyin: 'zhuō mí cáng', level: 3 },
      { text: '早睡早起', pinyin: 'zǎo shuì zǎo qǐ', level: 3 } // 4 chars but good practice
    ]
  },
  { 
    id: 'c', label: 'c', category: 'initial',
    examples: [
      { text: '草', pinyin: 'cǎo', level: 1 },
      { text: '菜', pinyin: 'cài', level: 1 },
      { text: '醋', pinyin: 'cù', level: 1 },
      { text: '刺猬', pinyin: 'cì wei', level: 2 },
      { text: '草莓', pinyin: 'cǎo méi', level: 2 },
      { text: '聪敏', pinyin: 'cōng mǐn', level: 2 },
      { text: '擦地', pinyin: 'cā dì', level: 2 },
      { text: '彩虹糖', pinyin: 'cǎi hóng táng', level: 3 },
      { text: '操场上', pinyin: 'cāo chǎng shàng', level: 3 },
      { text: '长颈鹿', pinyin: 'cháng jǐng lù', level: 3 } // Should be ch
    ]
  },
  { 
    id: 's', label: 's', category: 'initial',
    examples: [
      { text: '伞', pinyin: 'sǎn', level: 1 },
      { text: '四', pinyin: 'sì', level: 1 },
      { text: '三', pinyin: 'sān', level: 1 },
      { text: '丝瓜', pinyin: 'sī guā', level: 2 },
      { text: '松鼠', pinyin: 'sōng shǔ', level: 2 },
      { text: '森林', pinyin: 'sēn lín', level: 2 },
      { text: '算数', pinyin: 'suàn shù', level: 2 },
      { text: '色彩笔', pinyin: 'sè cǎi bǐ', level: 3 },
      { text: '洒水车', pinyin: 'sǎ shuǐ chē', level: 3 },
      { text: '搜救犬', pinyin: 'sōu jiù quǎn', level: 3 }
    ]
  },
  { 
    id: 'zh', label: 'zh', category: 'initial',
    examples: [
      { text: '猪', pinyin: 'zhū', level: 1 },
      { text: '竹', pinyin: 'zhú', level: 1 },
      { text: '桌', pinyin: 'zhuō', level: 1 },
      { text: '蜘蛛', pinyin: 'zhī zhū', level: 2 },
      { text: '珍珠', pinyin: 'zhēn zhū', level: 2 },
      { text: '照相', pinyin: 'zhào xiàng', level: 2 },
      { text: '折纸', pinyin: 'zhé zhǐ', level: 2 },
      { text: '直升机', pinyin: 'zhí shēng jī', level: 3 },
      { text: '指甲油', pinyin: 'zhǐ jia yóu', level: 3 },
      { text: '中国结', pinyin: 'zhōng guó jié', level: 3 }
    ]
  },
  { 
    id: 'ch', label: 'ch', category: 'initial',
    examples: [
      { text: '吃', pinyin: 'chī', level: 1 },
      { text: '车', pinyin: 'chē', level: 1 },
      { text: '茶', pinyin: 'chá', level: 1 },
      { text: '吃饭', pinyin: 'chī fàn', level: 2 },
      { text: '叉子', pinyin: 'chā zi', level: 2 },
      { text: '长城', pinyin: 'cháng chéng', level: 2 },
      { text: '厨房', pinyin: 'chú fáng', level: 2 },
      { text: '长颈鹿', pinyin: 'cháng jǐng lù', level: 3 },
      { text: '吹泡泡', pinyin: 'chuī pào pao', level: 3 },
      { text: '超市里', pinyin: 'chāo shì lǐ', level: 3 }
    ]
  },
  { 
    id: 'sh', label: 'sh', category: 'initial',
    examples: [
      { text: '书', pinyin: 'shū', level: 1 },
      { text: '手', pinyin: 'shǒu', level: 1 },
      { text: '水', pinyin: 'shuǐ', level: 1 },
      { text: '狮子', pinyin: 'shī zi', level: 2 },
      { text: '沙发', pinyin: 'shā fā', level: 2 },
      { text: '刷牙', pinyin: 'shuā yá', level: 2 },
      { text: '叔叔', pinyin: 'shū shu', level: 2 },
      { text: '双胞胎', pinyin: 'shuāng bāo tāi', level: 3 },
      { text: '圣诞树', pinyin: 'shèng dàn shù', level: 3 },
      { text: '水龙头', pinyin: 'shuǐ lóng tóu', level: 3 }
    ]
  },
  { 
    id: 'r', label: 'r', category: 'initial',
    examples: [
      { text: '日', pinyin: 'rì', level: 1 },
      { text: '人', pinyin: 'rén', level: 1 },
      { text: '肉', pinyin: 'ròu', level: 1 },
      { text: '热狗', pinyin: 'rè gǒu', level: 2 },
      { text: '柔软', pinyin: 'róu ruǎn', level: 2 },
      { text: '热闹', pinyin: 'rè nao', level: 2 },
      { text: '容易', pinyin: 'róng yì', level: 2 },
      { text: '向日葵', pinyin: 'xiàng rì kuí', level: 3 }, // r in middle
      { text: '热气球', pinyin: 'rè qì qiú', level: 3 },
      { text: '若无其事', pinyin: 'ruò wú qí shì', level: 3 } // 4 chars
    ]
  }
];