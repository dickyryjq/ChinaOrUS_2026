import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Counter from './components/Counter.tsx';
import DecisionCardComponent from './components/DecisionCard.tsx';
import CityMatchmakerModal from './components/CityMatchmakerModal.tsx';
import InfoModal from './components/InfoModal.tsx';
import { DecisionCard } from './types.ts';

const BASE_COUNT = 1248;

const CARDS_DATA: DecisionCard[] = [
  {
    id: '1',
    title: 'Work Culture',
    description: '9-9-6 Hustle vs. Harmony?',
    imageUrl: 'https://images.unsplash.com/photo-1634818462211-ee45fa052941?q=80&w=500&h=500&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Food',
    description: '$3 Masterpiece vs. $20 Disappointment',
    imageUrl: 'https://images.unsplash.com/photo-1563245332-692e899746a8?q=80&w=500&h=500&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Transit',
    description: 'Public Transit vs. "The Car Prison"',
    imageUrl: 'https://images.unsplash.com/photo-1474487056217-76feef30e805?q=80&w=500&h=500&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'K-12 Education',
    description: 'Fancy the "Unbeatable math foundation"?',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=500&h=500&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'The Dating Market',
    description: 'Swipe right or left?',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=500&h=500&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Healthcare',
    description: 'Who cares more?',
    imageUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=500&h=500&auto=format&fit=crop'
  },
  {
    id: '7',
    title: 'Elder Care',
    description: 'Retirement life dilemma',
    imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=500&h=500&auto=format&fit=crop'
  },
  {
    id: '8',
    title: 'Social Credit vs. FICO',
    description: "Who's got your number?",
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=500&h=500&auto=format&fit=crop'
  }
];

const App: React.FC = () => {
  const [hasVoted, setHasVoted] = useState(() => {
    try {
      return localStorage.getItem('china_voted') === 'true';
    } catch {
      return false;
    }
  });
  const [peopleCount, setPeopleCount] = useState(hasVoted ? BASE_COUNT + 1 : BASE_COUNT);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DecisionCard | null>(null);

  const handleCountMeIn = () => {
    if (hasVoted) return;
    
    setPeopleCount(BASE_COUNT + 1);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E60000', '#FFD700', '#FFFFFF']
    });
    setTimeout(() => setIsMatchmakerOpen(true), 800);
  };

  const handleCancelVote = () => {
    setPeopleCount(BASE_COUNT);
    setHasVoted(false);
    try {
      localStorage.setItem('china_voted', 'false');
    } catch (e) {
      console.warn('LocalStorage not available');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const shareData: ShareData = {
      title: 'Ready to move to China?',
      text: 'Check out this site helping people decide on moving to China!',
    };

    if (url.startsWith('http')) {
      shareData.url = url;
    }

    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      const copyText = shareData.url ? `${shareData.text} ${shareData.url}` : shareData.text || '';
      navigator.clipboard.writeText(copyText);
      alert('Link copied to clipboard!');
    }
  };

  const closeMatchmaker = () => {
    setIsMatchmakerOpen(false);
    if (!hasVoted) {
        setHasVoted(true);
        try {
          localStorage.setItem('china_voted', 'true');
        } catch (e) {
          console.warn('LocalStorage not available');
        }
    }
  };

  return (
    <div className="min-h-screen pb-12 md:pb-20 overflow-x-hidden bg-white selection:bg-red-100">
      <header className="px-6 py-4 md:px-8 md:py-6">
        <span className="text-[#E60000] font-tomorrow font-bold text-base md:text-lg italic tracking-tight uppercase">
          READY TO CHINA
        </span>
      </header>

      <section className="relative h-[360px] md:h-[520px] w-full flex items-center px-6 md:px-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)'
          }}
        >
           <div className="absolute top-[15%] left-[5%] opacity-30 scale-150">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
           </div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-tomorrow font-bold text-white leading-[1.05]"
          >
            Ready to move <br /> to China?
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 md:mt-8 h-1.5 md:h-2 w-32 md:w-48 bg-white/30 origin-left"
          />
        </div>
      </section>

      <div className="max-w-4xl mx-auto -mt-20 md:-mt-32 px-6 relative z-20">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          className="bg-white rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-50 p-6 md:p-12 text-center"
        >
          <div className="flex flex-col items-center">
            <Counter target={peopleCount} />
            <h2 className="mt-2 md:mt-4 text-lg md:text-2xl font-tomorrow font-bold text-gray-900 leading-snug">
              people want to move to China
            </h2>

            <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-3 md:gap-4 w-full justify-center items-center">
              {hasVoted ? (
                <button 
                  onClick={handleCancelVote}
                  className="w-full md:w-auto md:min-w-[320px] whitespace-nowrap px-8 py-3 md:py-4 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-tomorrow font-bold rounded-full transition-all duration-300 active:scale-95 text-center text-sm md:text-base"
                >
                  Cancel my move
                </button>
              ) : (
                <button 
                  onMouseEnter={() => setIsBtnHovered(true)}
                  onMouseLeave={() => setIsBtnHovered(false)}
                  onClick={handleCountMeIn}
                  className="w-full md:w-auto md:min-w-[320px] whitespace-nowrap px-8 py-3 md:py-4 bg-[#E60000] hover:bg-[#CC0000] text-white font-tomorrow font-bold rounded-full transition-all duration-300 shadow-lg shadow-red-500/20 active:scale-95 text-center text-sm md:text-base"
                >
                  {isBtnHovered ? "Start drinking warm water 🥰" : "I'm Becoming Chinese"}
                </button>
              )}
              <button 
                onClick={handleShare}
                className="w-full md:w-auto whitespace-nowrap px-8 py-3 md:py-4 border-2 border-[#E60000] text-[#E60000] hover:bg-red-50 font-tomorrow font-bold rounded-full transition-all duration-300 active:scale-95 text-sm md:text-base flex-shrink-0"
              >
                Share with friends
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <section className="bg-white py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-8 md:mb-16">
             <h2 className="text-2xl md:text-5xl font-tomorrow font-bold text-gray-900 uppercase tracking-tight">
               CONVINCE ME
             </h2>
             <div className="mt-2 md:mt-4 h-1 md:h-1.5 w-16 md:w-24 bg-[#E60000]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
            <AnimatePresence>
              {CARDS_DATA.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <DecisionCardComponent 
                    card={card} 
                    onClick={() => setSelectedCard(card)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <CityMatchmakerModal 
        isOpen={isMatchmakerOpen} 
        onClose={closeMatchmaker} 
      />

      <InfoModal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
        card={selectedCard}
      />

      <footer className="bg-white py-8 md:py-12 text-center text-gray-400 text-[10px] md:text-xs">
        <div className="max-w-7xl mx-auto px-8 border-t border-gray-100 pt-8 md:pt-12">
          <p className="tracking-[0.2em] md:tracking-[0.3em] uppercase">&copy; {new Date().getFullYear()} READY TO CHINA. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;