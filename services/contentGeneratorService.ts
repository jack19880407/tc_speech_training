import { GoogleGenAI, Type } from "@google/genai";
import { XiaohongshuContent, ContentType, ContentTopic, VideoScript, ScriptSection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const TEXT_MODEL_NAME = 'gemini-2.5-flash';

const TOPIC_PROMPTS = {
  [ContentTopic.HEARING_IMPAIRMENT]: {
    name: "听力障碍",
    keywords: ["听力康复", "助听器", "耳蜗植入", "听觉训练", "言语康复"],
    context: "针对听力障碍儿童的言语康复训练方法和康复课程"
  },
  [ContentTopic.LANGUAGE_DELAY]: {
    name: "语言发育迟缓",
    keywords: ["语言发育", "开口晚", "说话迟", "语言训练", "认知发展"],
    context: "帮助语言发育迟缓儿童提升语言能力的训练方法"
  },
  [ContentTopic.ARTICULATION_DISORDER]: {
    name: "构音障碍",
    keywords: ["发音训练", "构音障碍", "口肌训练", "吐字不清", "语音矫正"],
    context: "针对构音障碍的专业训练方法和口部肌肉训练"
  },
  [ContentTopic.COURSE_INTRO]: {
    name: "课程介绍",
    keywords: ["言语治疗", "康复课程", "一对一训练", "专业评估", "康复中心"],
    context: "专业言语治疗课程和康复服务介绍"
  }
};

export const generateXiaohongshuContent = async (
  topic: ContentTopic,
  type: ContentType
): Promise<XiaohongshuContent> => {
  try {
    const topicInfo = TOPIC_PROMPTS[topic];
    const isProfessional = type === ContentType.PROFESSIONAL;

    const prompt = `
      你是一位专业的言语治疗师和小红书内容创作专家。请为以下主题生成一篇小红书文案。

      主题：${topicInfo.name}
      内容类型：${isProfessional ? '专业科普（SEO优化）' : '引流内容（课程推广）'}

      ${isProfessional ? `
      专业科普要求：
      - 提供有价值的专业知识和建议
      - 语言通俗易懂，避免过度专业术语
      - 包含实用的训练技巧或方法
      - 适合家长阅读和理解
      - 展现专业性和可信度
      - 字数：500-800字
      ` : `
      引流内容要求：
      - 突出课程优势和成功案例
      - 制造紧迫感（限时优惠、名额有限等）
      - 包含行动号召（预约咨询、免费评估等）
      - 情感共鸣，理解家长焦虑
      - 展示专业资质和效果保证
      - 字数：400-600字
      `}

      核心关键词：${topicInfo.keywords.join('、')}

      请输出JSON格式：
      {
        "title": "吸引人的标题（15-25字，包含emoji）",
        "content": "正文内容，分段清晰，使用emoji增强可读性",
        "hashtags": ["话题标签1", "话题标签2", ...],  // 5-8个相关话题标签
        "imagePrompts": ["配图建议1", "配图建议2", "配图建议3"]  // 3个配图建议
      }
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            imagePrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "content", "hashtags", "imagePrompts"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      topic,
      type,
      title: result.title,
      content: result.content,
      hashtags: result.hashtags,
      imagePrompts: result.imagePrompts
    };

  } catch (error) {
    console.error("Content Generation Error:", error);
    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      topic,
      type,
      title: "生成失败",
      content: "无法生成内容，请检查网络连接或重试。",
      hashtags: [],
      imagePrompts: []
    };
  }
};

export const convertToVideoScript = async (
  content: XiaohongshuContent
): Promise<VideoScript> => {
  try {
    const prompt = `
      将以下小红书文案转换为1分钟左右的口播视频脚本。

      标题：${content.title}
      正文：${content.content}

      要求：
      1. 口语化表达，自然流畅
      2. 去除emoji和书面符号
      3. 分成3-5个段落，每段15-20秒
      4. 开头要有吸引力的钩子
      5. 结尾要有明确的行动号召
      6. 总时长控制在55-65秒
      7. 适合配合背景图片展示

      输出JSON格式：
      {
        "script": "完整的口播脚本文本",
        "sections": [
          {
            "text": "第一段口播内容",
            "duration": 15  // 预估秒数
          },
          {
            "text": "第二段口播内容",
            "duration": 18
          }
          // ... 更多段落
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            script: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  duration: { type: Type.INTEGER }
                },
                required: ["text", "duration"]
              }
            }
          },
          required: ["script", "sections"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const totalDuration = result.sections.reduce(
      (sum: number, section: ScriptSection) => sum + section.duration, 
      0
    );

    return {
      id: Date.now().toString(),
      contentId: content.id,
      script: result.script,
      estimatedDuration: totalDuration,
      sections: result.sections
    };

  } catch (error) {
    console.error("Script Conversion Error:", error);
    return {
      id: Date.now().toString(),
      contentId: content.id,
      script: "脚本生成失败，请重试。",
      estimatedDuration: 0,
      sections: []
    };
  }
};

export const CONTENT_TEMPLATES = {
  [ContentTopic.HEARING_IMPAIRMENT]: {
    title: "听力障碍康复训练",
    description: "针对听力障碍儿童的专业言语康复方案"
  },
  [ContentTopic.LANGUAGE_DELAY]: {
    title: "语言发育迟缓",
    description: "帮助开口晚、说话迟的孩子快速提升语言能力"
  },
  [ContentTopic.ARTICULATION_DISORDER]: {
    title: "构音障碍矫正",
    description: "专业口肌训练，解决发音不清问题"
  },
  [ContentTopic.COURSE_INTRO]: {
    title: "课程介绍",
    description: "专业言语治疗课程，一对一个性化训练"
  }
};
