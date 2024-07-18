import Color from "color"
import theme from '@t/config.yml';
export const hex = (color) => {
  return Color(color).hex().toString()
}

export const hsl = (color) => {
  return Color(color).hsl().toString()
}

export const light = (color, l) => {
  const hsl = Color(color).hsl().array()
  hsl[2] = l;
  return Color.hsl(hsl).hex().toString()
}

export const themeColor = (() => {
  const cache = {}
  return (type, l = null) => {
    const cacheKey = `${type}_${l}`
    if(cache[cacheKey])
      return cache[cacheKey]
    const color = theme.colors[type] ?? 'transparent'
    if(l !== null) {
      return light(color, l)
    }
    const result = hex(color)
    cache[cacheKey] = result
    return result
  }
})()