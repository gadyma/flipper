document.addEventListener('DOMContentLoaded', async function() {
  const inputText = document.getElementById('input');
  const outputText = document.getElementById('output');
  const conversionType = document.getElementById('conversionType');
  const convertButton = document.getElementById('convert');
  const copyToInputButton = document.getElementById('copyToInput');
  const autodetectButton = document.getElementById('autodetect');

  // Get selected text from active tab when popup opens
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    // Skip browser internal pages
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
      const result = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: () => window.getSelection().toString()
      });
      
      if (result[0].result) {
        inputText.value = result[0].result;
      }
    }
  } catch (err) {
    console.error('Failed to get selected text:', err);
  }
  
  if (copyToInputButton) {
    copyToInputButton.addEventListener('click', function() {
      const outputText = document.getElementById('output').value;
      document.getElementById('input').value = outputText;
    });
  }

  autodetectButton.addEventListener('click', function() {
    const input = inputText.value;
    const conversion = conversionType.value;
    const detectedType = detectConversionType(input,conversion);
    conversionType.value = detectedType;
  });

  convertButton.addEventListener('click', function() {
    const input = inputText.value;
    const conversion = conversionType.value;
    let result = '';

    switch (conversion) {
      case 'base64Encode':
        result = btoa(unescape(encodeURIComponent(input)));
        break;
      case 'base64Decode':
        result = decodeURIComponent(escape(atob(input)));
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

  function detectConversionType(input,conversion) {
    if (/\\u[0-9a-fA-F]{4}/.test(input)) {
      return 'unicodeToAscii'; // Unicode escape sequence detected
    } else if (/&[a-zA-Z]+;/.test(input)) {
      return 'htmlDecode'; // HTML entity detected
    } else if (/%[0-9a-fA-F]{2}/.test(input)) {
      return 'urlDecode'; // URL encoding detected
    } else if (/^[A-Za-z0-9+/=]+$/.test(input) && input.length % 4 === 0) {
      return 'base64Decode'; // Base64 detected
    } else {
      return conversion; // No clear pattern detected
    }
  }
});