import { Search, Calendar, FlaskConical, FileText } from "lucide-react";
import React from "react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Choose a Test or Package",
    },
    {
      icon: Calendar,
      title: "Select Slot and Address",
    },
    {
      icon: FlaskConical,
      title: "Sample Collection",
    },
    {
      icon: FileText,
      title: "Access Report Digitally",
    },
  ];

  return (
    <section className="py-10 bg-white relative overflow-hidden">
      <style>{`
        @keyframes drawLine0 {
          0% { width: 0%; opacity: 1; }
          30% { width: 100%; opacity: 1; }
          95% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }

        @keyframes drawLine1 {
          0% { width: 0%; opacity: 0; }
          30% { width: 0%; opacity: 1; }
          60% { width: 100%; opacity: 1; }
          95% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }

        @keyframes drawLine2 {
          0% { width: 0%; opacity: 0; }
          60% { width: 0%; opacity: 1; }
          90% { width: 100%; opacity: 1; }
          95% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }

        @keyframes drawVertical0 {
          0% { height: 0%; opacity: 1; }
          30% { height: 100%; opacity: 1; }
          95% { height: 100%; opacity: 1; }
          100% { height: 100%; opacity: 0; }
        }

        @keyframes drawVertical1 {
          0% { height: 0%; opacity: 0; }
          30% { height: 0%; opacity: 1; }
          60% { height: 100%; opacity: 1; }
          95% { height: 100%; opacity: 1; }
          100% { height: 100%; opacity: 0; }
        }

        @keyframes drawVertical2 {
          0% { height: 0%; opacity: 0; }
          60% { height: 0%; opacity: 1; }
          90% { height: 100%; opacity: 1; }
          95% { height: 100%; opacity: 1; }
          100% { height: 100%; opacity: 0; }
        }

        .animated-horizontal-line {
          height: 1.5px;
          background-color: #0076BC;
          opacity: 0.8;
          position: relative;
          transform-origin: left center;
        }

        .animated-vertical-line {
          width: 1.5px;
          height: 100%;
          background-color: #0076BC;
          opacity: 0.8;
          position: relative;
          margin: 0 auto;
          transform-origin: top center;
        }

        .line-anim-0 { animation: drawLine0 5s ease-in-out infinite; }
        .line-anim-1 { animation: drawLine1 5s ease-in-out infinite; }
        .line-anim-2 { animation: drawLine2 5s ease-in-out infinite; }

        .vertical-line-anim-0 { animation: drawVertical0 5s ease-in-out infinite; }
        .vertical-line-anim-1 { animation: drawVertical1 5s ease-in-out infinite; }
        .vertical-line-anim-2 { animation: drawVertical2 5s ease-in-out infinite; }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10 md:mb-24">
          <h2 className="text-[24px] md:text-[40px] font-bold text-black mb-3">
            How It Works
          </h2>
          <p className="text-[14px] md:text-[20px] text-gray-800 font-medium">
            Simple steps to better health
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full max-w-[1200px] mx-auto relative px-4 md:px-8 gap-0 md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center w-full md:w-[200px] relative z-10 shrink-0 group">
                  <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] rounded-full bg-[#E5F3FB] flex items-center justify-center mb-3 md:mb-8 transition-all duration-300 group-hover:bg-[#d8effb]">
                    <div className="w-[60px] h-[60px] md:w-[110px] md:h-[110px] rounded-full bg-[#C9E7F8] flex items-center justify-center">
                      <div className="w-[40px] h-[40px] md:w-[72px] md:h-[72px] rounded-full bg-[#9FD4F3] flex items-center justify-center shadow-[0_4px_12px_rgba(0,118,188,0.15)]">
                        <Icon
                          className="w-5 h-5 md:w-8 md:h-8 text-black"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-[13px] md:text-[16px] font-bold text-[#0076BC] text-center leading-tight max-w-[220px]">
                    {step.title}
                  </h3>
                </div>

                {index < steps.length - 1 && (
                  <>
                    {/* Mobile vertical connector */}
                    <div className="md:hidden h-8 relative flex items-center justify-center mb-2">
                      <div
                        className={`animated-vertical-line vertical-line-anim-${index}`}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[4px]"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="#0076BC"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Desktop horizontal connector */}
                    <div className="hidden md:block flex-1 mt-[75px] mx-4 relative h-[1.5px]">
                      <div
                        className={`animated-horizontal-line line-anim-${index} h-full`}
                      >
                        <svg
                          width="8"
                          height="12"
                          viewBox="0 0 8 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[4px]"
                        >
                          <path
                            d="M1 1L6 6L1 11"
                            stroke="#0076BC"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}