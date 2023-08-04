import { Menu, Button } from '@arco-design/web-react'
import React, { useEffect } from 'react'
import { Outlet, useLocation, useMatch, useNavigate, useNavigation } from 'react-router-dom'
import { routes } from '../App'

const LayoutView: React.FC = props => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display: 'flex' }}>
      <Menu
        style={{ width: 200, height: '100vh', overflow: 'auto', flexShrink: 0, position: 'sticky', top: 0 }}
        className="border-r-2"
        defaultOpenKeys={routes.map(item => item.path)}
        selectedKeys={[location.pathname.split('/')[2]]}
        onClickMenuItem={(key, evt, keyPath) => {
          navigate(keyPath.reverse().join('/'))
        }}
      >
        {routes
          .filter(item => !item.hidden)
          .map(item => (
            <Menu.SubMenu key={item.path} title={item.path}>
              {item.children?.map(ktem => (
                <Menu.Item key={ktem.path}>{ktem.path}</Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
      </Menu>

      <section style={{ padding: 10, flexGrow: 1 }}>{<Outlet />}</section>
    </div>
  )
}

export default LayoutView
