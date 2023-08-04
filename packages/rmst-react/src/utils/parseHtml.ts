import { collectTokens } from './utils'

export function parseHtml(str: string) {
  const ans = collectTokens(str)

  const final = ans.map(item => {
    const [_, type, object] = item

    let name = ''
    const optionProps = []
    for (const key in object) {
      if (key === 'x:tag') name = object[key]
      else if (key === '/') continue
      else {
        optionProps.push({ name: key, value: object[key] })
      }
    }

    return { name, type, optionProps }
  })

  return final
}
