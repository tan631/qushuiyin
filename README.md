# 去水印 (qushuiyin)

跨平台内容提取器 - 支持 YouTube、TikTok、Twitter 等平台的视频和文案提取

## 📋 项目文档

- [产品需求文档 (PRD.md)](./PRD.md)
- [技术架构文档 (ARCHITECTURE.md)](./ARCHITECTURE.md)
- [免费接口调研报告 (API_RESEARCH.md)](./API_RESEARCH.md)

## 🎯 核心功能

- ✅ 多平台支持：YouTube、TikTok、Twitter（第一阶段）
- ✅ 视频下载：无水印视频提取
- ✅ 文案提取：一键复制内容文本
- ✅ 用户系统：Google OAuth + 手机号登录
- ✅ 历史记录：个人中心管理提取历史
- ✅ 双语支持：中文/English 切换

## 🛠️ 技术栈

- **前端**: Next.js 15 + Tailwind CSS + shadcn/ui
- **认证**: NextAuth.js v5
- **数据库**: PostgreSQL (Supabase)
- **部署**: Vercel + 轻量云服务器
- **视频处理**: yt-dlp

## 📦 开发计划

### 第一阶段（MVP）
- [ ] 项目初始化
- [ ] 用户认证系统
- [ ] YouTube 视频提取
- [ ] TikTok 视频提取
- [ ] Twitter 内容提取
- [ ] 历史记录功能

### 第二阶段
- [ ] 小红书支持
- [ ] Instagram 支持
- [ ] 性能优化
- [ ] 用户反馈系统

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/tan631/qushuiyin.git
cd qushuiyin

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

## 📝 License

MIT

## 👥 贡献者

- [@tan631](https://github.com/tan631)
