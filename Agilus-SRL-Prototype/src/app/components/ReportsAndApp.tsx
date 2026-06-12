import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import screenshortTop from '../../assets/icons/screenshort_top.svg';
import screenshortBottom from '../../assets/icons/screenshort_bottom.svg';
import mobileScreenshort from '../../assets/icons/mobile_screenshort.svg';
import playstore from '../../assets/icons/PlayStore.svg';
import appstore from '../../assets/icons/AppStore.svg';

export function ReportsAndApp() {
  return (
    <section className="py-10 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6">
        <div className="relative rounded-[32px] bg-[#071930] min-h-0 md:min-h-[520px] flex items-center overflow-hidden md:overflow-visible">
          
          {/* Gradient Background & Glows */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#071930] via-[#0A2647] to-[#071930] rounded-[32px]"></div>
          
          {/* Central Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0076BC] opacity-20 blur-[120px] rounded-full"></div>
          
          
          {/* ✅ Fixed Phone Mockups: Anchored to the relative card container for perfect cross-device alignment */}
          <div className="absolute inset-0 pointer-events-none z-20 hidden md:block">
  
  {/* Top Image */}
  <div className="absolute top-0 right-10 lg:right-40 h-[55%] lg:h-[65%] flex items-start">
    <img 
      src={screenshortBottom} 
      alt="Reports View" 
      className="h-full w-auto drop-shadow-[0_20px_45px_rgba(0,0,0,0.3)] select-none object-contain"
    />
  </div>

  {/* Bottom Image */}
  <div className="absolute bottom-0 left-5 lg:left-20 h-[60%] lg:h-[70%] flex items-end">
    <img 
      src={screenshortTop} 
      alt="Home View" 
      className="h-full w-auto drop-shadow-[0_20px_45px_rgba(0,0,0,0.3)] select-none object-contain"
    />
  </div>

</div>

          {/* Layout Wrapper */}
          <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-rows-2 gap-y-4 md:gap-y-0 p-6 pt-8 pb-6 md:p-14">
            
            {/* 1. Top Left: Content */}
            <div className="flex flex-col justify-start items-start md:pr-12 md:-mt-6 relative z-20">
              <h2 className="text-[24px] md:text-[50px] font-bold text-white mb-2 md:mb-6 leading-[1.1] tracking-tight">
                A Smarter Way to<br />Manage Your Health
              </h2>
              <p className="hidden md:block text-[15px] md:text-[14px] text-[#A6C4E5] leading-relaxed tracking-wide max-w-[420px]">
                The Agilus App brings your entire healthcare ecosystem together — simple, secure, and always accessible.
              </p>
            </div>

            {/* 2. Top Right: Placeholder for grid (phone is absolute now) */}
            <div className="hidden md:block"></div>
            {/* Mobile-only phone view - single screenshot */}
            <div className="md:hidden flex justify-center my-0 -mt-5 -mb-14 relative z-0 pointer-events-none">
               <img src={mobileScreenshort} className="h-[380px] w-auto drop-shadow-2xl" />
            </div>

            {/* 3. Bottom Left: Placeholder for grid (phone is absolute now) */}
            <div className="hidden md:block"></div>
            {/* Empty on mobile - single screenshot shown above */}
            <div className="md:hidden"></div>

            {/* 4. Bottom Right: Features & Buttons */}
            <div className="flex flex-col justify-start items-start md:pl-10 lg:pl-30 pt-0 md:pt-10 order-3 md:order-4 relative z-20">
              <div className="space-y-5 mb-10">
                {[
                  { title: "Instant Reports Access" },
                  { title: "One App for the Whole Family" },
                  { title: "Smart Reminders" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="flex-shrink-0 bg-[#0076BC] rounded-full p-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#0076BC] text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-[12px] md:text-[16px] leading-tight">{item.title}</h3>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.srllimited.srl&hl=en_IN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img src={playstore} alt="Play Store" className="h-10 cursor-pointer hover:scale-105 transition-transform" />
                </a>

                <a 
                  href="https://apps.apple.com/my/app/agilus-diagnostics-blood-test/id840710041" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img src={appstore} alt="App Store" className="h-10 cursor-pointer hover:scale-105 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Glow Layers */}
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#0076BC] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#0076BC] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
          
        </div>
      </div>
    </section>
  );
}