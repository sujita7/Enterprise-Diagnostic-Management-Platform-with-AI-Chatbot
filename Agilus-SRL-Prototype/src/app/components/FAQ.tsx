import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Send, Loader2, Sparkles } from 'lucide-react';
import api from '../../api/axiosConfig';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (faqRef.current && !faqRef.current.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const faqs = [
    {
      question: 'How do I book a test with Agilus Diagnostics?',
      answer: 'You can book a test through our website, mobile app, or by calling our customer support. Simply search for the test you need, select your preferred time slot, and choose between home collection or lab visit.'
    },
    {
      question: 'Is home sample collection available in my area?',
      answer: 'We offer home collection services in 650+ cities across India. Enter your pincode on our website or app to check availability in your area. Our trained phlebotomists will collect samples at your doorstep at your preferred time.'
    },
    {
      question: 'How quickly will I receive my reports?',
      answer: 'Report turnaround time varies by test type. Most routine tests are delivered within 24 hours, while specialized tests may take 48-72 hours. You can track your report status in real-time through our app or website.'
    },
    {
      question: 'Are your labs accredited and certified?',
      answer: 'Yes, we have 40+ NABL (National Accreditation Board for Testing and Calibration Laboratories) and 2 CAP (College of American Pathologists) accredited labs. This ensures the highest standards of quality and accuracy in diagnostics.'
    },
    {
      question: 'Can I upload my prescription to get test recommendations?',
      answer: 'Absolutely! You can upload your prescription through our website or app, and our team will recommend the appropriate tests. You can also consult with our healthcare experts if you need guidance on which tests to take.'
    },
    {
      question: 'How can I access my previous reports?',
      answer: 'All your reports are securely stored in your account and can be accessed anytime through our app or website. You can view, download, and share reports with your doctor easily from your dashboard.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including credit/debit cards, net banking, UPI, digital wallets, and cash on delivery for home collection services. All online payments are secure and encrypted.'
    },
    {
      question: 'Do you offer health packages for families?',
      answer: 'Yes, we offer comprehensive health packages tailored for individuals and families. These packages cover essential tests at discounted rates and can be customized based on age, gender, and specific health concerns.'
    }
  ];

  const handleAskQuestion = async () => {
    if (!customQuestion.trim()) return;
    setIsAsking(true);
    setCustomAnswer("");
    try {
      const response = await api.post('ai/chat/', { message: customQuestion, history: [] });
      setCustomAnswer(response.data.reply);
    } catch (error) {
      console.error("Failed to ask question", error);
      setCustomAnswer("I'm sorry, I couldn't find an answer to that right now.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-[24px] md:text-4xl font-semibold text-gray-900 mb-2 md:mb-4 text-center">
            Frequently asked questions
          </h2>
          <p className="text-[14px] md:text-[lg] text-gray-600">
            Everything you need to know about our services
          </p>
        </div>

        <div className="space-y-4" ref={faqRef}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-250 shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.18)] rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
              <span className={`font-semibold text-[14px] md:text-[17px] pr-4 md:pr-8 transition-all underline-offset-4 ${
                  openIndex === index
                    ? 'text-[#0076BC] underline decoration-[#0076BC]'
                    : 'text-gray-900 group-hover:text-[#0076BC] group-hover:underline group-hover:decoration-[#0076BC]'
                }`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 ease-in-out ${
                    openIndex === index ? 'rotate-180 text-[#0076BC]' : 'text-gray-400 group-hover:text-[#0076BC]'
                  }`}
                />
              </button>
              
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 md:px-6 pb-4 md:pb-6 text-gray-600 leading-relaxed text-[13px] md:text-[15px]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic FAQ Input */}
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#0076BC]" />
            <h3 className="text-lg font-bold text-gray-900">Don't see your question? Ask our AI</h3>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="e.g. How long should I fast before a sugar test?"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0076BC] outline-none"
            />
            <button 
              onClick={handleAskQuestion}
              disabled={isAsking || !customQuestion.trim()}
              className="px-6 rounded-xl bg-gradient-to-r from-[#1055A8] to-[#0076BC] text-white font-bold hover:shadow-md transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isAsking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          {customAnswer && (
            <div className="mt-4 p-4 bg-white border border-blue-50 rounded-xl text-gray-700 text-sm leading-relaxed animate-fade-in-down">
              {customAnswer}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
