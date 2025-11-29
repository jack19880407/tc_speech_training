import React, { useState } from 'react';
import { AppView, AssessmentResult } from './types';
import { APP_NAME } from './constants';
import AssessmentModule from './components/AssessmentModule';
import TrainingModule from './components/TrainingModule';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [history, setHistory] = useState<AssessmentResult[]>([]);

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setHistory(prev => [...prev, result]);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.ASSESSMENT:
        return <AssessmentModule onComplete={handleAssessmentComplete} />;
      case AppView.TRAINING:
        return <TrainingModule />;
      case AppView.DASHBOARD:
      default:
        return (
          <Dashboard 
            history={history} 
            onStartAssessment={() => setCurrentView(AppView.ASSESSMENT)} 
            onStartTraining={() => setCurrentView(AppView.TRAINING)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              语
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{APP_NAME}</h1>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === AppView.DASHBOARD ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              首页
            </button>
            <button
              onClick={() => setCurrentView(AppView.ASSESSMENT)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === AppView.ASSESSMENT ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              构音评估
            </button>
            <button
              onClick={() => setCurrentView(AppView.TRAINING)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === AppView.TRAINING ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              康复训练
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-xs">
          <p>© 2024 YuYin AI Speech Therapy. Powered by Gemini 2.5 Flash.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
