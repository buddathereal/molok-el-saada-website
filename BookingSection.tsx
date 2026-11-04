import React, { useState } from 'react';
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

  return (
    <section
      dir="rtl"
      className="pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20 md:pb-24 bg-transparent relative overflow-hidden gsap-section"
      aria-label="قسم حجز المواعيد والاستشارة"
    >
      <div className="royal-container relative z-10">
        {/* Soft, harmonious luxury container flowing naturally from the Hero */}
        <div className="max-w-4xl mx-auto rounded-3xl md:rounded-[2.25rem] bg-[#0c0a08]/80 md:bg-[#090807]/85 border border-[#c5a059]/25 p-6 sm:p-10 md:p-14 text-center backdrop-blur-md relative overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.65)]">
          {/* Subtle Ambient Gold Radial Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 md:w-[450px] h-40 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none" />

          {/* Eyebrow Text: RESERVE YOUR DATE */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-3 relative z-10"
          >
            <span
              dir="ltr"
              className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#c5a059] font-numbers"
            >
              RESERVE YOUR DATE
            </span>
          </motion.div>

          {/* Main Arabic Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold text-white font-header mb-3 leading-snug drop-shadow-md relative z-10"
          >
            قولنا مناسبتك إمتى وفين
          </motion.h2>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-200 text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto mb-8 sm:mb-10 relative z-10 leading-relaxed"
          >
            وإحنا هنجهزلك كوتيشن مناسب لتفاصيل مناسبتك
          </motion.p>

          {/* The 3 Booking Steps */}
          <div className="mb-8 sm:mb-10 relative z-10">
            {/* DESKTOP TIMELINE (Horizontal) */}
            <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6 relative">
              {/* Connecting Subtle Timeline Line */}
              <div className="absolute top-6 inset-x-14 h-[1px] bg-white/10 -z-0">
                <motion.div
                  className="h-full bg-gradient-to-l from-[#c5a059] to-[#8b6914]"
                  initial={false}
                  animate={{
                    width: activeStep === 0 ? '25%' : activeStep === 1 ? '65%' : '100%'
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>

              {STEPS.map((step) => {
                const isActive = activeStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`relative flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]/50 ${
                      isActive
                        ? 'bg-[#141210]/95 border border-[#c5a059]/45 shadow-[0_8px_24px_rgba(0,0,0,0.45)]'
                        : 'bg-white/[0.02] border border-white/5 hover:border-white/15 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-numbers font-extrabold text-sm mb-3 transition-all duration-300 z-10 ${
                        isActive
                          ? 'bg-gradient-to-br from-[#edd79d] via-[#c5a059] to-[#98762e] text-black shadow-[0_0_15px_rgba(197,160,89,0.45)] scale-105'
                          : 'bg-[#181614] text-zinc-300 border border-white/10'
                      }`}
                    >
                      {step.num}
                    </div>

                    <h3
                      className={`text-base lg:text-lg font-bold font-header mb-1.5 transition-colors ${
                        isActive ? 'text-royal-gold' : 'text-white'
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="text-zinc-300 text-xs lg:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* MOBILE & TABLET TIMELINE (Vertical rows) */}
            <div className="md:hidden flex flex-col gap-3 text-right">
              {STEPS.map((step) => {
                const isActive = activeStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`relative flex items-center gap-3.5 p-3.5 min-h-[56px] rounded-2xl transition-all duration-300 text-right w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] ${
                      isActive
                        ? 'bg-[#141210] border border-[#c5a059]/45 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'
                        : 'bg-[#0e0c0a]/70 border border-white/10 opacity-90'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-numbers font-extrabold text-xs transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-[#edd79d] via-[#c5a059] to-[#98762e] text-black shadow-[0_0_12px_rgba(197,160,89,0.4)]'
                          : 'bg-[#181614] text-zinc-300 border border-white/10'
                      }`}
                    >
                      {step.num}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-sm sm:text-base font-bold font-header truncate ${
                            isActive ? 'text-royal-gold' : 'text-white'
                          }`}
                        >
                          {step.title}
                        </h3>
                        {isActive && (
                          <span className="text-[11px] font-bold text-royal-gold bg-[#c5a059]/10 px-2.5 py-0.5 rounded-full border border-[#c5a059]/25 shrink-0">
                            الخطوة الحالية
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed mt-1">
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-lg mx-auto relative z-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookNow}
              className="royal-btn-primary w-full sm:w-auto sm:flex-1 min-h-[50px] py-3.5 px-6 sm:px-8 rounded-full text-sm sm:text-base font-extrabold group"
            >
              <span>احجز موعدك الآن</span>
              <ArrowLeft className="w-4 h-4 text-black shrink-0 transition-transform group-hover:-translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBrowseEquipment}
              className="royal-btn-secondary w-full sm:w-auto sm:flex-1 min-h-[50px] py-3.5 px-6 sm:px-8 rounded-full text-sm sm:text-base font-bold"
            >
              <span>تصفح معداتنا وخدماتنا</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
