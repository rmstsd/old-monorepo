import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useUpdate } from 'common/hooks'
import { lossFrame, sleep } from '@/utils/utils'

const data = Array.from({ length: 20 }, () => 1)

const Sector = () => {
  return (
    <>
      <button onClick={() => {}}>g</button>
    </>
  )
}

export default Sector

const Sector2 = () => {
  const up = useUpdate()

  useEffect(() => {
    setInterval(() => {
      up()
    }, 30)

    const container = document.querySelector('.cc') as HTMLDivElement

    let testTop = 0
    document.querySelector('button').onclick = () => {
      testSc()
    }

    function testSc() {
      testTop = testTop + 100
      container.scrollTo({ top: testTop })
    }

    const fo = lossFrame(container, () => {
      console.log(23)
    })

    container.onscroll = fo
  }, [])
  return (
    <>
      <button>ss</button>

      <div className="cc h-[600px] border overflow-auto">
        {Array.from({ length: 100 }).map((_, idx) => (
          <div key={idx}>{idx}</div>
        ))}
      </div>
    </>
  )
}

// export default Sector2
