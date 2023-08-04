import { useCallback, useEffect, useState } from 'react'
import { Editor, Element, Path, Range, Text, Transforms, createEditor } from 'slate'
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react'

import type { BaseEditor, Descendant } from 'slate'
import type { ReactEditor } from 'slate-react'
import {
  BlockquoteElement,
  CodeElement,
  DefaultElement,
  H1Element,
  ImageElement,
  Leaf,
  LinkElement
} from './CustomElement'

import Toolbar from './Toolbar'
import { widthBlockquote } from './with'

export type CustomElementType = 'paragraph' | 'image' | 'link' | 'code' | 'blockquote' | 'h1'
type CustomElement = { type: CustomElementType; children: CustomText[]; url?: string }
type CustomText = { text: string; bold?: boolean }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    // children: [{ text: 'Hello, ' }, { text: 'world', bold: true }, { text: ' 哈哈哈' }]
    children: [{ text: '李白手动滑稽而已开个会借记卡户籍卡合计' }]
  },
  {
    type: 'blockquote',
    children: [{ text: '用途与' }]
  },
  {
    type: 'blockquote',
    children: [{ text: '而一体金刚护法好好干' }]
  }
  // {
  //   type: 'image',
  //   url: 'https://rmst.site/assets/b.ad6c04af.jpeg',
  //   children: [{ text: '' }]
  // },
  // {
  //   type: 'link',
  //   url: 'https://example.com',
  //   children: [{ text: '百度' }]
  // },
  // {
  //   type: 'link',
  //   url: 'https://example.com',
  //   children: [{ text: ' 百度2' }]
  // }
]

const MyDemo = () => {
  const [editor] = useState(() => widthBlockquote(withReact(createEditor())))

  useEffect(() => {}, [])

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'image':
        return <ImageElement {...props} />
      case 'link':
        return <LinkElement {...props} />
      case 'blockquote':
        return <BlockquoteElement {...props} />
      case 'h1':
        return <H1Element {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <Slate editor={editor} value={initialValue}>
      <Toolbar />

      <Editable renderElement={renderElement} renderLeaf={Leaf} className="rich-container border-2 p-2" />
    </Slate>
  )
}

export default MyDemo
