import React from 'react'
import { useSlate } from 'slate-react'
import { Download } from 'lucide-react'

const ExportButton = () => {
  const editor = useSlate()

  const exportToJson = () => {
    const content = editor.children
    const jsonString = JSON.stringify(content, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `rich-text-content-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToHtml = () => {
    // 简单的HTML导出逻辑
    const serializeToHtml = (nodes) => {
      return nodes.map(node => {
        if (node.type === 'heading-one') {
          return `<h1>${node.children.map(child => child.text).join('')}</h1>`
        } else if (node.type === 'heading-two') {
          return `<h2>${node.children.map(child => child.text).join('')}</h2>`
        } else if (node.type === 'heading-three') {
          return `<h3>${node.children.map(child => child.text).join('')}</h3>`
        } else if (node.type === 'block-quote') {
          return `<blockquote>${node.children.map(child => child.text).join('')}</blockquote>`
        } else if (node.type === 'bulleted-list') {
          const items = node.children.map(child => 
            `<li>${child.children.map(grandchild => grandchild.text).join('')}</li>`
          ).join('')
          return `<ul>${items}</ul>`
        } else if (node.type === 'numbered-list') {
          const items = node.children.map(child => 
            `<li>${child.children.map(grandchild => grandchild.text).join('')}</li>`
          ).join('')
          return `<ol>${items}</ol>`
        } else {
          const text = node.children.map(child => {
            let content = child.text
            if (child.bold) content = `<strong>${content}</strong>`
            if (child.italic) content = `<em>${content}</em>`
            if (child.underline) content = `<u>${content}</u>`
            if (child.strikethrough) content = `<del>${content}</del>`
            if (child.code) content = `<code>${content}</code>`
            return content
          }).join('')
          return `<p>${text}</p>`
        }
      }).join('\n')
    }

    const htmlContent = serializeToHtml(editor.children)
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>富文本内容导出</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        blockquote { border-left: 4px solid #007bff; padding-left: 1rem; margin: 1rem 0; color: #6c757d; font-style: italic; }
        code { background: #f1f3f4; padding: 2px 6px; border-radius: 4px; font-family: Monaco, monospace; }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`

    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `rich-text-content-${new Date().toISOString().slice(0, 10)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="export-buttons">
      <button
        onClick={exportToJson}
        className="toolbar-button export-button"
        title="导出为JSON"
      >
        <Download size={16} />
        <span>JSON</span>
      </button>
      <button
        onClick={exportToHtml}
        className="toolbar-button export-button"
        title="导出为HTML"
      >
        <Download size={16} />
        <span>HTML</span>
      </button>
    </div>
  )
}

export default ExportButton 