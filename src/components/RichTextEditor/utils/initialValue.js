// 初始值 - 确保始终返回有效的 Slate 值
export const getInitialValue = () => {
  const defaultValue = [
    {
      type: 'heading-one',
      children: [
        { text: '🎨 RichText Studio' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        { text: '欢迎使用 RichText Studio！这是一个基于 Slate.js 构建的专业级富文本编辑器，提供丰富的文本格式和多媒体内容支持。' },
      ],
    },
    {
      type: 'heading-two',
      children: [
        { text: '✨ 主要功能' },
      ],
    },
    {
      type: 'bulleted-list',
      children: [
        {
          type: 'list-item',
          children: [{ text: '文本样式：', bold: true }, { text: '支持' }, { text: '加粗', bold: true }, { text: '、' }, { text: '斜体', italic: true }, { text: '、' }, { text: '下划线', underline: true }, { text: '、' }, { text: '删除线', strikethrough: true }, { text: '等' }],
        },
        {
          type: 'list-item',
          children: [{ text: '代码支持：', bold: true }, { text: '内联' }, { text: 'code', code: true }, { text: '和代码块' }],
        },
        {
          type: 'list-item',
          children: [{ text: '多媒体：', bold: true }, { text: '图片、视频、音频文件上传' }],
        },
        {
          type: 'list-item',
          children: [{ text: '结构化内容：', bold: true }, { text: '标题、列表、引用、表格' }],
        },
        {
          type: 'list-item',
          children: [{ text: '交互功能：', bold: true }, { text: '链接、@提及、撤销/重做' }],
        },
      ],
    },
    {
      type: 'heading-three',
      children: [
        { text: '⌨️ 键盘快捷键' },
      ],
    },
    {
      type: 'numbered-list',
      children: [
        {
          type: 'list-item',
          children: [{ text: 'Ctrl+B 或 Cmd+B：', code: true }, { text: '加粗文本' }],
        },
        {
          type: 'list-item',
          children: [{ text: 'Ctrl+I 或 Cmd+I：', code: true }, { text: '斜体文本' }],
        },
        {
          type: 'list-item',
          children: [{ text: 'Ctrl+U 或 Cmd+U：', code: true }, { text: '下划线' }],
        },
        {
          type: 'list-item',
          children: [{ text: 'Ctrl+` 或 Cmd+`：', code: true }, { text: '内联代码' }],
        },
        {
          type: 'list-item',
          children: [{ text: 'Ctrl+Shift+X 或 Cmd+Shift+X：', code: true }, { text: '删除线' }],
        },
      ],
    },
    {
      type: 'block-quote',
      children: [
        { text: '💡 提示：使用工具栏按钮插入各种内容类型，或使用键盘快捷键快速格式化文本。RichText Studio 支持拖拽上传文件！' },
      ],
    },
    {
      type: 'code-block',
      language: 'javascript',
      children: [
        { text: '// RichText Studio 示例代码\nconst richTextStudio = {\n  name: "RichText Studio",\n  type: "professional-editor",\n  features: ["formatting", "media", "tables", "links", "mentions"],\n  framework: "Slate.js"\n};\n\nconsole.log("欢迎使用 RichText Studio！");' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        { text: '试试新的功能：点击工具栏中的' },
        { 
          type: 'link',
          url: 'https://github.com',
          children: [{ text: '🔗链接按钮' }]
        },
        { text: '添加链接，或点击@按钮提及用户 ' },
        {
          type: 'mention',
          character: '张三',
          userId: '1',
          children: [{ text: '' }]
        },
        { text: '。' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        { text: '开始使用 RichText Studio 创作您的内容吧！🎉' },
      ],
    },
  ]

  return defaultValue
}

// 验证 Slate 值是否有效
export const isValidSlateValue = (value) => {
  try {
    if (!Array.isArray(value)) return false
    if (value.length === 0) return false
    
    return value.every(node => {
      if (!node || typeof node !== 'object') return false
      if (!node.type || !node.children) return false
      if (!Array.isArray(node.children)) return false
      return true
    })
  } catch (error) {
    console.error('❌ 验证 Slate 值时出错:', error)
    return false
  }
}

// 规范化 Slate 值
export const normalizeSlateValue = (value) => {
  if (isValidSlateValue(value)) {
    return value
  }
  
  console.warn('⚠️ 检测到无效的 Slate 值，使用默认值')
  return getInitialValue()
} 