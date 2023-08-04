import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from '@arco-design/web-react'

import App from './App.tsx'

import '@arco-design/web-react/dist/css/arco.css'
import './app.less'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <ConfigProvider componentConfig={{ Button: { type: 'primary' } }}>
      <App />
    </ConfigProvider>
  </HashRouter>
)
