# RichTextEditor 组件

一个功能丰富的现代化富文本编辑器组件，基于 Slate.js 构建。

## 文件结构

```
RichTextEditor/
├── index.js                    # 默认导出入口
├── RichTextEditor.jsx          # 主组件
├── RichTextEditor.css          # 样式文件
├── components/                 # 子组件
│   ├── CodeBlock.jsx          # 代码块组件
│   ├── DragDropUploader.jsx   # 拖拽上传组件
│   ├── ElementRenderer.jsx    # 元素渲染器
│   ├── ExportButton.jsx       # 导出按钮
│   ├── FileUploader.jsx       # 文件上传组件
│   ├── LinkEditor.jsx         # 链接编辑器
│   ├── MentionEditor.jsx      # @提及编辑器
│   ├── TableContextMenu.jsx   # 表格右键菜单
│   └── Toolbar.jsx            # 工具栏组件
├── constants/                  # 常量定义
│   └── constants.js           # 热键和其他常量
├── plugins/                    # 编辑器插件
│   └── editorPlugins.js       # 自定义插件（内联元素支持）
└── utils/                     # 工具函数
    ├── editorActions.js       # 编辑器操作方法
    ├── initialValue.js        # 初始值处理
    ├── tableUtils.js          # 表格操作工具
    └── utils.js               # 通用工具函数
```

## 使用方式

```jsx
import RichTextEditor from './components/RichTextEditor'

function App() {
  return <RichTextEditor />
}
```

## 特性

- 📝 丰富的文本格式（粗体、斜体、下划线、删除线、代码）
- 🎯 多级标题支持
- 📋 有序和无序列表
- 🔗 链接插入和编辑
- 🖼️ 多媒体支持（图片、视频、音频）
- 📊 表格编辑和操作
- 💬 @用户提及功能
- 📦 代码块语法高亮
- 🎨 现代化 UI 设计
- 📱 响应式布局
- 🚀 高性能渲染
- 💾 多格式导出（JSON、HTML）

## 组件说明

### 主要组件
- **RichTextEditor**: 主编辑器组件，整合所有功能
- **Toolbar**: 工具栏，提供格式化和插入功能
- **ElementRenderer**: 负责渲染不同类型的内容元素

### 功能组件
- **LinkEditor**: 链接创建和编辑弹窗
- **MentionEditor**: @用户提及功能弹窗
- **TableContextMenu**: 表格右键操作菜单
- **DragDropUploader**: 拖拽文件上传功能

### 工具函数
- **editorActions**: 编辑器操作方法集合
- **tableUtils**: 表格专用操作工具
- **utils**: 通用工具函数 