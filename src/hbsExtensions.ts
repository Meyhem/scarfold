import { HelperOptions } from 'handlebars'

export const camelCase = (context: any, options: HelperOptions) => {
  const val = context.toString() as string
  const words = val.split(' ').filter((x: string) => !!x)

  return words.map((w) => {
    const components = w.split('-').filter((x: string) => !!x)
    return components.map((c, i) => {
      if (i === 0) {
        return c.charAt(0).toLowerCase() + c.slice(1)
      } else {
        return c.charAt(0).toUpperCase() + c.slice(1)
      }
    }).join('')
  }).join(' ')

}
