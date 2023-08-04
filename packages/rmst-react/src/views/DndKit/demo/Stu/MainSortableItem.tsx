import { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'

import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  useDraggable,
  useDroppable
} from '@dnd-kit/core'
import {
  AnimateLayoutChanges,
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { buildTree, flattenTree, getProjection, removeChildrenOf } from '../utils'

type MainSortableItemProps = {
  item: any
  id: any
  overlay?: boolean
  indentationWidth: number
  depth?: number
}
const MainSortableItem = (props: MainSortableItemProps) => {
  const { item, overlay, indentationWidth, depth = 0 } = props

  const {
    isDragging,
    isSorting,
    listeners,
    setNodeRef,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  const marginLeft = indentationWidth * depth

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        'my-2 border-2 p-3 border-gray-400 bg-pink-50',
        isDragging && 'bg-pink-300',
        overlay && 'shadow-xl bg-white w-[200px]'
      )}
      {...listeners}
      style={{ ...style, marginLeft }}
    >
      id: {item.id} - {item.name}
    </div>
  )
}

export default MainSortableItem
