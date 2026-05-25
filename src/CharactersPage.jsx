import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { CHARACTERS } from './characters';
import RecipeDetailModal from './RecipeDetailModal';
import { FALLBACK_RECIPES } from './data/recipesData';
import { SOURCE_ICONS, INGREDIENT_ICONS } from './data/constants';
import { 
  CROPS_DATA, 
  WILD_PRODUCTS_DATA, 
  FISHING_DATA, 
  BEACH_FORAGING_DATA, 
  MINING_DATA 
} from './data/seasonsData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // ลบ filter blur ออกเพื่อลดอาการแลค
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

// Color schemes for the NFT aesthetic based on index
const colorSchemes = [
  { bg: 'from-rose-200 to-rose-50', accent: 'text-rose-600', tag: 'bg-rose-500/10 text-rose-700' },
  { bg: 'from-emerald-200 to-emerald-50', accent: 'text-emerald-600', tag: 'bg-emerald-500/10 text-emerald-700' },
  { bg: 'from-violet-200 to-violet-50', accent: 'text-violet-600', tag: 'bg-violet-500/10 text-violet-700' },
  { bg: 'from-sky-200 to-sky-50', accent: 'text-sky-600', tag: 'bg-sky-500/10 text-sky-700' },
  { bg: 'from-orange-200 to-orange-50', accent: 'text-orange-600', tag: 'bg-orange-500/10 text-orange-700' },
  { bg: 'from-lime-200 to-lime-50', accent: 'text-lime-600', tag: 'bg-lime-500/10 text-lime-700' },
];

// สร้างฐานข้อมูลวัตถุดิบเพื่อดึงข้อมูลมาแสดงใน Tooltip (ดึงจากข้อมูลที่มีในสูตรอาหาร)
const MISC_ITEMS = [
  { name: 'ดอกทานตะวัน', source: 'เพาะปลูก', season: 'Summer', icon: '🌻' },
  { name: 'ดอกแดนดิไลออน', source: 'เก็บจากป่า', season: 'Spring', icon: '🌼' },
  { name: 'ไม้', source: 'ตัดไม้', location: 'บริเวณป่า/ฟาร์ม', icon: '🪵' },
  { name: 'แร่ขยะ', source: 'เหมืองแร่', location: 'เหมืองขุดถ่าน', icon: '🗑️' },
  { name: 'ปุ๋ย', source: 'ร้านขายของชำ', buyPrice: 40, icon: '🧪' },
  { name: 'โยเกิร์ต', source: 'ร้านอาหาร/แปรรูป', buyPrice: 300, icon: '🍦' },
  { name: 'อัญมณี', source: 'เหมืองแร่', location: 'ชั้นลึก 7-10', icon: '💎' },
  { name: 'แอปริคอท', source: 'เก็บจากป่า', season: 'All', icon: '🍑' },
  { name: 'กุ้งมังกร', source: 'ตกปลา', location: 'ชายหาด', icon: '🦞' },
  { name: 'เบ็ดตกปลา', source: 'ร้านอุปกรณ์ตกปลา', icon: '🎣' },
  { name: 'ดอกไม้', source: 'เก็บจากป่า / เพาะปลูก', icon: '💐' },
  { name: 'เหยื่อตกปลา', source: 'ร้านอุปกรณ์ตกปลา', buyPrice: 20, icon: '🪱' }
];

const createIngredientDb = () => {
  const db = {};
  const addToDb = (item, defaultSource) => {
    if (!item || !item.name) return;
    const name = item.name;
    db[name] = { 
      ...db[name], 
      ...item, 
      source: item.source || db[name]?.source || defaultSource 
    };
  };

  FALLBACK_RECIPES.forEach(r => r.ingredients?.forEach(ing => typeof ing === 'object' && addToDb(ing)));
  CROPS_DATA.forEach(item => addToDb(item, 'เพาะปลูก'));
  WILD_PRODUCTS_DATA.forEach(item => addToDb(item, 'เก็บจากป่า'));
  FISHING_DATA.forEach(item => addToDb(item, 'ตกปลา'));
  BEACH_FORAGING_DATA.forEach(item => addToDb(item, 'ตกปลา/เก็บชายหาด'));
  MINING_DATA.forEach(item => addToDb(item, 'เหมืองแร่'));
  return db;
};

const INGREDIENT_DB = createIngredientDb();
const RECIPE_NAMES = new Set(FALLBACK_RECIPES.map(r => r.name));

// แยก Component ย่อยออกมาเพื่อลดความซับซ้อนของ Render Loop
const CharacterCard = React.memo(({ char, index, onRecipeTrigger }) => {
  const scheme = colorSchemes[index % colorSchemes.length];

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="relative mt-10 group"
    >
      {/* Unique Pastel Gradient Background */}
      <div className={cn(
        "absolute inset-0 rounded-[2rem] bg-gradient-to-br transition-all duration-500 opacity-20 group-hover:opacity-40",
        scheme.bg
      )} />

      {/* Main Card Body (Glassmorphism Effect) */}
      <div className="relative bg-white/60 backdrop-blur-md border border-white/80 rounded-[2rem] p-5 pt-16 flex flex-col items-center text-center h-full min-h-[260px] shadow-sm transition-all duration-500">
        {/* Avatar Area - 100px with Subtle Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 z-20">
          <div className="w-full h-full rounded-full bg-white border-[4px] border-white shadow-md flex items-center justify-center group-hover:scale-105 transition-all duration-500 relative">
            <span className="text-6xl drop-shadow-md filter grayscale-[0.2] group-hover:grayscale-0 transition-all">
              {char.portrait}
            </span>
            
            {/* Premium Glossy Overlay (Bubble Effect) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Removed for cleaner look */}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <h3 className="text-xl font-black text-[#1a1a2e] mb-1 leading-none tracking-tight">
          {char.name}
        </h3>
        
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8C7E6A]/60 mb-4">{char.category}</p>
        
        <div className="space-y-1 mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center justify-center gap-2">
            <span>📅</span> {char.birthday}
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center justify-center gap-2">
            <span>📍</span> {char.location?.split(' / ')[0]}
          </p>
        </div>

        {/* Favorite Items Section (Skills) */}
        <div className="flex flex-wrap justify-center gap-2 mt-auto pt-4 border-t border-black/5 w-full min-h-[70px]">
          {char.favoriteItems.map(item => {
            const isRecipe = RECIPE_NAMES.has(item);
            const ing = INGREDIENT_DB[item];
            // ตรวจสอบว่าควรโชว์ Tooltip ไหม (ถ้าไม่ใช่เมนูอาหาร และมีข้อมูลวัตถุดิบ)
            const hasTooltip = !isRecipe && ing && (ing.note || ing.alternatives || ing.buyPrice !== undefined || ing.sellPrice !== undefined || ing.season || ing.location || ing.source);

            return (
              <div key={item} className={cn("relative", hasTooltip && "group/tooltip")} style={{ zIndex: hasTooltip ? 20 : 1 }}>
                <button 
                  onClick={() => isRecipe && onRecipeTrigger(item)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-wider shadow-sm transition-all active:scale-95",
                    scheme.tag,
                    isRecipe ? "cursor-pointer hover:scale-110 hover:ring-2 hover:ring-current" : (hasTooltip ? "cursor-help hover:scale-110" : "cursor-default")
                  )}
                >
                  {isRecipe ? `🍳 ${item}` : item}
                </button>

                {hasTooltip && (
                  /* Tooltip Popup - ดีไซน์ให้น่ารักและเป็นสากล */
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-[#1A1A1A]/95 backdrop-blur-md text-white rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-[80] w-max max-w-[180px] shadow-xl border border-white/10 scale-90 group-hover/tooltip:scale-100 origin-bottom">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
                      <span className="text-xl">{ing.icon || INGREDIENT_ICONS[item] || '📦'}</span>
                      <p className="text-xs font-black text-[#F4A460] uppercase tracking-widest">{item}</p>
                    </div>
                    {ing.source && <p className="text-[10px] text-[#F3E5AB] mt-1 flex items-center gap-1.5 mb-2"><span className="opacity-50 text-[8px]">SOURCE</span> {SOURCE_ICONS[ing.source] || '📦'} {ing.source}</p>}
                    {ing.note && <p className="text-[10px] font-medium leading-relaxed opacity-90">{ing.note}</p>}
                    {ing.season && <p className="text-[9px] text-[#E2F0D9] mt-2 flex items-center gap-1.5"><span className="opacity-50 text-[7px]">SEASON</span> {ing.season}</p>}
                    {ing.location && <p className="text-[9px] text-[#D9EAF7] mt-1 flex items-center gap-1.5"><span className="opacity-50 text-[7px]">LOCATION</span> {ing.location}</p>}
                    {(ing.buyPrice !== undefined || ing.sellPrice !== undefined) && (
                      <div className="text-[9px] flex flex-col gap-1.5 mt-3 pt-3 border-t border-white/10">
                        {ing.buyPrice !== undefined && (
                          <div className="flex justify-between gap-8 uppercase tracking-widest">
                            <span className="opacity-50 text-[7px] font-black">Buy</span> <span className="text-[#F4A460] font-bold">{ing.buyPrice} G</span>
                          </div>
                        )}
                        {ing.sellPrice !== undefined && (
                          <div className="flex justify-between gap-8 uppercase tracking-widest">
                            <span className="opacity-50 text-[7px] font-black">Sell</span> <span className="text-[#82A07D] font-bold">{ing.sellPrice} G</span>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Triangle Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1A1A1A]/95"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});

const CharactersPage = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // ปิด Modal เมื่อกด ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedRecipe) setSelectedRecipe(null);
        else onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRecipe, onBack]);

  const handleRecipeTrigger = useCallback((recipeName) => {
    const recipe = FALLBACK_RECIPES.find(r => r.name === recipeName);
    if (recipe) setSelectedRecipe(recipe);
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(CHARACTERS.map(c => c.category));
    return ['ทั้งหมด', ...Array.from(unique)];
  }, []);

  const filteredCharacters = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return CHARACTERS.filter(char => {
      const matchesSearch = 
        char.name.toLowerCase().includes(lowerSearch) || 
        char.favoriteItems.some(item => item.toLowerCase().includes(lowerSearch)) ||
        (char.location && char.location.toLowerCase().includes(lowerSearch));
      
      const matchesCat = activeCategory === 'ทั้งหมด' || char.category === activeCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="w-full bg-[#FCFBF7] min-h-screen p-8 md:p-20 border-x border-[#EBE9E4] relative overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#F4A460_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row items-baseline justify-between border-b border-[#1A1A1A]/10 pb-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-none">
            Directory
            <span className="ml-3 text-xl font-light text-[#8C7E6A]/40">[{filteredCharacters.length}]</span>
          </h2>
          <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-[#8C7E6A]/60 flex items-center gap-4">
            <span className="w-8 h-[2px] bg-[#8C7E6A]/20" />
            Residents of Natura
          </p>
        </div>
        <button 
          onClick={onBack}
          className="mt-8 md:mt-0 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:opacity-50 transition-opacity"
        >
          Close Index [ESC]
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-12 w-full max-w-xl">
        <div className="relative group/search">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within/search:opacity-100 group-focus-within/search:scale-110 transition-all duration-300">🔍</span>
          <input
            type="text"
            placeholder="Lookup residents..." // Changed placeholder to be more concise
            className="w-full pl-14 pr-6 py-4 text-lg font-bold rounded-[1.5rem] bg-white border border-[#EBE9E4] focus:border-[#1A1A1A] focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all placeholder:text-[#8C7E6A]/30 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all relative overflow-hidden",
              activeCategory === cat 
                ? "bg-[#1A1A1A] text-white shadow-md" // Simplified active state
                : "bg-white text-[#8C7E6A]/60 border border-[#EBE9E4] hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] shadow-sm" // Simplified inactive state
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Character Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full px-4"
      >
        {filteredCharacters.map((char, index) => (
          <CharacterCard 
            key={char.id} 
            char={char} 
            index={index} 
            onRecipeTrigger={handleRecipeTrigger}
          />
        ))}

        {filteredCharacters.length === 0 && (
          <div className="col-span-full py-40 text-center">
            <span className="text-6xl opacity-20 block mb-6">🚶‍♂️</span>
            <p className="text-xl font-light text-[#8C7E6A]">Nobody found with those details.</p>
          </div>
        )}
      </motion.div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal selectedRecipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </motion.div>
  );
};

export default CharactersPage;