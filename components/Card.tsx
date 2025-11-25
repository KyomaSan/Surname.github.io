import React, { useMemo } from 'react';
import { RotateCcw, Check, X, Terminal } from 'lucide-react';

interface CardProps {
  surnames: string[];
  cardNumber: number;
  totalCards: number;
  onAnswer: (hasSurname: boolean) => void;
  onBack: () => void;
  canGoBack: boolean;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ 
  surnames, 
  cardNumber, 
  totalCards, 
  onAnswer, 
  onBack, 
  canGoBack, 
  subtitle 
}) => {
  
  const sortedSurnames = useMemo(() => {
    return [...surnames].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  }, [surnames]);

  return (
    <div className="w-full max-w-5xl mx-auto relative z-10">
      {/* Decorative Top Bar - Bleach Style */}
      <div className="flex justify-between items-end mb-2 border-b-2 border-white pb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white bleach-title">
            层级.{cardNumber.toString().padStart(2, '0')}
          </h1>
          <p className="text-[#ff5f00] font-mono text-xs tracking-widest mt-1">
            行动代号：姓氏解密 // {subtitle || '常用模式'}
          </p>
        </div>
        <div className="text-right">
           {/* Brightened label text */}
           <div className="text-xs text-stone-400 font-mono">观测进度</div>
           <div className="text-2xl font-mono text-[#00ff00]">
             {cardNumber}<span className="text-stone-600">/</span>{totalCards}
           </div>
        </div>
      </div>

      {/* Main Container - Sharp Edges, High Contrast */}
      <div className="bg-black border border-[#333] relative">
        {/* Corner Decors - Steins;Gate Tech feel */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff5f00]"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff5f00]"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff5f00]"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff5f00]"></div>

        {/* Content Area */}
        <div className="p-1">
          <div className="bg-[#0a0a0a] border border-[#222] p-4 md:p-8 min-h-[50vh] max-h-[60vh] overflow-y-auto custom-scrollbar relative">
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 pointer-events-none opacity-10" 
                  style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
             </div>

             <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-0 border-t border-l border-[#333] relative z-10">
              {sortedSurnames.map((surname, idx) => (
                <div 
                  key={idx} 
                  // Significantly brightened the text color here (text-stone-300 instead of 400, and font-bold)
                  className="aspect-square flex items-center justify-center text-lg sm:text-xl font-bold text-stone-300 border-r border-b border-[#333] hover:bg-white hover:text-black transition-colors cursor-default select-none group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-75">{surname}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white p-4 md:p-6 bg-black flex gap-4 md:gap-8 items-center justify-center">
            
            {/* Time Leap Button */}
             <button
               onClick={onBack}
               disabled={!canGoBack}
               className={`
                 font-mono text-xs md:text-sm flex flex-col items-center gap-1 group
                 ${canGoBack ? 'text-[#00ff00] hover:text-white cursor-pointer' : 'text-stone-800 cursor-not-allowed'}
               `}
               title="返回上一步"
             >
               <RotateCcw className={`w-6 h-6 ${canGoBack ? 'group-hover:-rotate-180 transition-transform duration-500' : ''}`} />
               <span className="tracking-widest">时间跳跃</span>
             </button>

             <div className="h-10 w-px bg-[#333]"></div>

             {/* Decision Buttons - Sharp, techy */}
             <button
              onClick={() => onAnswer(false)}
              className="flex-1 max-w-[200px] py-4 bg-transparent border border-stone-600 text-stone-400 font-bold hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 uppercase tracking-widest text-sm md:text-base clip-path-slant"
            >
              <span className="flex items-center justify-center gap-2">
                <X className="w-4 h-4" /> 查无此姓
              </span>
            </button>

            <button
              onClick={() => onAnswer(true)}
              className="flex-1 max-w-[200px] py-4 bg-[#ff5f00] border border-[#ff5f00] text-black font-black hover:bg-[#ff8c00] hover:border-[#ff8c00] hover:shadow-[0_0_15px_rgba(255,95,0,0.5)] transition-all active:scale-95 uppercase tracking-widest text-sm md:text-base glitch"
            >
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> 确认存在
              </span>
            </button>
        </div>
      </div>
    </div>
  );
};