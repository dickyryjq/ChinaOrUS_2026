import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Answer = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface Question {
  id: number;
  title: string;
  options: {
    value: Answer;
    text: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "The paycheck paradox",
    options: [
      { value: 'A', text: 'I want a high salary and a "global" career, even if 50% of it goes to rent.' },
      { value: 'B', text: 'I want a massive apartment and $2 street food; I’m over the "rat race."' }
    ]
  },
  {
    id: 2,
    title: "The social battery",
    options: [
      { value: 'C', text: 'I need English-speaking friends, international bars, and zero "alien" stares.' },
      { value: 'D', text: 'I want to learn Mandarin by force and be the only foreigner in the noodle shop.' }
    ]
  },
  {
    id: 3,
    title: "The Saturday vibe",
    options: [
      { value: 'E', text: 'I want to be in a futuristic megacity with neon lights and subways every 60 seconds.' },
      { value: 'F', text: 'I want a city with mountains or lakes nearby and a slower "tea-drinking" pace.' }
    ]
  }
];

const getImageUrl = (id: string) => {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1000`;
};

const CITY_IMAGES: Record<string, string> = {
  "Shanghai": getImageUrl("1474181483307-a45a995300d6"),
  "Beijing": getImageUrl("1541435033-5c74288b9dd3"),
  "Chengdu": getImageUrl("1544670259-22a088898b9e"),
  "Kunming": getImageUrl("1598000547948-43890f845763"),
  "Shenzhen": getImageUrl("1526040671297-3824b20755a7"),
  "Hangzhou": getImageUrl("1523311651478-43306bc809e2"),
  "Qingdao": getImageUrl("1591543301389-c45e54625b0f"),
  "Xiamen": getImageUrl("1521404063617-cc9a9ddaa273"),
  "Guangzhou": getImageUrl("1518173946687-a4c81c78399e")
};

interface ResultData {
  city: string;
  imageUrl: string;
  tagline: string;
  desc: string;
  roast: string;
}

const CityMatchmakerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [copied, setCopied] = useState(false);

  const isFinished = step > QUESTIONS.length;

  const handleSelect = (qId: number, value: Answer) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    setTimeout(() => {
        setStep(prev => prev + 1);
    }, 400);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const result = useMemo((): ResultData => {
    const combo = Object.values(answers).join('');
    
    // Default fallback
    const defaultResult: ResultData = {
      city: "Guangzhou",
      imageUrl: CITY_IMAGES["Guangzhou"],
      tagline: "The culinary master.",
      desc: "You just want to eat and exist in peace.",
      roast: "You're just here for the Dim Sum. We respect the hustle, or lack thereof."
    };

    if (!isFinished) return defaultResult;
    
    if (combo.includes('A') && combo.includes('C') && combo.includes('E')) {
      return {
        city: "Shanghai",
        imageUrl: CITY_IMAGES["Shanghai"],
        tagline: "The global elite.",
        desc: "You want the center of the universe.",
        roast: "You’ll fit in perfectly until you realize nobody speaks English at the local dumpling shop and your 'VPN' is your only personality trait."
      };
    }
    if (combo.includes('B') && combo.includes('D') && combo.includes('F')) {
      return {
        city: "Chengdu",
        imageUrl: CITY_IMAGES["Chengdu"],
        tagline: "The chill specialist.",
        desc: "You found the loophole to a happy life.",
        roast: "Your ambition is low enough to survive here. Just remember: 'Relaxing' is a full-time job, and the spicy oil will claim your soul eventually."
      };
    }
    if (combo.includes('A') && combo.includes('E')) {
      return {
        city: "Shenzhen",
        imageUrl: CITY_IMAGES["Shenzhen"],
        tagline: "The tech pioneer.",
        desc: "You want the future, now.",
        roast: "You'll be surrounded by drones and delivery bots. You won't have a soul, but your internet speed will be 10G."
      };
    }
    
    return defaultResult;
  }, [answers, isFinished]);

  const readinessScore = useMemo(() => {
    const values = Object.values(answers);
    if (values.length === 0) return 0;
    const seed = values.join('').length;
    return 84 + (seed % 15);
  }, [answers]);

  const reset = () => {
    setStep(1);
    setAnswers({});
    onClose();
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    const challengeText = `I'm ${readinessScore}% ready for ${result.city}. Test your survival score: ${url}`;
    navigator.clipboard.writeText(challengeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Guard against out of bounds access during transition
  const currentIdx = Math.max(0, Math.min(step - 1, QUESTIONS.length - 1));
  const currentQuestion = QUESTIONS[currentIdx];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-12 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="absolute inset-0 bg-[#0B0C10]/95 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl h-auto max-h-[98vh] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)'
            }}
          >
            <button 
              onClick={reset}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className={`px-6 md:px-16 text-center ${isFinished ? 'pt-4 md:pt-6 pb-0' : 'pt-8 md:pt-10 pb-2'}`}>
              <h2 className="font-tomorrow font-bold text-white text-xl sm:text-2xl md:text-5xl tracking-tight leading-tight">
                {isFinished ? (
                  <>
                    <span className="text-xs sm:text-base md:text-xl opacity-60 block">You should move to</span>
                    <motion.span 
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl sm:text-4xl md:text-7xl block text-white tracking-tighter"
                    >
                      {result.city}
                    </motion.span>
                  </>
                ) : (
                  <>Which city should <br className="hidden md:block" /> you move to?</>
                )}
              </h2>
            </div>

            <div className="flex-1 p-4 sm:p-8 md:p-16 pt-0 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {!isFinished ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 sm:space-y-10 max-w-3xl mx-auto pt-4 sm:pt-6"
                  >
                    <div>
                      <h4 className="text-lg sm:text-xl md:text-2xl font-tomorrow font-semibold text-white/60 leading-tight mb-4 sm:mb-8">
                        {currentQuestion.title}
                      </h4>
                    </div>

                    <div className="grid gap-4 sm:gap-6">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = answers[step] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSelect(step, opt.value)}
                            className={`group relative flex items-center justify-between gap-4 sm:gap-6 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all text-left ${
                                isSelected 
                                ? "border-white bg-white/10" 
                                : "border-white/10 hover:border-white/30 hover:bg-white/5"
                            }`}
                          >
                            <span className={`text-base sm:text-xl md:text-2xl font-medium transition-colors ${isSelected ? "text-white" : "text-white/80"}`}>
                                {opt.text}
                            </span>
                            {isSelected && (
                                <motion.div 
                                    initial={{ scale: 0 }} 
                                    animate={{ scale: 1 }} 
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>
                                </motion.div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 sm:pt-8">
                        <div className="w-20 sm:w-24">
                            {step > 1 && (
                                <button 
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-white/50 hover:text-white font-tomorrow font-bold transition-colors text-xs sm:text-sm"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                                    Back
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-white/40 text-xs sm:text-sm font-tomorrow mb-2 sm:mb-3">Step {step} of 3</span>
                          <div className="w-24 sm:w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-white" 
                              initial={{ width: 0 }}
                              animate={{ width: `${(step / 3) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-20 sm:w-24" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-3 sm:space-y-4 pt-0 pb-4 sm:pb-8 max-w-4xl mx-auto"
                  >
                    <div className="relative pt-0 flex justify-center">
                      <motion.div 
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative h-40 sm:h-56 md:h-72 w-full max-w-xl group overflow-hidden bg-black/50 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl z-10"
                        style={{
                          clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                          WebkitClipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)'
                        }}
                      >
                        <img 
                          key={result.city}
                          src={result.imageUrl} 
                          alt={result.city}
                          className="w-full h-full object-cover transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-20" />
                      </motion.div>
                    </div>

                    <div className="space-y-2 sm:space-y-4 pt-1 sm:pt-2">
                      <p className="text-sm sm:text-base md:text-xl font-tomorrow font-bold text-white/60">
                        {result.tagline} <span className="text-white">{result.desc}</span>
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-full max-w-[240px] sm:max-w-[280px] p-3 sm:p-6 bg-white/10 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 backdrop-blur-sm text-center">
                        <span className="block text-white/50 text-xs sm:text-sm md:text-base font-tomorrow font-semibold mb-1">Readiness score</span>
                        <span className="text-3xl sm:text-5xl md:text-6xl font-tomorrow font-bold text-white">{readinessScore}%</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-8 bg-[#0B0C10]/80 rounded-[1.5rem] sm:rounded-[2rem] text-white text-left relative overflow-hidden group border border-white/5 shadow-2xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg width="40" height="40" className="sm:w-[60px] sm:h-[60px]" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                      </div>
                      <h4 className="font-tomorrow font-semibold text-[#E60000] text-xs sm:text-sm md:text-base tracking-wide mb-2 sm:mb-3 uppercase italic">The real talk (roast)</h4>
                      <p className="text-base sm:text-xl md:text-2xl text-gray-100 leading-relaxed font-bold italic">
                        "{result.roast}"
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4 pt-1 sm:pt-2">
                      <button 
                        onClick={handleCopyLink}
                        className="w-full bg-white text-[#E60000] font-tomorrow font-bold py-3 sm:py-5 rounded-[1.2rem] sm:rounded-[1.5rem] text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3"
                      >
                        <svg width="18" height="18" className="sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                        {copied ? "Link copied!" : "Share survival score"}
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

export default CityMatchmakerModal;