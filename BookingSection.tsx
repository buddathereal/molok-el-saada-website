import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface BookingSectionProps {
  onBookNow: () => void;
  onBrowsePackages?: () => void;
  onBrowseEquipment?: () => void;
}

interface StepItem {
  id: number;
  num: string;
  title: string;
  desc: string;
}

const STEPS: StepItem[] = [
  {
    id: 0,
    num: '01',
    title: 'استشارة',
    desc: 'نتعرف على رؤيتك واحتياجاتك'
  },
  {
    id: 1,
    num: '02',
    title: 'اختيار الباقة',
    desc: 'نساعدك في اختيار الباقة المثالية ليومك'
  },
  {
    id: 2,
    num: '03',
    title: 'تأكيد الحجز',
    desc: 'نؤكد التفاصيل ونضمن تجربة لا تُنسى'
  }
];

export const BookingSection: React.FC<BookingSectionProps> = ({
  onBookNow,
  onBrowsePackages,
  onBrowseEquipment
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const handleBrowseEquipment = onBrowseEquipment || onBrowsePackages;

  // Smooth auto-cycle between steps (6 seconds) with user interactive selection
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      dir="rtl" 
      className="pt-2 sm:pt-4 md:pt-6 pb-16 sm:pb-20 md:pb-28 bg-transparent relative overflow-hidden gsap-section"
      aria-label="قسم حجز المواعيد والاستشارة"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Soft, harmonious luxury container flowing naturally from the Hero */}
        <div className="max-w-4xl mx-auto rounded-3xl md:rounded-[2.5rem] bg-[#0c0a08]/75 md:bg-[#090807]/80 border border-[#c5a059]/20 p-6 sm:p-10 md:p-14 text-center backdrop-blur-md relative overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.6)]">
          
          {/* Subtle Ambient Gold Radial Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 md:w-[450px] h-40 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none" />

          {/* Eyebrow Text: RESERVE YOUR DATE */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-2 relative z-10"
          >
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-[#c5a059] font-numbers">
              RESERVE YOUR DATE
            </span>
          </motion.div>

          {/* 3. Main Arabic Heading: رحلتك نحو الكمال */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black text-white font-header mb-3 tracking-tight leading-tight drop-shadow-md relative z-10"
          >
            رحلتك نحو الكمال
          </motion.h2>

          {/* 4. Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300 text-xs sm:text-sm md:text-base font-medium max-w-lg mx-auto mb-8 sm:mb-10 relative z-10 leading-relaxed"
          >
            خلّينا نخطط ليومك المميز بأجمل التفاصيل
          </motion.p>

          {/* 5. The 3 Booking Steps (Refined, peaceful timeline design) */}
          <div className="mb-8 sm:mb-10 relative z-10">
            
            {/* DESKTOP TIMELINE (Horizontal) */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-6 relative">
              {/* Connecting Subtle Timeline Line */}
              <div className="absolute top-5 inset-x-12 h-[1px] bg-white/10 -z-0">
                <motion.div 
                  className="h-full bg-gradient-to-l from-[#c5a059] to-[#8b6914]"
                  initial={false}
                  animate={{ 
                    width: activeStep === 0 ? '25%' : activeStep === 1 ? '65%' : '100%' 
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {STEPS.map((step) => {
                const isActive = activeStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`relative flex flex-col items-center text-center p-3.5 rounded-2xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]/50 ${
                      isActive 
                        ? 'bg-[#141210]/90 border border-[#c5a059]/40 shadow-[0_6px_20px_rgba(0,0,0,0.45)]' 
                        : 'bg-transparent border border-transparent hover:border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Number Badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-numbers font-black text-xs sm:text-sm mb-2.5 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'bg-gradient-to-br from-[#edd79d] via-[#c5a059] to-[#98762e] text-black shadow-[0_0_15px_rgba(197,160,89,0.45)] scale-105' 
                        : 'bg-[#181614] text-zinc-400 border border-white/10'
                    }`}>
                      {step.num}
                    </div>

                    {/* Step Title */}
                    <h3 className={`text-sm sm:text-base font-black font-header mb-1 transition-colors ${
                      isActive ? 'text-royal-gold' : 'text-white'
                    }`}>
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-zinc-400 text-xs leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* MOBILE & TABLET TIMELINE (Vertical rows) */}
            <div className="md:hidden flex flex-col gap-2.5 text-right">
              {STEPS.map((step) => {
                const isActive = activeStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-right w-full cursor-pointer focus:outline-none ${
                      isActive
                        ? 'bg-[#141210] border border-[#c5a059]/40 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'
                        : 'bg-[#0e0c0a]/60 border border-white/5 opacity-80'
                    }`}
                  >
                    {/* Number Badge */}
                    <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-numbers font-black text-xs transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-[#edd79d] via-[#c5a059] to-[#98762e] text-black shadow-[0_0_12px_rgba(197,160,89,0.4)]'
                        : 'bg-[#181614] text-zinc-400 border border-white/10'
                    }`}>
                      {step.num}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-xs sm:text-sm font-black font-header truncate ${
                          isActive ? 'text-royal-gold' : 'text-white'
                        }`}>
                          {step.title}
                        </h3>
                        {isActive && (
                          <span className="text-[9px] font-bold text-royal-gold bg-[#c5a059]/10 px-2 py-0.5 rounded-full border border-[#c5a059]/20 font-numbers shrink-0">
                            الخطوة الحالية
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed mt-0.5 font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* 6. CTA Action Buttons: Side-by-side on desktop, vertical on mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto relative z-10">
            
            {/* Primary CTA Button: Champagne Gold Filled */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookNow}
              className="w-full sm:w-auto sm:flex-1 min-h-[48px] py-3.5 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#edd79d] via-[#c5a059] to-[#ab8436] text-black font-header font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(197,160,89,0.35)] hover:shadow-[0_12px_35px_rgba(197,160,89,0.5)] border border-[#fff2cb]/60 transition-all duration-300 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white group"
            >
              <span>احجز موعدك الآن</span>
              <ArrowLeft className="w-4 h-4 text-black shrink-0 transition-transform group-hover:-translate-x-1" />
            </motion.button>

            {/* Secondary CTA Button: Transparent Dark with Thin Champagne Gold Border */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBrowseEquipment}
              className="w-full sm:w-auto sm:flex-1 min-h-[48px] py-3.5 px-6 sm:px-8 rounded-full bg-[#0c0a08]/80 hover:bg-[#c5a059]/15 text-[#edd79d] hover:text-white font-header font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#c5a059]/40 hover:border-[#c5a059] transition-all duration-300 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-gold"
            >
              <span>تصفح معداتنا وخدماتنا</span>
            </motion.button>

          </div>

        </div>

      </div>
    </section>
  );
};
