
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section className={cn('w-full py-16 md:py-24 lg:py-32', className)}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <AnimatedTransition 
            show={true} 
            animationType="fade" 
            className="space-y-2"
          >
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              Intelligent Notes for Video Content
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition 
            show={true} 
            animationType="slide-up" 
            delay={100}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Transform YouTube Videos Into 
              <span className="block text-primary">Comprehensive Study Notes</span>
            </h1>
          </AnimatedTransition>
          
          <AnimatedTransition 
            show={true} 
            animationType="slide-up" 
            delay={200}
            className="max-w-[700px]"
          >
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Instantly convert educational content into structured notes and summaries 
              using advanced AI - perfect for students, researchers, and lifelong learners.
            </p>
          </AnimatedTransition>
          
          <AnimatedTransition 
            show={true} 
            animationType="scale" 
            delay={400}
            className="w-full max-w-sm mx-auto mt-6"
          >
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 bg-white/50 dark:bg-gray-800/30 dark:border-gray-700">
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Videos Analyzed</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 bg-white/50 dark:bg-gray-800/30 dark:border-gray-700">
                <div className="text-2xl font-bold">500K+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Students</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 bg-white/50 dark:bg-gray-800/30 dark:border-gray-700">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </section>
  );
};

export default Hero;
