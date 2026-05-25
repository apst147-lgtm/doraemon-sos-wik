import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipesPage from './RecipesPage';

// --- ข้อมูลหมวดหมู่หน้าหลัก ---
const CATEGORIES = [
  { id: 'recipes', title: 'รวมเมนูอาหาร', icon: '🍲', description: 'สูตรลับจากครัวโนบิตะ', color: '#F3E5AB' },
  { id: 'seasons', title: 'ฤดูกาล', icon: '🌸', description: 'ตารางเพาะปลูกรายเดือน', color: '#E2F0D9' },
  { id: 'characters', title: 'ตัวละคร', icon: '👫', description: 'ความสัมพันธ์และของที่ชอบ', color: '#D9EAF7' },
  { id: 'shops', title: 'ร้านค้า', icon: '🏪', description: 'เวลาทำการและรายการสินค้า', color: '#F7E2D9' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#4A4A4A] font-sans selection:bg-[#D4C4A8]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-[#FAF9F6]/80 backdrop-blur-md z-50 border-b border-[#EBE9E4]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-light tracking-widest cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            DORAEMON <span className="font-medium text-[#8C7E6A]">SoS</span>
          </motion.div>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider opacity-70">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveTab(cat.id)}
                className={`hover:text-[#8C7E6A] transition-colors ${activeTab === cat.id ? 'text-[#8C7E6A] font-bold' : ''}`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <header className="mb-16 text-center">
                <h1 className="text-5xl font-extralight mb-4 text-[#5F5D59]">บันทึกแห่งเมืองกัลลาบอน</h1>
                <p className="text-lg opacity-50 font-light">คู่มือการใช้ชีวิตในฟาร์มฉบับมินิมอล</p>
              </header>

              {/* Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setActiveTab(cat.id)}
                    className="group cursor-pointer bg-white border border-[#EBE9E4] p-8 rounded-3xl transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-[#5F5D59]">{cat.title}</h3>
                    <p className="text-sm opacity-60 leading-relaxed">{cat.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'recipes' ? (
            <RecipesPage key="recipes" onBack={() => setActiveTab('home')} />
          ) : (
            <motion.div 
              key="other"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 border-2 border-dashed border-[#EBE9E4] rounded-[40px]"
            >
              <h2 className="text-2xl font-light mb-4">กำลังพัฒนาหน้า {CATEGORIES.find(c => c.id === activeTab)?.title}</h2>
              <button onClick={() => setActiveTab('home')} className="text-[#8C7E6A] underline">กลับหน้าหลัก</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;