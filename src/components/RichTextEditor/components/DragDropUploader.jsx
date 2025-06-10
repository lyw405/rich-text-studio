import React, { useState, useCallback } from 'react'
import { useSlate } from 'slate-react'
import { Transforms } from 'slate'

const DragDropUploader = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false)
  const editor = useSlate()

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target.result
        
        if (file.type.startsWith('image/')) {
          const image = {
            type: 'image',
            url: dataUrl,
            alt: file.name,
            children: [{ text: '' }],
          }
          Transforms.insertNodes(editor, image)
        } else if (file.type.startsWith('video/')) {
          const video = {
            type: 'video',
            url: dataUrl,
            title: file.name,
            children: [{ text: '' }],
          }
          Transforms.insertNodes(editor, video)
        } else if (file.type.startsWith('audio/')) {
          const audio = {
            type: 'audio',
            url: dataUrl,
            title: file.name,
            children: [{ text: '' }],
          }
          Transforms.insertNodes(editor, audio)
        }
      }
      reader.readAsDataURL(file)
    })
  }, [editor])

  return (
    <div
      className={`drag-drop-container ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            <p>松开鼠标上传文件</p>
            <small>支持图片、视频、音频文件</small>
          </div>
        </div>
      )}
    </div>
  )
}

export default DragDropUploader 