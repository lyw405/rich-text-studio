import React, { useState, useEffect, useRef } from 'react'
import { AtSign, Check, X, User } from 'lucide-react'

// 模拟用户数据
const MOCK_USERS = [
  { id: '1', name: '张三', avatar: '👨‍💻', role: '开发者' },
  { id: '2', name: '李四', avatar: '👩‍🎨', role: '设计师' },
  { id: '3', name: '王五', avatar: '👨‍💼', role: '产品经理' },
  { id: '4', name: '赵六', avatar: '👩‍💻', role: '前端工程师' },
  { id: '5', name: '孙七', avatar: '👨‍🔬', role: '测试工程师' },
  { id: '6', name: '周八', avatar: '👩‍💼', role: 'UI设计师' },
  { id: '7', name: '吴九', avatar: '👨‍🏫', role: '架构师' },
  { id: '8', name: '郑十', avatar: '👩‍🔧', role: '运维工程师' },
]

const MentionEditor = ({ isOpen, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('')
      setFilteredUsers(MOCK_USERS)
      setSelectedIndex(0)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
      setSelectedIndex(0)
    } else {
      setFilteredUsers(MOCK_USERS)
      setSelectedIndex(0)
    }
  }, [searchTerm])

  const handleSelect = (user) => {
    onSave(user)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < filteredUsers.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredUsers.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredUsers[selectedIndex]) {
        handleSelect(filteredUsers[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="mention-editor-overlay">
      <div className="mention-editor">
        <div className="mention-editor-header">
          <AtSign size={16} />
          <span>提及用户</span>
        </div>
        
        <div className="mention-search">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索用户名或角色..."
            className="mention-input"
          />
        </div>

        <div className="mention-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className={`mention-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(user)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="mention-avatar">{user.avatar}</div>
                <div className="mention-info">
                  <div className="mention-name">{user.name}</div>
                  <div className="mention-role">{user.role}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="mention-empty">
              <User size={24} />
              <span>未找到用户</span>
            </div>
          )}
        </div>

        <div className="mention-editor-actions">
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

export default MentionEditor 