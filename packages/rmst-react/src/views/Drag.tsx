import { useEffect, useRef, useState } from 'react'

import classNames from 'classnames'
import { Button } from '@arco-design/web-react'

const Drag = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const domListRef = useRef<{ dom: HTMLDivElement; rect: DOMRect }[]>()

  useEffect(() => {
    const container = containerRef.current

    let dragDom: HTMLDivElement
    let dragDomRect: DOMRect

    let activeIndex: number
    let overIndex: number

    // 鼠标按下时
    container.addEventListener('mousedown', evt => {
      const target = evt.target as HTMLDivElement

      if (target.classList.contains('item')) {
        domListRef.current = ([...container.childNodes] as HTMLDivElement[]).map(item => ({
          dom: item,
          rect: item.getBoundingClientRect()
        }))

        dragDom = target
        dragDomRect = dragDom.getBoundingClientRect()

        domListRef.current.forEach(item => {
          item.dom.style.transition = 'all 0.3s ease-out'
        })

        document.addEventListener('mousemove', addCurrMove)
      }
    })

    // 松手时
    document.addEventListener('mouseup', evt => {
      document.removeEventListener('mousemove', addCurrMove)

      domListRef.current.forEach(item => {
        item.dom.style.translate = ''
        item.dom.style.transition = ''
      })

      activeIndex = undefined
      overIndex = undefined
    })

    function addCurrMove(evt: MouseEvent) {
      evt.preventDefault()
      const { clientX, clientY } = evt

      activeIndex = Number(dragDom.getAttribute('data-index'))

      for (let i = 0; i < domListRef.current.length; i++) {
        const targetRectItem = domListRef.current[i].rect

        if (clientY > targetRectItem.top && clientY < targetRectItem.bottom) {
          overIndex = i

          console.log('dragIndex: ', activeIndex, 'overIndex: ', overIndex)

          let startIndex: number
          let endIndex: number

          if (activeIndex < overIndex) {
            startIndex = activeIndex + 1
            endIndex = overIndex + 1
          } else {
            startIndex = overIndex
            endIndex = activeIndex
          }

          const dragDomTranslateY =
            activeIndex < overIndex
              ? targetRectItem.bottom - dragDomRect.bottom
              : targetRectItem.top - dragDomRect.top

          dragDom.style.translate = `0 ${dragDomTranslateY}px`

          if (startIndex === endIndex) {
            domListRef.current.forEach(item => {
              item.dom.style.translate = ``
            })

            return
          }

          console.log('触发 sort')

          const translateY = (() => {
            if (activeIndex < overIndex) return dragDomRect.top - domListRef.current[activeIndex + 1].rect.top
            else return dragDomRect.bottom - domListRef.current[activeIndex - 1].rect.bottom
          })()

          domListRef.current[overIndex].dom.style.translate = `0 ${translateY}px`

          const batchMoveItems = domListRef.current.slice(startIndex, endIndex)
          const needResetItems = domListRef.current.filter(
            o => !batchMoveItems.includes(o) && o.dom !== dragDom
          )
          needResetItems.forEach(item => {
            item.dom.style.translate = ``
          })
        }
      }
    }
  }, [])

  const [list, setList] = useState([0, 1, 2, 3, 4, 5, 6])

  const moveItem = () => {
    const moveList = domListRef.current //.slice(1, 4)
  }

  return (
    <div>
      {/* <Button onClick={moveItem}>0 - 5</Button> */}

      <div className={classNames('flex flex-col', 'border')} ref={containerRef}>
        {list.map((item, index) => (
          <div
            className={classNames('h-[50px] border bg-white', 'item')}
            data-index={index}
            key={item}
            style={{ height: 20 * (index + 1), marginTop: 10 * (index + 1) }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Drag

const data = [1, 2, 3, 4, 5]

const NativeDrag = () => {
  return (
    <div>
      {data.map(item => (
        <div
          draggable
          onDragOver={evt => {
            evt.preventDefault()
          }}
          onDragExit={() => {
            console.log('exit')
          }}
          onDragEnter={() => {
            console.log('enter')
          }}
          onDragLeave={() => {
            console.log('leave')
          }}
          onDragStart={() => {
            console.log('start')
          }}
          onDragEnd={() => {
            console.log('end')
          }}
          onDrag={() => {
            console.log('drag')
          }}
          onDrop={() => {
            console.log('drop')
          }}
          key={item}
          className="border my-2"
        >
          {item}
        </div>
      ))}
    </div>
  )
}

// export default NativeDrag
