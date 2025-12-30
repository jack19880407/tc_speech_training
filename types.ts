export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
  TRAINING = 'TRAINING',
  XIAOHONGSHU_GENERATOR = 'XIAOHONGSHU_GENERATOR',
}

export interface WordExample {
  text: string;
  pinyin: string;
  level: 1 | 2 | 3; // 1: Monosyllabic, 2: Disyllabic, 3: Trisyllabic
}

export interface PhonemeTarget {
  id: string;
  label: string; // e.g., 'b', 'p', 'm'
  category: 'initial' | 'final' | 'tone';
  examples: WordExample[];
}

export interface AssessmentResult {
  id: string;
  timestamp: number;
  targetPhoneme: string;
  targetWord: string; // Added to track specific word used
  accuracyScore: number; // 0-100
  isCorrect: boolean;
  errorType?: 'substitution' | 'omission' | 'distortion' | 'none';
  feedback: string;
  correctionTips: string;
  articulationMethod: string; // New: Physical mouth shape/tongue position instructions
}

export interface TrainingExercise {
  type: 'word' | 'sentence' | 'tongue_twister';
  content: string;
  pinyin: string;
  focus: string;
  instruction: string;
}

export interface TrainingPlan {
  target: string;
  exercises: TrainingExercise[];
  visualAidDescription: string;
}

export enum ContentType {
  PROFESSIONAL = 'PROFESSIONAL',
  PROMOTIONAL = 'PROMOTIONAL',
}

export enum ContentTopic {
  HEARING_IMPAIRMENT = 'HEARING_IMPAIRMENT',
  LANGUAGE_DELAY = 'LANGUAGE_DELAY',
  ARTICULATION_DISORDER = 'ARTICULATION_DISORDER',
  COURSE_INTRO = 'COURSE_INTRO',
}

export interface XiaohongshuContent {
  id: string;
  timestamp: number;
  topic: ContentTopic;
  type: ContentType;
  title: string;
  content: string;
  hashtags: string[];
  imagePrompts: string[];
}

export interface VideoScript {
  id: string;
  contentId: string;
  script: string;
  estimatedDuration: number;
  sections: ScriptSection[];
}

export interface ScriptSection {
  text: string;
  duration: number;
}

export interface VideoExport {
  id: string;
  scriptId: string;
  videoUrl: string;
  duration: number;
  timestamp: number;
}