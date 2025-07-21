async function copyShikiCode(button) {
  // 防止重复点击
  if (button.classList.contains('copied')) {
    return;
  }
  
  const figure = button.closest('figure.hexo-shiki-code');

  const codeElement = figure.querySelector('pre code');
  
  if (!codeElement) return;
  
  const codeText = codeElement.textContent || codeElement.innerText;
  const buttonText = button.querySelector('.button-text');
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(codeText);
      showCopySuccess(button, buttonText);
    } else {
      fallbackCopyTextToClipboard(codeText, button, buttonText);
    }
  } catch (error) {
    console.warn('Clipboard API 失败，尝试兼容方法：', error);
    fallbackCopyTextToClipboard(codeText, button, buttonText);
  }
}

function fallbackCopyTextToClipboard(text, button, buttonText) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  textArea.style.opacity = '0';
  textArea.style.pointerEvents = 'none';
  textArea.setAttribute('readonly', '');
  
  document.body.appendChild(textArea);
  
  try {
    textArea.select();
    textArea.setSelectionRange(0, 99999); // 移动端兼容
    
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess(button, buttonText);
    } else {
      showCopyError(button, buttonText);
    }
  } catch (err) {
    console.error('复制失败：', err);
    showCopyError(button, buttonText);
  } finally {
    document.body.removeChild(textArea);
  }
}

// 显示复制成功状态
function showCopySuccess(button, buttonText) {
  const originalText = buttonText.textContent;
  
  button.classList.add('copied');
  buttonText.textContent = '已复制';
  
  setTimeout(() => {
    button.classList.remove('copied');
    buttonText.textContent = originalText;
  }, 1400);
}

// 显示复制错误状态
function showCopyError(button, buttonText) {
  const originalText = buttonText.textContent;
  
  button.classList.add('error');
  buttonText.textContent = '复制失败';
  
  setTimeout(() => {
    button.classList.remove('error');
    buttonText.textContent = originalText;
  }, 1400);
}

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const setCodeScheme = (isDark) => {
  const documentElement = document.documentElement;
  if(documentElement.dataset.lightShiki === documentElement.dataset.darkShiki) {
    documentElement.classList.add(documentElement.dataset.darkShiki);
    return;
  }
  if (isDark) {
    documentElement.classList.add(documentElement.dataset.darkShiki);
    documentElement.classList.remove(documentElement.dataset.lightShiki);
  } else {
    documentElement.classList.add(documentElement.dataset.lightShiki);
    documentElement.classList.remove(documentElement.dataset.darkShiki);
  }
};

// 页面加载时先执行一次，保证正确初始状态
setCodeScheme(mediaQuery.matches);

// 监听系统主题切换
mediaQuery.addEventListener('change', e => {
  setCodeScheme(e.matches);
});