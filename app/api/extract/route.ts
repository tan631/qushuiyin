import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { extractYouTube } from '@/lib/extractors/youtube';
import { extractTikTok } from '@/lib/extractors/tiktok';
import { extractTwitter } from '@/lib/extractors/twitter';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 识别平台并提取
    let result;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      result = await extractYouTube(url);
    } else if (url.includes('tiktok.com')) {
      result = await extractTikTok(url);
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      result = await extractTwitter(url);
    } else {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    // 保存历史记录（如果用户已登录）
    const session = await auth();
    if (session?.user?.id) {
      await prisma.extractionHistory.create({
        data: {
          userId: session.user.id,
          platform: result.platform,
          originalUrl: url,
          contentType: result.videoUrl && result.textContent ? 'both' : result.videoUrl ? 'video' : 'text',
          videoUrl: result.videoUrl,
          videoThumbnail: result.videoThumbnail,
          textContent: result.textContent,
          metadata: result.metadata,
        }
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
