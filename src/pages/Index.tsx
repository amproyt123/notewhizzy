
import React, { useState } from 'react';
import { SummaryResponse } from '@/types';
import Hero from '@/components/Hero';
import VideoForm from '@/components/VideoForm';
import SummaryResult from '@/components/SummaryResult';

const Index: React.FC = () => {
  const [result, setResult] = useState<SummaryResponse | null>(null);
  
  const handleResult = (newResult: SummaryResponse) => {
    setResult(newResult);
    // Scroll to results after a short delay
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      });
    }, 300);
  };
  
  const handleReset = () => {
    setResult(null);
    // Scroll back to form
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <header className="w-full border-b border-gray-100 backdrop-blur-lg bg-white/80 sticky top-0 z-10">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="font-semibold">VideoNotes</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Testimonials</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">FAQ</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary hidden sm:inline-block transition-colors">
              Sign In
            </a>
            <a href="#" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none">
              Get Started
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <Hero />
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Generating Notes
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Just paste your YouTube video URL and let our AI do the rest
                </p>
              </div>
              
              <VideoForm onResult={handleResult} className="mt-8" />
            </div>
          </div>
        </section>
        
        {result && (
          <section id="results-section" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="space-y-2">
                  <div className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                    Ready to Use
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Your Video Notes
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Comprehensive notes generated from your video content
                  </p>
                </div>
              </div>
              
              <SummaryResult result={result} onReset={handleReset} />
            </div>
          </section>
        )}
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  Why Choose Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Features That Set Us Apart
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform offers unique features designed to enhance your learning experience
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[
                {
                  title: "Advanced AI Summarization",
                  description: "Our AI algorithms extract key information and organize it into coherent, structured notes."
                },
                {
                  title: "Customizable Detail Levels",
                  description: "Choose between concise, detailed, or comprehensive notes based on your learning needs."
                },
                {
                  title: "Instant Processing",
                  description: "Get your notes in seconds, saving hours of manual note-taking and organization."
                },
                {
                  title: "Multiple Export Formats",
                  description: "Download your notes in various formats including Markdown, PDF, and Word."
                },
                {
                  title: "Personal Library",
                  description: "Save all your generated notes in your personal library for easy access anytime."
                },
                {
                  title: "Cross-Platform Compatibility",
                  description: "Access your notes on any device - mobile, tablet, or desktop."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-primary/60 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-6 bg-gray-50 border-t border-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xs">V</span>
                </div>
                <span className="font-semibold text-sm">VideoNotes</span>
              </div>
              <p className="text-sm text-gray-500">
                Smart AI note-taking for video content
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2023 VideoNotes. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
