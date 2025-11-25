import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import { SURNAMES_COMMON, SURNAMES_RARE, TOTAL_CARDS, getSurnamesForCard } from './constants';
import { Card } from './components/Card';
import { getSurnameInsight } from './services/geminiService';
import { Zap, RefreshCw, Power, Binary, Radio, AlertTriangle } from 'lucide-react';

type GameMode = 'common' | 'rare';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [gameMode, setGameMode] = useState<GameMode>('common');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [calculatedIndex, setCalculatedIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  
  const [finalSurname, setFinalSurname] = useState<string>('');
  const [aiInsight, setAiInsight] = useState<string>('');
  
  const [cardData, setCardData] = useState<string[][]>([]);

  // Divergence Meter Logic (Visual only)
  const [divergence, setDivergence] = useState("0.000000");

  const activeSurnames = gameMode === 'common' ? SURNAMES_COMMON : SURNAMES_RARE;

  useEffect(() => {
    const data = [];
    for (let i = 0; i < TOTAL_CARDS; i++) {
      data.push(getSurnamesForCard(i, activeSurnames));
    }
    setCardData(data);
  }, [gameMode, activeSurnames]);

  // Update divergence meter based on progress
  useEffect(() => {
    if (gameState === GameState.INTRO) {
        setDivergence("1.048596"); // Steins;Gate Ref
    } else if (gameState === GameState.PLAYING) {
        // Generate a pseudo-random divergence number based on input
        const randomVal = (calculatedIndex * 0.123456 + currentCardIndex * 0.01).toFixed(6);
        setDivergence(randomVal);
    } else {
        setDivergence("?.??????");
    }
  }, [calculatedIndex, currentCardIndex, gameState]);

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    setGameState(GameState.PLAYING);
    setCurrentCardIndex(0);
    setCalculatedIndex(0);
    setHistory([]);
    setFinalSurname('');
    setAiInsight('');
  };

  const handleRestart = () => {
    handleStart(gameMode);
  };

  const handleAnswer = (hasSurname: boolean) => {
    setHistory([...history, calculatedIndex]);
    let newIndex = calculatedIndex;
    if (hasSurname) {
      newIndex += (1 << currentCardIndex);
    }
    const nextCard = currentCardIndex + 1;
    setCalculatedIndex(newIndex);

    if (nextCard < TOTAL_CARDS) {
      setCurrentCardIndex(nextCard);
    } else {
      finishGame(newIndex);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0 && history.length > 0) {
      const prevIndex = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCalculatedIndex(prevIndex);
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const finishGame = async (finalIndex: number) => {
    setGameState(GameState.RESULT);
    const surname = activeSurnames[finalIndex];
    if (finalIndex === 0 || !surname) {
      setFinalSurname("UNKNOWN");
    } else {
      setFinalSurname(surname);
      const insight = await getSurnameInsight(surname);
      setAiInsight(insight);
      setDivergence("3.141592"); // Pi, why not
    }
  };

  // --- RENDERING ---

  // Decorative Background Element (Steins;Gate Gears)
  const BackgroundGears = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* User provided background image - HTTPS enforced */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('https://imgs.aixifan.com/o_1c7il0iijlh912mq74g1evu1hl62r.jpg')" }}
      ></div>
      
      {/* Gradient Overlay for Text Readability - Darker at bottom/top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

      {/* Abstract Gear Representation using SVGs or CSS shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] rounded-full border-4 border-dashed border-[#ffffff15] animate-spin-slow" style={{animationDuration: '60s'}}></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[80vh] h-[80vh] rounded-full border-8 border-dotted border-[#ffffff10] animate-spin-slow" style={{animationDuration: '120s'}}></div>
    </div>
  );

  const DivergenceMeter = () => (
    <div className="fixed top-4 left-4 z-50 font-mono text-[#ff5f00] flex items-center gap-2 bg-black/80 px-4 py-2 border border-[#333]">
       {/* Brightened label color */}
       <span className="text-xs text-white uppercase tracking-widest">世界线变动率:</span>
       <span className="text-2xl nixie-text font-bold tracking-widest">{divergence}</span>
       <span className="text-xl text-[#ff5f00]">%</span>
    </div>
  );

  const renderIntro = () => (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      {/* Logo / Title Area - Bleach Style typography */}
      <div className="mb-12 relative group cursor-default">
         <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter bleach-title mix-blend-difference relative z-10 whitespace-nowrap">
           姓氏猜测
         </h1>
         <h1 className="text-7xl md:text-9xl font-black text-transparent stroke-white italic tracking-tighter bleach-title absolute top-1 left-1 opacity-50 z-0 whitespace-nowrap" style={{WebkitTextStroke: '1px white'}}>
           姓氏猜测
         </h1>
         <div className="absolute -bottom-4 right-0 bg-[#ff5f00] text-black px-2 font-mono text-sm font-bold tracking-widest rotate-[-2deg]">
           计划：读心
         </div>
      </div>

      <p className="text-stone-200 font-mono max-w-lg mb-12 leading-relaxed text-sm md:text-base border-l-2 border-[#ff5f00] pl-4 text-left bg-black/40 backdrop-blur-sm p-4">
        观测对象的姓氏数据存在于特定的世界线上。
        通过观测对象对 {TOTAL_CARDS} 个不同时间层级的反应，我们可以收束波函数并确定其【真名】。
        <br/><br/>
        <span className="text-[#00ff00]">El Psy Congroo.</span>
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => handleStart('common')}
          className="group relative w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-[#ff5f00] transition-colors duration-300 clip-path-slant"
        >
           <span className="flex items-center justify-center gap-3">
             <Binary className="w-5 h-5" /> 启动观测
           </span>
           {/* Glitch decor */}
           <div className="absolute top-0 left-0 w-full h-full border border-white opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
        </button>

        <button
          onClick={() => handleStart('rare')}
          className="group w-full py-4 bg-black/60 border border-stone-400 text-stone-200 font-bold uppercase tracking-[0.1em] hover:border-[#00ff00] hover:text-[#00ff00] hover:bg-black/80 transition-all duration-300 font-mono text-sm backdrop-blur-sm"
        >
           <span className="flex items-center justify-center gap-3">
             <Radio className="w-4 h-4" /> 模式切换：生僻 / 复姓
           </span>
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    const isUnknown = finalSurname === "UNKNOWN";
    const isCompound = finalSurname.length > 1;

    return (
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-10 px-4">
        {/* Result Header */}
        <div className="border-b border-white mb-8 pb-4 flex justify-between items-end">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase">
            观测结果
          </h2>
          <div className="font-mono text-[#ff5f00] text-xs md:text-sm text-right bg-black/50 px-2 py-1">
             <p>状态：观测完成</p>
             <p>世界线：收束</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
           {/* Surname Display - Bleach Style Title Card */}
           <div className="w-full md:w-1/2">
              <div className="relative border-4 border-white p-8 md:p-12 bg-black/80 flex items-center justify-center min-h-[300px]">
                 {isUnknown ? (
                   <div className="text-center w-full">
                     <AlertTriangle className="w-16 h-16 text-[#ff5f00] mb-4 mx-auto animate-pulse" />
                     <h3 className="text-2xl font-black text-white mb-2">观测无法收束</h3>
                     <p className="font-mono text-stone-300 text-sm leading-relaxed">
                       目标对象丢失。<br/>
                       可能原因：<br/>
                       1. 姓氏过于生僻，未录入数据库。<br/>
                       2. 在观测(选择)过程中发生了误操作。<br/>
                       <span className="text-[#00ff00] block mt-2">建议：尝试切换模式或重新观测。</span>
                     </p>
                   </div>
                 ) : (
                   <div className="relative">
                     {/* The Name - Huge, Vertical or Horizontal depending on length */}
                     <h1 className={`
                       font-serif font-black text-white leading-none
                       ${isCompound ? 'text-7xl md:text-8xl' : 'text-9xl md:text-[10rem]'}
                       ${!isCompound ? 'md:writing-vertical-rl' : ''} 
                     `}
                     style={{textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 4px 4px 0px #ff5f00'}}
                     >
                       {finalSurname}
                     </h1>
                     {/* Decorative Japanese/Tech Text */}
                     <div className="absolute -right-4 top-0 text-[#333] font-mono text-xs writing-vertical-rl h-full hidden md:block">
                        真名确立_CONFIRMED
                     </div>
                   </div>
                 )}
                 {/* Corner markers */}
                 <div className="absolute top-0 left-0 w-4 h-4 bg-white"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#ff5f00]"></div>
              </div>
              <div className="mt-4 text-center font-mono text-sm text-stone-300">
                {isUnknown ? "样本偏差" : "观测对象确认"}
              </div>
           </div>

           {/* Details / History - Steins;Gate Terminal Style */}
           <div className="w-full md:w-1/2 font-mono text-sm">
             {!isUnknown && (
               <div className="border-l-2 border-[#00ff00] pl-4 md:pl-6 space-y-8 bg-black/50 p-4">
                 <div>
                   <h3 className="text-[#00ff00] font-bold mb-3 flex items-center gap-2 text-base">
                     <Zap className="w-5 h-5" /> 起源数据 (ORIGIN)
                   </h3>
                   {/* Increased font size, removed italic, brighter color */}
                   <div className="text-white text-lg leading-relaxed text-justify not-italic">
                      {/* Parse the specific bracket format */}
                      {aiInsight.split('【起源】')[1]?.split('【寄语】')[0]?.trim()}
                   </div>
                 </div>

                 <div>
                   <h3 className="text-[#ff5f00] font-bold mb-3 flex items-center gap-2 text-base">
                     <Radio className="w-5 h-5" /> 诗意序列 (POEM)
                   </h3>
                   {/* Increased font size, removed italic */}
                   <div className="text-white text-xl not-italic border border-stone-600 p-6 bg-[#0a0a0a]/80 tracking-wide shadow-lg">
                      {aiInsight.split('【寄语】')[1]?.trim().split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                   </div>
                 </div>
               </div>
             )}

             {/* Actions */}
             <div className="mt-12 flex flex-col gap-3">
               <button
                  onClick={handleRestart}
                  className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#00ff00] hover:text-black transition-colors shadow-lg"
               >
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> 再次观测
                  </span>
               </button>
               
               <button
                  onClick={() => setGameState(GameState.INTRO)}
                  className="w-full py-3 bg-black/60 border border-stone-500 text-stone-300 font-bold uppercase tracking-widest hover:border-white hover:text-white transition-colors backdrop-blur-sm"
               >
                  <span className="flex items-center justify-center gap-2">
                    <Power className="w-4 h-4" /> 中止行动 / 返回
                  </span>
               </button>
             </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ff5f00] selection:text-black font-serif overflow-hidden">
      <div className="scanlines"></div>
      <BackgroundGears />
      <DivergenceMeter />
      
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        {gameState === GameState.INTRO && renderIntro()}
        {gameState === GameState.PLAYING && (
           <Card
            surnames={cardData[currentCardIndex] || []}
            cardNumber={currentCardIndex + 1}
            totalCards={TOTAL_CARDS}
            onAnswer={handleAnswer}
            onBack={handleBack}
            canGoBack={currentCardIndex > 0}
            subtitle={gameMode === 'rare' ? '模式：生僻' : '模式：常用'}
          />
        )}
        {gameState === GameState.RESULT && renderResult()}
      </div>
    </div>
  );
};

export default App;