
import Color from 'color';
import { config as theme } from './helper.js'
const colorGenerator = (colors) => {
  const weight = [
    5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95
  ]
  const newColors = {}
  for(const colorName in colors) {
    const colorHex = colors[colorName]
    const color = Color(colorHex)
    newColors[colorName] = color.hex()
    for(let i = 0; i < weight.length; i++) {
      newColors[`${colorName}-${weight[i]}0`] = color.lightness(100 - weight[i]).hex()
    }
  }
  return newColors
}

export const colors = colorGenerator(theme.colors)
