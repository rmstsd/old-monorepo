import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Item, { Slot } from './Item'
import Virtual from './virtual'
import classNames from 'classnames'
import CustomScrollbar, { CustomScrollbarRef } from '@root/custom-scrollbar'

const Event_Type = {
  Item: 'item_resize',
  Slot: 'slot_resize'
}

const Slot_Type = {
  Header: 'thead',
  Footer: 'tfoot'
}

const defaultProps = {
  keeps: 30,
  estimateSize: 20,
  direction: 'vertical',
  start: 0,
  offset: 0,
  topThreshold: 0,
  bottomThreshold: 0,
  pageMode: false
}

type VirtualListProps = {
  dataKey: string | ((dataSource: any) => string | number)
  dataSources: any[]
  dataComponent: (item: any) => React.ReactNode
  estimateSize?: number
  direction?: 'vertical' | 'horizontal'
  keeps?: number
  buffer?: number
  pageMode?: boolean
  className?: string
  style?: React.CSSProperties
  wrapStyle?: React.CSSProperties
  header?: React.ReactNode
  footer?: React.ReactNode
}

const VirtualList = (props: VirtualListProps) => {
  const combineProps = Object.assign({}, defaultProps, props)

  const {
    dataKey,
    dataSources,
    dataComponent,
    estimateSize,
    direction,
    keeps,
    buffer,
    pageMode,
    className,
    style,
    wrapStyle,
    header,
    footer
  } = combineProps

  const isHorizontal = direction === 'horizontal'
  const directionKey = isHorizontal ? 'scrollLeft' : 'scrollTop'

  const virtualRef = useRef<Virtual>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [range, setRange] = useState({} as Virtual['range'])

  const [syncScrollTop, setSyncScrollTop] = useState(0)
  const customScrollbarRef: CustomScrollbarRef = useRef(null)
  useLayoutEffect(() => {
    customScrollbarRef.current.scrollTo(syncScrollTop)
  }, [syncScrollTop])

  const onSyncScroll = (scrollTop: number) => {
    setSyncScrollTop(scrollTop)

    virtualRef.current.handleScroll(scrollTop)
  }

  useEffect(() => {
    installVirtual()
  }, [keeps])

  useEffect(() => {
    virtualRef.current.updateParam('uniqueIds', getUniqueIdFromDataSources())
    virtualRef.current.handleDataSourcesChange()
  }, [dataSources])

  const installVirtual = () => {
    const _buffer = buffer === undefined ? Math.round(keeps / 3) : buffer // recommend for a third of keeps

    virtualRef.current = new Virtual(
      {
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps,
        estimateSize,
        buffer: _buffer,
        uniqueIds: getUniqueIdFromDataSources()
      },
      range => {
        setRange(range)
      }
    )

    setRange(virtualRef.current.getRange())
  }

  const getUniqueIdFromDataSources = () => {
    const ids = dataSources.map(dataSource =>
      typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
    )

    return ids
  }

  const getOffset = () => {
    if (pageMode) {
      return document.documentElement[directionKey] || document.body[directionKey]
    } else {
      return rootRef.current ? Math.ceil(rootRef.current[directionKey]) : 0
    }
  }

  const getClientSize = () => {
    const key = isHorizontal ? 'clientWidth' : 'clientHeight'
    if (pageMode) {
      return document.documentElement[key] || document.body[key]
    } else {
      return rootRef.current ? Math.ceil(rootRef.current[key]) : 0
    }
  }

  const getScrollSize = () => {
    const key = isHorizontal ? 'scrollWidth' : 'scrollHeight'
    if (pageMode) {
      return document.documentElement[key] || document.body[key]
    } else {
      return rootRef.current ? Math.ceil(rootRef.current[key]) : 0
    }
  }

  const onScroll = () => {
    const offset = getOffset()

    virtualRef.current.handleScroll(offset)
  }

  const onItemSizeChange = (event, id, size) => {
    virtualRef.current.saveSize(id, size)
  }

  const universalProps = { horizontal: isHorizontal, onItemSizeChange }

  const getRenderSlots = () => {
    const slots = []
    const { start, end } = range

    for (let index = start; index <= end; index++) {
      const dataSourceItem = dataSources[index]

      if (dataSourceItem) {
        const uniqueKey = typeof dataKey === 'function' ? dataKey(dataSourceItem) : dataSourceItem[dataKey]

        if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
          const props = {
            index,
            event: Event_Type.Item,
            uniqueKey: uniqueKey,
            source: dataSourceItem,
            component: dataComponent
          }

          slots.push(<Item {...props} {...universalProps} key={uniqueKey} />)
        } else {
          console.warn(`Cannot get the data-key '${dataKey}' from data-sources.`)
        }
      } else {
        console.warn(`Cannot get the index '${index}' from data-sources.`)
      }
    }
    return slots
  }

  const { padFront, padBehind } = range
  const paddingStyle = {
    padding: isHorizontal ? `0px ${padBehind}px 0px ${padFront}px` : `${padFront}px 0px ${padBehind}px`
  }
  const wrapperStyle = wrapStyle ? Object.assign({}, wrapStyle, paddingStyle) : paddingStyle

  return (
    <CustomScrollbar
      ref={customScrollbarRef}
      className={classNames('v-n-list', className)}
      style={{ ...style, height: '100%' }}
      onSyncScroll={onSyncScroll}
    >
      {header && (
        <Slot {...universalProps} uniqueKey={Slot_Type.Header} event={Event_Type.Slot}>
          {header}
        </Slot>
      )}

      <div className="wrap" {...{ role: 'group' }} style={{ ...wrapperStyle }}>
        {getRenderSlots()}
      </div>

      {footer && (
        <Slot {...universalProps} uniqueKey={Slot_Type.Footer} event={Event_Type.Slot}>
          {footer}
        </Slot>
      )}
    </CustomScrollbar>
  )

  return (
    <div ref={rootRef} onScroll={onScroll} className={classNames('vue-n-list', className)} style={style}>
      {header && (
        <Slot {...universalProps} uniqueKey={Slot_Type.Header} event={Event_Type.Slot}>
          {header}
        </Slot>
      )}

      <div className="wrap" {...{ role: 'group' }} style={wrapperStyle}>
        {getRenderSlots()}
      </div>

      {footer && (
        <Slot {...universalProps} uniqueKey={Slot_Type.Footer} event={Event_Type.Slot}>
          {footer}
        </Slot>
      )}

      {/* <div ref={shepherdRef} style={{ width: isHorizontal ? '0px' : '100%', height: isHorizontal ? '100%' : '0px' }}></div> */}
    </div>
  )
}

export default VirtualList
