import React from 'react'
import CodeBlock from './CodeBlock'

// 元素渲染组件
export const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    case 'link':
      return (
        <a 
          href={element.url} 
          style={style} 
          {...attributes} 
          className="editor-link"
          target="_blank"
          rel="noopener noreferrer"
          title={element.url}
        >
          {children}
        </a>
      )
    case 'image':
      return (
        <div {...attributes}>
          {children}
          <img src={element.url} alt={element.alt || ''} className="editor-image" />
        </div>
      )
    case 'video':
      return (
        <div {...attributes}>
          {children}
          <video controls className="editor-video">
            <source src={element.url} />
            您的浏览器不支持视频播放。
          </video>
        </div>
      )
    case 'audio':
      return (
        <div {...attributes}>
          {children}
          <audio controls className="editor-audio">
            <source src={element.url} />
            您的浏览器不支持音频播放。
          </audio>
        </div>
      )
    case 'table':
      return (
        <table {...attributes} className="editor-table">
          <tbody>{children}</tbody>
        </table>
      )
    case 'table-row':
      return (
        <tr {...attributes}>
          {children}
        </tr>
      )
    case 'table-cell':
      return (
        <td {...attributes} className="editor-table-cell">
          {children}
        </td>
      )
    case 'mention':
      return (
        <span {...attributes} className="editor-mention" title={`用户ID: ${element.userId || ''}`}>
          @{element.character}
        </span>
      )
    case 'code-block':
      return (
        <CodeBlock {...{ attributes, children, element }} />
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

// 叶子节点渲染组件
export const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code className="editor-inline-code">{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>
  }

  return <span {...attributes}>{children}</span>
} 