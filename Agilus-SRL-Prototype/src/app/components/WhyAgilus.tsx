import { Globe, Home, Award, FileText, Headphones } from 'lucide-react';

export function WhyAgilus() {
  const features = [
    {
      icon: Globe,
      title: 'Trusted nationwide network',
      description: '400+ labs across India with 29+ years of diagnostic excellence and proven reliability',
      color: 'blue'
    },
    {
      icon: Home,
      title: 'Home collection convenience',
      description: 'Book sample collection at your doorstep with trained phlebotomists at your preferred time',
      color: 'teal'
    },
    {
      icon: Award,
      title: 'Accredited diagnostics',
      description: '40+ NABL & 2 CAP accredited labs ensuring highest quality standards and accuracy',
      color: 'purple'
    },
    {
      icon: FileText,
      title: 'Reliable digital reports',
      description: 'Fast turnaround time with secure online access to reports anytime, anywhere',
      color: 'green'
    },
    {
      icon: Headphones,
      title: 'Support when needed',
      description: '24/7 customer support to help you understand your reports and book follow-up consultations',
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-600',
      gradient: 'from-blue-600 to-blue-700'
    },
    teal: {
      bg: 'bg-teal-50',
      icon: 'bg-teal-600',
      gradient: 'from-teal-600 to-teal-700'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-600',
      gradient: 'from-purple-600 to-purple-700'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-600',
      gradient: 'from-green-600 to-green-700'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-600',
      gradient: 'from-orange-600 to-orange-700'
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2 md:mb-4">
            Why choose Agilus Diagnostics
          </h2>
          <p className="text-sm md:text-lg text-gray-600">
            Trusted by millions for accurate, reliable, and accessible healthcare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            return (
              <div
                key={index}
                className={`relative p-5 md:p-8 ${colors.bg} rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all`}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative flex gap-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
