import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionCard } from '../types';

interface DetailedData {
  chinaSide: string;
  usSide: string;
  hook: string;
}

const DETAILED_CONTENT: Record<string, DetailedData> = {
  '1': {
    chinaSide: 'In China, the "9-9-6" lifestyle is a high-octane race where the office is your primary residence and your coworkers are your only family. It’s driven by a palpable sense of national momentum—the feeling that your cubicle is the engine room of a global superpower.',
    usSide: 'In the US, "Work-Life Balance" is the ultimate cultural myth. You have the freedom to "set boundaries," but you’ll also experience the uniquely American anxiety of performance reviews and the fear that your health insurance might vanish if you don\'t look busy enough during a recession.',
    hook: 'Sacrificing your 20s for a tech empire vs. sacrificing your soul for a 401(k) and a "Casual Friday".'
  },
  '2': {
    chinaSide: 'China is a 24/7 culinary wonderland where a $3 bowl of hand-pulled noodles is a masterclass in flavor delivered to your door in twelve minutes. The "Everywhere App" makes eating out a daily standard rather than a luxury, turning every street corner into a five-star experience for the price of a bus ticket.',
    usSide: 'In the US, dining is a math-heavy ordeal involving 25% mandatory tips and the realization that your $20 "artisan" salad is 90% iceberg lettuce. While the portions are massive, the "Sunday Night Closed" struggle is a real test of the human spirit. You’re essentially paying for the privilege of a booth and a glass of ice water.',
    hook: 'Gourmet street noodles at 3 AM vs. the $20 salad that’s mostly water and disappointment.'
  },
  '3': {
    chinaSide: 'In China, you live in the year 2050. You can teleport between megacities on silent, 350 km/h bullet trains or navigate the city on subways that arrive so frequently you don\'t even check the schedule. Car ownership is a choice, and your phone handles your bike-share or Didi in a single tap.',
    usSide: 'In the US, you live in "The Car Prison." Your life is dictated by the traffic report and an $800 monthly payment for a depreciating asset you hate. Public transit is often a "last resort," leaving you to spend 400 hours a year staring at the bumper of a Ford F-150 while contemplating why the high-speed rail project is still in "planning" since 1996.',
    hook: 'Gliding across the province on a bullet train vs. paying $800 a month to sit in a traffic jam.'
  },
  '4': {
    chinaSide: 'The Chinese system is an academic gauntlet designed to produce human calculators. By age seven, kids have a math foundation that would make a NASA engineer sweat. It’s a culture of "Tiger Parenting" where the Gaokao exam is the final boss, ensuring every student has the grit to survive a corporate boardroom.',
    usSide: 'The US system focuses on "The Vibe"—also known as critical thinking and individual expression. It’s fantastic for producing creative disruptors and future influencers, but the quality is a lottery based on your zip code’s property taxes. You might get a world-class education, or you might get a participation trophy and a vague understanding of long division.',
    hook: 'Mastering the test at age nine vs. mastering the "art of the pivot": Pick your trade-off.'
  },
  '5': {
    chinaSide: 'Dating in China is essentially a family-sponsored merger. Your "Market Value" is calculated by your apartment location and your parents’ retirement plan. In Tier-1 cities, blind dates in parks are basically high-stakes interviews where "Do you own a car?" is a standard icebreaker. It’s efficient, brutal, and surprisingly honest.',
    usSide: 'In the US, dating is an endless "situationship" loop governed by algorithms that prioritize the perfect thirst trap. You have the freedom to date whoever you want, but you’ll likely spend three years "just seeing where it goes" before realizing they don\'t believe in monogamy or paying back Venmo requests. It’s a world of unlimited choices but zero clarity.',
    hook: 'Treating marriage like a real estate transaction vs. an endless cycle of ghosting on Tinder.'
  },
  '6': {
    chinaSide: 'Chinese healthcare is built for speed and volume. You can walk into a top-tier hospital, see a specialist the same day, and get an IV drip for the price of a movie ticket. It’s high-tech and incredibly accessible, though the bedside manner is often a stern "Drink more warm water and stop complaining."',
    usSide: 'The US has the best doctors in the world—if you’re a millionaire. For everyone else, it’s a terrifying financial gamble. You’ll spend six months on a waitlist to see a specialist, only to receive a $50,000 bill because your anesthesiologist was "out of network" during your emergency. It’s world-class care hidden behind a mountain of insurance paperwork.',
    hook: 'A $20 IV drip and a "get over it" attitude vs. a $5,000 ambulance ride for a broken toe.'
  },
  '7': {
    chinaSide: 'In China, "Square Dancing" grandmas are the true rulers of public spaces. Retirement is social and deeply rooted in the family unit. Filial piety means you’ll likely live with three generations under one roof, providing a constant stream of grandchildren to spoil and a community that treats aging as a badge of honor.',
    usSide: 'In the US, retirement is often the "Quiet Luxury" of a Florida village where everyone is over 70 and dinner starts at 4:30 PM. You have your independence and a golf cart, but you’re often isolated from the rest of society, seeing your family only during major holidays when airline prices are low enough for them to visit.',
    hook: 'Being the CEO of a three-generation household vs. the quiet, expensive luxury of a golf-cart community.'
  },
  '8': {
    chinaSide: 'In China, your "Social Credit" is the "Nanny State" version of a video game score. Jaywalk too much or play your music loud on a train, and you might find yourself blocked from buying a high-speed rail ticket. It’s a system that rewards being a "good neighbor," but it comes at the cost of total surveillance.',
    usSide: 'In the US, your "FICO Score" is a mysterious three-digit number that determines if you’re allowed to have a roof over your head. It’s a different brand of surveillance where your "freedom" is directly proportional to how much debt you can successfully manage. One missed payment in 2019 can haunt your ability to buy a car in 2026.',
    hook: 'Losing points for jaywalking vs. losing your house because you missed a credit card payment.'
  }
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  card: DecisionCard | null;
}

const InfoModal: React.FC<Props> = ({ isOpen, onClose, card }) => {
  if (!card) return null;

  const details = DETAILED_CONTENT[card.id] || {
    chinaSide: 'Content loading...',
    usSide: 'Content loading...',
    hook: 'Content loading...'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-5xl h-auto max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all active:scale-90"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="flex-1 p-8 md:p-16 lg:p-20 overflow-y-auto custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-12">
                <header className="space-y-4 text-center">
                  <h2 className="font-tomorrow font-bold text-white text-4xl md:text-7xl tracking-tighter leading-none">
                    {card.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-white/60 font-tomorrow">
                    {card.description}
                  </p>
                </header>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0 relative">
                  {/* China Section */}
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <h4 className="text-[#E60000] font-tomorrow font-semibold uppercase tracking-widest text-lg">In China</h4>
                    <p className="text-xl md:text-2xl leading-[1.78] text-white">
                      {details.chinaSide}
                    </p>
                  </div>

                  {/* VS Separator */}
                  <div className="flex items-center justify-center px-4 md:px-12 py-4 md:py-0 self-stretch">
                    <div className="hidden md:block w-px h-full bg-white/10 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-4 py-4 font-tomorrow font-black italic text-4xl text-white/10 select-none">
                        VS
                      </div>
                    </div>
                    <div className="md:hidden font-tomorrow font-black italic text-4xl text-white/10 select-none">
                      VS
                    </div>
                  </div>

                  {/* US Section */}
                  <div className="flex-1 space-y-6 text-center md:text-right">
                    <h4 className="text-[#3b82f6] font-tomorrow font-semibold uppercase tracking-widest text-lg">In the US</h4>
                    <p className="text-xl md:text-2xl leading-[1.78] text-white">
                      {details.usSide}
                    </p>
                  </div>
                </div>

                <div className="p-10 bg-black/30 rounded-[2.5rem] border border-white/10 text-center">
                  <p className="text-2xl md:text-3xl font-bold italic leading-tight text-white">
                    "{details.hook}"
                  </p>
                </div>

                <div className="flex justify-center pt-6">
                  <button 
                    onClick={onClose}
                    className="bg-white text-[#E60000] font-tomorrow font-bold px-12 py-5 rounded-full text-lg hover:bg-red-50 transition-all active:scale-95 flex items-center gap-3 shadow-xl"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                    Share with friends
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;