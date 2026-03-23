export async function extractYouTube(url: string) {
  // 提取视频 ID
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!videoId) throw new Error('Invalid YouTube URL');

  // 使用 YouTube Data API 获取视频信息
  const apiKey = process.env.YOUTUBE_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  
  const res = await fetch(apiUrl);
  const data = await res.json();
  
  if (!data.items?.[0]) throw new Error('Video not found');
  
  const video = data.items[0].snippet;
  
  return {
    platform: 'youtube',
    videoUrl: url,
    videoThumbnail: video.thumbnails.high.url,
    textContent: video.description,
    metadata: {
      title: video.title,
      author: video.channelTitle,
    }
  };
}
