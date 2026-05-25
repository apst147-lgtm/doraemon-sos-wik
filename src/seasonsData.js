export const CROPS_DATA = [
  // Spring
  { id: 's1', name: 'ผักกาดหอม', season: 'Spring', growDays: 5, buyPrice: 60, sellPrice: 150, icon: '🥬', reHarvest: false },
  { id: 's2', name: 'มันฝรั่ง', season: 'Spring', growDays: 8, buyPrice: 80, sellPrice: 220, icon: '🥔', reHarvest: false },
  { id: 's3', name: 'กะหล่ำปลี', season: 'Spring', growDays: 7, buyPrice: 110, sellPrice: 280, icon: '🥬', reHarvest: false },
  { id: 's4', name: 'สตรอว์เบอร์รี', season: 'Spring', growDays: 9, buyPrice: 160, sellPrice: 120, icon: '🍓', reHarvest: true, harvestInterval: 4 },
  { id: 's5', name: 'ดอกป็อปปี้', season: 'Spring', growDays: 6, buyPrice: 50, sellPrice: 140, icon: '🌺', reHarvest: false },
  
  // Summer
  { id: 'u1', name: 'ข้าวโพด', season: 'Summer', growDays: 9, buyPrice: 120, sellPrice: 110, icon: '🌽', reHarvest: true, harvestInterval: 4 },
  { id: 'u2', name: 'มะเขือเทศ', season: 'Summer', growDays: 8, buyPrice: 70, sellPrice: 90, icon: '🍅', reHarvest: true, harvestInterval: 3 },
  { id: 'u3', name: 'หอมหัวใหญ่', season: 'Summer', growDays: 7, buyPrice: 80, sellPrice: 210, icon: '🧅', reHarvest: false },
  { id: 'u4', name: 'สับปะรด', season: 'Summer', growDays: 12, buyPrice: 250, sellPrice: 850, icon: '🍍', reHarvest: false },
  { id: 'u5', name: 'แตงโม', season: 'Summer', growDays: 10, buyPrice: 180, sellPrice: 520, icon: '🍉', reHarvest: false },

  // Autumn
  { id: 'a1', name: 'มันเทศ', season: 'Autumn', growDays: 6, buyPrice: 60, sellPrice: 80, icon: '🍠', reHarvest: true, harvestInterval: 3 },
  { id: 'a2', name: 'มะเขือยาว', season: 'Autumn', growDays: 8, buyPrice: 70, sellPrice: 100, icon: '🍆', reHarvest: true, harvestInterval: 3 },
  { id: 'a3', name: 'แครอท', season: 'Autumn', growDays: 8, buyPrice: 100, sellPrice: 320, icon: '🥕', reHarvest: false },
  { id: 'a4', name: 'พริกหยวก', season: 'Autumn', growDays: 7, buyPrice: 90, sellPrice: 110, icon: '🫑', reHarvest: true, harvestInterval: 3 },
  { id: 'a5', name: 'ฟักทอง', season: 'Autumn', growDays: 10, buyPrice: 140, sellPrice: 480, icon: '🎃', reHarvest: false },

  // Winter
  { id: 'w1', name: 'หัวไชเท้า', season: 'Winter', growDays: 7, buyPrice: 110, sellPrice: 340, icon: '🥕', reHarvest: false },
  { id: 'w2', name: 'กะหล่ำดอก', season: 'Winter', growDays: 10, buyPrice: 150, sellPrice: 580, icon: '🥦', reHarvest: false },
  { id: 'w3', name: 'บรอกโคลี', season: 'Winter', growDays: 9, buyPrice: 120, sellPrice: 130, icon: '🥦', reHarvest: true, harvestInterval: 4 },
  { id: 'w4', name: 'ผักกาดขาว', season: 'Winter', growDays: 8, buyPrice: 90, sellPrice: 260, icon: '🥬', reHarvest: false },
];

export const WILD_PRODUCTS_DATA = [
  // Spring
  { id: 'fs1', name: 'หน่อไม้', season: 'Spring', sellPrice: 30, icon: '🎍', location: 'ภูเขา/ป่า', respawnDays: '1-2 วัน', recipes: ['ชิกุเซ็นนิ', 'ผัดผัก'] },
  { id: 'fs2', name: 'มักเวิร์ต', season: 'Spring', sellPrice: 15, icon: '🌿', location: 'ลานกว้าง', respawnDays: 'ทุกวัน', recipes: ['ดังโงะ'] },
  { id: 'fs3', name: 'ลูกพลัม', season: 'Spring', sellPrice: 40, icon: '🍒', location: 'ป่าผู่จี', respawnDays: '2-3 วัน', recipes: ['น้ำผลไม้รวม'] },
  { id: 'fs4', name: 'หญ้าหางม้า', season: 'Spring', sellPrice: 20, icon: '🌾', location: 'ริมแม่น้ำ', respawnDays: 'ทุกวัน', recipes: ['สลัดผัก'] },
  { id: 'fs5', name: 'ผักกูด', season: 'Spring', sellPrice: 35, icon: '🌿', location: 'ภูเขาซูซู', respawnDays: '2 วัน', recipes: ['โอเด้ง'] },
  { id: 'fs6', name: 'ลูกบ๊วย', season: 'Spring', sellPrice: 40, icon: '🍑', location: 'ป่าผู่จี', respawnDays: '2-3 วัน', recipes: ['แยมบ๊วย', 'เยลลี่'] },
  
  // Summer
  { id: 'fu1', name: 'ขิง', season: 'Summer', sellPrice: 40, icon: '🫚', location: 'ชายหาด/ป่า', respawnDays: 'ทุกวัน', recipes: ['หมูผัดขิง'] },
  { id: 'fu2', name: 'ว่านหางจระเข้', season: 'Summer', sellPrice: 25, icon: '🌵', location: 'ชายหาด', respawnDays: '2 วัน', recipes: ['น้ำผัก'] },
  { id: 'fu3', name: 'แอปริคอท', season: 'Summer', sellPrice: 50, icon: '🍑', location: 'ป่าผู่จี', respawnDays: '3 วัน', recipes: ['ฟรุตพั้นช์'] },
  { id: 'fu4', name: 'น้ำผึ้ง', season: 'Summer', sellPrice: 60, icon: '🍯', location: 'รังบนต้นไม้ (ป่า/ภูเขา)', respawnDays: 'สุ่มทุกวัน', recipes: ['แพนเค้ก'] },
  { id: 'fu5', name: 'เชอร์รี่', season: 'Summer', sellPrice: 50, icon: '🍒', location: 'ป่าผู่จี', respawnDays: '2 วัน', recipes: ['พายผลไม้', 'ฟรุตพั้นช์'] },

  // Autumn
  { id: 'fa1', name: 'เกาลัด', season: 'Autumn', sellPrice: 40, icon: '🌰', location: 'ภูเขาซูซู', respawnDays: 'ทุกวัน', recipes: ['มองบลังค์'] },
  { id: 'fa2', name: 'วอลนัท', season: 'Autumn', sellPrice: 45, icon: '🥥', location: 'ริมแม่น้ำ', respawnDays: 'ทุกวัน', recipes: ['คุกกี้'] },
  { id: 'fa3', name: 'แอปเปิ้ล', season: 'Autumn', sellPrice: 30, icon: '🍎', location: 'ป่าผู่จี (บนต้นไม้)', respawnDays: '3 วัน', recipes: ['พายแอปเปิ้ล', 'แยมแอปเปิ้ล'] },
  { id: 'fa4', name: 'เห็ดมัตสึทาเกะ', season: 'Autumn', sellPrice: 250, icon: '🍄', location: 'ภูเขาซูซู', respawnDays: '3-5 วัน', recipes: ['อาหารยอดเชฟ'] },
  { id: 'fa5', name: 'เห็ดหอม', season: 'Autumn', sellPrice: 30, icon: '🍄', location: 'ภูเขา/ป่า', respawnDays: '2 วัน', recipes: ['อาฮิโจ', 'รีซอตโต้'] },
  { id: 'fa6', name: 'ลูกแพร์', season: 'Autumn', sellPrice: 60, icon: '🍐', location: 'ภูเขาซูซู', respawnDays: '3 วัน', recipes: ['พายผลไม้'] },
  { id: 'fa7', name: 'ลูกพลับ', season: 'Autumn', sellPrice: 50, icon: '🍅', location: 'ป่าผู่จี', respawnDays: '3 วัน', recipes: ['นะมะสุ'] },

  // Winter
  { id: 'fw1', name: 'ทรัฟเฟิล', season: 'Winter', sellPrice: 600, icon: '🍄', location: 'ภูเขาซูซู (ต้องใช้หมูหา)', respawnDays: 'สุ่มทุกวัน', recipes: ['อาหารยอดเชฟ', 'ไข่เจียวทรัฟเฟิล'] },
  { id: 'fw2', name: 'ขิง', season: 'Winter', sellPrice: 40, icon: '🫚', location: 'ภูเขา', respawnDays: 'ทุกวัน', recipes: ['หมูผัดขิง'] },
  { id: 'fw3', name: 'ส้ม', season: 'Winter', sellPrice: 40, icon: '🍊', location: 'ภูเขา/ป่า', respawnDays: '3 วัน', recipes: ['มาร์มาเลด', 'น้ำผลไม้รวม'] },
];

export const FISHING_DATA = [
  // Spring
  { id: 'fi_s1', name: 'ปลาซากุระมาสุ', season: 'Spring', sellPrice: 180, icon: '🐟', location: 'แม่น้ำ', recipes: ['ปลาปิ้ง'] },
  { id: 'fi_s2', name: 'ปลาโดโจ', season: 'Spring', sellPrice: 40, icon: '🐟', location: 'บ่อน้ำ', recipes: ['เทมปุระ'] },
  { id: 'fi_s3', name: 'ปลาฟูนะ', season: 'Spring', sellPrice: 30, icon: '🐟', location: 'แม่น้ำ', recipes: ['ปลาปิ้ง'] },
  
  // Summer
  { id: 'fi_u1', name: 'ปลามาร์ลิน', season: 'Summer', sellPrice: 3500, icon: '🐠', location: 'ทะเล', recipes: ['มาร์ลินสเต็ก', 'อาหารยอดเชฟ'] },
  { id: 'fi_u2', name: 'ปลาอายุ', season: 'Summer', sellPrice: 120, icon: '🐟', location: 'แม่น้ำ', recipes: ['ปลาปิ้ง'] },
  { id: 'fi_u3', name: 'ปลาไหล', season: 'Summer', sellPrice: 200, icon: '🐍', location: 'แม่น้ำ (กลางคืน)', recipes: ['ข้าวหน้าปลาไหล'] },

  // Autumn
  { id: 'fi_a1', name: 'ปลาแซลมอน', season: 'Autumn', sellPrice: 250, icon: '🍣', location: 'แม่น้ำ', recipes: ['ซาชิมิ'] },
  { id: 'fi_a2', name: 'ปลาซันมะ', season: 'Autumn', sellPrice: 150, icon: '🐟', location: 'ทะเล', recipes: ['ปลาปิ้ง'] },
  { id: 'fi_a3', name: 'ปลาเทราต์', season: 'Autumn', sellPrice: 220, icon: '🐟', location: 'ภูเขา', recipes: ['มูนิแยร์'] },

  // Winter
  { id: 'fi_w1', name: 'ปลาวากาซากิ', season: 'Winter', sellPrice: 60, icon: '🐟', location: 'ทะเลสาบ', recipes: ['ปลาปิ้ง'] },
  { id: 'fi_w2', name: 'ปลาทูน่า', season: 'Winter', sellPrice: 1800, icon: '🐠', location: 'ทะเล', recipes: ['ซาชิมิ', 'เรือซาชิมิ'] },
  { id: 'fi_w3', name: 'ปลาปักเป้า', season: 'Winter', sellPrice: 450, icon: '🐡', location: 'ทะเล', recipes: ['ซาชิมิ'] },
];

export const CATEGORIES = [
  { id: 'crops', name: 'การเพาะปลูก', icon: '🌱' },
  { id: 'foraging', name: 'ของป่า', icon: '🍄' },
  { id: 'fishing', name: 'การตกปลา', icon: '🎣' },
];

export const FERTILIZERS = [
  { id: 'none', name: 'ไม่ใช้ปุ๋ย', icon: '❌', price: 0, speedBoost: 0, qualityBoost: 0, usageTip: 'รดน้ำปกติเพื่อให้พืชโตตามเวลามาตรฐาน' },
  { id: 'speed', name: 'ปุ๋ยเร่งโต', icon: '⚡', price: 40, speedBoost: 0.2, qualityBoost: 0, usageTip: 'ใส่เพียง 1 ครั้งในวันแรกที่ปลูกเพื่อลดเวลาเติบโต' },
  { id: 'quality', name: 'ปุ๋ยคุณภาพ', icon: '✨', price: 50, speedBoost: 0, qualityBoost: 0.2, usageTip: 'ควรใส่ทุกวันจนกว่าจะเก็บเกี่ยวเพื่อเพิ่มระดับดาว' },
  { id: 'premium', name: 'ปุ๋ยพรีเมียม', icon: '👑', price: 120, speedBoost: 0.2, qualityBoost: 0.4, usageTip: 'ใส่ครั้งเดียวเพื่อเร่งโต และใส่ทุกวันเพื่อเร่งดาว' },
];

export const SEASONS = [
  { id: 'Spring', label: 'ฤดูใบไม้ผลิ', icon: '🌸', color: '#FFD1DC', bg: 'bg-[#FFF5F7]', border: 'border-[#FFD1DC]', text: 'text-[#D6336C]' },
  { id: 'Summer', label: 'ฤดูร้อน', icon: '☀️', color: '#FFF3BF', bg: 'bg-[#FFF9DB]', border: 'border-[#FCC419]', text: 'text-[#E67E22]' },
  { id: 'Autumn', label: 'ฤดูใบไม้ร่วง', icon: '🍂', color: '#FFE8CC', bg: 'bg-[#FFF4E6]', border: 'border-[#FFA94D]', text: 'text-[#D9480F]' },
  { id: 'Winter', label: 'ฤดูหนาว', icon: '❄️', color: '#D0EBFF', bg: 'bg-[#E7F5FF]', border: 'border-[#74C0FC]', text: 'text-[#1971C2]' },
];