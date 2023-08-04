import React, { useState, useRef, useEffect } from 'react'
import { Scrollbar, Slider, Space, Button } from '@nature-rpa-utils/nature-ui'

import './index.less'

const list = [...new Array(20)]

export default () => {
  const srcollbarRef = useRef(null)
  const innerRef = useRef(null)
  const [max, setMax] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const onScroll = ({ scrollTop }) => {
    setScrollTop(scrollTop)
  }

  const onChange = (value) => {
    // setScrollTop(value)
    srcollbarRef.current.setScrollTop(value)
  }

  useEffect(() => {
    if (innerRef.current) {
      setMax(innerRef.current.clientHeight - 380)
    }
  }, [innerRef.current])

  return (
    <>
      <Scrollbar ref={srcollbarRef} height="400px" always onScroll={onScroll}>
        <div ref={innerRef}>
          {list.map((_, index) => (
            <p key={index} className="scrollbar-demo-item">
              {index + 1}
            </p>
          ))}
        </div>
      </Scrollbar>
      <Slider value={scrollTop} max={max} onChange={onChange} />
    </>
  )
}
