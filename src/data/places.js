/**
 * Дані місць для відвідування (Варіант 24)
 * Типи: пляжі, гірські курорти, міста
 */
export const PLACE_TYPES = {
  beach: 'Пляжі',
  mountain: 'Гірські курорти',
  city: 'Міста',
  nature: 'Природа',
};

export const places = [
  {
    id: 1,
    title: 'Одеса',
    type: 'beach',
    description: 'Чорне море, Аркадія, пляжі та набережна.',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&h=300&fit=crop',
    cost: 1500,
  },
  {
    id: 2,
    title: 'Буковель',
    type: 'mountain',
    description: 'Гірськолижний курорт, Карпати.',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&h=300&fit=crop',
    cost: 3200,
  },
  {
    id: 3,
    title: 'Львів',
    type: 'city',
    description: 'Старе місто, кав\'ярні, архітектура.',
    image: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=400&h=300&fit=crop',
    cost: 1800,
  },
  {
    id: 4,
    title: 'Кам\'янка',
    type: 'beach',
    description: 'Пляж на Дніпрі, відпочинок біля води.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    cost: 800,
  },
  {
    id: 5,
    title: 'Славське',
    type: 'mountain',
    description: 'Гори, лижі, трекінг у Карпатах.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
    cost: 2500,
  },
  {
    id: 6,
    title: 'Київ',
    type: 'city',
    description: 'Столиця, Хрещатик, Софія, Печерська лавра.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop',
    cost: 2200,
  },
  {
    id: 7,
    title: 'Шацькі озера',
    type: 'nature',
    description: 'Озера, ліси, кемпінг та рибалка.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    cost: 1200,
  },
  {
    id: 8,
    title: 'Закарпаття',
    type: 'mountain',
    description: 'Гори, замки, вино та термальні джерела.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    cost: 2800,
  },
];
