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

export const themeColor = (type, l = null) => {
  const color = theme.colors[type] ?? 'transparent'
  if(l !== null) {
    return light(color, l)
  }
  return hex(color)
}