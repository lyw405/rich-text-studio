import { Transforms, Text, Element as SlateElement, Path } from 'slate'

// 自定义插件：处理内联元素
export const withInlines = editor => {
  const { isInline, isVoid, normalizeNode } = editor

  editor.isInline = element => {
    return ['link', 'mention'].includes(element.type) ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.type === 'mention' ? true : isVoid(element)
  }

  // 改进的规范化函数
  editor.normalizeNode = ([node, path]) => {
    if (Text.isText(node)) {
      return normalizeNode([node, path])
    }

    if (SlateElement.isElement(node)) {
      // 确保段落中的内联元素后有可编辑文本
      if (node.type === 'paragraph') {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i]
          if (child.type === 'link' || child.type === 'mention') {
            const isLast = i === node.children.length - 1
            const nextChild = isLast ? null : node.children[i + 1]
            
            // 如果是最后一个子元素，或下一个不是文本节点，插入空文本节点
            if (isLast || !Text.isText(nextChild)) {
              const textNodePath = [...path, i + 1]
              Transforms.insertNodes(editor, { text: '' }, { at: textNodePath })
              return
            }
          }
        }
      }
    }

    normalizeNode([node, path])
  }

  return editor
} 