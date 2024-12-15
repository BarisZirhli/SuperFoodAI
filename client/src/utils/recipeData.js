import { RECIPE_IMAGES } from './constants';

export const defaultRecipes = [
  {
    id: 1,
    title: 'Bal ve Soya Soslu Tavuklu Sebze Karışımı',
    image: RECIPE_IMAGES.KARNIBAHAR,
    isFavorite: false,
    ingredients: [
      '300 gram tavuk göğsü (şeritler halinde doğranmış)',
      '100 gram mantar (dilimlenmiş)',
      '1 küçük kabak (ince dilimlenmiş)',
      '1 yemek kaşığı bal',
      '2 yemek kaşığı soya sosu'
    ],
    instructions: 'Tavukları soya sosu, bal ve sarımsakla marine edin. Tavada zeytinyağını ısıtın, tavukları ekleyip pişirin. Mantar ve kabakları tavaya ekleyin. Tuz, karabiber ve taze fesleğen yaprakları ekleyin.'
  },
  {
    id: 2,
    title: 'Fırında Fesleğenli Tavuk ve Sebze Çeşnisi',
    image: RECIPE_IMAGES.TAVUK,
    isFavorite: true,
    ingredients: [
      '300 gram tavuk göğsü (küp şeklinde doğranmış)',
      '1 küçük kabak (ince dilimlenmiş)',
      '100 gram mantar (dilimlenmiş)',
      '1 adet domates (küp doğranmış)',
      '2 yemek kaşığı zeytinyağı'
    ],
    instructions: 'Fırını 180°C\'ye ısıtın. Tavuk ve sebzeleri zeytinyağı, sarımsak, tuz, karabiber ve otlarla harmanlayın. Karışımı bir fırın kabına yerleştirin ve 25-30 dakika pişirin.'
  },
  {
    id: 3,
    title: 'Bal ve Fesleğenli Tavuklu Kabak Makarna',
    image: RECIPE_IMAGES.MAKARNA,
    isFavorite: false,
    ingredients: [
      '200 gram tavuk göğsü (şeritler halinde doğranmış)',
      '1 küçük kabak (spiral halinde kesilmiş)',
      '1 yemek kaşığı bal',
      '1 yemek kaşığı soya sosu',
      '1 diş sarımsak (ezilmiş)'
    ],
    instructions: 'Tavukları bal, soya sosu ve sarımsakla marine edin. Tavada zeytinyağını ısıtın, tavukları ekleyip pişirin. Kabak spagettisini tavaya ekleyin. Tuz, karabiber ve taze fesleğen yaprakları ekleyin.'
  },
  {
    id: 4,
    title: 'Tavuklu ve Soya Soslu Mantar Dolması',
    image: RECIPE_IMAGES.MANTAR,
    isFavorite: false,
    ingredients: [
      '200 gram tavuk göğsü (şeritler halinde doğranmış)',
      '1 küçük kabak (spiral halinde kesilmiş)',
      '1 yemek kaşığı bal',
      '1 yemek kaşığı soya sosu',
      '1 diş sarımsak (ezilmiş)'
    ],
    instructions: 'Tavada tavukları soya sosu, bal ve sarımsakla birlikte pişirin. Daha sonra domates ve fesleğen ekleyin. Karışımı mantarların içine doldurun. 180°C\'de 10-15 dakika pişirin.'
  }
];

export const favoriteRecipes = [
  {
    id: 1,
    title: 'Fırında Kabak ve Patlıcan Graten',
    image: RECIPE_IMAGES.GRATEN,
    isFavorite: true,
    ingredients: [
      '2 adet kabak',
      '2 adet patlıcan',
      '2 domates',
      'Kaşar peyniri',
      'Zeytinyağı'
    ],
    instructions: 'Sebzeleri dilimleyin. Fırın kabına dizin. Üzerine domates sosu ve kaşar peyniri ekleyin. 200°C\'de 25-30 dakika pişirin.'
  },
  {
    id: 2,
    title: 'Fırında Sebzeli Karnıbahar',
    image: RECIPE_IMAGES.KARNIBAHAR,
    isFavorite: true,
    ingredients: [
      '1 adet karnıbahar',
      'Zeytinyağı',
      'Sarımsak',
      'Tuz ve karabiber'
    ],
    instructions: 'Karnıbaharı çiçeklerine ayırın. Zeytinyağı ve baharatlarla karıştırın. 200°C\'de 20-25 dakika pişirin.'
  },
  {
    id: 3,
    title: 'Biber Salatası',
    image: RECIPE_IMAGES.BIBER,
    isFavorite: true,
    ingredients: [
      'Renkli biberler',
      'Soğan',
      'Zeytinyağı',
      'Limon suyu'
    ],
    instructions: 'Biberleri ve soğanı ince doğrayın. Zeytinyağı ve limon suyu ile soslandırın. Tuz ve karabiber ekleyin.'
  },
  {
    id: 4,
    title: 'Etli Sebze Güveci',
    image: RECIPE_IMAGES.MANTAR,
    isFavorite: true,
    ingredients: [
      'Kuşbaşı et',
      'Patates',
      'Havuç',
      'Biber',
      'Domates'
    ],
    instructions: 'Tüm malzemeleri güveç kabına yerleştirin. Baharatları ekleyin. Kısık ateşte 1-1.5 saat pişirin.'
  }
];