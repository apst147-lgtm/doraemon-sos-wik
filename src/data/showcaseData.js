// ─── Data for ShowcaseReel.jsx ───────────────────────────────────────────────

export const CHARS = [
  { id: 'shizuka', name: 'ชิซุกะ', p: '👧🏻', color: '#FF8AAE', cat: 'หลัก',
    bday: '8 ฤดูใบไม้ผลิ', fav: '🍠 มันเผา',
    favs: ['🍰 ชีสเค้ก', '🍠 มันเทศ', '🌼 เพนนีเดซี่'], dis: ['🐛 แมลง', '🐸 กบ'] },
  { id: 'doraemon', name: 'โดราเอมอน', p: '🐱', color: '#6BCBFF', cat: 'หลัก',
    bday: '28 ฤดูใบไม้ผลิ', fav: '🍘 โดรายากิ',
    favs: ['🍘 โดรายากิ', '🌻 ทานตะวัน', '🍉 แตงโม'], dis: ['🐭 หนู', '🗑️ ขยะ'] },
  { id: 'nobita', name: 'โนบิตะ', p: '👦🏻', color: '#FFD580', cat: 'หลัก',
    bday: '7 ฤดูใบไม้ผลิ', fav: '🍚 ข้าวต้ม',
    favs: ['🍚 ข้าวต้ม', '🍜 บะหมี่'], dis: ['🥦 ผัก', '📚 การบ้าน'] },
  { id: 'jaian', name: 'ไจแอ้น', p: '💪🏻', color: '#FF6B35', cat: 'หลัก',
    bday: '15 ฤดูร้อน', fav: '🍛 แกงกะหรี่',
    favs: ['🍛 แกงกะหรี่', '🍖 เนื้อย่าง'], dis: ['🎵 เพลงคนอื่น'] },
  { id: 'shopkeeper', name: 'เจ้าของร้านชำ', p: '👴🏻', color: '#82A07D', cat: 'ร้านค้า',
    bday: '12 ฤดูหนาว', fav: '🍵 ชาเขียว',
    favs: ['🍵 ชา', '🍡 ขนมพื้นเมือง'], dis: ['🔊 เสียงดัง'] },
  { id: 'blacksmith', name: 'ช่างตีเหล็ก', p: '👨🏻‍🔧', color: '#94A3B8', cat: 'ร้านค้า',
    bday: '3 ฤดูร้อน', fav: '🍺 เบียร์',
    favs: ['🍺 เบียร์', '🥩 เนื้อย่าง'], dis: ['🌧️ ฝน'] },
];

export const CROPS = [
  { name: 'กะหล่ำปลี', icon: '🥬', days: 7, sell: 350, buy: 50, profit: 300 },
  { name: 'สตรอว์เบอร์รี', icon: '🍓', days: 8, sell: 200, buy: 100, profit: 100, re: true },
  { name: 'มันฝรั่ง', icon: '🥔', days: 6, sell: 150, buy: 40, profit: 110 },
  { name: 'ทิวลิป', icon: '🌷', days: 6, sell: 120, buy: 60, profit: 60 },
];

export const FERTS = [
  { id: 'none', label: 'ไม่ใส่ปุ๋ย', icon: '—', boost: 0 },
  { id: 'basic', label: 'ปุ๋ยพื้นฐาน', icon: '🌿', boost: 10 },
  { id: 'speed', label: 'ปุ๋ยเร่ง', icon: '⚡', boost: 25 },
  { id: 'quality', label: 'ปุ๋ยคุณภาพ', icon: '⭐', boost: 0 },
];

export const RECIPES = [
  { id: 'dorayaki', name: 'โดรายากิ', icon: '🍘', equip: '🔥 เตาอบ', sell: 500, cost: 150, likedBy: ['โดราเอมอน'], ings: [{ n: 'แป้งสาลี', i: '🌾' }, { n: 'ถั่วแดง', i: '🫘' }, { n: 'น้ำผึ้ง', i: '🍯' }] },
  { id: 'curry', name: 'แกงกะหรี่', icon: '🍛', equip: '🍲 หม้อ', sell: 800, cost: 250, likedBy: ['ไจแอ้น'], ings: [{ n: 'ข้าว', i: '🍚' }, { n: 'มันฝรั่ง', i: '🥔' }, { n: 'แครอท', i: '🥕' }] },
  { id: 'smoothie', name: 'สมูทตี้', icon: '🥤', equip: '⚡ เครื่องปั่น', sell: 300, cost: 100, likedBy: ['ชิซุกะ'], ings: [{ n: 'สตรอว์เบอร์รี', i: '🍓' }, { n: 'นม', i: '🥛' }] },
  { id: 'corn_soup', name: 'ซุปข้าวโพด', icon: '🥣', equip: '🍲 หม้อ', sell: 400, cost: 120, likedBy: ['โดราเอมอน'], ings: [{ n: 'ข้าวโพด', i: '🌽' }, { n: 'นม', i: '🥛' }] },
];

export const SHOPS = [
  { name: 'ร้านขายของชำ', icon: '🧺', hours: '8:00–18:00', closed: 'อาทิตย์', color: '#F4A460' },
  { name: 'ร้านตีเหล็ก', icon: '⚒️', hours: '9:00–17:00', closed: 'พฤหัสบดี', color: '#94A3B8' },
  { name: 'คลินิก', icon: '🏥', hours: '9:00–18:00', closed: 'พุธ', color: '#FF8AAE' },
  { name: 'ร้านปลูกต้นไม้', icon: '🪴', hours: '8:00–17:00', closed: 'เสาร์', color: '#82A07D' },
];

export const MINING = [
  { tier: 'B1–B10', label: 'ชั้นตื้น', icon: '🪨', color: '#94A3B8', bg: '#F1F5F9', items: ['หินธรรมดา', 'ทองแดง'] },
  { tier: 'B11–B30', label: 'ชั้นกลาง', icon: '⚙️', color: '#82A07D', bg: '#F0FDF4', items: ['เหล็ก', 'เงิน'] },
  { tier: 'B31–B60', label: 'ชั้นลึก', icon: '💎', color: '#5B6CFF', bg: '#EEF2FF', items: ['ทอง', 'มิธริล'] },
  { tier: 'B61+', label: 'ชั้นพิเศษ', icon: '✨', color: '#D4A040', bg: '#FFFBEB', items: ['คริสตัล', 'แร่โบราณ'] },
];