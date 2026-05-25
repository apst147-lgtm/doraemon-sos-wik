import React, { useState, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { getCharacterByName } from './characters';
import { MINING_DATA } from './data/seasonsData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const MiningPage = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);

  const filteredMining = useMemo(() => {
    return MINING_DATA.filter(item => 
      deferredSearch === '' || item.name.toLowerCase().includes(deferredSearch.toLowerCase())
    ).sort((a, b) => b.sellPrice - a.sellPrice);
  }, [deferredSearch]);

  return (
    <div className="w-full max-w-6xl animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4A460] hover:opacity-70 transition-opacity">
            ← Back to Home
          </button>
          <h2 className="text-5xl font-black text-[#5D4037] tracking-tight uppercase">Mining Guide</h2>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search ores..."
            className="w-full bg-white border border-[#F3DCC1] rounded-full px-5 py-2 text-sm outline-none focus:border-[#F4A460] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-12 px-8 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#8C7E6A]/50">
          <div className="col-span-5">Ore Name & Liked By</div>
          <div className="col-span-3 text-center">Floor Levels</div>
          <div className="col-span-4 text-right">Selling Price</div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3">
          {filteredMining.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 rounded-[32px] border border-[#F3DCC1] bg-white transition-all hover:shadow-xl hover:border-[#F4A460]/30 gap-4 md:gap-0"
            >
              <div className="col-span-12 md:col-span-5 flex items-center gap-6">
                <span className="text-4xl shrink-0 drop-shadow-sm">{item.icon}</span>
                <div className="flex flex-col gap-2">
                  <span className="text-base font-black text-[#5D4037]">{item.name}</span>
                  {item.likedBy && (
                    <div className="flex -space-x-2">
                      {item.likedBy.map(charName => {
                        const char = getCharacterByName(charName);
                        return (
                          <div key={charName} className="group/char relative">
                            <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm ring-1 ring-[#1A1A1A]/5 flex items-center justify-center">
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
                <span className="text-[10px] font-black bg-[#E5E7EB] text-[#4B5563] px-3 py-1.5 rounded-full uppercase tracking-widest">ชั้น {item.floors}</span>
              </div>
              <div className="col-span-6 md:col-span-4 text-right">
                <span className="text-xl font-black text-[#82A07D] tracking-tighter">{item.sellPrice.toLocaleString()} <span className="text-[10px] font-bold uppercase ml-0.5">G</span></span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MiningPage;