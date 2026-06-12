import React from 'react';
import { Search, ShoppingCart, MapPin, X, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { colors } from '../../colors';
import logoAgilus from '../../assets/icons/logo_agilus.svg';
import whatsappIcon from '../../assets/icons/whatsapp.svg';
import testIcon from '../../assets/icons/tests.svg';
import checkupIcon from '../../assets/icons/checkups.svg';
import location from '../../assets/icons/location_outline.svg';
import uploadIcon from '../../assets/icons/uploadIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { AuthModal } from './AuthModal';
import chandigarhImg from '../../assets/icons/Images/Chandigrah.png';
import chennaiImg from '../../assets/icons/Images/chennai.png';
import delhiImg from '../../assets/icons/Images/delhi.png';
import hyderabadImg from '../../assets/icons/Images/hyderabad.png';
import kolkataImg from '../../assets/icons/Images/kolkata.png';
import mumbaiImg from '../../assets/icons/Images/mumbai.png';
import puneImg from '../../assets/icons/Images/pune.png';

interface HeaderProps {
  onNavigate?: (path: string) => void;
  onCartClick?: () => void;
}

export function Header({ onNavigate, onCartClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [value, setValue] = useState("");

  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState(() => {
    return localStorage.getItem('selectedCity') || '';
  });
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Redux Auth State
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const cartItems = useSelector((state: any) => state.cart?.items || []);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const placeholderWords = ["Test", "Packages", "Health concern"];

  const popularCities = [
    { name: 'Chandigarh', img: chandigarhImg },
    { name: 'Chennai', img: chennaiImg },
    { name: 'Hyderabad', img: hyderabadImg },
    { name: 'Kolkata', img: kolkataImg },
    { name: 'Mumbai', img: mumbaiImg },
    { name: 'New delhi', img: delhiImg },
    { name: 'Pune', img: puneImg }
  ];

  const otherCities = [
    'Agartala', 'Agra', 'Ahmedabad', 'Aliganj', 'Amritsar', 'Anantnag', 'Beas', 'Bengaluru (Bangalore)', 'Bhubaneswar', 'Bilaspur (Cg)', 'Burdwan', 'Coimbatore', 'Dankuni', 'Dehradun', 'Durgapur Wb', 'Faizabad', 'Faridabad', 'Gaya', 'Ghaziabad', 'Goa', 'Gorakhpur', 'Guwahati', 'Haldwani', 'Howrah', 'Imphal', 'Indore', 'Jabalpur', 'Jaipur'
  ];



  // Prevent scroll when modal or menu is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (showLocationModal || isMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [showLocationModal, isMenuOpen]);

  // Handle city selection and storage
  const handleCitySelect = (cityName: string) => {
    setSavedAddress(cityName);
    localStorage.setItem('selectedCity', cityName);
    setShowLocationModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setIsScrolled(true);
      else if (window.scrollY < 30) setIsScrolled(false);

      if (window.scrollY > 450) setIsSearchVisible(true);
      else if (window.scrollY < 380) setIsSearchVisible(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      {/* SVG BORDER ANIMATION & ENTRANCE ANIMATIONS */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }

        .btn-border {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
        }

        .btn-border svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .btn-border rect {
          fill: none;
          stroke: #1055A8;
          stroke-width: 2;
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          transition: stroke-dashoffset 0.8s linear;
        }

        .btn-border:hover rect {
          stroke-dashoffset: 0;
        }

        /* ✅ ONLY HOVER SHADOW (Support & Cart) */
        .hover-blue-shadow {
          transition: all 0.3s ease;
        }

        .hover-blue-shadow:hover {
          box-shadow: 0 10px 20px rgba(16, 85, 168, 0.35);
          transform: translateY(-2px);
        }
      `}</style>

      <header className="w-full sticky top-0 z-40 shadow-sm overflow-hidden bg-gradient-to-b from-[#E5F3FB] to-[#C9E7F8] xl:bg-none xl:bg-white">
        <div className="max-w-[1432px] mx-auto px-6 font-sans bg-transparent xl:bg-white">

          <div className={`flex flex-col xl:flex-row xl:items-center justify-between transition-all duration-500 xl:gap-0 ${
            isScrolled ? 'py-3 gap-0' : 'py-5 gap-4'
          }`}>

            {/* Row 1 for Mobile / Left section for Desktop */}
            <div className={`flex w-full xl:w-auto items-center justify-between xl:justify-start gap-2 xl:gap-10 animate-fade-in-down delay-100 transition-all duration-500 overflow-hidden ${
              isScrolled ? 'max-h-0 opacity-0 xl:max-h-[100px] xl:opacity-100' : 'max-h-[100px] opacity-100'
            }`}>
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); onNavigate?.('/'); }}
                className="shrink-0"
              >
                <img src={logoAgilus} alt="Agilus Diagnostics" className="h-7 md:h-10 w-auto" />
              </a>

              <div 
                className="flex items-center gap-1 cursor-pointer group"
                onClick={() => setShowLocationModal(true)}
              >
                <img src={location} alt="location" className="w-3.5 h-3.5 md:w-5 md:h-5" />
                <span className="text-[12px] md:text-[18px] font-semibold text-gray-700 group-hover:text-[#0076BC] transition-colors whitespace-nowrap">
                  {savedAddress || "City"}
                </span>
              </div>
            </div>

            <div className={`flex-1 hidden xl:block max-w-[500px] mx-8 transition-all ${
              isSearchVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
              <div className="relative flex items-center w-full h-[42px] rounded border border-blue-200">
                <Search className="absolute left-3 w-4 h-4 text-gray-500" />
                {!value && (
                  <div className="absolute left-9 text-sm flex pointer-events-none">
                    <span className="text-gray-400">search for "</span>
                    <span style={{ color: colors.placeholder }}>{typedText}</span>
                    <span className="text-gray-400">"</span>
                  </div>
                )}
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full h-full pl-9 pr-4 outline-none text-sm"
                />
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-4 animate-fade-in-down delay-200">

             
              <button 
                onClick={(e) => { e.preventDefault(); onNavigate?.('/tests'); }}
                className="btn-border px-6 py-3 flex items-center gap-2 text-[16px] font-semibold text-gray-700"
              >
                <svg>
                  <rect x="1" y="1" width="98%" height="96%" rx="6" />
                </svg>
                <img src={testIcon} className="w-7 h-7" />
                <span>Test</span>
              </button>

          
              <button 
                onClick={(e) => { e.preventDefault(); onNavigate?.('/packages'); }}
                className="btn-border px-6 py-3 flex items-center gap-2 text-[16px] font-semibold text-gray-700"
              >
                <svg>
                  <rect x="1" y="1" width="98%" height="96%" rx="6" />
                </svg>
                <img src={checkupIcon} className="w-7 h-7" />
                <span>Packages</span>
              </button>

              {/* CART (HOVER SHADOW ONLY) */}
              <button 
                onClick={onCartClick}
                className="hover-blue-shadow px-6 py-3 border-2 border-[#0076BC] text-[#0076BC] rounded-md flex items-center gap-2 relative"
              >
                 <ShoppingCart className="w-5 h-5" />
                 <span>Cart</span>
                 {cartItems.length > 0 && (
                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                     {cartItems.length}
                   </span>
                 )}
              </button>

              {/* CART (HOVER SHADOW ONLY) */}
              {isAuthenticated ? (
                <button 
                  onClick={() => dispatch(logout())}
                  className="hover-blue-shadow flex items-center gap-3 px-6 py-3 rounded-md bg-gradient-to-b from-red-600 to-red-800 text-white font-semibold"
                >
                  <span>Log Out</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="hover-blue-shadow flex items-center gap-3 px-6 py-3 rounded-md bg-gradient-to-b from-[#0B0909] via-[#091120] to-[#1055A8] text-white font-semibold"
                >
                  <span>Sign In</span>
                </button>
              )}

            </div>

            {/* Mobile Row 2 & 3 */}
            <div className="flex flex-col xl:hidden w-full animate-fade-in-down delay-200 mt-2 mb-3">
              {/* Row 1: Search + Cart + Sign In */}
              <div className="flex items-center gap-1.5 w-full">
                {/* Mobile Search */}
                <div className="flex-1 relative flex items-center h-[38px] rounded border border-blue-200 bg-white overflow-hidden shrink-0 transition-all duration-500 focus-within:border-blue-400 focus-within:shadow-sm">
                  <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-500 shrink-0" />
                  {!value && (
                    <div className="absolute left-7 text-[11px] flex pointer-events-none whitespace-nowrap right-1">
                      <span className="text-gray-400">search "</span>
                      <span style={{ color: colors.placeholder }} className="truncate">{typedText}</span>
                      <span className="text-gray-400">"</span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full h-full pl-7 pr-1 outline-none text-[11px] bg-transparent"
                  />
                </div>

                {/* Compact Cart + Sign In */}
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={onCartClick}
                    className="flex shrink-0 items-center justify-center w-[38px] h-[38px] rounded border border-[#0076BC] text-[#0076BC] relative bg-white transition-transform active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" /> 
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border border-white font-bold">
                        {cartItems.length}
                      </span>
                    )}
                  </button>

                  {isAuthenticated ? (
                    <button 
                      onClick={() => dispatch(logout())}
                      className="shrink-0 px-2.5 h-[38px] rounded bg-red-600 text-white font-bold text-[11px] whitespace-nowrap transition-transform active:scale-95 shadow-sm"
                    >
                      Log Out
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="shrink-0 px-2.5 h-[38px] rounded bg-gradient-to-b from-[#0B0909] via-[#091120] to-[#1055A8] text-white font-bold text-[11px] whitespace-nowrap transition-transform active:scale-95 shadow-sm"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Intent Buttons (Hide on scroll) */}
              <div className={`flex items-stretch gap-1.5 w-full shrink-0 transition-all duration-500 overflow-hidden px-0.5 ${
                isScrolled ? 'max-h-0 opacity-0 mt-0 pt-0 pb-0 pointer-events-none' : 'max-h-[70px] opacity-100 mt-2 pb-1'
              }`}>
                {[
                  { text: "Lab Test", icon: testIcon, iconSize: "w-3.5 h-3.5" },
                  { text: "Packages", icon: checkupIcon, iconSize: "w-3.5 h-3.5" },
                  { text: "Prescription", icon: uploadIcon, iconSize: "w-3 h-3" }
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (item.text === "Packages") {
                        onNavigate?.('/packages');
                      } else if (item.text === "Lab Test") {
                        onNavigate?.('/tests');
                      }
                    }}
                    className="flex-1 flex flex-row items-center justify-center gap-1 p-1.5 rounded-md bg-white border border-[#0076BC] text-[#0076BC] shadow-sm transition-all active:scale-95 min-h-[44px]"
                  >
                    <img src={item.icon} alt={item.text} className={`${item.iconSize} object-contain flex-shrink-0`} />
                    <span className="font-semibold text-[9px] leading-tight text-center uppercase tracking-tighter truncate">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`xl:hidden fixed inset-x-0 top-[64px] bottom-0 bg-white z-50 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col p-6 gap-6 overflow-y-auto h-full pb-32">
            <button 
              onClick={() => { onNavigate?.('/tests'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 text-left"
            >
              <img src={testIcon} className="w-8 h-8" />
              <div className="flex-1">
                <div className="font-bold text-gray-900">Book a Test</div>
                <div className="text-xs text-gray-500">Search from 3000+ tests</div>
              </div>
            </button>

            <button 
              onClick={() => { onNavigate?.('/packages'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 text-left"
            >
              <img src={checkupIcon} className="w-8 h-8" />
              <div className="flex-1">
                <div className="font-bold text-gray-900">Health Packages</div>
                <div className="text-xs text-gray-500">Comprehensive full body checkups</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#0076BC] bg-blue-50 text-left">
              <img src={whatsappIcon} className="w-6 h-6" />
              <div className="flex-1">
                <div className="font-bold text-[#0076BC]">Contact Support</div>
                <div className="text-xs text-gray-500">Talk to our health experts</div>
              </div>
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100">
               <h4 className="font-bold text-gray-900 mb-4 px-2">Popular Categories</h4>
               <div className="grid grid-cols-2 gap-3">
                  {["Full Body", "Diabetes", "Heart", "Kidney", "Thyroid", "Liver"].map(cat => (
                    <button key={cat} className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg text-left">
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal Popup - Always mounted but hidden for instant first-render speed */}
      <div 
        onClick={() => setShowLocationModal(false)}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          showLocationModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative transition-all duration-300 transform ${
            showLocationModal ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
        >
          <div className="p-8">
            {/* Search Input */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative flex items-center bg-white border border-gray-200 rounded-full h-12 px-4 shadow-sm focus-within:border-blue-500 transition-all">
                <Search className="w-5 h-5 text-gray-400 absolute left-4" />
                <input 
                  type="text" 
                  placeholder="Search for your city" 
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="flex-1 pl-8 bg-transparent outline-none text-gray-700 placeholder-gray-400" 
                />
                <button className="w-8 h-8 absolute right-2 rounded-full bg-[#1055A8] flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
              <button className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors" onClick={() => setShowLocationModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Detect Location */}
            <button className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-[#1055A8] transition-colors mb-8 px-2">
              <MapPin className="w-4 h-4" />
              Detect my location
            </button>

            {/* Popular Cities */}
            <h3 className="text-center font-bold text-gray-900 mb-6 text-lg">Popular Cities</h3>
            <div className="flex justify-center gap-6 mb-10 overflow-x-auto pb-4 px-2">
              {popularCities.map(city => (
                <button 
                  key={city.name} 
                  onClick={() => handleCitySelect(city.name)}
                  className={`flex flex-col items-center gap-3 w-[72px] group transition-all`}
                >
                  <div className={`w-[72px] h-[72px] rounded-2xl bg-white flex items-center justify-center transition-all duration-300 ${savedAddress === city.name ? 'border border-[#1055A8] shadow-[0_4px_12px_rgba(16,85,168,0.2)]' : 'border border-gray-100 group-hover:border-[#1055A8] shadow-sm group-hover:shadow-[0_4px_12px_rgba(16,85,168,0.1)]'}`}>
                    <img src={city.img} alt={city.name} className={`w-10 h-10 object-contain transition-all duration-300 ${savedAddress === city.name ? '' : 'filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`} />
                  </div>
                  <span className={`text-[13px] text-center whitespace-nowrap transition-colors ${savedAddress === city.name ? 'text-[#1055A8] font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}>{city.name}</span>
                </button>
              ))}
            </div>

            {/* Other Cities */}
            <h3 className="text-center font-bold text-gray-900 mb-6 text-lg">Other Cities</h3>
            <div 
              data-lenis-prevent
              className="grid grid-cols-4 gap-y-4 gap-x-6 max-h-[200px] overflow-y-auto overscroll-contain px-4 pb-4"
            >
              {otherCities
                .filter(city => city.toLowerCase().includes(modalSearchQuery.toLowerCase()))
                .map(city => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="text-left text-sm text-gray-600 hover:text-[#1055A8] hover:font-medium transition-colors py-1 truncate"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}