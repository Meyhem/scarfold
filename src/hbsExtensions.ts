import { HelperOptions } from 'handlebars'

type HbsExtensionHelper = (context?: any, options?: HelperOptions) => {}

export const camelCase: HbsExtensionHelper =
  (context?: any /*, options?: HelperOptions*/) => {
  if (!context) {
    return ''
  }

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

export const pascalCase: HbsExtensionHelper =
  (context?: any /*, options?: HelperOptions*/) => {
  if (!context) {
    return ''
  }

  const val = context.toString() as string
  const words = val.split(' ').filter((x: string) => !!x)

  return words.map((w) => {
    const components = w.split('-').filter((x: string) => !!x)
    return components.map((c) => {
      return c.charAt(0).toUpperCase() + c.slice(1)
    }).join('')
  }).join(' ')
}

export const noCase: HbsExtensionHelper =
  (context?: any /*, options?: HelperOptions*/) => {
  if (!context) {
    return ''
  }

  const val = context.toString() as string
  const words = val.split(' ').filter((x: string) => !!x)

  return words.map((w) => {
    const components = w.split('-').filter((x: string) => !!x)
    return components.map((c) => {
      return c
    }).join('')
  }).join(' ')
}
