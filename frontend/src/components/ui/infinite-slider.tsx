import { motion } from "motion/react";
import React from "react";

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  reverse?: boolean;
  speed?: number;
  speedOnHover?: number;
  pauseOnHover?: boolean;
}

export function InfiniteSlider({
  children,
  gap = 42,
  reverse = false,
  speed = 50,
  speedOnHover = 10,
  pauseOnHover = false,
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.scrollWidth / 2;
      setContainerWidth(width);
    }
  }, [children]);

  const animateValue = reverse ? containerWidth : -containerWidth;

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={containerRef}
        className="flex"
        style={{ gap: `${gap}px` }}
        animate={{
          x: [0, animateValue]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: pauseOnHover && isHovered ? 999999 : (isHovered ? speedOnHover : speed),
            ease: "linear"
          }
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}