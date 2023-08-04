import React, { useState } from 'react'
import { Scrollbar, Space, Button } from '@nature-rpa-utils/nature-ui'

import './index.less'

export default () => {
  const [list, setList] = useState([...new Array(3)])
  const addItem = () => {
    setList((state) => {
      state.push(undefined)
      return [...state]
    })
  }

  const deleteItem = () => {
    setList((state) => {
      state.pop()
      return [...state]
    })
  }
  return (
    <>
      <Space>
        <Button onClick={addItem}>添加Item</Button>
        <Button onClick={deleteItem}>删除Item</Button>
      </Space>
      <Scrollbar maxHeight="400px" native>
        {list.map((_, index) => (
          <p key={index} className="scrollbar-demo-item">
            {index + 1}
          </p>
        ))}
      </Scrollbar>
    </>
  )
}
