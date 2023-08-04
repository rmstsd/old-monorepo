import classNames from 'classnames'
import React, { Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'

interface BaseProps {
  className: string
  [key: string]: unknown
}
type OrNull<T> = T | null

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className={
        ''
        //   cx(
        //   className,
        //   css`
        //     cursor: pointer;
        //     color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
        //   `
        // )
      }
    />
  )
)

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>
  ) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join('\n')
    return (
      <div ref={ref} {...props} style={{ margin: '30px -20px 0' }} className={classNames(className)}>
        <div
          style={{
            fontSize: 14,
            padding: '5px 20px',
            color: '#404040',
            borderTop: '2px solid #eeeeee',
            background: '#f8f8f8'
          }}
        >
          Slate's value as text
        </div>
        <div
          style={{ color: '#404040', font: '12px monospace', whiteSpace: 'pre-wrap', padding: '10px 20px' }}
        >
          {textLines}
        </div>
      </div>
    )
  }
)

export const Icon = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
    <span {...props} ref={ref} className={classNames('material-icons', className)} />
  )
)

export const Instruction = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div
      {...props}
      ref={ref}
      className={classNames(className, 'whitespace-pre-wrap m-[0 -20px 10px] p-[10px 20px] bg-gray-300')}
    />
  )
)

export const Menu = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div {...props} data-test-id="menu" ref={ref} className={classNames(className)} />
  )
)

export const Portal = ({ children }) => {
  return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null
}

export const Toolbar = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <Menu
      {...props}
      ref={ref}
      className={classNames(className, 'relative, p-[1px 18px 17px] m-[0 -20px] border mb-[20px]')}
    />
  )
)
