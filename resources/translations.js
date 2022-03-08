function getTranslation (english) {
  let res = english
  if (typeof (navigator) !== 'undefined') {
    const lang = navigator.language.split('-')[0]
    const translations = {
      zh: {
        // Chinese Simplified
        Blocked: '被封锁',
        'Not available in this browser': '在此浏览器中不可用',
        'not available': '无法使用',
        'Blocked Action': '被阻止的动作',
        'Choose the action to take when visiting a blocked IP address:': '选择访问被阻止的 IP 地址时要执行的操作:',
        'Show blocked page': '显示被阻止的页面',
        'Redirect to default search': '重定向到默认搜索引擎'
      },
      fr: {
        // French
        Blocked: 'Bloquée',
        'Not available in this browser': 'Non disponible dans ce navigateur',
        'not available': 'indisponible',
        'Blocked Action': 'Action bloquée',
        'Choose the action to take when visiting a blocked IP address:': 'Choisissez l\'action à effectuer lors de la visite d\'une adresse IP bloquée:',
        'Show blocked page': 'Afficher la page bloquée',
        'Redirect to default search': 'Rediriger vers le moteur de recherche par défaut'
      },
      hi: {
        // Hindi
        Blocked: 'अवरुद्ध',
        'Not available in this browser': 'इस ब्राउज़र में उपलब्ध नहीं है',
        'not available': 'नहीं हैहै',
        'Blocked Action': 'अवरुद्ध कार्रवाई',
        'Choose the action to take when visiting a blocked IP address:': 'अवरुद्ध IP पते पर जाने के दौरान की जाने वाली कार्रवाई चुनें:',
        'Show blocked page': 'अवरुद्ध पृष्ठ दिखाएं',
        'Redirect to default search': 'डिफ़ॉल्ट खोज पर रीडायरेक्ट करें'
      },
      es: {
        // Spanish
        Blocked: 'Bloqueada',
        'Not available in this browser': 'No disponible en este navegador',
        'not available': 'no disponible',
        'Blocked Action': 'Acción bloqueada',
        'Choose the action to take when visiting a blocked IP address:': 'Elija la acción a realizar cuando visite una dirección IP bloqueada:',
        'Show blocked page': 'Mostrar página bloqueada',
        'Redirect to default search': 'Redirigir a la búsqueda predeterminada'
      },
      ru: {
        // Russian
        Blocked: 'Заблокированный',
        'Not available in this browser': 'Недоступно в этом браузере',
        'not available': 'недоступно',
        'Blocked Action': 'Заблокированное действие',
        'Choose the action to take when visiting a blocked IP address:': 'Выберите действие при посещении заблокированного IP-адреса:',
        'Show blocked page': 'Показать заблокированную страницу',
        'Redirect to default search': 'Перенаправить на поиск по умолчанию'
      },
      de: {
        // German
        Blocked: 'Blockierte',
        'Not available in this browser': 'In diesem Browser nicht verfügbar',
        'not available': 'nicht verfügbar',
        'Blocked Action': 'Blockierte Aktion',
        'Choose the action to take when visiting a blocked IP address:': 'Wählen Sie die Aktion aus, die beim Besuch einer blockierten IP-Adresse durchgeführt werden soll:',
        'Show blocked page': 'Gesperrte Seite anzeigen',
        'Redirect to default search': 'Weiterleitung zur Standardsuche'
      }
    }
    if (typeof (translations[lang]) !== 'undefined') {
      res = translations[lang][english]
    }
  }
  return res
}
