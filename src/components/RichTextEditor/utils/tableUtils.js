import { Editor, Transforms, Path } from 'slate'

// 检查当前选择是否在表格单元格内
export const isInTableCell = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'table-cell',
    })

    return !!match
  } catch {
    return false
  }
}

// 在表格单元格内处理回车键
export const handleTableCellEnter = (editor, event) => {
  if (!isInTableCell(editor)) return false

  event.preventDefault()
  
  // 在单元格内插入一个简单的换行，而不是创建新行
  Transforms.insertText(editor, '\n')
  
  return true
}

// 处理表格内的Tab键导航
export const handleTableCellTab = (editor, event) => {
  if (!isInTableCell(editor)) return false

  event.preventDefault()
  
  try {
    const { selection } = editor
    if (!selection) return true

    // 获取当前单元格和表格
    const [cellNode, cellPath] = Editor.node(editor, selection, {
      match: n => n.type === 'table-cell',
    })
    
    const [tableNode, tablePath] = Editor.node(editor, selection, {
      match: n => n.type === 'table',
    })

    if (!cellNode || !tableNode) return true

    // 计算当前单元格在表格中的位置
    const rowPath = Path.parent(cellPath)
    const rowIndex = rowPath[rowPath.length - 1]
    const cellIndex = cellPath[cellPath.length - 1]
    
    let nextCellPath = null

    if (event.shiftKey) {
      // Shift+Tab: 移动到上一个单元格
      if (cellIndex > 0) {
        // 同一行的上一个单元格
        nextCellPath = [...rowPath, cellIndex - 1]
      } else if (rowIndex > 0) {
        // 上一行的最后一个单元格
        const prevRowPath = [...tablePath, 0, rowIndex - 1]
        const [prevRowNode] = Editor.node(editor, prevRowPath)
        nextCellPath = [...prevRowPath, prevRowNode.children.length - 1]
      }
    } else {
      // Tab: 移动到下一个单元格
      const [rowNode] = Editor.node(editor, rowPath)
      
      if (cellIndex < rowNode.children.length - 1) {
        // 同一行的下一个单元格
        nextCellPath = [...rowPath, cellIndex + 1]
      } else if (rowIndex < tableNode.children[0].children.length - 1) {
        // 下一行的第一个单元格
        nextCellPath = [...tablePath, 0, rowIndex + 1, 0]
      }
    }

    if (nextCellPath) {
      // 移动到目标单元格
      const targetCellEnd = Editor.end(editor, nextCellPath)
      Transforms.select(editor, targetCellEnd)
    }

    return true
  } catch (error) {
    console.warn('表格导航出错:', error)
    return true
  }
}

// 获取当前表格单元格信息
export const getCurrentTableCell = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return null

    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'table-cell',
    })

    return match || null
  } catch {
    return null
  }
}

// 获取当前表格信息
export const getCurrentTable = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return null

    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'table',
    })

    return match || null
  } catch {
    return null
  }
}

// 在当前行前插入一行
export const insertRowAbove = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [cellNode, cellPath] = Editor.node(editor, selection, {
      match: n => n.type === 'table-cell',
    })

    if (!cellNode) return false

    const rowPath = Path.parent(cellPath)
    const [rowNode] = Editor.node(editor, rowPath)
    
    // 创建新行，列数与当前行相同
    const newRow = {
      type: 'table-row',
      children: rowNode.children.map(() => ({
        type: 'table-cell',
        children: [{ text: '' }]
      }))
    }

    Transforms.insertNodes(editor, newRow, { at: rowPath })
    return true
  } catch (error) {
    console.error('插入行失败:', error)
    return false
  }
}

// 在当前行后插入一行
export const insertRowBelow = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [cellNode, cellPath] = Editor.node(editor, selection, {
      match: n => n.type === 'table-cell',
    })

    if (!cellNode) return false

    const rowPath = Path.parent(cellPath)
    const [rowNode] = Editor.node(editor, rowPath)
    const nextRowPath = Path.next(rowPath)
    
    // 创建新行，列数与当前行相同
    const newRow = {
      type: 'table-row',
      children: rowNode.children.map(() => ({
        type: 'table-cell',
        children: [{ text: '' }]
      }))
    }

    Transforms.insertNodes(editor, newRow, { at: nextRowPath })
    return true
  } catch (error) {
    console.error('插入行失败:', error)
    return false
  }
}

// 删除当前行
export const deleteCurrentRow = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [cellNode, cellPath] = Editor.node(editor, selection, {
      match: n => n.type === 'table-cell',
    })

    if (!cellNode) return false

    const rowPath = Path.parent(cellPath)
    const tbodyPath = Path.parent(rowPath)
    const [tbodyNode] = Editor.node(editor, tbodyPath)
    
    // 确保表格至少保留一行
    if (tbodyNode.children.length <= 1) {
      console.warn('表格至少需要保留一行')
      return false
    }

    Transforms.removeNodes(editor, { at: rowPath })
    return true
  } catch (error) {
    console.error('删除行失败:', error)
    return false
  }
}

// 在当前列前插入一列
export const insertColumnLeft = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [cellNode, cellPath] = Editor.node(editor, selection, {
      match: n => n.type === 'table-cell',
    })

    if (!cellNode) return false

    const cellIndex = cellPath[cellPath.length - 1]
    const rowPath = Path.parent(cellPath)
    const tbodyPath = Path.parent(rowPath)
    const [tbodyNode] = Editor.node(editor, tbodyPath)

    // 为每一行在指定位置插入新单元格
    tbodyNode.children.forEach((_, rowIndex) => {
      const targetRowPath = [...tbodyPath, rowIndex]
      const newCell = {
        type: 'table-cell',
        children: [{ text: '' }]
      }
      
      Transforms.insertNodes(editor, newCell, { 
        at: [...targetRowPath, cellIndex] 
      })
    })

    return true
  } catch (error) {
    console.error('插入列失败:', error)
    return false
  }
}

// 在当前列后插入一列
export const insertColumnRight = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [cellNode, cellPath] = Editor.node(editor, selection, {
      match: n => n.type === 'table-cell',
    })

    if (!cellNode) return false

    const cellIndex = cellPath[cellPath.length - 1] + 1
    const rowPath = Path.parent(cellPath)
    const tbodyPath = Path.parent(rowPath)
    const [tbodyNode] = Editor.node(editor, tbodyPath)

    // 为每一行在指定位置插入新单元格
    tbodyNode.children.forEach((_, rowIndex) => {
      const targetRowPath = [...tbodyPath, rowIndex]
      const newCell = {
        type: 'table-cell',
        children: [{ text: '' }]
      }
      
      Transforms.insertNodes(editor, newCell, { 
        at: [...targetRowPath, cellIndex] 
      })
    })

    return true
  } catch (error) {
    console.error('插入列失败:', error)
    return false
  }
}

// 删除当前列
export const deleteCurrentColumn = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [cellNode, cellPath] = Editor.node(editor, selection, {
      match: n => n.type === 'table-cell',
    })

    if (!cellNode) return false

    const cellIndex = cellPath[cellPath.length - 1]
    const rowPath = Path.parent(cellPath)
    const tbodyPath = Path.parent(rowPath)
    const [tbodyNode] = Editor.node(editor, tbodyPath)

    // 确保表格至少保留一列
    if (tbodyNode.children.length > 0 && tbodyNode.children[0].children.length <= 1) {
      console.warn('表格至少需要保留一列')
      return false
    }

    // 从每一行中删除指定位置的单元格（从后往前删除以避免路径偏移）
    for (let rowIndex = tbodyNode.children.length - 1; rowIndex >= 0; rowIndex--) {
      const targetCellPath = [...tbodyPath, rowIndex, cellIndex]
      Transforms.removeNodes(editor, { at: targetCellPath })
    }

    return true
  } catch (error) {
    console.error('删除列失败:', error)
    return false
  }
}

// 删除整个表格
export const deleteTable = (editor) => {
  try {
    const { selection } = editor
    if (!selection) return false

    const [tableNode, tablePath] = Editor.node(editor, selection, {
      match: n => n.type === 'table',
    })

    if (!tableNode) return false

    Transforms.removeNodes(editor, { at: tablePath })
    return true
  } catch (error) {
    console.error('删除表格失败:', error)
    return false
  }
} 