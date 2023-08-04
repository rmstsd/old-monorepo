import React, { ReactNode, CSSProperties } from 'react'

export interface ScrollbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onScroll' | 'className'> {
  style?: CSSProperties
  className?: string | string[]
  children?: ReactNode
  /**
   * 滚动条高度
   */
  height?: string | number
  /**
   * 滚动条最大高度
   */
  maxHeight?: string | number
  /**
   * 是否使用原生滚动条样式
   */
  native?: boolean
  /**
   * 包裹容器的自定义样式
   */
  wrapStyle?: CSSProperties
  /**
   * 包裹容器的自定义类名
   */
  wrapClass?: string | string[]
  /**
   * 视图的自定义样式
   */
  viewStyle?: CSSProperties
  /**
   * 视图的自定义类名
   */
  viewClass?: string | string[]
  /**
   * 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能
   */
  noresize?: Boolean
  /**
   * 视图的元素标签
   */
  tag?: any
  /**
   * 滚动条总是显示
   */
  always?: boolean
  /**
   * 滚动条最小尺寸
   * @defaultValue 20
   */
  minSize?: number
  /**
   * 滚动时触发的事件
   */
  onScroll?: (options: { scrollTop: number; scrollLeft: number }) => void
  onSyncScroll?: (options: { scrollTop: number; scrollLeft: number }) => void
}

export interface BarProps {
  always?: boolean
  width?: string
  height?: string
  ratioX?: number
  ratioY?: number
}

export interface ThumbProps {
  vertical?: boolean
  size?: string
  move?: number
  ratio: number
  always?: boolean
}

export type ScrollbarBarHandle = {
  handleScroll: (wrap: HTMLDivElement) => void
}

export type ScrollbarHandle = {
  wrap: React.MutableRefObject<HTMLDivElement>
  /**
   * 滚动到一组特定坐标
   */
  scrollTo: (options: number | ScrollToOptions, yCoord?: number) => void
  /**
   * 设置滚动条到顶部的距离
   */
  setScrollTop: (scrollTop: number) => void
  /**
   * 设置滚动条到左边的距离
   */
  setScrollLeft: (scrollLeft: number) => void
  /**
   * 手动更新滚动条状态
   */
  update: () => void
}
