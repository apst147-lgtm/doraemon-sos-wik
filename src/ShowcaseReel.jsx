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
const TypingEffect = ({ text, speed = 80 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); // Reset text when it changes
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="border-r-4 border-[#F4A460] pr-1 animate-pulse">{displayedText}</span>;
};

/**
 * TextReveal Component
 * อนิเมชันข้อความแบบ Apple-style (Blur-in & Stagger)
 */
const TextReveal = ({ text, className = "" }) => {
  const words = text.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
  };

  return (
    <motion.div className={`flex flex-wrap justify-center gap-x-[0.3em] ${className}`} variants={container} initial="hidden" animate="visible">
      {words.map((word, index) => (
        <motion.span key={index} variants={child}>{word}</motion.span>
      ))}
    </motion.div>
  );
};

/**
 * SearchSimulation Component
 * จำลองช่องค้นหาที่ดูสมจริงและน่ารักขึ้น
 */
const SearchSimulation = ({ text, label = "Quick Search" }) => (
  <div className="flex flex-col items-center gap-4">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C7E6A] opacity-50">{label}</span>
    <div className="bg-white/90 backdrop-blur-xl border-b-4 border-[#F3DCC1] rounded-[24px] px-8 py-5 flex items-center gap-5 w-[500px] shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#F4A460]/10" />
      <motion.span 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-2xl opacity-30"
      >
        🔍
      </motion.span>
      <div className="text-3xl font-light tracking-tight text-[#1A1A1A] flex-1">
        <TypingEffect text={text} speed={60} />
      </div>
      <motion.div 
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-[2px] h-8 bg-[#F4A460]" 
      />
    </div>
  </div>
);

/**
 * DynamicBackground Component
 * แทนที่ตัวหนังสือหมุนๆ ด้วย Floating Bokeh
 */
const DynamicBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-[120px]"
        style={{
          width: `${Math.random() * 400 + 200}px`,
          height: `${Math.random() * 400 + 200}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: ['#F3DCC1', '#D9EAF7', '#E2F0D9', '#F3E5AB'][i % 4],
        }}
        animate={{
          x: [0, Math.random() * 100 - 50, 0],
          y: [0, Math.random() * 100 - 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </div>
);

const SCENES = [
  // --- 3 ซีนแรกสไตล์ Cinematic Reveal ---
  { type: 'hero-reveal', content: 'THE ULTIMATE', sub: 'WIKI DATABASE', duration: 1200, transition: 'zoomIn' },
  { type: 'hero-reveal', content: 'CRAFTED FOR', sub: 'NOBITA STORY OF SEASONS', highlight: true, duration: 1500, transition: 'slideUp' },
  
  // --- Simulated Actions ---
  {
    type: 'simulate-search',
    text: 'shizuka',
    cursor: { x: '50vw', y: '42vh', opacity: 1, click: false },
    cursorLabel: 'Searching for friends...',
    duration: 3000
  },

  // Dual Character Preview (Shizuka & Doraemon)
  { 
    type: 'preview-dual-character', 
    charIds: ['shizuka', 'doraemon'],
    cursor: { x: '40vw', y: '50vh', opacity: 1, click: true },
    cursorLabel: 'Click to see favorites',
    duration: 5000 
  },
  
  // Action 2: Check Shops
  {
    type: 'simulate-search',
    text: 'ร้านตีเหล็ก',
    label: 'Checking Shop Hours',
    cursor: { x: '50vw', y: '50vh', opacity: 1, click: false },
    cursorLabel: 'Find shops...',
    duration: 3000
  },

  {
    type: 'preview-dual-shop',
    shopIds: ['blacksmith', 'general_store'],
    cursor: { x: '60vw', y: '45vh', opacity: 1, click: true },
    cursorLabel: 'Open schedule',
    duration: 5000
  },

  // Action 3: Crop Planning
  {
    type: 'simulate-search',
    text: 'strawberry',
    label: 'Crop Profit Analysis',
    cursor: { x: '50vw', y: '42vh', opacity: 1, click: false },
    cursorLabel: 'Calculating profit...',
    duration: 3000
  },

  { 
    type: 'preview-dual-crop', 
    cropIds: ['cabbage', 'strawberry'],
    cursor: { x: '60vw', y: '55vh', opacity: 1, click: true },
    cursorLabel: 'Comparing yields',
    duration: 5000,
    transition: 'slideUp'
  },
  
  {
    type: 'preview-dual-calendar',
    events: [{ seasonId: 'spring', eventDay: 8 }, { seasonId: 'winter', eventDay: 25 }],
    cursor: { x: '55vw', y: '58vh', opacity: 1, click: false },
    cursorLabel: 'Mark the date!',
    duration: 5000,
    transition: 'zoomIn'
  },

  // Action 5: Detailed Recipe Search with Price Breakdown
  {
    type: 'simulate-search',
    text: 'dorayaki',
    label: 'Secret Recipe Finder',
    cursor: { x: '50vw', y: '42vh', opacity: 1, click: false },
    duration: 3000
  },

  { 
    type: 'preview-recipe-detail', 
    recipeId: 'dorayaki', 
    cursor: { x: '50vw', y: '60vh', opacity: 1, click: true },
    cursorLabel: 'Check potential profit',
    duration: 7000,
    transition: 'sideSlide'
  },

  // --- Final Text Scenes ---
  { type: 'text-reveal', content: 'ข้อมูลครบถ้วน แม่นยำ', duration: 2000, bgIcon: '📚', transition: 'zoomIn' },
  { type: 'text-reveal', content: 'อัปเดตตลอดเวลา', duration: 2000, bgIcon: '✨', transition: 'slideUp' },
  { type: 'text-reveal', content: 'MINIMAL DESIGN', duration: 2000, transition: 'zoomIn' },

  { type: 'cta', content: 'DORAEMON SoS', sub: 'WIKI DATABASE', description: 'Let\'s start your adventure' }
];

const ShowcaseReel = ({ onFinish }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [flash, setFlash] = useState(false);

  const scene = SCENES[currentScene];

  // Logic สำหรับการเปลี่ยนฉากอัตโนมัติ
  useEffect(() => {
    if (currentScene < SCENES.length - 1) {
      const timer = setTimeout(() => {
        setFlash(true);
        setCurrentScene((prev) => prev + 1);
        setTimeout(() => setFlash(false), 200);
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

  // การตั้งค่าอนิเมชันตอนเปลี่ยนฉาก
  const transitionVariants = {
    slideUp: { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 } },
    zoomIn: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } },
    sideSlide: { initial: { opacity: 0, x: 200 }, animate: { opacity: 1, x: 0 } }
  };

  const currentVariant = transitionVariants[scene.transition] || transitionVariants.slideUp;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#FFFDF5] flex items-center justify-center overflow-hidden font-black uppercase">
      {/* เอฟเฟกต์แฟลชตอนเปลี่ยนฉาก */}
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} className="absolute inset-0 bg-white z-[12000] pointer-events-none" />
        )}
      </AnimatePresence>

      <DynamicBackground />

      <button 
        onClick={handleClose}
        className="absolute top-10 right-10 text-[10px] tracking-[0.4em] text-[#5D4037]/40 hover:text-[#5D4037] transition-all z-50 px-5 py-2 border border-[#5D4037]/10 rounded-full hover:bg-[#5D4037] hover:text-[#FFF9F0]"
      >
        SKIP REEL
      </button>

      <AnimatePresence mode="popLayout">
        {/* แสดงผลตามประเภทของฉาก */}
        {scene.type === 'simulate-search' && (
          <motion.div key={`search-${currentScene}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 flex justify-center w-full">
            <SearchSimulation text={scene.text} label={scene.label} />
          </motion.div>
        )}

        {scene.type === 'hero-reveal' && (
          <motion.div key={`hero-${currentScene}`} initial="initial" animate="animate" exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }} variants={currentVariant} className="text-center relative z-10 px-4">
            <TextReveal text={scene.content} className={`text-5xl md:text-[100px] leading-tight ${scene.highlight ? 'text-[#F4A460]' : 'text-[#5D4037]'}`} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1 }} className="text-[#5D4037] text-xl md:text-2xl tracking-[1em] mt-8">
              {scene.sub}
            </motion.p>
          </motion.div>
        )}

        {scene.type === 'text-reveal' && (
          <motion.div key={`text-${currentScene}`} initial="initial" animate="animate" exit={{ opacity: 0, y: -50 }} variants={currentVariant} className="text-center relative z-10">
            {scene.bgIcon && (
              <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.1, scale: 1.5 }} className="absolute inset-0 -z-10 flex items-center justify-center text-[25rem]">
                {scene.bgIcon}
              </motion.div>
            )}
            <TextReveal text={scene.content} className="text-5xl md:text-7xl text-[#5D4037] font-black tracking-tight" />
          </motion.div>
        )}

        {scene.type === 'preview-dual-character' && (
          <motion.div key="dual-char-card" variants={currentVariant} initial="initial" animate="animate" exit={{ opacity: 0, x: -100 }} className="flex flex-wrap justify-center gap-8 relative z-10">
            {scene.charIds.map((charId, index) => {
              const char = MOCK_CHARACTERS[charId];
              if (!char) return null;
              return (
                <motion.div key={charId} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-8 shadow-2xl w-80">
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
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-dual-shop' && (
          <motion.div key="dual-shop-card" variants={currentVariant} initial="initial" animate="animate" exit={{ opacity: 0, scale: 0.8 }} className="flex flex-wrap justify-center gap-8 relative z-10">
            {scene.shopIds.map((shopId, index) => {
              const shop = MOCK_SHOPS[shopId];
              if (!shop) return null;
              return (
                <motion.div 
                  key={shopId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className="bg-white border-2 border-[#F3DCC1] rounded-[40px] p-8 shadow-2xl w-80 text-center"
                >
                  <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl block mb-6">{shop.icon}</motion.span>
                  <h3 className="text-2xl font-black text-[#5D4037] mb-2">{shop.name}</h3>
                  <div className="bg-[#FAF9F6] py-3 rounded-2xl border border-[#F3DCC1]/50 mt-4">
                    <p className="text-xs font-bold text-[#F4A460] uppercase tracking-widest">⏰ {shop.hours}</p>
                    <p className="text-[9px] text-[#5D4037]/40 mt-1">ปิดทุกวัน{shop.closed}</p>
                  </div>
                  <p className="text-[10px] text-[#5D4037]/60 mt-4 font-bold uppercase tracking-tighter">
                    สินค้า: {shop.items.slice(0, 2).join(', ')}...
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-dual-crop' && (
          <motion.div key="dual-crop-card" variants={currentVariant} initial="initial" animate="animate" exit={{ opacity: 0, y: -100 }} className="flex flex-wrap justify-center gap-8 relative z-10">
            {scene.cropIds.map((cropId, index) => {
              const crop = MOCK_CROPS[cropId];
              if (!crop) return null;
              return (
                <motion.div 
                  key={cropId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.3 }}
                  className="bg-white border-4 border-[#82A07D]/20 rounded-[40px] p-8 shadow-2xl w-[420px]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-6xl">{crop.icon}</span>
                      <div className="flex flex-col">
                        <h4 className="text-xl font-black text-[#1A1A1A]">{crop.name}</h4>
                        <span className="text-[10px] font-bold text-[#8C7E6A] mt-1">⏱️ ใช้เวลาโต {crop.growDays} วัน</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#82A07D]">{crop.profitPerDay}</span>
                      <p className="text-[8px] font-bold uppercase text-[#8C7E6A]/50">G / Day</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {scene.type === 'preview-dual-calendar' && (
          <motion.div key="dual-calendar" variants={currentVariant} initial="initial" animate="animate" exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-8 relative z-10">
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

        {scene.type === 'preview-recipe-detail' && (
          <motion.div key={`recipe-detail-${scene.recipeId}`} variants={currentVariant} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center relative z-10">
            {(() => {
              const recipe = MOCK_RECIPES[scene.recipeId];
              if (!recipe) return null;
              const profit = recipe.sell - recipe.cost;
              return (
                <div className="bg-[#FCFBF7] border-4 border-[#8C7E6A]/20 p-8 shadow-2xl rounded-[40px] w-[400px] text-center">
                  <span className="text-7xl block mb-4">{recipe.icon}</span>
                  <h3 className="text-3xl font-black text-[#1A1A1A] mb-1">{recipe.name}</h3>
                  <p className="text-[10px] font-bold text-[#8C7E6A] uppercase mb-6 tracking-widest">{recipe.equipment}</p>
                  <div className="space-y-3 bg-[#F3DCC1]/10 p-5 rounded-3xl border border-[#F3DCC1]/30">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#5D4037]/60">ราคาขาย</span>
                      <span className="font-bold text-[#E97451]">{recipe.sell.toLocaleString()} G</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#5D4037]/60">ต้นทุนวัตถุดิบ</span>
                      <span className="text-[#5D4037]/80">{recipe.cost.toLocaleString()} G</span>
                    </div>
                    <div className="h-[1px] bg-[#1A1A1A]/10 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-[#82A07D]">กำไรสุทธิ</span>
                      <span className="text-2xl font-black text-[#82A07D]">+{profit.toLocaleString()} G</span>
                    </div>
                  </div>
                </div>
              );
            })()}
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
              <p className="text-[#F4A460] tracking-[0.6em] text-lg font-bold">{scene.sub}</p>
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
    </div>
  );
};

export default ShowcaseReel;
