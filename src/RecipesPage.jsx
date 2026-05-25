import React, { useState, useMemo, useEffect, useCallback, useRef, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { CHARACTERS, getCharacterByName } from './characters';
import { SOURCE_ICONS, EQUIPMENT_ICONS, INGREDIENT_ICONS, EQUIPMENT_THEMES, STAR_RATINGS } from './data/constants';
import { FALLBACK_RECIPES } from './data/recipesData';
import RecipeDetailModal from './RecipeDetailModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: "spring", stiffness: 100, damping: 18 }
  }
};

// 1. แยก Row ออกเป็น Component ย่อยและใช้ React.memo
const RecipeListItem = React.memo(({ 
  recipe, 
  isSelected, 
  onToggle, 
  onOpenDetail, 
  targetStars 
}) => {
  const theme = EQUIPMENT_THEMES[recipe.equipment];
  const currentProfit = Math.floor((recipe.sell * targetStars.multiplier) - (recipe.cost || 0));
  const roi = recipe.cost > 0 ? Math.round((currentProfit / recipe.cost) * 100) : 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.015, boxShadow: "0 15px 40px -15px rgba(93, 64, 55, 0.12)", zIndex: 10 }}
      className={cn(
        "group flex items-center gap-6 border-b border-[#EBE9E4] py-6 px-4 transition-all relative z-0",
        theme?.baseBg || "bg-white",
        theme?.hoverBg || "hover:bg-[#FAF9F6]"
      )}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggle(recipe.id); }}
        className={cn(
          "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
          isSelected ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "border-[#EBE9E4] hover:border-[#1A1A1A]"
        )}
      >
        {isSelected && <span className="text-[10px]">✔</span>}
      </button>

      <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={() => onOpenDetail(recipe)}>
        <span className="text-4xl transition-transform group-hover:scale-110 duration-300">{recipe.icon}</span>
        <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h4 className="text-sm font-black uppercase tracking-[0.05em] text-[#1A1A1A]">{recipe.name}</h4>
            <p className="text-[10px] text-[#5F5D59]/50 mt-1 uppercase tracking-wider">{recipe.equipment}</p>
          </div>

          {/* ส่วนวัตถุดิบ */}
          <div className="hidden md:flex flex-1 max-w-md gap-x-1.5 flex-wrap items-center">
            {recipe.ingredients?.map((ing, i) => {
              const ingName = typeof ing === 'string' ? ing : ing.name;
              const hasTooltip = typeof ing === 'object' && (ing.note || ing.alternatives || ing.buyPrice !== undefined);
              return (
                <span key={i} className={cn("text-[11px] text-[#5F5D59]/70 italic", hasTooltip && "underline decoration-dotted cursor-help")}>
                  {ingName}{i < recipe.ingredients.length - 1 ? ',' : ''}
                </span>
              );
            })}
          </div>

          {/* ราคาและกำไร */}
          <div className="group/price relative text-right min-w-[100px] flex flex-col justify-center border-l border-[#EBE9E4] pl-6 items-end cursor-help">
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase font-bold text-[#E97451]/60 tracking-widest">Dish Value</span>
              <span className="text-[12px] font-mono font-bold text-[#E97451]">
                {Math.floor(recipe.sell * targetStars.multiplier).toLocaleString()} G
              </span>
            </div>
            <div className="flex flex-col items-end mt-1">
              {currentProfit >= 0 ? (
                <>
                  <span className="text-[8px] uppercase font-bold text-[#82A07D]/60 tracking-widest">Profit</span>
                  <div className="flex items-center gap-1.5">
                    {currentProfit >= 500 && <span className="text-[8px] bg-[#82A07D] text-white px-1 rounded-sm font-black">BEST</span>}
                    <p className="text-[11px] font-bold text-[#82A07D]">+{currentProfit.toLocaleString()} G <span className="text-[8px] opacity-60">({roi}%)</span></p>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[8px] uppercase font-bold text-[#E94E4E]/60 tracking-widest">Loss Warning</span>
                  <p className="text-[11px] font-bold text-[#E94E4E]">{currentProfit.toLocaleString()} G</p>
                </>
              )}
            </div>

            {/* Tooltip Breakdown */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 p-5 bg-[#1A1A1A]/95 backdrop-blur-xl text-white rounded-3xl opacity-0 group-hover/price:opacity-100 transition-all duration-300 pointer-events-none z-[80] w-64 shadow-2xl scale-90 group-hover/price:scale-100 origin-right">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4A460]">Star Multiplier</span>
              </div>
              <div className="space-y-2.5">
                {STAR_RATINGS.map((star) => (
                  <div key={star.label} className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-white/80">⭐ {star.label}</span>
                    <span className="text-[11px] font-black text-[#82A07D]">
                      {Math.floor(recipe.sell * star.multiplier).toLocaleString()} G
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const RecipesPage = ({ onBack, initialSearch = '' }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [inventory, setInventory] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [targetStars, setTargetStars] = useState(STAR_RATINGS[0]); // Default 0.5 stars
  const [activeSource, setActiveSource] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const deferredSearch = useDeferredValue(searchTerm);

  const summaryRef = useRef(null);

  // --- Persistence: Load data from localStorage on mount ---
  useEffect(() => {
    const savedSelected = localStorage.getItem('doraemon_selected_recipes');
    const savedInventory = localStorage.getItem('doraemon_inventory');
    
    if (savedSelected) setSelectedIds(JSON.parse(savedSelected));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  // Sync searchTerm เมื่อ initialSearch จาก props เปลี่ยน (เช่น กดจากหน้า Seasons)
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  // --- Persistence: Save data to localStorage when changed ---
  useEffect(() => {
    localStorage.setItem('doraemon_selected_recipes', JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    localStorage.setItem('doraemon_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.example.com/doraemon-sos/recipes'); 
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.warn("Using fallback data because:", err.message);
        setFetchError(err.message);
        setRecipes(FALLBACK_RECIPES); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // เพิ่มการรองรับปุ่ม ESC เพื่อปิด Modal หรือกลับหน้าหลัก
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

  // สร้างฐานข้อมูลวัตถุดิบเพื่อการค้นหาที่รวดเร็ว (O(1) lookup)
  const ingredientDb = useMemo(() => {
    const db = {};
    recipes.forEach(r => {
      r.ingredients?.forEach(ing => {
        if (typeof ing === 'object' && ing.name) {
          // เก็บข้อมูลวัตถุดิบที่มีรายละเอียดครบที่สุด (เช่น มีราคาซื้อ)
          if (!db[ing.name] || (!db[ing.name].buyPrice && ing.buyPrice)) {
            db[ing.name] = ing;
          }
        }
      });
    });
    return db;
  }, [recipes]);

  const isFiltered = searchTerm || selectedEquipment.length > 0 || selectedIngredients.length > 0 || selectedCharacters.length > 0;

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedEquipment([]);
    setSelectedIngredients([]);
    setSelectedCharacters([]);
    setActiveSource(null);
  }, []);

  const ALL_EQUIPMENT = useMemo(() => {
    const equipmentSet = new Set();
    recipes?.forEach(recipe => {
      if (recipe.equipment) equipmentSet.add(recipe.equipment);
    });
    return Array.from(equipmentSet).sort();
  }, [recipes]);

  // คำนวณจำนวนเมนูแยกตามอุปกรณ์ เพื่อโชว์ Utility
  const equipmentCounts = useMemo(() => {
    const counts = {};
    recipes?.forEach(r => {
      if (r.equipment) {
        counts[r.equipment] = (counts[r.equipment] || 0) + 1;
      }
    });
    return counts;
  }, [recipes]);

  const INGREDIENTS_BY_SOURCE = useMemo(() => {
    const groups = {};
    recipes?.forEach(r => {
      r.ingredients?.forEach(ing => {
        const name = typeof ing === 'string' ? ing : ing.name;
        const source = (typeof ing === 'object' && ing.source) ? ing.source : 'ไม่ระบุ';
        if (!groups[source]) groups[source] = new Set();
        groups[source].add(name);
        if (typeof ing === 'object' && ing.alternatives) {
          ing.alternatives.forEach(alt => groups[source].add(alt));
        }
      });
    });
    return Object.keys(groups).sort().map(source => ({
      source,
      items: Array.from(groups[source]).sort()
    }));
  }, [recipes]);

  const ALL_CHARACTERS = useMemo(() => {
    const names = new Set();
    recipes?.forEach(r => {
      r.likedBy?.forEach(char => names.add(char));
    });
    return Array.from(names).sort().map(name => ({
      name,
      portrait: CHARACTERS?.find(c => c.name === name)?.portrait || '👤'
    }));
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    let result = (recipes || []).filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesEquipment = selectedEquipment.length === 0 || selectedEquipment.includes(recipe.equipment); 
      const matchesIngredients = selectedIngredients.length === 0 ||
                                 selectedIngredients.every(selectedName => {
                                   return recipe.ingredients?.some(ing => {
                                     const ingName = typeof ing === 'string' ? ing : ing.name;
                                     return ingName === selectedName || (ing.alternatives && ing.alternatives.includes(selectedName));
                                   });
                                 });
      const matchesCharacters = selectedCharacters.length === 0 || 
                                (recipe.likedBy && selectedCharacters.some(char => recipe.likedBy.includes(char)));
      return matchesSearch && matchesEquipment && matchesIngredients && matchesCharacters;
    });

    const currentMultiplier = targetStars.multiplier;
    if (sortBy === 'profit') {
      result.sort((a, b) => {
        const profitA = ((a.sell || 0) * currentMultiplier) - (a.cost || 0);
        const profitB = ((b.sell || 0) * currentMultiplier) - (b.cost || 0);
        return profitB - profitA;
      });
    }

    return result;
  }, [recipes, deferredSearch, selectedEquipment, selectedIngredients, selectedCharacters, sortBy, targetStars]);

  // เพิ่มการคำนวณ groupedRecipes เพื่อแก้ปัญหา Error
  const groupedRecipes = useMemo(() => {
    const groups = {};
    filteredRecipes.forEach(recipe => {
      const eq = recipe.equipment || 'ไม่มีอุปกรณ์';
      if (!groups[eq]) groups[eq] = [];
      groups[eq].push(recipe);
    });
    return groups;
  }, [filteredRecipes]);

  // ตรวจสอบว่าเมนูที่กรองอยู่ถูกเลือกทั้งหมดหรือยัง
  const allFilteredSelected = useMemo(() => {
    return filteredRecipes.length > 0 && filteredRecipes.every(r => selectedIds.includes(r.id));
  }, [filteredRecipes, selectedIds]);

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredRecipes.map(r => r.id);
    if (allFilteredSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const summaryData = useMemo(() => {
    if (selectedIds.length === 0) return null;
    
    const selectedRecipesList = (recipes || []).filter(r => selectedIds.includes(r.id));
    const ingredientMap = {};
    let totalCost = 0;
    let totalSell = 0;
    let totalBuyMissing = 0;
    const currentMultiplier = targetStars.multiplier;

    const recipeProfits = selectedRecipesList.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      icon: recipe.icon,
      profit: Math.floor((recipe.sell * currentMultiplier) - (recipe.cost || 0))
    })).sort((a, b) => b.profit - a.profit);

    selectedRecipesList.forEach(recipe => {
      totalCost += recipe.cost || 0;
      totalSell += (recipe.sell || 0) * currentMultiplier;
      recipe.ingredients?.forEach(ing => {
        const name = typeof ing === 'string' ? ing : ing.name;
        ingredientMap[name] = (ingredientMap[name] || 0) + 1;
      });
    });

    return {
      count: selectedRecipesList.length,
      ingredients: Object.entries(ingredientMap).map(([name, requiredQty]) => {
        const haveQty = inventory[name] || 0;
        const missingQty = Math.max(0, requiredQty - haveQty);
        
        // ดึงราคาซื้อจาก Database ที่เตรียมไว้ (เร็วกว่าเดิมมาก)
        const buyPrice = ingredientDb[name]?.buyPrice || 0;

        if (missingQty > 0) totalBuyMissing += (missingQty * buyPrice);

        return {
          name,
          requiredQty,
          haveQty,
          missingQty,
          buyPrice
        };
      }).sort((a, b) => b.requiredQty - a.requiredQty),
      recipeProfits,
      totalCost,
      totalSell,
      totalProfit: totalSell - totalCost,
      totalBuyMissing
    };
  }, [recipes, selectedIds, inventory, targetStars, ingredientDb]);

  const handleEquipmentToggle = (equipment) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment) ? prev.filter(e => e !== equipment) : [...prev, equipment]
    );
  };

  const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleCharacterToggle = (character) => {
    setSelectedCharacters(prev => 
      prev.includes(character) ? prev.filter(c => c !== character) : [...prev, character]
    );
  };

  const handleRowToggle = useCallback((id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const updateInventory = (name, value) => {
    // ป้องกันค่า NaN เมื่อผู้ใช้ลบตัวเลขจนว่าง
    const val = value === '' ? 0 : parseInt(value);
    setInventory(prev => ({
      ...prev,
      [name]: isNaN(val) ? 0 : Math.max(0, val)
    }));
  };

  const exportAsImage = async () => {
    if (!summaryRef.current) return;
    
    try {
      // โหลด library แบบ dynamic เพื่อลดขนาด bundle ตอนเริ่ม
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#1A1A1A', // กำหนดพื้นหลังให้ตรงกับ UI
        scale: 2, // เพิ่มความละเอียดภาพเป็น 2 เท่า
        logging: false,
        useCORS: true,
        borderRadius: 32
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `doraemon-sos-shopping-list-${new Date().getTime()}.png`;
      link.click();
    } catch (err) {
      console.error("Export image failed:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="w-full border-x border-[#EBE9E4] bg-white min-h-screen p-8 md:p-20"
    >
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row items-baseline justify-between border-b border-[#1A1A1A]/10 pb-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-none">
            Recipes 
            <span className="ml-3 text-xl font-light text-[#8C7E6A]/40">[{filteredRecipes.length}]</span>
          </h2>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.5em] text-[#8C7E6A]">Culinary Database / Volume 01</p>
        </div>
        <button 
          onClick={onBack}
          className="mt-8 md:mt-0 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:opacity-50 transition-opacity"
        >
          Close Index [ESC]
        </button>
      </div>

      {/* Toolbar: Real-time Search & Category Filters */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Big Search Input */}
        <div className="lg:col-span-7 relative">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A] block">Quick Search</span>
            {isFiltered && (
              <motion.button 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, color: '#EF4444' }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="text-[9px] font-bold text-[#E94E4E] uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                Reset Filters <motion.span whileHover={{ rotate: 90 }}>✕</motion.span>
              </motion.button>
            )}
          </div>
          <input
            type="text"
            placeholder="Recipe name..."
            className="w-full text-2xl md:text-3xl font-light tracking-tight outline-none placeholder:opacity-10 bg-transparent border-b border-[#EBE9E4] py-2 focus:border-[#1A1A1A] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Equipment Filter - Top Right Style */}
        <div className="lg:col-span-5 flex flex-col justify-end bg-[#F8F7F4]/40 p-6 rounded-[32px] border border-[#EBE9E4]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A] block">Cookware Category</span>
            <button 
              onClick={() => setSortBy(prev => prev === 'profit' ? 'name' : 'profit')}
              className={cn(
                "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 border transition-all rounded-full",
                sortBy === 'profit' 
                  ? "bg-[#82A07D] text-white border-[#82A07D]" 
                  : "text-[#8C7E6A] border-[#EBE9E4] hover:border-[#8C7E6A]"
              )}
            >
              {sortBy === 'profit' ? 'Sorted by Profit ↓' : 'Sort by Profit'}
            </button>
          </div>
          
          {/* Star Selector */}
          <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {STAR_RATINGS.map((star) => (
              <button
                key={star.label}
                onClick={() => setTargetStars(star)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[9px] font-black transition-all shrink-0 whitespace-nowrap",
                  targetStars.label === star.label 
                    ? "bg-[#FCC419] text-white shadow-sm" 
                    : "bg-white text-[#8C7E6A]/60 border border-[#EBE9E4] hover:border-[#FCC419]/50"
                )}
              >
                ⭐ {star.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_EQUIPMENT.map((eq, idx) => (
              <motion.button
                key={eq}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ 
                  y: -1, // Subtle lift
                  boxShadow: "0 4px 12px -4px rgba(0,0,0,0.1)" // Lighter shadow
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEquipmentToggle(eq)}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300", // Smaller padding, single border
                  selectedEquipment.includes(eq)
                    ? EQUIPMENT_THEMES[eq]?.active || "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md"
                    : "bg-white text-[#1A1A1A] border-[#EBE9E4] hover:border-[#F4A460]/50"
                )}
              >
                <span className={cn(
                  "text-xl transition-transform duration-300 group-hover:scale-125",
                  selectedEquipment.includes(eq) ? "scale-110 opacity-100" : "opacity-50 group-hover:opacity-100" // Slightly more visible inactive
                )}>{EQUIPMENT_ICONS[eq] || '🍳'}
                </span>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    {eq}
                  </span>
                  <span className="text-[8px] opacity-40 font-bold">{equipmentCounts[eq] || 0}</span>
                </div>
                {selectedEquipment.includes(eq) && (
                  <motion.div 
                    layoutId="activeEquipment"
                    className={cn( // Smaller dot
                      "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                      EQUIPMENT_THEMES[eq]?.dot || "bg-[#F4A460]"
                    )}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Character Filter Bar - Simplified */}
      <div className="mb-12 flex items-end gap-6 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex flex-col gap-2 pb-4">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A] whitespace-nowrap">Character Filter</span>
          <div className="h-[1px] w-6 bg-[#8C7E6A]/20"></div>
        </div>
        {ALL_CHARACTERS.map(charObj => (
          <button
            key={charObj.name}
            onClick={() => handleCharacterToggle(charObj.name)}
            aria-label={`Filter by character: ${charObj.name}`}
            className={cn( // Reduced opacity for inactive, simpler hover
              "group flex flex-col items-center gap-3 transition-all min-w-[70px]",
              selectedCharacters.includes(charObj.name) ? "opacity-100" : "opacity-30 hover:opacity-60"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center bg-white border-2 transition-all shadow-sm text-2xl",
              selectedCharacters.includes(charObj.name) ? "border-[#F4A460] ring-4 ring-[#F4A460]/10 scale-110" : "border-[#EBE9E4]"
            )}> {/* Removed ring on inactive */}
              {charObj.portrait}
            </div>
            <span className="text-[10px] font-bold text-[#1A1A1A] whitespace-nowrap">{charObj.name}</span>
          </button>
        ))}
      </div>

      {/* Ingredient Filter Bar */}
      <div className="mb-16 space-y-6">
        <div className="flex flex-col gap-4">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]">Ingredient Sources</span>
          <div className="flex flex-wrap gap-3">
            {INGREDIENTS_BY_SOURCE.map(group => {
              const isAnyInSourceSelected = group.items.some(item => selectedIngredients.includes(item));
              const isActive = activeSource === group.source;
              
              return (
                <button
                  key={group.source}
                  onClick={() => setActiveSource(isActive ? null : group.source)}
                  aria-label={`Filter by ingredient source: ${group.source}`}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    isActive 
                      ? "bg-[#1A1A1A] text-white shadow-lg scale-105" 
                      : isAnyInSourceSelected 
                        ? "bg-[#82A07D]/10 text-[#82A07D] border border-[#82A07D]/20" 
                        : "bg-[#F8F7F4] text-[#8C7E6A]/60 border border-[#EBE9E4] hover:border-[#8C7E6A]/30"
                  )}
                >
                  <span>{SOURCE_ICONS[group.source] || '📦'}</span>
                  {group.source}
                  {isAnyInSourceSelected && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#82A07D] ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSource && (
            <motion.div
              key={activeSource}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#F8F7F4]/50 rounded-2xl p-6 border border-[#EBE9E4]" // Smaller padding, rounded corners
            >
              <div className="flex flex-wrap gap-2">
                {INGREDIENTS_BY_SOURCE.find(g => g.source === activeSource)?.items.map(ing => (
                  <button
                    key={ing}
                    onClick={() => handleIngredientToggle(ing)}
                    aria-label={`Filter by ingredient: ${ing}`}
                    className={cn(
                      "px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all duration-300",
                      selectedIngredients.includes(ing) 
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm scale-105" // Smaller shadow
                        : "bg-white text-[#5F5D59]/60 border-[#EBE9E4] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                    )}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recipe List */}
      <div className="flex flex-col">
        {isFiltered && filteredRecipes.length > 0 && (
          <div className="flex justify-between items-end mb-4 px-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/40">Results List</span>
              <div className="h-[1px] w-8 bg-[#8C7E6A]/20"></div>
            </div>
            <button 
              onClick={toggleSelectAllFiltered}
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all border",
                allFilteredSelected 
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                  : "text-[#8C7E6A] border-[#EBE9E4] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
              )}
            >
              {allFilteredSelected ? 'Deselect All Filtered' : `Select All ${filteredRecipes.length} Results`}
            </button>
          </div>
        )}
        
        <div className="border-t border-[#EBE9E4]">
        {!isFiltered ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center" // Reduced padding
          >
            <span className="text-7xl mb-8 opacity-20 grayscale">👨‍🍳</span>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C7E6A]/40 mb-2">Kitchen is Ready</h3>
            <p className="text-sm text-[#8C7E6A]/60 italic font-medium">เลือกหมวดหมู่หรือค้นหาเมนูที่ต้องการ เพื่อเริ่มต้นการใช้งาน</p>
          </motion.div>
        ) : isLoading && recipes.length === 0 ? (
          <p className="col-span-full py-20 text-center opacity-40 italic">กำลังเตรียมครัวอย่างพิถีพิถัน... 🥣</p>
        ) : filteredRecipes.length > 0 ? (
          <motion.div
            key={isFiltered ? "filtered" : "empty"} // บังคับให้เริ่มอนิเมชันใหม่เมื่อมีการค้นหา
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {filteredRecipes.map(recipe => (
              <RecipeListItem
              key={recipe.id}
              recipe={recipe}
              isSelected={selectedIds.includes(recipe.id)}
              onToggle={handleRowToggle}
              onOpenDetail={setSelectedRecipe}
              targetStars={targetStars}
              />
            ))}
          </motion.div>
        ) : (
          <p className="col-span-full text-center py-10 opacity-50 text-lg">ไม่พบเมนูที่ต้องการเลยครับ 🍃</p>
        )}
        </div>
      </div>

      {/* Aggregate Summary Panel - Floating at bottom */}
      <AnimatePresence>
        {summaryData && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
          >
            <div ref={summaryRef} className="bg-[#1A1A1A]/95 backdrop-blur-xl text-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 border border-white/10 ring-1 ring-white/10">
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Left: Ingredient List */}
                <div className="flex-[1.5]">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4A460]">Inventory Check ({summaryData.ingredients.length} ชนิด)</h5>
                    <div className="flex gap-4 items-center">
                      <button 
                        onClick={exportAsImage}
                        className="text-[9px] font-black text-[#82A07D] hover:text-white hover:bg-[#82A07D] px-2.5 py-1 rounded-lg transition-all uppercase tracking-widest border border-[#82A07D]/30"
                      >
                        📷 Export Image
                      </button>
                      <button 
                        onClick={() => setInventory({})}
                        className="text-[9px] font-black text-white/30 hover:text-[#F4A460] transition-colors uppercase tracking-widest"
                      >
                        Reset Stock
                      </button>
                      <button 
                        onClick={() => setSelectedIds([])}
                        className="text-[9px] font-black text-white/30 hover:text-[#EF4444] transition-colors uppercase tracking-widest"
                      >
                        Clear All [ {summaryData.count} ]
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {summaryData.ingredients.map(ing => (
                      <div key={ing.name} className={cn(
                        "flex items-center gap-3 bg-white/5 border px-3 py-2 rounded-2xl transition-all",
                        ing.missingQty === 0 ? "border-[#82A07D]/40 bg-[#82A07D]/10" : "border-white/10"
                      )}>
                        <span className="text-xl">{INGREDIENT_ICONS[ing.name] || '📦'}</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white/90">{ing.name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold text-[#F4A460]">Req: {ing.requiredQty}</span>
                            <span className="text-white/20">|</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] font-bold text-white/40 uppercase">Own:</span>
                              <input 
                                type="number"
                                min="0"
                                value={ing.haveQty}
                                onChange={(e) => updateInventory(ing.name, e.target.value)}
                                className="w-8 bg-white/10 border-none rounded text-[10px] font-mono text-center focus:ring-1 focus:ring-[#F4A460] outline-none py-0"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 pl-3 border-l border-white/5 min-w-[30px] flex justify-center">
                          {ing.missingQty > 0 ? (
                            <span className="text-[11px] font-black text-[#EF4444]">-{ing.missingQty}</span>
                          ) : (
                            <span className="text-sm text-[#82A07D]">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center: Profit Comparison Graph */}
                <div className="hidden xl:flex flex-1 flex-col border-l border-white/10 pl-8">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4A460] mb-6">Profit Analysis</h5>
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-48 pr-2 custom-scrollbar">
                    {summaryData.recipeProfits.map((item) => {
                      const maxVal = Math.max(...summaryData.recipeProfits.map(p => Math.abs(p.profit)), 1);
                      const widthPerc = Math.min(100, (Math.abs(item.profit) / maxVal) * 100);
                      const isLoss = item.profit < 0;

                      return (
                        <div key={item.id} className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
                            <span className="opacity-60">{item.icon} {item.name}</span>
                            <span className={isLoss ? "text-[#E94E4E]" : "text-[#82A07D]"}>
                              {item.profit > 0 ? '+' : ''}{item.profit.toLocaleString()} G
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${widthPerc}%` }}
                              className={cn(
                                "h-full rounded-full transition-colors",
                                isLoss ? "bg-[#E94E4E]" : "bg-[#82A07D]"
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Financial Summary */}
                <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-white/40">
                      <span>Recipes Selected</span>
                      <span className="text-white">{summaryData.count} items</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-white/40">
                      <span>Total Cost</span>
                      <span className="text-white">{summaryData.totalCost.toLocaleString()} G</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-white/40">
                      <span>Total Market Value</span>
                      <span className="text-white">{summaryData.totalSell.toLocaleString()} G</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-[#F4A460]">
                      <span>Gold Needed to Buy Missing</span>
                      <span className="text-[#F4A460] font-black">{summaryData.totalBuyMissing.toLocaleString()} G</span>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#82A07D]">Potential Profit</span>
                      <span className={cn(
                        "text-3xl font-black tracking-tighter leading-none mt-1",
                        summaryData.totalProfit >= 0 ? "text-[#82A07D]" : "text-[#E94E4E]"
                      )}>
                        {summaryData.totalProfit >= 0 ? '+' : ''}{summaryData.totalProfit.toLocaleString()} G
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="fixed inset-0 bg-[#5F5D59]/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 m-auto z-[70] w-[90%] max-w-md h-fit bg-[#FCFBF7] border-[6px] border-double border-[#8C7E6A]/20 p-10 shadow-2xl overflow-hidden"
            >
              <div className="relative flex flex-col items-center">
                {/* Decorative Japanese Badge */}
                <div 
                  className="absolute -left-6 top-0 hidden sm:block text-[10px] font-bold text-[#8C7E6A]/30 uppercase tracking-[0.5em]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  四季の料理
                </div>

                {/* Icon Area - Styled like a Stamp */}
                <div className="mb-10 flex h-28 w-28 items-center justify-center border border-[#8C7E6A]/20 bg-white p-4 shadow-inner ring-4 ring-[#FCFBF7]">
                  <span className="text-7xl drop-shadow-sm">{selectedRecipe.icon}</span>
                </div>

                {/* Recipe Header */}
                <div className="text-center mb-10 w-full">
                  <h3 className="text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase mb-2">
                    {selectedRecipe.name}
                  </h3>
                  <div className="mx-auto h-[1px] w-12 bg-[#1A1A1A]/20 mb-4"></div>
                  <p className="text-[10px] font-bold text-[#8C7E6A] uppercase tracking-[0.4em]">
                    Tools: {selectedRecipe.equipment}
                  </p>
                </div>

                {/* Ingredients List */}
                <div className="w-full space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] flex-1 bg-[#1A1A1A]/5"></div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#5F5D59]/40">
                      Required Ingredients
                    </span>
                    <div className="h-[1px] flex-1 bg-[#1A1A1A]/5"></div>
                  </div>
                  
                  <ul className="grid grid-cols-1 gap-y-4 px-4">
                    {selectedRecipe.ingredients?.map((ing, i) => {
                      const ingName = typeof ing === 'string' ? ing : ing.name;
                      const ingSource = typeof ing === 'string' ? 'Unknown' : ing.source;
                      const hasTooltip = typeof ing === 'object' && (ing.note || ing.alternatives || ing.buyPrice !== undefined || ing.sellPrice !== undefined || ing.season || ing.location || ing.source);

                      return (
                        <li key={i} className="flex justify-between items-center border-b border-[#1A1A1A]/5 pb-3">
                          <div className="flex items-center gap-4">
                            {/* Item Slot Icon with Tooltip */}
                            <div className={cn("relative", hasTooltip && "group/tooltip")}>
                              <div className={cn(
                                "w-10 h-10 bg-white border border-[#8C7E6A]/20 rounded-lg flex items-center justify-center text-xl shadow-sm shrink-0 transition-transform",
                                hasTooltip && "cursor-help group-hover/tooltip:scale-105"
                              )}>
                                {INGREDIENT_ICONS[ingName] || '📦'}
                              </div>

                              {hasTooltip && (
                                /* Tooltip Popup */
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-[#1A1A1A]/95 backdrop-blur-md text-white rounded-2xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-[80] w-max max-w-[220px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 scale-90 group-hover/tooltip:scale-100 origin-bottom ring-1 ring-white/10">
                                  <p className="text-xs font-black text-[#F4A460] uppercase tracking-widest border-b border-white/10 pb-2 mb-2">{ingName}</p>
                                  {ing.source && <p className="text-[10px] text-[#F3E5AB] mt-1 flex items-center gap-1.5 mb-2"><span className="opacity-50 text-[8px]">SOURCE</span> {SOURCE_ICONS[ing.source] || '📦'} {ing.source}</p>}
                                  {ing.note && <p className="text-[11px] font-medium leading-relaxed opacity-90">{ing.note}</p>}
                                  {ing.season && <p className="text-[10px] text-[#E2F0D9] mt-2 flex items-center gap-1.5"><span className="opacity-50 text-[8px]">SEASON</span> {ing.season}</p>}
                                  {ing.location && <p className="text-[10px] text-[#D9EAF7] mt-1 flex items-center gap-1.5"><span className="opacity-50 text-[8px]">LOCATION</span> {ing.location}</p>}
                                  {(ing.buyPrice !== undefined || ing.sellPrice !== undefined) && (
                                    <div className="text-[10px] flex flex-col gap-1.5 mt-3 pt-3 border-t border-white/10">
                                      {ing.buyPrice !== undefined && (
                                        <div className="flex justify-between gap-8 uppercase tracking-widest">
                                          <span className="opacity-40 text-[8px] font-black">Buy</span> <span className="text-[#F4A460] font-bold">{ing.buyPrice} G</span>
                                        </div>
                                      )}
                                      {ing.sellPrice !== undefined && (
                                        <div className="flex justify-between gap-8 uppercase tracking-widest">
                                          <span className="opacity-40 text-[8px] font-black">Sell</span> <span className="text-[#82A07D] font-bold">{ing.sellPrice} G</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {ing.alternatives && (
                                    <p className={cn("text-[10px] text-[#F4A460] italic leading-tight", (ing.note || ing.buyPrice !== undefined || ing.sellPrice !== undefined || ing.season || ing.location) && "mt-3 pt-3 border-t border-white/10")}>
                                      ใช้แทนด้วย: {ing.alternatives.join(', ')}
                                    </p>
                                  )}
                                  {/* Triangle Arrow */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1A1A1A]/95"></div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-[#1A1A1A]">
                                  {ingName}
                                </span>
                                {ing.alternatives && (
                                  <span className="text-[9px] text-[#8C7E6A]/60 italic font-normal">หรือ {ing.alternatives.join(', ')}</span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#8C7E6A]/60 font-medium italic uppercase tracking-wider mt-0.5">
                                {ingSource}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#D4C4A8]">✔</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Liked By Section */}
                {selectedRecipe.likedBy && selectedRecipe.likedBy.length > 0 && (
                  <div className="w-full space-y-6 mt-8">
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-[1px] flex-1 bg-[#1A1A1A]/5"></div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#5F5D59]/40">Liked By</span>
                      <div className="h-[1px] flex-1 bg-[#1A1A1A]/5"></div>
                    </div>
                    <div className="flex justify-center flex-wrap gap-4">
                      {selectedRecipe.likedBy.map(charName => {
                        const char = getCharacterByName(charName);
                        return (
                          <div key={charName} className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full border-2 border-[#8C7E6A]/20 overflow-hidden bg-white shadow-sm">
                              <img src={char?.portrait || `https://ui-avatars.com/api/?name=${charName}`} alt={charName} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] font-bold text-[#1A1A1A]/70">{charName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Cooking Tips */}
                {selectedRecipe.tips && (
                  <div className="w-full mt-8 bg-[#82A07D]/5 border-l-4 border-[#82A07D] p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#82A07D] mb-1">💡 Cooking Tips</p>
                    <p className="text-xs text-[#5D4037]/80 leading-relaxed italic">
                      {selectedRecipe.tips}
                    </p>
                  </div>
                )}

                {/* Redesigned Price Breakdown */}
                <div className="group/modal-price relative w-full mt-8 bg-[#F3DCC1]/10 rounded-xl p-5 space-y-3 cursor-help">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5D4037]/60">ราคาขายเมื่อปรุงเสร็จ (Dish Ship Price)</span>
                    <span className="font-bold text-[#E97451]">{selectedRecipe.sell.toLocaleString()} G</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5D4037]/60">มูลค่าหากขายวัตถุดิบแยก (Ingredient Value)</span>
                    <span className="text-[#5D4037]/80">{selectedRecipe.cost?.toLocaleString() || 0} G</span>
                  </div>
                  <div className="h-[1px] bg-[#1A1A1A]/10"></div>
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-[0.1em]",
                      selectedRecipe.sell - (selectedRecipe.cost || 0) >= 0 ? "text-[#82A07D]" : "text-[#E94E4E]"
                    )}>
                      {selectedRecipe.sell - (selectedRecipe.cost || 0) >= 0 ? "กำไรจากการปรุง (Added Profit)" : "ขาดทุนจากการปรุง (Cooking Loss)"}
                    </span>
                    <span className={cn(
                      "text-lg font-black",
                      selectedRecipe.sell - (selectedRecipe.cost || 0) >= 0 ? "text-[#82A07D]" : "text-[#E94E4E]"
                    )}>
                      {selectedRecipe.sell - (selectedRecipe.cost || 0) >= 0 ? "+" : ""}
                      {(selectedRecipe.sell - (selectedRecipe.cost || 0)).toLocaleString()} G
                    </span>
                  </div>

                  {/* Modal Star Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-5 bg-[#1A1A1A]/95 backdrop-blur-xl text-white rounded-3xl opacity-0 group-hover/modal-price:opacity-100 transition-all duration-300 pointer-events-none z-[80] w-64 shadow-2xl scale-90 group-hover/modal-price:scale-100 origin-bottom border border-white/10 ring-1 ring-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4A460] mb-4 border-b border-white/10 pb-2 text-center">Star Rating Breakdown</p>
                    <div className="space-y-2.5">
                      {STAR_RATINGS.map((star) => (
                        <div key={star.label} className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-white/80">⭐ {star.label}</span>
                          <div className="text-right leading-none">
                            <p className="text-[11px] font-black text-[#82A07D]">
                              {Math.floor(selectedRecipe.sell * star.multiplier).toLocaleString()} G
                            </p>
                            <p className="text-[7px] opacity-30 mt-1 uppercase">Profit: +{Math.floor(selectedRecipe.sell * star.multiplier - (selectedRecipe.cost || 0)).toLocaleString()} G</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#1A1A1A]/95"></div>
                  </div>
                </div>

                {/* Close Button as a Menu Footer */}
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="mt-12 group text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all flex flex-col items-center gap-2"
                >
                  <div className="h-[1px] w-8 bg-[#1A1A1A]/10 group-hover:w-16 transition-all duration-500"></div>
                  Close Details
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecipesPage;