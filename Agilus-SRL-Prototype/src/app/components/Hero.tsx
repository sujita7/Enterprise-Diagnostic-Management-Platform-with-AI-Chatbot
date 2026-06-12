import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Search } from 'lucide-react';
import { colors } from '../../colors';
import banner01 from '../../assets/icons/banner_001.svg';
import banner1 from '../../assets/icons/banner001.svg';
import banner2 from '../../assets/icons/banner002.svg';
import banner3 from '../../assets/icons/banner003.svg';
import home from '../../assets/icons/home.svg';
import digital from '../../assets/icons/digital_report.svg';
import location from '../../assets/icons/location_outline.svg';

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [value, setValue] = useState("");

  // Typing animation states
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const banners = [banner1, banner2, banner3];
  const placeholderWords = ["Test", "Packages", "Health concern"];

  // Typing Animation Effect
  useEffect(() => {
    const currentWord = placeholderWords[placeholderIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentWord.substring(0, typedText.length + 1));

        if (typedText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setTypedText(currentWord.substring(0, typedText.length - 1));

        if (typedText === "") {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholderWords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, placeholderIndex]);

  // Carousel effect
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    onSelect();
    
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative w-full bg-[#f8f9fa] pb-6 lg:pb-40 pt-2 lg:pt-6">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 relative">
        
        {/* Banner Carousel */}
        <div className="relative rounded-2xl overflow-visible lg:overflow-hidden shadow-sm w-full bg-white lg:bg-gray-200">
          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex w-full touch-pan-y">
              {banners.map((banner, index) => (
                <div
                  className={`flex-[0_0_100%] min-w-0 relative fade-slide ${
                    index === selectedIndex ? 'active' : ''
                  }`}
                  key={index}
                >
                  <img
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[220px] md:h-[350px] lg:h-auto object-fill lg:object-cover block transition-opacity duration-300 lg:min-h-[200px] rounded-2xl lg:rounded-none"
                    loading="eager"
                    decoding="async"
                    style={{
                      maxHeight: '450px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Dots */}
          <div className="absolute -bottom-6 lg:bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10 w-full justify-center">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex ? 'bg-blue-600 lg:bg-blue-600 scale-125' : 'bg-gray-300 lg:bg-white/70'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Trust Pills (Under Banner & Dots) */}
        <div className="flex lg:hidden items-center justify-between md:justify-center gap-2 md:gap-4 w-full mt-10 px-4 md:px-8 flex-wrap">
          <div className="flex flex-col md:flex-row items-center justify-center flex-1 md:flex-initial py-1.5 md:py-2 px-0.5 md:px-4 bg-white border border-[#0076BC] rounded md:rounded-md shadow-sm h-[60px] md:h-auto md:min-h-0">
            <img src={home} alt="Home" className="w-4 md:w-4 h-4 md:h-4 mb-1 md:mb-0 md:mr-2 object-contain" />
            <span className="text-[9px] md:text-[13px] font-medium text-[#0076BC] md:text-gray-700 whitespace-normal md:whitespace-nowrap text-center md:text-left leading-tight md:leading-none">Home<span className="md:hidden"><br/></span><span className="hidden md:inline"> </span>Collection</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center flex-1 md:flex-initial py-1.5 md:py-2 px-0.5 md:px-4 bg-white border border-[#0076BC] rounded md:rounded-md shadow-sm h-[60px] md:h-auto md:min-h-0">
            <img src={digital} alt="digital" className="w-4 md:w-4 h-4 md:h-4 mb-1 md:mb-0 md:mr-2 object-contain" />
            <span className="text-[9px] md:text-[13px] font-medium text-[#0076BC] md:text-gray-700 whitespace-normal md:whitespace-nowrap text-center md:text-left leading-tight md:leading-none">NABL<span className="md:hidden"><br/></span><span className="hidden md:inline"> </span>Accredited</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center flex-1 md:flex-initial py-1.5 md:py-2 px-0.5 md:px-4 bg-white border border-[#0076BC] rounded md:rounded-md shadow-sm h-[60px] md:h-auto md:min-h-0">
            <img src={digital} alt="digital" className="w-4 md:w-4 h-4 md:h-4 mb-1 md:mb-0 md:mr-2 object-contain" />
            <span className="text-[9px] md:text-[13px] font-medium text-[#0076BC] md:text-gray-700 whitespace-normal md:whitespace-nowrap text-center md:text-left leading-tight md:leading-none">Digital<span className="md:hidden"><br/></span><span className="hidden md:inline"> </span>Reports</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center flex-1 md:flex-initial py-1.5 md:py-2 px-0.5 md:px-4 bg-white border border-[#0076BC] rounded md:rounded-md shadow-sm h-[60px] md:h-auto md:min-h-0">
            <img src={location} alt="location" className="w-4 md:w-4 h-4 md:h-4 mb-1 md:mb-0 md:mr-2 object-contain" />
            <span className="text-[9px] md:text-[13px] font-medium text-[#0076BC] md:text-gray-700 whitespace-normal md:whitespace-nowrap text-center md:text-left leading-tight md:leading-none">PAN<span className="md:hidden"><br/></span><span className="hidden md:inline"> </span>India</span>
          </div>
        </div>

        {/* Floating Search + Trust Pills Card */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 -bottom-24 lg:-bottom-12 w-[calc(100%-48px)] max-w-[1000px] z-10">
          <div className="backdrop-blur-sm bg-white/30 lg:bg-white/30 bg-white rounded-2xl p-4 lg:p-6 flex flex-col items-center shadow-lg border border-white/50 lg:border-transparent">
            
            {/* Search Bar */}
            <div className="w-full relative shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded bg-white flex items-center h-[52px] border border-[#0076BC] focus-within:border-blue-400 transition-all mb-3 overflow-hidden">
              <div className="flex-1 flex items-center h-full px-4 text-sm relative">
                <Search className="w-4 h-4 text-gray-400 mr-2" />

                {!value && (
                  <div className="absolute left-10 text-sm pointer-events-none flex">
                    <span className="text-gray-400">search for "</span>
                    <span style={{ color: colors.placeholder }}>
                      {typedText}
                    </span>
                    <span className="text-gray-400">"</span>
                  </div>
                )}

                <input 
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Trust Pills */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-center w-full mt-2">
              <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white border border-[#0076BC] rounded-md shadow-sm text-[10px] md:text-[14px] font-medium text-gray-700 whitespace-nowrap">
                <img src={home} alt="Home" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Home Collection
              </div>
              <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white border border-[#0076BC] rounded-md shadow-sm text-[10px] md:text-[14px] font-medium text-gray-700 whitespace-nowrap">
                <img src={digital} alt="digital" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                NABL Accredited
              </div>
              <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white border border-[#0076BC] rounded-md shadow-sm text-[10px] md:text-[14px] font-medium text-gray-700 whitespace-nowrap">
                <img src={digital} alt="digital" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Digital Reports
              </div>
              <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white border border-[#0076BC] rounded-md shadow-sm text-[10px] md:text-[14px] font-medium text-gray-700 whitespace-nowrap">
                <img src={location} alt="location" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                PAN India
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Fade Slide CSS */}
      <style>{`
        .fade-slide {
          transition: opacity 0.7s ease-in-out;
          opacity: 0.3; /* default semi-transparent */
        }

        .fade-slide.active {
          opacity: 1; /* fully visible when active */
        }
      `}</style>
    </section>
  );
}