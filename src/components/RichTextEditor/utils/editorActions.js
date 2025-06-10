import { Editor, Transforms, Element as SlateElement } from 'slate'
import { LIST_TYPES, TEXT_ALIGN_TYPES } from '../constants/constants'
import { isBlockActive } from './utils'

// 切换块级元素
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

// 切换标记
export const toggleMark = (editor, format) => {
  const isActive = Editor.marks(editor)?.[format] === true

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// 插入图片文件
export const insertImageFile = (editor, dataUrl, file) => {
  const image = {
    type: 'image',
    url: dataUrl,
    alt: file.name,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, image)
}

// 插入视频文件
export const insertVideoFile = (editor, dataUrl, file) => {
  const video = {
    type: 'video',
    url: dataUrl,
    title: file.name,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, video)
}

// 插入音频文件
export const insertAudioFile = (editor, dataUrl, file) => {
  const audio = {
    type: 'audio',
    url: dataUrl,
    title: file.name,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, audio)
}

// 插入表格
export const insertTable = (editor) => {
  const table = {
    type: 'table',
    children: [
      {
        type: 'table-row',
        children: [
          { type: 'table-cell', children: [{ text: '单元格 1' }] },
          { type: 'table-cell', children: [{ text: '单元格 2' }] },
        ],
      },
      {
        type: 'table-row',
        children: [
          { type: 'table-cell', children: [{ text: '单元格 3' }] },
          { type: 'table-cell', children: [{ text: '单元格 4' }] },
        ],
      },
    ],
  }
  Transforms.insertNodes(editor, table)
}

// 插入代码块
export const insertCodeBlock = (editor) => {
  const language = prompt('请输入编程语言 (如: javascript, python, css):') || 'javascript'
  
  const codeBlock = {
    type: 'code-block',
    language,
    children: [{ text: '// 在这里输入您的代码\nconsole.log("Hello, World!");' }],
  }
  Transforms.insertNodes(editor, codeBlock)
} 