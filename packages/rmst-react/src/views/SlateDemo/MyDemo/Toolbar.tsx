import { useCallback, useEffect, useState } from 'react'
import { Editor, Element as SlateElement, Path, Range, Text, Transforms } from 'slate'
import { useSlate } from 'slate-react'

import type { BaseEditor, Descendant } from 'slate'
import type { ReactEditor } from 'slate-react'

import { Button } from '@arco-design/web-react'
import { CustomElementType } from '.'

const isMarkActive = (editor: Editor, format) => {
  const marks = Editor.marks(editor)
  const isEqualPath = editor.selection
    ? Path.equals(editor.selection.anchor.path, editor.selection.focus.path)
    : false

  return marks ? marks[format] === true && isEqualPath : false
}

const isBlockActive = (editor: Editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  console.log(Editor.range(editor, selection))

  const [match, path] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (!Editor.isEditor(n)) {
          console.log(n)
        }

        return !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
      }
    })
  )

  console.log(match, path)

  return !!match
}

const Toolbar = () => {
  const editor = useSlate()

  return (
    <div onMouseDown={event => event.preventDefault()} className="toolbar border-2 p-2 flex gap-2">
      <Button
        type={isMarkActive(editor, 'bold') ? 'primary' : 'default'}
        onClick={() => {
          const isBold = isMarkActive(editor, 'bold')

          if (isBold) {
            Editor.removeMark(editor, 'bold')
          } else {
            Editor.addMark(editor, 'bold', true)
          }

          return
          const isEqualPath = Path.equals(editor.selection.anchor.path, editor.selection.focus.path)
          const [match] = Editor.nodes(editor, {
            match: (n, path) => n.bold === true
          })

          let boldBool: boolean

          if (isBold) {
            if (isEqualPath) boldBool = false
            else boldBool = true
          } else {
            boldBool = true
          }

          if (boldBool) Editor.addMark(editor, 'bold', true)
          else Editor.removeMark(editor, 'bold')
        }}
      >
        粗体
      </Button>
      <Button
        type={isBlockActive(editor, 'blockquote') ? 'primary' : 'default'}
        onClick={() => {
          const newProperties = {
            type: (isBlockActive(editor, 'blockquote') ? 'paragraph' : 'blockquote') as CustomElementType
          }

          // Transforms.setNodes<SlateElement>(editor, newProperties)
        }}
      >
        引用
      </Button>
      <Button
        type={isBlockActive(editor, 'h1') ? 'primary' : 'default'}
        onClick={() => {
          const newProperties = {
            type: (isBlockActive(editor, 'h1') ? 'paragraph' : 'h1') as CustomElementType
          }

          Transforms.setNodes<SlateElement>(editor, newProperties)
        }}
      >
        标题1
      </Button>
      <Button>标题2</Button>
      <Button>链接</Button>
      <Button>行内代码</Button>
    </div>
  )
}

export default Toolbar
