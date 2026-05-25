import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils';
import { getCharacterByName } from './characters';
import { SHOPS_DATA } from './data/shopsData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const ShopsPage = ({ onBack }) => {
  const weekDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

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
          <h2 className="text-5xl font-black text-[#5D4037] tracking-tight uppercase">Shops</h2>
        </div>
      </div>

      {/* Shop Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {SHOPS_DATA.map((shop) => (
          <motion.div
            key={shop.id}
            variants={itemVariants}
            className="bg-white border border-[#F3DCC1] rounded-[40px] p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group"
          >
            {/* Header: Icon & Name */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#F8F7F4] rounded-[32px] flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform">
                  {shop.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-[#5D4037] tracking-tight leading-none mb-2">{shop.name}</h3>
                  <p className="text-[10px] font-bold text-[#8C7E6A] uppercase tracking-[0.2em]">{shop.description}</p>
                  {shop.location && (
                    <span className="text-[9px] text-[#F4A460] mt-1 font-bold">📍 {shop.location}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Opening Hours & Days */}
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-[#8C7E6A]/50 mb-3">Service Hours</h4>
                  <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#F3DCC1]/30">
                    <p className="text-sm font-black text-[#5D4037]">⏰ {shop.hours}</p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {weekDays.map(day => (
                        <span 
                          key={day} 
                          className={cn(
                            "px-2 py-1 rounded-md text-[8px] font-black transition-all",
                            shop.closed.includes(day) 
                              ? "bg-red-50 text-[#E94E4E] opacity-30" 
                              : "bg-[#82A07D]/10 text-[#82A07D]"
                          )}
                        >
                          {day.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Staff */}
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-[#8C7E6A]/50 mb-3">Store Staff</h4>
                  <div className="flex -space-x-3">
                    {shop.owners.map(name => {
                      const char = getCharacterByName(name);
                      return (
                        <div key={name} className="group/char relative">
                          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm ring-1 ring-[#1A1A1A]/5 flex items-center justify-center">
                            {char?.portrait && (char.portrait.includes('/') || char.portrait.startsWith('http'))
                              ? <img src={char.portrait} alt={name} className="w-full h-full object-cover" />
                              : <span className="text-xl">{char?.portrait || name[0]}</span>
                            }
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] text-white text-[8px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover/char:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-75 group-hover/char:scale-100 z-10">{name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items / Services */}
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[#8C7E6A]/50 mb-3">Items & Services</h4>
                <div className="flex flex-wrap gap-2">
                  {(shop.items || shop.services).map(item => (
                    <span 
                      key={item} 
                      className="px-3 py-1.5 bg-white border border-[#F3DCC1] text-[#5D4037] text-[10px] font-bold rounded-xl shadow-sm hover:border-[#F4A460] transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Info Tip */}
      <div className="mt-12 bg-[#F4A460]/10 border border-[#F4A460]/20 p-6 rounded-[32px] text-center">
        <p className="text-xs text-[#5D4037]/80 font-medium italic">
          💡 ทริค: ร้านค้าทุกแห่งจะปิดให้บริการใน <span className="font-bold text-[#F4A460]">วันเทศกาล</span> ไม่ว่าจะเป็นวันทำการปกติหรือไม่ก็ตาม
        </p>
      </div>
    </div>
  );
};

export default ShopsPage;