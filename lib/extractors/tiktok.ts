import { execSync } from 'child_process';

export async function extractTikTok(url: string) {
  // 用 yt-dlp 获取视频信息（不下载）
  const infoJson = execSync(
    `yt-dlp --dump-json --no-playlist "${url}"`,
    { timeout: 30000, encoding: 'utf8' }
  );
  const info = JSON.parse(infoJson);

  // 找最佳无水印格式（TikTok 通常有 watermark-free 格式）
  const formats: any[] = info.formats || [];
  const bestFormat = formats
    .filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none')
    .sort((a: any, b: any) => (b.filesize || 0) - (a.filesize || 0))[0];

  return {
    platform: 'tiktok',
    videoUrl: bestFormat?.url || info.url,
    videoThumbnail: info.thumbnail,
    textContent: info.description || info.title,
    metadata: {
      title: info.title,
      author: info.uploader || info.creator,
      duration: info.duration,
      viewCount: info.view_count,
      likeCount: info.like_count,
    }
  };
}
