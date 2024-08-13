import { colorLightSplit } from './helper.js';
import { config, toColorHex } from './helper.js';

const globalVariablesTextGenerator = (config) => {
  let content = ''
  const lights = [
    5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95
  ]
  for(const color in config.colors) {
    const c = config.colors[color]
    content += `$color-${color}: ${toColorHex(c)};`
    content += colorLightSplit(c, lights.map(c => 100 - c)).map(
      (nColor, i) => `$color-${color}-${lights[i]}0: ${nColor};`
    ).join('')
  }
  return content;
};

export const globalVariablesText = globalVariablesTextGenerator(config);