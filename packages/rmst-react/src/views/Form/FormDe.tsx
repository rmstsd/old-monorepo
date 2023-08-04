import { Form, Input, Button, InputNumber, Tooltip } from '@arco-design/web-react'
import { memo, useEffect, useState, createContext, useContext } from 'react'
import { Schema } from 'b-validate'
import { useUpdate } from 'common/hooks'
import classNames from 'classnames'
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(set => ({
  bears: 0,
  increase: by => set(state => ({ bears: state.bears + by }))
}))

const data = Array.from({ length: 5 }, (_, index) => ({ id: index }))

const Context = createContext(undefined)

type State = {
  activeIndex: number
}

type Actions = {
  setActiveIndex: (index: number) => void
}

const useActiveStore = create<State & Actions>(set => ({
  activeIndex: 0,
  setActiveIndex: index => set({ activeIndex: index })
}))

function App() {
  console.log('p render')

  const store = useActiveStore()

  const up = useUpdate()

  return (
    <div className="border-2 p-2">
      <button
        onClick={() => {
          // setActiveIndex(2)
          // up()

          store.setActiveIndex(2)
        }}
      >
        set {store.activeIndex}
      </button>

      {data.map(item => (
        <Item key={item.id} item={item}></Item>
      ))}
    </div>
  )
}

const Item = ({ item }) => {
  // const activeIndex = useContext(Context)
  const activeIndex = useActiveStore(state => state.activeIndex)

  // console.log('item', item)
  console.log('store.activeIndex', activeIndex)

  return <div className={classNames(activeIndex === item.id ? 'bg-pink-200 h-[50px]' : '')}>{item.id}</div>
}

function arePropsEqual(oldProps, newProps) {
  // console.log('oldProps', oldProps)
  // console.log('newProps', newProps)

  if (newProps.activeIndex === newProps.item.id) {
    return false
  }

  if (oldProps.activeIndex === newProps.item.id) {
    return false
  }

  // 不render
  return true
}

export default App

class StringValidator {}

class Validator {
  constructor(rules: any) {
    this.rules = rules
    this.string = new StringValidator()
  }

  string: StringValidator

  rules = []

  validate(data, callbackError: (errors: any) => void) {
    for (const key of Object.keys(data)) {
      const rules = this.rules[key]

      for (const ruleItem of rules) {
        const { type = 'string' } = ruleItem
      }
    }
  }
}

const rules = {
  name: [
    { type: 'string', required: true, message: '必填字段' },
    { type: 'string', maxLength: 10, message: '最大长度是10' }
  ],
  age: [{ type: 'number', min: 2, max: 5, message: '在2和5之间' }]
}
const sc = new Validator(rules)

sc.validate({ name: 'aasdsd', age: 122 }, errors => {
  console.log(errors)
})
