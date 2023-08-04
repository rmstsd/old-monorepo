import React, { useState } from 'react'
import { Scrollbar, Button } from '@nature-rpa-utils/nature-ui'

import './index.less'

export default () => {
  const [list, setList] = useState([1, 2, 3])

  return (
    <div>
      <Button onClick={() => setList([...list, list.length + 1])} type="primary">
        增加
      </Button>
      <Button
        type="primary"
        onClick={() => {
          list.pop()
          setList([...list])
        }}
        style={{ marginLeft: 10 }}
      >
        减少
      </Button>

      <Scrollbar height={'100%'}>
        <div className="scrollbar-flex-content">
          {list.map((_, index) => (
            <p key={index} className="scrollbar-demo-item">
              {index + 1}
            </p>
          ))}
        </div>
      </Scrollbar>

      <Scrollbar height={200}>
        <div className="">
          {list.map((_, index) => (
            <p key={index} className="scrollbar-demo-item">
              {index + 1}
            </p>
          ))}
        </div>
      </Scrollbar>
    </div>
  )
}
