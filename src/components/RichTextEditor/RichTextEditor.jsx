import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { createEditor, Editor, Transforms, Text, Range, Path } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import DragDropUploader from './components/DragDropUploader'
import LinkEditor from './components/LinkEditor'
import MentionEditor from './components/MentionEditor'
import TableContextMenu from './components/TableContextMenu'
import { Toolbar } from './components/Toolbar'
import { Element, Leaf } from './components/ElementRenderer'
import { getInitialValue, isValidSlateValue, normalizeSlateValue } from './utils/initialValue'
import { HOTKEYS } from './constants/constants'
import { isHotkey } from './utils/utils'
import { toggleMark } from './utils/editorActions'
import { withInlines } from './plugins/editorPlugins'
import { handleTableCellEnter, handleTableCellTab, isInTableCell } from './utils/tableUtils'
import './RichTextEditor.css'

const RichTextEditor = () => {
  const [value, setValue] = useState(() => {
    try {
      const initialValue = getInitialValue()
      const normalizedValue = normalizeSlateValue(initialValue)
      return normalizedValue
    } catch (error) {
      console.error('❌ 初始化编辑器失败:', error)
      return [{ type: 'paragraph', children: [{ text: 'Hello World!' }] }]
    }
  })
  
  const [linkEditorOpen, setLinkEditorOpen] = useState(false)
  const [mentionEditorOpen, setMentionEditorOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [isToolbarFixed, setIsToolbarFixed] = useState(false)
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 } })
  const editorRef = useRef(null)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => {
    try {
      const baseEditor = withHistory(withReact(createEditor()))
      return withInlines(baseEditor)
    } catch (error) {
      console.error('❌ 创建编辑器失败:', error)
      // 返回一个基本的编辑器实例
      return withHistory(withReact(createEditor()))
    }
  }, [])

  // 辅助函数：重新聚焦编辑器
  const focusEditor = useCallback(() => {
    setTimeout(() => {
      try {
        ReactEditor.focus(editor)
      } catch (error) {
        console.warn('无法聚焦编辑器:', error)
      }
    }, 50)
  }, [editor])

  const handleKeyDown = useCallback((event) => {
    // 处理表格内的回车键
    if (event.key === 'Enter') {
      if (handleTableCellEnter(editor, event)) {
        return // 如果在表格单元格内处理了回车，直接返回
      }
    }

    // 处理表格内的Tab键导航
    if (event.key === 'Tab') {
      if (handleTableCellTab(editor, event)) {
        return // 如果在表格单元格内处理了Tab，直接返回
      }
    }

    // 处理快捷键
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault()
        const mark = HOTKEYS[hotkey]
        toggleMark(editor, mark)
        return
      }
    }
    
    // 处理在内联元素中的输入
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const [node, path] = Editor.node(editor, selection)
      
      // 检查是否在内联元素中
      if (node && (node.type === 'link' || node.type === 'mention')) {
        // 处理普通字符输入
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault()
          
          // 找到当前内联元素在父级中的位置
          const parentPath = Path.parent(path)
          const nodeIndex = path[path.length - 1]
          
          // 在内联元素后插入文本
          const textInsertPath = [...parentPath, nodeIndex + 1]
          
          Editor.withoutNormalizing(editor, () => {
            // 检查是否已经有文本节点
            try {
              const [nextNode] = Editor.node(editor, textInsertPath)
              if (Text.isText(nextNode)) {
                // 如果有文本节点，在其开头插入
                Transforms.insertText(editor, event.key, { at: { path: textInsertPath, offset: 0 } })
                Transforms.select(editor, { path: textInsertPath, offset: 1 })
              } else {
                throw new Error('Not a text node')
              }
            } catch {
              // 如果没有文本节点，创建一个
              Transforms.insertNodes(editor, { text: event.key }, { at: textInsertPath })
              Transforms.select(editor, { path: textInsertPath, offset: 1 })
            }
          })
          
          return
        }
        
        // 处理方向键
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          const parentPath = Path.parent(path)
          const nodeIndex = path[path.length - 1]
          const nextTextPath = [...parentPath, nodeIndex + 1]
          
          try {
            Transforms.select(editor, { path: nextTextPath, offset: 0 })
          } catch {
            // 如果没有下一个文本节点，创建一个
            Transforms.insertNodes(editor, { text: '' }, { at: nextTextPath })
            Transforms.select(editor, { path: nextTextPath, offset: 0 })
          }
          return
        }
      }
    }
  }, [editor])

  const handleOpenLinkEditor = () => {
    const { selection } = editor
    let selectedText = ''
    
    if (selection && !Range.isCollapsed(selection)) {
      selectedText = Editor.string(editor, selection)
    }
    
    setSelectedText(selectedText)
    setLinkEditorOpen(true)
  }

  const handleOpenMentionEditor = () => {
    setMentionEditorOpen(true)
  }

  const handleContextMenu = useCallback((event) => {
    // 检查是否在表格单元格内
    if (isInTableCell(editor)) {
      event.preventDefault()
      setContextMenu({
        isOpen: true,
        position: { x: event.clientX, y: event.clientY }
      })
    }
  }, [editor])

  const handleCloseContextMenu = () => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 } })
  }

  const handleSaveLink = ({ url, text }) => {
    try {
      const linkText = text || url
      const { selection } = editor
      
      if (selection && !Range.isCollapsed(selection)) {
        // 如果有选中文本，将其转换为链接
        Transforms.wrapNodes(
          editor,
          {
            type: 'link',
            url,
            children: [],
          },
          { split: true }
        )
        Transforms.collapse(editor, { edge: 'end' })
      } else {
        // 如果没有选中文本或光标位置，插入新链接
        const linkNode = {
          type: 'link',
          url,
          children: [{ text: linkText }],
        }
        
        // 插入链接节点和后续空格
        Transforms.insertNodes(editor, [
          linkNode,
          { text: ' ' }
        ])
        
        // 确保光标定位正确
        Transforms.move(editor, { distance: 1, unit: 'offset' })
      }
      
      // 重新聚焦编辑器
      focusEditor()
      
    } catch (error) {
      console.error('❌ 链接插入失败:', error)
    }
  }

  const handleSaveMention = (user) => {
    try {
      const mention = {
        type: 'mention',
        character: user.name,
        userId: user.id,
        children: [{ text: '' }],
      }
      // 插入提及节点和后续空格
      Transforms.insertNodes(editor, [
        mention,
        { text: ' ' }
      ])
      
      // 确保光标定位正确
      Transforms.move(editor, { distance: 1, unit: 'offset' })
      
      // 重新聚焦编辑器
      focusEditor()
      
    } catch (error) {
      console.error('❌ 用户提及插入失败:', error)
    }
  }

  // 滚动监听，控制工具栏固定状态
  useEffect(() => {
    const handleScroll = () => {
      if (editorRef.current) {
        const rect = editorRef.current.getBoundingClientRect()
        const shouldFixToolbar = rect.top <= 0
        setIsToolbarFixed(shouldFixToolbar)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleChange = useCallback((newValue) => {
    // 立即检查 newValue 是否为 undefined
    if (newValue === undefined) {
      console.error('🚨 检测到 undefined 值！保持当前值不变')
      return
    }
    
    try {
      // 验证新值是否有效
      const normalizedValue = normalizeSlateValue(newValue)
      setValue(normalizedValue)
    } catch (error) {
      console.error('❌ 更新编辑器值失败:', error)
      // 如果出现错误，保持当前值不变
    }
  }, [])

  // 额外的安全检查
  if (!editor || !value || !isValidSlateValue(value)) {
    return (
      <div className="rich-text-editor">
        <div className="editor-error">
          <p>⚠️ 编辑器初始化中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rich-text-editor ${isToolbarFixed ? 'toolbar-fixed' : ''}`} ref={editorRef}>
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <Toolbar 
          onOpenLinkEditor={handleOpenLinkEditor}
          onOpenMentionEditor={handleOpenMentionEditor}
          isFixed={isToolbarFixed}
        />
        <DragDropUploader>
          <div className="editor-container">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="开始编写您的内容...（支持拖拽上传文件）"
              spellCheck
              autoFocus
              onKeyDown={handleKeyDown}
              onContextMenu={handleContextMenu}
            />
          </div>
        </DragDropUploader>
      </Slate>
      
      <LinkEditor
        isOpen={linkEditorOpen}
        onClose={() => setLinkEditorOpen(false)}
        onSave={handleSaveLink}
        initialText={selectedText}
      />
      
      <MentionEditor
        isOpen={mentionEditorOpen}
        onClose={() => setMentionEditorOpen(false)}
        onSave={handleSaveMention}
      />
      
      <TableContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        editor={editor}
      />
    </div>
  )
}

export default RichTextEditor 