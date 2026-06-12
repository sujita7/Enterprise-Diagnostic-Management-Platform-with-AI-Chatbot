import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTests } from '../../store/testSlice';
import { addToCart } from '../../store/cartSlice';

export function TestsPage() {
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector((state: any) => state.tests);
  const cartItems = useSelector((state: any) => state.cart?.items || []);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchTests() as any);
  }, [dispatch]);

  const tabs = ['All', 'Blood', 'Diabetes', 'Thyroid', 'Heart', 'Kidney', 'Liver', 'Vitamins', 'Urine'];

  const currentTests = tests.filter((test: any) => {
    if (activeTab === 'All') return true;
    return test.category === activeTab;
  });

  return (
    <div className="bg-[#f7f9fa] min-h-screen pt-8 pb-20 font-sans">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Explore Title */}
        <div className="text-center mb-4 lg:mb-6">
          <p className="text-[14px] lg:text-[22px] text-gray-800 font-medium">Explore by Test Category</p>
        </div>

        {/* Category Scrollbar Tabs */}
        <div className="flex flex-nowrap overflow-x-auto lg:flex-wrap lg:flex-nowrap justify-start lg:justify-center gap-2 lg:gap-4 mb-8 lg:mb-10 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap flex-shrink-0 px-3 py-1 lg:px-6 lg:py-2 rounded-lg border text-[11px] lg:text-base font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'border-[#0076BC] bg-[#EEF6FE] text-[#0076BC] shadow-sm'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-[#0076BC] hover:text-[#0076BC]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0076BC]"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="text-center text-red-600 py-10">
            <p className="font-bold">Error loading tests: {String(error)}</p>
          </div>
        )}

        {/* Tests Grid */}
        {!loading && !error && (
          <>
            <h1 className="text-[16px] font-semibold text-gray-900 mb-6">Showing {currentTests.length} tests/checkups</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTests.map((test: any, idx: number) => {
                const originalPrice = Math.round(Number(test.original_price || test.price * 1.5));
                const isAdded = cartItems.some((item: any) => item.type === 'test' && String(item.id) === String(test.id));
                
                const handleAddToCart = () => {
                  dispatch(addToCart({
                    id: test.id,
                    name: test.name,
                    price: Math.round(Number(test.price)),
                    originalPrice: originalPrice,
                    type: 'test'
                  }));
                };

                return (
                  <article key={idx} className="bg-white border border-gray-100 rounded-2xl shadow-sm relative h-full flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
                    
                    <div className="bg-gradient-to-r from-[#0C1E40] to-[#16458B] p-4 lg:p-6 text-white flex justify-between items-start h-[80px] lg:h-[110px] rounded-t-2xl">
                      <h3 className="font-bold text-[14px] max-w-[65%] leading-[1.2] tracking-tight">{test.name}</h3>
                      <div className="text-right whitespace-nowrap">
                        <div className="text-[11px] text-blue-200/70 line-through mb-0.5">₹ {originalPrice}</div>
                        <div className="font-bold text-[18px] leading-none">₹ {Math.round(Number(test.price))}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 lg:p-6 flex-1 flex flex-col justify-between bg-[#F8FAFC] rounded-b-2xl">
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                        {test.description || 'Routine screening diagnostic test to evaluate critical physiological biomarkers.'}
                      </p>

                      <div className="flex items-start gap-2 lg:gap-4 mb-3 lg:mb-6">
                        <div className="flex items-start gap-1.5 lg:gap-2.5 flex-1 bg-white p-2 lg:p-3.5 rounded-xl border border-gray-50 shadow-sm">
                          <img src="data:image/svg+xml,%3csvg%20width='11'%20height='18'%20viewBox='0%200%2011%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M8.13389%209.23071L9.31007%2015.8499C9.32324%2015.9279%209.31231%2016.008%209.27872%2016.0795C9.24514%2016.1511%209.19051%2016.2107%209.12214%2016.2504C9.05377%2016.29%208.97491%2016.3079%208.89612%2016.3015C8.81733%2016.2952%208.74235%2016.2649%208.68122%2016.2148L5.90187%2014.1287C5.7677%2014.0285%205.60471%2013.9743%205.43722%2013.9743C5.26974%2013.9743%205.10675%2014.0285%204.97258%2014.1287L2.18857%2016.214C2.12748%2016.264%202.0526%2016.2943%201.9739%2016.3006C1.89521%2016.3006%201.81644%2016.2892%201.74811%2016.2496C1.67979%2016.2101%201.62515%2016.1506%201.59149%2016.0792C1.55783%2016.0078%201.54675%2015.9278%201.55972%2015.8499L2.73512%209.23071'%20stroke='%23014282'%20stroke-width='1.55271'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M5.4345%2010.0926C8.00711%2010.0926%2010.0926%208.00711%2010.0926%205.4345C10.0926%202.86188%208.00711%200.776367%205.4345%200.776367C2.86188%200.776367%200.776367%202.86188%200.776367%205.4345C0.776367%208.00711%202.86188%2010.0926%205.4345%2010.0926Z'%20stroke='%23014282'%20stroke-width='1.55271'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e" alt="parameters" className="w-[14px] lg:w-[18px] h-[14px] lg:h-[18px] mt-0.5 opacity-60" />
                          <span className="text-[10px] lg:text-[12px] text-gray-700 leading-tight font-medium">{test.parameters || 1} parameter(s)<br/>included</span>
                        </div>
                        <div className="flex items-start gap-1.5 lg:gap-2.5 flex-1 bg-white p-2 lg:p-3.5 rounded-xl border border-gray-50 shadow-sm">
                          <img src="data:image/svg+xml,%3csvg%20width='10'%20height='11'%20viewBox='0%200%2010%2011'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%209.40117V3.94243C0%203.75036%200.0430633%203.5684%200.12919%203.39655C0.215317%203.2247%200.333994%203.08318%200.485222%202.97198L4.12438%200.242611C4.33667%200.0808703%204.57928%200%204.85222%200C5.12515%200%205.36776%200.0808703%205.58005%200.242611L9.21921%202.97198C9.37084%203.08318%209.48972%203.2247%209.57585%203.39655C9.66198%203.5684%209.70484%203.75036%209.70443%203.94243V9.40117C9.70443%209.73476%209.58555%2010.0204%209.34779%2010.2582C9.11004%2010.496%208.82456%2010.6146%208.49138%2010.6142H6.6718C6.49995%2010.6142%206.356%2010.556%206.23995%2010.4395C6.1239%2010.3231%206.06567%2010.1791%206.06527%2010.0077V6.97506C6.06527%206.80321%206.00704%206.65926%205.89059%206.54321C5.77414%206.42717%205.63019%206.36894%205.45874%206.36853H4.24569C4.07384%206.36853%203.92989%206.42676%203.81384%206.54321C3.69779%206.65967%203.63957%206.80362%203.63916%206.97506V10.0077C3.63916%2010.1795%203.58094%2010.3237%203.46448%2010.4402C3.34803%2010.5566%203.20408%2010.6146%203.03264%2010.6142H1.21305C0.879464%2010.6142%200.593992%2010.4955%200.356638%2010.2582C0.119284%2010.0208%200.000404351%209.73516%200%209.40117Z'%20fill='%230076BC'/%3e%3c/svg%3e" alt="reports time" className="w-[14px] lg:w-[18px] h-[14px] lg:h-[18px] mt-0.5 opacity-60" />
                          <span className="text-[10px] lg:text-[12px] text-gray-700 leading-tight font-medium">Reports within<br/>{test.reports || '12 hours'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 w-full mt-auto">
                        <button onClick={() => (window as any).appNavigate('/test/' + test.id)} className="flex-1 py-1.5 lg:py-3 border border-[#0076BC] text-[#0076BC] rounded-md lg:rounded-xl font-bold text-[10px] lg:text-[14px] hover:bg-blue-50 transition-colors bg-white">View Details</button>
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
                      </div>
                    </div>
                    
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
