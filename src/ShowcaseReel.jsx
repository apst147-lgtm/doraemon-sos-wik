import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FALLBACK_RECIPES } from './data/recipesData';
import { CROPS_DATA, SEASONS } from './data/seasonsData';
import { getCharacterByName } from './characters';
import { cn } from './utils';
import { INGREDIENT_ICONS } from './data/constants';

const ShowcaseReel = ({ onFinish }) => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const sceneRef = useRef(null);
  const [currentScene, setCurrentScene] = useState('home');
  const [statusText, setStatusText] = useState('ยินดีต้อนรับสู่สารานุกรมโดราเอมอน...');
  const [progress, setProgress] = useState(0);
  const [mockSearch, setMockSearch] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [mockSeason, setMockSeason] = useState('Spring');
  const [mockFertilizer, setMockFertilizer] = useState('none');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [hoveredIng, setHoveredIng] = useState(false);
  const [mockCharSearch, setMockCharSearch] = useState('');
  const [mockActiveSource, setMockActiveSource] = useState(null);
  const [mockSelectedIngredient, setMockSelectedIngredient] = useState(null);
  const [showProfitStar, setShowProfitStar] = useState(false);

  const recipe1 = FALLBACK_RECIPES.find(r => r.name === 'แซนด์วิช') || FALLBACK_RECIPES[0];
  const recipe2 = FALLBACK_RECIPES.find(r => r.name === 'มาร์ลินสเต็ก') || FALLBACK_RECIPES[38];
  const featureRecipe = recipe2; // กำหนดค่าเริ่มต้นสำหรับส่วนแสดงผล

  const featureCrop = CROPS_DATA?.find(c => c.name === 'แตงโม') || { id: 'wm', name: 'แตงโม', icon: '🍉', growDays: 4, sellPrice: 450, totalProfit: 450, profitPerDay: 112.5, likedBy: ['โนบิตะ', 'ชิซุกะ'] };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    let isMounted = true;
    let currentX = 0;
    let currentY = 0;
    let internalProgress = 0;

    const runSimulation = async () => {
      if (!sceneRef.current) return;

      // เริ่มต้นด้วยมุมกล้องที่มั่นคงและชัดเจน
      if (sceneRef.current) {
        sceneRef.current.style.transform = 'scale(1)';
      }

      await updateState('สำรวจอาณาจักร Natura ผ่านสารานุกรมอัจฉริยะ...', 5);
      await sleep(2000);

      const categories = containerRef.current?.querySelectorAll('.mock-home-card');
      if (categories) {
        await updateState('รวบรวมข้อมูลทุกอย่างที่เกษตรกรจำเป็นต้องรู้...', 10);
        for (let i = 0; i < categories.length; i++) {
          if (!isMounted) return;
          const rect = categories[i].getBoundingClientRect();
          await moveCursor(rect.left + rect.width/2, rect.top + rect.height/2, 0.5);
          categories[i].classList.add('hover');
          await sleep(1000);
          categories[i].classList.remove('hover');
        }
      }

      // --- SHOWCASE: KITCHEN ---
      await updateState('ฐานข้อมูลสูตรอาหารอัจฉริยะ...', 15);
      const recipesBtn = categories[0];
      if (recipesBtn) {
        if (sceneRef.current) sceneRef.current.style.transform = 'scale(1)';
        const rect = recipesBtn.getBoundingClientRect();
        await moveCursor(rect.left + rect.width/2, rect.top + rect.height/2);
        await clickMouse(recipesBtn);
        if (!isMounted) return;
        setCurrentScene('kitchen');
        await sleep(1500);
      }

      // Cinematic Scrolling in Kitchen
      await updateState('วิเคราะห์ความคุ้มค่าและวัตถุดิบอย่างละเอียด...', 25);
      for (let i = 0; i <= 150; i += 4) {
        if (!isMounted) break;
        setScrollOffset(-i);
        await sleep(16);
      }
      await sleep(1000);
      
      // จำลองการ Sort
      const sortBtn = containerRef.current?.querySelector('.mock-sort-btn');
      if (sortBtn) {
        const rect = sortBtn.getBoundingClientRect();
        await moveCursor(rect.left + 40, rect.top + 15);
        await clickMouse(sortBtn);
      }
      await sleep(800);

      for (let i = 150; i >= 0; i -= 8) {
        if (!isMounted) break;
        setScrollOffset(-i);
        await sleep(16);
      }
      await sleep(500);

      await updateState('ค้นหาเมนูตามอุปกรณ์หรือแหล่งที่มาวัตถุดิบ...', 35);
      const filterTab = containerRef.current?.querySelector('.mock-filter-tab:nth-child(2)');
      if (filterTab) {
        const rect = filterTab.getBoundingClientRect();
        await moveCursor(rect.left + 30, rect.top + 15);
        await clickMouse(filterTab);
      }
      await sleep(1500);

      await updateState('กรองตามแหล่งที่มาวัตถุดิบ...', 40);
      const sourceBtn = containerRef.current?.querySelector('.mock-source-btn:nth-child(1)');
      if (sourceBtn) {
        const rect = sourceBtn.getBoundingClientRect();
        await moveCursor(rect.left + 30, rect.top + 15);
        await clickMouse(sourceBtn);
        if (!isMounted) return;
        setMockActiveSource('ตกปลา');
      }
      await sleep(1800);

      const ingPill = containerRef.current?.querySelector('.mock-ing-pill:nth-child(1)');
      if (ingPill) {
        const rect = ingPill.getBoundingClientRect();
        await moveCursor(rect.left + 40, rect.top + 10);
        await clickMouse(ingPill);
        if (!isMounted) return;
        setMockSelectedIngredient('ปลามาร์ลิน');
      }
      await sleep(1500);

      await updateState('วิเคราะห์กำไรและรายละเอียดเมนูแบบเจาะลึก...', 55);
      const marlinRow = containerRef.current?.querySelector('.mock-recipe-row');
      if (marlinRow) {
        const rect = marlinRow.getBoundingClientRect();
        // ซูมเข้าไปเล็กน้อยขณะจะคลิกเมนู
        if (sceneRef.current) sceneRef.current.style.transform = 'scale(1.05)';
        await moveCursor(rect.left + 200, rect.top + 30);
        await clickMouse(marlinRow);
        if (!isMounted) return;
        setActiveModal(recipe2);
      }
      await sleep(2200);

      await updateState('Tooltip บอกแหล่งที่มาและข้อมูลเชิงลึกชัดเจน...', 65);
      // เลือกวัตถุดิบชิ้นแรกมาโชว์ Tooltip
      const ings = containerRef.current?.querySelectorAll('.mock-ing');
      if (ings && ings[0]) {
        const rect = ings[0].getBoundingClientRect();
        await moveCursor(rect.left + 25, rect.top + 25);
        if (!isMounted) return;
        setHoveredIng(true);
        await sleep(3000);
        if (isMounted) setHoveredIng(false);
      }

      if (sceneRef.current) sceneRef.current.style.transform = 'scale(1)';
      const profitArea = containerRef.current?.querySelector('.mock-profit-area');
      if (profitArea) {
        const rect = profitArea.getBoundingClientRect();
        await moveCursor(rect.left + 50, rect.top + 20);
        if (!isMounted) return;
        setShowProfitStar(true);
        await sleep(3000);
        setShowProfitStar(false);
      }

      if (!isMounted) return;
      setActiveModal(null);
      await sleep(1200);

      await updateState('ค้นหาง่ายๆ เพียงพิมพ์ชื่อเมนูที่ต้องการ...', 80);
      const searchInput = containerRef.current?.querySelector('.mock-search input');
      if (searchInput) {
        if (!isMounted) return;
        setMockActiveSource(null);
        setMockSelectedIngredient(null);
        const rect = searchInput.getBoundingClientRect();
        await moveCursor(rect.left + 100, rect.top + 20);
        await clickMouse(searchInput.parentElement);
        await typeText(searchInput, 'แซนด์วิช', setMockSearch);
        if (!isMounted) return;
        setShowResults(true);
      }
      await sleep(2000);

      // --- SHOWCASE: SEASONS ---
      await updateState('วางแผนการเพาะปลูกรายฤดูกาล...', 90);
      const seasonsTab = containerRef.current?.querySelector('.mock-tab-item:nth-child(2)');
      if (seasonsTab) {
        if (sceneRef.current) sceneRef.current.style.transform = 'scale(0.98)';
        const rect = seasonsTab.getBoundingClientRect();
        await moveCursor(rect.left + 40, rect.top + 15);
        await clickMouse(seasonsTab);
        if (!isMounted) return;
        setCurrentScene('seasons');
        await sleep(1500);
        if (sceneRef.current) sceneRef.current.style.transform = 'scale(1)';
      }

      const summerBtn = containerRef.current?.querySelector('.mock-season-pill:nth-child(2)');
      if (summerBtn) {
        const rect = summerBtn.getBoundingClientRect();
        await moveCursor(rect.left + 50, rect.top + 25);
        await clickMouse(summerBtn);
        if (!isMounted) return;
        setMockSeason('Summer');
      }
      await sleep(1500);

      await updateState('จำลองผลกำไรจากการใช้ปุ๋ยสูตรต่างๆ...', 92);
      const fertBtn = containerRef.current?.querySelector('.mock-fert-btn:nth-child(3)');
      if (fertBtn) {
        const rect = fertBtn.getBoundingClientRect();
        await moveCursor(rect.left + 40, rect.top + 15);
        await clickMouse(fertBtn);
        if (!isMounted) return;
        setMockFertilizer('fancy');
      }
      await sleep(1800);

      await updateState('ส่งออกแผนการปลูกเป็นรูปภาพได้ทันที...', 95);
      const exportBtn = containerRef.current?.querySelector('.mock-export-btn');
      if (exportBtn) {
        const rect = exportBtn.getBoundingClientRect();
        await moveCursor(rect.left + 50, rect.top + 20);
        await clickMouse(exportBtn);
        containerRef.current?.classList.add('global-click');
        await sleep(300);
        containerRef.current?.classList.remove('global-click');
      }
      await sleep(2500);

      // --- SHOWCASE: CHARACTERS ---
      await updateState('ทำความรู้จักและสานสัมพันธ์กับชาวเมือง...', 97);
      const charTab = containerRef.current?.querySelector('.mock-tab-item:nth-child(3)');
      if (charTab) {
        const rect = charTab.getBoundingClientRect();
        if (sceneRef.current) sceneRef.current.style.transform = 'scale(0.98)';
        await moveCursor(rect.left + 40, rect.top + 15);
        await clickMouse(charTab);
        if (!isMounted) return;
        setCurrentScene('characters');
        await sleep(1500);
        if (sceneRef.current) sceneRef.current.style.transform = 'scale(1)';
      }

      // เลือกหมวดหมู่ตัวละคร
      const catBtn = containerRef.current?.querySelector('.mock-char-cat-btn:nth-child(2)');
      if (catBtn) {
        const rect = catBtn.getBoundingClientRect();
        await moveCursor(rect.left + 30, rect.top + 15);
        await clickMouse(catBtn);
      }
      await sleep(1200);

      const charSearch = containerRef.current?.querySelector('.mock-char-search');
      if (charSearch) {
        const rect = charSearch.getBoundingClientRect();
        await moveCursor(rect.left + 100, rect.top + 20);
        await clickMouse(charSearch.parentElement);
        await typeText(charSearch, 'หัวหน้า', setMockCharSearch);
      }
      await sleep(1200);

      const charCard = containerRef.current?.querySelector('.mock-char-card');
      if (charCard) {
        const rect = charCard.getBoundingClientRect();
        if (sceneRef.current) sceneRef.current.style.transform = 'scale(1.05)';
        await moveCursor(rect.left + rect.width/2, rect.top + rect.height/2);
        charCard.classList.add('hover');
        await sleep(3000);
        charCard.classList.remove('hover');
      }

      await updateState('Encyclopedia: พร้อมให้คุณสำรวจแล้ววันนี้!', 100);
      if (sceneRef.current) {
        sceneRef.current.style.transform = 'scale(0.8) translateY(-100px)';
        sceneRef.current.style.filter = 'blur(4px)';
      }
      await sleep(5000);

      if (onFinish && isMounted) onFinish();
    };

    const updateState = async (text, prog) => {
      if (isMounted) {
        setStatusText(text);
        const steps = Math.max(0, prog - internalProgress);
        setProgress(prog);
        internalProgress = prog;
        if (steps > 0) await sleep(steps * 15);
      }
    };

    const moveCursor = async (x, y, customDuration = null) => {
      const cursor = cursorRef.current;
      if (cursor && isMounted) {
        const dist = Math.sqrt(Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2));
        const duration = customDuration || Math.max(0.7, Math.min(1.5, dist / 400));
        cursor.style.transition = `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s ease`;
        cursor.style.transform = `translate(${x}px, ${y}px)`;
        currentX = x;
        currentY = y;
        await sleep(duration * 1000 + 100);
      }
    };

    const clickMouse = async (el = null) => {
      const cursor = cursorRef.current;
      if (!cursor || !isMounted) return;
      
      if (el) el.classList.add('sim-active');
      cursor.style.scale = '0.8';
      cursor.classList.add('clicking');
      containerRef.current?.classList.add('global-click');
      await sleep(150);
      if (isMounted) {
        if (el) el.classList.remove('sim-active');
        cursor.style.scale = '1';
        cursor.classList.remove('clicking');
        containerRef.current?.classList.remove('global-click');
      }
    };

    const typeText = async (element, text, setter) => {
      if (!isMounted) return;
      let currentText = "";
      for (let char of text) {
        if (!isMounted) break;
        currentText += char;
        setter(currentText);
        await sleep(100 + Math.random() * 150);
      }
    };

    runSimulation();
    return () => { isMounted = false; };
  }, [onFinish]);

  return (
    <div ref={containerRef} className="showcase-container h-full w-full">
      {/* CSS Styles Replicating App.jsx */}
      <style>{`
        .showcase-container {
          position: fixed; inset: 0; background: #FFF9F0;
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; font-family: 'Inter', 'Kanit', sans-serif;
          overflow: hidden;
          cursor: none;
        }

        .showcase-container::after {
          content: '🌸'; position: absolute; top: -50px;
          font-size: 24px; opacity: 0.15;
          animation: petals 10s linear infinite;
          text-shadow: 150px 250px 0 #F4A460, 350px 550px 0 #82A07D, 650px 150px 0 #F4A460, 850px 450px 0 #F4A460;
          pointer-events: none;
          will-change: transform;
          filter: blur(1px);
        }
        @keyframes petals {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(25vh) translateX(30px) rotate(90deg); }
          50% { transform: translateY(50vh) translateX(-20px) rotate(180deg); }
          75% { transform: translateY(75vh) translateX(40px) rotate(270deg); }
          100% { transform: translateY(110vh) translateX(0) rotate(360deg); }
        }

        .fake-cursor {
          position: fixed; top: 0; left: 0; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none; z-index: 10000;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fake-cursor::before {
          content: '👆'; font-size: 44px; filter: drop-shadow(0 6px 12px rgba(93,64,55,0.3)); transform: rotate(-10deg);
        }
        .scene-window { position: relative; width: 90vw; max-width: 1050px; min-height: 650px; max-height: 90vh; background: white; border: 1px solid #F3DCC1; border-radius: 32px; box-shadow: 0 60px 120px -30px rgba(93,64,55,0.18); transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1); display: flex; flex-direction: column; overflow: hidden; pointer-events: none; }
        
        /* Button Animation Classes */
        .mock-home-card, .mock-filter-tab, .mock-source-btn, .mock-fert-btn, .mock-export-btn, .mock-tab-item, .mock-ing-pill, .mock-sort-btn, .mock-char-cat-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sim-active { transform: scale(0.92) !important; filter: brightness(0.95); }

        .mock-nav { height: 70px; border-bottom: 1px solid #F3DCC1; display: flex; align-items: center; padding: 0 40px; background: white; gap: 40px; backdrop-filter: blur(10px); }
        .mock-window-controls { position: absolute; left: 20px; top: 10px; display: flex; gap: 6px; }
        .mock-dot { width: 10px; height: 10px; rounded-full; border-radius: 50%; opacity: 0.3; }
        .mock-logo { font-weight: 900; color: #5D4037; letter-spacing: 0.3em; font-size: 18px; text-transform: uppercase; }
        .mock-logo span { font-weight: 300; color: #F4A460; }
        .mock-content { flex: 1; padding: 40px 60px; transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1); background: white; scroll-behavior: smooth; overflow-y: auto; }
        .mock-home-grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 24px; }
        .mock-home-card { aspect-ratio: 1 / 1; border: 1px solid #F3DCC1; border-radius: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .mock-home-card.hover { border-color: #F4A460; transform: translateY(-10px) scale(1.05); box-shadow: 0 20px 40px -10px rgba(93,64,55,0.1); }
        .mock-search { border-bottom: 1px solid #F3DCC1; margin-bottom: 30px; max-width: 600px; }
        .mock-search input { background: transparent; border: none; font-size: 28px; color: #5D4037; outline: none; width: 100%; padding: 10px 0; font-weight: 300; }
        .mock-filter-tab { padding: 8px 18px; border-radius: 99px; border: 1px solid #F3DCC1; font-size: 9px; font-weight: 900; color: #8C7E6A; text-transform: uppercase; letter-spacing: 0.1em; transition: 0.3s; }
        .mock-filter-tab.active { background: #5D4037; color: white; border-color: #5D4037; }
        .mock-sort-btn { padding: 4px 10px; border-radius: 99px; border: 1px solid #EBE9E4; font-size: 7px; font-weight: 900; color: #8C7E6A; text-transform: uppercase; }
        .mock-source-btn { padding: 6px 12px; border-radius: 12px; border: 1px solid #F3DCC1; font-size: 8px; font-weight: 900; color: #8C7E6A; text-transform: uppercase; letter-spacing: 0.1em; transition: 0.3s; }
        .mock-source-btn.active { background: #5D4037; color: white; border-color: #5D4037; }
        .mock-ing-pill { padding: 4px 10px; border-radius: 99px; border: 1px solid #EBE9E4; font-size: 7px; font-weight: bold; color: #8C7E6A; transition: 0.3s; }
        .mock-ing-pill.active { background: #1A1A1A; color: white; border-color: #1A1A1A; }
        .mock-char-cat-btn { padding: 6px 14px; border-radius: 12px; border: 1px solid #EBE9E4; font-size: 8px; font-weight: 900; color: #8C7E6A; text-transform: uppercase; }
        .mock-char-cat-btn.active { background: #1A1A1A; color: white; border-color: #1A1A1A; }
        .mock-fert-btn { padding: 6px 12px; border-radius: 10px; background: white; border: 1px solid #EBE9E4; font-size: 8px; font-weight: bold; color: #8C7E6A; }
        .mock-fert-btn.active { background: #1A1A1A; color: white; border-color: #1A1A1A; }
        .mock-recipe-row { display: flex; align-items: center; gap: 24px; border-bottom: 1px solid #EBE9E4; padding: 20px 16px; transition: 0.4s; border-radius: 12px; }
        .mock-char-card { position: relative; background: white; border: 1px solid #F3DCC1; border-radius: 2.5rem; text-align: center; transition: 0.5s; padding: 35px 25px 25px; min-width: 220px; margin-top: 30px; }
        .mock-char-card.hover { transform: translateY(-10px); border-color: #F4A460; box-shadow: 0 20px 40px rgba(93,64,55,0.1); }
        .mock-char-avatar { width: 100px; height: 100px; border-radius: 50%; background: #F8F7F4; position: absolute; top: -50px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; font-size: 55px; border: 6px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .mock-tag { padding: 4px 10px; border-radius: 8px; font-size: 8px; font-weight: 900; background: rgba(244,164,96,0.1); color: #F4A460; }
        .mock-modal { position: absolute; inset: 0; margin: auto; width: 350px; height: fit-content; background: #FCFBF7; border: 6px double rgba(140, 126, 106, 0.2); padding: 40px 30px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.2); z-index: 100; display: flex; flex-direction: column; align-items: center; border-radius: 4px; }
        .modal-jap-badge { position: absolute; left: -10px; top: 40px; font-size: 10px; font-weight: bold; color: rgba(140, 126, 106, 0.2); writing-mode: vertical-rl; letter-spacing: 0.5em; }
        .mock-modal-icon { width: 100px; height: 100px; border: 1px solid rgba(140, 126, 106, 0.2); background: white; display: flex; align-items: center; justify-content: center; font-size: 60px; margin-bottom: 30px; box-shadow: inset 0 0 20px rgba(0,0,0,0.02); }
        .mock-tooltip { position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: #1A1A1A; color: white; padding: 14px; border-radius: 16px; font-size: 10px; width: 180px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); z-index: 200; }
        .mock-profit-star { position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: #1A1A1A; color: white; padding: 15px; border-radius: 20px; width: 200px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); z-index: 200; }
        .mock-ing { width: 50px; height: 50px; background: white; border: 1px solid rgba(140, 126, 106, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; position: relative; }
        .mock-season-pill { padding: 12px 24px; border-radius: 99px; background: #FFF9F0; border: 1px solid #F3DCC1; display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 900; transition: 0.3s; }
        .mock-season-pill.active { background: #FFF4E6; border-color: #F4A460; color: #5D4037; }
        .mock-season-card { background: white; border: 1px solid #F3DCC1; border-radius: 32px; padding: 30px; display: flex; flex-direction: column; align-items: center; width: 180px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); }
        .ad-status { position: absolute; bottom: 35px; background: #5D4037; color: white; padding: 12px 30px; border-radius: 100px; font-size: 12px; font-weight: 900; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10001; border: 1px solid rgba(255,255,255,0.1); }
        .ad-progress { position: absolute; bottom: 0; left: 0; height: 6px; background: #F4A460; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); z-index: 10002; }
        .close-btn { position: absolute; top: 30px; right: 30px; width: 44px; height: 44px; border-radius: 50%; background: white; border: 1px solid #F3DCC1; color: #5D4037; display: flex; align-items: center; justify-content: center; z-index: 10005; transition: 0.3s; cursor: pointer; }
        .close-btn:hover { background: #5D4037; color: white; }
        .global-click::after { content: ''; position: fixed; inset: 0; background: rgba(244, 164, 96, 0.1); animation: flash 0.4s ease-out; pointer-events: none; z-index: 9998; }
        @keyframes flash { from { opacity: 1; } to { opacity: 0; } }
      `}</style>

      <button className="close-btn" onClick={onFinish}>✕</button>
      <div ref={cursorRef} className="fake-cursor" />

      <div ref={sceneRef} className="scene-window">
        <div className="mock-window-controls">
          <div className="mock-dot" style={{background: '#FF5F56'}} />
          <div className="mock-dot" style={{background: '#FFBD2E'}} />
          <div className="mock-dot" style={{background: '#27C93F'}} />
        </div>
        <div className="mock-nav">
          <div className="mock-logo">Doraemon <span className="font-light text-[#F4A460]">SoS</span></div>
          <div style={{marginLeft: 'auto', display: 'flex', gap: '30px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em', color: '#8C7E6A'}}>
            <div className={cn("mock-tab-item transition-colors", currentScene === 'kitchen' && "text-[#5D4037]")}>RECIPES</div>
            <div className={cn("mock-tab-item transition-colors", currentScene === 'seasons' && "text-[#5D4037]")}>SEASONS</div>
            <div className={cn("mock-tab-item transition-colors", currentScene === 'characters' && "text-[#5D4037]")}>CHARACTERS</div>
          </div>
        </div>

        <div className="mock-content">
          {currentScene === 'home' && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-12 text-center">
                <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#82A07D] block mb-4">Wiki Database</span>
                <h1 className="text-7xl font-black text-[#5D4037] uppercase tracking-tighter">ENCYCLOPEDIA</h1>
                <div className="my-6 h-[2px] w-20 bg-[#F4A460]/30 mx-auto"></div>
                <p className="text-[10px] font-medium italic uppercase tracking-[0.2em] text-[#5D4037]/50 mt-4">Nobita's Story of Seasons</p>
              </div>
              <div className="mock-home-grid w-full max-w-3xl">
                {[
                  {icon: '🍲', title: 'รวมเมนูอาหาร', desc: 'สูตรลับจากครัวโนบิตะ', id: '01'},
                  {icon: '🌸', title: 'ฤดูกาล', desc: 'ตารางเพาะปลูกรายเดือน', id: '02'},
                  {icon: '👧🏻', title: 'ตัวละคร', desc: 'ความสัมพันธ์และของที่ชอบ', id: '03'},
                  {icon: '🧺', title: 'ร้านค้า', desc: 'เวลาทำการและรายการสินค้า', id: '04'}
                ].map((cat, i) => (
                  <div key={i} className="mock-home-card relative px-4 text-center">
                    <div className="absolute right-5 top-5 text-[8px] font-mono text-[#F3DCC1]">{cat.id}</div>
                    <span className="text-4xl mb-4 transition-all group-hover:scale-110">{cat.icon}</span>
                    <span className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest">{cat.title}</span>
                    <p className="text-[7px] font-medium uppercase tracking-tight text-[#5D4037]/60 mt-1">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ transform: `translateY(${scrollOffset}px)`, display: currentScene === 'kitchen' ? 'block' : 'none' }}>
            <div className="mock-search">
              <input type="text" readOnly value={mockSearch} placeholder="Recipe name..." />
            </div>
            <div className="flex justify-between items-center mb-10">
              <div className="flex gap-3">
                <div className={cn("mock-filter-tab", !mockSearch && "active")}>🥘 ทั้งหมด</div>
                <div className="mock-filter-tab">🍳 กระทะ</div>
                <div className="mock-filter-tab">🥣 หม้อ</div>
              </div>
              <div className="mock-sort-btn">Sort by Profit ↓</div>
            </div>

            <div className="mb-6">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#8C7E6A] block mb-3">Ingredient Sources</span>
              <div className="flex gap-2 mb-4">
                <div className={cn("mock-source-btn", mockActiveSource === 'ตกปลา' && "active")}>🎣 ตกปลา</div>
                <div className="mock-source-btn">🌱 เพาะปลูก</div>
              </div>
              {mockActiveSource === 'ตกปลา' && (
                <div className="flex gap-2">
                  <div className={cn("mock-ing-pill", mockSelectedIngredient === 'ปลามาร์ลิน' && "active")}>ปลามาร์ลิน</div>
                  <div className="mock-ing-pill">ปลาไท</div>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              {[recipe2, recipe1].filter(r => {
                if (mockSearch) return r.name.includes(mockSearch);
                if (mockSelectedIngredient === 'ปลามาร์ลิน') return r.name === 'มาร์ลินสเต็ก';
                return true;
              }).map((r, i) => (
                r && (
                  <div key={i} className="mock-recipe-row">
                    <span className="text-4xl">{r.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-sm font-black uppercase text-[#1A1A1A]">{r.name}</h4>
                        <div className="text-right">
                          <div className="text-[8px] uppercase font-bold text-[#E97451]/60 tracking-widest">Value</div>
                          <div className="text-xs font-bold text-[#E97451]">{r.sell.toLocaleString()} G</div>
                        </div>
                      </div>
                      <div className="text-[9px] text-[#8C7E6A]/50 font-bold uppercase mt-1">{r.equipment}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {currentScene === 'seasons' && (
            <div className="h-full">
               <h2 className="text-3xl font-black text-[#1A1A1A] mb-8 tracking-tighter uppercase">Agricultural Cycle</h2>
               <div className="flex gap-4 mb-10">
                 <div className={cn("mock-season-pill", mockSeason === 'Spring' && "active")}>🌸 SPRING</div>
                 <div className={cn("mock-season-pill", mockSeason === 'Summer' && "active")}>☀️ SUMMER</div>
               </div>

               <div className="flex gap-2 mb-8 bg-[#F8F7F4] p-4 rounded-2xl items-center">
                  <span className="text-[8px] font-black uppercase text-[#8C7E6A] mr-4">Sim Fertilizer:</span>
                  <div className={cn("mock-fert-btn", mockFertilizer === 'none' && "active")}>Normal</div>
                  <div className="mock-fert-btn">Speedy</div>
                  <div className={cn("mock-fert-btn", mockFertilizer === 'fancy' && "active")}>✨ Fancy</div>
               </div>

               <div className="mock-season-card mb-8">
                  <span className="text-6xl mb-6">{featureCrop.icon}</span>
                  <h4 className="font-black text-[#1A1A1A] mb-2">{featureCrop.name}</h4>
                  <div className="text-[10px] font-bold text-[#8C7E6A]">⏱️ {featureCrop.growDays} วัน</div>
                  <div className="mt-6 pt-6 border-t border-[#F3DCC1] w-full text-center">
                     <div className="text-2xl font-black text-[#82A07D] tracking-tight">
                        {mockFertilizer === 'fancy' ? (featureCrop.profitPerDay * 1.3).toFixed(1) : featureCrop.profitPerDay} 
                        <span className="text-[10px] font-bold ml-1">G/Day</span>
                     </div>
                  </div>
               </div>

               {/* Mock Summary Bar ที่ถอดแบบจาก SeasonsPage.jsx */}
               <div className="w-full bg-[#1A1A1A] p-6 rounded-[2rem] flex justify-between items-center text-white shadow-xl">
                  <div className="flex gap-10">
                     <div className="flex flex-col"><span className="text-[8px] uppercase opacity-40">Investment</span><span className="text-sm font-bold">1,200 G</span></div>
                     <div className="flex flex-col"><span className="text-[8px] uppercase text-[#82A07D]">Net Profit</span><span className="text-sm font-black text-[#82A07D]">+4,500 G</span></div>
                  </div>
                  <div className="mock-export-btn px-6 py-3 bg-[#82A07D] rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-[#6D8A68] transition-colors">
                     📷 Export Plan
                  </div>
               </div>
            </div>
          )}

          {currentScene === 'characters' && (
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-8 tracking-tighter uppercase">Residents Directory</h2>
              <div className="mock-search mb-12">
                <input className="mock-char-search" type="text" readOnly value={mockCharSearch} placeholder="Lookup residents..." />
              </div>
              
              <div className="flex gap-2 mb-10">
                <div className="mock-char-cat-btn active">ทั้งหมด</div>
                <div className="mock-char-cat-btn">ชาวเมือง</div>
                <div className="mock-char-cat-btn">คนแคระ</div>
                <div className="mock-char-cat-btn">อื่นๆ</div>
              </div>

              <div className="flex gap-10 mt-10">
                <div className="mock-char-card">
                  <div className="mock-char-avatar">
                    <span>{getCharacterByName('โนบิตะ')?.portrait || '👦🏻'}</span>
                  </div>
                  <h4 className="font-black text-lg text-[#1A1A1A] mb-1">โนบิตะ</h4>
                  <p className="text-[8px] text-[#8C7E6A] mb-4 uppercase font-bold tracking-widest">Birthday: Summer 7</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="mock-tag">🥞 แพนเค้ก</span>
                    <span className="mock-tag">🍉 แตงโม</span>
                  </div>
                </div>
                <div className="mock-char-card">
                  <div className="mock-char-avatar">
                    <span>{getCharacterByName('ชิซุกะ')?.portrait || '👧🏻'}</span>
                  </div>
                  <h4 className="font-black text-lg text-[#1A1A1A] mb-1">ชิซุกะ</h4>
                  <p className="text-[8px] text-[#8C7E6A] mb-4 uppercase font-bold tracking-widest">Birthday: Spring 2</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    <span className="mock-tag">🍠 มันเผา</span>
                    <span className="mock-tag">🧀 ชีสเค้ก</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {activeModal && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              className="mock-modal"
            >
              <div className="modal-jap-badge">四季の料理</div>
              <div className="mock-modal-icon">{activeModal.icon}</div>
              <div className="text-4xl font-black mb-2 uppercase tracking-tighter">{activeModal.name}</div>
              <div className="mx-auto h-[1px] w-12 bg-[#1A1A1A]/20 mb-4"></div>
              <div className="text-[9px] font-black text-[#8C7E6A] tracking-[0.4em] mb-8 uppercase">Tools: {activeModal.equipment}</div>
              
              <div className="w-full flex justify-center gap-4 mb-10">
                {activeModal.ingredients?.slice(0, 3).map((ing, i) => {
                  const ingName = typeof ing === 'string' ? ing : ing.name;
                  const ingSource = typeof ing === 'string' ? 'Unknown' : (ing.source || 'Unknown');
                  const icon = INGREDIENT_ICONS[ingName] || '📦';

                  return (
                    <div key={i} className={cn("mock-ing transition-all duration-500", i === 0 && hoveredIng && "scale-110 shadow-lg border-[#F4A460]")}>
                      <span>{icon}</span>
                      {i === 0 && hoveredIng && (
                        <div className="mock-tooltip">
                          <div className="font-black text-[#F4A460] uppercase border-b border-white/10 pb-2 mb-2">
                            {ingName}
                          </div>
                          <p className="opacity-90 font-bold">แหล่งที่มา: {ingSource}</p>
                          <p className="text-[8px] opacity-40 mt-1 italic tracking-tight">Hover to reveal info</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mock-profit-area w-full bg-[#F3DCC1]/10 rounded-xl p-5 relative">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#82A07D]">
                    <span>Added Profit</span>
                    <span className="text-xl">+{activeModal.sell.toLocaleString()} G</span>
                 </div>
                 {showProfitStar && (
                   <div className="mock-profit-star">
                     <div className="text-[10px] font-black text-[#F4A460] mb-4 border-b border-white/10 pb-2 text-center uppercase tracking-widest">Star Breakdown</div>
                     <div className="space-y-2">
                        <div className="flex justify-between"><span>⭐ 0.5</span> <span className="font-bold text-[#82A07D]">{activeModal.sell} G</span></div>
                        <div className="flex justify-between"><span>⭐ 5.0</span> <span className="font-bold text-[#82A07D]">{activeModal.sell * 2.5} G</span></div>
                     </div>
                   </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ad-progress" style={{ width: `${progress}%` }} />
      <div className="ad-status">{statusText}</div>
    </div>
  );
};

export default ShowcaseReel;