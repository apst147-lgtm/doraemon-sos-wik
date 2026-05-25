import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { INGREDIENT_ICONS } from './data/constants';

const CharacterDetailModal = ({ selectedCharacter, onClose }) => {
  return (
    <AnimatePresence>
      {selectedCharacter && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#5F5D59]/20 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto z-[70] w-[95%] max-w-lg h-fit max-h-[85vh] bg-[#FCFBF7] border-4 border-white p-8 shadow-[0_30px_100px_-10px_rgba(0,0,0,0.2)] overflow-y-auto custom-scrollbar rounded-[50px]"
          >
            <div className="relative flex flex-col items-center">
              {/* Portrait Header */}
              <motion.div 
                animate={{ rotate: [0, 2, -2, 0] }} 
                transition={{ repeat: Infinity, duration: 6 }} 
                className="mb-8 flex h-32 w-32 items-center justify-center border-4 border-white bg-white rounded-3xl shadow-xl overflow-hidden"
                style={{ backgroundColor: `${selectedCharacter.color}20` }}
              >
                {selectedCharacter.portrait && (selectedCharacter.portrait.includes('/') || selectedCharacter.portrait.startsWith('http'))
                  ? <img src={selectedCharacter.portrait} alt={selectedCharacter.name} className="w-full h-full object-cover" />
                  : <span className="text-6xl">{selectedCharacter.portrait}</span>
                }
              </motion.div>

              <div className="text-center mb-8">
                <h3 className="text-4xl font-black text-[#5D4037] tracking-tight uppercase mb-2">
                  {selectedCharacter.name}
                </h3>
                <span className="text-xs font-bold text-[#F4A460] bg-[#F4A460]/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                  🎂 {selectedCharacter.birthday}
                </span>
              </div>

              <div className="w-full space-y-8">
                {/* Bio Section */}
                <div className="bg-white/50 p-6 rounded-[32px] border border-[#F3DCC1]/50 italic text-sm text-[#5D4037]/80 leading-relaxed text-center">
                  "{selectedCharacter.bio}"
                </div>

                {/* Gifts Guide */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-[#5D4037]/10"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5D4037]/40">Gifts Guide</span>
                    <div className="h-[1px] flex-1 bg-[#5D4037]/10"></div>
                  </div>

                  {/* Special Favorite */}
                  <div className="bg-[#82A07D]/10 border-2 border-[#82A07D]/20 p-5 rounded-[32px] flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#82A07D]">Special Love ⭐</span>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{INGREDIENT_ICONS[selectedCharacter.specialFavorite] || '🎁'}</span>
                      <span className="text-lg font-bold text-[#5D4037]">{selectedCharacter.specialFavorite}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Loved Items */}
                    <div className="bg-white p-5 rounded-[32px] border border-[#F3DCC1] space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#F4A460] block text-center">Loved Items ❤️</span>
                      <div className="flex flex-wrap justify-center gap-2">
                        {selectedCharacter.favoriteItems?.map(item => (
                          <div key={item} className="flex items-center gap-2 bg-[#F8F7F4] px-3 py-1.5 rounded-full border border-[#F3DCC1]/30">
                            <span className="text-sm">{INGREDIENT_ICONS[item] || '🍎'}</span>
                            <span className="text-[10px] font-bold text-[#5D4037]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Disliked Items */}
                    <div className="bg-white p-5 rounded-[32px] border border-[#F3DCC1] space-y-3 grayscale opacity-60">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#E94E4E] block text-center">Disliked ❌</span>
                      <div className="flex flex-wrap justify-center gap-2">
                        {selectedCharacter.dislikedItems?.map(item => (
                          <div key={item} className="flex items-center gap-2 bg-[#F8F7F4] px-3 py-1.5 rounded-full border border-[#E94E4E]/10">
                            <span className="text-sm">{INGREDIENT_ICONS[item] || '🗑️'}</span>
                            <span className="text-[10px] font-bold text-[#5D4037]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="mt-12 group text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all flex flex-col items-center gap-2"
              >
                <div className="h-[1px] w-8 bg-[#1A1A1A]/10 group-hover:w-16 transition-all duration-500"></div>
                Close Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CharacterDetailModal;