import { useEffect, useRef, useState } from 'react'

import { useSpring, animated } from '@react-spring/web'

export default function Spring() {
  const [top, setTop] = useState(0)

  const ref = useRef(top)

  const [springStyles, api] = useSpring(() => ({
    transform: `translateY(${-top}px)`
  }))

  useEffect(() => {
    let timer

    const dom = document.querySelector('#c')

    dom.addEventListener('wheel', (evt: WheelEvent) => {
      evt.preventDefault()

      ref.current += evt.deltaY / 2
      api.start({ transform: `translateY(${-ref.current}px)` })

      clearTimeout(timer)
      timer = setTimeout(() => {
        api.stop()
      }, 200)
    })
  }, [])

  return (
    <div>
      <div id="c" className="border" style={{ height: 400, overflow: 'hidden' }}>
        <animated.div style={{ ...springStyles }}>
          {Array(100)
            .fill(0)
            .map((_, i) => (
              <div key={i} style={{ height: 40 }}>
                {i}
              </div>
            ))}
        </animated.div>
      </div>
    </div>
  )
}
