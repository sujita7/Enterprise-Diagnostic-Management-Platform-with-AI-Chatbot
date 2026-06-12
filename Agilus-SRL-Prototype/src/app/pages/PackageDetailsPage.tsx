import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../../store/packageSlice';
import { addToCart } from '../../store/cartSlice';
import { ArrowLeft, Clock, Check, Info, Shield, Users, Star, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface PackageDetailsPageProps {
  packageId: string;
}

export function PackageDetailsPage({ packageId }: PackageDetailsPageProps) {
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector((state: any) => state.packages);
  const cartItems = useSelector((state: any) => state.cart?.items || []);
  const [activeTab, setActiveTab] = useState('About The Test');
  const [isParamsExpanded, setIsParamsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchPackages() as any);
  }, [dispatch]);

  const pkg = packages.find((p: any) => String(p.id) === String(packageId));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fa]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0076BC] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fa] p-6">
        <div className="text-center bg-white p-8 rounded-3xl border border-red-100 shadow-sm max-w-md">
          <p className="text-red-600 font-bold text-lg mb-2">Error Loading Package</p>
          <p className="text-gray-600 text-sm mb-6">{String(error)}</p>
          <button 
            onClick={() => dispatch(fetchPackages() as any)} 
            className="px-6 py-2.5 bg-[#0076BC] text-white rounded-xl font-semibold hover:bg-[#0A366B] transition-colors shadow-sm"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fa] p-6">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-md">
          <p className="text-gray-900 font-bold text-lg mb-2">Package Not Found</p>
          <p className="text-gray-600 text-sm mb-6">Could not find package with ID "{packageId}" in the database.</p>
          <button 
            onClick={() => window.appNavigate('/packages')} 
            className="px-6 py-2.5 bg-[#0076BC] text-white rounded-xl font-semibold hover:bg-[#0A366B] transition-colors shadow-sm"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  // Get static diagnostic metadata based on test name
  const details = pkg;

  // Tabs for details section
  const tabs = ['About The Test', 'List of Parameters', 'Test Preparation', 'Why This Test', 'Interpretations', 'FAQs'];

  const discountPercent = pkg.originalPrice > 0 
    ? Math.round((1 - pkg.price / pkg.originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-[#f7f9fa] min-h-screen pb-20 font-sans text-gray-900">
      
      {/* Back navigation */}
      <div className="max-w-[1280px] mx-auto px-6 pt-6">
        <button 
          onClick={() => window.appNavigate('/packages')}
          className="flex items-center gap-2 text-[#0076BC] hover:text-[#0A366B] font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Packages</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Banner card */}
          <div className="bg-gradient-to-r from-[#0C1E40] to-[#16458B] text-white rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-lg">
            
            {/* Background design graphic (translucent circular shapes) */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <svg width="350" height="350" fill="currentColor" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" />
              </svg>
            </div>

            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold uppercase tracking-wider rounded-full">
                {pkg.category} Checkup
              </span>
              
              <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                {pkg.name}
              </h1>

              <p className="text-xs lg:text-sm text-gray-300 leading-relaxed max-w-[90%]">
                <span className="font-bold text-white">Also Known As:</span> {details.aliases}
              </p>

              {/* Price and Booked Stat */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">₹{pkg.price}</span>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-sm text-gray-400 line-through">₹{pkg.originalPrice}</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">Inclusive of all taxes</p>
                </div>

                <div className="w-[1px] h-10 bg-white/20 hidden sm:block"></div>

                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/5">
                  <Users className="w-5 h-5 text-blue-300" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">107K+ people</span>
                    <span className="text-gray-300">booked this test</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary details grid (TAT, Requisites, Measures) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TAT and Parameter Summary */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Reports TAT</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0076BC]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-extrabold text-gray-800">Within {pkg.reports}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Parameters Included</span>
                <button 
                  onClick={() => setIsParamsExpanded(!isParamsExpanded)}
                  className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <span className="text-2xl font-black text-gray-800">{pkg.parameters} Parameter(s)</span>
                  {isParamsExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {isParamsExpanded && (
                  <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1 max-h-[150px] overflow-y-auto">
                    <p className="font-semibold text-gray-700">Detailed list:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>Complete Blood Cells</li>
                      <li>Inflammatory Markers</li>
                      <li>Immune Response Variables</li>
                      <li>Metabolic Indicators</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Requisites (Blood Sample, Fasting) */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Requisites</span>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-extrabold text-xs">
                    B
                  </div>
                  <div className="text-sm font-semibold text-gray-800">Blood Sample Required</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100/50">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-extrabold text-xs">
                    F
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {pkg.fasting === 'Required' ? 'Fasting Required (8-10 Hours)' : 'No Fasting Required'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Measures and Identifies Box */}
          <div className="bg-[#EEF6FE] border border-[#BFDEFC] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-black text-[#0076BC] mb-2 uppercase tracking-wide">What It Measures</h4>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {details.measures}
              </p>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-blue-200 pt-4 md:pt-0 md:pl-6">
              <h4 className="text-sm font-black text-[#0076BC] mb-2 uppercase tracking-wide">Key Identifiers</h4>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {details.identifies}
              </p>
            </div>
          </div>

          {/* Tabbed Info area */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-gray-50">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab 
                      ? 'border-[#0076BC] text-[#0076BC] bg-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-8">
              {activeTab === 'About The Test' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">What is a {pkg.name}?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{details.about}</p>
                </div>
              )}
              {activeTab === 'List of Parameters' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">Diagnostic Parameters Checked ({pkg.parameters})</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    This profile checks critical diagnostic blood values, including counts of key cellular components, relative proportions, hemoglobin percentages, and index configurations.
                  </p>
                </div>
              )}
              {activeTab === 'Test Preparation' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">How to Prepare</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{details.prep}</p>
                </div>
              )}
              {activeTab === 'Why This Test' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">Purpose of the Test</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{details.why}</p>
                </div>
              )}
              {activeTab === 'Interpretations' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">Understanding Your Results</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{details.interpretations}</p>
                </div>
              )}
              {activeTab === 'FAQs' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">Frequently Asked Questions</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-extrabold text-gray-800">Q: When will I get my reports?</h4>
                      <p className="text-gray-600">A: Within {pkg.reports} of sample collection.</p>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-800">Q: Is home collection free?</h4>
                      <p className="text-gray-600">A: Home collection is included for all premium bookings.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Checkout Widget & Offers */}
        <div className="space-y-6">
          
          {/* Booking / Checkout widget */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md space-y-6 sticky top-6">
            <h3 className="font-extrabold text-lg text-gray-900">Book Test</h3>
            
            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-100">
              <span className="text-xs text-gray-400 block font-medium">TOTAL PAYABLE</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-gray-900">₹{pkg.price}</span>
                {pkg.originalPrice > pkg.price && (
                  <span className="text-sm text-gray-400 line-through font-medium">₹{pkg.originalPrice}</span>
                )}
              </div>
              <span className="text-[10px] text-green-600 font-bold block mt-1">✓ Home Sample Collection Included</span>
            </div>

            {(() => {
              const isAdded = cartItems.some((item: any) => item.type === 'package' && String(item.id) === String(pkg.id));
              const handleAddToCart = () => {
                dispatch(addToCart({
                  id: pkg.id,
                  name: pkg.name,
                  price: Math.round(Number(pkg.price)),
                  originalPrice: Math.round(Number(pkg.originalPrice)),
                  type: 'package'
                }));
              };
              return (
                <button 
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg ${
                    isAdded 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-[#0076BC] text-white hover:bg-[#0A366B]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>
              );
            })()}
            
            {/* Offer Coupons list */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">Available Offers</h4>
              
              <div className="space-y-3">
                
                {/* Coupon 1 */}
                <div className="flex items-start gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <div className="px-2 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded tracking-wide">
                    ORANGE10
                  </div>
                  <div className="text-xs">
                    <span className="font-extrabold text-gray-800 block">Get 10% OFF</span>
                    <span className="text-gray-500">Applicable on first booking</span>
                  </div>
                </div>

                {/* Coupon 2 */}
                <div className="flex items-start gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <div className="px-2 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded tracking-wide">
                    FAMILY30
                  </div>
                  <div className="text-xs">
                    <span className="font-extrabold text-gray-800 block">Get 30% OFF</span>
                    <span className="text-gray-500">Add any family member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 text-center text-gray-500 text-[10px]">
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                <Shield className="w-4 h-4 text-[#0076BC] mb-1" />
                <span className="font-bold text-gray-700">100% Safe Labs</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                <Award className="w-4 h-4 text-yellow-600 mb-1" />
                <span className="font-bold text-gray-700">NABL Certified</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Trust Markers Bar */}
      <div className="max-w-[1280px] mx-auto px-6 mt-12">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-sm text-center">
          <div>
            <span className="text-2xl font-black text-[#0076BC] block mb-1">60 Mins</span>
            <span className="text-xs font-extrabold text-gray-800 block">Home Sample</span>
            <span className="text-[10px] text-gray-400">Collection</span>
          </div>
          <div className="border-l border-gray-100">
            <span className="text-2xl font-black text-[#0076BC] block mb-1">1 Million+</span>
            <span className="text-xs font-extrabold text-gray-800 block">Happy Patients</span>
            <span className="text-[10px] text-gray-400">Served</span>
          </div>
          <div className="border-l border-gray-100">
            <span className="text-2xl font-black text-[#0076BC] block mb-1">4.8 ★</span>
            <span className="text-xs font-extrabold text-gray-800 block">Google Rating</span>
            <span className="text-[10px] text-gray-400">Reviews verified</span>
          </div>
          <div className="border-l border-gray-100">
            <span className="text-2xl font-black text-[#0076BC] block mb-1">Certified</span>
            <span className="text-xs font-extrabold text-gray-800 block">Diagnostic Labs</span>
            <span className="text-[10px] text-gray-400">NABL & CAP accredited</span>
          </div>
        </div>
      </div>

    </div>
  );
}

