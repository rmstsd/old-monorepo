import { useState, useRef } from 'react'
import { DndContext, DragOverlay, MeasuringStrategy, useDroppable, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'

import { useImmer } from 'use-immer'

function getData(prop: any) {
  return prop?.data?.current ?? {}
}

function createSpacer({ id }: never | any) {
  return {
    id,
    type: 'spacer',
    title: 'Place Field Here'
  }
}

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always
  }
}

function CopyItem({ exercises }: any) {
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(Date.now())

  const spacerInsertedRef = useRef<null | undefined | {}>()
  const currentDragFieldRef = useRef<null | undefined | {}>()
  const [activeSidebarField, setActiveSidebarField] = useState<any>() // only for fields from the sidebar
  const [activeField, setActiveField] = useState<any>() // only for fields that are in the form.
  const [data, updateData] = useImmer({ fields: [] })

  console.log(data)

  const cleanUp = () => {
    setActiveSidebarField(null)
    setActiveField(null)
    currentDragFieldRef.current = null
    spacerInsertedRef.current = false
  }

  const handleDragStart = (e: any) => {
    const { active } = e
    const activeData = getData(active)

    // This is where the cloning starts. We set up a ref to the field we're dragging from the sidebar so that we can finish the clone in the onDragEnd handler.
    if (activeData.fromSidebar) {
      const { field } = activeData
      const { type } = field
      setActiveSidebarField(field)

      // Create a new field that'll be added to the fields array if we drag it over the canvas.
      currentDragFieldRef.current = {
        id: active.id,
        type,
        name: `${type}${fields.length + 1}`,
        parent: null
      }
      return
    }

    // We aren't creating a new element so go ahead and just insert the spacer
    // since this field already belongs to the canvas.
    const { field, index } = activeData

    setActiveField(field)
    currentDragFieldRef.current = field
    updateData(draft => {
      draft.fields.splice(index, 1, createSpacer({ id: active.id }))
    })
  }

  const handleDragOver = e => {
    const { active, over } = e
    const activeData = getData(active)

    // Once we detect that a sidebar field is being moved over the canvas
    // we create the spacer using the sidebar fields id with a spacer suffix and add into the
    // fields array so that it'll be rendered on the canvas.

    // 🐑 CLONING 🐑
    // This is where the clone occurs. We're taking the id that was assigned to
    // sidebar field and reusing it for the spacer that we insert to the canvas.
    console.log('active', active)
    console.log('over', over)

    if (activeData.fromSidebar) {
      const overData = getData(over)

      if (!spacerInsertedRef.current) {
        const spacer: any | never = createSpacer({
          id: active.id + '-spacer'
        })

        updateData(draft => {
          if (!draft.fields.length) {
            draft.fields.push(spacer)
          } else {
            const nextIndex = overData.index > -1 ? overData.index : draft.fields.length

            draft.fields.splice(nextIndex, 0, spacer)
          }
          spacerInsertedRef.current = true
        })
      } else if (!over) {
        // This solves the issue where you could have a spacer handing out in the canvas if you drug
        // a sidebar item on and then off
        updateData(draft => {
          draft.fields = draft.fields.filter(f => f.type !== 'spacer')
        })
        spacerInsertedRef.current = false
      } else {
        // Since we're still technically dragging the sidebar draggable and not one of the sortable draggables
        // we need to make sure we're updating the spacer position to reflect where our drop will occur.
        // We find the spacer and then swap it with the over skipping the op if the two indexes are the same
        updateData(draft => {
          const spacerIndex = draft.fields.findIndex(f => f.id === active.id + '-spacer')

          const nextIndex = overData.index > -1 ? overData.index : draft.fields.length - 1

          if (nextIndex === spacerIndex) {
            return
          }

          draft.fields = arrayMove(draft.fields, spacerIndex, overData.index)
        })
      }
    }
  }

  const handleDragEnd = e => {
    const { over } = e

    // We dropped outside of the over so clean up so we can start fresh.
    if (!over) {
      cleanUp()
      updateData(draft => {
        draft.fields = draft.fields.filter(f => f.type !== 'spacer')
      })
      return
    }

    // This is where we commit the clone.
    // We take the field from the this ref and replace the spacer we inserted.
    // Since the ref just holds a reference to a field that the context is aware of
    // we just swap out the spacer with the referenced field.
    let nextField = currentDragFieldRef.current

    if (nextField) {
      const overData = getData(over)

      updateData(draft => {
        const spacerIndex = draft.fields.findIndex(f => f.type === 'spacer')
        draft.fields.splice(spacerIndex, 1, nextField)

        draft.fields = arrayMove(draft.fields, spacerIndex, overData.index || 0)
      })
    }

    setSidebarFieldsRegenKey(Date.now())
    cleanUp()
  }

  const { fields } = data

  return (
    <div className="bg-gray-50">
      <div className="flex">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          measuring={measuringConfig}
          autoScroll
        >
          <Sidebar
            fieldsRegKey={sidebarFieldsRegenKey}
            fields={[
              { id: 1, type: 'input', title: 'Text Input' },
              { id: 2, type: 'text', title: 'Text' }
              // { id: 3, type: 'button', title: 'Button' }
            ]}
          />

          <div className="bg-gray-50 flex-grow p-4 pl-12">
            <div className="min-h-full w-full">
              <SortableContext strategy={rectSortingStrategy} items={fields.map(f => f.id)}>
                <Canvas fields={fields} />
              </SortableContext>
            </div>
          </div>

          <DragOverlay>
            {activeSidebarField ? <SidebarField overlay field={activeSidebarField} /> : null}
            {activeField ? <Field overlay field={activeField} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default CopyItem

export function getRenderer(type) {
  if (type === 'spacer') {
    return () => (
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-gray-200 border-2 opacity-20"></div>
    )
  }

  return renderers[type] || (() => <div className="bg-gray-200">No renderer found for {type}</div>)
}

function Field(props) {
  const { field, overlay, ...rest } = props
  const { type } = field

  const Component = getRenderer(type)

  return (
    <div className={`${overlay ? 'cursor-grabbing bg-blue-50' : 'cursor-grab bg-white'} relative w-64 h-64`}>
      <Component {...rest} />
    </div>
  )
}

function SortableField(props) {
  const { id, index, field } = props

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      index,
      id,
      field
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-64 h-64 flex items-center justify-center"
    >
      <Field field={field} />
    </div>
  )
}

function Canvas(props) {
  const { fields } = props

  const { listeners, setNodeRef, transform, transition } = useDroppable({
    id: 'canvas_droppable',
    data: {
      parent: null,
      isContainer: true
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      className="relative bg-gray-100 min-h-screen w-full p-4"
      style={style}
      {...listeners}
    >
      <div className="flex flex-wrap gap-4">
        {fields?.map((f, i) => (
          <SortableField key={f.id} id={f.id} field={f} index={i} />
        ))}
      </div>
    </div>
  )
}

function SidebarField(props) {
  const { field, overlay } = props
  const { title } = field

  return (
    <div className={`${overlay ? 'bg-blue-50 cursor-grabbing' : 'bg-white cursor-grab'} rounded h-60 w-60`}>
      {title}
    </div>
  )
}

let onlyId = 10056
function DraggableSidebarField(props) {
  const { field, ...rest } = props

  const id = useRef(++onlyId)

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id.current,
    data: {
      field,
      fromSidebar: true
    }
  })

  return (
    <div
      ref={setNodeRef}
      className="w-64 h-64 border-gray-200 flex items-center justify-center"
      {...listeners}
      {...attributes}
    >
      <SidebarField field={field} {...rest} />
    </div>
  )
}

function Sidebar(props) {
  const { fieldsRegKey, fields } = props

  return (
    <div key={fieldsRegKey}>
      {fields.map(f => (
        <DraggableSidebarField key={f.type} field={f} />
      ))}
    </div>
  )
}

export const renderers = {
  input: () => <div>I am Input</div>,
  textarea: () => <div>TextArea</div>,
  select: () => (
    <select>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  ),
  text: () => <div>I am Text</div>,
  button: () => <div>I am Button</div>
}
