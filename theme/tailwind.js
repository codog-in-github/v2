
import Color from 'color';
import { config as theme } from './helper.js'
const colorGenerator = (colors) => {
  const weight = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
  ]
  const newColors = {}
  for(const colorName in colors) {
    const colorHex = colors[colorName]
    const color = Color(colorHex)
    newColors[colorName] = color.hex()
    for(let i = 0; i < weight.length; i++) {
      const hsl = color.hsl().array()
      hsl[2] = 100 - weight[i] / 10
      newColors[`${colorName}-${weight[i]}`] = Color.hsl(hsl).hex().toString()
    }
  }
  return newColors
}

export const colors = colorGenerator(theme.colors)
