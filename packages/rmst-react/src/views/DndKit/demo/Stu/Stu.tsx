import { useMemo, useState } from 'react'
import classNames from 'classnames'

import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { buildTree, flattenTree, getProjection, removeChildrenOf } from '../utils'
import RightMain from './RightMain'
import MainSortableItem from './MainSortableItem'

let onlyKey = 456
function getOnlyKey() {
  return (++onlyKey).toString()
}

const normalCommandList = Array.from({ length: 6 }, () => {
  const id = getOnlyKey()
  return { id, type: 'normal', name: 'nor - ' + id }
})

const commandList = [
  ...normalCommandList,
  { id: 2, type: 'if-start', name: 'if 开始' },
  { id: 3, type: 'else-if', name: 'else-if' },
  { id: 4, type: 'else', name: 'else' },
  // { id: 5, type: 'if-end', name: 'if-end' },
  { id: 6, type: 'for-start', name: 'for 循环' },
  // { id: 7, type: 'for-end', name: 'for结束' },
  { id: 8, type: 'break', name: 'break' },
  { id: 9, type: 'continue', name: 'continue' }
]

const initialItems = [
  {
    id: 'Home',
    children: []
  },
  {
    id: 'Collections',
    children: [
      { id: 'Spring', children: [] },
      { id: 'Summer', children: [] },
      { id: 'Fall', children: [] },
      { id: 'Winter', children: [] }
    ]
  },
  {
    id: 'About Us',
    children: []
  },
  {
    id: 'My Account',
    children: [
      { id: 'Addresses', children: [] },
      { id: 'Order History', children: [] }
    ]
  }
]

const indentationWidth = 50

const Stu = () => {
  const [items, setItems] = useState([])

  const [isLeftCommand, setIsLeftCommand] = useState(true)

  const [activeId, setActiveId] = useState(null)
  const [overId, setOverId] = useState(null)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce(
      (acc, { children, collapsed, id }) => (collapsed && children.length ? [...acc, id] : acc),
      []
    )

    return removeChildrenOf(flattenedTree, activeId ? [activeId, ...collapsedItems] : collapsedItems)
  }, [activeId, items])

  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null
  const [offsetLeft, setOffsetLeft] = useState(0)

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems])

  const projected =
    activeId && overId && flattenedItems.length
      ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth)
      : null
  console.log(projected)
  function handleDragStart({ active }: DragStartEvent) {
    console.log(active)

    setActiveId(active.id)

    if (active.data.current.type === 'command') {
      setIsLeftCommand(true)
      return
    }

    setOverId(active.id)

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove({ delta, active }: DragMoveEvent) {
    if (active.data.current.type === 'command') {
      return
    }

    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over, active }: DragOverEvent) {
    if (active.data.current.type === 'command') {
      return
    }

    // setOverId(over?.id ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    console.log('end over', over)
    setActiveId(null)

    resetState()

    if (isLeftCommand && (over?.id === 'main' || over?.data.current.sortable)) {
      const activeItem = commandList.find(item => item.id === activeId)

      setItems([...items, { ...activeItem, id: getOnlyKey(), children: [] }])
      return
    }

    if (projected && over) {
      const { depth, parentId } = projected
      const clonedItems = JSON.parse(JSON.stringify(flattenTree(items)))
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const activeTreeItem = clonedItems[activeIndex]

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      setItems(newItems)
    }
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)
    setIsLeftCommand(false)

    document.body.style.setProperty('cursor', '')
  }

  function renderDragOverlay() {
    const overlayItem = (isLeftCommand ? commandList : flattenedItems).find(item => item.id === activeId)

    if (isLeftCommand) {
      return activeId ? <CommandItem item={overlayItem} overlay /> : null
    }

    return activeId && activeItem ? (
      <MainSortableItem id={activeItem.id} item={activeItem} overlay indentationWidth={indentationWidth} />
    ) : null
  }

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="sort-dnd flex gap-4">
        <section className="border-r w-[140px]">
          {commandList.map(item => (
            <CommandItem key={item.id} item={item} />
          ))}
        </section>

        <RightMain
          activeId={activeId}
          activeItem={activeItem}
          flattenedItems={flattenedItems}
          sortedIds={sortedIds}
          projected={projected}
        />
      </div>

      <DragOverlay dropAnimation={null}>{renderDragOverlay()}</DragOverlay>
    </DndContext>
  )
}

const CommandItem = props => {
  const { item, overlay } = props

  const { listeners, setNodeRef, transform } = useDraggable({ id: item.id, data: { type: 'command' } })

  // const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={classNames(
        'py-2 px-3 select-none hover:bg-slate-200',

        overlay && 'shadow-2xl border-2 border-purple-500'
      )}
    >
      {item.id} - {item.name}
    </div>
  )
}

export default Stu
