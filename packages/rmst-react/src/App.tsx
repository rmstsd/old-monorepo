import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import LayoutView from './layout/Layout'

import Drag from './views/Drag'
import DndKit from './views/DndKit/IndexDndKit'
import Sector from './views/Sector'

import FormDe from './views/Form/FormDe'
import Misc from './views/Misc'
import SlateDemo from './views/SlateDemo'
import Dm from './views/Dm/Dm'
import Spring from './views/Spring'

type IRouteObject = RouteObject & { hidden?: boolean }

export const routes: IRouteObject[] = [
  { path: '/', element: <Navigate to="/ui-component/dndKit" />, hidden: true },
  { path: '/ui-component', element: <Navigate to="/ui-component/dndKit" />, hidden: true },
  {
    path: '/ui-component',
    element: <LayoutView />,
    children: [
      { path: 'drag', element: <Drag /> },
      { path: 'dndKit', element: <DndKit /> }
    ]
  },
  {
    path: '/sector',
    element: <LayoutView />,
    children: [
      { path: 'sector', element: <Sector /> },
      { path: 'Misc', element: <Misc /> },
      { path: 'dm', element: <Dm /> },
      { path: 'spring', element: <Spring /> }
    ]
  },
  {
    path: '/form',
    element: <LayoutView />,
    children: [{ path: 'formDe', element: <FormDe /> }]
  },
  {
    path: '/slate',
    element: <LayoutView />,
    children: [{ path: 'slate', element: <SlateDemo /> }]
  },
  {
    path: '*',
    element: <Navigate to="/" />,
    hidden: true
  }
]

const App: React.FC = () => {
  const element = useRoutes(routes)

  return element
}

export default App
