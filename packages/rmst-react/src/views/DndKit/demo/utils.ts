function flatten(items, parentId = null, depth = 0) {
  return items.reduce((acc, item, index) => {
    return [...acc, { ...item, parentId, depth, index }, ...flatten(item.children, item.id, depth + 1)]
  }, [])
}

export function flattenTree(items) {
  return flatten(items)
}

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice()
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0])

  return newArray
}

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

// previousItem: FlattenedItem
function getMaxDepth({ previousItem }) {
  if (previousItem) {
    return previousItem.depth + 1
  }
  return 0
}

function getMinDepth({ nextItem }) {
  if (nextItem) {
    return nextItem.depth
  }
  return 0
}

export function getProjection(
  items, //: FlattenedItem[],
  activeId, //: UniqueIdentifier,
  overId, //: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find(item => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItem = { id: 'root', children: [] }
  const nodes: Record<string, TreeItem> = { [root.id]: root }
  const items = flattenedItems.map(item => ({ ...item, children: [] }))

  for (const item of items) {
    const { id, children } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)

    nodes[id] = { id, children }
    parent.children.push(item)
  }

  return root.children
}

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId)
}

export function removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]) {
  const excludeParentIds = [...ids]

  return items.filter(item => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}
