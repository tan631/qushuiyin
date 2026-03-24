import { execSync } from 'child_process';

export async function extractTwitter(url: string) {
  const tweetId = url.match(/status\/(\d+)/)?.[1];
  if (!tweetId) throw new Error('Invalid Twitter/X URL');

  // 用 yt-dlp 获取推文视频信息
  let videoUrl = null;
  let videoThumbnail = null;
  let metadata: any = { tweetId };

  try {
    const infoJson = execSync(
      `yt-dlp --dump-json --no-playlist "${url}"`,
      { timeout: 30000, encoding: 'utf8' }
    );
    const info = JSON.parse(infoJson);

    const formats: any[] = info.formats || [];
    const bestFormat = formats
      .filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none')
      .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))[0];

    videoUrl = bestFormat?.url || info.url;
    videoThumbnail = info.thumbnail;
    metadata = {
      tweetId,
      title: info.title,
      author: info.uploader,
      duration: info.duration,
    };
  } catch {
    // 推文可能没有视频，只有文字
  }

  return {
    platform: 'twitter',
    videoUrl,
    videoThumbnail,
    textContent: null,
    metadata,
  };
}
