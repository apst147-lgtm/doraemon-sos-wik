import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTERS } from './characters';
import { cn } from './utils';

const CharactersPage = ({ onBack }) => {
  const [filter, setFilter] = useState('ทั้งหมด');

  const categories = useMemo(() => 
    ['ทั้งหมด', ...new Set(CHARACTERS.map(c => c.category))], 
    []
  );

  const filteredCharacters = CHARACTERS.filter(c => 
    filter === 'ทั้งหมด' || c.category === filter
  );

  return (
    <div className="w-full max-w-6xl animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={onBack}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4A460] hover:opacity-70 transition-opacity"
          >
            ← Back to Home
          </button>
          <h2 className="text-5xl font-black text-[#5D4037] tracking-tight uppercase">Characters</h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                filter === cat 
                  ? "bg-[#5D4037] text-white border-[#5D4037] shadow-md" 
                  : "bg-white text-[#5D4037]/50 border-[#F3DCC1] hover:border-[#F4A460]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Character Grid */}
      {/* 
          ใช้ grid-cols-1 สำหรับมือถือ, 
          grid-cols-2 สำหรับแท็บเล็ต, 
          grid-cols-3 สำหรับหน้าจอใหญ่ 
          gap-6 ช่วยป้องกันไม่ให้การ์ดซ้อนกัน
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCharacters.map((char) => (
            <motion.div
              layout
              key={char.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white border border-[#F3DCC1] rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Card Header: ใช้ Flexbox พร้อม gap-4 เพื่อแยกรูปกับชื่อ */}
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 shrink-0 flex items-center justify-center text-4xl rounded-2xl shadow-inner"
                  style={{ backgroundColor: `${char.color}20` }}
                >
                  {char.portrait}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-[#5D4037] leading-none mb-1 truncate">
                    {char.name}
                  </h3>
                  <span className="text-[10px] font-bold text-[#F4A460] uppercase tracking-tighter">
                    🎂 {char.birthday}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-4">
                <p className="text-xs leading-relaxed text-[#5D4037]/70 line-clamp-3 italic">
                  "{char.bio}"
                </p>
                <div className="pt-4 border-t border-[#F3DCC1]/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#5D4037]/40 mb-2">Favorite Item</p>
                  <p className="text-sm font-bold text-[#5D4037]">⭐ {char.specialFavorite}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CharactersPage;