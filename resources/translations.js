function getTranslation (english) {
  let res = english
  if (typeof (navigator) !== 'undefined') {
    const lang = navigator.language.split('-')[0]
    const translations = {
      zh: {
        Blocked: '被封锁'
      },
      fr: {
        Blocked: 'Bloquée'
      },
      hi: {
        Blocked: 'अवरुद्ध'
      },
      es: {
        Blocked: 'Bloqueada'
      },
      ru: {
        Blocked: 'Заблокированный'
      },
      de: {
        Blocked: 'Blockierte'
      }
    }
    if (typeof (translations[lang]) !== 'undefined') {
      res = translations[lang][english]
    }
  }
  return res
}
