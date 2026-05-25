import React, { useState, useEffect, Suspense, useCallback, memo, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import ShowcaseReel from './ShowcaseReel';

// Lazy load pages for better performance
const RecipesPage = React.lazy(() => import('./RecipesPage'));
const SeasonsPage = React.lazy(() => import('./SeasonsPage'));
const CharactersPage = React.lazy(() => import('./CharactersPage'));
const ShopsPage = React.lazy(() => import('./ShopsPage'));
const MiningPage = React.lazy(() => import('./MiningPage'));

// --- ข้อมูลหมวดหมู่หน้าหลัก ---
const CATEGORIES = [
  { id: 'recipes', title: 'รวมเมนูอาหาร', icon: '🍲', description: 'สูตรลับจากครัวโนบิตะ', color: '#F3E5AB' },
  { id: 'seasons', title: 'ฤดูกาล', icon: '🌸', description: 'ตารางเพาะปลูกรายเดือน', color: '#E2F0D9' },
  { id: 'characters', title: 'ตัวละคร', icon: '👧🏻', description: 'ความสัมพันธ์และของที่ชอบ', color: '#D9EAF7' },
  { id: 'mining', title: 'เหมืองแร่', icon: '⛏️', description: 'ข้อมูลแร่และชั้นเหมือง', color: '#E5E7EB' },
  { id: 'shops', title: 'ร้านค้า', icon: '🧺', description: 'เวลาทำการและรายการสินค้า', color: '#F7E2D9' },
];

// --- Sub-components for a cleaner App.jsx ---

const NavBar = memo(({ activeTab, onTabChange, onToggleShowcase }) => (
  <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl z-50 border-b border-[#F3DCC1] flex justify-center">
    <div className="w-full max-w-6xl px-8 flex justify-between items-center">
      <motion.div 
        whileHover={{ opacity: 0.7 }}
        className="cursor-pointer text-lg font-black uppercase tracking-[0.3em] text-[#5D4037]"
        onClick={() => onTabChange('home')}
      >
        Doraemon <span className="font-light text-[#F4A460]">SoS</span>
      </motion.div>
      <div className="hidden gap-6 lg:gap-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5F5D59]/60 md:flex">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => onTabChange(cat.id)}
            aria-label={`Go to ${cat.title} page`}
            className={cn("relative py-1 transition-all duration-300 hover:text-[#F4A460]",
              activeTab === cat.id ? "text-[#5D4037]" : ""
            )}
          >
            {cat.title}
            {activeTab === cat.id && (
              <motion.div layoutId="navUnderline" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#F4A460]" />
            )}
          </button>
        ))}
        <button 
          onClick={onToggleShowcase}
          className="ml-4 px-4 py-1.5 bg-[#F4A460]/10 text-[#F4A460] rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#F4A460] hover:text-white transition-all duration-300"
        >
          🎬 Showcase
        </button>
      </div>
    </div>
  </nav>
));

const HomeView = ({ onTabChange, onToggleShowcase }) => (
  <motion.div
    key="home"
    className="w-full"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5 }}
  >
    <header className="mb-20 flex flex-col items-center space-y-4 text-center">
      <span className="text-[11px] font-bold uppercase tracking-[0.6em] text-[#82A07D]">Wiki Database</span>
      <h1 className="text-6xl md:text-8xl font-black leading-none uppercase tracking-[-0.02em] text-[#5D4037]">Encyclopedia</h1>
      <div className="my-6 h-[2px] w-24 bg-[#F4A460]/20"></div>
      <p className="text-sm font-medium italic uppercase tracking-[0.2em] text-[#5D4037]/50">Nobita's Story of Seasons</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleShowcase}
        className="mt-8 px-8 py-3 bg-[#5D4037] text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg hover:bg-[#F4A460] transition-colors"
      >
        ▶ Watch Showcase Reel
      </motion.button>
    </header>

    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {CATEGORIES.map((cat, index) => (
        <motion.div
          key={cat.id}
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange(cat.id)}
          className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center border border-[#F3DCC1] bg-white p-8 transition-all hover:border-[#F4A460] rounded-[40px] shadow-sm hover:shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundColor: cat.color }}></div>
          <div className="flex flex-col items-center text-center relative z-10">
            <motion.span 
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="mb-6 text-5xl transition-all group-hover:scale-110 drop-shadow-md"
            >
              {cat.icon}
            </motion.span>
            <h3 className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[#5D4037]">{cat.title}</h3>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#5D4037]/60 font-medium">{cat.description}</p>
          </div>
          <div className="absolute right-8 top-8 text-[10px] font-mono text-[#F3DCC1] group-hover:text-[#F4A460]">0{index + 1}</div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Footer = memo(({ categories, onTabChange }) => (
  <footer className="mt-12 flex w-full justify-center border-t border-[#F3DCC1] bg-white py-20">
    <div className="grid w-full max-w-6xl grid-cols-1 gap-16 px-8 md:grid-cols-4">
      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="text-xl font-medium tracking-[0.2em] text-[#F4A460]">
          DORAEMON <span className="font-light text-[#82A07D]">SoS</span>
        </div>
        <p className="max-w-sm text-sm leading-loose text-[#5D4037]/60">
          บันทึกกัลลาบอน: แหล่งรวบรวมข้อมูลเชิงลึกสำหรับการใช้ชีวิตในโลกของโดราเอมอน ออกแบบมาเพื่อความเป็นระเบียบและใช้งานง่ายที่สุด
        </p>
      </div>
      <div>
        <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#5D4037]/40">สำรวจข้อมูล</h4>
        <ul className="space-y-4 text-[13px] text-[#5D4037]/80">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button 
                onClick={() => onTabChange(cat.id)} 
                className="transition-all duration-300 hover:text-[#F4A460] hover:translate-x-1 inline-block"
              >
                {cat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#5D4037]/40">ลิขสิทธิ์</h4>
        <div className="space-y-4 text-[13px] text-[#5D4037]/70">
          <p>© 2024 Nobita's Farm Diary</p>
          <div className="border-t border-[#F3DCC1] pt-4">
            <p className="text-[11px] leading-relaxed opacity-40 italic">Non-commercial fan purpose.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
));

const App = () => {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') || 'home';
    }
    return 'home';
  });
  const [recipeSearch, setRecipeSearch] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPlayingShowcase, setIsPlayingShowcase] = useState(false);
  
  // Sync activeTab with URL
  useLayoutEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'home') params.set('tab', activeTab);
    const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.pushState(null, '', newRelativePathQuery);
  }, [activeTab]);

  // Handle Browser Back/Forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get('tab') || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = useCallback((id) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#FFF9F0] text-[#5D4037] font-sans selection:bg-[#82A07D] flex flex-col items-center">
      {/* Showcase Reel Overlay */}
      <AnimatePresence>
        {isPlayingShowcase && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-[9999]">
            <ShowcaseReel onFinish={() => setIsPlayingShowcase(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar activeTab={activeTab} onTabChange={handleTabChange} onToggleShowcase={() => setIsPlayingShowcase(true)} />

      <main className="w-full max-w-6xl px-8 pb-32 pt-52 flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            {activeTab === 'home' ? (
              <HomeView onTabChange={handleTabChange} onToggleShowcase={() => setIsPlayingShowcase(true)} />
          ) : activeTab === 'recipes' ? (
            <RecipesPage 
              key="recipes" 
              initialSearch={recipeSearch} 
              onBack={() => {
                setRecipeSearch('');
                setActiveTab('home');
              }} 
            />
          ) : activeTab === 'seasons' ? (
            <SeasonsPage 
              key="seasons" 
              onRecipeClick={(name) => {
                setRecipeSearch(name);
                setActiveTab('recipes');
              }}
              onBack={() => setActiveTab('home')} 
            />
          ) : activeTab === 'characters' ? (
            <CharactersPage
              key="characters"
              onBack={() => setActiveTab('home')}
            />
          ) : activeTab === 'mining' ? (
            <MiningPage
              key="mining"
              onBack={() => setActiveTab('home')}
            />
          ) : activeTab === 'shops' ? (
            <ShopsPage
              key="shops"
              onBack={() => setActiveTab('home')}
            />
          ) : (
            <motion.div 
              key="other"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 border-2 border-dashed border-[#EBE9E4] rounded-[40px]"
            >
              <h2 className="text-2xl font-light mb-4">กำลังพัฒนาหน้า {CATEGORIES.find(c => c.id === activeTab)?.title || activeTab}</h2>
              <button onClick={() => handleTabChange('home')} className="text-[#8C7E6A] underline">กลับหน้าหลัก</button>
            </motion.div>
          )}
        </AnimatePresence>
        </Suspense>
      </main>

      <Footer categories={CATEGORIES} onTabChange={handleTabChange} />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ y: -5, backgroundColor: '#F4A460', color: '#FFFFFF' }}
            whileTap={{ scale: 0.9 }} 
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-10 right-10 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#F3DCC1] bg-white/80 text-[#F4A460] shadow-lg backdrop-blur-md transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex-1 flex flex-col items-center justify-center py-40">
    <motion.span 
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="text-4xl mb-4"
    >
      🥣
    </motion.span>
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C7E6A]/40">Loading Kitchen...</p>
  </div>
);

export default App;
