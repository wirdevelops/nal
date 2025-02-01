'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "full" | "auto";
}

export function ScrollReveal({ children, width = "full" }: ScrollRevealProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={width === "full" ? "w-full" : "w-auto"}
    >
      {children}
    </motion.div>
  );
}
