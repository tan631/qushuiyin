# 技术架构文档

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端 (Next.js 15)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  首页    │  │ 结果页   │  │ 个人中心 │  │ 登录页  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                ↓ API Routes
┌─────────────────────────────────────────────────────────┐
│                  后端 API (Next.js API)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ 认证服务 │  │ 提取服务 │  │ 历史服务 │  │ 用户服务│ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              第三方服务集成层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ YouTube  │  │ TikTok   │  │ 小红书   │  │ Twitter │ │
│  │ Instagram│  │ Facebook │  │ 短信服务 │  │ OAuth   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  数据存储层                              │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  PostgreSQL      │  │  Cloudflare R2   │            │
│  │  (用户/历史记录) │  │  (视频文件缓存)  │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 2. 技术栈

### 前端
- **框架**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **国际化**: next-intl
- **状态管理**: React Context + Hooks
- **HTTP 客户端**: fetch API

### 后端
- **运行时**: Next.js API Routes
- **认证**: NextAuth.js v5
- **数据库**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **视频处理**: yt-dlp (服务器端)

### 第三方服务
- **Google OAuth**: Google Cloud Console
- **短信服务**: 腾讯云短信
- **部署**: Vercel (前端) + 轻量云服务器 (视频处理)

## 3. 数据库设计

### 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  nickname VARCHAR(100),
  avatar_url TEXT,
  provider VARCHAR(20), -- 'google' | 'phone'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 提取历史表 (extraction_history)
```sql
CREATE TABLE extraction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  original_url TEXT NOT NULL,
  content_type VARCHAR(20), -- 'video' | 'text' | 'both'
  video_url TEXT,
  video_thumbnail TEXT,
  text_content TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_created ON extraction_history(user_id, created_at DESC);
```

### 验证码表 (verification_codes)
```sql
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_phone_expires ON verification_codes(phone, expires_at);
```

## 4. API 设计

### 认证相关
- `POST /api/auth/google` - Google OAuth 回调
- `POST /api/auth/phone/send-code` - 发送手机验证码
- `POST /api/auth/phone/verify` - 验证手机号登录
- `GET /api/auth/session` - 获取当前会话
- `POST /api/auth/logout` - 退出登录

### 提取相关
- `POST /api/extract` - 提取内容（主接口）
- `GET /api/extract/history` - 获取历史记录
- `POST /api/extract/retry` - 重新提取
- `DELETE /api/extract/history/:id` - 删除历史记录

### 用户相关
- `GET /api/user/profile` - 获取用户信息
- `PATCH /api/user/profile` - 更新用户信息

## 5. 项目结构

```
qushuiyin/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx           # 首页
│   │   │   ├── result/[id]/       # 结果页
│   │   │   ├── profile/           # 个人中心
│   │   │   └── login/             # 登录页
│   │   └── api/
│   │       ├── auth/
│   │       ├── extract/
│   │       └── user/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui 组件
│   │   ├── PlatformGrid.tsx
│   │   ├── ExtractForm.tsx
│   │   ├── ResultDisplay.tsx
│   │   ├── HistoryList.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── lib/
│   │   ├── extractors/
│   │   │   ├── youtube.ts
│   │   │   ├── tiktok.ts
│   │   │   └── twitter.ts
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   └── i18n/
│       ├── en.json
│       └── zh.json
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

## 6. 部署架构

### Vercel (前端 + API)
- 自动 HTTPS
- 全球 CDN
- 环境变量管理
- 自动部署（Git push）

### 轻量云服务器 (视频处理)
- 运行 yt-dlp
- 提供 API 接口给 Vercel 调用
- 临时存储视频文件

### Supabase (数据库)
- PostgreSQL 托管
- 免费 500MB 存储
- 自动备份

## 7. 成本估算

| 服务 | 免费额度 | 预估月成本 |
|------|----------|------------|
| Vercel | 100GB 带宽 | $0 |
| Supabase | 500MB 数据库 | $0 |
| 腾讯云短信 | 100 条/月 | $0-10 |
| 轻量云服务器 | - | $5-10 |
| **总计** | - | **$5-20** |
