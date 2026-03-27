import { execSync } from 'child_process';

export async function extractTikTok(url: string, extractType: string = 'both') {
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
      qualities.push({ label: 'HD', value: videoFormats[0].format_id, url: videoFormats[0].url });
      if (videoFormats.length > 1) {
        qualities.push({ label: 'SD', value: videoFormats[1].format_id, url: videoFormats[1].url });
      }
    }
  }

  return {
    platform: 'TikTok',
    title: info.title || 'TikTok Video',
    author: info.uploader || info.creator,
    duration: info.duration ? `${Math.floor(info.duration / 60)}:${String(info.duration % 60).padStart(2, '0')}` : undefined,
    videoUrl: url,
    textContent: extractType === 'text' || extractType === 'both' ? (info.description || info.title) : undefined,
    qualities: qualities.length > 0 ? qualities : [{ label: 'Default', value: 'best', url: undefined }],
    metadata: {
      thumbnail: info.thumbnail,
      views: info.view_count,
      likes: info.like_count,
    }
  };
}
