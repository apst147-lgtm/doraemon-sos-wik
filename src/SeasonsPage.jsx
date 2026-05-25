import React, { useState, useMemo, useEffect, useCallback, useRef, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { INGREDIENT_ICONS, STAR_RATINGS, SOURCE_ICONS } from './data/constants';
import { getCharacterByName } from './characters';
import { CROPS_DATA, WILD_PRODUCTS_DATA, FISHING_DATA, BEACH_FORAGING_DATA, INSECTS_DATA, SEASON_EVENTS, MINING_DATA, CATEGORIES, FERTILIZERS, SEASONS } from './data/seasonsData';
import { FALLBACK_RECIPES } from './data/recipesData';
import RecipeDetailModal from './RecipeDetailModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const SeasonsPage = ({ onBack, onRecipeClick }) => {
  const [selectedSeason, setSelectedSeason] = useState('Spring');
  const [selectedFertilizer, setSelectedFertilizer] = useState('none');
  const [activeCategory, setActiveCategory] = useState('crops');
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const plannerRef = useRef(null);

  // --- Persistence: Load and Save Planning Data ---
  useEffect(() => {
    const saved = localStorage.getItem('doraemon_crop_planner');
    if (saved) setQuantities(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('doraemon_crop_planner', JSON.stringify(quantities));
  }, [quantities]);

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

  const currentSeasonInfo = useMemo(() => 
    SEASONS.find(s => s.id === selectedSeason), [selectedSeason]
  );

  const fertilizerInfo = useMemo(() => 
    FERTILIZERS.find(f => f.id === selectedFertilizer), [selectedFertilizer]
  );

  // ฟังก์ชันหาข้อมูล Recipe จากชื่อ
  const handleRecipeTrigger = useCallback((recipeName) => {
    const recipe = FALLBACK_RECIPES.find(r => r.name === recipeName);
    if (recipe) setSelectedRecipe(recipe);
  }, []);

  // ฟังก์ชันสำหรับการนำทางไปยังหน้ารวมสูตรอาหาร
  const handleNavigateToRecipe = useCallback((recipeName) => {
    if (onRecipeClick) {
      onRecipeClick(recipeName);
    }
  }, [onRecipeClick]);

  const processedCrops = useMemo(() => {
    return CROPS_DATA.filter(crop => crop.season === selectedSeason)
      .map(crop => {
        // คำนวณผลของปุ๋ย
        const adjustedGrowDays = Math.max(1, Math.ceil(crop.growDays * (1 - fertilizerInfo.speedBoost)));
        const adjustedSellPrice = Math.floor(crop.sellPrice * (1 + fertilizerInfo.qualityBoost));
        const totalInvestment = crop.buyPrice + fertilizerInfo.price;

        let totalSell = adjustedSellPrice;
        let totalProfit = adjustedSellPrice - totalInvestment;
        
        // สำหรับพืชที่เก็บเกี่ยวซ้ำได้ (สมมติเก็บได้จนจบฤดู 30 วัน)
        if (crop.reHarvest) {
          const remainingDays = 30 - adjustedGrowDays;
          const extraHarvests = Math.floor(remainingDays / crop.harvestInterval);
          totalSell = adjustedSellPrice * (1 + extraHarvests);
          totalProfit = totalSell - totalInvestment;
        }

        const profitPerDay = totalProfit / (crop.reHarvest ? 30 : adjustedGrowDays);

        return { ...crop, growDays: adjustedGrowDays, totalInvestment, totalProfit, profitPerDay };
      })
      .sort((a, b) => b.profitPerDay - a.profitPerDay);
  }, [selectedSeason, fertilizerInfo]);

  const updateQuantity = (id, value) => {
    const val = value === '' ? 0 : parseInt(value);
    setQuantities(prev => ({
      ...prev,
      [id]: isNaN(val) ? 0 : Math.max(0, val)
    }));
  };

  const summaryData = useMemo(() => {
    const activeCrops = processedCrops.filter(c => quantities[c.id] > 0);
    if (activeCrops.length === 0) return null;

    let totalInvestment = 0;
    let totalProfit = 0;

    activeCrops.forEach(crop => {
      const qty = quantities[crop.id];
      totalInvestment += crop.totalInvestment * qty;
      totalProfit += crop.totalProfit * qty;
    });

    return { totalInvestment, totalProfit, count: activeCrops.length };
  }, [processedCrops, quantities]);

  const exportPlanAsImage = async () => {
    if (!plannerRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(plannerRef.current, {
        backgroundColor: '#1A1A1A',
        scale: 2,
        logging: false,
        useCORS: true,
        borderRadius: 32
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `doraemon-sos-crop-plan-${selectedSeason}.png`;
      link.click();
    } catch (err) {
      console.error("Export planner image failed:", err);
    }
  };

  const currentWildProducts = useMemo(() => {
    return WILD_PRODUCTS_DATA.filter(item =>
      item.season === selectedSeason &&
      (deferredSearch === '' || item.name.toLowerCase().includes(deferredSearch.toLowerCase()))
    )
      .sort((a, b) => b.sellPrice - a.sellPrice);
  }, [selectedSeason, deferredSearch]);

  const currentBeachProducts = useMemo(() => {
    return BEACH_FORAGING_DATA.filter(item =>
      (item.season === selectedSeason || item.season === 'All') &&
      (deferredSearch === '' || item.name.toLowerCase().includes(deferredSearch.toLowerCase()))
    )
      .sort((a, b) => b.sellPrice - a.sellPrice);
  }, [selectedSeason, deferredSearch]);

  const currentInsects = useMemo(() => {
    return INSECTS_DATA.filter(item =>
      item.season === selectedSeason &&
      (deferredSearch === '' || item.name.toLowerCase().includes(deferredSearch.toLowerCase()))
    )
      .sort((a, b) => b.sellPrice - a.sellPrice);
  }, [selectedSeason, deferredSearch]);

  const currentFish = useMemo(() => {
    return FISHING_DATA.filter(fish =>
      fish.season === selectedSeason &&
      (deferredSearch === '' || fish.name.toLowerCase().includes(deferredSearch.toLowerCase()))
    )
      .sort((a, b) => b.sellPrice - a.sellPrice);
  }, [selectedSeason, deferredSearch]);

  const currentEvents = useMemo(() => {
    return SEASON_EVENTS.filter(e => 
      e.season === selectedSeason &&
      (deferredSearch === '' || 
       e.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
       (e.target && e.target.toLowerCase().includes(deferredSearch.toLowerCase())))
    );
  }, [selectedSeason, deferredSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="w-full bg-white min-h-screen p-8 md:p-20 border-x border-[#EBE9E4]"
    >
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row items-baseline justify-between border-b border-[#1A1A1A]/10 pb-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-none">
            Seasons
            <span className="ml-3 text-xl font-light text-[#8C7E6A]/40">[{selectedSeason}]</span>
          </h2>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.5em] text-[#8C7E6A]">Agricultural Cycle / Planner</p>
        </div>
        <button 
          onClick={onBack}
          className="mt-8 md:mt-0 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:opacity-50 transition-opacity"
        >
          Back to Main [ESC]
        </button>
      </div>

      {/* Season Selector */}
      <div className="mb-16 flex flex-wrap gap-3">
        {SEASONS.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.id)}
            aria-label={`Select ${season.label} season`}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500", // Smaller padding, single border
              selectedSeason === season.id 
                ? cn(season.bg, season.border, "shadow-md scale-105") // Smaller shadow
                : "bg-white border-[#EBE9E4] opacity-40 hover:opacity-100"
            )}
          >
            <span className="text-3xl">{season.icon}</span>
            <div className="flex flex-col items-start leading-none">
              <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedSeason === season.id ? season.text : "text-[#1A1A1A]")}>
                {season.id}
              </span>
              <span className="text-sm font-bold text-[#1A1A1A] mt-1">{season.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Real-time Search Input */}
      <div className="mb-12 max-w-xl">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A] block mb-4">Quick Search</span>
        <input
          type="text"
          placeholder={`Search in ${activeCategory}...`}
          className="w-full text-2xl font-light tracking-tight outline-none placeholder:opacity-10 bg-transparent border-b border-[#EBE9E4] py-2 focus:border-[#1A1A1A] transition-colors" // Smaller text, padding
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Category Selector */}
      <div className="mb-12 flex justify-center border-b border-[#EBE9E4]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            aria-label={`Show ${cat.name} category`}
            className={cn(
              "px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative",
              activeCategory === cat.id ? "text-[#1A1A1A]" : "text-[#8C7E6A]/40 hover:text-[#8C7E6A]"
            )}
          >
            <span className="mr-2 text-base">{cat.icon}</span>
            {cat.name}
            {activeCategory === cat.id && (
              <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A]" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + selectedSeason}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeCategory === 'crops' && (
            <>
              {/* Fertilizer Simulator Selector - Only for Crops */}
              <div className="mb-10 p-5 bg-[#F8F7F4]/60 rounded-2xl border border-[#EBE9E4] flex flex-col md:flex-row items-center gap-6"> {/* Smaller padding, rounded corners */}
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]">Fertilizer Sim</span>
                  <p className="text-[10px] text-[#82A07D] font-bold italic">{fertilizerInfo.usageTip}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {FERTILIZERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFertilizer(f.id)}
                      aria-label={`Select ${f.name} fertilizer`}
                      className={cn(
                        "px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all border flex items-center gap-2",
                        selectedFertilizer === f.id // Simplified active state
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-105"
                          : "bg-white text-[#8C7E6A] border border-[#EBE9E4] hover:border-[#1A1A1A]/30"
                      )}
                    >
                      <span>{f.icon}</span> {f.name} {f.price > 0 && <span className="opacity-40 ml-1">({f.price}G)</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crops Table */}
              <div className="space-y-4">
                <div className="hidden md:grid grid-cols-12 px-6 mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/50"> {/* Smaller padding */}
                  <div className="col-span-4">Crop Name & Details</div>
                  <div className="col-span-2 text-center">Plan Qty</div>
                  <div className="col-span-2 text-right">Investment</div>
                  <div className="col-span-2 text-right">Expected Profit</div>
                  <div className="col-span-2 text-right">Daily Yield</div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {processedCrops.map((crop, idx) => (
                    <motion.div
                      key={crop.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}
                      className={cn( // Smaller padding, rounded corners
                        "grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 rounded-2xl border border-[#EBE9E4] transition-colors bg-white hover:border-[#1A1A1A]/10 gap-4 md:gap-0",
                        idx === 0 && "ring-2 ring-[#82A07D]/20 border-[#82A07D]/30"
                      )} 
                    >
                      <div className="col-span-12 md:col-span-4 flex items-center gap-6">
                        <span className="text-4xl">{crop.icon}</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-[#1A1A1A]">{crop.name}</h4>
                            {idx === 0 && (
                              <span className="bg-[#82A07D] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Recommended</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] font-bold text-[#8C7E6A]">⏱️ {crop.growDays} วัน</span>
                            {crop.reHarvest && (
                              <span className="text-[10px] font-bold text-[#1971C2] bg-[#E7F5FF] px-2 py-0.5 rounded-md">เก็บซ้ำได้ทุก {crop.harvestInterval} วัน</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {crop.recipes?.map(r => (
                              <button
                                key={r}
                                onClick={() => handleRecipeTrigger(r)}
                                className="text-[8px] font-bold bg-[#82A07D]/10 text-[#82A07D] px-2 py-0.5 rounded-full hover:bg-[#82A07D] hover:text-white transition-colors border border-transparent hover:border-[#82A07D]/20"
                              >
                                #{r}
                              </button>
                            ))}
                          </div>
                          
                          {/* Display liked characters portraits */}
                          {crop.likedBy && crop.likedBy.length > 0 && (
                            <div className="flex -space-x-2 mt-4">
                              {crop.likedBy.map(charName => {
                                const char = getCharacterByName(charName);
                                return (
                                  <div key={charName} className="group/char relative">
                                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm ring-1 ring-[#1A1A1A]/5 flex items-center justify-center">
                                      {char?.portrait && (char.portrait.includes('/') || char.portrait.startsWith('http'))
                                        ? <img src={char.portrait} alt={charName} className="w-full h-full object-cover" />
                                        : <span className="text-[14px]">{char?.portrait || charName[0]}</span>
                                      }
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#1A1A1A] text-white text-[8px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover/char:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-75 group-hover/char:scale-100 z-10">
                                      {charName}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-4 md:col-span-2 flex justify-center">
                        <div className="flex flex-col items-center gap-1">
                          <input 
                            type="number"
                            min="0"
                            placeholder="0"
                            value={quantities[crop.id] || ''}
                            onChange={(e) => updateQuantity(crop.id, e.target.value)}
                            className="w-16 bg-[#F8F7F4] border border-[#EBE9E4] rounded-xl text-xs font-mono text-center focus:ring-2 focus:ring-[#82A07D] outline-none py-2 transition-all"
                          />
                          <span className="text-[8px] font-black uppercase tracking-tighter text-[#8C7E6A]/40">Plots</span>
                        </div>
                      </div>

                      <div className="col-span-4 md:col-span-2 text-right border-l md:border-none pl-4 md:pl-0">
                        <p className="text-[10px] font-bold text-[#1A1A1A]">
                          {(crop.totalInvestment * (quantities[crop.id] || 1)).toLocaleString()} G
                        </p>
                        <p className="text-[9px] text-[#8C7E6A] uppercase tracking-tighter mt-1">
                          {quantities[crop.id] > 0 ? `Total Cost` : `Cost per bag`}
                        </p>
                      </div>

                      <div className="col-span-4 md:col-span-2 text-right">
                        <p className="text-[10px] font-black text-[#82A07D]">
                          +{(crop.totalProfit * (quantities[crop.id] || 1)).toLocaleString()} G
                        </p>
                        <p className="text-[9px] text-[#8C7E6A] uppercase tracking-tighter mt-1">
                          {quantities[crop.id] > 0 ? `Total Gain` : `Net Season Gain`}
                        </p>
                      </div>

                      <div className="col-span-12 md:col-span-2 text-right pr-0 md:pr-4 pt-4 md:pt-0 border-t md:border-none">
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "text-xl font-black tracking-tighter leading-none",
                            idx === 0 ? "text-[#82A07D]" : "text-[#1A1A1A]"
                          )}>
                            {crop.profitPerDay.toFixed(1)} <span className="text-[10px] font-bold uppercase ml-0.5">G/Day</span>
                          </span>
                          <div className="h-1 w-24 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (crop.profitPerDay / (processedCrops[0]?.profitPerDay || 1)) * 100)}%` }}
                              className={cn("h-full", idx === 0 ? "bg-[#82A07D]" : "bg-[#1A1A1A]/20")}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </>
          )}

          {activeCategory === 'foraging' && (
            <div className="mt-8">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Wild Foraging Guide</h3>
                <div className="h-[1px] flex-1 bg-[#EBE9E4]"></div>
              </div> 
              <div className="space-y-4">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 px-8 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/50">
                  <div className="col-span-4">Item Name & Liked By</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Respawn</div>
                  <div className="col-span-2">Related Recipes</div>
                  <div className="col-span-2 text-right">Selling Price</div>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {currentWildProducts.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}
                      className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 rounded-2xl border border-[#EBE9E4] bg-white transition-all hover:border-[#1A1A1A]/10 gap-4 md:gap-0" // Smaller padding, rounded corners
                    >
                      <div className="col-span-12 md:col-span-4 flex items-center gap-6">
                        <span className="text-4xl shrink-0">{item.icon}</span>
                        <div className="flex flex-col gap-2">
                          <span className="text-base font-black text-[#1A1A1A]">{item.name}</span>
                          {/* Liked characters portraits */}
                          {item.likedBy && item.likedBy.length > 0 && (
                            <div className="flex -space-x-2">
                              {item.likedBy.map(charName => {
                                const char = getCharacterByName(charName);
                                return (
                                  <div key={charName} className="group/char relative">
                                    <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm ring-1 ring-[#1A1A1A]/5 flex items-center justify-center">
                                      {char?.portrait && (char.portrait.includes('/') || char.portrait.startsWith('http'))
                                        ? <img src={char.portrait} alt={charName} className="w-full h-full object-cover" />
                                        : <span className="text-[12px]">{char?.portrait || charName[0]}</span>
                                      }
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#1A1A1A] text-white text-[8px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover/char:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-75 group-hover/char:scale-100 z-10">{charName}</div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-2 text-[10px] text-[#8C7E6A] italic">📍 {item.location}</div>
                      <div className="col-span-6 md:col-span-2 text-[9px] font-black text-[#8C7E6A] uppercase tracking-tighter text-right md:text-left">RE: {item.respawnDays}</div>
                      <div className="col-span-6 md:col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {item.recipes?.map(r => (
                            <button key={r} onClick={() => handleRecipeTrigger(r)} className="text-[8px] font-bold bg-[#F4A460]/10 text-[#E97451] px-2 py-0.5 rounded-full hover:bg-[#E97451] hover:text-white transition-colors border border-transparent hover:border-[#E97451]/20">#{r}</button>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-2 text-right">
                        <span className="text-xl font-black text-[#82A07D] tracking-tighter">{item.sellPrice.toLocaleString()} <span className="text-[10px] font-bold uppercase ml-0.5">G</span></span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}

          {activeCategory === 'beach' && (
            <div className="mt-8">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Beach Foraging Guide</h3>
                <div className="h-[1px] flex-1 bg-[#EBE9E4]"></div>
              </div> 
              <div className="space-y-4">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 px-8 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/50">
                  <div className="col-span-4">Item Name & Liked By</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Seasonality</div>
                  <div className="col-span-2">Related Recipes</div>
                  <div className="col-span-2 text-right">Selling Price</div>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {currentBeachProducts.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}
                      className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 rounded-2xl border border-[#EBE9E4] bg-white transition-all hover:border-[#1A1A1A]/10 gap-4 md:gap-0" // Smaller padding, rounded corners
                    >
                      <div className="col-span-12 md:col-span-4 flex items-center gap-6">
                        <span className="text-4xl shrink-0">{item.icon}</span>
                        <div className="flex flex-col gap-2">
                          <span className="text-base font-black text-[#1A1A1A]">{item.name}</span>
                          {item.likedBy && item.likedBy.length > 0 && (
                            <div className="flex -space-x-2">
                              {item.likedBy.map(charName => {
                                const char = getCharacterByName(charName);
                                return (
                                  <div key={charName} className="group/char relative">
                                    <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm ring-1 ring-[#1A1A1A]/5 flex items-center justify-center">
                                      {char?.portrait && (char.portrait.includes('/') || char.portrait.startsWith('http'))
                                        ? <img src={char.portrait} alt={charName} className="w-full h-full object-cover" />
                                        : <span className="text-[12px]">{char?.portrait || charName[0]}</span>
                                      }
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#1A1A1A] text-white text-[8px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover/char:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-75 group-hover/char:scale-100 z-10">{charName}</div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-2 text-[10px] text-[#8C7E6A] italic">📍 {item.location}</div>
                      <div className="col-span-6 md:col-span-2 text-right md:text-left">
                        {item.season === 'All' ? <span className="text-[9px] font-black bg-[#82A07D]/10 text-[#82A07D] px-2 py-1 rounded uppercase tracking-tighter">Year Round</span> : <span className="text-[10px] font-bold text-[#8C7E6A] uppercase">{item.season}</span>}
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {item.recipes?.map(r => (
                            <button key={r} onClick={() => handleRecipeTrigger(r)} className="text-[8px] font-bold bg-[#4DABF7]/10 text-[#4DABF7] px-2 py-0.5 rounded-full hover:bg-[#4DABF7] hover:text-white transition-colors border border-transparent hover:border-[#4DABF7]/20">#{r}</button>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-2 text-right">
                        <span className="text-xl font-black text-[#1971C2] tracking-tighter">{item.sellPrice.toLocaleString()} <span className="text-[10px] font-bold uppercase ml-0.5">G</span></span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}

          {activeCategory === 'mining' && (
            <div className="mt-8">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Mining Guide</h3>
                <div className="h-[1px] flex-1 bg-[#EBE9E4]"></div>
              </div> 
              <div className="space-y-4">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 px-8 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/50">
                  <div className="col-span-5">Ore Name & Liked By</div>
                  <div className="col-span-3 text-center">Floor Levels</div>
                  <div className="col-span-4 text-right">Selling Price</div>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {currentMining.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 rounded-2xl border border-[#EBE9E4] bg-white transition-all hover:border-[#1A1A1A]/10 gap-4 md:gap-0" // Smaller padding, rounded corners
                    >
                      <div className="col-span-12 md:col-span-5 flex items-center gap-6">
                        <span className="text-4xl shrink-0">{item.icon}</span>
                        <div className="flex flex-col gap-2">
                          <span className="text-base font-black text-[#1A1A1A]">{item.name}</span>
                          {item.likedBy && (
                            <div className="flex -space-x-2">
                              {item.likedBy.map(charName => {
                                const char = getCharacterByName(charName);
                                return (
                                  <div key={charName} className="group/char relative">
                                    <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm ring-1 ring-[#1A1A1A]/5 flex items-center justify-center">
                                      {char?.portrait && (char.portrait.includes('/') || char.portrait.startsWith('http'))
                                        ? <img src={char.portrait} alt={charName} className="w-full h-full object-cover" />
                                        : <span className="text-[12px]">{char?.portrait || charName[0]}</span>
                                      }
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#1A1A1A] text-white text-[8px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover/char:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-75 group-hover/char:scale-100 z-10">{charName}</div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-3 md:text-center">
                        <span className="text-[10px] font-black bg-[#8C7E6A]/10 text-[#8C7E6A] px-3 py-1.5 rounded-full uppercase tracking-widest">
                          ชั้น {item.floors}
                        </span>
                      </div>
                      <div className="col-span-6 md:col-span-4 text-right">
                        <span className="text-xl font-black text-[#1971C2] tracking-tighter">{item.sellPrice.toLocaleString()} <span className="text-[10px] font-bold uppercase ml-0.5">G</span></span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}

          {activeCategory === 'insects' && (
            <div className="mt-8">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Insect Collection Guide</h3>
                <div className="h-[1px] flex-1 bg-[#EBE9E4]"></div>
              </div> 
              {currentInsects.length > 0 ? (
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 px-8 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/50">
                    <div className="col-span-5">Insect Name</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2">Conditions</div>
                    <div className="col-span-2 text-right">Selling Price</div>
                  </div>

                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-3"
                  >
                    {currentInsects.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}
                        className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-3 rounded-xl border border-[#EBE9E4] bg-white transition-all hover:border-[#1A1A1A]/10 gap-2 md:gap-0" // Smaller padding, rounded corners
                      >
                        <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                          <span className="text-3xl">{item.icon}</span>
                          <span className="text-sm font-bold text-[#1A1A1A]">{item.name}</span>
                        </div>
                        <div className="col-span-6 md:col-span-3 text-[10px] text-[#8C7E6A] italic">
                          📍 {item.location}
                        </div>
                        <div className="col-span-6 md:col-span-2 flex flex-col gap-1 text-right md:text-left">
                          {item.time && (
                            <span className="text-[9px] font-bold text-[#E67E22] flex items-center justify-end md:justify-start gap-1">
                              🕒 {item.time}
                            </span>
                          )}
                          {item.condition && (
                            <span className="text-[9px] font-bold text-[#1971C2] flex items-center justify-end md:justify-start gap-1">
                              🌧️ {item.condition}
                            </span>
                          )}
                        </div>
                        <div className="col-span-12 md:col-span-2 text-right pt-2 md:pt-0 border-t md:border-none">
                          <span className="text-sm font-black text-[#E67E22]">
                            {item.sellPrice.toLocaleString()} G
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <p className="text-center py-20 text-[#8C7E6A]/50 italic">ไม่พบแมลงในฤดูนี้ ❄️</p>
              )}
            </div>
          )}

          {activeCategory === 'calendar' && (
            <div className="mt-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Events & Birthdays</h3>
                  <div className="h-8 w-[1px] bg-[#EBE9E4] hidden md:block"></div>
                </div>
                
                {/* ตัวกรองตัวละครด่วนสำหรับวันเกิด */}
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(SEASON_EVENTS
                    .filter(e => e.season === selectedSeason && e.type === 'birthday')
                    .map(e => e.target)
                  )).map(charName => (
                    <button
                      key={charName}
                      onClick={() => setSearchTerm(searchTerm === charName ? '' : charName)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border",
                        searchTerm === charName 
                          ? "bg-[#F4A460] text-white border-[#F4A460] shadow-sm" 
                          : "bg-white text-[#8C7E6A] border-[#EBE9E4] hover:border-[#F4A460]/50"
                      )}
                    >
                      {charName}
                    </button>
                  ))}
                </div>
                <div className="h-[1px] flex-1 bg-[#EBE9E4] hidden lg:block"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEvents.map((event, idx) => {
                  const char = event.type === 'birthday' ? getCharacterByName(event.target) : null;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible" // Smaller padding, rounded corners
                      className="flex items-center gap-6 p-6 bg-white border border-[#EBE9E4] rounded-[32px] hover:shadow-lg transition-all group"
                    >
                      <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-[#F8F7F4] rounded-2xl border border-[#EBE9E4]">
                        <span className="text-[10px] font-black uppercase text-[#8C7E6A]/50">Day</span>
                        <span className="text-2xl font-black text-[#1A1A1A]">{event.day}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                            event.type === 'birthday' ? "bg-[#FFD1DC] text-[#D6336C]" : "bg-[#D0EBFF] text-[#1971C2]"
                          )}>
                            {event.type}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-[#1A1A1A] tracking-tight">{event.name}</h4>
                        {event.type === 'birthday' && char?.specialFavorite && (
                          <div className="flex items-center gap-1.5 mt-1 bg-[#82A07D]/10 w-fit px-2 py-0.5 rounded-full border border-[#82A07D]/20">
                            <span className="text-sm">{INGREDIENT_ICONS[char.specialFavorite] || '🎁'}</span>
                            <span className="text-[9px] font-bold text-[#5D4037]">{char.specialFavorite}</span>
                          </div>
                        )}
                        {event.description && <p className="text-xs text-[#8C7E6A] italic">{event.description}</p>}
                      </div>

                      {char && (
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm ring-1 ring-[#1A1A1A]/5">
                          <img src={char.portrait} alt={char.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {!char && (
                        <span className="text-3xl opacity-20 group-hover:opacity-100 transition-opacity">🏆</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeCategory === 'fishing' && (
            <div className="mt-8">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Seasonal Fishing Guide</h3>
                <div className="h-[1px] flex-1 bg-[#EBE9E4]"></div>
              </div> 
              <div className="space-y-4">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 px-8 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/50">
                  <div className="col-span-4">Fish Name & Liked By</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Fishing Time</div>
                  <div className="col-span-2">Related Recipes</div>
                  <div className="col-span-2 text-right">Selling Price</div>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {currentFish.map((fish) => (
                    <motion.div
                      key={fish.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}
                      className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 rounded-2xl border border-[#EBE9E4] bg-white transition-all hover:border-[#1A1A1A]/10 gap-4 md:gap-0" // Smaller padding, rounded corners
                    >
                      <div className="col-span-12 md:col-span-4 flex items-center gap-6">
                        <span className="text-4xl shrink-0">{fish.icon}</span>
                        <div className="flex flex-col gap-2">
                          <span className="text-base font-black text-[#1A1A1A]">{fish.name}</span>
                          {/* Liked characters portraits */}
                          {fish.likedBy && fish.likedBy.length > 0 && (
                            <div className="flex -space-x-2">
                              {fish.likedBy.map(charName => {
                                const char = getCharacterByName(charName);
                                return (
                                  <div key={charName} className="group/char relative">
                                    <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm ring-1 ring-[#1A1A1A]/5 flex items-center justify-center">
                                      {char?.portrait && (char.portrait.includes('/') || char.portrait.startsWith('http'))
                                        ? <img src={char.portrait} alt={charName} className="w-full h-full object-cover" />
                                        : <span className="text-[12px]">{char?.portrait || charName[0]}</span>
                                      }
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#1A1A1A] text-white text-[8px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover/char:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-75 group-hover/char:scale-100 z-10">
                                      {charName}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-6 md:col-span-2 text-[10px] text-[#8C7E6A] italic">
                        📍 {fish.location}
                      </div>

                      <div className="col-span-6 md:col-span-2 text-right md:text-left">
                        <span className="text-[10px] text-[#E67E22] font-bold flex items-center gap-1">
                          🕒 {fish.time || 'ทั้งวัน'}
                        </span>
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {fish.recipes?.map(r => (
                            <button 
                              key={r} 
                              onClick={() => handleRecipeTrigger(r)}
                              className="text-[8px] font-bold bg-[#4DABF7]/10 text-[#4DABF7] px-2 py-0.5 rounded-full hover:bg-[#4DABF7] hover:text-white transition-colors border border-transparent hover:border-[#4DABF7]/20"
                            >
                              #{r}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 text-right">
                        <span className="text-xl font-black text-[#1971C2] tracking-tighter">
                          {fish.sellPrice.toLocaleString()} <span className="text-[10px] font-bold uppercase ml-0.5">G</span>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ใช้ RecipeDetailModal ที่ถูก import เข้ามาแทนการเขียนซ้ำ */}
      <RecipeDetailModal 
        selectedRecipe={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)} 
      />

      {/* Season Trivia / Tips */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 p-8 rounded-[32px] bg-[#F8F7F4] border border-[#EBE9E4] flex flex-col md:flex-row gap-8 items-center" // Smaller padding, rounded corners
      >
        <div className="text-5xl">{currentSeasonInfo.icon}</div>
        <div className="flex-1">
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C7E6A] mb-4">Pro Farmer Tip: {selectedSeason}</h5>
          <p className="text-sm text-[#5D4037]/70 leading-relaxed italic">
            {selectedSeason === 'Spring' && "ในฤดูใบไม้ผลิ ควรเน้นปลูกกะหล่ำปลีเพื่อทำกำไรก้อนใหญ่ หรือปลูกสตรอว์เบอร์รีเพื่อเก็บเกี่ยวได้ต่อเนื่องตลอดทั้งเดือน"}
            {selectedSeason === 'Summer' && "ข้าวโพดและมะเขือเทศเป็นพืชที่ปลูกครั้งเดียวแต่ทำเงินได้ตลอดฤดูร้อน อย่าลืมเตรียมถังรดน้ำให้พร้อมสำหรับวันแดดจัด!"}
            {selectedSeason === 'Autumn' && "แครอทและฟักทองให้ราคาขายที่สูงมากในฤดูนี้ เหมาะสำหรับการสะสมเงินเพื่ออัปเกรดบ้านในหน้าหนาว"}
            {selectedSeason === 'Winter' && "ถึงจะหนาวแต่หัวไชเท้าและกะหล่ำดอกก็เติบโตได้ดีมาก เป็นโอกาสดีที่จะสะสมกำไรต่อวันให้สูงที่สุดในรอบปี"}
          </p>
        </div>
        <div className="hidden lg:block w-[1px] h-20 bg-[#EBE9E4]"></div>
        <div className="hidden lg:flex flex-col items-center gap-2">
          <span className="text-[9px] font-black text-[#8C7E6A]/40 uppercase tracking-widest">Growth Boost</span>
          <span className="text-2xl font-bold text-[#82A07D]">Fancy Fertilizer</span>
        </div>
      </motion.div>

      {/* Quantity Planner Summary Panel */}
      <AnimatePresence>
        {activeCategory === 'crops' && summaryData && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
          >
            <div ref={plannerRef} className="bg-[#1A1A1A]/95 backdrop-blur-xl text-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 border border-white/10 ring-1 ring-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col gap-1">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4A460]">Seasonal Planner Summary</h5>
                  <p className="text-xs text-white/60">วางแผนการปลูกทั้งหมด {summaryData.count} ชนิด</p>
                </div>
                
                <div className="flex flex-1 justify-center gap-12">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Total Investment</span>
                    <span className="text-xl font-mono font-bold text-white">{summaryData.totalInvestment.toLocaleString()} G</span>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#82A07D] mb-1">Expected Net Profit</span>
                    <span className="text-2xl font-black tracking-tighter text-[#82A07D]">+{summaryData.totalProfit.toLocaleString()} G</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={exportPlanAsImage}
                    className="px-6 py-3 rounded-2xl bg-[#82A07D] hover:bg-[#6D8A68] text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    📷 Export Plan
                  </button>
                  <button 
                    onClick={() => setQuantities({})}
                    className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Reset Plan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SeasonsPage;