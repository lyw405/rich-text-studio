import React, { useEffect, useRef } from 'react'
import { 
  Plus, Minus, Trash2, ArrowUp, ArrowDown, 
  ArrowLeft, ArrowRight, Table 
} from 'lucide-react'
import {
  insertRowAbove,
  insertRowBelow,
  deleteCurrentRow,
  insertColumnLeft,
  insertColumnRight,
  deleteCurrentColumn,
  deleteTable
} from '../utils/tableUtils'

const TableContextMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  editor 
}) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleAction = (action) => {
    let success = false
    
    switch (action) {
      case 'insertRowAbove':
        success = insertRowAbove(editor)
        break
      case 'insertRowBelow':
        success = insertRowBelow(editor)
        break
      case 'deleteRow':
        success = deleteCurrentRow(editor)
        break
      case 'insertColumnLeft':
        success = insertColumnLeft(editor)
        break
      case 'insertColumnRight':
        success = insertColumnRight(editor)
        break
      case 'deleteColumn':
        success = deleteCurrentColumn(editor)
        break
      case 'deleteTable':
        if (window.confirm('确定要删除整个表格吗？')) {
          success = deleteTable(editor)
        }
        break
      default:
        break
    }

    if (success) {
      onClose()
    }
  }

  if (!isOpen) return null

  const menuStyle = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    zIndex: 1000,
  }

  return (
    <div 
      ref={menuRef}
      className="table-context-menu"
      style={menuStyle}
    >
      <div className="context-menu-section">
        <div className="context-menu-label">行操作</div>
        <button 
          className="context-menu-item"
          onClick={() => handleAction('insertRowAbove')}
        >
          <ArrowUp size={14} />
          在上方插入行
        </button>
        <button 
          className="context-menu-item"
          onClick={() => handleAction('insertRowBelow')}
        >
          <ArrowDown size={14} />
          在下方插入行
        </button>
        <button 
          className="context-menu-item delete"
          onClick={() => handleAction('deleteRow')}
        >
          <Minus size={14} />
          删除当前行
        </button>
      </div>

      <div className="context-menu-divider" />

      <div className="context-menu-section">
        <div className="context-menu-label">列操作</div>
        <button 
          className="context-menu-item"
          onClick={() => handleAction('insertColumnLeft')}
        >
          <ArrowLeft size={14} />
          在左侧插入列
        </button>
        <button 
          className="context-menu-item"
          onClick={() => handleAction('insertColumnRight')}
        >
          <ArrowRight size={14} />
          在右侧插入列
        </button>
        <button 
          className="context-menu-item delete"
          onClick={() => handleAction('deleteColumn')}
        >
          <Minus size={14} />
          删除当前列
        </button>
      </div>

      <div className="context-menu-divider" />

      <div className="context-menu-section">
        <button 
          className="context-menu-item delete"
          onClick={() => handleAction('deleteTable')}
        >
          <Trash2 size={14} />
          删除表格
        </button>
      </div>
    </div>
  )
}

export default TableContextMenu 