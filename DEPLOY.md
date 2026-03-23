# 部署指南

## 1. 数据库配置（Supabase）

1. 访问 https://supabase.com 创建项目
2. 获取数据库连接字符串
3. 添加到 `.env.local`:
```
DATABASE_URL="postgresql://..."
```

## 2. Google OAuth 配置

1. 访问 https://console.cloud.google.com
2. 创建 OAuth 2.0 客户端 ID
3. 添加授权重定向 URI: `http://localhost:3000/api/auth/callback/google`
4. 添加到 `.env.local`:
```
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## 3. YouTube API 配置

1. 在 Google Cloud Console 启用 YouTube Data API v3
2. 创建 API 密钥
3. 添加到 `.env.local`:
```
YOUTUBE_API_KEY="..."
```

## 4. 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

## 5. 本地运行

```bash
npm run dev
```

访问 http://localhost:3000

## 6. Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 添加环境变量
4. 部署
