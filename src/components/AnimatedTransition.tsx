
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  show,
  children,
  className,
  animationType = 'fade',
  duration = 'normal',
  delay = 0
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  
  useEffect(() => {
    if (show) setShouldRender(true);
    
    let timer: NodeJS.Timeout;
    if (!show && shouldRender) {
      timer = setTimeout(() => setShouldRender(false), 300); // Matches the CSS transition duration
    }
    
    return () => clearTimeout(timer);
  }, [show, shouldRender]);
  
  if (!shouldRender) return null;
  
  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500'
  };
  
  const animationClasses = {
    fade: show ? 'animate-fade-in' : 'animate-fade-out',
    'slide-up': show ? 'animate-slide-up' : 'animate-fade-out translate-y-4',
    'slide-down': show ? 'animate-slide-down' : 'animate-fade-out -translate-y-4',
    scale: show ? 'animate-scale-in' : 'animate-scale-out',
  };
  
  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};
  
  return (
    <div 
      className={cn(
        'transition-all',
        durationClasses[duration],
        animationClasses[animationType],
        className
      )}
      style={delayStyle}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
