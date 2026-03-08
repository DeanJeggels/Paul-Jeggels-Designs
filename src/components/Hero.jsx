import React, { useState } from 'react';
import { ArrowRight, Image, Tag, User, Wrench } from 'lucide-react';
import NavCard from './NavCard';
import CustomBuilder from './CustomBuilder';

const Hero = () => {
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <div className="relative w-full h-screen bg-pjd-dark overflow-hidden font-sans">
        {isBuilderOpen && <CustomBuilder onClose={() => setIsBuilderOpen(false)} />}
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
         <img 
            src="/images/paul_jeggels_shaping_5.jpg" 
            alt="Paul Jeggels Shaping" 
            className="w-full h-full object-cover opacity-60"
         />
         {/* Gradient Overlay for better text readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-pjd-dark/90 via-pjd-dark/40 to-black/30"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between container mx-auto px-4 py-6 md:py-12">
        
        {/* Header / Logo Area */}
         <div className="flex items-center gap-4">
             <img src="/images/pjd_logo.jpeg" alt="PJD Logo" className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/20 shadow-lg object-contain bg-white transition-transform hover:scale-105" />
         </div>

         {/* Main Hero Content */}
         <div className="flex flex-col gap-8 md:gap-12 lg:mb-8">
            
            {/* Headline Group */}
            <div className="max-w-4xl mt-auto">
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-lg">
                 Hand-Shaped <br/> Custom Surfboards.
               </h1>
               <p className="text-lg md:text-2xl text-gray-100 font-light max-w-2xl drop-shadow-md">
                 Built for your specific weight, height, and wave conditions.
               </p>
            </div>

            {/* Action Deck (Floating Container) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full">
               
               {/* Primary Block: Request Quote / Builder */}
               <div className="col-span-1 lg:col-span-7 bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-sm shadow-2xl flex flex-col justify-center min-h-[200px]">
                  <h2 className="text-pjd-teal text-xs font-bold tracking-[0.2em] uppercase mb-4 md:mb-6">Start Your Journey</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <button 
                        onClick={() => setIsBuilderOpen(true)}
                        className="bg-pjd-teal text-pjd-cream font-bold px-8 py-6 rounded-sm hover:bg-pjd-cream transition-colors flex flex-col items-start gap-1 group shadow-lg"
                     >
                       <span className="flex items-center gap-2">
                         CUSTOM BUILDER <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </span>
                       <span className="text-xs font-normal opacity-75">I know my dimensions</span>
                     </button>

                     <button className="bg-white/20 text-white border border-white/20 font-bold px-8 py-6 rounded-sm hover:bg-pjd-cream/30 transition-colors flex flex-col items-start gap-1 group shadow-lg">
                       <span className="flex items-center gap-2">
                         HELP ME CHOOSE <User className="w-4 h-4" />
                       </span>
                       <span className="text-xs font-normal opacity-75">Expert advice for new boards</span>
                     </button>
                  </div>
               </div>

               {/* Secondary Blocks: Nav Grid */}
               <div className="col-span-1 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <NavCard title="Gallery" subtitle="Latest shapes" icon={Image} href="#" />
                   <NavCard title="Stock" subtitle="Pre-loved boards" icon={Tag} href="#" />
                   <NavCard title="About" subtitle="The Shaper" icon={User} href="#" />
                   <NavCard title="Repairs" subtitle="Ding repair service" icon={Wrench} href="#" />
               </div>

            </div>

         </div>
      </div>
    </div>
  );
};

export default Hero;
