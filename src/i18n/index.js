import _ from 'lodash'

export const i18nProvider = {
  t: (key) => key
}

export const useI18n = () => {
  const lang = i18nProvider()
  return {
    t: (key) => _.get(lang, key) ?? key
  }
}