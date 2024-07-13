import Color from 'color';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
const loadConfig = () => {
  const theme = yaml.parse(
    fs.readFileSync(path.resolve(__dirname, 'config.yml'), 'utf-8')
  )
  return theme
}

export const config = loadConfig()

export const colorSplit = (input, lights = []) => {
  const color = Color(input)
  const colors = Array(lights.length)
  for(let i = 0; i < lights.length; i ++) {
    const light = lights[i]
    const hsl = color.hsl().array()
    hsl[2] = light
    colors[i] = Color.hsl(hsl).hex().toString()
  }
  return colors
}

export function toColorHex(numberValue) {
  return Color(numberValue).hex().toString()
} 