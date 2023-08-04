import { useState } from 'react'
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const TestUn = () => {
  const [sources, setSources] = useState(['a', 'b'])
  const [list, setList] = useState([])

  const [activeId, setActiveId] = useState(null)
  const activeItem = activeId ? sources.find(item => item === activeId) : null

  const [rk, setRk] = useState(Date.now())

  return (
    <div>
      <DndContext
        onDragStart={evt => {
          console.log(evt.active)
          setActiveId(evt.active.id)
        }}
        onDragOver={evt => {
          if (evt.over) {
            setList([activeItem])
          }
        }}
        onDragEnd={evt => {
          if (evt.over) {
            setList([Date.now().toString(36)])

            setRk(Date.now())
          }

          setActiveId(null)
        }}
      >
        <div className="flex gap-3" key={rk}>
          {sources.map(item => (
            <DragItem item={item} key={item}></DragItem>
          ))}
        </div>

        <br />
        <br />

        <DropContainer list={list}></DropContainer>

        <DragOverlay dropAnimation={null}>
          {activeId ? <div className="p-2 border bg-white shadow-lg w-[100px]">drag</div> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default TestUn

const DragItem = props => {
  const { setNodeRef, listeners, transform } = useDraggable({ id: props.item })

  return (
    <div className="border w-[100px] h-[100px]" {...listeners} ref={setNodeRef}>
      {props.item}
    </div>
  )
}

const DropContainer = props => {
  const { setNodeRef } = useDroppable({ id: 'drop-container' })

  return (
    <div className="border-2 h-[400px]" ref={setNodeRef}>
      {props.list.map(item => (
        <DragItem key={item} item={item} />
      ))}
    </div>
  )
}
