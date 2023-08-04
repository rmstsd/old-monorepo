import { createContext } from 'react'

export const ScrollbarContext = createContext<{
  scrollbarElement?: React.MutableRefObject<HTMLDivElement>
  wrapElement?: React.MutableRefObject<HTMLDivElement>
}>({})
