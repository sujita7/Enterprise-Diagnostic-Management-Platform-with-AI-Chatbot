import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../../store/packageSlice';
import { Check, ArrowRight, Clock, FlaskConical, Home } from 'lucide-react';

export function HealthPackages() {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state: any) => state.packages);

  const [activeTab, setActiveTab] = useState('Full Body');

  useEffect(() => {
    dispatch(fetchPackages() as any);
  }, [dispatch]);

  const tabs = ['Full Body', 'Diabetes', 'Thyroid', "Women's Health", 'Senior Care'];

  const currentPackages = packages.filter((pkg: any) => {
    if (activeTab === "Women's Health") {
      return pkg.category === "Women's Care" || pkg.category === "Women's Health";
    }
    return pkg.category === activeTab;
  });


  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">
            Most-booked health packages
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive screening at unbeatable prices
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-3 gap-6">
          {currentPackages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 p-8 hover:shadow-xl transition-all ${
                pkg.popular ? 'border-blue-600' : 'border-gray-100'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {pkg.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{pkg.tests} Tests included</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Reports in {pkg.reports}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Home className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Home collection available</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">₹{pkg.price}</span>
                  <span className="text-lg text-gray-400 line-through">₹{pkg.originalPrice}</span>
                  <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                    {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => (window as any).appNavigate('/package/' + pkg.id)} className="flex-1 py-2.5 border border-[#0076BC] text-[#0076BC] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors bg-white">View Details</button>
                  <button className="flex-1 py-2.5 bg-[#0076BC] text-white rounded-xl font-bold text-sm hover:bg-[#0A366B] transition-colors">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
