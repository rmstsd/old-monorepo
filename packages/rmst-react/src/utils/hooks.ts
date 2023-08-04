import { useRef, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { useMemo } from 'react'

export function useMergeProps<PropsType>(
  componentProps: PropsType,
  defaultProps: Partial<PropsType>,
  globalComponentConfig: Partial<PropsType> = {}
): PropsType {
  const _defaultProps = useMemo(() => {
    return { ...defaultProps, ...globalComponentConfig }
  }, [defaultProps, globalComponentConfig])

  const props = useMemo(() => {
    const mProps = { ...componentProps }

    // https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react/src/ReactElement.js#L312
    for (const propName in _defaultProps) {
      if (mProps[propName] === undefined) {
        mProps[propName] = _defaultProps[propName]
      } else if (
        mProps[propName] &&
        _defaultProps[propName] &&
        typeof mProps[propName] === 'object' &&
        typeof _defaultProps[propName] === 'object' &&
        !Array.isArray(mProps[propName]) &&
        !Array.isArray(_defaultProps[propName])
      ) {
        mProps[propName] = { ..._defaultProps[propName], ...mProps[propName] }
      }
    }

    return mProps
  }, [componentProps, _defaultProps])

  return props
}

export function useResizeObserver(onResize: (entry: ResizeObserverEntry[]) => void) {
  const resizeObserver = useRef<ResizeObserver>()

  const destroyObserver = () => {
    if (resizeObserver.current) {
      resizeObserver.current.disconnect()
      resizeObserver.current = null
    }
  }

  const createObserver = (elem: Element) => {
    if (elem) {
      if (resizeObserver.current) {
        destroyObserver()
      }
      resizeObserver.current = new ResizeObserver(onResize)
      resizeObserver.current.observe(elem)
    }
  }

  return {
    currentOr: resizeObserver.current,
    cor: createObserver,
    dor: destroyObserver
  }
}
