import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { getCharacterByName } from './characters';
import { SOURCE_ICONS, INGREDIENT_ICONS, STAR_RATINGS } from './data/constants';

const RecipeDetailModal = ({ selectedRecipe, onClose }) => {
  return (
    <AnimatePresence>
      {selectedRecipe && (
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 m-auto z-[70] w-[90%] max-w-md h-fit bg-[#FCFBF7] border-2 border-[#8C7E6A]/20 p-8 shadow-xl overflow-hidden rounded-3xl" // Simplified border, shadow, rounded corners
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
              <div className="mb-8 flex h-24 w-24 items-center justify-center border border-[#8C7E6A]/20 bg-white p-4 shadow-inner"> {/* Smaller, no ring */}
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
                          <div className={cn("relative", hasTooltip && "group/tooltip")} style={{ zIndex: hasTooltip ? 20 : 1 }}>
                            <div className={cn(
                              "w-10 h-10 bg-white border border-[#8C7E6A]/20 rounded-lg flex items-center justify-center text-xl shadow-sm shrink-0 transition-transform",
                              hasTooltip && "cursor-help group-hover/tooltip:scale-105"
                            )}>
                              {INGREDIENT_ICONS[ingName] || '📦'}
                            </div>

                            {hasTooltip && (
                              /* Tooltip Popup */
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-[#1A1A1A]/95 backdrop-blur-md text-white rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-[80] w-max max-w-[200px] shadow-xl border border-white/10 scale-90 group-hover/tooltip:scale-100 origin-bottom"> {/* Smaller padding, rounded corners, shadow */}
                                <p className="text-xs font-black text-[#F4A460] uppercase tracking-widest border-b border-white/10 pb-2 mb-2">{ingName}</p>
                                {ing.source && <p className="text-[10px] text-[#F3E5AB] mt-1 flex items-center gap-1.5 mb-2"><span className="opacity-50 text-[8px]">SOURCE</span> {SOURCE_ICONS[ing.source] || '📦'} {ing.source}</p>}
                                {ing.note && <p className="text-[11px] font-medium leading-relaxed opacity-90">{ing.note}</p>}
                                {ing.season && <p className="text-[10px] text-[#E2F0D9] mt-2 flex items-center gap-1.5"><span className="opacity-50 text-[8px]">SEASON</span> {ing.season}</p>}
                                {ing.location && <p className="text-[10px] text-[#D9EAF7] mt-1 flex items-center gap-1.5"><span className="opacity-50 text-[8px]">LOCATION</span> {ing.location}</p>}
                                {(ing.buyPrice !== undefined || ing.sellPrice !== undefined) && (
                                  <div className="text-[10px] flex flex-col gap-1.5 mt-3 pt-3 border-t border-white/10">
                                    {ing.buyPrice !== undefined && (
                                      <div className="flex justify-between gap-8 uppercase tracking-widest">
                                        <span className="opacity-50 text-[8px] font-black">Buy</span> <span className="text-[#F4A460] font-bold">{ing.buyPrice} G</span>
                                      </div>
                                    )}
                                    {ing.sellPrice !== undefined && (
                                      <div className="flex justify-between gap-8 uppercase tracking-widest">
                                        <span className="opacity-50 text-[8px] font-black">Sell</span> <span className="text-[#82A07D] font-bold">{ing.sellPrice} G</span>
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
                    )})}
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
                        const char = getCharacterByName(charName); // Smaller avatar
                        return (
                          <div key={charName} className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full border-2 border-[#8C7E6A]/20 overflow-hidden bg-white shadow-sm flex items-center justify-center">
                              {char?.portrait && (char.portrait.includes('/') || char.portrait.startsWith('http'))
                                ? <img src={char.portrait} alt={charName} className="w-full h-full object-cover" />
                                : <span className="text-2xl">{char?.portrait || charName[0]}</span>
                              }
                            </div>
                            <span className="text-[10px] font-bold text-[#1A1A1A]/70">{charName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Cooking Tips */}
                {selectedRecipe.tips && ( // Reduced margin-top
                  <div className="w-full mt-8 bg-[#82A07D]/5 border-l-4 border-[#82A07D] p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#82A07D] mb-1">💡 Cooking Tips</p>
                    <p className="text-xs text-[#5D4037]/80 leading-relaxed italic">
                      {selectedRecipe.tips}
                    </p>
                  </div>
                )}

                {/* Redesigned Price Breakdown */}
                <div className="group/modal-price relative w-full mt-6 bg-[#F3DCC1]/10 rounded-xl p-4 space-y-2 cursor-help"> {/* Smaller padding, margin, spacing */}
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
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-[#1A1A1A]/95 backdrop-blur-xl text-white rounded-2xl opacity-0 group-hover/modal-price:opacity-100 transition-all duration-300 pointer-events-none z-[80] w-60 shadow-xl scale-90 group-hover/modal-price:scale-100 origin-bottom border border-white/10"> {/* Smaller, rounded corners, shadow */}
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
                  onClick={onClose} // Reduced margin-top
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
  );
};

export default RecipeDetailModal;