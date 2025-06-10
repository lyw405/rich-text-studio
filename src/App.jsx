import React from 'react'
import RichTextEditor from './components/RichTextEditor'
import './App.css'

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 应用错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="App">
          <header className="App-header">
            <h1>❌ 出现错误</h1>
            <p>RichText Studio 加载失败</p>
          </header>
          <main className="App-main">
            <div style={{ 
              background: '#fff', 
              padding: '20px', 
              borderRadius: '8px', 
              color: '#666',
              textAlign: 'center' 
            }}>
              <p>错误信息: {this.state.error?.message || '未知错误'}</p>
              <button 
                onClick={() => this.setState({ hasError: false, error: null })}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                重新加载
              </button>
            </div>
          </main>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>🎨 RichText Studio</h1>
          <p>专业级现代化富文本编辑器</p>
        </header>
        
        <main className="App-main">
          <RichTextEditor />
        </main>
        
        <footer className="App-footer">
          <p>✨ 支持丰富的文本样式、多媒体插入、表格、@提及等功能</p>
          <p>📱 现代化设计，响应式布局，专业级编辑体验</p>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App
