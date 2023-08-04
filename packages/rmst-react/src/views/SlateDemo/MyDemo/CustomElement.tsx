import { useCallback, useEffect, useState } from 'react'
import { Editor, Element, Text, Transforms, createEditor } from 'slate'
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react'

import type { BaseEditor, Descendant } from 'slate'
import type { ReactEditor } from 'slate-react'

export const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

export const ImageElement = ({ attributes, children, element }) => {
  const { url } = element

  return (
    <span {...attributes}>
      <img src={url} alt={url} style={{ width: 100 }} />
      {children}
    </span>
  )
}

export const LinkElement = ({ attributes, children, element }) => {
  return (
    <span {...attributes} contentEditable={false}>
      <a href={element.url} target="_blank">
        {children}
      </a>
    </span>
  )
}

export const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

export const BlockquoteElement = (props: RenderElementProps) => {
  return <blockquote {...props.attributes}>{props.children}</blockquote>
}

export const H1Element = (props: RenderElementProps) => {
  return <h1 {...props.attributes}>{props.children}</h1>
}

export const Leaf = (props: RenderLeafProps) => {
  const style = Object.entries(props.leaf).reduce<React.CSSProperties>((acc, [keyItem, valueItem]) => {
    if (keyItem === 'bold' && valueItem === true) acc.fontWeight = 'bold'

    return acc
  }, {})

  return (
    <span {...props.attributes} style={style}>
      {props.children}
    </span>
  )
}
