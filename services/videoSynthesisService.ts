import { VideoScript, VideoExport } from "../types";

export class VideoSynthesisService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1080;
    this.canvas.height = 1920;
    this.ctx = this.canvas.getContext('2d')!;
  }

  async synthesizeVideo(
    script: VideoScript,
    backgroundImage: File | null,
    onProgress?: (progress: number) => void
  ): Promise<VideoExport> {
    try {
      if (onProgress) onProgress(10);

      const audioBlob = await this.textToSpeech(script.script);
      if (onProgress) onProgress(40);

      const videoBlob = await this.createVideoWithAudio(
        backgroundImage,
        audioBlob,
        script,
        onProgress
      );
      if (onProgress) onProgress(90);

      const videoUrl = URL.createObjectURL(videoBlob);
      if (onProgress) onProgress(100);

      return {
        id: Date.now().toString(),
        scriptId: script.id,
        videoUrl,
        duration: script.estimatedDuration,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error("Video Synthesis Error:", error);
      throw new Error("视频合成失败，请重试");
    }
  }

  private async textToSpeech(text: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error("浏览器不支持语音合成"));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const chineseVoice = voices.find(v => v.lang.startsWith('zh'));
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }

      this.audioContext = new AudioContext();
      const destination = this.audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        resolve(blob);
      };

      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
          this.audioContext?.close();
        }, 100);
      };

      utterance.onerror = (error) => {
        reject(error);
      };

      mediaRecorder.start();
      window.speechSynthesis.speak(utterance);
    });
  }

  private async createVideoWithAudio(
    backgroundImage: File | null,
    audioBlob: Blob,
    script: VideoScript,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        let bgImage: HTMLImageElement | null = null;
        
        if (backgroundImage) {
          bgImage = await this.loadImage(backgroundImage);
        }

        if (onProgress) onProgress(50);

        const canvasStream = this.canvas.captureStream(30);
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(
          new MediaStream([await this.createAudioTrack(audioBlob)])
        );
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);

        const combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...destination.stream.getAudioTracks()
        ]);

        const recorder = new MediaRecorder(combinedStream, {
          mimeType: 'video/webm;codecs=vp8,opus'
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };

        recorder.start();

        const duration = script.estimatedDuration * 1000;
        const startTime = Date.now();
        let currentSection = 0;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          
          if (elapsed >= duration) {
            recorder.stop();
            audioContext.close();
            return;
          }

          this.drawFrame(bgImage, script, currentSection, elapsed);

          let accumulatedTime = 0;
          for (let i = 0; i < script.sections.length; i++) {
            accumulatedTime += script.sections[i].duration * 1000;
            if (elapsed < accumulatedTime) {
              currentSection = i;
              break;
            }
          }

          const progress = 50 + (elapsed / duration) * 40;
          if (onProgress) onProgress(Math.min(progress, 90));

          requestAnimationFrame(animate);
        };

        animate();

      } catch (error) {
        reject(error);
      }
    });
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("图片加载失败"));
      };
      
      img.src = url;
    });
  }

  private async createAudioTrack(audioBlob: Blob): Promise<MediaStreamTrack> {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
    
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audio);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    
    return destination.stream.getAudioTracks()[0];
  }

  private drawFrame(
    bgImage: HTMLImageElement | null,
    script: VideoScript,
    sectionIndex: number,
    elapsed: number
  ): void {
    this.ctx.fillStyle = '#f1f5f9';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (bgImage) {
      const scale = Math.max(
        this.canvas.width / bgImage.width,
        this.canvas.height / bgImage.height
      );
      const x = (this.canvas.width - bgImage.width * scale) / 2;
      const y = (this.canvas.height - bgImage.height * scale) / 2;
      
      this.ctx.drawImage(
        bgImage,
        x, y,
        bgImage.width * scale,
        bgImage.height * scale
      );

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (script.sections[sectionIndex]) {
      const section = script.sections[sectionIndex];
      this.drawText(section.text, elapsed);
    }

    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      `${Math.floor(elapsed / 1000)}s`,
      this.canvas.width - 100,
      100
    );
  }

  private drawText(text: string, elapsed: number): void {
    const maxWidth = this.canvas.width - 160;
    const lineHeight = 80;
    const x = this.canvas.width / 2;
    const y = this.canvas.height - 400;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(40, y - 60, this.canvas.width - 80, 300);

    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 60px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    const words = text.split('');
    let line = '';
    let lines: string[] = [];

    for (let word of words) {
      const testLine = line + word;
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line.length > 0) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    lines.forEach((line, i) => {
      this.ctx.fillText(line, x, y + i * lineHeight);
    });
  }

  public cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}

export const synthesizeVideo = async (
  script: VideoScript,
  backgroundImage: File | null,
  onProgress?: (progress: number) => void
): Promise<VideoExport> => {
  const service = new VideoSynthesisService();
  try {
    return await service.synthesizeVideo(script, backgroundImage, onProgress);
  } finally {
    service.cleanup();
  }
};
