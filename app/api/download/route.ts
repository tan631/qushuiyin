import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// 支持的平台
const SUPPORTED_PLATFORMS = [
  'youtube.com', 'youtu.be',
  'tiktok.com',
  'twitter.com', 'x.com',
];

function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  return 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const { url, quality = 'best' } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const isSupported = SUPPORTED_PLATFORMS.some(p => url.includes(p));
    if (!isSupported) {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    const platform = detectPlatform(url);

    // 构建 yt-dlp 参数
    const args = [
      '--dump-json',
      '--no-playlist',
      '--no-warnings',
    ];

    // 质量选择
    if (quality === 'best') {
      args.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
    } else if (quality === 'medium') {
      args.push('-f', 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best');
    } else if (quality === 'low') {
      args.push('-f', 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best');
    }

    // TikTok 特殊处理：优先无水印
    if (platform === 'tiktok') {
      args.push('--add-header', 'Referer:https://www.tiktok.com/');
    }

    args.push(url);

    // 获取视频直链
    const info = await new Promise<any>((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      const proc = spawn('yt-dlp', args, { timeout: 30000 });

      proc.stdout.on('data', (d) => { stdout += d.toString(); });
      proc.stderr.on('data', (d) => { stderr += d.toString(); });
      proc.on('close', (code) => {
        if (code !== 0) return reject(new Error(stderr || 'yt-dlp failed'));
        try { resolve(JSON.parse(stdout)); } catch { reject(new Error('Failed to parse yt-dlp output')); }
      });
    });

    // 找最佳格式直链
    const formats: any[] = info.formats || [];
    let downloadUrl = info.url;

    if (formats.length > 0) {
      // 优先找合并好的 mp4
      const mp4 = formats
        .filter((f: any) => f.ext === 'mp4' && f.vcodec !== 'none' && f.acodec !== 'none')
        .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))[0];

      if (mp4) {
        downloadUrl = mp4.url;
      } else {
        // fallback: 最高质量
        const best = formats
          .filter((f: any) => f.vcodec !== 'none')
          .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))[0];
        if (best) downloadUrl = best.url;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        platform,
        downloadUrl,
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        ext: info.ext || 'mp4',
        filesize: info.filesize || info.filesize_approx,
        formats: formats
          .filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none' && f.url)
          .map((f: any) => ({
            formatId: f.format_id,
            ext: f.ext,
            height: f.height,
            filesize: f.filesize,
            url: f.url,
          }))
          .slice(0, 5), // 最多返回5个格式供前端选择
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
