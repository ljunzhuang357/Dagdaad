---
name: Dagdaad
description: Elke dag een goede daad — een vriendelijkheids-dagboek
colors:
  bg-warm: "#FFF8E7"
  bg-card: "#FFFFFF"
  text-primary: "#2D2D2D"
  text-secondary: "#6B6B6B"
  accent-orange: "#FF8C42"
  accent-pink: "#FF6B9D"
  accent-purple: "#9B59B6"
  accent-blue: "#4ECDC4"
  accent-yellow: "#FFD93D"
  gradient-hero-start: "#FFF3E0"
  gradient-heart-mid: "#FFE0EC"
  gradient-hero-end: "#E8E0FF"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2rem, 8vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.2
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  pill: "999px"
  card: "24px"
  card-mobile: "20px"
  input: "16px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    background: "linear-gradient(135deg, #FF8C42, #FF6B9D)"
    textColor: "#FFFFFF"
    fontWeight: 600
    rounded: "999px"
    padding: "0.75rem 1.75rem"
  button-primary-hover:
    opacity: 0.9
    transform: "scale(1.03)"
  button-ghost:
    background: "transparent"
    textColor: "#2D2D2D"
    fontWeight: 500
    rounded: "999px"
    padding: "0.75rem 1.25rem"
  button-ghost-hover:
    background: "rgba(0,0,0,0.05)"
  card:
    background: "#FFFFFF"
    rounded: "24px"
    padding: "1.5rem"
  input:
    background: "#FFFFFF"
    rounded: "16px"
    border: "2px solid #E8E0D0"
    padding: "1rem 1.25rem"
  input-focus:
    borderColor: "#FF8C42"
---
# 设计系统: Dagdaad

## 1. 概述

**创意北极星: "那本温暖的日记"**

Dagdaad 的视觉系统像一本放在荷兰咖啡馆桌上的皮质日记本——纸张是暖米色的，墨水是深棕色的，偶尔有一道阳光透过窗户洒在页面上留下橙粉色的光晕。温暖不在装饰里，在材质里。

这个系统明确拒绝: 游戏化徽章/连击/排行榜、社交动态流、保健品式说教、冷调的极简企业仪表盘。

**关键特征:**
- 温暖的米色基底，不追求纯白
- 橙粉渐变作为唯一的视觉动线，用法克制
- 极圆的大圆角（24px），触感柔软
- 字体层级单纯，不依赖装饰字体
- 无硬阴影——用自然的柔光（低透明度、大扩散）

## 2. 色彩

暖色基底 + 橙粉渐变点缀。整体 chroma 偏低，只在渐变汇聚处提高。

### 主要色
- **暖橙** (`#FF8C42`): 渐变起点，CTA 按钮基调，聚焦态边框。暖调核心，色相约 25°。
- **柔粉** (`#FF6B9D`): 渐变终点，与暖橙构成主渐变轴。色相约 340°。

### 中性色
- **日记纸** (`#FFF8E7`): 页面背景。不是纯白，是略带暖黄的米色。
- **卡片白** (`#FFFFFF`): 卡片/输入框背景。在日记纸的映衬下自然形成层次。
- **深褐** (`#2D2D2D`): 正文文字，手写墨色感。
- **灰褐** (`#6B6B6B`): 次要文字，温和不刺眼。

### 辅助色（使用频率 ≤5%）
- **淡紫** (`#9B59B6`): 渐变末端，作背景过渡用，不作为交互色。
- **水蓝** (`#4ECDC4`): 极少数装饰性场景。
- **暖黄** (`#FFD93D`): 免费版定价卡 badge。

### 渐变
- **Hero 渐层**: `#FFF3E0 → #FFE0EC → #E8E0FF`（水平 135°），纸色到淡粉到淡紫，柔和过渡。

### 命名规则
**一则规则。** 暖橙-柔粉渐变是唯一的视觉动线。辅助色不单独使用做交互，不构成第二个渐变。

## 3. 排版

**显示/标题字体:** system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
**正文字体:** Arial, Helvetica, sans-serif

**气质:** 信任系统字体。不加外来装饰字体，保持荷兰式的直接和干净。层级通过 weight 和 size 区分，不依赖不同字体家族。

### 层级
- **Display** (800 weight, `clamp(2rem, 8vw, 3rem)`, 1.2 line-height): Hero 标题，仅首页。
- **Headline** (700 weight, 1.5rem, 1.3 line-height): 区块标题。
- **Title** (600 weight, 1.125rem, 1.4 line-height): 卡片标题、导航品牌名。
- **Body** (400 weight, 1rem, 1.5 line-height): 正文。行宽控制在 65-75ch。
- **Label** (500 weight, 0.875rem, 1.4 line-height): 小标签、导航链接、定价周期。

### 命名规则
**一则规则：** 不引入装饰字体。系统字体足够——温暖来自颜色和间距，不是字体选择。

## 4. 景深

系统默认扁平。深度通过柔和阴影（低 opacity、大扩散）在交互时展现。

### 阴影词汇
- **卡片悬浮** (`0 4px 20px rgba(0,0,0,0.06)`): 卡片静止时，极淡。
- **卡片悬停** (`0 8px 30px rgba(0,0,0,0.10)`): 交互反馈，比静止重一档。
- **移动菜单** (`shadow-2xl`, rgba(0,0,0,0.2)): 侧滑菜单背后。

### 命名规则
**扁平为默认规则。** 静止时不加多余阴影。阴影只作为状态响应出现。

## 5. 组件

### 按钮
- **形状:** 全圆角 (`border-radius: 999px`)
- **主要按钮:** 橙粉渐变背景 + 白色文字。padding: `0.75rem 1.75rem`。
  - 悬停: `opacity: 0.9`，`scale(1.03)` 轻微放大。
  - 点击: `scale(0.98)`。
- **幽灵按钮:** 透明背景，深褐文字，`border-radius: 999px`。悬停时变浅灰 (`rgba(0,0,0,0.05)`)。

### 卡片/容器
- **形状:** 大圆角（24px，移动端 20px）
- **背景:** 纯白 (`#FFFFFF`)
- **阴影:** 见景深章节。静止极淡，悬停升一档。
- **内边距:** 1.5rem（移动端 1.25rem）

### 输入框
- **形状:** 16px 圆角，2px 实心边框 (`#E8E0D0`)
- **背景:** 白色
- **聚焦:** 边框变主色橙 (`#FF8C42`)
- **内边距:** 1rem 1.25rem

### 导航
- **桌面:** 横向布局，左 logo + 品牌名，右链接。
- **链接:** 幽灵按钮风格，全圆角，悬停浅灰底。
- **移动:** 汉堡菜单 → 右侧滑出面板，`animate-slide-in` 动画（0.2s ease-out）。半透明黑色遮罩 (`rgba(0,0,0,0.2)`)。
- **触控:** 所有可点击元素最小 44px 触控区域。

## 6. 怎么做 & 别怎么做

### 要做:
- **要做** 用暖米色（`#FFF8E7`）做页面背景，拒绝纯白。
- **要做** 卡片用 24px 大圆角，保持一致的柔软感。
- **要做** 按钮用全圆角 pill 形状。
- **要做** 触摸目标至少 44px。
- **要做** 阴影用低 opacity 大扩散，模拟柔光而非硬投影。

### 不要做:
- **不要** 使用渐变色文字（`background-clip: text` + 渐变）。它出现在当前 hero 中，属于已知遗留问题，需移除。
- **不要** 使用边框色条装饰（border-left/right 加粗着色）。
- **不要** 使用磨砂玻璃效果。
- **不要** 用榜单指标模板（大数字+小标签+支撑数据）。
- **不要** 使用同尺寸卡片网格重复排列（icon + 标题 + 正文 × N）。
- **不要** 弹窗作为第一方案。
- **不要** 使用破折号（em dash），用逗号/冒号替代。
- **不要** 添加游戏化元素（连击、徽章、排行榜）。
- **不要** 使用暗色模式作为默认——这个应用在明亮日常中使用。
