import React, { useState, useEffect, useCallback } from 'react';
import { Quote } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1758691462848-ba1e929da259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwbWVkaWNhbCUyMHRlY2hub2xvZ3klMjBtb2Rlcm58ZW58MXx8fHwxNzc1NDY5MDY3fDA&ixlib=rb-4.1.0&q=80&w=200',
      text: 'They are great. They did exactly what I needed. The friendly chaps are a real problem solvers. Loved working with them.'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Delhi',
      image: 'https://images.unsplash.com/photo-1631556760585-2e846196d5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFib3JhdG9yeSUyMHNjaWVudGlzdCUyMG1pY3Jvc2NvcGV8ZW58MXx8fHwxNzc1NDY5MDY3fDA&ixlib=rb-4.1.0&q=80&w=200',
      text: 'Awesome services. I am really happy to be here because of their services. I will continue to use their services in the future.'
    },
    {
      name: 'Ananya Iyer',
      location: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1767082090422-2e5aeeba2afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBoZWFsdGglMjB3ZWxsbmVzcyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NzU0NjkwNjh8MA&ixlib=rb-4.1.0&q=80&w=200',
      text: 'By far the best thing about this is the efficient team they\'ve put together. Everyone is so knowledgeable and friendly.'
    },
    {
      name: 'Shubham Sharma',
      location: 'Pune',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc1NDY5MDY3fDA&ixlib=rb-4.1.0&q=80&w=200',
      text: 'Just wow. I knew I was going to get a great service, but they went above and beyond my expectations.'
    },
    {
      name: 'Anjali Menon',
      location: 'Chennai',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU0NjkwNjh8MA&ixlib=rb-4.1.0&q=80&w=200',
      text: 'Very impressed with the accuracy and quick turnaround time. The app makes it so easy to track all family members health records.'
    }
  ];

  const displayTestimonials = [...testimonials, ...testimonials]; // only duplicate once

const [emblaRef, emblaApi] = useEmblaCarousel({ 
  loop: true, 
  align: 'center', 
  skipSnaps: false,
  speed: 5,             // slightly slower for smooth looping
  containScroll: 'trimSnaps', // prevents initial jump
});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isHovered = hoveredIndex !== null;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
  if (isHovered || !emblaApi) return;
  const timer = setInterval(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, 2000);
  return () => clearInterval(timer);
}, [isHovered, emblaApi]);

  return (
    <section className="py-10 md:py-24 bg-gradient-to-b from-[#F5F9FD] to-white overflow-hidden w-full">
      <div className="max-w-[1432px] mx-auto relative">
        <div className="text-center mb-10 relative px-6">
          <h2 className="text-[24px] font-bold text-gray-900 mb-2 relative z-10">
            Trusted by millions across India
          </h2>
          <h3 className="text-[14px] text-gray-700 mb-2 relative z-10">
            Real experience from our customers
          </h3>
          <div className="w-[120px] h-[3px] mx-auto rounded-full relative z-10"
          style={{ backgroundColor: '#0A77FC' }}></div>
        </div>

        <div className="overflow-hidden px-8 py-10" ref={emblaRef}>
          <div className="flex items-center -ml-8">
            {displayTestimonials.map((testimonial, i) => {
              const isActive = i === selectedIndex;
              const isHoveringThis = hoveredIndex === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex-[0_0_auto] w-[300px] md:w-[380px] pl-4 md:pl-8`}
                >
                  <div
                    className={`bg-white p-6 md:p-10 rounded-3xl flex flex-col items-center text-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] mx-auto
                      ${isHoveringThis 
                        ? 'scale-105 opacity-100 z-20 shadow-[0_-8px_30px_rgba(0,118,188,0.2),0_16px_50px_rgba(0,0,0,0.15)]' 
                        : hoveredIndex !== null 
                          ? 'scale-90 opacity-50 shadow-[0_12px_40px_rgba(0,0,0,0.06)]' 
                          : isActive
                            ? 'scale-105 opacity-100 z-10 shadow-[0_-8px_30px_rgba(0,118,188,0.12),0_16px_50px_rgba(0,0,0,0.1)]'
                            : 'scale-90 opacity-60 shadow-[0_12px_40px_rgba(0,0,0,0.06)]'
                      }
                    `}
                  >
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden mb-4 border-2 border-white shadow-md">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-[16px] text-gray-900 mb-6">{testimonial.name}</h4>
                    
                    <div className="relative text-gray-600 text-[14px] leading-relaxed">
                      <div className="absolute -top-6 -left-4 text-gray-100">
                        <Quote className="w-12 h-12 rotate-180 scale-x-[-1]" fill="currentColor" stroke="none" />
                      </div>
                      <p className="relative z-10 leading-[1.6]">
                        {testimonial.text}
                      </p>
                      <div className="absolute -bottom-8 -right-4 text-gray-100">
                        <Quote className="w-12 h-12" fill="currentColor" stroke="none" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}