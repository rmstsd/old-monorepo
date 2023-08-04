import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import cs from 'classnames'
import { useSpring, animated, config, easings } from '@react-spring/web'

import { useResizeObserver, useMergeProps } from '@/utils/hooks'

import { ScrollbarContext } from './context'
import { ScrollbarProps, ScrollbarHandle, ScrollbarBarHandle } from './interface'
import { GAP, getPrefixCls } from './utils'
import Bar from './bar'

import './style/index.less'

const defaultProps: ScrollbarProps = {
  minSize: 20,
  tag: 'div'
}

const isObject = v => Object.prototype.toString.call(v) === '[object Object]'
const isNumber = v => typeof v === 'number'

function Scrollbar(baseProps: ScrollbarProps, ref) {
  const props = useMergeProps<ScrollbarProps>(baseProps, defaultProps)
  const {
    style,
    className,
    children,
    height,
    maxHeight,
    native,
    wrapStyle,
    wrapClass,
    viewStyle,
    viewClass,
    noresize,
    tag,
    always,
    minSize,
    onScroll,
    onSyncScroll,
    ...rest
  } = props

  const [prefixCls, bem] = getPrefixCls('scrollbar')

  const scrollbarRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<ScrollbarBarHandle>(null)

  const [sizeWidth, setSizeWidth] = useState<string>('0')
  const [sizeHeight, setSizeHeight] = useState<string>('0')
  const [ratioX, setRatioX] = useState<number>(1)
  const [ratioY, setRatioY] = useState<number>(1)

  const TagView = tag as 'div'

  const [springStyles, api] = useSpring(() => ({
    transform: `translateY(0px)`
  }))

  const handleScroll = () => {
    return
    if (wrapRef.current) {
      barRef.current?.handleScroll(wrapRef.current)
      onScroll?.({
        scrollTop: wrapRef.current.scrollTop,
        scrollLeft: wrapRef.current.scrollLeft
      })
    }
  }

  const scrollTo = (options: number | ScrollToOptions, yCoord?: number) => {
    if (isObject(options)) {
      wrapRef.current!.scrollTo(options)
    } else if (isNumber(options) && isNumber(yCoord)) {
      wrapRef.current!.scrollTo(options, yCoord)
    }
  }

  const setScrollTop = (scrollTop: number) => {
    if (!isNumber(scrollTop)) {
      return
    }
    wrapRef.current!.scrollTop = scrollTop
  }

  const setScrollLeft = (scrollLeft: number) => {
    if (!isNumber(scrollLeft)) {
      return
    }
    wrapRef.current!.scrollLeft = scrollLeft
  }

  const update = () => {
    if (!wrapRef.current) return
    const offsetHeight = wrapRef.current.offsetHeight - GAP
    const offsetWidth = wrapRef.current.offsetWidth - GAP

    const originalHeight = offsetHeight ** 2 / wrapRef.current.scrollHeight
    const originalWidth = offsetWidth ** 2 / wrapRef.current.scrollWidth
    const height = Math.max(originalHeight, props.minSize)
    const width = Math.max(originalWidth, props.minSize)
    setRatioY(originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height)) || 1)
    setRatioX(originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width)) || 1)
    const he = height + GAP < offsetHeight ? `${height}px` : ''
    setSizeHeight(he)
    setSizeWidth(width + GAP < offsetWidth ? `${width}px` : '')
  }

  useImperativeHandle<any, ScrollbarHandle>(ref, () => ({
    wrap: wrapRef,
    update,
    scrollTo,
    setScrollTop,
    setScrollLeft,
    handleScroll
  }))

  const { cor, dor, currentOr } = useResizeObserver(update)
  const { cor: wrapCor, dor: wrapDoc, currentOr: wraoCurrentOr } = useResizeObserver(update)

  useEffect(() => {
    if (!currentOr && !wraoCurrentOr) {
      update()
    }
  }, [currentOr, wraoCurrentOr])

  useEffect(() => {
    if (resizeRef.current) {
      cor(resizeRef.current)
    }
    if (wrapRef.current) {
      wrapCor(wrapRef.current)
    }
    return () => {
      dor()
      wrapDoc()
    }
  }, [noresize])

  useEffect(() => {
    if (!native) {
      setTimeout(() => {
        update()
        if (wrapRef.current) {
          barRef.current?.handleScroll(wrapRef.current)
        }
      }, 0)
    }
  }, [maxHeight, height, wrapRef.current])

  useEffect(() => {
    let timer

    let ref = { current: 0 }

    wrapRef.current.addEventListener('wheel', (evt: WheelEvent) => {
      evt.preventDefault()

      ref.current += evt.deltaY / 2

      if (ref.current < 0) ref.current = 0

      const max = resizeRef.current.offsetHeight - wrapRef.current.clientHeight
      if (ref.current > max) ref.current = max

      api.start({ transform: `translateY(${-ref.current}px)` })

      clearTimeout(timer)
      timer = setTimeout(() => {
        api.stop()
      }, 100)
    })
  }, [])

  return (
    <ScrollbarContext.Provider value={{ scrollbarElement: scrollbarRef, wrapElement: wrapRef, onSyncScroll }}>
      <div ref={scrollbarRef} style={style} className={cs(prefixCls, className)}>
        <div
          ref={wrapRef}
          style={{ ...wrapStyle, height, maxHeight }}
          className={cs(bem('wrap', { hidden: !native }), wrapClass)}
          onScroll={handleScroll}
        >
          <animated.div ref={resizeRef} className={cs('scrollbar-view', viewClass)} style={springStyles}>
            {children}
          </animated.div>
        </div>
        {!native && (
          <Bar
            ref={barRef}
            always
            height={sizeHeight}
            width={sizeWidth}
            ratioX={ratioX}
            ratioY={ratioY}
            wrapRef={wrapRef}
          />
        )}
      </div>
    </ScrollbarContext.Provider>
  )
}

const ScrollbarComponent = forwardRef<ScrollbarHandle, ScrollbarProps>(Scrollbar)

ScrollbarComponent.displayName = 'Scrollbar'

export default ScrollbarComponent
