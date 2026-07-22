/**
 * Открытие форм оплаты GetCourse.
 *
 * Как устроен виджет GetCourse (проверено чтением его скрипта):
 *   1. Тег <script id="HASH" src="…/widget/script?id=PRODUCT"> при выполнении
 *      объявляет функцию startWidgetHASH и вешает её на DOMContentLoaded,
 *      а также на кастомное событие "StartWidgetHASH".
 *   2. startWidgetHASH находит себя через getElementById('HASH'),
 *      вставляет <iframe> ПЕРЕД собой и удаляет себя из DOM.
 *   3. Родителю скрипта инлайном прописывается overflow: hidden.
 *   4. Высоту iframe подгоняет postMessage с полями { uniqName, height }.
 *
 * Отсюда три следствия, на которых держится этот модуль:
 *   — скрипт нельзя класть в разметку: он отработает на DOMContentLoaded
 *     и потянет чужой iframe при каждой загрузке страницы;
 *   — при вставке уже после DOMContentLoaded нужно вручную послать
 *     событие "StartWidgetHASH" — иначе виджет не запустится;
 *   — контейнер должен быть отдельным div, иначе overflow: hidden
 *     достанется карточке тарифа и срежет её свечение.
 */

const GETCOURSE_ORIGIN = 'https://iandmyhealth.ru';

let lastFocused: HTMLElement | null = null;

/** Подгружает скрипт виджета в контейнер. Повторный вызов ничего не делает. */
function mountWidget(mount: HTMLElement): void {
  if (mount.dataset.mounted === 'true') return;

  const { gcId, gcSrc } = mount.dataset;
  if (!gcId || !gcSrc) return;

  mount.dataset.mounted = 'true';

  const script = document.createElement('script');
  script.id = gcId;
  script.src = gcSrc;
  script.async = true;

  script.onload = () => {
    // DOMContentLoaded к этому моменту давно позади — обработчик, который
    // повесил на него скрипт, уже не сработает. Запускаем его сами.
    if (document.readyState !== 'loading') {
      document.dispatchEvent(new Event(`StartWidget${gcId}`));
    }
  };

  script.onerror = () => {
    mount.dataset.mounted = 'false';
    const loader = mount.parentElement?.querySelector<HTMLElement>('[data-pay-loading]');
    if (loader) {
      loader.textContent = 'Не удалось загрузить форму оплаты. Обновите страницу или напишите нам.';
    }
  };

  mount.appendChild(script);
}

/** Прячет заглушку, как только GetCourse сообщил высоту своего iframe. */
window.addEventListener('message', (event: MessageEvent) => {
  if (event.origin !== GETCOURSE_ORIGIN) return;
  const data = event.data as { uniqName?: string; height?: number } | null;
  if (!data?.uniqName || !data.height) return;

  const mount = document.querySelector<HTMLElement>(`[data-gc-id="${CSS.escape(data.uniqName)}"]`);
  const loader = mount?.parentElement?.querySelector<HTMLElement>('[data-pay-loading]');
  if (loader) loader.hidden = true;
});

function open(dialog: HTMLDialogElement): void {
  lastFocused = document.activeElement as HTMLElement | null;
  dialog.showModal();
  document.body.style.overflow = 'hidden';

  const mount = dialog.querySelector<HTMLElement>('[data-pay-mount]');
  if (mount) mountWidget(mount);
}

function close(dialog: HTMLDialogElement): void {
  dialog.close();
}

document.querySelectorAll<HTMLElement>('[data-pay]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(`pay-${trigger.dataset.pay}`);

    // Запасной путь: браузер без <dialog> не должен упираться в мёртвую кнопку
    // оплаты. Та же форма открывается отдельной страницей.
    if (!(dialog instanceof HTMLDialogElement) || typeof dialog.showModal !== 'function') {
      const fallback = trigger.dataset.payFallback;
      if (fallback) window.open(fallback, '_blank', 'noopener');
      return;
    }

    open(dialog);
  });
});

document.querySelectorAll<HTMLDialogElement>('dialog.gc-dialog').forEach((dialog) => {
  dialog.querySelector<HTMLElement>('[data-pay-close]')?.addEventListener('click', () => close(dialog));

  // Клик по подложке. Событие приходит на сам <dialog>, а не на его содержимое.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close(dialog);
  });

  // Отрабатывает и при закрытии по Esc, которое <dialog> делает сам.
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    lastFocused?.focus();
    lastFocused = null;
  });
});
