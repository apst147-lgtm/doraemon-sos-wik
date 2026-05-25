import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RecipesPage = ({ onBack }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        // โปรดเปลี่ยน URL นี้เป็น API endpoint จริงของคุณ
        const response = await fetch('https://api.example.com/doraemon-sos/recipes'); 
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลเมนูอาหารได้');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // ดึงรายการอุปกรณ์ที่มีทั้งหมดจากข้อมูลที่โหลดมาจริง
  const ALL_EQUIPMENT = useMemo(() => {
    const equipmentSet = new Set();
    recipes.forEach(recipe => {
      if (recipe.equipment) equipmentSet.add(recipe.equipment);
    });
    return Array.from(equipmentSet).sort();
  }, [recipes]);

  // ดึงรายการวัตถุดิบที่มีทั้งหมดจากข้อมูลที่โหลดมาจริง
  const ALL_INGREDIENTS = useMemo(() => {
    return Array.from(new Set(recipes.flatMap(r => r.ingredients || []))).sort();
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEquipment = selectedEquipment.length === 0 || selectedEquipment.includes(recipe.equipment);
      const matchesIngredients = selectedIngredients.length === 0 || 
                                 selectedIngredients.every(ing => recipe.ingredients.includes(ing));
      return matchesSearch && matchesEquipment && matchesIngredients;
    });
  }, [recipes, searchTerm, selectedEquipment, selectedIngredients]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="bg-white p-8 rounded-[40px] border border-[#EBE9E4] shadow-sm"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-light text-[#5F5D59]">รวมเมนูอาหาร 🍲</h2>
        <button 
          onClick={onBack}
          className="px-6 py-2 bg-[#D4C4A8] text-white rounded-full text-sm hover:bg-[#BBAA90] transition-colors"
        >
          ย้อนกลับ
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-10 p-6 bg-[#FAF9F6] rounded-2xl border border-[#EBE9E4]">
        <h3 className="text-xl font-medium mb-4 text-[#5F5D59]">ตัวกรองเมนู</h3>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหาชื่อเมนู..."
            className="w-full p-3 border border-[#D1CEC7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C4A8] transition-all bg-white text-[#4A4A4A]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Equipment Filter */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2 text-[#5F5D59] opacity-80">อุปกรณ์ทำอาหาร:</p>
          <div className="flex flex-wrap gap-2">
            {ALL_EQUIPMENT.map(eq => (
              <motion.button
                key={eq}
                onClick={() => handleEquipmentToggle(eq)}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 
                  ${selectedEquipment.includes(eq) 
                    ? 'bg-[#8C7E6A] text-white shadow-md' 
                    : 'bg-white text-[#5F5D59] border border-[#D1CEC7] hover:bg-[#EBE9E4]'
                  }`}
                whileTap={{ scale: 0.95 }}
              >
                {eq}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Ingredients Filter */}
        <div>
          <p className="text-sm font-medium mb-2 text-[#5F5D59] opacity-80">วัตถุดิบ:</p>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {ALL_INGREDIENTS.map(ing => (
              <motion.button
                key={ing}
                onClick={() => handleIngredientToggle(ing)}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 
                  ${selectedIngredients.includes(ing) 
                    ? 'bg-[#A8BCCF] text-white shadow-md' 
                    : 'bg-white text-[#5F5D59] border border-[#D1CEC7] hover:bg-[#EBE9E4]'
                  }`}
                whileTap={{ scale: 0.95 }}
              >
                {ing}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe List */}
      {isLoading && recipes.length === 0 ? (
        <p className="col-span-full py-20 text-center italic opacity-40">กำลังเตรียมครัวอย่างพิถีพิถัน... 🥣</p>
      ) : filteredRecipes.length > 0 ? (
        <div className="space-y-20">
          {Object.keys(groupedRecipes).sort().map(equipment => (
            <div key={equipment} className="col-span-full">
              <h3 className="mb-12 border-b border-[#F3DCC1] pb-6 text-2xl font-bold tracking-tight text-[#5D4037]">
                {equipment === 'ไม่มีอุปกรณ์' ? 'เมนูที่ไม่ต้องใช้อุปกรณ์' : `เมนูที่ใช้อุปกรณ์: ${equipment}`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-px gap-y-px border border-[#F3DCC1] bg-[#F3DCC1]">
                {groupedRecipes[equipment].map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="group flex cursor-pointer flex-col items-center bg-white p-10 transition-all hover:bg-[#FFF9F0] border border-[#F3DCC1] hover:border-[#F4A460]"
                  >
                    <div className="flex flex-col items-center space-y-6 text-center">
                      <span className="text-6xl transition-all duration-500 grayscale drop-shadow-sm group-hover:scale-110 group-hover:grayscale-0">
                        {recipe.icon}
                      </span>
                      <h4 className="text-sm font-black uppercase tracking-[0.1em] text-[#5D4037]">{recipe.name}</h4>
                      <p className="text-[10px] text-[#5D4037]/60 font-medium">
                        วัตถุดิบ: {recipe.ingredients.map(ing => (typeof ing === 'string' ? ing : ing.name)).join(', ')}
                      </p>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F4A460] opacity-0 transition-opacity group-hover:opacity-100">
                        {recipe.equipment}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="col-span-full py-10 text-center text-lg opacity-50">ไม่พบเมนูอาหารที่ตรงกับเงื่อนไข 🍃</p>
      )}

      {/* --- Recipe Detail Modal --- */}
      <AnimatePresence>
        {selectedRecipe && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="fixed inset-0 bg-[#5F5D59]/20 backdrop-blur-sm z-[60]"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto z-[70] w-[90%] max-w-lg h-fit bg-white rounded-[32px] border border-[#EBE9E4] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 bg-[#FAF9F6] rounded-2xl flex items-center justify-center text-5xl shadow-inner">
                    {selectedRecipe.icon}
                  </div>
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FAF9F6] transition-colors text-2xl opacity-40"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="text-3xl font-light text-[#5F5D59] mb-1">{selectedRecipe.name}</h3>
                <p className="text-sm text-[#8C7E6A] font-medium mb-6 flex items-center uppercase tracking-widest">
                  <span className="mr-2">🍳</span> {selectedRecipe.equipment}
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#5F5D59]/40 uppercase tracking-widest mb-3">วัตถุดิบที่ต้องการ</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center p-3 bg-[#FAF9F6] rounded-xl border border-[#EBE9E4]/50">
                          <span className="w-2 h-2 rounded-full bg-[#D4C4A8] mr-3"></span>
                          <span className="text-sm text-[#5F5D59]">{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#FAF9F6]">
                    <button 
                      onClick={() => setSelectedRecipe(null)}
                      className="w-full py-4 bg-[#8C7E6A] text-white rounded-2xl text-sm font-medium hover:bg-[#6F6454] transition-all shadow-lg shadow-[#8C7E6A]/20"
                    >
                      เข้าใจแล้ว
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecipesPage;