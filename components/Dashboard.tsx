import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AssessmentResult } from '../types';

interface DashboardProps {
  history: AssessmentResult[];
  onStartAssessment: () => void;
  onStartTraining: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onStartAssessment, onStartTraining }) => {
  // Process data for chart
  const chartData = history.map((h, i) => ({
    name: `次${i + 1}`,
    score: h.accuracyScore,
    phoneme: h.targetPhoneme
  })).slice(-10); // Last 10 attempts

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.accuracyScore, 0) / history.length) 
    : 0;

  return (
    <div className="w-full animate-fade-in space-y-8">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-sm font-medium mb-1">总评估次数</p>
          <h3 className="text-4xl font-bold">{history.length}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-1">平均准确度</p>
          <h3 className={`text-4xl font-bold ${averageScore >= 80 ? 'text-green-500' : averageScore >= 60 ? 'text-amber-500' : 'text-slate-700'}`}>
            {averageScore}%
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center gap-3">
           <button 
             onClick={onStartAssessment}
             className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
           >
             开始新评估
           </button>
           <button 
             onClick={onStartTraining}
             className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold transition-colors"
           >
             进入训练室
           </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">近期进步趋势</h3>
        <div className="h-64 w-full">
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{fontSize: 12}} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              尚无数据，请先进行一次构音评估
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">最近记录</h3>
        <div className="overflow-hidden">
          {history.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">时间</th>
                  <th className="px-4 py-3">目标音</th>
                  <th className="px-4 py-3">得分</th>
                  <th className="px-4 py-3 rounded-r-lg">结果</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.slice().reverse().slice(0, 5).map((h) => (
                  <tr key={h.id}>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">/{h.targetPhoneme}/</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${h.accuracyScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {h.accuracyScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {h.feedback}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <p className="text-slate-400 text-center py-4">暂无历史记录</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
