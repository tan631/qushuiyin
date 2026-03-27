import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function extractYouTube(url: string, extractType: string = 'both') {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!videoId) throw new Error('Invalid YouTube URL');

  try {
    // 使用 yt-dlp 获取视频信息和下载链接
    const { stdout } = await execAsync(
      `yt-dlp -j --no-warnings "${url}"`,
      { timeout: 30000 }
    );
    
    const info = JSON.parse(stdout);
    
    // 构建画质选项
    const qualities = [];
    if (extractType === 'video' || extractType === 'both') {
      const formats = info.formats || [];
      const videoFormats = formats
        .filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none')
        .sort((a: any, b: any) => (b.height || 0) - (a.height || 0));
      
      if (videoFormats.length > 0) {
        const seen = new Set();
        videoFormats.forEach((f: any) => {
          const height = f.height || 0;
          if (height && !seen.has(height)) {
            seen.add(height);
            qualities.push({
              label: `${height}p`,
              value: f.format_id,
              url: f.url
            });
          }
        });
      }
    }
    
    return {
      platform: 'YouTube',
      title: info.title || 'Untitled',
      author: info.uploader || info.channel || 'Unknown',
      duration: info.duration ? `${Math.floor(info.duration / 60)}:${String(info.duration % 60).padStart(2, '0')}` : undefined,
      videoUrl: url,
      textContent: extractType === 'text' || extractType === 'both' ? info.description : undefined,
      qualities: qualities.length > 0 ? qualities : [{ label: 'Default', value: 'best', url: undefined }],
      metadata: {
        thumbnail: info.thumbnail,
        views: info.view_count,
      }
    };
  } catch (error: any) {
    throw new Error(`YouTube extraction failed: ${error.message}`);
  }
}
