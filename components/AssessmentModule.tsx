import React, { useState } from 'react';
import { INITIALS } from '../constants';
import { analyzeAudio, generateWordImage } from '../services/geminiService';
import { AssessmentResult, PhonemeTarget, WordExample } from '../types';
import AudioRecorder from './AudioRecorder';

interface AssessmentModuleProps {
  onComplete: (result: AssessmentResult) => void;
}

const AssessmentModule: React.FC<AssessmentModuleProps> = ({ onComplete }) => {
  const [selectedTarget, setSelectedTarget] = useState<PhonemeTarget | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordExample | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handlePhonemeSelect = (target: PhonemeTarget) => {
    setSelectedTarget(target);
    setSelectedWord(null);
    setGeneratedImage(null);
    setResult(null);
  };

  const handleWordSelect = async (word: WordExample) => {
    setSelectedWord(word);
    setResult(null);
    
    // Generate image for the word
    setImageLoading(true);
    setGeneratedImage(null);
    // Optimistic UI update or placeholder could go here
    const imgData = await generateWordImage(word.text);
    setGeneratedImage(imgData);
    setImageLoading(false);
  };

  const handleAudioComplete = async (base64Audio: string) => {
    if (!selectedTarget || !selectedWord) return;

    setIsProcessing(true);
    try {
      const assessment = await analyzeAudio(base64Audio, selectedTarget.label, selectedWord.text);
      setResult(assessment);
      onComplete(assessment);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSelectedWord(null);
    setSelectedTarget(null);
    setGeneratedImage(null);
  };

  const tryAgain = () => {
    setResult(null);
  };

  if (result) {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl animate-fade-in my-8">
        
        {/* Animated Feedback Icon */}
        <div className="mb-4 transform transition-all duration-500 hover:scale-110">
          {result.isCorrect ? (
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-green-200">
               <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
             </div>
          ) : (
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-200">
              <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        <div className={`text-4xl font-black mb-1 ${result.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
           {result.isCorrect ? '发音正确！' : '发音错误'}
        </div>
        <div className="text-slate-400 font-medium mb-6 text-sm uppercase tracking-wider">
           准确度评分: <span className="text-slate-700 font-bold text-lg">{result.accuracyScore}</span>
        </div>
        
        <div className="w-full space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start">
             <span className="text-2xl mr-3">🩺</span>
             <div>
               <h4 className="font-bold text-slate-700 text-sm mb-1 uppercase">诊断结果</h4>
               <p className="text-slate-600 leading-relaxed">{result.feedback}</p>
             </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-start">
             <span className="text-2xl mr-3">💡</span>
             <div>
               <h4 className="font-bold text-blue-800 text-sm mb-1 uppercase">纠正建议</h4>
               <p className="text-blue-700 leading-relaxed">{result.correctionTips}</p>
             </div>
          </div>

          {/* New Articulation Method Section */}
          <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 flex items-start">
             <span className="text-2xl mr-3">👄</span>
             <div>
               <h4 className="font-bold text-purple-800 text-sm mb-1 uppercase">标准口型指导</h4>
               <p className="text-purple-700 leading-relaxed font-medium">
                 {result.articulationMethod}
               </p>
             </div>
          </div>
        </div>

        <div className="flex gap-4 w-full mt-8">
          <button 
            onClick={tryAgain}
            className="flex-1 py-4 px-6 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors border-2 border-slate-200 shadow-sm"
          >
            再试一次
          </button>
          <button 
            onClick={reset}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            换个词练练
          </button>
        </div>
      </div>
    );
  }

  // Word Selection & Recording View
  if (selectedTarget) {
    return (
      <div className="flex flex-col w-full max-w-5xl mx-auto py-2 animate-fade-in h-[calc(100vh-140px)]">
        <button onClick={() => setSelectedTarget(null)} className="self-start mb-4 text-slate-500 hover:text-blue-600 flex items-center font-medium">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          返回声母表
        </button>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* Left Column: Word Selection (Scrollable) */}
          <div className="lg:col-span-5 flex flex-col h-full min-h-0">
            <div className="mb-3">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <span className="text-4xl text-blue-600 mr-2">/{selectedTarget.label}/</span> 
                <span>专项训练</span>
              </h2>
              <p className="text-slate-500 text-sm">请选择词语卡片进行跟读</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {selectedTarget.examples.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordSelect(word)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group
                    ${selectedWord?.text === word.text 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md transform scale-[1.02]' 
                      : 'border-slate-100 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xs font-bold
                       ${word.level === 1 ? 'bg-green-100 text-green-700' : 
                         word.level === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-lg font-bold text-slate-800 mr-2 group-hover:text-blue-600 transition-colors">{word.text}</span>
                      <span className="text-slate-400 font-mono text-xs block">{word.pinyin}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                    ${word.level === 1 ? 'bg-green-100 text-green-600' : 
                      word.level === 2 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}
                  `}>
                    {word.level === 1 ? '单音' : word.level === 2 ? '双音' : '三音'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Interaction Area */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none"></div>

            {selectedWord ? (
              <div className="w-full max-w-md flex flex-col items-center z-10">
                {/* Dynamic Image Area */}
                <div className="w-64 h-64 mb-6 rounded-2xl bg-slate-50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative group">
                  {imageLoading ? (
                    <div className="flex flex-col items-center p-4 text-center animate-pulse">
                       <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-slate-500 font-medium">AI 正在绘制"{selectedWord.text}"...</span>
                    </div>
                  ) : generatedImage ? (
                    <img src={generatedImage} alt={selectedWord.text} className="w-full h-full object-cover animate-fade-in hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <span className="text-6xl mb-2">🎨</span>
                      <span className="text-sm">图片生成失败</span>
                    </div>
                  )}
                </div>

                <div className="text-center mb-8">
                  <div className="text-6xl font-black text-slate-800 mb-3 tracking-wide drop-shadow-sm">{selectedWord.text}</div>
                  <div className="text-2xl text-slate-500 font-mono bg-slate-100 px-4 py-1 rounded-full inline-block">/{selectedWord.pinyin}/</div>
                </div>

                <div className="w-full flex justify-center">
                  <AudioRecorder onRecordingComplete={handleAudioComplete} isProcessing={isProcessing} />
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 z-10">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                  <span className="text-4xl">👈</span>
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">准备开始训练</h3>
                <p>请在左侧列表中选择一个词语</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Initial Phoneme Selection View
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-10">
      <div className="text-center mb-10">
         <h2 className="text-3xl font-bold text-slate-800 mb-3">构音评估中心</h2>
         <p className="text-slate-500">选择一个声母，AI 将辅助您进行发音诊断</p>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 px-4">
        {INITIALS.map((phoneme) => (
          <button
            key={phoneme.id}
            onClick={() => handlePhonemeSelect(phoneme)}
            className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:ring-4 hover:ring-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all group aspect-square"
          >
            <span className="text-4xl font-black text-slate-700 group-hover:text-blue-600 mb-1">{phoneme.label}</span>
            <span className="text-xs text-slate-400 group-hover:text-blue-400 font-mono">/{phoneme.label}/</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssessmentModule;