
// После открытия — мягко скроллим к началу этой категории (к её заголовку).

const items = Array.from(document.querySelectorAll('.acc-item'));

// Важно: это должно соответствовать времени transition в CSS для .acc-panel (0.35s)
const TRANSITION_MS = 500; // 350ms + небольшой запас

function openItem(item){
  const panel = item.querySelector('.acc-panel');
  if (!panel) return;

  item.classList.add('active');

  // Корректная анимация высоты
  panel.style.overflow = 'hidden';
  panel.style.maxHeight = 'none';
  const full = panel.scrollHeight;
  panel.style.maxHeight = '0px';

  requestAnimationFrame(() => {
    panel.style.maxHeight = full + 'px';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'max-height') return;
    if (item.classList.contains('active')) {
      panel.style.maxHeight = 'none';
    }
    panel.removeEventListener('transitionend', onEnd);
  };
  panel.addEventListener('transitionend', onEnd);
}

function closeItem(item){
  if (!item.classList.contains('active')) return;

  const panel = item.querySelector('.acc-panel');
  if (!panel) return;

  if (getComputedStyle(panel).maxHeight === 'none') {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
  requestAnimationFrame(() => {
    panel.style.maxHeight = '0px';
  });

  const onEnd = (e) => {
    if (e.propertyName !== 'max-height') return;
    item.classList.remove('active');
    panel.removeEventListener('transitionend', onEnd);
  };
  panel.addEventListener('transitionend', onEnd);
}

// Скроллим к началу категории ПОСЛЕ того, как лэйаут устаканится
function scrollToCategoryStartAfterSettled(item){
  const summary = item.querySelector('.acc-summary');
  if (!summary) return;

  // ждём завершения анимаций (закрытие других + открытие текущей)
  requestAnimationFrame(() => {
    setTimeout(() => {
      const top = summary.getBoundingClientRect().top + window.scrollY - 12; // небольшой отступ
      window.scrollTo({ top, behavior: 'smooth' });
    }, TRANSITION_MS + 40);
  });
}

// Инициализация если ты не знаешь что это такое иди нахуй не трогай ее!!! ДОНТ ПУШ ЗЭЭ ХОРСЕС!!!!
items.forEach(item => {
  const summary = item.querySelector('.acc-summary');
  const panel   = item.querySelector('.acc-panel');

  if (panel) { panel.style.maxHeight = '0px'; item.classList.remove('active'); }

  if (summary) {
    summary.addEventListener('click', () => {
      const willOpen = !item.classList.contains('active');

      // Закрыть все остальные
      items.forEach(it => { if (it !== item) closeItem(it); });

      if (willOpen) {
        openItem(item);
        scrollToCategoryStartAfterSettled(item); 
      } else {
        closeItem(item);
      }
    });
  }
});

// Хуеботина какаета ты не шаришь иди нахуй "Поддержка там какаета для ресайза"
window.addEventListener('resize', () => {
  const open = items.find(it => it.classList.contains('active'));
  if (open){
    const panel = open.querySelector('.acc-panel');
    if (panel && getComputedStyle(panel).maxHeight !== 'none') {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }
});

