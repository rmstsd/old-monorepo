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
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { buildTree, flattenTree, getProjection, removeChildrenOf } from '../utils'
import MainSortableItem from './MainSortableItem'

const indentationWidth = 50

const RightMain = ({ activeId, activeItem, flattenedItems, sortedIds, projected }) => {
  const { isOver, active, over, setNodeRef } = useDroppable({ id: 'main' })

  console.log(over)

  const finalIsOver = isOver || over?.data.current.sortable

  return (
    <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
      <main
        ref={setNodeRef}
        className={classNames('flex-grow border-2 overflow-auto', finalIsOver && 'border-orange-400')}
      >
        {flattenedItems.map(item => (
          <MainSortableItem
            key={item.id}
            id={item.id}
            item={item}
            depth={item.id === activeId && projected ? projected.depth : item.depth}
            indentationWidth={indentationWidth}
          />
        ))}
      </main>
    </SortableContext>
  )
}

export default RightMain
