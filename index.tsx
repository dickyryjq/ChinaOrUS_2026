import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- Types ---
interface DecisionCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

// --- Components: Counter ---
interface CounterProps {
  target: number;
}

const Counter: React.FC<CounterProps> = ({ target }) => {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [value, setValue] = useState(0);

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setValue(latest);
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <motion.span className="text-6xl md:text-9xl font-tomorrow font-bold text-[#E60000] leading-none">
      {value.toLocaleString()}
    </motion.span>
  );
};

// --- Components: DecisionCard ---
interface CardProps {
  card: DecisionCard;
  onClick: () => void;
}

const DecisionCardComponent: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group relative bg-white rounded-[2.5rem] py-5 px-6 md:py-8 md:px-12 flex items-center justify-between overflow-hidden cursor-pointer shadow-[0_15px_45px_-10px_rgba(0,0,0,0.08)] border border-gray-100 h-full min-h-[160px] md:min-h-[200px]"
    >
      <div className="relative z-10 flex flex-col justify-center flex-1 pr-4">
        <h3 className="font-tomorrow font-semibold text-xl md:text-2xl text-gray-900 mb-1 md:mb-2 leading-tight">
          {card.title}
        </h3>
        <p className="text-xs md:text-sm lg:text-base text-gray-400 font-medium leading-relaxed">
          {card.description}
        </p>
      </div>

      <div className="relative z-10 w-24 h-24 md:w-48 md:h-40 flex-shrink-0 flex items-center justify-center">
        <img 
          src={card.imageUrl} 
          alt={card.title}
          className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))' }}
        />
      </div>
    </motion.div>
  );
};

// --- Components: InfoModal ---
const DETAILED_CONTENT: Record<string, { chinaSide: string; usSide: string; hook: string }> = {
  '1': {
    chinaSide: 'In China, the "9-9-6" lifestyle is a high-octane race where the office is your primary residence. It’s driven by a palpable sense of national momentum.',
    usSide: 'In the US, "Work-Life Balance" is the ultimate cultural myth. You have the freedom to "set boundaries," but also the uniquely American anxiety of performance reviews.',
    hook: 'Sacrificing your 20s for a tech empire vs. sacrificing your soul for a 401(k) and a "Casual Friday".'
  },
  '2': {
    chinaSide: 'China is a 24/7 culinary wonderland where a $3 bowl of hand-pulled noodles is a masterclass in flavor delivered in twelve minutes.',
    usSide: 'In the US, dining is a math-heavy ordeal involving 25% mandatory tips for an "artisan" salad that is 90% iceberg lettuce.',
    hook: 'Gourmet street noodles at 3 AM vs. the $20 salad that’s mostly water and disappointment.'
  },
  '3': {
    chinaSide: 'In China, you live in the year 2050. Teleport between megacities on silent, 350 km/h bullet trains. Car ownership is a choice.',
    usSide: 'In the US, you live in "The Car Prison." Your life is dictated by the traffic report and an $800 monthly payment for a depreciating asset you hate.',
    hook: 'Gliding across the province on a bullet train vs. paying $800 a month to sit in a traffic jam.'
  },
  '4': {
    chinaSide: 'The Chinese system is an academic gauntlet designed to produce human calculators. By age seven, kids have a math foundation that would make NASA sweat.',
    usSide: 'The US system focuses on "The Vibe"—critical thinking and individual expression. It’s fantastic for disruptors, but quality is a zip code lottery.',
    hook: 'Mastering the test at age nine vs. mastering the "art of the pivot": Pick your trade-off.'
  },
  '5': {
    chinaSide: 'Dating in China is essentially a family-sponsored merger. Your "Market Value" is calculated by apartment location and your parents’ retirement plan.',
    usSide: 'In the US, dating is an endless "situationship" loop governed by algorithms that prioritize the perfect thirst trap and zero clarity.',
    hook: 'Treating marriage like a real estate transaction vs. an endless cycle of ghosting on Tinder.'
  },
  '6': {
    chinaSide: 'Chinese healthcare is built for speed. See a specialist the same day and get an IV drip for the price of a movie ticket. Bedside manner: "Drink more warm water."',
    usSide: 'The US has the best doctors—if you’re a millionaire. For everyone else, it’s a terrifying financial gamble with waitlists and surprise out-of-network bills.',
    hook: 'A $20 IV drip and a "get over it" attitude vs. a $5,000 ambulance ride for a broken toe.'
  },
  '7': {
    chinaSide: 'In China, "Square Dancing" grandmas rule public spaces. Retirement is social and filial piety means three generations often live under one roof.',
    usSide: 'In the US, retirement is the expensive luxury of a Florida village with golf carts and isolation from the rest of society.',
    hook: 'Being the CEO of a three-generation household vs. the quiet luxury of a golf-cart community.'
  },
  '8': {
    chinaSide: 'In China, "Social Credit" is the "Nanny State" version of a video game score. Jaywalk too much and you might lose your high-speed rail privileges.',
    usSide: 'In the US, your "FICO Score" is a mysterious three-digit number that determines if you’re allowed to have a roof over your head.',
    hook: 'Losing points for jaywalking vs. losing your house because you missed a credit card payment.'
  }
};

const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void; card: DecisionCard | null }> = ({ isOpen, onClose, card }) => {
  if (!card) return null;
  const details = DETAILED_CONTENT[card.id] || { chinaSide: '...', usSide: '...', hook: '...' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-5xl h-auto max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col" style={{ background: 'linear-gradient(135deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)' }}>
            <button onClick={onClose} className="absolute top-8 right-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all active:scale-90">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="flex-1 p-8 md:p-16 lg:p-20 overflow-y-auto custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-12">
                <header className="space-y-4 text-center">
                  <h2 className="font-tomorrow font-bold text-white text-4xl md:text-7xl tracking-tighter leading-none">{card.title}</h2>
                  <p className="text-xl md:text-2xl text-white/60 font-tomorrow">{card.description}</p>
                </header>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0 relative">
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <h4 className="text-[#E60000] font-tomorrow font-semibold uppercase tracking-widest text-lg">In China</h4>
                    <p className="text-xl md:text-2xl leading-[1.78] text-white">{details.chinaSide}</p>
                  </div>
                  <div className="flex items-center justify-center px-4 md:px-12 py-4 md:py-0 self-stretch">
                    <div className="md:hidden font-tomorrow font-black italic text-4xl text-white/10 select-none">VS</div>
                    <div className="hidden md:block w-px h-full bg-white/10 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-4 py-4 font-tomorrow font-black italic text-4xl text-white/10 select-none">VS</div></div>
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-right">
                    <h4 className="text-[#3b82f6] font-tomorrow font-semibold uppercase tracking-widest text-lg">In the US</h4>
                    <p className="text-xl md:text-2xl leading-[1.78] text-white">{details.usSide}</p>
                  </div>
                </div>
                <div className="p-10 bg-black/30 rounded-[2.5rem] border border-white/10 text-center">
                  <p className="text-2xl md:text-3xl font-bold italic leading-tight text-white">"{details.hook}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Components: CityMatchmakerModal ---
const QUESTIONS = [
  { id: 1, title: "The paycheck paradox", options: [{ value: 'A', text: 'Global career, even if 50% goes to rent.' }, { value: 'B', text: 'Massive apartment and $2 street food.' }] },
  { id: 2, title: "The social battery", options: [{ value: 'C', text: 'International bars, English friends.' }, { value: 'D', text: 'Learn Mandarin by force, only foreigner.' }] },
  { id: 3, title: "The Saturday vibe", options: [{ value: 'E', text: 'Futuristic megacity with neon lights.' }, { value: 'F', text: 'Mountains, lakes, and "tea-drinking" pace.' }] }
];

const getFinalImageUrl = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1000`;

const STABLE_CITY_IMAGES: Record<string, string> = {
  "Shanghai": getFinalImageUrl("1538428494232-9c0d8a3ab403"),
  "Beijing": getFinalImageUrl("1614555383820-941c466f1b52"),
  "Chengdu": getFinalImageUrl("1723210670026-fee99db90289"),
  "Kunming": getFinalImageUrl("1724458589661-a2f42eb58aca"),
  "Shenzhen": getFinalImageUrl("1636821771168-d13e578a88ba"),
  "Hangzhou": getFinalImageUrl("1664299326174-f73b66496733"),
  "Qingdao": getFinalImageUrl("1721794525689-d2bd76190f1e"),
  "Xiamen": getFinalImageUrl("1720249789878-832ca9256bf4"),
  "Guangzhou": getFinalImageUrl("1636259584602-5a3c9c0d05ff")
};

const CityMatchmakerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const isFinished = step > QUESTIONS.length;
  
  const result = useMemo(() => {
    const combo = Object.values(answers).join('');
    if (combo.includes('A') && combo.includes('C')) return { city: "Shanghai", tagline: "The global elite.", desc: "Center of the universe.", roast: "Your VPN is your only personality trait.", imageUrl: STABLE_CITY_IMAGES["Shanghai"] };
    if (combo.includes('B') && combo.includes('D')) return { city: "Chengdu", tagline: "The chill specialist.", desc: "Loophole to a happy life.", roast: "Spicy oil will claim your soul eventually.", imageUrl: STABLE_CITY_IMAGES["Chengdu"] };
    if (combo.includes('A') && combo.includes('E')) return { city: "Shenzhen", tagline: "The tech pioneer.", desc: "Future is now.", roast: "Don't blink or you'll miss the next startup.", imageUrl: STABLE_CITY_IMAGES["Shenzhen"] };
    if (combo.includes('A') && combo.includes('F')) return { city: "Beijing", tagline: "The historical titan.", desc: "Power and tradition.", roast: "Enjoy the politics with your smog-flavored air.", imageUrl: STABLE_CITY_IMAGES["Beijing"] };
    return { city: "Guangzhou", tagline: "The culinary master.", desc: "Eat and exist in peace.", roast: "You're just here for the Dim Sum.", imageUrl: STABLE_CITY_IMAGES["Guangzhou"] };
  }, [answers]);

  const readinessScore = useMemo(() => 84 + (Object.values(answers).join('').length % 15), [answers]);

  const handleSelect = (qId: number, value: string) => {
    setSelectedOption(value);
    setAnswers(prev => ({ ...prev, [qId]: value }));
    setTimeout(() => {
      setStep(prev => prev + 1);
      setSelectedOption(null);
    }, 450);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setSelectedOption(null); 
    }
  };

  const handleCopyLink = () => {
    const challengeText = `I'm ${readinessScore}% ready for ${result.city}. Test your survival score: ${window.location.href}`;
    navigator.clipboard.writeText(challengeText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const reset = () => { setStep(1); setAnswers({}); onClose(); };

  // Track selection for "Back" button persistence
  const activeSelection = selectedOption || answers[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={reset} className="absolute inset-0 bg-[#0B0C10]/95 backdrop-blur-md" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }} 
            className="relative w-full max-w-5xl h-auto max-h-[98vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col pt-[52px] md:pt-[60px]" 
            style={{ background: 'linear-gradient(135deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)' }}
          >
            <button onClick={reset} className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            <div className="px-6 md:px-16 text-center pt-8 pb-4">
              <h2 className="font-tomorrow font-bold text-white text-xl sm:text-2xl md:text-5xl">{isFinished ? `You should move to ${result.city}` : "Which city should you move to?"}</h2>
            </div>
            
            <div className="flex-1 p-4 sm:p-8 md:p-16 pt-0 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {!isFinished ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.98 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="space-y-6 max-w-3xl mx-auto pt-4"
                  >
                    <h4 className="text-lg md:text-2xl font-tomorrow text-white/60 mb-8">{QUESTIONS[step - 1]?.title}</h4>
                    <div className="grid gap-4">
                      {QUESTIONS[step - 1]?.options.map((opt) => (
                        <button 
                          key={opt.value} 
                          onClick={() => handleSelect(step, opt.value)} 
                          className={`p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border-2 text-white text-left text-base sm:text-xl font-medium transition-all group relative overflow-hidden ${activeSelection === opt.value ? 'border-white bg-white/20' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                        >
                          <motion.span className="relative z-10 block" animate={activeSelection === opt.value ? { scale: 1.02 } : { scale: 1 }}>{opt.text}</motion.span>
                          {activeSelection === opt.value && (
                            <motion.div layoutId="selection" className="absolute inset-0 bg-white/10 pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-12">
                      <div className="w-24">
                        {step > 1 && (
                          <button 
                            onClick={handleBack}
                            className="flex items-center gap-2 text-white/70 hover:text-white font-tomorrow font-bold transition-colors text-sm uppercase tracking-widest"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                            Back
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <span className="text-white font-tomorrow font-bold text-xs md:text-sm mb-4 uppercase tracking-[0.2em]">Step {step} of 3</span>
                        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[#E60000]" 
                            initial={false}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                          />
                        </div>
                      </div>
                      <div className="w-24" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 max-w-4xl mx-auto"
                  >
                    <div className="relative h-48 sm:h-72 w-full max-w-xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl">
                      <img src={result.imageUrl} className="w-full h-full object-cover" alt={result.city} />
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-[240px] p-6 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                        <span className="text-white/50 font-tomorrow text-xs uppercase tracking-widest mb-1 block">Readiness score</span>
                        <span className="text-4xl md:text-6xl font-tomorrow font-bold text-white leading-none">{readinessScore}%</span>
                      </div>
                    </div>

                    <div className="p-8 bg-[#0B0C10]/80 rounded-[2rem] border border-white/5 text-left max-w-2xl mx-auto shadow-inner">
                      <h4 className="font-tomorrow text-[#E60000] uppercase italic text-xs tracking-[0.2em] mb-3">The real talk (roast)</h4>
                      <p className="text-lg md:text-2xl text-white font-bold italic leading-relaxed">"{result.roast}"</p>
                    </div>

                    <div className="max-w-md mx-auto pt-4">
                      <button 
                        onClick={handleCopyLink} 
                        className="w-full bg-white text-[#E60000] font-tomorrow font-bold py-5 rounded-[1.5rem] text-lg hover:bg-gray-100 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                        {copied ? "Link copied!" : "Share with friends"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- App ---
const CARDS_DATA: DecisionCard[] = [
  { id: '1', title: 'Work Culture', description: '9-9-6 Hustle vs. Harmony?', imageUrl: 'https://images.unsplash.com/photo-1634818462211-ee45fa052941?q=80&w=500&h=500&auto=format&fit=crop' },
  { id: '2', title: 'Food', description: '$3 Masterpiece vs. $20 Disappointment', imageUrl: 'https://images.unsplash.com/photo-1563245332-692e899746a8?q=80&w=500&h=500&auto=format&fit=crop' },
  { id: '3', title: 'Transit', description: 'Public Transit vs. "The Car Prison"', imageUrl: 'https://images.unsplash.com/photo-1474487056217-76feef30e805?q=80&w=500&h=500&auto=format&fit=crop' },
  { id: '4', title: 'K-12 Education', description: 'Fancy the "Unbeatable math foundation"?', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=500&h=500&auto=format&fit=crop' },
  { id: '5', title: 'The Dating Market', description: 'Swipe right or left?', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=500&h=500&auto=format&fit=crop' },
  { id: '6', title: 'Healthcare', description: 'Who cares more?', imageUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=500&h=500&auto=format&fit=crop' },
  { id: '7', title: 'Elder Care', description: 'Retirement life dilemma', imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=500&h=500&auto=format&fit=crop' },
  { id: '8', title: 'Social Credit vs. FICO', description: "Who's got your number?", imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=500&h=500&auto=format&fit=crop' }
];

const MainApp: React.FC = () => {
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem('china_voted') === 'true');
  const [peopleCount, setPeopleCount] = useState(hasVoted ? 1249 : 1248);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DecisionCard | null>(null);

  const handleCountMeIn = () => {
    if (hasVoted) return;
    setPeopleCount(1249);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#E60000', '#FFD700', '#FFFFFF'] });
    setTimeout(() => setIsMatchmakerOpen(true), 800);
  };

  const handleShare = () => {
    const shareData = { title: 'Ready to move to China?', text: 'Check out this site!', url: window.location.href };
    if (navigator.share) navigator.share(shareData).catch(e => console.error(e));
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }
  };

  const closeMatchmaker = () => { setIsMatchmakerOpen(false); if (!hasVoted) { setHasVoted(true); localStorage.setItem('china_voted', 'true'); } };

  return (
    <div className="min-h-screen pb-12 bg-white selection:bg-red-100">
      <header className="px-6 py-4"><span className="text-[#E60000] font-tomorrow font-bold italic uppercase">READY TO CHINA</span></header>
      <section className="relative h-[360px] md:h-[520px] flex items-center px-6 md:px-20 overflow-hidden" style={{ background: 'linear-gradient(90deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)' }}>
        <div className="relative z-10 max-w-4xl">
          <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-tomorrow font-bold text-white leading-none">Ready to move <br /> to China?</motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="mt-8 h-2 w-48 bg-white/30 origin-left" />
        </div>
      </section>
      <div className="max-w-4xl mx-auto -mt-20 md:-mt-32 px-6 relative z-20">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-xl shadow-2xl p-6 md:p-12 text-center">
          <Counter target={peopleCount} />
          <h2 className="mt-4 text-xl md:text-2xl font-tomorrow font-bold text-gray-900">people want to move to China</h2>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            {hasVoted ? (
              <button onClick={() => { setHasVoted(false); setPeopleCount(1248); localStorage.setItem('china_voted', 'false'); }} className="w-full md:w-80 px-8 py-4 border-2 border-gray-300 text-gray-600 font-tomorrow font-bold rounded-full transition-all hover:bg-gray-50">Cancel my move</button>
            ) : (
              <button onMouseEnter={() => setIsBtnHovered(true)} onMouseLeave={() => setIsBtnHovered(false)} onClick={handleCountMeIn} className="w-full md:w-80 px-8 py-4 bg-[#E60000] text-white font-tomorrow font-bold rounded-full shadow-lg shadow-red-500/20 transition-all active:scale-95 whitespace-nowrap">{isBtnHovered ? "Start drinking warm water 🥰" : "I'm Becoming Chinese"}</button>
            )}
            <button onClick={handleShare} className="w-full md:w-auto px-8 py-4 border-2 border-[#E60000] text-[#E60000] font-tomorrow font-bold rounded-full transition-all hover:bg-red-50 whitespace-nowrap flex-shrink-0">Share with friends</button>
          </div>
        </motion.div>
      </div>
      <section className="bg-white py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16"><h2 className="text-2xl md:text-5xl font-tomorrow font-bold uppercase text-gray-900">CONVINCE ME</h2><div className="mt-4 h-1.5 w-24 bg-[#E60000]" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CARDS_DATA.map((card, idx) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * idx }}>
                <DecisionCardComponent card={card} onClick={() => setSelectedCard(card)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CityMatchmakerModal isOpen={isMatchmakerOpen} onClose={closeMatchmaker} />
      <InfoModal isOpen={!!selectedCard} onClose={() => setSelectedCard(null)} card={selectedCard} />
      <footer className="py-12 text-center text-gray-400 text-xs border-t border-gray-100"><p className="tracking-widest uppercase">&copy; {new Date().getFullYear()} READY TO CHINA. ALL RIGHTS RESERVED.</p></footer>
    </div>
  );
};

// --- Render ---
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<MainApp />);
}
