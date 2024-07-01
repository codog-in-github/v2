const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const Color = require('color');
const theme = yaml.parse(
  fs.readFileSync(path.resolve(__dirname, '../theme.yml'), 'utf-8')
)
console.log(theme.colors)
const colorGenerator = (colors) => {
  const weight = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
  ]
  const newColors = {}
  for(const colorName in colors) {
    const colorHex = colors[colorName]
    const color = Color(colorHex)
    newColors[colorName] = colorHex
    for(let i = 0; i < weight.length; i++) {
      const weightColor = color.lighten(i / 10).hex()
      newColors[`${colorName}-${weight[i]}`] = weightColor
    }
  }
  return newColors
}
console.log(
  colorGenerator(theme.colors)
)

// module.exports = colorGenerator(theme.colors)