import React, { useState } from 'react'
import { Scrollbar } from '@nature-rpa-utils/nature-ui'

import './index.less'

const list = [...new Array(10)]

export default () => {
  return (
    <div style={{ height: 200 }}>
      <Scrollbar height={200}>
        {list.map((_, index) => (
          <p key={index} className="scrollbar-demo-item">
            {index + 1}
          </p>
        ))}
      </Scrollbar>
    </div>
  )
}
