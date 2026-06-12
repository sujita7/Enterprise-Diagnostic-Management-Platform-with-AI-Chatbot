import { Search, Upload, HeartPulse, Headphones, ArrowRight } from 'lucide-react';

export function GuidedIntent() {
  const cards = [
    {
      icon: Search,
      title: 'I know my test',
      description: 'Search and book specific tests directly',
      color: 'blue',
      cta: 'Search tests'
    },
    {
      icon: Upload,
      title: 'I have a prescription',
      description: 'Upload and get recommended tests instantly',
      color: 'teal',
      cta: 'Upload now'
    },
    {
      icon: HeartPulse,
      title: 'I want a full body checkup',
      description: 'Explore comprehensive health packages',
      color: 'purple',
      cta: 'View packages'
    },
    {
      icon: Headphones,
      title: 'I need reports or support',
      description: 'Access reports or talk to our team',
      color: 'green',
      cta: 'Get help'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      hover: 'hover:border-blue-600 hover:shadow-blue-500/10',
      text: 'text-blue-600'
    },
    teal: {
      bg: 'bg-teal-50',
      icon: 'bg-teal-100 text-teal-600',
      hover: 'hover:border-teal-600 hover:shadow-teal-500/10',
      text: 'text-teal-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-100 text-purple-600',
      hover: 'hover:border-purple-600 hover:shadow-purple-500/10',
      text: 'text-purple-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
      hover: 'hover:border-green-600 hover:shadow-green-500/10',
      text: 'text-green-600'
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">
            What brings you here today?
          </h2>
          <p className="text-lg text-gray-600">
            Choose your path to better health
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const colors = colorClasses[card.color];
            return (
              <button
                key={index}
                className={`group p-8 bg-white rounded-2xl border-2 border-gray-100 ${colors.hover} hover:shadow-xl transition-all text-left relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full -translate-y-16 translate-x-16 opacity-40 group-hover:scale-150 transition-transform duration-500`} />
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className={`flex items-center gap-2 ${colors.text} font-medium group-hover:gap-3 transition-all`}>
                    <span>{card.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
