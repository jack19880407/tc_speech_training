import React, { useState, useRef } from 'react';
import { 
  XiaohongshuContent, 
  ContentType, 
  ContentTopic, 
  VideoScript,
  VideoExport
} from '../types';
import { 
  generateXiaohongshuContent, 
  convertToVideoScript,
  CONTENT_TEMPLATES 
} from '../services/contentGeneratorService';
import { synthesizeVideo } from '../services/videoSynthesisService';

enum Step {
  CONTENT_GENERATION = 1,
  SCRIPT_EDITING = 2,
  VIDEO_SYNTHESIS = 3,
}

const XiaohongshuGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.CONTENT_GENERATION);
  const [selectedTopic, setSelectedTopic] = useState<ContentTopic>(ContentTopic.HEARING_IMPAIRMENT);
  const [selectedType, setSelectedType] = useState<ContentType>(ContentType.PROFESSIONAL);
  const [content, setContent] = useState<XiaohongshuContent | null>(null);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [videoExport, setVideoExport] = useState<VideoExport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateXiaohongshuContent(selectedTopic, selectedType);
      setContent(generatedContent);
    } catch (error) {
      alert('内容生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConvertToScript = async () => {
    if (!content) return;
    
    setIsGenerating(true);
    try {
      const generatedScript = await convertToVideoScript(content);
      setScript(generatedScript);
      setCurrentStep(Step.SCRIPT_EDITING);
    } catch (error) {
      alert('脚本转换失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSynthesizeVideo = async () => {
    if (!script) return;
    
    setIsGenerating(true);
    setVideoProgress(0);
    try {
      const video = await synthesizeVideo(script, backgroundImage, (progress) => {
        setVideoProgress(progress);
      });
      setVideoExport(video);
    } catch (error) {
      alert('视频合成失败：' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    if (!content) return;
    const fullText = `${content.title}\n\n${content.content}\n\n${content.hashtags.map(tag => '#' + tag).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    alert('内容已复制到剪贴板');
  };

  const handleCopyScript = () => {
    if (!script) return;
    navigator.clipboard.writeText(script.script);
    alert('脚本已复制到剪贴板');
  };

  const handleDownloadVideo = () => {
    if (!videoExport) return;
    const a = document.createElement('a');
    a.href = videoExport.videoUrl;
    a.download = `xiaohongshu_video_${videoExport.id}.webm`;
    a.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setBackgroundImage(file);
    } else {
      alert('请上传有效的图片文件');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-4">
      {[
        { step: Step.CONTENT_GENERATION, label: '内容生成' },
        { step: Step.SCRIPT_EDITING, label: '脚本编辑' },
        { step: Step.VIDEO_SYNTHESIS, label: '视频合成' },
      ].map((item, index) => (
        <React.Fragment key={item.step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                currentStep >= item.step
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-400'
              } ${currentStep === item.step ? 'ring-4 ring-blue-200' : ''}`}
            >
              {index + 1}
            </div>
            <span className={`mt-2 text-sm font-medium ${
              currentStep === item.step ? 'text-blue-600' : 'text-slate-500'
            }`}>
              {item.label}
            </span>
          </div>
          {index < 2 && (
            <div className={`w-16 h-1 ${currentStep > item.step ? 'bg-blue-600' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderContentGeneration = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">选择内容主题</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(CONTENT_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(key as ContentTopic)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedTopic === key
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-slate-900">{template.title}</div>
              <div className="text-sm text-slate-500 mt-1">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">选择内容类型</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedType(ContentType.PROFESSIONAL)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              selectedType === ContentType.PROFESSIONAL
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-slate-900">📚 专业科普</div>
            <div className="text-sm text-slate-500 mt-1">SEO优化，提供专业知识</div>
          </button>
          <button
            onClick={() => setSelectedType(ContentType.PROMOTIONAL)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              selectedType === ContentType.PROMOTIONAL
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="font-medium text-slate-900">🎯 引流推广</div>
            <div className="text-sm text-slate-500 mt-1">课程推广，行动号召</div>
          </button>
        </div>
      </div>

      <button
        onClick={handleGenerateContent}
        disabled={isGenerating}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? '生成中...' : '✨ 生成内容'}
      </button>

      {content && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">生成的内容</h3>
            <button
              onClick={handleCopyContent}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              📋 复制
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">正文</label>
              <textarea
                value={content.content}
                onChange={(e) => setContent({ ...content, content: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">话题标签</label>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">配图建议</label>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                {content.imagePrompts.map((prompt, index) => (
                  <li key={index}>{prompt}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={handleConvertToScript}
            disabled={isGenerating}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? '转换中...' : '🎬 转换为口播脚本'}
          </button>
        </div>
      )}
    </div>
  );

  const renderScriptEditing = () => (
    <div className="space-y-6">
      {script && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">口播脚本</h3>
              <p className="text-sm text-slate-500 mt-1">预估时长: {script.estimatedDuration} 秒</p>
            </div>
            <button
              onClick={handleCopyScript}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              📋 复制
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">完整脚本</label>
            <textarea
              value={script.script}
              onChange={(e) => setScript({ ...script, script: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">分段内容</label>
            {script.sections.map((section, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">
                    第 {index + 1} 段 ({section.duration}秒)
                  </span>
                </div>
                <textarea
                  value={section.text}
                  onChange={(e) => {
                    const newSections = [...script.sections];
                    newSections[index] = { ...section, text: e.target.value };
                    setScript({ ...script, sections: newSections });
                  }}
                  rows={2}
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentStep(Step.CONTENT_GENERATION)}
              className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              ← 返回编辑内容
            </button>
            <button
              onClick={() => setCurrentStep(Step.VIDEO_SYNTHESIS)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              下一步：合成视频 →
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderVideoSynthesis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">上传背景图片</h3>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          {backgroundImage ? (
            <div className="space-y-2">
              <div className="text-green-600 text-4xl">✓</div>
              <p className="text-sm text-slate-600">{backgroundImage.name}</p>
              <p className="text-xs text-slate-400">点击重新选择</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-slate-400 text-4xl">📷</div>
              <p className="text-sm text-slate-600">点击上传背景图片</p>
              <p className="text-xs text-slate-400">推荐尺寸: 1080x1920 (9:16)</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {script && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">视频信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">预估时长</div>
              <div className="text-lg font-semibold text-slate-900">{script.estimatedDuration}秒</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">脚本段数</div>
              <div className="text-lg font-semibold text-slate-900">{script.sections.length}段</div>
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">合成进度</h3>
          <div className="space-y-2">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 text-center">{Math.round(videoProgress)}%</p>
          </div>
        </div>
      )}

      {videoExport && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">✅ 视频生成成功</h3>
          <video
            src={videoExport.videoUrl}
            controls
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          />
          <button
            onClick={handleDownloadVideo}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            ⬇️ 下载视频
          </button>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => setCurrentStep(Step.SCRIPT_EDITING)}
          className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          ← 返回编辑脚本
        </button>
        <button
          onClick={handleSynthesizeVideo}
          disabled={isGenerating || !script}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? '合成中...' : '🎬 开始合成视频'}
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case Step.CONTENT_GENERATION:
        return renderContentGeneration();
      case Step.SCRIPT_EDITING:
        return renderScriptEditing();
      case Step.VIDEO_SYNTHESIS:
        return renderVideoSynthesis();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          📱 小红书内容生成器
        </h2>
        <p className="text-slate-600">
          AI 辅助生成言语治疗招生内容，一键转换为口播视频
        </p>
      </div>

      {renderStepIndicator()}
      {renderCurrentStep()}
    </div>
  );
};

export default XiaohongshuGenerator;
