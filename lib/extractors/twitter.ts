export async function extractTwitter(url: string) {
  // 提取推文 ID
  const tweetId = url.match(/status\/(\d+)/)?.[1];
  if (!tweetId) throw new Error('Invalid Twitter URL');

  // 简化版：返回基础信息
  // 生产环境需要使用 Twitter API v2
  
  return {
    platform: 'twitter',
    videoUrl: null,
    videoThumbnail: null,
    textContent: 'Twitter content extraction coming soon',
    metadata: {
      tweetId,
      note: 'Requires Twitter API v2 integration'
    }
  };
}
