import React from 'react'
import { useSlate } from 'slate-react'
import { 
  Bold, Italic, Underline, Code, Strikethrough, 
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  Link, Image, Video, Music, Table, AtSign, Undo, Redo, Code2
} from 'lucide-react'
import FileUploader from './FileUploader'
import ExportButton from './ExportButton'
import { isMarkActive, isBlockActive } from '../utils/utils'
import { toggleMark, toggleBlock, insertImageFile, insertVideoFile, insertAudioFile, insertTable, insertCodeBlock } from '../utils/editorActions'

// 工具栏组件
export const Toolbar = ({ onOpenLinkEditor, onOpenMentionEditor, isFixed }) => {
  const editor = useSlate()
  
  return (
    <div className={`toolbar ${isFixed ? 'fixed' : ''}`}>
      <div className="toolbar-group">
        <ToolbarButton
          active={isMarkActive(editor, 'bold')}
          onMouseDown={event => {
            event.preventDefault()
            toggleMark(editor, 'bold')
          }}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(editor, 'italic')}
          onMouseDown={event => {
            event.preventDefault()
            toggleMark(editor, 'italic')
          }}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(editor, 'underline')}
          onMouseDown={event => {
            event.preventDefault()
            toggleMark(editor, 'underline')
          }}
        >
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(editor, 'strikethrough')}
          onMouseDown={event => {
            event.preventDefault()
            toggleMark(editor, 'strikethrough')
          }}
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(editor, 'code')}
          onMouseDown={event => {
            event.preventDefault()
            toggleMark(editor, 'code')
          }}
        >
          <Code size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <ToolbarButton
          active={isBlockActive(editor, 'heading-one')}
          onMouseDown={event => {
            event.preventDefault()
            toggleBlock(editor, 'heading-one')
          }}
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'heading-two')}
          onMouseDown={event => {
            event.preventDefault()
            toggleBlock(editor, 'heading-two')
          }}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'heading-three')}
          onMouseDown={event => {
            event.preventDefault()
            toggleBlock(editor, 'heading-three')
          }}
        >
          <Heading3 size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <ToolbarButton
          active={isBlockActive(editor, 'bulleted-list')}
          onMouseDown={event => {
            event.preventDefault()
            toggleBlock(editor, 'bulleted-list')
          }}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'numbered-list')}
          onMouseDown={event => {
            event.preventDefault()
            toggleBlock(editor, 'numbered-list')
          }}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'block-quote')}
          onMouseDown={event => {
            event.preventDefault()
            toggleBlock(editor, 'block-quote')
          }}
        >
          <Quote size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <ToolbarButton
          onMouseDown={event => {
            event.preventDefault()
            onOpenLinkEditor()
          }}
        >
          <Link size={16} />
        </ToolbarButton>
        <FileUploader
          accept="image/*"
          onFileSelect={(dataUrl, file) => insertImageFile(editor, dataUrl, file)}
        >
          <Image size={16} />
        </FileUploader>
        <FileUploader
          accept="video/*"
          onFileSelect={(dataUrl, file) => insertVideoFile(editor, dataUrl, file)}
        >
          <Video size={16} />
        </FileUploader>
        <FileUploader
          accept="audio/*"
          onFileSelect={(dataUrl, file) => insertAudioFile(editor, dataUrl, file)}
        >
          <Music size={16} />
        </FileUploader>
        <ToolbarButton
          onMouseDown={event => {
            event.preventDefault()
            insertTable(editor)
          }}
        >
          <Table size={16} />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={event => {
            event.preventDefault()
            onOpenMentionEditor()
          }}
        >
          <AtSign size={16} />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={event => {
            event.preventDefault()
            insertCodeBlock(editor)
          }}
        >
          <Code2 size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <ToolbarButton
          onMouseDown={event => {
            event.preventDefault()
            editor.undo()
          }}
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={event => {
            event.preventDefault()
            editor.redo()
          }}
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      <ExportButton />
    </div>
  )
}

// 工具栏按钮组件
export const ToolbarButton = ({ active, children, ...props }) => (
  <button
    className={`toolbar-button ${active ? 'active' : ''}`}
    {...props}
  >
    {children}
  </button>
) 