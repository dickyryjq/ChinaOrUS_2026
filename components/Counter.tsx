import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

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

export default Counter;