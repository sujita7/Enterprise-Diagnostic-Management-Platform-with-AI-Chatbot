import { ArrowLeft } from 'lucide-react';
import errorGraphic from '../../assets/icons/404_error.svg';

interface NotFoundProps {
  onNavigate?: (path: string) => void;
}

export function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="py-20 bg-white flex flex-col items-center justify-center font-sans text-center px-6 relative overflow-hidden">
      
      <div className="flex flex-col items-center max-w-2xl">
        
        <div className="mb-8 scale-100">
          <img src={errorGraphic} alt="404 Error" className="w-full max-w-[380px] h-auto" />
        </div>

       

    
        <h2 className="text-[28px] md:text-[34px] font-bold text-[#0076BC] mb-3 tracking-tight">
          Hmm... something's not right
        </h2>

       
        <p className="text-[14px] md:text-[16px] text-gray-400 mb-10 font-medium">
          Don't worry, we'll help you find your way
        </p>

        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate?.('/'); }}
          className="flex items-center gap-2 text-[#0076BC] font-bold text-[16px] hover:underline underline-offset-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </a>
      </div>
    </div>
  );
}
