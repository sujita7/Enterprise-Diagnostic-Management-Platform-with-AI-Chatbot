import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../../store/cartSlice';
import { X, Trash2, Shield, Award, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart?.items || []);

  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const totalOriginal = cartItems.reduce((sum: number, item: any) => sum + (item.originalPrice || item.price * 1.5), 0);
  const totalPayable = cartItems.reduce((sum: number, item: any) => sum + item.price, 0);
  const discount = totalOriginal - totalPayable;

  const handleRemove = (id: any, type: string) => {
    dispatch(removeFromCart({ id, type }));
  };

  const handleCheckout = () => {
    onClose();
    (window as any).appNavigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/55 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-white z-[100] shadow-2xl transition-transform duration-300 transform flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Custom Header from User's Prompt */}
        <header className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-950 transition-colors"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" fill="none" className="rotate-0">
              <path fill="url(#chevron-left-gradient_svg__a)" fillRule="evenodd" d="m2.203 5.989 4.518 4.461a.9.9 0 0 1 .25.877.91.91 0 0 1-.653.644.92.92 0 0 1-.887-.246L.267 6.626a.893.893 0 0 1 0-1.274L5.431.253a.92.92 0 0 1 1.28.011c.351.348.356.91.01 1.263z" clipRule="evenodd"></path>
              <defs>
                <linearGradient id="chevron-left-gradient_svg__a" x1="4.844" x2="-1.479" y1="0" y2="9.608" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3C3C3C"></stop>
                  <stop offset="1" stopColor="#B1B1B1"></stop>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-sm tracking-tight">Back to home</span>
          </button>
          
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Area */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain p-6 scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
          {cartItems.length === 0 ? (
            /* Empty state HTML styled matching user code */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                {/* User provided Empty Cart Mask Circle SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="none" className="opacity-80">
                  <mask id="empty-cart-mask_svg__a" width="160" height="160" x="0" y="0" maskUnits="userSpaceOnUse">
                    <circle cx="80" cy="80" r="80" fill="#F5F5F5"></circle>
                  </mask>
                  <g mask="url(#empty-cart-mask_svg__a)">
                    <path fill="url(#empty-cart-mask_svg__b)" d="M0 100h160v60H0z"></path>
                    <path fill="url(#empty-cart-mask_svg__c)" d="M100 40c-3 0-6-2.5-6-6s2.5-6.5 6-6.5c1-6 6-11 12-11 5 0 9 3 11 7.5a9 9 0 0 1 3.5-.7c3 0 6 1.7 7.5 4.5.3-.1.7-.1 1-.1 3 0 6 3 6 6.5s-2.5 6.5-6 6.5z"></path>
                  </g>
                  <defs>
                    <linearGradient id="empty-cart-mask_svg__b" x1="6.951" x2="62.407" y1="100" y2="200" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#fff"></stop>
                      <stop offset="1" stop-color="#EBEBEB"></stop>
                    </linearGradient>
                    <linearGradient id="empty-cart-mask_svg__c" x1="90" x2="140" y1="28" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#fff"></stop>
                      <stop offset="1" stop-color="#E6E7E8"></stop>
                    </linearGradient>
                  </defs>
                </svg>

                {/* Empty Cart SVG Icon */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="75" height="70" fill="none">
                    <path fill="url(#empty-cart_svg__a)" d="M66 0c-3.3 0-6.1 2.2-6.9 5.4l-1.9 8h-49.8c-2.2 0-4.2 1-5.6 2.7a7 7 0 0 0-1.3 6l5.8 24c.8 3.2 3.6 5.4 6.9 5.4h31.9c3.3 0 6.1-2.2 6.9-5.4l2-8.3.1-.2 5.9-24.2h-.1l1.8-7.3h8.4V0H66zm-16.7 45.4a4.4 4.4 0 0 1-4.3 3.3H13.2a4.4 4.4 0 0 1-4.3-3.3L3.1 21.5a4.3 4.3 0 0 1 .8-3.7 4.4 4.4 0 0 1 3.5-1.7H56.4L52.8 31.1H17.1v2.7H35.1l-.8 3.3-2 8.3z"></path>
                    <path fill="url(#empty-cart_svg__b)" d="M47.4 55c-4.1 0-7.5 3.3-7.5 7.5s3.4 7.5 7.5 7.5c4.1 0 7.5-3.3 7.5-7.5S51.5 55 47.4 55zm0 12.2c-2.6 0-4.8-2.1-4.8-4.7s2.1-4.7 4.8-4.7c2.6 0 4.8 2.1 4.8 4.7s-2.2 4.7-4.8 4.7z"></path>
                    <path fill="url(#empty-cart_svg__c)" d="M10.9 55c-4.1 0-7.5 3.3-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.3 7.5-7.5-3.4-7.5-7.5-7.5zm0 12.2c-2.6 0-4.8-2.1-4.8-4.7S6.1 60 10.9 60c2.6 0 4.8 2.1 4.8 4.7s-2.2 4.7-4.8 4.7z"></path>
                    <defs>
                      <linearGradient id="empty-cart_svg__a" x1="51.5" x2="36.8" y1="0" y2="55.1" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3C3C3C"></stop>
                        <stop offset="1" stop-color="#B1B1B1"></stop>
                      </linearGradient>
                      <linearGradient id="empty-cart_svg__b" x1="50.2" x2="44.5" y1="55" y2="70" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3C3C3C"></stop>
                        <stop offset="1" stop-color="#B1B1B1"></stop>
                      </linearGradient>
                      <linearGradient id="empty-cart_svg__c" x1="13.8" x2="8.1" y1="55" y2="70" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3C3C3C"></stop>
                        <stop offset="1" stop-color="#B1B1B1"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">Your cart is empty.</h2>
              <p className="text-sm text-gray-500 max-w-xs mb-8">
                Looks like you haven't added any test / checkup to your cart
              </p>

              <button 
                onClick={() => { onClose(); window.appNavigate('/packages'); }}
                className="w-full max-w-[280px] py-3.5 bg-gradient-to-r from-[#0C1E40] to-[#16458B] hover:from-[#08152c] hover:to-[#0f3265] text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 uppercase tracking-wide"
              >
                Add test/checkup
              </button>
            </div>
          ) : (
            /* Cart items list and billing */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cart Items ({cartItems.length})</span>
                <button 
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-red-500 hover:text-red-700 font-bold uppercase transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Items feed */}
              <div className="space-y-3">
                {cartItems.map((item: any, idx: number) => {
                  const itemOrigPrice = item.originalPrice || item.price * 1.5;
                  return (
                    <div 
                      key={`${item.type}-${item.id}`} 
                      className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-[#0076BC] uppercase tracking-wide mb-1.5">
                          {item.type}
                        </span>
                        <h4 className="font-bold text-sm text-gray-950 truncate leading-tight mb-1">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-gray-900 text-sm">₹{item.price}</span>
                          {itemOrigPrice > item.price && (
                            <span className="text-xs text-gray-400 line-through">₹{Math.round(itemOrigPrice)}</span>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleRemove(item.id, item.type)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bill details */}
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-5 space-y-4">
                <h4 className="font-extrabold text-sm text-gray-900">Payment Summary</h4>
                
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>M.R.P. Total</span>
                    <span>₹{Math.round(totalOriginal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount (Promo applied)</span>
                      <span>- ₹{Math.round(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Home Sample Collection</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-gray-200/60 my-2 pt-3 flex justify-between font-black text-gray-900 text-base">
                    <span>Total Amount Payable</span>
                    <span className="text-lg">₹{Math.round(totalPayable)}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-green-800 font-medium">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Congrats! You are saving ₹{Math.round(discount)} on this booking.</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-4 pt-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#0076BC] hover:bg-[#0A366B] text-white rounded-2xl font-bold text-sm transition-all shadow-md active:scale-[0.98] uppercase tracking-wider"
                >
                  Proceed to Checkout
                </button>

                <div className="grid grid-cols-2 gap-3 text-center text-gray-500 text-[10px]">
                  <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl">
                    <Shield className="w-4 h-4 text-[#0076BC] mb-1" />
                    <span className="font-bold text-gray-700">100% Safe Labs</span>
                  </div>
                  <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl">
                    <Award className="w-4 h-4 text-yellow-600 mb-1" />
                    <span className="font-bold text-gray-700">NABL Certified</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
