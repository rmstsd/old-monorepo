import { DndContext, useDroppable, useDraggable, closestCenter, DragOverlay } from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useState, forwardRef } from 'react'

const Base = () => {
  const [isOverlay, setIsOverlay] = useState(false)
  const [cards, setCards] = useState([])

  function handleDragEnd(event) {
    console.log(event)
    setIsOverlay(false)

    if (event.over && event.over.id === 'rmst-drop') {
      setCards([...cards, 0])
    }
  }

  function handleDragStart() {
    setIsOverlay(true)
  }

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={evt => {
        console.log('over', evt)
      }}
      onDragCancel={() => {
        setIsOverlay(false)
      }}
    >
      <Draggable>Drag me</Draggable>

      <Droppable>
        {cards.map((item, index) => (
          <div key={index}>{index}</div>
        ))}
      </Droppable>

      {/* <DragOverlay dropAnimation={null}>{isOverlay ? <Expression>Drag me</Expression> : null}</DragOverlay> */}
    </DndContext>
  )
}

export default Base

const Expression = forwardRef((props, ref) => {
  return (
    <button {...props} ref={ref} className="w-[140px] h-[30px] bg-white">
      {props.children}
    </button>
  )
}) as (props: any, ref: any) => React.ReactElement

function Draggable(props) {
  const { listeners, setNodeRef, transform } = useDraggable({ id: 'rmst-drag' })

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined

  return (
    <div ref={setNodeRef} className="border-2 p-3 inline-flex gap-1 bg-red-100" style={style}>
      <Expression {...props} {...listeners} />
    </div>
  )
}

function Droppable(props) {
  const { isOver, setNodeRef, active, rect, node, over } = useDroppable({ id: 'rmst-drop' })

  console.log('active', active)
  console.log('over', over)

  const style: React.CSSProperties = { border: isOver ? '2px solid green' : undefined }

  return (
    <div ref={setNodeRef} style={style} className="border-2 h-[400px] mt-[10px]">
      {props.children}
    </div>
  )
}
