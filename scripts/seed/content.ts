type Localized = { uk: string; en: string }

export type SeedImage = {
  file: string
  alt: Localized
  author: string
  photo: string
}

const unsplash = (id: string) => `https://unsplash.com/photos/${id}`

export const images: SeedImage[] = [
  {
    file: 'service-cosmetic',
    alt: { uk: 'Фарбування стіни валиком', en: 'Painting a wall with a roller' },
    author: 'Barney Goodman',
    photo: 'Azz07JvM-EA',
  },
  {
    file: 'service-capital',
    alt: {
      uk: 'Квартира під час капітального ремонту з тимчасовими опорами',
      en: 'Apartment during a full renovation with temporary supports',
    },
    author: 'Stefan Lehner',
    photo: 'biRt6RXejuk',
  },
  {
    file: 'service-design',
    alt: {
      uk: 'Дизайнер підбирає зразки матеріалів',
      en: 'Designer choosing material samples',
    },
    author: 'Mohammad Lotfian',
    photo: 'DGRixfygKvE',
  },
  {
    file: 'service-bathroom',
    alt: {
      uk: 'Світлий санвузол з дерев’яною тумбою та круглим дзеркалом',
      en: 'Bright bathroom with a wooden vanity and a round mirror',
    },
    author: 'Clay Banks',
    photo: 'Fuguvv3goCA',
  },
  {
    file: 'service-kitchen',
    alt: {
      uk: 'Кухня з темно-зеленими фасадами та дерев’яною стільницею',
      en: 'Kitchen with dark green cabinets and a wooden worktop',
    },
    author: 'Clay Banks',
    photo: 'haJdK-oucKg',
  },
  {
    file: 'service-commercial',
    alt: {
      uk: 'Простір кав’ярні з підвісними світильниками',
      en: 'Café space with pendant lights',
    },
    author: 'Rodeo Project Management Software',
    photo: 'PYqzYhTNjho',
  },
  {
    file: 'podil-cover',
    alt: {
      uk: 'Світла вітальня з білим диваном і плетеними дзеркалами',
      en: 'Bright living room with a white sofa and woven mirrors',
    },
    author: 'Spacejoy',
    photo: 'c0JoR_-2x3E',
  },
  {
    file: 'podil-sketch',
    alt: { uk: 'Олівцевий ескіз тієї ж вітальні', en: 'Pencil sketch of the same living room' },
    author: 'Spacejoy',
    photo: 'c0JoR_-2x3E',
  },
  {
    file: 'podil-bedroom',
    alt: {
      uk: 'Спальня з картинами над ліжком і великим вікном',
      en: 'Bedroom with framed art above the bed and a large window',
    },
    author: 'Spacejoy',
    photo: 'XM-miHibz64',
  },
  {
    file: 'podil-kitchen',
    alt: {
      uk: 'Кухня з білими фасадами та обідньою зоною біля вікна',
      en: 'Kitchen with white cabinets and a dining nook by the window',
    },
    author: 'Jakob Owens',
    photo: 'DJV40FsmPSg',
  },
  {
    file: 'podil-bathroom',
    alt: {
      uk: 'Ванна кімната з окремою ванною та дерев’яною стіною',
      en: 'Bathroom with a freestanding tub and a wooden wall',
    },
    author: 'Murad Kerimli',
    photo: 'N03PjHWOEFA',
  },
  {
    file: 'pechersk-cover',
    alt: {
      uk: 'Вітальня з двома диванами та столиком з необробленого дерева',
      en: 'Living room with two sofas and a raw wood coffee table',
    },
    author: 'Spacejoy',
    photo: 'x3mSC1WnWhc',
  },
  {
    file: 'pechersk-sketch',
    alt: { uk: 'Олівцевий ескіз тієї ж вітальні', en: 'Pencil sketch of the same living room' },
    author: 'Spacejoy',
    photo: 'x3mSC1WnWhc',
  },
  {
    file: 'pechersk-kitchen',
    alt: {
      uk: 'Кухонний острів з мідними світильниками',
      en: 'Kitchen island with copper pendant lights',
    },
    author: 'Bailey Alexander',
    photo: 'lGEdX8UjA9k',
  },
  {
    file: 'pechersk-open',
    alt: {
      uk: 'Відкрита кухня-вітальня з дерев’яною підлогою',
      en: 'Open kitchen and living area with a wooden floor',
    },
    author: 'Bailey Alexander',
    photo: 'PE4pFgcYzoQ',
  },
  {
    file: 'stalinka-cover',
    alt: {
      uk: 'Санвузол з двома раковинами з бетону та окремою ванною',
      en: 'Bathroom with two concrete basins and a freestanding tub',
    },
    author: 'Clay Banks',
    photo: 'j7Uv1Y_A7dY',
  },
  {
    file: 'stalinka-sketch',
    alt: { uk: 'Олівцевий ескіз того ж санвузла', en: 'Pencil sketch of the same bathroom' },
    author: 'Clay Banks',
    photo: 'j7Uv1Y_A7dY',
  },
  {
    file: 'stalinka-vanity',
    alt: {
      uk: 'Дерев’яна тумба з кошиками під раковинами',
      en: 'Wooden vanity with baskets under the basins',
    },
    author: 'Clay Banks',
    photo: 'YDc_S7uIYic',
  },
  {
    file: 'stalinka-tub',
    alt: {
      uk: 'Ванна на ніжках і плитка «шестикутник» на підлозі',
      en: 'Clawfoot tub and hexagon floor tiles',
    },
    author: 'Illumination Marketing',
    photo: 'LbLSqPbnjRw',
  },
  {
    file: 'rental-cover',
    alt: {
      uk: 'Вітальня з коричневим диваном і скляним столиком',
      en: 'Living room with a brown sofa and a glass coffee table',
    },
    author: 'Lotus Design N Print',
    photo: '1vMz2_MclrM',
  },
  {
    file: 'rental-sketch',
    alt: { uk: 'Олівцевий ескіз тієї ж вітальні', en: 'Pencil sketch of the same living room' },
    author: 'Lotus Design N Print',
    photo: '1vMz2_MclrM',
  },
  {
    file: 'rental-bedroom',
    alt: {
      uk: 'Спальня з абстрактними картинами та вікном у сад',
      en: 'Bedroom with abstract prints and a window to the garden',
    },
    author: 'Point3D Commercial Imaging Ltd.',
    photo: 'xON7AlJZemw',
  },
  {
    file: 'rental-kitchen',
    alt: {
      uk: 'Кухня з дерев’яною стільницею та обіднім столиком',
      en: 'Kitchen with a wooden worktop and a small dining table',
    },
    author: 'Rune Enstad',
    photo: 'UXFJ-6Zj27M',
  },
  {
    file: 'coworking-cover',
    alt: {
      uk: 'Зона відпочинку коворкінгу з кріслами та торшером',
      en: 'Coworking lounge with armchairs and a floor lamp',
    },
    author: 'Toa Heftiba',
    photo: 'FV3GConVSss',
  },
  {
    file: 'coworking-sketch',
    alt: { uk: 'Олівцевий ескіз тієї ж зони', en: 'Pencil sketch of the same lounge' },
    author: 'Toa Heftiba',
    photo: 'FV3GConVSss',
  },
  {
    file: 'coworking-hall',
    alt: {
      uk: 'Світлий відкритий простір з рослинами',
      en: 'Bright open workspace with plants',
    },
    author: 'Copernico',
    photo: 'p_kICQCOM4s',
  },
  {
    file: 'coworking-meeting',
    alt: {
      uk: 'Переговорна зі скляними стінами',
      en: 'Meeting room with glass walls',
    },
    author: 'Nastuh Abootalebi',
    photo: 'eHD8Y1Znfpk',
  },
  {
    file: 'bucha-cover',
    alt: {
      uk: 'Вітальня з каміном, полицями та плетеними кріслами',
      en: 'Living room with a fireplace, shelves and woven armchairs',
    },
    author: 'Tile Merchant Ireland',
    photo: 'TPzXRLb64XM',
  },
  {
    file: 'bucha-sketch',
    alt: { uk: 'Олівцевий ескіз тієї ж вітальні', en: 'Pencil sketch of the same living room' },
    author: 'Tile Merchant Ireland',
    photo: 'TPzXRLb64XM',
  },
  {
    file: 'bucha-kitchen',
    alt: {
      uk: 'Кухня з островом і дерев’яними стільцями',
      en: 'Kitchen with an island and wooden stools',
    },
    author: 'roam in color',
    photo: 'RryFk4n-vOs',
  },
  {
    file: 'bucha-bedroom',
    alt: {
      uk: 'Спальня з блакитною стіною та плетеним світильником',
      en: 'Bedroom with a blue wall and a woven pendant lamp',
    },
    author: 'Spacejoy',
    photo: 'vOa-PSimwg4',
  },
].map((image) => ({ ...image, photo: unsplash(image.photo) }))

export const services = [
  {
    slug: 'cosmetic',
    image: 'service-cosmetic',
    priceFrom: 4500,
    title: { uk: 'Косметичний ремонт', en: 'Cosmetic renovation' },
    summary: {
      uk: 'Оновлюємо стіни, стелі й підлогу без перепланування. Підходить для квартир під оренду та свіжого вигляду за кілька тижнів.',
      en: 'New walls, ceilings and floors without changing the layout. Good for rentals and a fresh look in a few weeks.',
    },
  },
  {
    slug: 'capital',
    image: 'service-capital',
    priceFrom: 9800,
    title: { uk: 'Капітальний ремонт', en: 'Full renovation' },
    summary: {
      uk: 'Від демонтажу до чистового оздоблення: нова електрика, сантехніка, стяжка й перепланування за погодженим проєктом.',
      en: 'From demolition to finishing: new wiring, plumbing, screed and an approved new layout.',
    },
  },
  {
    slug: 'design',
    image: 'service-design',
    priceFrom: 900,
    title: { uk: 'Дизайн-проєкт', en: 'Interior design' },
    summary: {
      uk: 'Обміри, планування, 3D-візуалізації й креслення для будівельників. Підбираємо матеріали під ваш бюджет.',
      en: 'Measurements, layouts, 3D visuals and working drawings. We pick materials that fit your budget.',
    },
  },
  {
    slug: 'bathrooms',
    image: 'service-bathroom',
    priceFrom: 11500,
    title: { uk: 'Санвузли', en: 'Bathrooms' },
    summary: {
      uk: 'Гідроізоляція, приховані інсталяції, укладання великоформатної плитки та скляні душові перегородки.',
      en: 'Waterproofing, concealed frames, large-format tiles and glass shower screens.',
    },
  },
  {
    slug: 'kitchens',
    image: 'service-kitchen',
    priceFrom: 8500,
    title: { uk: 'Кухні', en: 'Kitchens' },
    summary: {
      uk: 'Готуємо кухню під меблі на замовлення: виводи, розетки, підсвітка робочої зони й фартух.',
      en: 'We prepare the room for custom furniture: outlets, sockets, worktop lighting and the splashback.',
    },
  },
  {
    slug: 'commercial',
    image: 'service-commercial',
    priceFrom: 7200,
    title: { uk: 'Комерційні приміщення', en: 'Commercial spaces' },
    summary: {
      uk: 'Кав’ярні, офіси й шоуруми з роботою у вихідні та нічні зміни, щоб бізнес не зупинявся.',
      en: 'Cafés, offices and showrooms, with weekend and night shifts so the business keeps running.',
    },
  },
]

export const projects = [
  {
    slug: 'podil-apartment',
    category: 'apartment' as const,
    cover: 'podil-cover',
    sketch: 'podil-sketch',
    gallery: ['podil-bedroom', 'podil-kitchen', 'podil-bathroom'],
    area: 68,
    durationWeeks: 14,
    budgetFrom: 1150000,
    year: 2025,
    featured: true,
    services: ['capital', 'design', 'bathrooms', 'kitchens'],
    title: { uk: 'Квартира на Подолі', en: 'Apartment in Podil' },
    district: { uk: 'Поділ, Київ', en: 'Podil, Kyiv' },
    summary: {
      uk: 'Двокімнатна квартира в старому фонді: відкрите планування, теплі текстури й багато денного світла.',
      en: 'A two-room flat in an old building: an open layout, warm textures and plenty of daylight.',
    },
    body: {
      uk: [
        'Власники хотіли світлу квартиру для пари з собакою. У старому фонді були криві стіни, дерев’яні перекриття й алюмінієва проводка.',
        'Ми замінили всю електрику й сантехніку, вирівняли стіни по маяках і об’єднали кухню з вітальнею. Несучу стіну не чіпали: прохід зробили в межах погодженого отвору.',
        'Фінал: натуральні тканини, дерево й плетені деталі. Робота тривала 14 тижнів, кошторис не змінився.',
      ],
      en: [
        'The owners wanted a bright home for a couple with a dog. The old building had crooked walls, timber floors and aluminium wiring.',
        'We replaced all wiring and plumbing, levelled the walls and joined the kitchen with the living room. The load-bearing wall stayed intact: the passage uses the approved opening.',
        'The finish is natural fabrics, wood and woven details. The work took 14 weeks and the estimate did not change.',
      ],
    },
  },
  {
    slug: 'pechersk-kitchen-living',
    category: 'kitchen' as const,
    cover: 'pechersk-cover',
    sketch: 'pechersk-sketch',
    gallery: ['pechersk-kitchen', 'pechersk-open'],
    area: 42,
    durationWeeks: 8,
    budgetFrom: 640000,
    year: 2025,
    featured: true,
    services: ['capital', 'kitchens'],
    title: { uk: 'Кухня-вітальня на Печерську', en: 'Kitchen and living room in Pechersk' },
    district: { uk: 'Печерськ, Київ', en: 'Pechersk, Kyiv' },
    summary: {
      uk: 'Простір для великої родини: острів, дві зони відпочинку й прихована система зберігання.',
      en: 'A space for a big family: an island, two lounge areas and hidden storage.',
    },
    body: {
      uk: [
        'Родина з трьома дітьми хотіла збиратися разом, але не заважати одне одному.',
        'Ми зонували простір світлом і підлогою, перенесли мийку в острів і зробили під нього окремий злив з насосом.',
        'Кухню змонтували за 3 дні після чистового ремонту, бо всі виводи підготували за кресленнями виробника.',
      ],
      en: [
        'A family with three kids wanted to spend time together without getting in each other’s way.',
        'We zoned the space with lighting and flooring, moved the sink into the island and added a pumped drain for it.',
        'The kitchen was installed in 3 days after the finishing, because every outlet matched the maker’s drawings.',
      ],
    },
  },
  {
    slug: 'stalinka-bathroom',
    category: 'bathroom' as const,
    cover: 'stalinka-cover',
    sketch: 'stalinka-sketch',
    gallery: ['stalinka-vanity', 'stalinka-tub'],
    area: 9,
    durationWeeks: 5,
    budgetFrom: 290000,
    year: 2024,
    featured: false,
    services: ['bathrooms'],
    title: { uk: 'Санвузол у сталінці', en: 'Bathroom in a 1950s building' },
    district: { uk: 'Шевченківський район, Київ', en: 'Shevchenkivskyi district, Kyiv' },
    summary: {
      uk: 'Ванна кімната з високою стелею: дві раковини, окрема ванна й тепла підлога.',
      en: 'A bathroom with a high ceiling: two basins, a freestanding tub and underfloor heating.',
    },
    body: {
      uk: [
        'У будинку 1953 року були чавунні стояки й перекриття, яке не витримало б важку ванну.',
        'Ми замінили стояки разом із сусідами, посилили основу під ванною й зробили обмазувальну гідроізоляцію з заходом на стіни.',
        'Плитка «шестикутник» і дерево тумби підтримують характер старого будинку.',
      ],
      en: [
        'The 1953 building had cast-iron risers and a floor that could not carry a heavy tub.',
        'We replaced the risers together with the neighbours, reinforced the base under the tub and added liquid waterproofing up the walls.',
        'Hexagon tiles and a wooden vanity keep the character of the old house.',
      ],
    },
  },
  {
    slug: 'obolon-rental',
    category: 'apartment' as const,
    cover: 'rental-cover',
    sketch: 'rental-sketch',
    gallery: ['rental-bedroom', 'rental-kitchen'],
    area: 54,
    durationWeeks: 7,
    budgetFrom: 520000,
    year: 2024,
    featured: false,
    services: ['cosmetic', 'kitchens'],
    title: { uk: 'Двокімнатна під оренду', en: 'Two-room flat for rent' },
    district: { uk: 'Оболонь, Київ', en: 'Obolon, Kyiv' },
    summary: {
      uk: 'Практичний ремонт для здачі в оренду: зносостійкі матеріали й нейтральні кольори.',
      en: 'A practical renovation for renting out: hard-wearing materials and neutral colours.',
    },
    body: {
      uk: [
        'Інвестор хотів здати квартиру через два місяці й не перейматися ремонтом ще років п’ять.',
        'Ми обрали кварцвініл замість ламінату, миючу фарбу й прості змішувачі, які легко замінити.',
        'Квартиру здали за тиждень після завершення робіт.',
      ],
      en: [
        'The investor wanted to rent the flat out in two months and forget about repairs for five years.',
        'We chose quartz vinyl instead of laminate, washable paint and simple taps that are easy to replace.',
        'The flat was rented out a week after the work was done.',
      ],
    },
  },
  {
    slug: 'lukianivka-coworking',
    category: 'commercial' as const,
    cover: 'coworking-cover',
    sketch: 'coworking-sketch',
    gallery: ['coworking-hall', 'coworking-meeting'],
    area: 180,
    durationWeeks: 12,
    budgetFrom: 2400000,
    year: 2025,
    featured: true,
    services: ['commercial', 'design'],
    title: { uk: 'Коворкінг на Лук’янівці', en: 'Coworking in Lukianivka' },
    district: { uk: 'Лук’янівка, Київ', en: 'Lukianivka, Kyiv' },
    summary: {
      uk: 'Колишній склад став коворкінгом на 60 місць з переговорними й тихими кабінками.',
      en: 'A former warehouse became a 60-seat coworking space with meeting rooms and quiet booths.',
    },
    body: {
      uk: [
        'Орендар мав три місяці до відкриття й жорсткі вимоги пожежної безпеки.',
        'Ми розробили проєкт, погодили його з ДСНС і працювали у дві зміни. Перегородки зі скла й акустичні панелі дали тишу без важких стін.',
        'Коворкінг відкрився вчасно, а резервне живлення тримає світло й інтернет під час відключень.',
      ],
      en: [
        'The tenant had three months before opening and strict fire safety rules.',
        'We designed the space, got the fire service approval and worked in two shifts. Glass partitions and acoustic panels gave quiet without heavy walls.',
        'The coworking opened on time, and backup power keeps the lights and internet on during outages.',
      ],
    },
  },
  {
    slug: 'bucha-townhouse',
    category: 'house' as const,
    cover: 'bucha-cover',
    sketch: 'bucha-sketch',
    gallery: ['bucha-kitchen', 'bucha-bedroom'],
    area: 126,
    durationWeeks: 20,
    budgetFrom: 2100000,
    year: 2025,
    featured: true,
    services: ['capital', 'design', 'kitchens', 'bathrooms'],
    title: { uk: 'Таунхаус у Бучі', en: 'Townhouse in Bucha' },
    district: { uk: 'Буча, Київська область', en: 'Bucha, Kyiv region' },
    summary: {
      uk: 'Дворівневий таунхаус з каміном, кухнею з островом і трьома спальнями.',
      en: 'A two-storey townhouse with a fireplace, a kitchen island and three bedrooms.',
    },
    body: {
      uk: [
        'Таунхаус здали в стані «білий каркас». Власники хотіли класичну вітальню з каміном і сучасну кухню.',
        'Ми зробили дизайн-проєкт, біокамін із вбудованими полицями, теплу підлогу на першому поверсі й кухню з островом.',
        'Щотижневі фотозвіти дозволили власникам стежити за роботою з-за кордону.',
      ],
      en: [
        'The townhouse came as a shell. The owners wanted a classic living room with a fireplace and a modern kitchen.',
        'We designed the interior, built a bio-fireplace with shelves, laid underfloor heating downstairs and fitted a kitchen island.',
        'Weekly photo reports let the owners follow the work from abroad.',
      ],
    },
  },
]

export const testimonials = [
  {
    project: 'podil-apartment',
    rating: 5,
    author: { uk: 'Олена та Максим', en: 'Olena and Maksym' },
    text: {
      uk: 'Найбільше боялися, що ціна зросте посеред ремонту. Не зросла. Щоп’ятниці отримували фото й коротко, що зроблено за тиждень.',
      en: 'Our biggest fear was the price going up halfway through. It did not. Every Friday we got photos and a short note on the week’s work.',
    },
  },
  {
    project: 'bucha-townhouse',
    rating: 5,
    author: { uk: 'Андрій К.', en: 'Andrii K.' },
    text: {
      uk: 'Ми були за кордоном майже весь ремонт. Приїхали на приймання й не знайшли до чого придертися.',
      en: 'We were abroad for most of the renovation. We came back for the handover and could not find anything to complain about.',
    },
  },
  {
    project: 'lukianivka-coworking',
    rating: 5,
    author: { uk: 'Ірина, засновниця коворкінгу', en: 'Iryna, coworking founder' },
    text: {
      uk: 'Встигли до відкриття, хоча терміни були дуже стислі. Окреме дякую за погодження з ДСНС.',
      en: 'They made it before the opening even with a very tight schedule. Special thanks for handling the fire service approval.',
    },
  },
  {
    project: 'stalinka-bathroom',
    rating: 5,
    author: { uk: 'Наталія В.', en: 'Nataliia V.' },
    text: {
      uk: 'Пояснили, чому треба міняти стояки й підсилювати підлогу, і показали це на фото. Ванна стоїть рівно вже рік.',
      en: 'They explained why the risers and the floor had to be redone and showed it in photos. The tub has stood level for a year now.',
    },
  },
  {
    project: 'obolon-rental',
    rating: 4,
    author: { uk: 'Сергій П.', en: 'Serhii P.' },
    text: {
      uk: 'Зробили швидко й без зайвих витрат. Одну полицю довелося переробити, але виправили за день.',
      en: 'Fast and with no extra costs. One shelf had to be redone, but they fixed it in a day.',
    },
  },
  {
    project: 'pechersk-kitchen-living',
    rating: 5,
    author: { uk: 'Юлія Р.', en: 'Yuliia R.' },
    text: {
      uk: 'Кухню привезли й поставили за три дні, усе зійшлося до міліметра. Тепер увечері вся родина тут.',
      en: 'The kitchen arrived and went in within three days, everything fit to the millimetre. Now the whole family gathers here in the evening.',
    },
  },
]

export const faqs = [
  {
    question: {
      uk: 'Скільки коштує ремонт квартири?',
      en: 'How much does an apartment renovation cost?',
    },
    answer: {
      uk: 'Роботи коштують від 4 500 грн/м² за косметичний ремонт і від 9 800 грн/м² за капітальний. Матеріали рахуємо окремо. Точну суму фіксуємо в договорі після обмірів.',
      en: 'Labour starts at 4,500 UAH/m² for a cosmetic renovation and 9,800 UAH/m² for a full one. Materials are priced separately. The exact sum goes into the contract after measurements.',
    },
  },
  {
    question: {
      uk: 'Чи може змінитися ціна під час робіт?',
      en: 'Can the price change during the work?',
    },
    answer: {
      uk: 'Ні, якщо ви не змінюєте завдання. Будь-які додаткові роботи оформлюємо окремою угодою до їх початку.',
      en: 'No, unless you change the scope. Any extra work gets a separate agreement before it starts.',
    },
  },
  {
    question: { uk: 'Скільки триває ремонт?', en: 'How long does a renovation take?' },
    answer: {
      uk: 'Косметичний ремонт двокімнатної квартири займає 5–7 тижнів, капітальний — 12–16 тижнів. Графік ви отримуєте разом із договором.',
      en: 'A cosmetic renovation of a two-room flat takes 5–7 weeks, a full one 12–16 weeks. You get the schedule together with the contract.',
    },
  },
  {
    question: { uk: 'Хто купує матеріали?', en: 'Who buys the materials?' },
    answer: {
      uk: 'Як вам зручніше. Ми можемо закупити все самі зі знижками постачальників або дати точний список для самостійної покупки.',
      en: 'Whatever suits you. We can buy everything with our supplier discounts or give you an exact list to buy yourself.',
    },
  },
  {
    question: {
      uk: 'Як я дізнаюся, що відбувається на об’єкті?',
      en: 'How do I know what is happening on site?',
    },
    answer: {
      uk: 'Щоп’ятниці надсилаємо фотозвіт і план на наступний тиждень. Приховані роботи, як-от проводку й гідроізоляцію, фотографуємо до закриття.',
      en: 'Every Friday you get a photo report and next week’s plan. We photograph hidden work, such as wiring and waterproofing, before it is covered.',
    },
  },
  {
    question: { uk: 'Яка гарантія на роботи?', en: 'What warranty do you give?' },
    answer: {
      uk: 'Три роки на всі роботи. Якщо щось піде не так, приїдемо й виправимо безкоштовно.',
      en: 'Three years on all work. If something goes wrong, we come back and fix it for free.',
    },
  },
  {
    question: {
      uk: 'Чи можна жити в квартирі під час ремонту?',
      en: 'Can I live in the flat during the work?',
    },
    answer: {
      uk: 'Під час косметичного ремонту — частково, якщо працювати по кімнатах. Під час капітального краще переїхати: буде пил і без води кілька днів.',
      en: 'During a cosmetic renovation, partly, if we go room by room. For a full renovation it is better to move out: there will be dust and some days without water.',
    },
  },
  {
    question: { uk: 'Ви працюєте за межами Києва?', en: 'Do you work outside Kyiv?' },
    answer: {
      uk: 'Так, у Київській області в межах 40 км: Буча, Ірпінь, Бровари, Вишгород та інші.',
      en: 'Yes, within 40 km in the Kyiv region: Bucha, Irpin, Brovary, Vyshhorod and others.',
    },
  },
]

export const siteSettings = {
  phone: '+380 00 000 0000',
  email: 'hello@oselia-studio.example',
  address: { uk: 'вул. Вигадана, 1, Київ', en: '1 Fictional St, Kyiv' },
  hours: { uk: 'Пн–Пт 9:00–19:00, Сб 10:00–15:00', en: 'Mon–Fri 9:00–19:00, Sat 10:00–15:00' },
  stats: { years: 12, projects: 240, warranty: 3 },
}

export const pricing = {
  types: [
    {
      key: 'cosmetic' as const,
      pricePerSqm: 4500,
      description: {
        uk: 'Фарбування, шпалери, підлога, заміна дверей',
        en: 'Paint, wallpaper, flooring, new doors',
      },
    },
    {
      key: 'capital' as const,
      pricePerSqm: 9800,
      description: {
        uk: 'Демонтаж, стяжка, вирівнювання, чистове оздоблення',
        en: 'Demolition, screed, levelling, finishing',
      },
    },
    {
      key: 'designer' as const,
      pricePerSqm: 14500,
      description: {
        uk: 'Складні рішення: декоративна штукатурка, приховані двері, підсвітка',
        en: 'Complex details: decorative plaster, hidden doors, lighting',
      },
    },
  ],
  extras: [
    {
      key: 'design',
      price: 900,
      perSqm: true,
      label: { uk: 'Дизайн-проєкт', en: 'Interior design' },
    },
    {
      key: 'electrical',
      price: 1200,
      perSqm: true,
      label: { uk: 'Нова електрика', en: 'New wiring' },
    },
    {
      key: 'plumbing',
      price: 18000,
      perSqm: false,
      label: { uk: 'Заміна сантехніки', en: 'New plumbing' },
    },
    { key: 'demolition', price: 650, perSqm: true, label: { uk: 'Демонтаж', en: 'Demolition' } },
    {
      key: 'cleanup',
      price: 6500,
      perSqm: false,
      label: { uk: 'Вивіз сміття й прибирання', en: 'Waste removal and cleaning' },
    },
  ],
}

export const assistant = {
  greeting: {
    uk: 'Вітаю! Я асистент Oselia Studio. Підкажу орієнтовну вартість ремонту, відповім на питання й запишу на безкоштовний виїзд архітектора.',
    en: 'Hi! I am the Oselia Studio assistant. I can estimate the cost of your renovation, answer questions and book a free visit from our architect.',
  },
  visitInfo: {
    uk: 'Виїзд безкоштовний у Києві та області в межах 40 км. Архітектор приїжджає на 1–2 години: робить обміри й фото, обговорює побажання та бюджет. Кошторис надсилаємо протягом трьох робочих днів після виїзду.',
    en: 'The visit is free in Kyiv and up to 40 km around it. An architect comes for 1–2 hours to measure, take photos and talk through your wishes and budget. You get a cost estimate within three working days after the visit.',
  },
}
