import { useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import classNames from 'classnames'

export const CommandItem = props => {
  const { id, item, isOver } = props

  const { listeners, setNodeRef } = useDraggable({ id, data: { type: 'command' } })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={classNames('p-2 border-b', isOver && 'bg-white shadow-xl rounded-lg border')}
    >
      {item.name}
    </div>
  )
}

const SortableItem = props => {
  const { item } = props

  const { setNodeRef, listeners, transform, transition, isSorting, isDragging } = useSortable({
    id: item.nid,
    data: { item }
  })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={classNames('p-2 bg-pink-300 my-2', isDragging && 'opacity-60')}
      style={style}
    >
      {item.name}: id: {item.id} - nid: {item.nid}
    </div>
  )
}

export const MainItemOverlap = props => {
  const { item } = props

  return (
    <div className="inline-block p-3 border shadow-lg bg-pink-100 rounded-lg">
      {item.name} - {item.nid}
    </div>
  )
}

export default SortableItem
