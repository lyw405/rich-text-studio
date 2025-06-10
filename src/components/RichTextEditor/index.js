// 主组件导出
export { default } from './RichTextEditor'

// 可选：导出子组件（如果外部需要单独使用）
export { Toolbar } from './components/Toolbar'
export { Element, Leaf } from './components/ElementRenderer'

// 可选：导出工具函数（如果外部需要使用）
export { 
  toggleMark, 
  toggleBlock, 
  insertImageFile, 
  insertVideoFile, 
  insertAudioFile,
  insertTable,
  insertCodeBlock 
} from './utils/editorActions'

export { 
  isHotkey, 
  isBlockActive, 
  isMarkActive 
} from './utils/utils'

export { 
  getInitialValue, 
  isValidSlateValue, 
  normalizeSlateValue 
} from './utils/initialValue'

// 可选：导出常量
export { HOTKEYS, LIST_TYPES, TEXT_ALIGN_TYPES } from './constants/constants'

// 版本信息（便于调试）
export const version = '1.0.0'

// 开发环境下的调试信息
// console.log('🎨 RichTextEditor v1.0.0 loaded') 