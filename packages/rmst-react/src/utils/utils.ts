class Scanner {
  constructor(text: string) {
    this.text = text
    // 指针
    this.pos = 0
    // 尾巴  剩余字符
    this.tail = text
  }

  /**
   * 路过指定内容
   * @memberof Scanner
   */
  scan(tag) {
    if (this.tail.indexOf(tag) === 0) {
      // 直接跳过指定内容的长度
      this.pos += tag.length
      // 更新tail
      this.tail = this.text.substring(this.pos)
    }
  }

  /**
   * 让指针进行扫描，直到遇见指定内容，返回路过的文字
   *
   * @memberof Scanner
   * @return str 收集到的字符串
   */
  scanUntil(stopTag: string) {
    // 记录开始扫描时的初始值
    const startPos = this.pos
    // 当尾巴的开头不是stopTg的时候，说明还没有扫描到stopTag
    while (!this.eos() && this.tail.indexOf(stopTag) !== 0) {
      // 改变尾巴为当前指针这个字符到最后的所有字符
      this.tail = this.text.substring(++this.pos)
    }

    // 返回经过的文本数据
    return this.text.substring(startPos, this.pos).trim()
  }

  /**
   * 判断指针是否到达文本末尾（end of string）
   * @memberof Scanner
   */
  eos() {
    return this.pos >= this.text.length
  }
}

export function collectTokens(html: string) {
  const scanner = new Scanner(html)
  const tokens = []

  let word = ''
  while (!scanner.eos()) {
    // 扫描文本
    const text = scanner.scanUntil('<')
    scanner.scan('<')
    tokens[tokens.length - 1] && tokens[tokens.length - 1].push(text)
    // 扫描标签<>中的内容
    word = scanner.scanUntil('>')
    scanner.scan('>')
    // 如果没有扫描到值，就跳过本次进行下一次扫描
    if (!word) continue
    // 区分开始标签 # 和结束标签 /
    if (word.startsWith('/')) {
      tokens.push(['/', word.slice(1)])
    } else {
      // 如果有属性存在，则解析属性
      const firstSpaceIdx = word.indexOf(' ')
      if (firstSpaceIdx === -1) {
        tokens.push(['#', word, {}])
      } else {
        // 解析属性
        const data = propsParser(word.slice(firstSpaceIdx))
        tokens.push(['#', word.slice(0, firstSpaceIdx), data])
      }
    }
  }

  return tokens
}

function propsParser(propsStr: string) {
  propsStr = propsStr.trim()
  const scanner = new Scanner(propsStr)
  const props = {}

  while (!scanner.eos()) {
    let key = scanner.scanUntil('=')

    // 对单属性的处理
    const spaceIdx = key.indexOf(' ')
    if (spaceIdx !== -1) {
      const keys = key.replace(/\s+/g, ' ').split(' ')

      const len = keys.length
      for (let i = 0; i < len - 1; i++) {
        props[keys[i]] = true
      }
      key = keys[len - 1].trim()
    }
    scanner.scan('="')

    const val = scanner.scanUntil('"')
    props[key] = val || true
    scanner.scan('"')
  }

  return props
}

export function sleep(ms: number) {
  let t = Date.now()
  while (Date.now() - t < ms) {}
}

export const lossFrame = (container, func) => {
  const state = { lock: false, prev: 0, target: 0 }
  let realTarget = 0
  let timer

  return () => {
    if (state.lock) {
      return
    }

    state.lock = true
    realTarget = container.scrollTop

    container.scrollTo({ top: state.target })

    // console.log('real scroll')

    state.target = realTarget

    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      sleep(100)

      func?.()

      container.scrollTo({ top: state.target })
      queueMicrotask(() => {
        state.lock = false
      })
    })
  }
}
