import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable
} from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import classNames from 'classnames'
import { useState, useRef, useEffect } from 'react'
import SortableItem, { CommandItem, MainItemOverlap } from './SortableItem'
import { useUpdate } from '@/utils/hooks'
import { arrayMove } from '../demo/utils'
import { snapCenterToCursor } from '@dnd-kit/modifiers'

const genUniqueId = () => {
  return Date.now().toString(36)
}

type MainItem = { id: number | string; name: string; nid: number | string }

const Zero = () => {
  const [commandList, setCommandList] = useState([
    { id: 1, name: 'a' },
    { id: 2, name: 'b' }
  ])

  const [mainList, setMainList] = useState<MainItem[]>([
    // { id: 3, name: 'a', nid: 'lj9ypzi1' },
    // { id: 4, name: 'b', nid: 'lj9yq01k' },
    // { id: 5, name: 'c', nid: 'asdasfdgfg' },
    // { id: 6, name: 'd', nid: 'wseyghj' }
  ])

  const [rk, setRk] = useState(0)

  const [activeCommandId, setActiveCommandId] = useState(null)

  const activeCommandItem = (() => {
    if (activeCommandId) {
      const oItem = commandList.find(item => item.id === activeCommandId)
      return { ...oItem, nid: oItem.id }
    }

    return null
  })()

  const [activeMainNid, setActiveMainNid] = useState(null)
  const activeMainItem = activeMainNid ? mainList.find(item => item.nid === activeMainNid) : null

  const onDragStart = (evt: DragStartEvent) => {
    const { active } = evt

    if (active.data.current.type === 'command') {
      setActiveCommandId(active.id)
    } else {
      setActiveMainNid(active.id)
    }
  }

  const onDragOver = (evt: DragOverEvent) => {
    console.log(evt)
    const { active, over } = evt

    // 如果是拖拽左侧的 item over 时
    console.log(active.data.current.type)

    if (over?.id === 'container') {
      if (mainList.length) {
        return
      }
    }

    if (active.data.current.type === 'command' && activeCommandId) {
      if (evt.over) {
        const nvItem = { ...activeCommandItem }

        if (evt.over.id === 'container') {
          if (mainList.length === 0) {
            setMainList([nvItem])
            return
          }
        }

        const overIndex = mainList.findIndex(item => item.nid === over.id)

        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0
        const newIndex = overIndex >= 0 ? overIndex + modifier : mainList.length + 1

        const nvMainList = [
          ...mainList.slice(0, newIndex),
          nvItem,
          ...mainList.slice(newIndex, mainList.length)
        ]

        setMainList(nvMainList)
      } else {
        setMainList(mainList.filter(item => item.nid !== activeCommandItem.nid))
      }
    } else {
      console.log('over sort')
    }
  }

  const onDragEnd = (evt: DragEndEvent) => {
    resetState()

    const { active, over } = evt

    // 如果是拖拽左侧的 item 放下后
    if (activeCommandId) {
      if (evt.over) {
        const activeIndex = mainList.findIndex(item => item.nid === item.id)
        if (over.id === mainList[activeIndex].nid) {
          setMainList(getNewMainList())
          return
        }

        const _mainList = getNewMainList()
        const overIndex = _mainList.findIndex(item => item.nid === over.id)

        if (activeIndex !== overIndex) {
          setMainList(arrayMove(_mainList, activeIndex, overIndex))
        }

        function getNewMainList() {
          const _mainList = mainList.map(item =>
            item.nid === item.id ? { ...item, nid: genUniqueId() } : item
          )

          return _mainList
        }
      }
    } else {
      console.log('end sort')

      const activeIndex = mainList.findIndex(item => item.nid === active.id)
      const overIndex = mainList.findIndex(item => item.nid === over.id)

      if (activeIndex !== overIndex) {
        setMainList(arrayMove(mainList, activeIndex, overIndex))
      }
    }
  }

  const resetState = () => {
    setActiveMainNid(null)
    setActiveCommandId(null)
    setRk(rk + 1)
  }

  const upNid = () => {
    setMainList([{ ...activeCommandItem, nid: genUniqueId() }])
  }

  return (
    <>
      <button onClick={upNid}>up nid</button>

      <div className="flex gap-3 h-[600px]">
        <DndContext onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} autoScroll>
          <section className="border w-[140px]" key={rk}>
            {commandList.map(item => (
              <CommandItem key={item.id} id={item.id} item={item} />
            ))}
          </section>

          <SortableContext items={mainList.map(item => item.nid)}>
            <RightMain mainList={mainList} />
          </SortableContext>

          <DragOverlay dropAnimation={null} modifiers={activeMainItem ? [snapCenterToCursor] : undefined}>
            {activeCommandItem ? (
              <CommandItem id={activeCommandItem.id} item={activeCommandItem} isOver />
            ) : null}

            {activeMainItem ? <MainItemOverlap item={activeMainItem} isOver /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  )
}

const RightMain = props => {
  const { mainList } = props

  const { isOver, over, active, setNodeRef } = useDroppable({
    id: 'container',
    disabled: mainList.length > 0
  })

  return (
    <main className={classNames('border-2 flex-grow p-3', isOver && 'border-orange-400')} ref={setNodeRef}>
      {mainList.map(item => (
        <SortableItem key={item.nid} item={item} />
      ))}
    </main>
  )
}

export default Zero
