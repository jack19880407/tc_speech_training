import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult, TrainingPlan } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL_NAME = 'gemini-2.5-flash';
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates an illustrative image for a specific word to help children visualize.
 */
export const generateWordImage = async (word: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          {
            text: `Create a simple, cute, flat-design illustration of the object or concept: "${word}". 
            Style: Children's educational flashcard. 
            Background: White or very light soft pastel color. 
            Content: High contrast, easy to recognize, cheerful. 
            No text in the image.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
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

    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/webm',
              data: base64Audio
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracyScore: { type: Type.INTEGER },
            isCorrect: { type: Type.BOOLEAN },
            errorType: { type: Type.STRING, enum: ["substitution", "omission", "distortion", "none"] },
            feedback: { type: Type.STRING },
            correctionTips: { type: Type.STRING },
            articulationMethod: { type: Type.STRING }
          },
          required: ["accuracyScore", "isCorrect", "errorType", "feedback", "correctionTips", "articulationMethod"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
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
      articulationMethod: result.articulationMethod || "暂无口型指导"
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
      errorType: 'none',
      feedback: "无法分析音频，请检查网络或重新录音。",
      correctionTips: "请重试。",
      articulationMethod: "请检查网络连接。"
    };
  }
};

/**
 * Generates a personalized training plan based on a target phoneme.
 */
export const generateTrainingPlan = async (targetPhoneme: string): Promise<TrainingPlan> => {
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

    const response = await ai.models.generateContent({
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
                  type: { type: Type.STRING, enum: ["word", "sentence", "tongue_twister"] },
                  content: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  instruction: { type: Type.STRING }
                },
                required: ["type", "content", "pinyin", "focus", "instruction"]
              }
            }
          },
          required: ["visualAidDescription", "exercises"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      target: targetPhoneme,
      visualAidDescription: result.visualAidDescription,
      exercises: result.exercises
    };

  } catch (error) {
    console.error("Gemini Planning Error:", error);
    return {
      target: targetPhoneme,
      visualAidDescription: "暂无数据",
      exercises: []
    };
  }
};