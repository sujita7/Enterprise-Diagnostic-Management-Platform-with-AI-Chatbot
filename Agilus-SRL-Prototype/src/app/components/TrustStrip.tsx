import { Award, FlaskConical, Building2, Target } from 'lucide-react';

export function TrustStrip() {
  const stats = [
    {
      icon: Award,
      value: '29+',
      label: 'Years of Excellence',
      color: 'blue'
    },
    {
      icon: FlaskConical,
      value: '30Cr+',
      label: 'Tests Delivered',
      color: 'teal'
    },
    {
      icon: Building2,
      value: '400+',
      label: 'Labs Nationwide',
      color: 'purple'
    },
    {
      icon: Target,
      value: '40+',
      label: 'NABL & CAP Accredited',
      color: 'green'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-blue-50/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className={`w-14 h-14 rounded-xl ${colorClasses[stat.color]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-0.5">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
