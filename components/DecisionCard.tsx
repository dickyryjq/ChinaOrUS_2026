import React from 'react';
import { motion } from 'framer-motion';
import { DecisionCard as DecisionCardType } from '../types';

interface Props {
  card: DecisionCardType;
  onClick: () => void;
}

const DecisionCard: React.FC<Props> = ({ card, onClick }) => {
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

export default DecisionCard;