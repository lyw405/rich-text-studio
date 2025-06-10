import React, { useState, useEffect, useRef } from 'react'
import { Link, Check, X } from 'lucide-react'

const LinkEditor = ({ isOpen, onClose, onSave, initialUrl = '', initialText = '' }) => {
  const [url, setUrl] = useState(initialUrl)
  const [text, setText] = useState(initialText)
  const urlInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl)
      setText(initialText)
      setTimeout(() => {
        urlInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, initialUrl, initialText])

  const handleSave = () => {
    const trimmedUrl = url.trim()
    const trimmedText = text.trim()
    
    if (trimmedUrl) {
      console.log('保存链接:', { url: trimmedUrl, text: trimmedText || trimmedUrl })
      onSave({
        url: trimmedUrl,
        text: trimmedText || trimmedUrl
      })
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="link-editor-overlay">
      <div className="link-editor">
        <div className="link-editor-header">
          <Link size={16} />
          <span>添加链接</span>
        </div>
        
        <div className="link-editor-form">
          <div className="form-group">
            <label>链接地址</label>
            <input
              ref={urlInputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="link-input"
            />
          </div>
          
          <div className="form-group">
            <label>显示文字 (可选)</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="链接描述文字"
              className="link-input"
            />
          </div>
        </div>

        <div className="link-editor-actions">
          <button
            onClick={handleSave}
            className="action-button save-button"
            disabled={!url.trim()}
          >
            <Check size={14} />
            确定
          </button>
          <button
            onClick={onClose}
            className="action-button cancel-button"
          >
            <X size={14} />
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default LinkEditor 