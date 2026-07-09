/**
 * Тарифы 6 потока. Все суммы перенесены из Maket.html (строки 858–890)
 * посимвольно: разделитель разрядов — обычный пробел, знак минуса — U+2212,
 * рубль — U+20BD. Правка любой цифры здесь = правка публичной оферты.
 */
/**
 * Виджет оплаты GetCourse. Скрипт находит сам себя по `domId`, вставляет
 * на своё место <iframe> с формой заказа и удаляет себя из DOM.
 * `domId` менять нельзя — он зашит внутрь скрипта, который отдаёт GetCourse.
 */
export interface PaymentWidget {
  /** id тега <script>; скрипт ищет себя через getElementById */
  domId: string;
  /** адрес скрипта; параметр id — это id продукта в GetCourse */
  src: string;
  /** Что покупатель увидит в форме. Обязано совпадать с ценой карточки. */
  productLabel: string;
  /** Та же форма как отдельная страница — запасной путь, если <dialog> не поддержан. */
  formUrl: string;
}

export interface PricingTier {
  /** Технический ключ: связывает карточку с её модалкой оплаты */
  key: string;
  /** Надзаголовок карточки: «Тариф 1 · Ступень 1» */
  plan: string;
  title: string;
  desc: string;
  oldPrice: string;
  discount: string;
  amount: string;
  per: string;
  /** Только у тарифа на две ступени */
  saving?: string;
  features: string[];
  cta: string;
  /** Выделенная карточка получает .pricing-card и трёхтактную оркестровку GSAP */
  featured: boolean;
  badge?: string;
  widget: PaymentWidget;
}

/**
 * Атомы, из которых собираются и карточки тарифов, и ответ в FAQ.
 * До выноса суммы рассрочки жили в двух файлах, и правка цены
 * молча оставила бы FAQ врать.
 */
export const INSTALLMENT_MONTHS = 12;
export const monthly = {
  base: '12 416 ₽/мес',
  full: '21 583 ₽/мес',
} as const;

export const pricing: PricingTier[] = [
  {
    key: 'fundament',
    plan: 'Тариф 1 · Ступень 1',
    title: '«Фундамент»',
    desc: 'Профессия нутрициолог с нуля. После обучения вы уже можете консультировать.',
    oldPrice: '298 000 ₽',
    discount: '−50%',
    amount: '149 000 ₽',
    per: `или ${monthly.base} в рассрочку на ${INSTALLMENT_MONTHS} месяцев`,
    widget: {
      domId: '6156dfca526b1174e3c7d9cfba270bb7f59229ce',
      src: 'https://socenium-e.getcourse.ru/pl/lite/widget/script?id=1628151',
      formUrl: 'https://socenium-e.getcourse.ru/pl/lite/widget/widget?id=1628151',
      productLabel: 'Профессия нутрициолог 2.0 - Фундамент · 149 000 руб.',
    },
    features: [
      'Все 6 модулей ступени «Фундамент»',
      'Встречи с Мариной и кураторами',
      'Практика, кейс и защита',
      'Диплом о профессиональной переподготовке',
      'Бонусы 1 ступени',
    ],
    cta: 'Выбрать «Фундамент»',
    featured: false,
  },
  {
    key: 'full',
    plan: 'Тариф 2 · Ступень 1 + 2',
    title: '«Фундамент» + «Система»',
    desc: 'Полный путь до нутрициолога PRO: максимум практики и глубины.',
    oldPrice: '596 000 ₽',
    discount: '−56%',
    amount: '259 000 ₽',
    per: `или ${monthly.full} в рассрочку на ${INSTALLMENT_MONTHS} месяцев`,
    widget: {
      domId: '781694e8d8a8ce4255d7930da5a17d8dd7bedbf2',
      src: 'https://socenium-e.getcourse.ru/pl/lite/widget/script?id=1628168',
      formUrl: 'https://socenium-e.getcourse.ru/pl/lite/widget/widget?id=1628168',
      productLabel: 'Профессия нутрициолог 2.0 - Фундамент + Система · 259 000 руб.',
    },
    saving: 'экономия 337 000 ₽',
    features: [
      'Всё из тарифа «Фундамент»',
      '6 модулей ступени «Система» (PRO)',
      'Ведение клиента 3 мес. + защита',
      'Удостоверение о повышении квалификации',
      'Супервизии PRO + Telegram-модуль',
    ],
    cta: 'Записаться на две ступени',
    featured: true,
    badge: 'Максимальная выгода · скидка 56%',
  },
];
