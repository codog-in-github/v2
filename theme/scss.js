import { colorSplit } from './helper.js';
import { config, toColorHex } from './helper.js';

const globalVariablesTextGenerator = (config) => {
  let content = ''
  const lights = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
  ]
  for(const color in config.colors) {
    const c = config.colors[color]
    content += `$color-${color}: ${toColorHex(c)};`
    content += colorSplit(c, lights.map(c => 100 - c / 10)).map(
      (nColor, i) => `$color-${color}-${lights[i]}: ${nColor};`
    ).join('')
  }
  return content;
};

export const globalVariablesText = globalVariablesTextGenerator(config);