import { useState, useRef, useCallback, useMemo } from 'react'

export const useUpdate = () => {
  const [, sb] = useState(true)

  return () => {
    sb(v => !v)
  }
}

export const useDebounce = (cb: any, delay: number = 500) => {
  const debounceRef = useRef<{ timer: NodeJS.Timeout; cb: () => void }>({
    timer: null,
    cb
  })
  debounceRef.current.cb = cb

  return () => {
    if (debounceRef.current.timer) clearTimeout(debounceRef.current.timer)

    debounceRef.current.timer = setTimeout(() => {
      debounceRef.current.cb()
    }, delay)
  }
}

export const useLocalStorageState = <S>(initialValue: S, key: string) => {
  const [state, setState] = useState(
    localStorage[key] ? (JSON.parse(localStorage[key]).value as S) : initialValue
  )

  const updateCache = (value: S) => {
    localStorage[key] = JSON.stringify({ value })

    setState(value)
  }

  return [state, updateCache] as const
}

export const useStateRef = <S extends object>(initialValue: S) => {
  const [b, sb] = useState(false)
  const sr = useRef<S>(initialValue)
  const u = () => sb(!b)

  return [sr.current, u] as const
}

export const useEvent = <T extends (...args: any[]) => any>(func: T) => {
  const ref = useRef(func)
  ref.current = func

  return useCallback(
    (() => {
      ref.current()
    }) as T,
    []
  )
}
