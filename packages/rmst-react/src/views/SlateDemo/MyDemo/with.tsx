import { useCallback, useEffect, useState } from 'react'
import { Editor, Element as SlateElement, Range, Transforms, Node } from 'slate'
import { Slate, Editable, withReact, RenderElementProps, useSlate } from 'slate-react'

const isEmptyBlockMatch = (n: Node) => {
  return !Editor.isEditor(n) && SlateElement.isElement(n) && ['blockquote', 'h1'].includes(n.type)
}

export const widthBlockquote = (editor: Editor) => {
  const { deleteBackward, deleteForward, deleteFragment, insertFragment, insertBreak, insertNode } = editor

  editor.deleteForward = (...args) => {
    console.log('deleteForward', args)
    deleteForward(...args)
  }

  editor.deleteFragment = (...args) => {
    console.log('deleteFragment', args)
    deleteFragment(...args)
  }

  editor.insertFragment = (...args) => {
    console.log('insertFragment', args)
    insertFragment(...args)
  }

  editor.insertBreak = (...args) => {
    console.log('insertBreak', args)

    const [match] = Editor.nodes(editor, { match: isEmptyBlockMatch })
    const [element, path] = match

    // 如果是引用 实现语雀的效果
    if (SlateElement.isElement(element) && element.type === 'blockquote') {
    }

    // return
    insertBreak(...args)
  }

  editor.insertNode = (...args) => {
    console.log('insertNode', args)
    insertNode(...args)
  }

  editor.deleteBackward = (...args) => {
    console.log('deleteBackward', args)
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: isEmptyBlockMatch
      })

      if (match) {
        const [element, path] = match

        if (Editor.isEmpty(editor, element as SlateElement)) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph'
          }
          Transforms.setNodes(editor, newProperties, {
            match: isEmptyBlockMatch
          })
          return
        }

        // const start = Editor.start(editor, path)
        // if (Point.equals(selection.anchor, start)) {
        //   const newProperties: Partial<SlateElement> = {
        //     type: 'paragraph'
        //   }
        //   Transforms.setNodes(editor, newProperties, {
        //     match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'blockquote'
        //   })
        //   return
        // }
      }
    }

    deleteBackward(...args)
  }

  return editor
}
