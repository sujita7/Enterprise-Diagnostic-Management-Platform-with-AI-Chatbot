import React from 'react';
import { Search, Upload, FileText, Phone } from 'lucide-react';
import searchIcon from '../../assets/icons/serach_icon.svg';
import uploadIcon from '../../assets/icons/digital_report.svg';
import reportIcon from '../../assets/icons/digital_report.svg';
import uploadIcon1 from '../../assets/icons/uploadIcon.svg';
import prescriptionIcon from '../../assets/icons/prescription.svg';

export function FinalCTA() {
  return (
    <section className="py-10 md:py-24 bg-white relative overflow-hidden">

      {/* ✅ SAME smooth gradient overlay like HealthConcerns */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[110%] z-0 bg-[linear-gradient(to_bottom,rgba(207,233,249,0)_0%,rgba(207,233,249,0.6)_20%,rgba(207,233,249,0.8)_50%,rgba(207,233,249,0.6)_80%,rgba(207,233,249,0)_100%)]"></div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-center relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 md:mb-16">
          <h2 className="text-[24px] md:text-[48px] font-bold text-[#071D37] mb-2 md:mb-4 leading-tight">
            Ready to take charge of your health?
          </h2>
          <p className="text-[14px] md:text-[20px] text-gray-800 font-medium">
            Join millions who trust Agilus for their healthcare needs
          </p>
        </div>

        {/* Action Cards Row */}
        <div className="grid grid-cols-1 md:flex md:flex-row items-center gap-3 md:gap-6 max-w-[1432px] px-2 md:px-6 w-full justify-center mb-10 md:mb-24">
          
          {/* Book a Test */}
          <div className="bg-white rounded-xl p-4 md:p-5 w-full md:w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-[70px] md:h-[90px] justify-center items-start md:items-start relative">
            <div className="flex items-center justify-center md:justify-start gap-3 w-full">
              <div className="flex-shrink-0 w-5 h-5 leading-none text-gray-600">
                <img src={searchIcon} alt="search" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[14px] md:text-[16px] text-gray-900 leading-none">Book a Test</span>
              </div>
            </div>
          </div>

          {/* Upload Prescription */}
          <div className="bg-white rounded-xl p-4 md:p-5 w-full md:w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-[70px] md:h-[90px] justify-center items-start md:items-start relative">
            <div className="flex items-center justify-center md:justify-start gap-3 w-full">
              <div className="flex-shrink-0 w-5 h-5 leading-none text-gray-600">
                <img src={uploadIcon1} alt="upload" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[14px] md:text-[16px] text-gray-900 leading-none">Upload Prescription</span>
              </div>
            </div>
          </div>

          {/* Access Report */}
          <div className="bg-white rounded-xl p-4 md:p-5 w-full md:w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex flex-col h-[70px] md:h-[90px] justify-center items-start md:items-start relative">
            <div className="flex items-center justify-center md:justify-start gap-3 w-full">
              <div className="flex-shrink-0 w-5 h-5 leading-none text-gray-600">
                <img src={prescriptionIcon} alt="report" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[14px] md:text-[16px] text-gray-900 leading-none">Access Report</span>
              </div>
            </div>
          </div>

        </div>

        {/* Support Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-[20px] font-bold text-[#071D37] mb-2">Still Have question?</h3>
            <p className="text-[14px] text-gray-600">Our support team is available 24/7 to help you</p>
          </div>

          <div className="flex flex-row items-center justify-center gap-2 md:gap-4 w-full">
            <button 
             className="hover-blue-shadow flex items-center justify-center gap-1.5 px-2 md:px-6 py-2.5 md:py-3 rounded-md bg-gradient-to-b from-[#0B0909] via-[#091120] to-[#1055A8] text-white font-semibold text-[12px] md:text-base flex-1 md:flex-none h-[42px] md:h-auto whitespace-nowrap"
            >
              Contact Support
            </button>

            <button className="flex items-center justify-center gap-1.5 px-2 md:px-6 py-2.5 md:py-3 bg-white border border-transparent rounded-md text-[#071D37] font-bold text-[12px] md:text-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all flex-1 md:flex-none h-[42px] md:h-auto whitespace-nowrap">
              <Phone className="w-3.5 h-3.5 md:w-5 md:h-5 fill-[#071D37]" />
              <span>1800-123-4567</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}