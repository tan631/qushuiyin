export async function extractTikTok(url: string) {
  // 简化版：返回基础信息
  // 生产环境需要使用 tiktok-scraper 或第三方 API
  
  return {
    platform: 'tiktok',
    videoUrl: url,
    videoThumbnail: null,
    textContent: 'TikTok content extraction coming soon',
    metadata: {
      note: 'Requires tiktok-scraper integration'
    }
  };
}
