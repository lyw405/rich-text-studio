import React, { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'

const CodeBlock = ({ attributes, children, element }) => {
  const codeRef = useRef(null)
  const language = element.language || 'javascript'

  useEffect(() => {
    if (codeRef.current) {
      try {
        Prism.highlightElement(codeRef.current)
      } catch (error) {
        console.warn('语法高亮失败:', error.message)
      }
    }
  }, [children, language])

  return (
    <div {...attributes} className="code-block-container">
      <div className="code-block-header">
        <span className="code-block-language">{language}</span>
        <button 
          className="code-block-copy"
          onClick={() => {
            const text = codeRef.current?.textContent || ''
            navigator.clipboard?.writeText(text)
          }}
        >
          复制
        </button>
      </div>
      <pre className="editor-code-block">
        <code
          ref={codeRef}
          className={`language-${language}`}
          spellCheck={false}
        >
          {children}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock 