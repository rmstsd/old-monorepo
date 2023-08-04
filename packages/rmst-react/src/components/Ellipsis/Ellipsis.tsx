import { useEffect, useLayoutEffect, useRef } from 'react'

import './style.less'

const Ellipsis = props => {
  const ref = useRef<HTMLSpanElement>(null)

  const onMouseEnter = () => {
    console.log(ref.current.offsetHeight, ref.current.scrollHeight)
  }

  return (
    <span
      className={`t-ellipsis `}
      ref={ref}
      onMouseEnter={onMouseEnter}
      style={{ color: 'red', WebkitLineClamp: 2 }}
    >
      {props.children}
    </span>
  )
}

export default Ellipsis
