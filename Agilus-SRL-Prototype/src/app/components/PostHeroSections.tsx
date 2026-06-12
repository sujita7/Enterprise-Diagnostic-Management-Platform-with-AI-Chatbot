import React from 'react';
import { colors } from '../../colors';
import searchIcon from '../../assets/icons/serach_icon.svg';
import prescriptionIcon from '../../assets/icons/prescription.svg';
import bodycheckupIcon from '../../assets/icons/body_checkups.svg';
import supportIcon from '../../assets/icons/support.svg';
import reportIcon from '../../assets/icons/digital_report.svg';
import locationIcon from '../../assets/icons/location_outline.svg';
import homeIcon from '../../assets/icons/home.svg';
import image from '../../assets/icons/image_1.svg';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import discountPill from '../../assets/icons/discount_pill.svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../../store/packageSlice';
import { addToCart } from '../../store/cartSlice';

function AnimatedCounter({ end, duration = 2500, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * end));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function PostHeroSections() {
  const dispatch = useDispatch();
  const { packages } = useSelector((state: any) => state.packages);
  const cartItems = useSelector((state: any) => state.cart?.items || []);

  const [activeCategory, setActiveCategory] = useState("Full Body");
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  useEffect(() => {
    dispatch(fetchPackages() as any);
  }, [dispatch]);

  const categories = ["Full Body", "Diabetes", "Thyroid", "Women's Care", "Men's Care", "Senior Care"];

  const activePackages = packages.filter((pkg: any) => {
    if (activeCategory === "Women's Care") {
      return pkg.category === "Women's Care" || pkg.category === "Women's Health";
    }
    return pkg.category === activeCategory;
  });

  
  // Total items = packages + 1 View More card
  const totalItems = (activePackages?.length || 0) + 1;

  // Using trimSnaps to ensure no empty space at the end of sections
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start', 
    containScroll: 'trimSnaps',
    slidesToScroll: 1
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const targetIndex = useRef(0);

  const onSelect = useCallback((emblaApi: any) => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    const snaps = emblaApi.scrollSnapList();
    
    if (currentIndex < snaps.length - 1) {
      setSelectedIndex(currentIndex);
      targetIndex.current = currentIndex;
    }

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext() || targetIndex.current < totalItems - 1);
  }, [totalItems]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
  if (!emblaApi) return;

  emblaApi.reInit();
  emblaApi.scrollTo(0, true);

  targetIndex.current = 0;
  setSelectedIndex(0);

  setCanScrollPrev(false);
  setCanScrollNext(totalItems > 1);

}, [emblaApi, activeCategory, totalItems]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi || selectedIndex === 0) return;
    const nextIndex = Math.max(0, selectedIndex - 1);
    setSelectedIndex(nextIndex);
    targetIndex.current = nextIndex;
    emblaApi.scrollTo(nextIndex);
  }, [emblaApi, selectedIndex]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || selectedIndex === totalItems - 1) return;
    const nextIndex = Math.min(totalItems - 1, selectedIndex + 1);
    setSelectedIndex(nextIndex);
    targetIndex.current = nextIndex;
    emblaApi.scrollTo(nextIndex);
  }, [emblaApi, selectedIndex, totalItems]);

  return (
    <div className="w-full bg-white font-sans flex flex-col items-center">
      
      {/* Most-Booked Health Packages */}
      <div className="w-full bg-gray-200 lg:bg-transparent pt-10 lg:pt-0 pb-4 lg:pb-0 border-b border-gray-300 lg:border-none">
        <div className="max-w-[1280px] mx-auto w-full px-6 mb-4 lg:mb-20 relative group">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-[24px] lg:text-[34px] font-bold text-black tracking-tight mb-2 lg:mb-3">Most-Booked Health Packages</h2>
          <p className="text-[14px] lg:text-[22px] text-gray-800 font-medium">Explore by Health Concern</p>
        </div>
        
        {/* Category row: scrollable single row on mobile, wrapped on tablet, full on desktop */}
        <div className="flex flex-nowrap overflow-x-auto lg:flex-wrap lg:flex-nowrap justify-start lg:justify-center gap-2 lg:gap-4 mb-8 lg:mb-10 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
           {categories.map((category, idx) => (
             <button 
               key={category} 
               onClick={() => setActiveCategory(category)}
               className={`whitespace-nowrap flex-shrink-0 px-3 py-1 lg:px-6 lg:py-2 rounded-lg border text-[11px] lg:text-base font-medium transition-all duration-300
                 ${activeCategory === category 
                   ? 'border-[#0076BC] bg-[#EEF6FE] text-[#0076BC] shadow-sm' 
                   : 'border-gray-300 bg-white text-gray-600 hover:border-[#0076BC] hover:text-[#0076BC]'
               }`}
             >
                {category}
             </button>
           ))}
        </div>
        
        <div className="relative overflow-visible">
          {/* Edge Overlays (Translucent Gradient, No Blur) */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[80px] z-10 pointer-events-none bg-gradient-to-r from-white via-white/40 to-transparent"></div>
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[80px] z-10 pointer-events-none bg-gradient-to-l from-white via-white/40 to-transparent"></div>

          {/* Custom Navigation Arrows (Oui Style - 36px) */}
          <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="oui-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0C1E40" />
                <stop offset="100%" stopColor="#16458B" />
              </linearGradient>
            </defs>
          </svg>

          <button 
            onClick={scrollPrev}
            className="absolute left-[-8px] lg:left-[-50px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 hidden lg:flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none group"
            aria-label="Previous"
            disabled={selectedIndex === 0}
          >
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full drop-shadow-sm group-hover:drop-shadow-md transition-all">
              <circle cx="19" cy="19" r="18.5" fill="white" stroke="url(#oui-arrow-gradient)" />
              <path d="M22 13L16 19L22 25" stroke="#0076BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button 
            onClick={scrollNext}
            className="absolute right-[-8px] lg:right-[-50px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 hidden lg:flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none group"
            aria-label="Next"
            disabled={selectedIndex === totalItems - 1}
          >
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full drop-shadow-sm group-hover:drop-shadow-md transition-all">
              <circle cx="19" cy="19" r="18.5" fill="white" stroke="url(#oui-arrow-gradient)" />
              <path d="M16 13L22 19L16 25" stroke="#0076BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div 
            className="overflow-hidden w-full py-6 -my-2" 
            ref={emblaRef}
          >
            <div className="flex items-stretch -ml-3 lg:-ml-8">
              {/* Combine packages with a View More card */}
              {[...activePackages, { type: 'view-more' }].map((pkg, index) => {
                const isLast = index === totalItems - 1;
                
                if (pkg.type === 'view-more') {
                  return (
                    <div
                      key="view-more"
                      className="flex-[0_0_100%] md:flex-[0_0_350px] lg:flex-[0_0_400px] w-full pl-3 md:pl-6 lg:pl-8 lg:pr-0"
                    >
                      <div className="ml-3 mr-1 lg:mx-0 bg-white border border-gray-100 rounded-2xl lg:rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.25)] relative h-full flex flex-col items-center justify-center p-4 lg:p-8 bg-[#F8FAFC]/50 group cursor-pointer transition-all duration-300 hover:shadow-lg">
                        <button className="px-6 py-2.5 bg-[#0076BC] text-white rounded-xl font-bold text-sm hover:bg-[#0A366B] transition-colors shadow-md group-hover:scale-105 transition-transform">
                          View All
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`flex-[0_0_100%] md:flex-[0_0_350px] lg:flex-[0_0_400px] w-full pl-3 md:pl-6 lg:pl-8 lg:pr-0 ${isLast ? 'mr-[40px]' : ''}`}
                  >
                    <div className="ml-3 mr-1 lg:mx-0 bg-white border border-gray-100 rounded-2xl lg:rounded-2xl shadow-sm relative h-full flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
                      {pkg.discount && (
                        <img
                          src={discountPill}
                          alt="Discount"
                          className="absolute top-[-25px] right-[-20px] w-16 h-auto z-20 drop-shadow-md"
                        />
                      )}

                      <div className="bg-gradient-to-r from-[#0C1E40] to-[#16458B] p-4 lg:p-6 text-white flex justify-between items-start h-[80px] lg:h-[110px] rounded-t-2xl">
                        <h3 className="font-bold text-[14px] max-w-[65%] leading-[1.2] tracking-tight">
                          {pkg.title}
                        </h3>
                        <div className="text-right whitespace-nowrap">
                          <div className="text-[11px] text-blue-200/70 line-through mb-0.5">
                            ₹ {pkg.originalPrice}
                          </div>
                          <div className="font-bold text-[18px] leading-none">
                            ₹ {pkg.price}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 lg:p-6 flex-1 flex flex-col justify-between bg-[#F8FAFC] rounded-b-2xl">
                        <div className="flex items-start gap-2 lg:gap-4 mb-3 lg:mb-6">
                          <div className="flex items-start gap-1.5 lg:gap-2.5 flex-1 bg-white p-2 lg:p-3.5 rounded-xl border border-gray-50 shadow-sm">
                            <img src={reportIcon} alt="parameters" className="w-[14px] lg:w-[18px] h-[14px] lg:h-[18px] mt-0.5 opacity-60" />
                            <span className="text-[10px] lg:text-[12px] text-gray-700 leading-tight font-medium">
                              {pkg.params} parameter<br />include
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5 lg:gap-2.5 flex-1 bg-white p-2 lg:p-3.5 rounded-xl border border-gray-50 shadow-sm">
                            <img src={homeIcon} alt="reports time" className="w-[14px] lg:w-[18px] h-[14px] lg:h-[18px] mt-0.5 opacity-60" />
                            <span className="text-[10px] lg:text-[12px] text-gray-700 leading-tight font-medium">
                              Reports within<br />{pkg.time} hours
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-3 w-full mt-auto">
                          <button onClick={() => (window as any).appNavigate('/package/' + pkg.id)} className="flex-1 py-1.5 lg:py-3 border border-[#0076BC] text-[#0076BC] rounded-md lg:rounded-xl font-bold text-[10px] lg:text-[14px] hover:bg-blue-50 transition-colors bg-white">
                            View Details
                          </button>
                          {(() => {
                            const isAdded = cartItems.some((item: any) => item.type === 'package' && String(item.id) === String(pkg.id));
                            const handleAddToCart = () => {
                              dispatch(addToCart({
                                id: pkg.id,
                                name: pkg.name || pkg.title,
                                price: Math.round(Number(pkg.price)),
                                originalPrice: Math.round(Number(pkg.originalPrice)),
                                type: 'package'
                              }));
                            };
                            return (
                              <button 
                                onClick={handleAddToCart}
                                className={`flex-1 py-1.5 lg:py-3 rounded-md lg:rounded-xl font-bold text-[10px] lg:text-[14px] transition-colors ${
                                  isAdded 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-[#0076BC] hover:bg-[#0A366B] text-white'
                                }`}
                              >
                                {isAdded ? 'Added' : 'Add to cart'}
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Animated Bubble Pagination (Water Drop Style) */}
<div className="flex justify-center items-center gap-2 mt-4 lg:mt-10 h-10 overflow-x-auto pb-2 scrollbar-none">
  {Array.from({ length: totalItems }).map((_, index) => {
    const isActive = index === selectedIndex;

    return (
      <button
        key={index}
        onClick={() => {
          setSelectedIndex(index);
          targetIndex.current = index;
          emblaApi?.scrollTo(index);
        }}
        className="flex items-center justify-center outline-none touch-none"
      >
        <motion.div
          initial={false}
          animate={{
            width: isActive ? 50 : 10,
            height: isActive ? 28 : 10,
            borderRadius: 999,
            backgroundColor: isActive ? "#071E40" : "#D1D5DB",
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            borderRadius: { duration: 0 } // Ensure it stays rounded immediately
          }}
          className="flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.span
                key="text"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="text-white text-[11px] font-bold px-3"
              >
                {index + 1}/{totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </button>
    );
  })}
</div>
        </div>
      </div>
      </div>

      {/* What brings you here today? */}
      <div 
        className="w-full py-8 lg:py-16 flex flex-col items-center bg-white relative overflow-hidden"
      >
        {/* ✅ SAME smooth gradient overlay */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-[110%] z-0 bg-[linear-gradient(to_bottom,rgba(207,233,249,0)_0%,rgba(207,233,249,0.6)_20%,rgba(207,233,249,0.8)_50%,rgba(207,233,249,0.6)_80%,rgba(207,233,249,0)_100%)]"></div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-[24px] lg:text-[60px] font-bold text-gray-900 mb-2 text-center leading-tight">What brings you here today?</h2>
          <p className="text-gray-700 mb-6 lg:mb-10 text-[14px] lg:text-[20px] text-center">Choose your path to better health</p>
          
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 lg:gap-6 max-w-[1432px] px-3 lg:px-6 w-full justify-center mx-auto">
            <div className="bg-white rounded-xl p-2.5 lg:p-5 w-full lg:w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-[72px] lg:h-[90px] justify-center items-center lg:items-start text-center lg:text-left relative">
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 w-full">
                <div className="flex-shrink-0 w-5 h-5 lg:w-5 lg:h-5 text-gray-600">
                  <img src={searchIcon} alt="search" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-[11px] lg:text-[16px] text-gray-900 leading-tight lg:leading-none">I know my test</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2.5 lg:p-5 w-full lg:w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-[72px] lg:h-[90px] justify-center items-center lg:items-start text-center lg:text-left relative">
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 w-full">
                <div className="flex-shrink-0 w-5 h-5 lg:w-5 lg:h-5 text-gray-600">
                  <img src={prescriptionIcon} alt="upload" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-[11px] lg:text-[16px] text-gray-900 leading-tight lg:leading-none">I have a prescription</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2.5 lg:p-5 w-full lg:w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-[72px] lg:h-[90px] justify-center items-center lg:items-start text-center lg:text-left relative">
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 w-full">
                <div className="flex-shrink-0 w-5 h-5 lg:w-5 lg:h-5 text-gray-600">
                  <img src={bodycheckupIcon} alt="upload" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-[11px] lg:text-[16px] text-gray-900 leading-tight lg:leading-none">I want a full body checkup</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2.5 lg:p-5 w-full lg:w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-[72px] lg:h-[90px] justify-center items-center lg:items-start text-center lg:text-left relative">
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 w-full">
                <div className="flex-shrink-0 w-5 h-5 lg:w-5 lg:h-5 text-gray-600">
                  <img src={supportIcon} alt="upload" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-[11px] lg:text-[16px] text-gray-900 leading-tight lg:leading-none">I need reports or support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1240px] px-4 md:px-6 py-10 md:py-16 mx-auto">
        <div className="bg-[#071930] rounded-[24px] md:rounded-[32px] min-h-0 md:min-h-[520px] text-white relative overflow-hidden flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-16 relative z-10 w-full gap-5 md:gap-8 p-6 md:p-14">
            <div className="flex-1 max-w-sm text-center md:text-left">
              <h2 className="text-[24px] md:text-[38px] font-bold leading-tight mb-3 md:mb-4 text-[#8CBEF0]">Your Trusted<br className="hidden md:block"/>Lab Partner</h2>
              <p className="text-gray-300 text-[14px] md:text-sm leading-relaxed">
                Since 1995, Agilus Diagnostics (formerly SRL) has built a legacy of expertise, experience and trust with patients, doctors, and healthcare providers.
              </p>
            </div>
            <div className="flex-1 max-w-sm relative w-full">
              <div className="w-full aspect-[16/9] bg-gradient-to-tr from-gray-800 to-gray-700 rounded-xl overflow-hidden relative shadow-2xl">
                <img src={image} alt="icon" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#091A3F]/80 rounded-full flex items-center justify-center pl-1 backdrop-blur-sm cursor-pointer hover:bg-[#091A3F] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-8 gap-x-3 md:gap-x-4 w-full relative z-10 px-4 md:px-14 pb-8 md:pb-10">
            {[
              { label: 'Years of Excellence', value: '29+' },
              { label: 'Tests Conducted', value: '30Cr+' },
              { label: 'Labs Nationwide', value: '400+' },
              { label: 'NABL & CAP Accredited', value: '40+' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-[#8CBEF0] mb-1">{stat.value}</div>
                <div className="text-[9px] md:text-xs text-gray-300 tracking-wide uppercase font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
