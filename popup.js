document.addEventListener('DOMContentLoaded', function() {
  const inputText = document.getElementById('input');
  const outputText = document.getElementById('output');
  const conversionType = document.getElementById('conversionType');
  const convertButton = document.getElementById('convert');

  convertButton.addEventListener('click', function() {
    const input = inputText.value;
    const conversion = conversionType.value;
    let result = '';

    switch (conversion) {
      case 'base64Encode':
        result = btoa(unescape(encodeURIComponent(input)));
        break;
      case 'rtlToLtr':
        result = input.split('').reverse().join('');
        break;
      case 'ltrToRtl':
        result = input.split('').reverse().join('');
        break;
      case 'htmlEncode':
        result = input.replace(/[&<>"']/g, function(m) {
          return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
        });
        break;
      case 'htmlDecode':
        result = input.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, function(m) {
          return {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[m];
        });
        break;
      case 'urlEncode':
        result = encodeURIComponent(input);
        break;
      case 'urlDecode':
        result = decodeURIComponent(input);
        break;
      case 'engToHeb':
        result = engToHebKeyboard(input);
        break;
      case 'hebToEng':
        result = hebToEngKeyboard(input);
        break;
      case 'flipText':
        result = input.split('').reverse().join('');
        break;
      case 'unicodeToAscii':
        result = unicodeToHebrew(input);
        break;
      case 'asciiToUnicode':
        result = input.normalize('NFC');
        break;
    }

    outputText.value = result;
  });

  function engToHebKeyboard(text) {
    const engToHebMap = {
      'q': '/', 'w': "'", 'e': 'ק', 'r': 'ר', 't': 'א', 'y': 'ט', 'u': 'ו', 'i': 'ן', 'o': 'ם', 'p': 'פ',
      'a': 'ש', 's': 'ד', 'd': 'ג', 'f': 'כ', 'g': 'ע', 'h': 'י', 'j': 'ח', 'k': 'ל', 'l': 'ך', ';': 'ף',
      'z': 'ז', 'x': 'ס', 'c': 'ב', 'v': 'ה', 'b': 'נ', 'n': 'מ', 'm': 'צ', ',': 'ת', '.': 'ץ'
    };
    return text.toLowerCase().split('').map(char => engToHebMap[char] || char).join('');
  }
  function unicodeToHebrew(text) {
    return text.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });
  }

  function hebToEngKeyboard(text) {
    const hebToEngMap = {
      '/': 'q', "'": 'w', 'ק': 'e', 'ר': 'r', 'א': 't', 'ט': 'y', 'ו': 'u', 'ן': 'i', 'ם': 'o', 'פ': 'p',
      'ש': 'a', 'ד': 's', 'ג': 'd', 'כ': 'f', 'ע': 'g', 'י': 'h', 'ח': 'j', 'ל': 'k', 'ך': 'l', 'ף': ';',
      'ז': 'z', 'ס': 'x', 'ב': 'c', 'ה': 'v', 'נ': 'b', 'מ': 'n', 'צ': 'm', 'ת': ',', 'ץ': '.'
    };
    return text.split('').map(char => hebToEngMap[char] || char).join('');
  }
});


