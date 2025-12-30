import { GoogleGenAI, Type } from "@google/genai";
import { INITIALS } from "../constants";
import { AssessmentResult, TrainingExercise, TrainingPlan } from "../types";

const geminiApiKey = (
  (((import.meta as any)?.env?.VITE_GOOGLE_API_KEY as string | undefined) ?? "").trim()
);
const IS_OFFLINE_MODE = geminiApiKey.length === 0;

let hasLoggedOfflineMode = false;
const logOfflineModeOnce = () => {
  if (hasLoggedOfflineMode) return;
  hasLoggedOfflineMode = true;

  const isDev = Boolean((import.meta as any)?.env?.DEV);
  if (isDev) {
    console.info(
      "[geminiService] VITE_GOOGLE_API_KEY not found. Using local mock data (offline mode)."
    );
  }
};

const ai = IS_OFFLINE_MODE ? null : new GoogleGenAI({ apiKey: geminiApiKey });

const TEXT_MODEL_NAME = "gemini-2.5-flash";
const IMAGE_MODEL_NAME = "gemini-2.5-flash-image";

const FALLBACK_PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2oYAAAAASUVORK5CYII=";

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getArticulationMethod = (phoneme: string) => {
  switch (phoneme) {
    case "b":
      return "双唇紧闭，憋住一口气，然后突然放开。";
    case "p":
      return "双唇紧闭，送气更强，放开时有明显气流。";
    case "m":
      return "双唇闭合，气流从鼻腔通过，发声柔和。";
    case "f":
      return "上齿轻触下唇，慢慢送气摩擦出声。";
    case "d":
      return "舌尖顶住上齿龈，憋气后快速放开。";
    case "t":
      return "舌尖顶住上齿龈，强送气后放开。";
    case "n":
      return "舌尖顶住上齿龈，气流从鼻腔通过。";
    case "l":
      return "舌尖顶住上齿龈，气流从舌两侧通过，声音清亮。";
    case "g":
      return "舌根抬起贴近软腭，憋气后快速放开。";
    case "k":
      return "舌根抬起贴近软腭，强送气后放开。";
    case "h":
      return "口腔打开，舌根稍后，气流从喉部摩擦通过。";
    case "j":
      return "舌面前部抬起接近硬腭，嘴角微张，气流挤出。";
    case "q":
      return "舌面前部抬起接近硬腭，送气更强，发出清亮气声。";
    case "x":
      return "舌面前部抬起接近硬腭，气流摩擦轻柔，嘴角微向两侧。";
    case "z":
      return "舌尖靠近上齿龈，形成窄缝，气流摩擦发出。";
    case "c":
      return "舌尖靠近上齿龈，送气更强，气流摩擦明显。";
    case "s":
      return "舌尖接近上齿龈，气流从窄缝摩擦而出，声音细。";
    case "zh":
      return "舌尖上卷接近硬腭前部，形成窄缝，气流摩擦发出。";
    case "ch":
      return "舌尖上卷接近硬腭前部，送气更强，摩擦更明显。";
    case "sh":
      return "舌尖上卷接近硬腭前部，气流摩擦较柔和。";
    case "r":
      return "舌尖上卷靠近硬腭前部，声带振动，气流摩擦带有卷舌感。";
    default:
      return `请注意声母/${phoneme}/的标准口型，先慢读再加速。`;
  }
};

const createPlaceholderPngDataUrl = (label: string) => {
  if (typeof document === "undefined") return FALLBACK_PNG_DATA_URL;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    if (!ctx) return FALLBACK_PNG_DATA_URL;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#F1F5F9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#DBEAFE";
    ctx.beginPath();
    ctx.arc(140, 180, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#E9D5FF";
    ctx.beginPath();
    ctx.arc(380, 360, 130, 0, Math.PI * 2);
    ctx.fill();

    const text = (label || "").slice(0, 6);

    ctx.fillStyle = "#0F172A";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "900 140px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans SC, sans-serif";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    ctx.font = "600 28px system-ui, -apple-system, Segoe UI, Roboto, Noto Sans SC, sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("本地模拟", canvas.width / 2, canvas.height - 60);

    return canvas.toDataURL("image/png");
  } catch {
    return FALLBACK_PNG_DATA_URL;
  }
};

const createMockAssessmentResult = (
  base64Audio: string,
  targetPhoneme: string,
  targetWord: string
): AssessmentResult => {
  const seed = hashString(`${base64Audio.slice(0, 200)}|${targetPhoneme}|${targetWord}`);
  const accuracyScore = 60 + (seed % 36);
  const isCorrect = accuracyScore >= 80;

  const errorType: AssessmentResult["errorType"] = isCorrect
    ? "none"
    : accuracyScore >= 72
      ? "distortion"
      : "substitution";

  const articulationMethod = getArticulationMethod(targetPhoneme);

  const feedback = isCorrect
    ? "发音清晰，声母到位。"
    : `声母/${targetPhoneme}/还不够稳定，注意口型与气流。`;

  const correctionTips = isCorrect
    ? "保持节奏，试着更连贯地读。"
    : "先慢读分解声母，再合成整词。";

  return {
    id: Date.now().toString(),
    timestamp: Date.now(),
    targetPhoneme,
    targetWord,
    accuracyScore,
    isCorrect,
    errorType,
    feedback,
    correctionTips,
    articulationMethod,
  };
};

const createMockTrainingPlan = (targetPhoneme: string): TrainingPlan => {
  const phonemeData = INITIALS.find((p) => p.label === targetPhoneme);

  const fallbackWords = [
    { text: "妈妈", pinyin: "mā ma" },
    { text: "爸爸", pinyin: "bà ba" },
    { text: "飞机", pinyin: "fēi jī" },
    { text: "小猫", pinyin: "xiǎo māo" },
  ];

  const selectedWords = (phonemeData?.examples || []).slice(0, 4);
  const wordItems = (selectedWords.length > 0 ? selectedWords : fallbackWords).slice(0, 4);

  const words: TrainingExercise[] = wordItems.map((w) => ({
    type: "word",
    content: w.text,
    pinyin: w.pinyin,
    focus: `声母/${targetPhoneme}/`,
    instruction: "慢读",
  }));

  const sentenceTemplates = [
    { prefix: "", prefixPinyin: "", suffix: "在这", suffixPinyin: "zài zhè" },
    { prefix: "", prefixPinyin: "", suffix: "来了", suffixPinyin: "lái le" },
    { prefix: "我要", prefixPinyin: "wǒ yào", suffix: "", suffixPinyin: "" },
    { prefix: "", prefixPinyin: "", suffix: "真好", suffixPinyin: "zhēn hǎo" },
  ];

  const sentences: TrainingExercise[] = wordItems.slice(0, 4).map((w, idx) => {
    const template = sentenceTemplates[idx] ?? sentenceTemplates[0];
    const content = `${template.prefix}${w.text}${template.suffix}`;
    const pinyin = [template.prefixPinyin, w.pinyin, template.suffixPinyin]
      .filter(Boolean)
      .join(" ");

    return {
      type: "sentence",
      content,
      pinyin,
      focus: `连读 + 声母/${targetPhoneme}/`,
      instruction: "连读",
    };
  });

  const w0 = wordItems[0];
  const w1 = wordItems[1] ?? w0;
  const w2 = wordItems[2] ?? w0;
  const w3 = wordItems[3] ?? w1;

  const tongueTwisters: TrainingExercise[] = [
    {
      type: "tongue_twister",
      content: `${w0.text}${w1.text}${w0.text}${w1.text}`,
      pinyin: `${w0.pinyin} ${w1.pinyin} ${w0.pinyin} ${w1.pinyin}`,
      focus: `节奏 + 声母/${targetPhoneme}/`,
      instruction: "快读",
    },
    {
      type: "tongue_twister",
      content: `${w2.text}${w3.text}一起${w2.text}${w3.text}`,
      pinyin: `${w2.pinyin} ${w3.pinyin} yì qǐ ${w2.pinyin} ${w3.pinyin}`,
      focus: `节奏 + 声母/${targetPhoneme}/`,
      instruction: "跟拍",
    },
  ];

  const exercises = [...words, ...sentences, ...tongueTwisters].slice(0, 10);

  return {
    target: targetPhoneme,
    visualAidDescription: getArticulationMethod(targetPhoneme),
    exercises,
  };
};

/**
 * Generates an illustrative image for a specific word to help children visualize.
 */
export const generateWordImage = async (word: string): Promise<string | null> => {
  if (IS_OFFLINE_MODE) {
    logOfflineModeOnce();
    return createPlaceholderPngDataUrl(word);
  }

  try {
    const response = await ai!.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          {
            text: `Create a simple, cute, flat-design illustration of the object or concept: "${word}". 
            Style: Children's educational flashcard. 
            Background: White or very light soft pastel color. 
            Content: High contrast, easy to recognize, cheerful. 
            No text in the image.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
};

/**
 * Analyzes an audio recording of a specific target word/phoneme.
 */
export const analyzeAudio = async (
  base64Audio: string,
  targetPhoneme: string,
  targetWord: string
): Promise<AssessmentResult> => {
  if (IS_OFFLINE_MODE) {
    logOfflineModeOnce();
    return createMockAssessmentResult(base64Audio, targetPhoneme, targetWord);
  }

  try {
    const prompt = `
      Task: Articulation Assessment (Mandarin Chinese).
      Target Word: "${targetWord}"
      Target Initial Phoneme (Shengmu): "${targetPhoneme}"
      
      You are an expert Speech Therapist. A child is practicing this word.
      Listen carefully to the recording.
      
      STRICT ANALYSIS RULES:
      1.  **Transcribe**: First, transcribe exactly what you heard in Pinyin.
      2.  **Compare**: Compare the transcribed sound with the target sound /${targetPhoneme}/.
      3.  **Judge**: 
          - Did the user produce the initial sound /${targetPhoneme}/ correctly?
          - If the word is multi-syllabic (e.g., "${targetWord}"), is the flow natural?
          - If they said a different sound (e.g., /d/ instead of /g/), mark as "substitution".
      
      Output JSON:
      {
        "accuracyScore": number (0-100),
        "isCorrect": boolean (true if the target phoneme was clear),
        "errorType": "substitution" | "omission" | "distortion" | "none",
        "feedback": "Chinese string. Short and direct. Example: '发音清晰' or '舌头再靠后一点'.",
        "correctionTips": "Chinese string. Very brief tip for correction.",
        "articulationMethod": "Chinese string. Describe the physical mouth shape, tongue position, and airflow for the TARGET phoneme /${targetPhoneme}/. Example: '双唇紧闭，憋住一口气，然后突然放开' for 'b'."
      }
    `;

    const response = await ai!.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/webm",
              data: base64Audio,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracyScore: { type: Type.INTEGER },
            isCorrect: { type: Type.BOOLEAN },
            errorType: {
              type: Type.STRING,
              enum: ["substitution", "omission", "distortion", "none"],
            },
            feedback: { type: Type.STRING },
            correctionTips: { type: Type.STRING },
            articulationMethod: { type: Type.STRING },
          },
          required: [
            "accuracyScore",
            "isCorrect",
            "errorType",
            "feedback",
            "correctionTips",
            "articulationMethod",
          ],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      targetPhoneme,
      targetWord,
      accuracyScore: result.accuracyScore,
      isCorrect: result.isCorrect,
      errorType: result.errorType,
      feedback: result.feedback,
      correctionTips: result.correctionTips,
      articulationMethod: result.articulationMethod || "暂无口型指导",
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      targetPhoneme,
      targetWord,
      accuracyScore: 0,
      isCorrect: false,
      errorType: "none",
      feedback: "无法分析音频，请检查网络或重新录音。",
      correctionTips: "请重试。",
      articulationMethod: "请检查网络连接。",
    };
  }
};

/**
 * Generates a personalized training plan based on a target phoneme.
 */
export const generateTrainingPlan = async (targetPhoneme: string): Promise<TrainingPlan> => {
  if (IS_OFFLINE_MODE) {
    logOfflineModeOnce();
    return createMockTrainingPlan(targetPhoneme);
  }

  try {
    const prompt = `
      Create a speech therapy training list for Mandarin Initial "${targetPhoneme}".
      
      REQUIREMENTS:
      1. STRICTLY provide **10 distinct items**.
      2. Content must be Chinese characters only.
      3. Keep instruction extremely short (max 6 chars) or empty.
      
      Structure:
      - 4 Words (mix of 1, 2, 3 syllables)
      - 4 Short Sentences (3-7 chars)
      - 2 Tongue Twisters / Rhymes (fun, rhythmic)

      Output JSON:
      {
        "visualAidDescription": "Brief description of mouth shape for ${targetPhoneme} in Chinese.",
        "exercises": [
           // exactly 10 items here
           { "type": "word", "content": "...", "pinyin": "...", "focus": "...", "instruction": "..." }
        ]
      }
    `;

    const response = await ai!.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visualAidDescription: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: ["word", "sentence", "tongue_twister"],
                  },
                  content: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                },
                required: ["type", "content", "pinyin", "focus", "instruction"],
              },
            },
          },
          required: ["visualAidDescription", "exercises"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      target: targetPhoneme,
      visualAidDescription: result.visualAidDescription,
      exercises: result.exercises,
    };
  } catch (error) {
    console.error("Gemini Planning Error:", error);
    return {
      target: targetPhoneme,
      visualAidDescription: "暂无数据",
      exercises: [],
    };
  }
};
