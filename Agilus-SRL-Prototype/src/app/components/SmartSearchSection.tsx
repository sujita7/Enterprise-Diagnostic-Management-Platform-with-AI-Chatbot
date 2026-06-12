import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Upload, Loader2, FileText, X } from 'lucide-react';
import { colors } from '../../colors';
import api from '../../api/axiosConfig';

export function SmartSearchSection() {
  const [value, setValue] = useState("");
  const [typedText, setTypedText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Search State
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const placeholderWords = ["Test", "Packages", "Health concern"];

  useEffect(() => {
    const currentWord = placeholderWords[placeholderIndex];
    const speed = isDeleting ? 50 : 100;

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
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, placeholderIndex]);

  const popularSearches = [
    'Complete Blood Count (CBC)',
    'Thyroid Profile',
    'Lipid Profile',
    'HbA1c',
    'Vitamin D',
    'Liver Function Test'
  ];

  const recentSearches = ['CBC Test', 'Full Body Checkup'];

  // Debounced Search Effect
  useEffect(() => {
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get(`ai/search/?q=${value}`);
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('ai/analyze-report/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(response.data.analysis);
    } catch (error) {
      console.error("Upload error", error);
      alert("Failed to analyze report.");
    } finally {
      setIsUploading(false);
      event.target.value = ''; // reset
    }
  };

  const specialButtonClasses = "flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-b from-[#0B0909] via-[#091120] to-[#1055A8] text-white font-semibold text-[15px] transition-all";
  const specialButtonStyles = {
    boxShadow: `
      inset 0px -6px 6px 0px #1F62FF,
      inset 0px -70px -60px 0px #134BCD
    `
  };

  return (
    <section className="py-10 md:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 md:gap-20">
          {/* Smart Search Card */}
          <div className="space-y-2.5 md:space-y-5 bg-white p-4 md:p-7 rounded-xl border border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div>
              <h2 className="text-[24px] md:text-3xl font-semibold text-gray-900 mb-1 md:mb-3">
                Find your test instantly
              </h2>
              <p className="text-[14px] md:text-base text-gray-600">
                Search from 3000+ tests and packages
              </p>
            </div>

            {/* Search bar */}
            <div className="relative">
              <div className="relative flex items-center w-full h-[38px] md:h-[52px] rounded-xl border border-blue-200">
                <Search className="absolute left-3 md:left-4 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                {!value && (
                  <div className="absolute left-8 md:left-11 text-[11px] md:text-[15px] flex pointer-events-none">
                    <span className="text-gray-400">search "</span>
                    <span style={{ color: colors.placeholder }}>{typedText}</span>
                    <span className="text-gray-400">"</span>
                  </div>
                )}
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full h-full pl-8 md:pl-11 pr-4 outline-none text-[12px] md:text-[15px] rounded-xl"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 w-5 h-5 animate-spin text-gray-400" />
                )}
              </div>
              
              {/* Dropdown Results */}
              {value.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((result: any, idx: number) => (
                      <div key={idx} className="p-3 hover:bg-blue-50 border-b border-gray-100 cursor-pointer flex justify-between items-center transition-colors">
                        <div>
                          <p className="font-semibold text-gray-800">{result.test_name}</p>
                          <p className="text-xs text-gray-500">{result.description?.substring(0, 50)}...</p>
                        </div>
                        <span className="font-bold text-[#0076BC]">₹{result.price}</span>
                      </div>
                    ))
                  ) : (
                    !isSearching && <div className="p-4 text-center text-gray-500">No tests found for "{value}"</div>
                  )}
                </div>
              )}
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg text-[11px] md:text-sm text-gray-700 hover:border-[#0076BC] hover:text-[#0076BC] transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 border border-blue-300 rounded-lg text-[11px] md:text-sm text-[#0076BC] hover:bg-blue-100 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prescription Upload Card */}
          <div className="space-y-2.5 md:space-y-5 bg-white p-4 md:p-7 rounded-xl border border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div>
              <h2 className="text-[24px] md:text-3xl font-semibold text-gray-900 mb-1 md:mb-3">
                Upload prescription / report
              </h2>
              <p className="text-[14px] md:text-base text-gray-600">
                Get personalized test recommendations from PDF or Image
              </p>
            </div>

            {/* Upload area */}
            <div className="bg-blue-50 border-2 border-dashed border-[#0076BC] md:bg-white md:border-gray-200 rounded-2xl p-4 md:p-10 text-center hover:border-[#0076BC] hover:bg-blue-50 transition-all cursor-pointer group flex-1 flex flex-col items-center justify-center mt-2">
              <div className="w-8 h-8 md:w-16 md:h-16 rounded-xl bg-blue-100 md:bg-blue-50 mx-auto mb-2 md:mb-4 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Upload className="w-4 h-4 md:w-8 md:h-8 text-[#0076BC]" />
              </div>
              
              <h3 className="text-[14px] md:text-lg font-semibold text-gray-900 mb-2 md:mb-2 text-center w-full">
                Drop your PDF or Image here
              </h3>
              
              <div className="flex items-center justify-center gap-4 relative">
                <input 
                  type="file" 
                  accept=".pdf, image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button 
                  className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-md bg-gradient-to-b from-[#0B0909] via-[#091120] to-[#1055A8] text-white font-semibold text-[12px] md:text-[15px] transition-all"
                  style={specialButtonStyles}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? 'Analyzing...' : 'Upload'}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-[#0076BC] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-sm text-[#0076BC]">
                <span className="font-medium">Your privacy is protected.</span> Prescriptions are analyzed securely and deleted after recommendations are provided.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Result Modal */}
      {uploadResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-[#0076BC]" />
                AI Report Analysis
              </h2>
              <button 
                onClick={() => setUploadResult(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed">
              {uploadResult}
            </div>
            <div className="p-4 bg-amber-50 border-t border-amber-100 text-amber-800 text-sm flex gap-2">
              <span className="font-bold">Disclaimer:</span> This is an automated AI summary. Please consult with a physician for a real diagnosis.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
