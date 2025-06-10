import { Editor, Range, Element as SlateElement } from 'slate'

// 快捷键检测
export const isHotkey = (hotkey, event) => {
  const keys = hotkey.split('+')
  let isMatch = true
  
  keys.forEach(key => {
    if (key === 'mod') {
      if (!(event.ctrlKey || event.metaKey)) isMatch = false
    } else if (key === 'shift') {
      if (!event.shiftKey) isMatch = false
    } else if (key === 'alt') {
      if (!event.altKey) isMatch = false
    } else {
      if (event.key.toLowerCase() !== key.toLowerCase()) isMatch = false
    }
  })
  
  return isMatch
}

// 检测块级元素是否激活
export const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Range.isExpanded(selection) ? selection : Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

// 检测标记是否激活
export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
} 