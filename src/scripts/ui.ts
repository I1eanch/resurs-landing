/**
 * Поведение интерфейса: бургер, две группы табов, два аккордеона.
 * Модуль импортируется один раз в Layout.astro. Компоненты секций
 * не содержат скриптов — они только объявляют классы и data-атрибуты.
 *
 * Ни одна функция здесь ничего не измеряет и не анимирует: высоту
 * аккордеонов ведёт CSS через grid-template-rows, JS лишь ставит класс.
 */

/* ---------- Бургер ---------------------------------------------------- */

const burger = document.getElementById('burger');
const menu = document.getElementById('mobileMenu');

function setMenu(open: boolean): void {
  menu?.classList.toggle('show', open);
  burger?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

burger?.addEventListener('click', () => setMenu(!menu?.classList.contains('show')));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.classList.contains('show')) setMenu(false);
});

/* ---------- Табы ------------------------------------------------------
   Одна функция на обе группы: ступени программы и вкладки кейсов.       */

function initTabs(tabSelector: string, panelSelector: string, key: string): void {
  const tabs = Array.from(document.querySelectorAll<HTMLElement>(tabSelector));
  const panels = Array.from(document.querySelectorAll<HTMLElement>(panelSelector));
  if (!tabs.length) return;

  const activate = (tab: HTMLElement): void => {
    const value = tab.dataset[key];
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => p.classList.toggle('active', p.dataset[key] === value));
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab));
    // Стрелки влево/вправо — стандартная клавиатурная навигация по табам.
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const shift = e.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(tabs.indexOf(tab) + shift + tabs.length) % tabs.length]!;
      activate(next);
      next.focus();
    });
  });
}

initTabs('.step-tab', '.step-panel', 'step');
initTabs('.case-tab', '.case-panel', 'case');

/* ---------- Аккордеон модулей программы -------------------------------
   Несколько модулей могут быть открыты одновременно.                     */

document.querySelectorAll<HTMLElement>('.mod-head').forEach((head) => {
  head.addEventListener('click', () => {
    const mod = head.closest('.mod');
    if (!mod) return;
    const open = mod.classList.toggle('open');
    head.setAttribute('aria-expanded', String(open));
  });
});

/* ---------- Аккордеон FAQ ---------------------------------------------
   Открыт всегда ровно один пункт.                                        */

const faqItems = Array.from(document.querySelectorAll<HTMLElement>('.faq-item'));

faqItems.forEach((item) => {
  const question = item.querySelector<HTMLElement>('.faq-q');
  question?.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    faqItems.forEach((other) => {
      other.classList.remove('open');
      other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});
