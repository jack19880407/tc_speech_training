import React, { useState } from 'react';
import { generateTrainingPlan, generateWordImage, analyzeAudio } from '../services/geminiService';
import { TrainingPlan, TrainingExercise, AssessmentResult } from '../types';
import { INITIALS } from '../constants';
import AudioRecorder from './AudioRecorder';

const TrainingModule: React.FC = () => {
  const [selectedPhoneme, setSelectedPhoneme] = useState<string>('');
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Interactive State
  const [selectedExercise, setSelectedExercise] = useState<TrainingExercise | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [audioProcessing, setAudioProcessing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleGenerate = async () => {
    if (!selectedPhoneme) return;
    setLoading(true);
    setPlan(null);
    setSelectedExercise(null);
    
    const result = await generateTrainingPlan(selectedPhoneme);
    setPlan(result);
    setLoading(false);

    // Auto-select first exercise
    if (result && result.exercises.length > 0) {
      handleExerciseSelect(result.exercises[0]);
    }
  };

  const handleExerciseSelect = async (exercise: TrainingExercise) => {
    setSelectedExercise(exercise);
    setResult(null);
    setGeneratedImage(null);
    
    // Generate image for visualization (even for sentences, generate based on keywords)
    setImageLoading(true);
    const img = await generateWordImage(exercise.content);
    setGeneratedImage(img);
    setImageLoading(false);
  };

  const handleAudioComplete = async (base64Audio: string) => {
    if (!selectedExercise || !selectedPhoneme) return;

    setAudioProcessing(true);
    // Reuse the analyzeAudio service, using the exercise content as the target word
    const assessment = await analyzeAudio(base64Audio, selectedPhoneme, selectedExercise.content);
    setResult(assessment);
    setAudioProcessing(false);
  };

  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Top Bar: Selection */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🎯</span> 实战训练室
        </h2>
        <div className="flex gap-2">
          <select 
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={selectedPhoneme}
            onChange={(e) => setSelectedPhoneme(e.target.value)}
          >
            <option value="">选择声母...</option>
            {INITIALS.map(p => (
              <option key={p.id} value={p.label}>{p.label}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={!selectedPhoneme || loading}
            className={`px-4 py-2 rounded-lg font-bold text-white text-sm transition-colors ${!selectedPhoneme || loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? '生成中...' : '开始训练'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <svg className="animate-spin h-10 w-10 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>AI 正在准备 10 个针对性训练...</p>
        </div>
      )}

      {plan && !loading && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Left: Exercise List */}
          <div className="lg:col-span-4 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-3 bg-slate-50 border-b border-slate-100 font-medium text-slate-500 text-sm">
               训练清单 ({plan.exercises.length})
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
               {plan.exercises.map((ex, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleExerciseSelect(ex)}
                   className={`w-full text-left p-3 rounded-lg border transition-all flex items-center
                     ${selectedExercise?.content === ex.content 
                       ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-200' 
                       : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'}
                   `}
                 >
                   <span className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold mr-3
                     ${ex.type === 'word' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}
                   `}>
                     {idx + 1}
                   </span>
                   <div className="flex-1 min-w-0">
                     <div className="font-bold text-slate-800 truncate">{ex.content}</div>
                     <div className="text-xs text-slate-400 font-mono">{ex.pinyin}</div>
                   </div>
                 </button>
               ))}
             </div>
          </div>

          {/* Right: Interaction Stage */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none -ml-10 -mb-10"></div>

            {selectedExercise ? (
              <div className="z-10 w-full max-w-lg flex flex-col items-center">
                
                {/* Visual Aid / Image */}
                <div className="w-56 h-56 mb-6 rounded-2xl bg-slate-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                   {imageLoading ? (
                     <div className="animate-pulse flex flex-col items-center text-slate-300">
                        <span className="text-4xl mb-2">🎨</span>
                        <span className="text-xs">AI 绘图中...</span>
                     </div>
                   ) : generatedImage ? (
                     <img src={generatedImage} alt={selectedExercise.content} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-4xl">🖼️</span>
                   )}
                </div>

                {/* Big Text */}
                <div className="text-center mb-8">
                  <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-2 drop-shadow-sm">{selectedExercise.content}</h1>
                  <p className="text-2xl text-slate-500 font-mono bg-slate-100 inline-block px-4 py-1 rounded-full">
                    {selectedExercise.pinyin}
                  </p>
                </div>

                {/* Recorder */}
                <div className="mb-6">
                  <AudioRecorder onRecordingComplete={handleAudioComplete} isProcessing={audioProcessing} />
                </div>

                {/* Result Feedback */}
                {result && (
                  <div className="w-full animate-fade-in-up bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm
                         ${result.accuracyScore >= 80 ? 'bg-green-500' : result.accuracyScore >= 60 ? 'bg-amber-400' : 'bg-red-400'}
                       `}>
                         {result.accuracyScore}
                       </div>
                       <div>
                         <div className="font-bold text-slate-800">
                           {result.accuracyScore >= 80 ? '发音很清晰！' : '继续加油！'}
                         </div>
                         <div className="text-xs text-slate-500">{result.feedback}</div>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <span className="text-4xl block mb-2">👈</span>
                点击左侧列表开始练习
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default TrainingModule;