import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from './utils'; // Assuming cn utility is available

// --- Mock Data for Showcase ---
// (Ideally, this would be imported from central data files, but for a standalone showcase, mock data here is fine)
const MOCK_CHARACTERS = {
  shizuka: {
    id: 'shizuka', name: 'ชิซุกะ', portrait: '👧🏻', color: '#FF8AAE',
    bio: 'สาวน้อยผู้ใจดีและรักสะอาด ทำงานอยู่ที่โรงพยาบาล',
    birthday: '8 ฤดูใบไม้ผลิ', specialFavorite: 'มันเผา',
    favoriteItems: ['ชีสเค้ก', 'มันเทศ', 'ดอกเพนนีเดซี่'],
    dislikedItems: ['แมลงทุกชนิด', 'กบ', 'ขยะ'] // Specific for showcase, not using global GIRL_DISLIKES_SHOWCASE
  },
  doraemon: {
    id: 'doraemon', name: 'โดราเอมอน', portrait: '🐱', color: '#6BCBFF',
    bio: 'หุ่นยนต์แมวจากอนาคต ผู้หลงรักการกินแป้งทอดโดรายากิเป็นที่สุด',
    birthday: '28 ฤดูใบไม้ผลิ', specialFavorite: 'โดรายากิ',
    favoriteItems: ['ดอกทานตะวัน', 'แตงโม'],
    dislikedItems: ['ขยะตกปลา', 'วัชพืช']
  }, // No Nobi, Gian, Suneo for simplicity in showcase
};

const MOCK_CROPS = {
  cabbage: {
    id: 'cabbage', name: 'กะหล่ำปลี', icon: '🥬', season: 'Spring', growDays: 7, reHarvest: false, sellPrice: 3500, buyPrice: 500,
    profitPerDay: 500, likedBy: ['เทพธิดาเวร่า'] // Corrected profitPerDay
  },
  strawberry: {
    id: 'strawberry', name: 'สตรอว์เบอร์รี', icon: '🍓', season: 'Spring', growDays: 8, reHarvest: true, harvestInterval: 3, sellPrice: 200, buyPrice: 100,
    profitPerDay: 150, likedBy: ['เฮเลน', 'รัม']
  }
};

const MOCK_SHOPS = {
  blacksmith: {
    id: 'blacksmith', name: 'ร้านตีเหล็ก', icon: '⚒️', hours: '9:00 - 17:00', closed: 'พฤหัสบดี',
    items: ['แร่เหล็ก', 'แร่ทองแดง', 'แร่เงิน', 'แร่ทอง']
  },
  general_store: {
    id: 'general_store', name: 'ร้านขายของชำ', icon: '🧺', hours: '8:00 - 18:00', closed: 'อาทิตย์',
    items: ['เมล็ดพืช', 'ปุ๋ย', 'น้ำตาล', 'เกลือ']
  }
};

const MOCK_RECIPES = {
  dorayaki: {
    id: 'dorayaki', name: 'โดรายากิ', icon: '🍘', equipment: 'เตาอบ', // Corrected equipment
    ingredients: [{ name: 'แป้งสาลี', icon: '🌾', source: 'ร้านขายของชำ' }, { name: 'ถั่วแดง', icon: '🫘', source: 'ร้านขายของชำ' }],
    sell: 500, cost: 150, likedBy: ['โดราเอมอน'], tips: 'ของโปรดโดราเอมอน! ทำเยอะๆ ได้เลย'
  },
  curry: {
    id: 'curry', name: 'แกงกะหรี่', icon: '🍛', equipment: 'หม้อ', // Corrected equipment
    ingredients: [{ name: 'ข้าว', icon: '🍚', source: 'ร้านขายของชำ' }, { name: 'มันฝรั่ง', icon: '🥔', source: 'ปลูก' }, { name: 'แครอท', icon: '🥕', source: 'ปลูก' }],
    sell: 800, cost: 250, likedBy: ['ไจแอนท์'], tips: 'เมนูโปรดของไจแอนท์! เพิ่มความสัมพันธ์ได้ดี'
  },
  corn_soup: {
    id: 'corn_soup', name: 'ซุปข้าวโพด', icon: '🥣', equipment: 'เครื่องปั่น',
    ingredients: [{ name: 'ข้าวโพด', icon: '🌽', source: 'ปลูก' }, { name: 'นม', icon: '🥛', source: 'ฟาร์มสัตว์' }],
    sell: 400, cost: 120, likedBy: ['โดราเอมอน'], tips: 'ทำง่ายและเป็นของชอบของโดราเอมอน'
  },
  fruit_smoothie: {
    id: 'fruit_smoothie', name: 'สมูทตี้ผลไม้', icon: '🥤', equipment: 'เครื่องปั่น',
    ingredients: [{ name: 'สตรอว์เบอร์รี', icon: '🍓', source: 'ปลูก' }, { name: 'แอปเปิล', icon: '🍎', source: 'เก็บของป่า' }],
    sell: 300, cost: 100, likedBy: ['ชิซุกะ'], tips: 'เครื่องดื่มสดชื่น เหมาะกับฤดูร้อน'
  }
};

const MOCK_ITEMS = {
  sweet_potato: {
    name: 'มันเทศ', icon: '🍠', source: 'Foraging', season: 'ฤดูใบไม้ร่วง', location: 'ป่าผู่จี', sellPrice: 120, buyPrice: 0,
    note: 'หาได้ตามพื้นดินในฤดูใบไม้ร่วง'
  },
  marlin: {
    name: 'ปลาอินทรี', icon: '🐟', source: 'Fishing', season: 'ฤดูร้อน', location: 'ชายหาดซาซา', sellPrice: 1500, buyPrice: 0,
    note: 'ปลาหายากในฤดูร้อน ตกได้ที่ชายหาด', likedBy: ['ซีฟี่']
  }
};

const MOCK_EVENTS = {
  spring: {
    id: 'spring', name: 'ฤดูใบไม้ผลิ', icon: '🌸',
    events: [
      { day: 1, name: 'เทศกาลปีใหม่', type: 'festival' },
      { day: 8, name: 'วันเกิดชิซุกะ', type: 'birthday', target: 'ชิซุกะ' },
      { day: 15, name: 'เทศกาลดอกไม้', type: 'festival' }
    ]
  },
  winter: {
    id: 'winter', name: 'ฤดูหนาว', icon: '❄️',
    events: [
      { day: 1, name: 'เทศกาลหิมะ', type: 'festival' },
      { day: 10, name: 'วันเกิดสมีตตี้', type: 'birthday', target: 'สมีตตี้' },
      { day: 25, name: 'เทศกาลคริสต์มาส', type: 'festival' }
    ]
  }
};

const SOURCE_ICONS = {
  Foraging: '🌳', Fishing: '🎣', Mining: '⛏️', Planting: '🌱', 'ร้านขายของชำ': '🧺', 'ฟาร์มสัตว์': '🐄', 'ไม่ระบุ': '❓'
};
const STAR_RATINGS = [{ label: '0.5 ดาว', multiplier: 1 }, { label: '1 ดาว', multiplier: 1.2 }, { label: '1.5 ดาว', multiplier: 1.4 }, { label: '2 ดาว', multiplier: 1.6 }, { label: '2.5 ดาว', multiplier: 1.8 }, { label: '3 ดาว', multiplier: 2 }];

/**
 * TypingEffect Component
 * จำลองการพิมพ์ข้อความทีละตัวอักษร
 */
const TypingEffect = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="border-r-4 border-[#F4A460] pr-1 animate-pulse">
      {displayedText}
    </span>
  );
};

/**
 * SearchSimulation Component
 * จำลองช่องค้นหาเพื่อให้เห็นภาพการพิมพ์
 */
const SearchSimulation = ({ text, label = "Quick Search" }) => (
  <div className="flex flex-col items-center gap-4">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C7E6A] opacity-50">{label}</span>
    <div className="bg-white border-2 border-[#F3DCC1] rounded-[32px] px-8 py-5 flex items-center gap-5 w-[450px] shadow-xl">
      <span className="text-2xl opacity-30">🔍</span>
      <div className="text-3xl font-light tracking-tight text-[#1A1A1A] lowercase">
        <TypingEffect text={text} speed={80} />
      </div>
      <div className="ml-auto w-[2px] h-8 bg-[#F4A460] animate-pulse"></div>
    </div>
  </div>
);

/**
 * MouseCursor Component
 * จำลองลูกศรเม้าส์ที่ขยับไปมา
 */
const MouseCursor = ({ target }) => (
  <motion.div
    animate={target}
    initial={{ x: '90vw', y: '90vh', opacity: 0 }}
    transition={{ type: "spring", stiffness: 60, damping: 20 }}
    className="fixed z-[11000] pointer-events-none"
  >
    <motion.svg 
      animate={target.click ? { scale: [1, 0.8, 1] } : {}}
      width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.65376 12.3822L15.127 15.3458C16.327 15.7208 17.2791 14.7687 16.9041 13.5687L13.9405 4.09545C13.4863 2.64212 11.4396 2.58587 10.9063 4.01712L8.91043 9.3392L3.58835 11.335C2.15709 11.8683 2.20043 13.915 3.65376 14.3692L5.65376 12.3822Z" fill="#1A1A1A" stroke="white" strokeWidth="2"/>
      {target.click && (
        <motion.circle 
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.5 }}
          cx="12" cy="12" r="8" stroke="#F4A460" strokeWidth="2" fill="none"
        />
      )}
    </motion.svg>
  </motion.div>
);

const SCENES = [
  // --- 3 ซีนแรกเน้น Typography ที่ทรงพลัง ---
  { type: 'hero-text', content: 'สวัสดี', sub: 'ชาวฟาร์ม', duration: 1000 },
  { type: 'hero-text', content: 'นี่คือ', sub: 'GALABON WIKI', highlight: true, duration: 1000 },
  { type: 'hero-text', content: 'บันทึก', sub: 'แห่งกัลลาบอน', highlight: true, duration: 1500 },
  
  // --- Simulated Actions ---

  // Action 1: Search for Characters
  {
    type: 'simulate-search',
    text: 'shizuka',
    cursor: { x: '50vw', y: '50vh', opacity: 1, click: false },
    duration: 3000
  },

  // Dual Character Preview (Shizuka & Doraemon)
  { 
    type: 'preview-dual-character', 
    charIds: ['shizuka', 'doraemon'],
    cursor: { x: '35vw', y: '45vh', opacity: 1, click: true },
    duration: 5000 
  },
  
  // Action 2: Check Shops
  {
    type: 'simulate-search',
    text: 'ร้านตีเหล็ก',
    label: 'Checking Shop Hours',
    cursor: { x: '50vw', y: '50vh', opacity: 1, click: false },
    duration: 3000
  },

  {
    type: 'preview-dual-shop',
    shopIds: ['blacksmith', 'general_store'],
    cursor: { x: '65vw', y: '45vh', opacity: 1, click: true },
    duration: 5000
  },

  // Action 3: Crop Planning
  {
    type: 'simulate-search',
    text: 'strawberry',
    label: 'Crop Profit Analysis',
    cursor: { x: '50vw', y: '50vh', opacity: 1, click: false },
    duration: 3000
  },

  { 
    type: 'preview-dual-crop', 
    cropIds: ['cabbage', 'strawberry'],
    cursor: { x: '65vw', y: '55vh', opacity: 1, click: true },
    duration: 5000 
  },
  
  // Action 4: Calendar Events
  {
    type: 'preview-dual-calendar',
    events: [{ seasonId: 'spring', eventDay: 8 }, { seasonId: 'winter', eventDay: 25 }],
    cursor: { x: '50vw', y: '60vh', opacity: 1, click: true },
    duration: 5000 
  },

  // Action 5: Detailed Recipe Search
  {
    type: 'simulate-search',
    text: 'dorayaki',
    label: 'Recipe Secret Guide',
    cursor: { x: '50vw', y: '50vh', opacity: 1, click: false },
    duration: 3000
  },

  { 
    type: 'preview-dual-modal', 
    recipeIds: ['dorayaki', 'curry'], 
    cursor: { x: '35vw', y: '50vh', opacity: 1, click: true },
    duration: 5000 
  },

  // --- Final Text Scenes ---
  { type: 'text', content: 'ข้อมูลครบถ้วน แม่นยำ', duration: 2000 },
  { type: 'text', content: 'อัปเดตตลอดเวลา', duration: 2000 },
  { type: 'text', content: 'ดีไซน์มินิมอล ใช้งานง่าย', duration: 2000 },

  // Final CTA
  { type: 'cta', content: 'DORAEMON SoS', sub: 'WIKI DATABASE', description: 'ข้อมูลครบถ้วน แม่นยำ ใช้งานง่าย' }
];

const ShowcaseReel = ({ onFinish }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (currentScene < SCENES.length - 1) {
      const timer = setTimeout(() => {
        setFlash(true);
        setCurrentScene((prev) => prev + 1);
        setTimeout(() => setFlash(false), 100);
      }, SCENES[currentScene].duration || 2000);
      return () => clearTimeout(timer);
    } else if (currentScene === SCENES.length - 1 && SCENES[currentScene].type !== 'cta') {
      const timer = setTimeout(onFinish, SCENES[currentScene].duration || 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScene, onFinish]);

  const handleClose = () => {
    setTimeout(onFinish, 500);
  };

  const scene = SCENES[currentScene];
  const prefersReducedMotion = useReducedMotion();

  // Variants สำหรับ Dynamic Transitions
  const sceneVariants = {
    initial: { scale: prefersReducedMotion ? 1 : 0.7, opacity: 0, y: prefersReducedMotion ? 0 : 100, rotate: prefersReducedMotion ? 0 : -5 },
    animate: { scale: 1, opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
    exit: { scale: 1.3, opacity: 0, y: -100, rotate: 5, transition: { duration: 0.2 } }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#FFF9F0] flex items-center justify-center overflow-hidden font-black uppercase">
      {/* Screen Flash Effect */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-[12000] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Mouse Cursor Emulation */}
      <MouseCursor target={scene.cursor || { opacity: 0 }} />

      {/* Skip Button */}
      <button 
        onClick={handleClose}
        className="absolute top-10 right-10 text-[10px] tracking-[0.4em] text-[#5D4037]/40 hover:text-[#5D4037] transition-all z-50 px-5 py-2 border border-[#5D4037]/10 rounded-full hover:bg-[#5D4037] hover:text-[#FFF9F0] active:scale-95" // Added active state
      >
        SKIP REEL
      </button>

      <AnimatePresence mode="popLayout">
        {scene.type === 'simulate-search' && (
          <motion.div
            key={`search-${currentScene}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10"
          >
            <SearchSimulation text={scene.text} label={scene.label} />
          </motion.div>
        )}

        {scene.type === 'hero-text' && (
          <motion.div
            key={`hero-${currentScene}`}
            initial={{ scale: prefersReducedMotion ? 1 : 0.5, opacity: 0, rotateX: prefersReducedMotion ? 0 : 90, y: prefersReducedMotion ? 0 : 50 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }} // Added prefersReducedMotion
            exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center relative z-10"
          >
            <h2 className={`text-7xl md:text-[140px] leading-none ${scene.highlight ? 'text-[#F4A460]' : 'text-[#5D4037]'}`}>
              {scene.content}
            </h2>
            <p className="text-[#5D4037]/40 text-2xl tracking-[0.8em] mt-4">{scene.sub}</p>
          </motion.div>
        )}

        {scene.type === 'preview-character' && (
          <motion.div key={`char-card-${scene.charId}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center relative z-10">
            {/* Use MOCK_CHARACTERS data */}
            {(() => {
              const char = MOCK_CHARACTERS[scene.charId];
              if (!char) return null;
              return (
            <div className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-8 shadow-2xl w-80">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 flex items-center justify-center text-5xl rounded-3xl" style={{ backgroundColor: `${char.color}20` }}>{char.portrait}</div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-black text-[#5D4037] leading-none mb-2">{char.name}</h3>
                  <span className="text-xs font-bold text-[#F4A460] uppercase tracking-widest">🎂 {char.birthday}</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-[#5D4037]/70 italic leading-relaxed line-clamp-2">"{char.bio}"</p>
                <div className="pt-4 border-t border-[#F3DCC1]/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]/40 mb-2">Favorite Item</p>
                  <p className="text-base font-bold text-[#5D4037]">⭐ {char.specialFavorite}</p>
                  {char.favoriteItems && char.favoriteItems.length > 0 && (
                    <p className="text-xs text-[#5D4037]/60 mt-2">ชอบ: {char.favoriteItems.join(', ')}</p>
                  )}
                  {char.dislikedItems && char.dislikedItems.length > 0 && char.dislikedItems[0] && ( // Check if dislikedItems[0] exists
                    <p className="text-xs text-[#E94E4E]/60 mt-1">ไม่ชอบ: {char.dislikedItems[0]}</p>
                  )}
                </div>
              </div>
            </div>
              );
            })()}
          </motion.div>
        )}

        {scene.type === 'preview-dual-character' && (
          <motion.div key="dual-char-card" variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-8 relative z-10">
            {scene.charIds.map((charId, index) => {
              const char = MOCK_CHARACTERS[charId];
              if (!char) return null;
              return (
                <motion.div 
                  key={charId}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-8 shadow-2xl w-80"
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 flex items-center justify-center text-5xl rounded-3xl" style={{ backgroundColor: `${char.color}20` }}>{char.portrait}</div>
                    <div className="min-w-0">
                      <h3 className="text-2xl font-black text-[#5D4037] leading-none mb-2">{char.name}</h3>
                      <span className="text-xs font-bold text-[#F4A460] uppercase tracking-widest">🎂 {char.birthday}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-[#5D4037]/70 italic leading-relaxed line-clamp-2">"{char.bio}"</p>
                    <div className="pt-4 border-t border-[#F3DCC1]/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]/40 mb-2">Favorite Item</p>
                      <p className="text-base font-bold text-[#5D4037]">⭐ {char.specialFavorite}</p>
                      {char.favoriteItems && char.favoriteItems.length > 0 && (
                        <p className="text-xs text-[#5D4037]/60 mt-2">ชอบ: {char.favoriteItems.join(', ')}</p>
                      )}
                      {char.dislikedItems && char.dislikedItems.length > 0 && char.dislikedItems[0] && ( // Check if dislikedItems[0] exists
                        <p className="text-xs text-[#E94E4E]/60 mt-1">ไม่ชอบ: {char.dislikedItems[0]}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-shop' && (
          <motion.div key={`shop-card-${scene.shopId}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center relative z-10 text-center">
            {(() => {
              const shop = MOCK_SHOPS[scene.shopId];
              if (!shop) return null;
              return (
            <div className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-10 shadow-2xl w-80 text-center">
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-7xl block mb-6">{shop.icon}</motion.span>
              <h3 className="text-3xl font-black text-[#5D4037] mb-2">{shop.name}</h3>
              <div className="bg-[#FAF9F6] py-3 rounded-2xl border border-[#F3DCC1]/50 mt-4">
                <p className="text-sm font-bold text-[#F4A460] uppercase tracking-widest">⏰ {shop.hours}</p>
                <p className="text-[10px] text-[#5D4037]/40 mt-1">ปิดทุกวัน{shop.closed}</p>
              </div>
              {shop.items && (
                <p className="text-xs text-[#5D4037]/60 mt-4">สินค้า: {shop.items.slice(0, 3).join(', ')}{shop.items.length > 3 ? '...' : ''}</p>
              )}
            </div>
              );
            })()}
          </motion.div>
        )}

        {scene.type === 'preview-dual-shop' && (
          <motion.div key={`dual-shop-card-${scene.shopIds.join('-')}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-8 relative z-10">
            {(() => {
              return scene.shopIds.map((shopId, index) => {
                const shop = MOCK_SHOPS[shopId];
                if (!shop) return null;
                return (
                  <motion.div 
                    key={shopId}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-10 shadow-2xl w-80 text-center"
                  >
                    <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-7xl block mb-6">{shop.icon}</motion.span>
                    <h3 className="text-3xl font-black text-[#5D4037] mb-2">{shop.name}</h3>
                    <div className="bg-[#FAF9F6] py-3 rounded-2xl border border-[#F3DCC1]/50 mt-4">
                      <p className="text-sm font-bold text-[#F4A460] uppercase tracking-widest">⏰ {shop.hours}</p>
                      <p className="text-[10px] text-[#5D4037]/40 mt-1">ปิดทุกวัน{shop.closed}</p>
                    </div>
                    {shop.items && (
                      <p className="text-xs text-[#5D4037]/60 mt-4">สินค้า: {shop.items.slice(0, 3).join(', ')}{shop.items.length > 3 ? '...' : ''}</p>
                    )}
                  </motion.div>
                );
              });
            })()}
          </motion.div>
        )}

        {scene.type === 'preview-crop' && (
          <motion.div key={`crop-card-${scene.cropId}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center relative z-10 text-center">
            {(() => {
              const crop = MOCK_CROPS[scene.cropId];
              if (!crop) return null;
              return (
            <div className="bg-white border-4 border-[#82A07D]/20 rounded-[40px] p-10 shadow-2xl w-[450px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="text-6xl">{crop.icon}</span>
                  <div className="flex flex-col">
                    <h4 className="text-2xl font-black text-[#1A1A1A]">{crop.name}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold text-[#8C7E6A] bg-[#F8F7F4] px-4 py-1.5 rounded-full flex items-center gap-1">⏱️ {crop.growDays} วัน</span>
                      <span className="text-xs font-black text-[#82A07D] flex items-center gap-1">💰 {crop.sellPrice.toLocaleString()} G</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#82A07D]">{crop.profitPerDay.toFixed(1)}</span>
                  <p className="text-[8px] font-bold uppercase text-[#8C7E6A]/50">G / Day</p>
                </div>
              </div>
            </div>
              );
            })()}
          </motion.div>
        )}

        {scene.type === 'preview-dual-crop' && (
          <motion.div key={`dual-crop-card-${scene.cropIds.join('-')}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-8 relative z-10">
            {(() => {
              return scene.cropIds.map((cropId, index) => {
                const crop = MOCK_CROPS[cropId];
                if (!crop) return null;
                return (
                  <motion.div 
                    key={cropId}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white border-4 border-[#82A07D]/20 rounded-[40px] p-10 shadow-2xl w-[450px]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <span className="text-6xl">{crop.icon}</span>
                        <div className="flex flex-col">
                          <h4 className="text-2xl font-black text-[#1A1A1A]">{crop.name}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-bold text-[#8C7E6A] bg-[#F8F7F4] px-4 py-1.5 rounded-full flex items-center gap-1">⏱️ {crop.growDays} วัน</span>
                            <span className="text-xs font-black text-[#82A07D] flex items-center gap-1">💰 {crop.sellPrice.toLocaleString()} G</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-[#82A07D]">{crop.profitPerDay.toFixed(1)}</span>
                        <p className="text-[8px] font-bold uppercase text-[#8C7E6A]/50">G / Day</p>
                      </div>
                    </div>
                  </motion.div>
                );
              });
            })()}
          </motion.div>
        )}

        {scene.type === 'preview-gifts' && (
          <motion.div key={`gifts-card-${scene.charId}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center relative z-10 text-center">
            {(() => {
              const char = MOCK_CHARACTERS[scene.charId];
              if (!char) return null;
              return (
            <div className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-8 shadow-2xl w-80">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 flex items-center justify-center text-5xl rounded-3xl" style={{ backgroundColor: `${char.color}20` }}>{char.portrait}</div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-black text-[#5D4037] leading-none mb-2">{char.name}</h3>
                  <span className="text-xs font-bold text-[#8C7E6A] uppercase tracking-widest">Gifts Guide</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center bg-[#82A07D]/10 p-4 rounded-3xl border border-[#82A07D]/20">
                  <span className="text-3xl">⭐</span>
                  <p className="text-[10px] font-bold text-[#5D4037] mt-2">{char.specialFavorite}</p>
                </div>
                <div className="flex flex-col items-center bg-[#E94E4E]/5 p-4 rounded-3xl border border-[#E94E4E]/10 opacity-40 grayscale">
                  <span className="text-3xl">🗑️</span>
                  <p className="text-[10px] font-bold text-[#5D4037] mt-2">{char.dislikedItems[0]}</p>
                </div>
              </div>
            </div>
              );
            })()}
          </motion.div>
        )}

        {scene.type === 'preview-dual-gifts' && (
          <motion.div key={`dual-gifts-card-${scene.charIds.join('-')}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-8 relative z-10">
            {scene.charIds.map((charId, index) => {
              const char = MOCK_CHARACTERS[charId];
              if (!char) return null;
              return (
                <motion.div 
                  key={charId}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-8 shadow-2xl w-80"
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 flex items-center justify-center text-5xl rounded-3xl" style={{ backgroundColor: `${char.color}20` }}>{char.portrait}</div>
                    <div className="min-w-0">
                      <h3 className="text-2xl font-black text-[#5D4037] leading-none mb-2">{char.name}</h3>
                      <span className="text-xs font-bold text-[#8C7E6A] uppercase tracking-widest">Gifts Guide</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center bg-[#82A07D]/10 p-4 rounded-3xl border border-[#82A07D]/20">
                      <span className="text-3xl">⭐</span>
                      <p className="text-[10px] font-bold text-[#5D4037] mt-2">{char.specialFavorite}</p>
                    </div>
                    <div className="flex flex-col items-center bg-[#E94E4E]/5 p-4 rounded-3xl border border-[#E94E4E]/10 opacity-40 grayscale">
                      <span className="text-3xl">🗑️</span>
                      <p className="text-[10px] font-bold text-[#5D4037] mt-2">{char.dislikedItems[0]}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-mixer' && (
          <motion.div key={`mixer-grid-${scene.equipment}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center relative z-10 text-center">
            <div className="flex items-center gap-4 mb-8 bg-[#5D4037] text-white px-6 py-2 rounded-full text-xs tracking-widest">
              <span>{MOCK_RECIPES[scene.recipes[0]]?.equipment === 'เครื่องปั่น' ? '🥣' : '🍳'} {scene.equipment}</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {scene.recipes.map((recipeId, idx) => {
                const recipe = MOCK_RECIPES[recipeId];
                if (!recipe) return null;
                return (
                <motion.div key={idx} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.2 }} className="bg-white border-2 border-[#F3DCC1] p-8 rounded-[32px] text-center shadow-lg w-44">
                  <span className="text-6xl block mb-4">{recipe.icon}</span>
                  <span className="text-xs font-black uppercase text-[#5D4037]">{recipe.name}</span>
                </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {scene.type === 'preview-dual-mixer' && (
          <motion.div key={`dual-mixer-grid-${scene.recipes.join('-')}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-8 relative z-10">
            {scene.recipes.map((recipeId, index) => {
              const recipe = MOCK_RECIPES[recipeId];
              if (!recipe) return null;
              return (
                <motion.div 
                  key={recipeId}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white border-2 border-[#F3DCC1] p-8 rounded-[32px] text-center shadow-lg w-44"
                >
                  <span className="text-6xl block mb-4">{recipe.icon}</span>
                  <span className="text-xs font-black uppercase text-[#5D4037]">{recipe.name}</span>
                  <p className="text-[8px] text-[#8C7E6A] mt-2">{recipe.equipment}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-tooltip' && (
          <motion.div key={`tooltip-ui-${scene.itemId}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center relative z-10 text-center">
            {(() => {
              const item = MOCK_ITEMS[scene.itemId];
              if (!item) return null;
              return (
            <div className="relative">
              <div className="w-32 h-32 bg-white border-2 border-[#F4A460] rounded-[32px] flex items-center justify-center text-6xl shadow-xl">{item.icon}</div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 p-6 bg-[#1A1A1A] text-white rounded-[32px] w-72 shadow-2xl z-50 border border-white/10">
                <p className="text-sm font-black text-[#F4A460] border-b border-white/10 pb-3 mb-3 uppercase tracking-widest">{item.name}</p>
                {item.source && <p className="text-xs mb-1 flex items-center gap-2">{SOURCE_ICONS[item.source] || '📦'} {item.source}</p>}
                {item.location && <p className="text-xs mb-1">📍 หาได้ที่: {item.location}</p>}
                {item.season && <p className="text-xs mb-1">🌸 ฤดู: {item.season}</p>}
                {item.sellPrice && <p className="text-xs">💰 ราคาขาย: {item.sellPrice.toLocaleString()} G</p>}
                {item.likedBy && item.likedBy.length > 0 && (
                  <p className="text-xs mt-2 text-[#82A07D]">ชอบโดย: {item.likedBy.join(', ')}</p>
                )}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-[#1A1A1A]"></div>
              </motion.div>
            </div>
              );
            })()}
          </motion.div>
        )}

        {scene.type === 'preview-dual-tooltip' && (
          <motion.div key={`dual-tooltip-${scene.itemIds.join('-')}`} variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-20 relative z-10">
            {scene.itemIds.map((itemId, idx) => {
              const item = MOCK_ITEMS[itemId];
              if (!item) return null;
              return (
                <div key={itemId} className="relative">
                  <div className="w-32 h-32 bg-white border-2 border-[#F4A460] rounded-[32px] flex items-center justify-center text-6xl shadow-xl">{item.icon}</div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (idx * 0.2) }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 p-6 bg-[#1A1A1A] text-white rounded-[32px] w-72 shadow-2xl z-50 border border-white/10">
                    <p className="text-sm font-black text-[#F4A460] border-b border-white/10 pb-3 mb-3 uppercase tracking-widest">{item.name}</p>
                    {item.location && <p className="text-xs mb-1">📍 {item.location}</p>}
                    {item.sellPrice && <p className="text-xs">💰 {item.sellPrice.toLocaleString()} G</p>}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-[#1A1A1A]"></div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-dual-calendar' && (
          <motion.div key="dual-calendar" variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-8 relative z-10">
            {scene.events.map((evt, idx) => {
              const seasonInfo = MOCK_EVENTS[evt.seasonId];
              if (!seasonInfo) return null;
              return (
                <div key={idx} className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-8 shadow-2xl w-80 text-center">
                  <h3 className="text-2xl font-black text-[#5D4037] mb-6">{seasonInfo.name} {seasonInfo.icon}</h3>
                  <div className="grid grid-cols-7 gap-3 mb-4">
                    {Array.from({ length: 7 }, (_, i) => i + 1).map(day => (
                      <span key={day} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px]", day === evt.eventDay ? "bg-[#F4A460] text-white font-black" : "text-[#5D4037]/20 border border-transparent")}>
                        {day}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-[#F4A460]">🎂 Day {evt.eventDay}</p>
                </div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-dual-modal' && (
          <motion.div key="dual-modal" variants={sceneVariants} initial="initial" animate="animate" exit="exit" className="flex items-center gap-8 relative z-10">
            {scene.recipeIds.map((id, idx) => {
              const recipe = MOCK_RECIPES[id];
              if (!recipe) return null;
              return (
                <div key={id} className="bg-[#FCFBF7] border-[6px] border-double border-[#8C7E6A]/20 p-8 shadow-2xl rounded-[40px] w-[340px] text-center">
                  <span className="text-6xl block mb-4">{recipe.icon}</span>
                  <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">{recipe.name}</h3>
                  <p className="text-[8px] font-bold text-[#8C7E6A] uppercase mb-4 tracking-widest">{recipe.equipment}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {recipe.ingredients.map((ing, i) => (
                      <div key={i} className="bg-white p-2 rounded-xl text-[9px] font-bold flex items-center gap-2 border border-[#8C7E6A]/10">
                        <span>{ing.icon}</span> {ing.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'text' && (
          <motion.div key={`text-${currentScene}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.2 }} className="text-center relative z-10">
            <h3 className="text-4xl md:text-6xl text-[#5D4037] font-black lowercase tracking-tighter">
              <TypingEffect text={scene.content} speed={50} />
            </h3>
          </motion.div>
        )}

        {scene.type === 'cta' && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-12 relative z-10"
          >
            <div className="space-y-6">
              <h2 className="text-6xl md:text-9xl text-[#5D4037] tracking-tighter leading-none">{scene.content}</h2>
              <p className="text-[#F4A460] tracking-[0.8em] text-lg font-bold">{scene.sub}</p>
              {scene.description && (
                <p className="text-sm text-[#5D4037]/70 italic mt-4 max-w-md mx-auto normal-case font-medium">{scene.description}</p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="px-16 py-6 bg-[#5D4037] text-[#FFF9F0] rounded-full text-sm font-black tracking-[0.5em] shadow-2xl hover:bg-[#F4A460] transition-colors"
            > 
              START EXPLORING
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Visual Flair: Dynamic Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] overflow-hidden select-none">
        <motion.div
          animate={{ 
            rotate: currentScene * 45,
            scale: [1, 1.1, 1]
          }}
          className="absolute -inset-[100%] flex flex-wrap items-center justify-center gap-20 p-20 select-none"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[14rem] font-black">GALABON</span>
          ))}
        </motion.div>
      </div>

      {/* Background Kinetic Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <motion.div 
          key={`line-1-${currentScene}`}
          animate={{ 
            x: [-500, 500],
            transition: { duration: 0.5, repeat: Infinity, ease: "linear" }
          }}
          className="absolute top-1/4 left-0 right-0 h-[1px] bg-[#5D4037]"
        />
        <motion.div 
          key={`line-2-${currentScene}`}
          animate={{ 
            x: [500, -500],
            transition: { duration: 0.3, repeat: Infinity, ease: "linear" }
          }}
          className="absolute bottom-1/3 left-0 right-0 h-[1px] bg-[#F4A460]"
        />
      </div>
    </div>
  );
};

export default ShowcaseReel;
