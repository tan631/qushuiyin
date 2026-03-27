import { execSync } from 'child_process';

export async function extractTwitter(url: string, extractType: string = 'both') {
  const tweetId = url.match(/status\/(\d+)/)?.[1];
  if (!tweetId) throw new Error('Invalid Twitter/X URL');

  try {
    const infoJson = execSync(
      `yt-dlp --dump-json --no-playlist "${url}"`,
      { timeout: 30000, encoding: 'utf8' }
    );
    const info = JSON.parse(infoJson);

    const formats: any[] = info.formats || [];
    const qualities = [];
    
    if (extractType === 'video' || extractType === 'both') {
      const videoFormats = formats
        .filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none')
        .sort((a: any, b: any) => (b.height || 0) - (a.height || 0));
      
      if (videoFormats.length > 0) {
        videoFormats.slice(0, 3).forEach((f: any) => {
          qualities.push({ label: `${f.height}p`, value: f.format_id, url: f.url });
        });
      }
    }

    return {
      platform: 'Twitter',
      title: info.title || 'Twitter Video',
      author: info.uploader,
      duration: info.duration ? `${Math.floor(info.duration / 60)}:${String(info.duration % 60).padStart(2, '0')}` : undefined,
      videoUrl: url,
      textContent: extractType === 'text' || extractType === 'both' ? info.description : undefined,
      qualities: qualities.length > 0 ? qualities : [{ label: 'Default', value: 'best', url: undefined }],
      metadata: {
        thumbnail: info.thumbnail,
        tweetId,
      }
    };
  } catch (error: any) {
    throw new Error(`Twitter extraction failed: ${error.message}`);
  }
}
