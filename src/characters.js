const COMMON_DISLIKES = ['ขยะตกปลา', 'วัชพืช', 'กิ่งไม้ธรรมดาที่ยังไม่แปรรูป', 'อาหารที่ทำพลาด'];
const GIRL_DISLIKES = [...COMMON_DISLIKES, 'แมลง', 'กบ'];

export const CHARACTERS = [
  // --- กลุ่มเพื่อนโดราเอมอน ---
  {
    id: 'doraemon',
    name: 'โดราเอมอน',
    category: "ตัวละครหลัก",
    color: '#6BCBFF',
    bio: 'หุ่นยนต์แมวจากอนาคต ผู้หลงรักการกินแป้งทอดโดรายากิเป็นที่สุด',
    portrait: '🐱',
    favoriteItems: ['ดอกทานตะวัน', 'แตงโม'],
    specialFavorite: 'โดรายากิ',
    dislikedItems: COMMON_DISLIKES,
    birthday: '28 ฤดูใบไม้ผลิ',
    location: 'บ้านยาเม'
  },
  {
    id: 'shizuka',
    name: 'ชิซุกะ',
    category: "ตัวละครหลัก",
    color: '#FF8AAE',
    bio: 'สาวน้อยผู้ใจดีและรักสะอาด ทำงานอยู่ที่โรงพยาบาล',
    portrait: '👧🏻',
    favoriteItems: ['ชีสเค้ก', 'มันเทศ', 'ดอกเพนนีเดซี่'],
    specialFavorite: 'มันเผา',
    dislikedItems: GIRL_DISLIKES, // 'แมลงทุกชนิด' is already covered by 'แมลง' in GIRL_DISLIKES
    birthday: '8 ฤดูใบไม้ผลิ',
    location: 'โรงพยาบาล'
  },
  {
    id: 'gian',
    name: 'ไจแอนท์',
    category: "ตัวละครหลัก",
    color: '#FF6B6B',
    bio: 'ผู้มีพลังมหาศาลและความฝันที่จะเป็นนักร้อง ทำงานอยู่ที่ร้านตีเหล็ก',
    portrait: '👦🏻',
    favoriteItems: ['ไม้ธรรมดา', 'สตูว์', 'แมลงตั๊กแตน'],
    specialFavorite: 'แกงกะหรี่',
    dislikedItems: COMMON_DISLIKES,
    birthday: '15 ฤดูร้อน',
    location: 'ร้านตีเหล็ก'
  },
  {
    id: 'suneo',
    name: 'ซูเนโอะ',
    category: "ตัวละครหลัก",
    color: '#4D96FF',
    bio: 'เด็กชายผู้ร่ำรวยที่ชอบอวดของเล่น ทำงานอยู่ที่ร้านอาหาร',
    portrait: '🧒🏻',
    favoriteItems: ['สเต็กปลา', 'เมลอน'],
    specialFavorite: 'ไข่ทรัฟเฟิล',
    dislikedItems: [...COMMON_DISLIKES, 'ของป่าที่เก็บจากพื้นบางชนิด'],
    birthday: '28 ฤดูใบไม้ผลิ',
    location: 'ร้านอาหาร'
  },

  // --- บ้านนายกเทศมนตรี ---
  {
    id: 'yame',
    name: 'รียัม (ยาเม)',
    category: "บ้านนายกเทศมนตรี",
    color: '#8D6E63',
    bio: 'นายกเทศมนตรีเมืองเนทูระ ผู้เข้มงวดและมีระเบียบวินัย',
    portrait: '👴🏻',
    favoriteItems: ['หัวไชเท้า', 'เห็ดมัตสึทาเกะ', 'อัญมณีรูบี้'],
    specialFavorite: 'ซาชิมิชุดใหญ่',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'บ้านนายกเทศมนตรี'
  },
  {
    id: 'rem',
    name: 'เรม (น้องเรม)',
    category: "บ้านนายกเทศมนตรี",
    color: '#6BCBFF',
    bio: 'เด็กน้อยผู้อาศัยอยู่ที่บ้านนายกเทศมนตรี เป็นเพื่อนเล่นกับโนบิตะ',
    portrait: '👦🏻',
    favoriteItems: ['ดอกแดนดิไลออน', 'ขนแกะ'],
    specialFavorite: 'พุดดิ้ง',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'บ้านนายกเทศมนตรี'
  },

  // --- บ้านฟาร์ม ---
  {
    id: 'ranchi',
    name: 'รันจิ',
    category: "บ้านฟาร์ม",
    color: '#A0D995',
    bio: 'หลานของคุณย่าพาสชี่ เป็นคนแรกที่พบกับกลุ่มของโนบิตะ',
    portrait: '👦🏻',
    favoriteItems: ['ปุ๋ย', 'ดอกพิงค์', 'สลัดฤดูใบไม้ร่วง'],
    specialFavorite: 'นามะสึ',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'บ้านรันจิ'
  },
  {
    id: 'passchy',
    name: 'คุณย่าพาสชี่',
    category: "บ้านฟาร์ม",
    color: '#FFD966',
    bio: 'คุณย่าผู้ใจดี ผู้ให้คำแนะนำเรื่องการทำฟาร์ม',
    portrait: '👵🏻',
    favoriteItems: ['ข้าวสาลี', 'ดอกคาร์เนชั่น'],
    specialFavorite: 'คาร์ปาชโช่',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'บ้านรันจิ'
  },

  // --- ร้านช่างไม้ ---
  {
    id: 'pant',
    name: 'แพนท์',
    category: "ร้านช่างไม้",
    color: '#D4ADFC',
    bio: 'หัวหน้าช่างไม้ประจำเมืองเนทูระ',
    portrait: '🔨',
    favoriteItems: ['ไม้เนื้อแข็ง', 'โอเด้ง'],
    specialFavorite: 'อุด้ง',
    dislikedItems: COMMON_DISLIKES,
    birthday: '5 ฤดูใบไม้ร่วง',
    location: 'ร้านป๊อกป๊อกป๊อก'
  },
  {
    id: 'ram',
    name: 'รัม (เจมม่า)',
    category: "ร้านช่างไม้",
    color: '#FFCCB3',
    bio: 'ลูกสาวของช่างไม้แพนท์ ผู้ร่าเริงและเป็นมิตร',
    portrait: '👩‍🌾',
    favoriteItems: ['แครอท', 'พุดดิ้ง', 'ดอกเพนนีเดซี่'],
    specialFavorite: 'ทาร์ตแอปเปิล',
    dislikedItems: GIRL_DISLIKES,
    birthday: '??',
    location: 'ร้านป๊อกป๊อกป๊อก'
  },

  // --- ร้านตีเหล็ก ---
  {
    id: 'smitty',
    name: 'สมีตตี้',
    category: "ร้านตีเหล็ก",
    color: '#829460',
    bio: 'ช่างตีเหล็กผู้เชี่ยวชาญ คอยอัปเกรดเครื่องมือให้พวกเรา',
    portrait: '⚒️',
    favoriteItems: ['แร่ทองแดง', 'นามะสึ'],
    specialFavorite: 'ปลาคัตสึโอะย่าง',
    dislikedItems: COMMON_DISLIKES,
    birthday: '10 ฤดูหนาว',
    location: 'ร้านกิ๊งก๊องแก๊ง'
  },
  {
    id: 'block',
    name: 'บล็อก',
    category: "ร้านตีเหล็ก",
    color: '#7895B2',
    bio: 'หลานชายของช่างตีเหล็กสมีตตี้',
    portrait: '🧒🏻',
    favoriteItems: ['แร่เหล็ก', 'แตงกวา'],
    specialFavorite: 'อะฮิโญ่',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'ร้านกิ๊งก๊องแก๊ง'
  },

  // --- ร้านขายไก่ ---
  {
    id: 'helen',
    name: 'เฮเลน',
    category: "ร้านขายไก่",
    color: '#FFADAD',
    bio: 'เจ้าของร้านขายไก่เอ้กอีเอ้กเฮ้าส์',
    portrait: '🐔',
    favoriteItems: ['สตรอเบอร์รี่', 'ปลาทอง', 'ไข่ไก่'],
    specialFavorite: 'ขนมปังวอลนัท',
    dislikedItems: GIRL_DISLIKES,
    birthday: '4 ฤดูใบไม้ร่วง',
    location: 'ร้านเอ้กอีเอ้กเฮ้าส์'
  },
  {
    id: 'chick',
    name: 'ชิค (ฮาร์มอน)',
    category: "ร้านขายไก่",
    color: '#FFF9B0',
    bio: 'เด็กชายจากร้านขายไก่ มีความรับผิดชอบสูง',
    portrait: '👦🏻',
    favoriteItems: ['อาหารสัตว์', 'มันฝรั่ง', 'ดอกทานตะวัน'],
    specialFavorite: 'เทมปุระ',
    dislikedItems: COMMON_DISLIKES,
    birthday: '22 ฤดูใบไม้ผลิ',
    location: 'ร้านเอ้กอีเอ้กเฮ้าส์'
  },

  // --- คลินิก ---
  {
    id: 'locod',
    name: 'หมอโลค็อด',
    category: "สถานพยาบาล",
    color: '#FF9B9B',
    bio: 'หมอประจำเมืองเนทูระ ผู้เคร่งขรึมและมีรสนิยมแปลกปะหลาด',
    portrait: '👨‍⚕️',
    favoriteItems: ['เครื่องเทศ', 'ผัดผัก'],
    specialFavorite: 'อาหารประหลาด',
    dislikedItems: [],
    birthday: '11 ฤดูหนาว',
    location: 'โรงพยาบาล'
  },
  {
    id: 'serena',
    name: 'พยาบาลเซเรน่า',
    category: "สถานพยาบาล",
    color: '#F9B5D0',
    bio: 'พยาบาลผู้อ่อนโยน คอยช่วยเหลือคุณหมอ',
    portrait: '👩‍⚕️',
    favoriteItems: ['ดอกกุหลาบแดง', 'ว่านหางจระเข้'],
    specialFavorite: 'ชอร์ตเค้ก',
    dislikedItems: GIRL_DISLIKES,
    birthday: '23 ฤดูใบไม้ร่วง',
    location: 'โรงพยาบาล'
  },

  // --- ร้านขายสัตว์ / ของชำ ---
  {
    id: 'blue',
    name: 'บลู (คาเฟต)',
    category: "ร้านขายสัตว์ / ของชำ",
    color: '#E2F0D9',
    bio: 'เจ้าของร้านสัตว์เลี้ยงที่มีจิตใจอ่อนโยน',
    portrait: '🐶',
    favoriteItems: ['แอปเปิล', 'ฟักทอง', 'อาหารสัตว์'],
    specialFavorite: 'แซนด์วิช',
    dislikedItems: COMMON_DISLIKES,
    birthday: '12 ฤดูใบไม้ผลิ',
    location: 'ร้านกูเตมอค'
  },
  {
    id: 'henson',
    name: 'เฮนสัน',
    category: "ร้านขายสัตว์ / ของชำ",
    color: '#FFDEB4',
    bio: 'คุณลุงที่คอยดูแลและให้ความรู้เรื่องสัตว์',
    portrait: '👴🏻',
    favoriteItems: ['ชีส', 'กราแตง'],
    specialFavorite: 'ฟริตเตอร์',
    dislikedItems: COMMON_DISLIKES,
    birthday: '1 ฤดูร้อน',
    location: 'ร้านสัตว์'
  },
  
  // --- ร้านอาหาร ---
  {
    id: 'tuto',
    name: 'ทูโต',
    category: "ร้านอาหาร",
    color: '#FFCCB3',
    bio: 'เจ้าของร้านอาหารผู้รังสรรค์เมนูอร่อย',
    portrait: '👨‍🍳',
    favoriteItems: ['นม', 'บ๊วย'],
    specialFavorite: 'ปลาต้มหัวไชเท้า',
    dislikedItems: COMMON_DISLIKES,
    birthday: '17 ฤดูหนาว',
    location: 'ร้านอาหาร'
  },
  {
    id: 'ruro',
    name: 'รูโร',
    category: "ร้านอาหาร",
    color: '#B9E0FF',
    bio: 'พนักงานประจำร้านอาหาร ผู้เงียบขรึม',
    portrait: '🤵🏻',
    favoriteItems: ['ถั่วลันเตา', 'ดอกไอริส'],
    specialFavorite: 'ปลาคาร์พต้ม',
    dislikedItems: COMMON_DISLIKES,
    birthday: '1 ฤดูใบไม้ร่วง',
    location: 'ร้านง่ำง่ำ'
  },

  // --- ชาวเมืองคนอื่นๆ ---
  {
    id: 'seffy',
    name: 'ซีฟี่',
    category: "ชาวเมืองเนทูระ",
    color: '#91D8E4',
    bio: 'นักตกปลาผู้ยิ่งใหญ่ ชื่นชอบท้องทะเลและปลาอินทรี',
    portrait: '🎣',
    favoriteItems: ['เหยื่อตกปลา', 'ฟืน', 'ปลาหมึก'],
    specialFavorite: 'ปลาอินทรี',
    dislikedItems: COMMON_DISLIKES,
    birthday: '13 ฤดูหนาว',
    location: 'ร้านอุปกรณ์ตกปลา'
  },
  {
    id: 'cooper',
    name: 'คูเปอร์',
    category: "ชาวเมืองเนทูระ",
    color: '#FFF5E4',
    bio: 'เด็กน้อยผู้รักการจับแมลง',
    portrait: '🦗',
    favoriteItems: ['มายองเนส', 'ด้วงกว่าง', 'นมสตรอเบอร์รี่'],
    specialFavorite: 'ตั๊กแตนตำข้าว',
    dislikedItems: COMMON_DISLIKES,
    birthday: '18 ฤดูหนาว',
    location: 'ทางเข้าเมือง'
  },
  {
    id: 'vera',
    name: 'เทพธิดาเวร่า',
    category: "ชาวเมืองเนทูระ",
    color: '#97DECE',
    bio: 'จิตวิญญาณแห่งพฤกษาผู้พิทักษ์รักษาต้นไม้ใหญ่',
    portrait: '🧚',
    favoriteItems: ['กะหล่ำปลี', 'โยเกิร์ต'],
    specialFavorite: 'ผลไม้แช่อิ่ม',
    dislikedItems: GIRL_DISLIKES,
    birthday: '??',
    location: 'ต้นไม้ใหญ่'
  },

  // --- สัตว์ป่า ---
  {
    id: 'bear',
    name: 'หมี',
    category: "สัตว์ป่า",
    color: '#8D6E63',
    bio: 'เจ้าป่าตัวใหญ่ ผูกมิตรด้วยปลาแซลมอน',
    portrait: '🐻',
    favoriteItems: ['หน่อไม้', 'วอลนัท'],
    specialFavorite: 'ปลาแซลมอน',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'ภูเขา / ป่า'
  },
  {
    id: 'monkey',
    name: 'ลิง',
    category: "สัตว์ป่า",
    color: '#D4A373',
    bio: 'เจ้าจอมซนแห่งพงไพร ชอบกินแอปเปิลที่สุด',
    portrait: '🐒',
    favoriteItems: ['มันฝรั่ง'],
    specialFavorite: 'แอปเปิล',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'ภูเขา / ป่าผู่จี'
  },
  {
    id: 'rabbit',
    name: 'กระต่าย',
    category: "สัตว์ป่า",
    color: '#F0EAD6',
    bio: 'สัตว์ตัวน้อยหูยาวสุดแสนจะขี้อาย',
    portrait: '🐰',
    favoriteItems: ['ข้าวโพด', 'กะหล่ำปลี', 'แอปเปิล'],
    specialFavorite: 'แครอท',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'ลานกว้าง / ป่าผู่จี'
  },
  {
    id: 'squirrel',
    name: 'กระรอก',
    category: "สัตว์ป่า",
    color: '#E67E22',
    bio: 'กระรอกน้อยหางฟูที่ว่องไวมาก',
    portrait: '🐿️',
    favoriteItems: ['อัลมอนด์'],
    specialFavorite: 'วอลนัท',
    dislikedItems: COMMON_DISLIKES,
    birthday: '??',
    location: 'ป่าผู่จี / ภูเขาซูซู'
  }
];

export const getCharacterByName = (name) => CHARACTERS.find(c => c.name.includes(name));