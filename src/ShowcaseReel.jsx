import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARS, CROPS, FERTS, RECIPES, SHOPS, MINING } from './data/showcaseData';

const SPEEDS = [
  { x: 1, label: '1× SPEED' },
  { x: 1.5, label: '1.5× FAST' },
  { x: 2, label: '2× FASTER' },
  { x: 3, label: '3× RAPID' },
];

// ─── CountUp ─────────────────────────────────────────────────────────────────
const CountUp = ({ to, duration = 900 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
};

// ─── Scene: Intro ────────────────────────────────────────────────────────────
const SceneIntro = () => (
  <div className="flex flex-col items-center text-center select-none">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
      className="w-28 h-28 rounded-[32px] bg-[#5D4037] flex items-center justify-center text-6xl mb-8 shadow-2xl"
      style={{ boxShadow: '0 30px 80px -16px rgba(93,64,55,0.4)' }}
    >
      📖
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="text-[11px] font-black uppercase tracking-[0.6em] text-[#82A07D] mb-4"
    >
      Wiki Database
    </motion.div>
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
      className="text-7xl md:text-9xl font-black leading-none uppercase tracking-[-0.03em] text-[#5D4037]"
    >
      Encyclopedia
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="mt-6 text-sm font-bold uppercase tracking-[0.35em] text-[#5D4037]"
    >
      Nobita's Story of Seasons
    </motion.p>
  </div>
);

// ─── Scene: Characters ───────────────────────────────────────────────────────
const SceneChars = ({ filter, highlighted }) => {
  const filtered = filter === 'ทั้งหมด' ? CHARS : CHARS.filter(c => c.cat === filter);
  const CATS = ['ทั้งหมด', 'หลัก', 'ร้านค้า'];
  return (
    <div className="w-full max-w-3xl flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <h2 className="text-4xl font-black uppercase tracking-tight text-[#5D4037]">Characters</h2>
        <div className="flex gap-2">
          {CATS.map(cat => (
            <div
              key={cat}
              data-showcase-id={`filter-${cat}`}
              className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300"
              style={filter === cat
                ? { background: '#5D4037', color: '#FFF9F0', borderColor: '#5D4037' }
                : { background: 'white', color: 'rgba(93,64,55,0.4)', borderColor: '#F3DCC1' }
              }
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ch) => (
            <motion.div
              layout
              key={ch.id}
              data-showcase-id={`char-${ch.id}`}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: highlighted === ch.id ? 1.04 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="bg-white rounded-[28px] p-6 border-2 transition-all duration-300 cursor-pointer"
              style={{
                borderColor: highlighted === ch.id ? ch.color : '#F3DCC1',
                boxShadow: highlighted === ch.id
                  ? `0 12px 40px -8px ${ch.color}55`
                  : '0 2px 8px rgba(93,64,55,0.06)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{ background: `${ch.color}22` }}
              >
                {ch.p}
              </div>
              <div className="font-black text-[#5D4037] text-base leading-tight">{ch.name}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: ch.color }}>
                {ch.cat}
              </div>
              <div className="mt-3 text-[11px] text-[#5D4037]/60 font-medium">🎂 {ch.bday}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Scene: Character Detail ──────────────────────────────────────────────────
const SceneCharDetail = ({ charId }) => {
  const ch = CHARS.find(c => c.id === charId);
  if (!ch) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="bg-white rounded-[36px] p-10 border-2 w-full max-w-md shadow-2xl"
      style={{
        borderColor: ch.color,
        boxShadow: `0 30px 80px -16px ${ch.color}44`,
      }}
    >
      <div className="flex items-center gap-6 mb-8">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg"
          style={{ background: `${ch.color}22` }}
        >
          {ch.p}
        </div>
        <div>
          <div
            className="text-[10px] font-black uppercase tracking-[0.3em] mb-1"
            style={{ color: ch.color }}
          >
            {ch.cat}
          </div>
          <h3 className="text-3xl font-black text-[#5D4037] leading-none">{ch.name}</h3>
          <div className="mt-2 text-sm text-[#5D4037]/60 font-medium">🎂 {ch.bday}</div>
        </div>
      </div>
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: `${ch.color}11`, border: `1px solid ${ch.color}33` }}
      >
        <div className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]/40 mb-2">
          ⭐ ของที่ชอบที่สุด
        </div>
        <div className="text-lg font-black text-[#5D4037]">{ch.fav}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#F0FDF4] rounded-2xl p-4 border border-[#86EFAC]/30">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#82A07D]/60 mb-2">ของชอบ</div>
          {ch.favs.map(f => (
            <div key={f} className="text-xs text-[#5D4037] font-medium mb-1">{f}</div>
          ))}
        </div>
        <div className="bg-[#FFF1F2] rounded-2xl p-4 border border-[#FECDD3]/30">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#FF8AAE]/60 mb-2">ของเกลียด</div>
          {ch.dis.map(d => (
            <div key={d} className="text-xs text-[#5D4037] font-medium mb-1">{d}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Scene: Seasons / Crop Planner ───────────────────────────────────────────
const SceneSeasons = ({ fertId, highlightRow }) => {
  const fert = FERTS.find(f => f.id === fertId);
  const boost = fert?.boost || 0;
  const SEASONS = ['Spring 🌸', 'Summer ☀️', 'Fall 🍂', 'Winter ❄️'];
  const [season, setSeason] = useState('Spring 🌸');

  return (
    <div className="w-full max-w-2xl flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black uppercase tracking-tight text-[#5D4037]">Seasons</h2>
        <div className="flex gap-2">
          {SEASONS.map(s => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all"
              style={season === s
                ? { background: '#5D4037', color: '#FFF9F0', borderColor: '#5D4037' }
                : { background: 'white', color: 'rgba(93,64,55,0.35)', borderColor: '#F3DCC1' }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Fertilizer picker */}
      <div className="bg-white rounded-2xl border border-[#F3DCC1] p-4 flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]/40 mr-2">ปุ๋ย:</span>
        {FERTS.map(f => (
          <div
            key={f.id}
            data-showcase-id={`fert-${f.id}`}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300 cursor-pointer"
            style={fertId === f.id
              ? { background: '#F4A460', color: 'white', borderColor: '#F4A460' }
              : { background: '#FAF9F6', color: 'rgba(93,64,55,0.5)', borderColor: '#F3DCC1' }
            }
          >
            {f.icon} {f.label}
          </div>
        ))}
      </div>

      {/* Crop table */}
      <div className="bg-white rounded-2xl border border-[#F3DCC1] overflow-hidden">
        <div className="grid grid-cols-5 bg-[#FAF9F6] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#5D4037]/40">
          <div className="col-span-2">พืช</div>
          <div className="text-center">วันโต</div>
          <div className="text-center">ราคาขาย</div>
          <div className="text-center text-[#82A07D]">กำไร/วัน</div>
        </div>
        {CROPS.map((crop, i) => {
          const adjDays = boost > 0 ? Math.max(1, Math.ceil(crop.days * (1 - boost / 100))) : crop.days;
          const profitPerDay = Math.round((crop.profit / adjDays) * 10) / 10;
          return (
            <motion.div
              key={crop.name}
              animate={highlightRow === i
                ? { backgroundColor: '#F0FDF4', x: 4 }
                : { backgroundColor: '#FFFFFF', x: 0 }
              }
              transition={{ duration: 0.3 }}
              className="grid grid-cols-5 px-5 py-4 border-t border-[#F3DCC1]/60 items-center"
            >
              <div className="col-span-2 flex items-center gap-3">
                <span className="text-2xl">{crop.icon}</span>
                <div>
                  <div className="text-sm font-black text-[#5D4037]">{crop.name}</div>
                  {crop.re && (
                    <div className="text-[9px] font-bold text-[#82A07D] uppercase tracking-widest">re-harvest</div>
                  )}
                </div>
              </div>
              <div className="text-center font-mono text-sm font-bold text-[#5D4037]">
                {adjDays}
                {boost > 0 && (
                  <span className="text-[#F4A460] text-[10px] ml-1">↓</span>
                )}
              </div>
              <div className="text-center font-mono text-sm text-[#5D4037]/70">{crop.sell}G</div>
              <div className="text-center font-mono text-sm font-black text-[#82A07D]">
                {profitPerDay}G
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Scene: Recipes ───────────────────────────────────────────────────────────
const SceneRecipes = ({ highlighted }) => (
  <div className="w-full max-w-2xl flex flex-col gap-5">
    <div className="flex items-end justify-between">
      <h2 className="text-4xl font-black uppercase tracking-tight text-[#5D4037]">Recipes</h2>
      <span className="text-[10px] font-black uppercase tracking-widest text-[#5D4037]/30">{RECIPES.length} เมนู</span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {RECIPES.map(r => (
        <motion.div
          key={r.id}
          data-showcase-id={`recipe-${r.id}`}
          animate={highlighted === r.id
            ? { scale: 1.04, borderColor: '#F4A460', boxShadow: '0 12px 40px -8px rgba(244,164,96,0.4)' }
            : { scale: 1, borderColor: '#F3DCC1', boxShadow: '0 2px 8px rgba(93,64,55,0.06)' }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="bg-white rounded-[28px] p-6 border-2 cursor-pointer"
        >
          <div className="text-4xl mb-3">{r.icon}</div>
          <div className="font-black text-[#5D4037] text-lg leading-tight mb-1">{r.name}</div>
          <div className="text-[10px] font-bold text-[#5D4037]/40 uppercase tracking-wider mb-4">{r.equip}</div>
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#5D4037]/50">{r.cost}G</div>
            <div className="font-black text-[#82A07D] text-sm">+{(r.sell - r.cost).toLocaleString()}G</div>
          </div>
          {r.likedBy.length > 0 && (
            <div className="mt-3 text-[10px] font-bold text-[#F4A460] uppercase tracking-widest">
              ❤️ {r.likedBy.join(', ')}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Scene: Recipe Detail ─────────────────────────────────────────────────────
const SceneRecipeDetail = ({ recipeId }) => {
  const r = RECIPES.find(x => x.id === recipeId);
  if (!r) return null;
  const profit = r.sell - r.cost;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="bg-white rounded-[36px] p-10 border-2 border-[#F3DCC1] w-full max-w-sm shadow-2xl text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-7xl mb-4"
      >
        {r.icon}
      </motion.div>
      <h3 className="text-3xl font-black text-[#5D4037] mb-1">{r.name}</h3>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#5D4037]/40 mb-6">{r.equip}</div>

      {/* Ingredients */}
      <div className="flex justify-center gap-3 mb-6">
        {r.ings.map(ing => (
          <div key={ing.n} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-[#FAF9F6] border border-[#F3DCC1] rounded-2xl flex items-center justify-center text-2xl">
              {ing.i}
            </div>
            <div className="text-[9px] font-bold text-[#5D4037]/50 uppercase tracking-wide">{ing.n}</div>
          </div>
        ))}
      </div>

      {/* Profit breakdown */}
      <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-[#F3DCC1]/50 text-left">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#5D4037]/50">ราคาขาย</span>
          <span className="font-black text-[#F4A460]"><CountUp to={r.sell} /> G</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#5D4037]/50">ต้นทุน</span>
          <span className="font-bold text-[#5D4037]/70"><CountUp to={r.cost} /> G</span>
        </div>
        <div className="h-px bg-[#F3DCC1] mb-3" />
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#82A07D]">กำไรสุทธิ</span>
          <span className="text-2xl font-black text-[#82A07D]">+<CountUp to={profit} /> G</span>
        </div>
      </div>

      {r.likedBy.length > 0 && (
        <div className="mt-4 text-sm font-bold text-[#F4A460]">❤️ ของโปรด: {r.likedBy.join(', ')}</div>
      )}
    </motion.div>
  );
};

// ─── Scene: Shops ─────────────────────────────────────────────────────────────
const SceneShops = () => (
  <div className="w-full max-w-2xl flex flex-col gap-5">
    <h2 className="text-4xl font-black uppercase tracking-tight text-[#5D4037]">Shops</h2>
    <div className="grid grid-cols-2 gap-4">
      {SHOPS.map((shop, i) => (
        <motion.div
          key={shop.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 280, damping: 22 }}
          className="bg-white rounded-[28px] p-7 border-2 border-[#F3DCC1] shadow-sm"
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            className="text-5xl mb-4"
          >
            {shop.icon}
          </motion.div>
          <div className="font-black text-[#5D4037] text-lg mb-4">{shop.name}</div>
          <div
            className="rounded-xl px-4 py-3 border"
            style={{ background: `${shop.color}11`, borderColor: `${shop.color}33` }}
          >
            <div className="text-sm font-black" style={{ color: shop.color }}>⏰ {shop.hours}</div>
            <div className="text-[10px] text-[#5D4037]/40 mt-1 font-medium">ปิดทุกวัน{shop.closed}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Scene: Mining ────────────────────────────────────────────────────────────
const SceneMining = () => (
  <div className="w-full max-w-xl flex flex-col gap-5">
    <h2 className="text-4xl font-black uppercase tracking-tight text-[#5D4037]">Mining</h2>
    <div className="flex flex-col gap-3">
      {MINING.map((layer, i) => (
        <motion.div
          key={layer.tier}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, type: 'spring', stiffness: 280, damping: 22 }}
          className="rounded-2xl p-5 border-2 flex items-center gap-5"
          style={{ background: layer.bg, borderColor: `${layer.color}33` }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `${layer.color}22` }}
          >
            {layer.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span
                className="font-mono text-xs font-black px-2 py-0.5 rounded-md"
                style={{ background: layer.color, color: 'white' }}
              >
                {layer.tier}
              </span>
              <span className="text-sm font-black text-[#5D4037]">{layer.label}</span>
            </div>
            <div className="text-[11px] text-[#5D4037]/50 font-medium">
              {layer.items.join(' · ')}
            </div>
          </div>
          <div className="text-2xl">{i === 3 ? '💰' : '⛏️'}</div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Scene: Outro ─────────────────────────────────────────────────────────────
const SceneOutro = ({ onClose }) => (
  <div className="flex flex-col items-center text-center">
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.2 }}
      className="w-32 h-32 rounded-full bg-gradient-to-br from-[#82A07D] to-[#F4A460] flex items-center justify-center text-6xl mb-8 shadow-2xl"
    >
      ✅
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="text-6xl md:text-8xl font-black leading-none tracking-[-0.03em] text-[#5D4037] mb-2"
    >
      That's a <span style={{
        background: 'linear-gradient(135deg, #F4A460, #82A07D)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontStyle: 'italic',
      }}>wrap.</span>
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay: 0.9 }}
      className="mt-4 text-sm font-bold uppercase tracking-[0.4em] text-[#5D4037]"
    >
      10 ฟีเจอร์ · 6 ตัวละคร · พร้อมใช้งาน
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="flex gap-4 mt-12"
    >
      <button
        onClick={onClose}
        className="px-10 py-4 rounded-full bg-[#5D4037] text-white text-sm font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#F4A460] transition-colors"
      >
        เริ่มสำรวจ →
      </button>
    </motion.div>
  </div>
);

// ─── Cursor ───────────────────────────────────────────────────────────────────
const Cursor = ({ x, y, visible, clicking }) => (
  <div
    style={{
      position: 'fixed',
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px)`,
      transition: 'transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)',
      pointerEvents: 'none',
      zIndex: 10500,
      opacity: visible ? 1 : 0,
    }}
  >
    <svg width="32" height="38" viewBox="0 0 28 36" style={{ display: 'block', position: 'absolute', left: -3, top: -2, filter: 'drop-shadow(0 4px 12px rgba(93,64,55,0.4)) drop-shadow(0 0 12px rgba(255,255,255,0.5))' }}>
      <path d="M3 2 L3 26 L8.5 22 L12 31 L15.5 29.5 L12 21 L19 21 Z" fill="#FFFFFF" stroke="#5D4037" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    {clicking && (
      <motion.div
        initial={{ width: 6, height: 6, opacity: 0.9, borderWidth: 3, margin: -3 }}
        animate={{ width: 80, height: 80, opacity: 0, borderWidth: 0.5, margin: -40 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          borderRadius: '50%',
          border: '3px solid #F4A460',
          pointerEvents: 'none',
        }}
      />
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ShowcaseReel = ({ onFinish }) => {
  const [playing, setPlaying] = useState(false);
  const [sceneId, setSceneId] = useState(null);
  const [frameNo, setFrameNo] = useState('00');
  const [frameTag, setFrameTag] = useState('INTRO');
  const [frameCap, setFrameCap] = useState('');
  const [progress, setProgress] = useState(0);
  const [recTime, setRecTime] = useState('00:00');
  const [speedIdx, setSpeedIdx] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [letterbox, setLetterbox] = useState(false);

  // cursor
  const [cx, setCx] = useState(-200);
  const [cy, setCy] = useState(-200);
  const [cVisible, setCVisible] = useState(false);
  const [cClick, setCClick] = useState(false);

  // scene-specific state
  const [charFilter, setCharFilter] = useState('ทั้งหมด');
  const [highlightChar, setHighlightChar] = useState(null);
  const [detailChar, setDetailChar] = useState('shizuka');
  const [fertId, setFertId] = useState('none');
  const [highlightCropRow, setHighlightCropRow] = useState(null);
  const [highlightRecipe, setHighlightRecipe] = useState(null);
  const [detailRecipeId, setDetailRecipeId] = useState('dorayaki');

  const playingRef = useRef(false);
  const speedRef = useRef(1);
  const progTimerRef = useRef(null);
  const startTsRef = useRef(0);
  const TOTAL_MS = 60000;

  const wait = useCallback(
    (ms) => new Promise((r) => setTimeout(r, Math.max(20, ms / speedRef.current))),
    []
  );

  const doFlash = useCallback(async () => {
    setFlashOn(true);
    await new Promise((r) => setTimeout(r, 70));
    setFlashOn(false);
  }, []);

  const goScene = useCallback(
    async (id, no, tag, cap) => {
      if (!playingRef.current) return;
      await doFlash();
      setSceneId(id);
      setFrameNo(no);
      setFrameTag(tag);
      setFrameCap(cap || '');
    },
    [doFlash]
  );

  const moveCursor = useCallback(async (x, y) => {
    if (!playingRef.current) return;
    setCVisible(true);
    setCx(x);
    setCy(y);
    await new Promise((r) => setTimeout(r, Math.max(30, 550 / speedRef.current)));
  }, []);

  const click = useCallback(async (x, y) => {
    if (!playingRef.current) return;
    setCx(x);
    setCy(y);
    await new Promise((r) => setTimeout(r, Math.max(20, 380 / speedRef.current)));
    setCClick(true);
    await new Promise((r) => setTimeout(r, Math.max(20, 180 / speedRef.current)));
    setCClick(false);
    await new Promise((r) => setTimeout(r, Math.max(20, 200 / speedRef.current)));
  }, []);

  const stopReel = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    setSceneId(null);
    setLetterbox(false);
    setCVisible(false);
    setProgress(0);
    setCharFilter('ทั้งหมด');
    setHighlightChar(null);
    setFertId('none');
    setHighlightCropRow(null);
    setHighlightRecipe(null);
    if (progTimerRef.current) clearInterval(progTimerRef.current);
  }, []);

  const playReel = useCallback(async () => {
    if (playingRef.current) return stopReel();
    playingRef.current = true;
    setPlaying(true);
    setLetterbox(true);
    setProgress(0);
    startTsRef.current = performance.now();

    if (progTimerRef.current) clearInterval(progTimerRef.current);
    progTimerRef.current = setInterval(() => {
      const elapsed = performance.now() - startTsRef.current;
      const pct = Math.min(100, (elapsed / (TOTAL_MS / speedRef.current)) * 100);
      setProgress(pct);
      const sec = Math.floor(elapsed / 1000);
      setRecTime(
        String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0')
      );
    }, 120);

    const W = window.innerWidth;
    const H = window.innerHeight;

    // 00 — INTRO
    await goScene('intro', '00', 'INTRO', 'Doraemon SoS · Wiki Encyclopedia');
    await wait(2400);
    if (!playingRef.current) return;

    // 01 — CHARACTERS: filter → ร้านค้า → ทั้งหมด → hover
    await goScene('chars', '01', 'CHARACTERS', 'ตัวละคร 6 คน · กรองตามหมวดหมู่');
    await wait(600);
    setCharFilter('ทั้งหมด');
    setHighlightChar(null);
    // click "ร้านค้า" filter (top-right area)
    await moveCursor(W * 0.72, H * 0.28);
    await click(W * 0.72, H * 0.28);
    setCharFilter('ร้านค้า');
    await wait(1200);
    // click "ทั้งหมด" filter
    await click(W * 0.55, H * 0.28);
    setCharFilter('ทั้งหมด');
    await wait(800);
    // hover Shizuka (first card, top-left)
    await moveCursor(W * 0.25, H * 0.48);
    setHighlightChar('shizuka');
    await wait(700);
    // hover Doraemon (second card)
    await moveCursor(W * 0.45, H * 0.48);
    setHighlightChar('doraemon');
    await wait(500);
    if (!playingRef.current) return;

    // 02 — CHARACTER DETAIL
    await goScene('char-detail', '02', 'CHAR DETAIL', 'ชิซุกะ · วันเกิด · ของชอบ · ของเกลียด');
    setDetailChar('shizuka');
    setCVisible(false);
    await wait(3200);
    if (!playingRef.current) return;

    // 03 — SEASONS + FERTILIZER
    await goScene('seasons', '03', 'CROP PLANNER', 'ตารางเพาะปลูก · คำนวณกำไร · เลือกฤดู');
    setFertId('none');
    setHighlightCropRow(null);
    await wait(800);
    // hover crop rows
    await moveCursor(W * 0.5, H * 0.52);
    setHighlightCropRow(0);
    await wait(500);
    setHighlightCropRow(1);
    await wait(500);
    setHighlightCropRow(null);
    // click fertilizer "ปุ๋ยเร่ง"
    await moveCursor(W * 0.61, H * 0.4);
    await click(W * 0.61, H * 0.4);
    setFertId('speed');
    await wait(1800);
    // click "ปุ๋ยคุณภาพ"
    await moveCursor(W * 0.72, H * 0.4);
    await click(W * 0.72, H * 0.4);
    setFertId('quality');
    await wait(1200);
    await click(W * 0.44, H * 0.4);
    setFertId('none');
    await wait(800);
    if (!playingRef.current) return;

    // 04 — RECIPES
    await goScene('recipes', '04', 'RECIPES', 'สูตรอาหาร · วัตถุดิบ · กำไรสุทธิ');
    setHighlightRecipe(null);
    await wait(600);
    // hover recipes
    await moveCursor(W * 0.33, H * 0.45);
    setHighlightRecipe('dorayaki');
    await wait(800);
    setHighlightRecipe('curry');
    await moveCursor(W * 0.62, H * 0.45);
    await wait(500);
    setHighlightRecipe('smoothie');
    await moveCursor(W * 0.33, H * 0.65);
    await wait(500);
    // click dorayaki
    setHighlightRecipe('dorayaki');
    await click(W * 0.33, H * 0.45);
    if (!playingRef.current) return;

    // 05 — RECIPE DETAIL
    await goScene('recipe-detail', '05', 'RECIPE DETAIL', 'โดรายากิ · วัตถุดิบ · กำไร +350G');
    setDetailRecipeId('dorayaki');
    setCVisible(false);
    await wait(3800);
    if (!playingRef.current) return;

    // 06 — SHOPS
    await goScene('shops', '06', 'SHOPS', 'ตารางเวลาร้านค้า · วันหยุด · สินค้า');
    setCVisible(false);
    await wait(3000);
    if (!playingRef.current) return;

    // 07 — MINING
    await goScene('mining', '07', 'MINING', 'ชั้นเหมืองแร่ · วัตถุดิบหายาก · ชั้น B1–B61+');
    await wait(800);
    await moveCursor(W * 0.5, H * 0.4);
    await wait(500);
    await moveCursor(W * 0.5, H * 0.52);
    await wait(500);
    await moveCursor(W * 0.5, H * 0.64);
    await wait(500);
    await moveCursor(W * 0.5, H * 0.76);
    await wait(1000);
    if (!playingRef.current) return;

    // 08 — OUTRO
    await goScene('outro', '✓', 'WRAP', '');
    setCVisible(false);
    await wait(3500);

    if (playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      setLetterbox(false);
      if (progTimerRef.current) clearInterval(progTimerRef.current);
      setProgress(100);
    }
  }, [wait, goScene, moveCursor, click, stopReel]);

  // speed sync
  useEffect(() => {
    speedRef.current = SPEEDS[speedIdx].x;
  }, [speedIdx]);

  // cleanup on unmount
  useEffect(() => () => {
    playingRef.current = false;
    if (progTimerRef.current) clearInterval(progTimerRef.current);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#FFF9F0', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Flash */}
      {flashOn && (
        <div className="absolute inset-0 bg-white z-[11000] pointer-events-none opacity-80" />
      )}

      {/* Letterbox */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[10200] transition-all duration-700"
        style={{ height: letterbox ? 32 : 0, background: '#3D2B24' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[10200] transition-all duration-700"
        style={{ height: letterbox ? 32 : 0, background: '#3D2B24' }}
      />

      {/* Progress bar */}
      {playing && (
        <div className="absolute top-0 left-0 right-0 h-[3px] z-[10300] pointer-events-none">
          <motion.div
            className="h-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #82A07D, #F4A460, #FF8AAE)',
              boxShadow: '0 0 14px rgba(244,164,96,0.5)',
              transition: 'width 0.25s linear',
            }}
          />
        </div>
      )}

      {/* Top bar — hidden while playing */}
      <div
        className="absolute top-0 left-0 right-0 h-20 flex items-center px-8 z-[10250] transition-all duration-500"
        style={{
          background: 'rgba(255,249,240,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #F3DCC1',
          opacity: playing ? 0 : 1,
          transform: playing ? 'translateY(-100%)' : 'translateY(0)',
          pointerEvents: playing ? 'none' : 'auto',
        }}
      >
        <div className="font-black text-lg uppercase tracking-[0.25em] text-[#5D4037]">
          Doraemon <span className="font-light text-[#F4A460]">SoS</span>
        </div>
        <div className="ml-4 font-mono text-[10px] font-bold text-[#FF8AAE] bg-[#FFE9F0] px-3 py-1.5 rounded-md tracking-[0.12em] uppercase">
          Showcase Reel
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            className="h-9 px-4 rounded-xl bg-white border border-[#F3DCC1] font-mono text-[11px] font-bold text-[#5D4037]/50 hover:border-[#5D4037] hover:text-[#5D4037] transition-all"
          >
            {SPEEDS[speedIdx].label}
          </button>
          <button
            onClick={playReel}
            className="flex items-center gap-3 h-11 px-6 rounded-full bg-[#5D4037] text-white font-black text-sm tracking-wide shadow-lg hover:bg-[#F4A460] transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-[#82A07D] flex items-center justify-center text-[9px]">▶</span>
            เล่น Reel
          </button>
        </div>
      </div>

      {/* Playing chrome */}
      {playing && (
        <>
          {/* Frame number */}
          <div className="absolute top-10 left-10 z-[10280] flex items-baseline gap-3" style={{ pointerEvents: 'none' }}>
            <span
              className="font-black leading-none tracking-[-0.03em]"
              style={{
                fontSize: 64,
                background: 'linear-gradient(135deg, #82A07D, #F4A460, #FF8AAE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {frameNo}
            </span>
            <span className="font-mono text-[11px] font-bold text-[#5D4037]/30 uppercase tracking-[0.2em]">/ 08</span>
          </div>

          {/* Frame tag + REC */}
          <div className="absolute top-10 right-10 z-[10280] flex items-center gap-3" style={{ pointerEvents: 'none' }}>
            <span className="font-mono text-[11px] font-bold text-[#5D4037] bg-white border border-[#F3DCC1] px-3 py-2 rounded-full uppercase tracking-[0.22em] shadow-sm">
              {frameTag}
            </span>
            <span
              className="flex items-center gap-2 font-mono text-[10.5px] font-bold text-white px-3 py-2 rounded-full tracking-[0.18em] uppercase"
              style={{ background: 'rgba(61,43,36,0.85)', backdropFilter: 'blur(16px)' }}
            >
              <span
                className="w-[7px] h-[7px] rounded-full bg-[#FF5577]"
                style={{ animation: 'pulse 1.2s infinite' }}
              />
              REC <span style={{ marginLeft: 6 }}>{recTime}</span>
            </span>
          </div>

          {/* Caption */}
          {frameCap && (
            <div
              className="absolute z-[10280] flex items-center gap-3 font-medium text-[13.5px] text-[#5D4037] rounded-full px-6 py-3 border border-[#F3DCC1]"
              style={{
                bottom: 52,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255,249,240,0.88)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 20px rgba(93,64,55,0.08)',
                pointerEvents: 'none',
                maxWidth: '80vw',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-[#82A07D] flex-shrink-0"
                style={{ boxShadow: '0 0 10px #82A07D' }}
              />
              {frameCap}
            </div>
          )}

          {/* Stop button */}
          <button
            onClick={stopReel}
            className="absolute bottom-10 right-10 z-[10280] font-mono text-[11px] font-bold text-white px-5 py-2.5 rounded-full uppercase tracking-[0.14em] border border-white/10 transition-colors hover:bg-[#FF5577] hover:border-[#FF5577]"
            style={{ background: 'rgba(61,43,36,0.85)', backdropFilter: 'blur(16px)' }}
          >
            ■ STOP
          </button>

          {/* Speed (while playing) */}
          <button
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            className="absolute bottom-10 left-10 z-[10280] font-mono text-[11px] font-bold text-white/60 px-4 py-2.5 rounded-full uppercase tracking-[0.1em] border border-white/10 hover:text-white transition-colors"
            style={{ background: 'rgba(61,43,36,0.7)', backdropFilter: 'blur(12px)' }}
          >
            {SPEEDS[speedIdx].label}
          </button>
        </>
      )}

      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(800px 600px at 25% 30%, rgba(130,160,125,0.08), transparent 60%), radial-gradient(600px 500px at 75% 70%, rgba(244,164,96,0.07), transparent 60%)',
        }}
      />

      {/* Stage */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-16"
        style={{ paddingTop: playing ? 80 : 96, paddingBottom: playing ? 80 : 32 }}>
        <AnimatePresence mode="wait">
          {!playing && !sceneId && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="text-8xl mb-6">📖</div>
              <h2 className="text-5xl font-black uppercase tracking-[-0.02em] text-[#5D4037] mb-4">Encyclopedia</h2>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5D4037]/40 mb-12">Nobita's Story of Seasons</p>
              <button
                onClick={playReel}
                className="px-12 py-5 rounded-full bg-[#5D4037] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-[#F4A460] transition-colors"
              >
                ▶ เล่น Showcase Reel
              </button>
            </motion.div>
          )}

          {sceneId === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
              <SceneIntro />
            </motion.div>
          )}

          {sceneId === 'chars' && (
            <motion.div key="chars" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05 }}>
              <SceneChars filter={charFilter} highlighted={highlightChar} />
            </motion.div>
          )}

          {sceneId === 'char-detail' && (
            <motion.div key="char-detail" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -60 }}>
              <SceneCharDetail charId={detailChar} />
            </motion.div>
          )}

          {sceneId === 'seasons' && (
            <motion.div key="seasons" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
              <SceneSeasons fertId={fertId} highlightRow={highlightCropRow} />
            </motion.div>
          )}

          {sceneId === 'recipes' && (
            <motion.div key="recipes" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <SceneRecipes highlighted={highlightRecipe} />
            </motion.div>
          )}

          {sceneId === 'recipe-detail' && (
            <motion.div key="recipe-detail" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -40 }}>
              <SceneRecipeDetail recipeId={detailRecipeId} />
            </motion.div>
          )}

          {sceneId === 'shops' && (
            <motion.div key="shops" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
              <SceneShops />
            </motion.div>
          )}

          {sceneId === 'mining' && (
            <motion.div key="mining" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <SceneMining />
            </motion.div>
          )}

          {sceneId === 'outro' && (
            <motion.div key="outro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <SceneOutro onClose={() => { stopReel(); onFinish(); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cursor */}
      <Cursor x={cx} y={cy} visible={cVisible} clicking={cClick} />

      <style>{`
        @keyframes pulse { 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
};

export default ShowcaseReel;
