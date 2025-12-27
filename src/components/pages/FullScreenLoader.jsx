import React from 'react';
import { Loader2 } from 'lucide-react';

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      
      <div className="relative flex items-center justify-center">
        {/* Outer Ring - Orange (Accent) */}
        <div className="absolute w-20 h-20 border-4 border-transparent border-t-[#FF6D1F] border-b-[#FF6D1F] rounded-full animate-spin"></div>
        
        {/* Inner Ring - Teal (Primary) */}
        <div className="w-14 h-14 border-4 border-transparent border-l-[#008080] border-r-[#008080] rounded-full animate-[spin_1s_linear_infinite_reverse]"></div>
        
        {/* Central Logo Dot */}
        <div className="absolute w-3 h-3 bg-[#008080] rounded-full shadow-[0_0_10px_rgba(0,128,128,0.5)]"></div>
      </div>
      
      {/* Branding Section */}
      <div className="mt-8 text-center">
        <div className="text-3xl font-extrabold tracking-tighter mb-2">
          <span className="text-[#008080]">Zap</span>
          <span className="text-[#FF6D1F]">it</span>
        </div>
        <p className="text-slate-500 font-medium tracking-wide animate-pulse uppercase text-[10px]">
          Everything delivered in minutes
        </p>
      </div>

      {/* Modern Progress Bar (Optional Visual) */}
      <div className="mt-6 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#008080] to-[#FF6D1F] w-1/2 animate-[loading_1.5s_ease-in-out_infinite] origin-left"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.5); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
      `}} />
    </div>
  );
};

export default FullScreenLoader;