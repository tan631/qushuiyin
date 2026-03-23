import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 识别平台
    let platform = 'unknown';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
    } else if (url.includes('tiktok.com')) {
      platform = 'tiktok';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      platform = 'twitter';
    }

    // TODO: 调用对应平台的提取器
    return NextResponse.json({
      success: true,
      platform,
      message: 'Extraction in progress'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
