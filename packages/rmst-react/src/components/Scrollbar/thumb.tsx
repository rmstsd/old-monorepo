import React, { forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import cs from 'classnames'

import { useMergeProps } from '@/utils/hooks'
import { ScrollbarContext } from './context'
import { ThumbProps } from './interface'
import { BAR_MAP, getPrefixCls, renderThumbStyle } from './utils'
import { throttle } from 'throttle-debounce'

const defaultProps: ThumbProps = {
  ratio: 10
}

function Thumb(baseProps: ThumbProps, ref) {
  const props = useMergeProps<ThumbProps>(baseProps, defaultProps)

  const scrollbar = useContext(ScrollbarContext)

  const [prefixCls, bem] = getPrefixCls('scrollbar-bar')
  const { vertical, size, move, ratio, always, handleScroll } = props

  const [visible, setVisible] = useState<boolean>(false)
  const barRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const thumbState = useRef<Partial<Record<'X' | 'Y', number>>>({})

  const bar = BAR_MAP[vertical ? 'vertical' : 'horizontal']

  const offsetRatio = useRef<number>(0)
  const cursorDown = useRef<boolean>(false)
  const cursorLeave = useRef<boolean>(false)
  const originalOnSelectStart = useRef<any>(null)

  const thumbStyle = renderThumbStyle({
    size,
    move,
    bar
  })

  const restoreOnselectstart = () => {
    if (document.onselectstart !== originalOnSelectStart.current) {
      document.onselectstart = originalOnSelectStart.current
    }
  }

  const mouseMoveDocumentHandler = (e: MouseEvent) => {
    if (!barRef.current || !thumbRef.current) return
    if (cursorDown.current === false) return

    const prevPage = thumbState.current[bar.axis]
    if (!prevPage) return

    const offset = (barRef.current.getBoundingClientRect()[bar.direction] - e[bar.client]) * -1
    const thumbClickPosition = thumbRef.current[bar.offset] - prevPage
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100 * offsetRatio.current) / barRef.current[bar.offset]

    let target = (thumbPositionPercentage * scrollbar.wrapElement.current[bar.scrollSize]) / 100

    if (target < 0) target = 0

    let maxY = scrollbar.wrapElement.current.scrollHeight - scrollbar.wrapElement.current.clientHeight
    if (target > maxY) target = maxY

    scrollbar.wrapElement.current[bar.scroll] = target
    handleScroll(target)

    // scrollbar.onSyncScroll?.({
    //   [bar.scroll]: e.clientY
    // })
  }

  const mouseUpDocumentHandler = (e: MouseEvent) => {
    document.body.style.setProperty('pointer-events', '')
    cursorDown.current = false
    thumbState.current[bar.axis] = 0
    document.removeEventListener('mousemove', mouseMoveDocumentHandler)
    document.removeEventListener('mouseup', mouseUpDocumentHandler)
    restoreOnselectstart()
    if (cursorLeave) {
      setVisible(false)
    }
  }

  const startDrag = (e: MouseEvent) => {
    e.stopPropagation()
    cursorDown.current = true
    document.addEventListener('mousemove', mouseMoveDocumentHandler)
    document.addEventListener('mouseup', mouseUpDocumentHandler)
    originalOnSelectStart.current = document.onselectstart
    document.onselectstart = () => false
  }

  const handlerClickThumb = e => {
    document.body.style.setProperty('pointer-events', 'none')
    e.stopPropagation()
    if (e.ctrlKey || [1, 2].includes(e.button)) {
      return
    }
    window.getSelection()?.removeAllRanges()
    startDrag(e)
    const el = e.currentTarget as HTMLDivElement
    if (!el) return
    thumbState.current[bar.axis] =
      el[bar.offset] - (e[bar.client] - el.getBoundingClientRect()[bar.direction])
  }

  const handlerClickTrack = e => {
    if (!thumbRef.current || !barRef.current || !scrollbar.wrapElement.current) return

    const offset = Math.abs((e.target as HTMLElement).getBoundingClientRect()[bar.direction] - e[bar.client])
    const thumbHalf = thumbRef.current[bar.offset] / 2
    const thumbPositionPercentage =
      ((offset - thumbHalf) * 100 * offsetRatio.current) / barRef.current[bar.offset]
    scrollbar.wrapElement.current[bar.scroll] =
      (thumbPositionPercentage * scrollbar.wrapElement.current[bar.scrollSize]) / 100
  }

  const mouseMoveScrollbarHandler = () => {
    cursorLeave.current = false
    setVisible(!!size)
  }

  const mouseLeaveScrollbarHandler = () => {
    cursorLeave.current = true
    setVisible(cursorDown.current)
  }

  useEffect(() => {
    return () => {
      restoreOnselectstart()
      document.removeEventListener('mouseup', mouseUpDocumentHandler)
    }
  }, [])

  useEffect(() => {
    if (barRef.current) {
      offsetRatio.current =
        barRef.current![bar.offset] ** 2 /
        scrollbar.wrapElement.current![bar.scrollSize] /
        ratio /
        thumbRef.current![bar.offset]
    }
  }, [barRef.current, size, ratio, bar])

  useEffect(() => {
    if (scrollbar.scrollbarElement.current) {
      scrollbar.scrollbarElement.current.addEventListener('mousemove', mouseMoveScrollbarHandler)
      scrollbar.scrollbarElement.current.addEventListener('mouseleave', mouseLeaveScrollbarHandler)
    }
    return () => {
      if (scrollbar.scrollbarElement.current) {
        scrollbar.scrollbarElement.current.removeEventListener('mousemove', mouseMoveScrollbarHandler)
        scrollbar.scrollbarElement.current.removeEventListener('mouseleave', mouseLeaveScrollbarHandler)
      }
    }
  }, [scrollbar.scrollbarElement.current, size])

  return (
    <div
      ref={barRef}
      className={cs(
        prefixCls,

        bem(bar.key),
        bem(always || visible ? 'active' : ''),
        bem(Number(size) === 0 ? 'hidden' : '')
      )}
      onMouseDown={handlerClickTrack}
    >
      <div ref={thumbRef} className={bem('thumb')} style={thumbStyle} onMouseDown={handlerClickThumb} />
    </div>
  )
}
const ThumbComponent = forwardRef<any, ThumbProps>(Thumb)

ThumbComponent.displayName = 'Thumb'

export default ThumbComponent
