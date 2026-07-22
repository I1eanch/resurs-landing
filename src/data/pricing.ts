/**
 * Тарифы 6 потока. Разделитель разрядов — обычный пробел, знак минуса —
 * U+2212, тенге — U+20B8. Правка любой цифры здесь = правка публичной цены.
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
  base: '82 500 ₸/мес',
  full: '139 167 ₸/мес',
} as const;

export const pricing: PricingTier[] = [
  {
    key: 'fundament',
    plan: 'Тариф 1 · Ступень 1',
    title: '«Фундамент»',
    desc: 'Профессия нутрициолог с нуля. После обучения вы уже можете консультировать.',
    oldPrice: '1 820 000 ₸',
    discount: '−46%',
    amount: '990 000 ₸',
    per: `или ${monthly.base} в рассрочку на ${INSTALLMENT_MONTHS} месяцев`,
    widget: {
      domId: 'cac7fabbb3e1e52c1d34b32fb0b0c7c22d85a527',
      src: 'https://iandmyhealth.ru/pl/lite/widget/script?id=1633856',
      formUrl: 'https://iandmyhealth.ru/pl/lite/widget/widget?id=1633856',
      productLabel: 'Профессия нутрициолог 2.0 - Фундамент · 990 000 ₸',
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
    oldPrice: '3 640 000 ₸',
    discount: '−54%',
    amount: '1 670 000 ₸',
    per: `или ${monthly.full} в рассрочку на ${INSTALLMENT_MONTHS} месяцев`,
    widget: {
      domId: '8b3ec97a2496bb867582f3147b15ed8692ce6417',
      src: 'https://iandmyhealth.ru/pl/lite/widget/script?id=1633858',
      formUrl: 'https://iandmyhealth.ru/pl/lite/widget/widget?id=1633858',
      productLabel: 'Профессия нутрициолог 2.0 - Фундамент + Система · 1 670 000 ₸',
    },
    saving: 'экономия 1 970 000 ₸',
    features: [
      'Всё из тарифа «Фундамент»',
      '6 модулей ступени «Система» (PRO)',
      'Ведение клиента 3 мес. + защита',
      'Удостоверение о повышении квалификации',
      'Супервизии PRO + Telegram-модуль',
    ],
    cta: 'Записаться на две ступени',
    featured: true,
    badge: 'Максимальная выгода · скидка 54%',
  },
];
