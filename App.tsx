
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { X, ChevronRight, ArrowRight, ArrowLeft, ShoppingBasket, Sparkles, Award, Crown, Compass, Gem } from 'lucide-react';
import { BEVERAGES_MENU, SOFT_DRINKS, SERVICE_COSTS, EQUIPMENT_DATA, BEVERAGES_CATEGORIES } from './data';
import { MenuPackage, EquipmentCategory, EquipmentItem } from './types';
import { OfficeMap } from './OfficeMap';
import { useGsapScrollTrigger } from './useGsap';
import { BookingSection } from './BookingSection';

// --- CONFIGURATION ---
const USER_LOGO_URL = "https://i.postimg.cc/xj33dFYd/Picsart-26-01-31-03-15-31-627.png"; 
const WHATSAPP_PHONE = "201097356529";
const WHATSAPP_BUSINESS_LINK = "https://wa.me/201097356529";

// --- Shared Components ---

const BrandLogo: React.FC<{ className?: string; showGlow?: boolean; imgStyle?: React.CSSProperties }> = ({ 
  className = "w-20 h-20", 
  showGlow = true,
  imgStyle
}) => {
  return (
    <motion.div 
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`${className} relative flex items-center justify-center overflow-visible group transition-transform duration-700`}
    >
      {showGlow && (
        <div className="absolute inset-0 bg-[#c5a059]/10 blur-[30px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      )}
      
      {USER_LOGO_URL ? (
        <img 
          src={USER_LOGO_URL} 
          alt="Molok El Saada Logo" 
          className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          style={imgStyle}
        />
      ) : (
        <span className="text-[#c5a059] font-black text-xs font-header">ملوك السعادة</span>
      )}
    </motion.div>
  );
};

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CustomerInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  info: {
    name: string;
    phone: string;
    eventDate: string;
    eventLocation: string;
    message: string;
    agreedToDeposit: boolean;
  };
  setInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    phone: string;
    eventDate: string;
    eventLocation: string;
    message: string;
    agreedToDeposit: boolean;
  }>>;
}> = ({ isOpen, onClose, onConfirm, info, setInfo }) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم تحديد الموقع");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setInfo(prev => ({ ...prev, eventLocation: locationLink }));
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("فشل تحديد الموقع، يرجى إدخاله يدوياً");
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#0c0c0c] border border-[#c5a059]/30 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 text-right"
          >
            <div className="p-6 border-b border-[#c5a059]/10 flex justify-between items-center flex-row-reverse">
              <h3 className="text-white font-black font-header text-xl">تأكيد بيانات الحجز</h3>
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">الاسم ثنائي</label>
                <input 
                  type="text" 
                  value={info.name}
                  onChange={(e) => setInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-royal-gold/50 outline-none transition-all text-right focus:ring-1 focus:ring-royal-gold/20"
                  placeholder="أدخل اسمك بالكامل (ثنائي على الأقل)"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">رقم الهاتف</label>
                <input 
                  type="tel" 
                  value={info.phone}
                  onChange={(e) => setInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-royal-gold/50 outline-none transition-all text-right focus:ring-1 focus:ring-royal-gold/20"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">ميعاد المناسبة</label>
                <input 
                  type="text" 
                  value={info.eventDate}
                  onChange={(e) => setInfo(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-royal-gold/50 outline-none transition-all text-right focus:ring-1 focus:ring-royal-gold/20"
                  placeholder="مثال: الجمعة القادمة الساعة 8 مساءً"
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <button 
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="text-[9px] text-royal-gold font-black uppercase tracking-widest hover:underline disabled:opacity-50"
                  >
                    {isGettingLocation ? 'جاري التحديد...' : 'تحديد موقعي الحالي 📍'}
                  </button>
                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">مكان المناسبة أو اللوكيشن (اختياري)</label>
                </div>
                <input 
                  type="text" 
                  value={info.eventLocation}
                  onChange={(e) => setInfo(prev => ({ ...prev, eventLocation: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-royal-gold/50 outline-none transition-all text-right focus:ring-1 focus:ring-royal-gold/20"
                  placeholder="أدخل العنوان أو رابط اللوكيشن"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">ملاحظات إضافية</label>
                <textarea 
                  value={info.message}
                  onChange={(e) => setInfo(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-royal-gold/50 outline-none transition-all text-right focus:ring-1 focus:ring-royal-gold/20 min-h-[100px] resize-none"
                  placeholder="أدخل أي ملاحظات أو طلبات خاصة هنا..."
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group flex-row-reverse text-right">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={info.agreedToDeposit}
                      onChange={(e) => setInfo(prev => ({ ...prev, agreedToDeposit: e.target.checked }))}
                      className="peer sr-only"
                    />
                    <div className="w-6 h-6 border-2 border-white/10 rounded-lg group-hover:border-royal-gold/50 transition-all peer-checked:bg-royal-gold peer-checked:border-royal-gold flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-black scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-300 font-bold leading-relaxed">
                    أقر بالموافقة على دفع <span className="text-royal-gold">30% ديبوزت (عربون)</span> من إجمالي المبلغ لتأكيد الحجز.
                  </span>
                </label>
              </div>
            </div>
            
            <div className="p-6 bg-[#111] border-t border-[#c5a059]/10">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={!info.name || !info.phone || !info.eventDate || !info.agreedToDeposit}
                className="royal-btn-primary w-full py-4 text-xs md:text-sm font-black uppercase tracking-widest disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2.5 shadow-xl"
              >
                <span>تأكيد الطلب وإرسال للواتساب</span>
                <WhatsAppIcon className="w-4.5 h-4.5 text-black" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ChafingDishIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18M3 12a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4zM7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M12 18v2M9 20h6" />
  </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const FloatingCart: React.FC<{
  selectedEquipment: string[];
  equipmentQuantities: Record<string, number>;
  onQuantityChange: (id: string, delta: number) => void;
  onRemoveEquipment: (id: string) => void;
  onShare: (items: EquipmentItem[]) => void;
  allEquipmentItems: EquipmentItem[];
  selectedBeverages: string[];
  beverageQuantities: Record<string, number>;
  onBeverageQuantityChange: (item: string, delta: number) => void;
  onRemoveBeverage: (item: string) => void;
  selectedDrinks: string[];
  onRemoveDrink: (item: string) => void;
  selectedExtraServices: string[];
  onRemoveService: (item: string) => void;
  selectedPkg: MenuPackage | undefined;
  onRemovePkg: () => void;
  calcPax: number;
  onPaxChange: (val: number) => void;
  onMenuOrder: () => void;
  totalPrice: number;
  onClearAll: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onZoom: (img: string) => void;
  navigateTo: (newView: any, extra?: any) => void;
}> = ({ 
  selectedEquipment, 
  equipmentQuantities, 
  onQuantityChange, 
  onRemoveEquipment,
  onShare, 
  allEquipmentItems,
  selectedBeverages,
  beverageQuantities,
  onBeverageQuantityChange,
  onRemoveBeverage,
  selectedDrinks,
  drinkQuantities,
  onDrinkQuantityChange,
  onRemoveDrink,
  selectedExtraServices,
  serviceQuantities,
  onServiceQuantityChange,
  onRemoveService,
  selectedPkg,
  onRemovePkg,
  calcPax,
  onPaxChange,
  onMenuOrder,
  totalPrice,
  onClearAll,
  isOpen,
  setIsOpen,
  onZoom,
  navigateTo
}) => {
  const [hasClosedOnce, setHasClosedOnce] = useState(false);

  useEffect(() => {
    const hasItems = selectedPkg || selectedBeverages.length > 0 || selectedDrinks.length > 0 || selectedExtraServices.length > 0 || selectedEquipment.length > 0;
    if (hasItems && !hasClosedOnce && !isOpen) {
      setIsOpen(true);
    }
  }, [selectedPkg, selectedBeverages, selectedDrinks, selectedExtraServices, selectedEquipment, hasClosedOnce, isOpen, setIsOpen]);
  
  const selectedEquipItems = useMemo(() => {
    return allEquipmentItems.filter(item => selectedEquipment.includes(item.id));
  }, [selectedEquipment, allEquipmentItems]);

  const hasItems = selectedEquipment.length > 0 || selectedBeverages.length > 0 || selectedPkg !== undefined || selectedDrinks.length > 0 || selectedExtraServices.length > 0;
  const totalItemsCount = selectedEquipment.length + selectedBeverages.length + (selectedPkg ? 1 : 0) + selectedDrinks.length + selectedExtraServices.length;

  const prevLength = useRef(totalItemsCount);
  useEffect(() => {
    if (prevLength.current === 0 && totalItemsCount > 0 && !hasClosedOnce) {
      setIsOpen(true);
    }
    prevLength.current = totalItemsCount;
  }, [totalItemsCount, hasClosedOnce]);

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0.75rem)+5rem)] left-3 right-3 sm:left-10 sm:right-auto md:bottom-10 z-[100] flex justify-start pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-[#0c0c0c]/95 backdrop-blur-2xl border border-[#c5a059]/30 w-full sm:w-[360px] md:w-[400px] max-h-[75dvh] sm:max-h-[650px] h-[75dvh] sm:h-[650px] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden origin-bottom-left text-right pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 bg-white/[0.02] border-b border-[#c5a059]/10 flex flex-col gap-4">
              <div className="flex justify-between items-center flex-row-reverse">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <BrandLogo className="w-10 h-10" showGlow={false} />
                  <div className="text-right">
                    <h4 className="text-white text-xs font-black uppercase tracking-widest gold-text-shimmer">
                      سلة الطلبات
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold">
                        {totalItemsCount} Items Selected
                      </span>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasItems && (
                    <button 
                      onClick={onClearAll}
                      className="text-[9px] text-red-500 font-black uppercase tracking-widest hover:text-red-400 transition-colors"
                    >
                      مسح الكل
                    </button>
                  )}
                  <button onClick={() => { setIsOpen(false); setHasClosedOnce(true); }} className="w-11 h-11 md:w-10 md:h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* PAX Selection in Cart */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2 flex-row-reverse">
                  <span className="text-[10px] font-black text-royal-gold uppercase tracking-widest">عدد الأفراد (PAX)</span>
                  <span className="text-white font-black font-numbers text-lg">{calcPax}</span>
                </div>
                <input 
                  type="range" 
                  min="25" 
                  max="1000" 
                  step="5"
                  value={calcPax} 
                  onChange={(e) => onPaxChange(parseInt(e.target.value))}
                  className="w-full accent-royal-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {hasItems ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                      {/* Menu Package */}
                      {selectedPkg && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-3"
                        >
                          <h6 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">المنيو المختار</h6>
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 hover:border-royal-gold/20 transition-colors">
                            <div className="flex items-center justify-between flex-row-reverse gap-4">
                              <div className="flex-1 text-right">
                                <h5 className="text-white text-[10px] font-black mb-1">{selectedPkg.title}</h5>
                                <div className="flex flex-col gap-1">
                                  <p className="text-royal-gold text-[9px] font-black">
                                    {selectedPkg.perPerson ? (
                                      <>
                                        {selectedPkg.price} ج.م للفرد × {calcPax} فرد
                                      </>
                                    ) : (
                                      <>سعر الباكدج: {selectedPkg.price} ج.م</>
                                    )}
                                  </p>
                                  <p className="text-white text-[10px] font-black">
                                    الإجمالي: {(selectedPkg.perPerson ? selectedPkg.price * calcPax : selectedPkg.price).toLocaleString()} ج.م
                                  </p>
                                </div>
                              </div>
                              <button onClick={onRemovePkg} className="text-zinc-600 hover:text-red-500 transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Other Selected Items (Beverages) */}
                      {selectedBeverages.length > 0 && (
                        <div className="space-y-3">
                          <h6 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">الأصناف المختارة</h6>
                          <AnimatePresence mode="popLayout">
                            {selectedBeverages.map((item, idx) => {
                              const match = item.match(/—\s*(\d+)\s*ج/);
                              const price = match ? parseInt(match[1]) : 0;
                              const qty = beverageQuantities[item] || 1;
                              return (
                                <motion.div 
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  key={`b-${idx}`} 
                                  className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between flex-row-reverse gap-4 group hover:border-royal-gold/30 transition-all"
                                >
                                  <div className="flex-1 text-right">
                                    <h5 className="text-white text-[10px] font-black leading-tight mb-1">{item}</h5>
                                    {price > 0 && <p className="text-royal-gold text-[9px] font-bold mb-2">{(price * qty).toLocaleString()} ج.م</p>}
                                    <div className="flex items-center justify-end gap-3">
                                      <button 
                                        onClick={() => onBeverageQuantityChange(item, -1)}
                                        className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white text-xs"
                                      >
                                        -
                                      </button>
                                      <span className="text-white font-black font-numbers text-xs">{qty}</span>
                                      <button 
                                        onClick={() => onBeverageQuantityChange(item, 1)}
                                        className="w-6 h-6 rounded-lg bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <button onClick={() => onRemoveBeverage(item)} className="text-zinc-600 hover:text-red-500 transition-colors p-1">
                                    <X className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Addons/Drinks */}
                      {(selectedDrinks.length > 0 || selectedExtraServices.length > 0) && (
                        <div className="space-y-3">
                          <h6 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">الإضافات والخدمات</h6>
                          <AnimatePresence mode="popLayout">
                            {selectedDrinks.map((item, idx) => {
                              const drkData = SOFT_DRINKS.find(d => d.name === item);
                              const price = drkData?.price || 0;
                              const qty = drinkQuantities[item] || 1;
                              return (
                                <motion.div 
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  key={`drk-${idx}`} 
                                  className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between flex-row-reverse gap-4"
                                >
                                  <div className="flex-1 text-right">
                                    <h5 className="text-white text-[10px] font-black leading-tight mb-1">{item}</h5>
                                    {price > 0 && (
                                      <div className="mb-2">
                                        <p className="text-zinc-500 text-[8px] font-bold">{price} ج.م × {qty}</p>
                                        <p className="text-royal-gold text-[9px] font-bold">{(price * qty).toLocaleString()} ج.م</p>
                                      </div>
                                    )}
                                    <div className="flex items-center justify-end gap-3">
                                      <button 
                                        onClick={() => onDrinkQuantityChange(item, -1)}
                                        className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white text-xs"
                                      >
                                        -
                                      </button>
                                      <span className="text-white font-black font-numbers text-xs">{qty}</span>
                                      <button 
                                        onClick={() => onDrinkQuantityChange(item, 1)}
                                        className="w-6 h-6 rounded-lg bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <button onClick={() => onRemoveDrink(item)} className="text-zinc-600 hover:text-red-500 transition-colors p-1">
                                    <X className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              );
                            })}
                            {selectedExtraServices.map((item, idx) => {
                              const srvData = SERVICE_COSTS.find(s => s.label === item);
                              const costNum = parseInt(srvData?.price.replace(/[^0-9]/g, '') || '0');
                              const qty = serviceQuantities[item] || 1;
                              const isPerPerson = item.includes('Cover') || item.includes('فرد');
                              const displayQty = isPerPerson ? calcPax : qty;
                              
                              return (
                                <motion.div 
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  key={`srv-${idx}`} 
                                  className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between flex-row-reverse gap-4"
                                >
                                  <div className="flex-1 text-right">
                                    <h5 className="text-white text-[10px] font-black leading-tight mb-1">{item}</h5>
                                    {costNum > 0 && (
                                      <div className="mb-2">
                                        <p className="text-zinc-500 text-[8px] font-bold">{costNum} ج.م × {displayQty}</p>
                                        <p className="text-royal-gold text-[9px] font-bold">{(costNum * displayQty).toLocaleString()} ج.م</p>
                                      </div>
                                    )}
                                    {!isPerPerson && (
                                      <div className="flex items-center justify-end gap-3">
                                        <button 
                                          onClick={() => onServiceQuantityChange(item, -1)}
                                          className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white text-xs"
                                        >
                                          -
                                        </button>
                                        <span className="text-white font-black font-numbers text-xs">{qty}</span>
                                        <button 
                                          onClick={() => onServiceQuantityChange(item, 1)}
                                          className="w-6 h-6 rounded-lg bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-xs"
                                        >
                                          +
                                        </button>
                                      </div>
                                    )}
                                    {isPerPerson && <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest">حسب عدد الأفراد</p>}
                                  </div>
                                  <button onClick={() => onRemoveService(item)} className="text-zinc-600 hover:text-red-500 transition-colors p-1">
                                    <X className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Equipment */}
                      {selectedEquipItems.length > 0 && (
                        <div className="space-y-3">
                          <h6 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">المعدات</h6>
                          <AnimatePresence mode="popLayout">
                            {selectedEquipItems.map(item => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={item.id} 
                                className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between flex-row-reverse gap-4 group hover:border-royal-gold/30 transition-all"
                              >
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-12 h-12 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:scale-110 transition-transform" 
                                  onClick={() => onZoom(item.image)}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="flex-1 text-right">
                                  <h5 className="text-white text-[10px] font-black leading-tight mb-1">{item.name}</h5>
                                  {item.price && (
                                    <div className="mb-2">
                                      <p className="text-zinc-500 text-[8px] font-bold">{item.price} ج.م × {equipmentQuantities[item.id] || 1}</p>
                                      <p className="text-royal-gold text-[9px] font-bold">{(item.price * (equipmentQuantities[item.id] || 1)).toLocaleString()} ج.م</p>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-end gap-3">
                                    <button 
                                      onClick={() => onQuantityChange(item.id, -1)}
                                      className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white text-xs"
                                    >
                                      -
                                    </button>
                                    <span className="text-white font-black font-numbers text-xs">{equipmentQuantities[item.id] || 1}</span>
                                    <button 
                                      onClick={() => onQuantityChange(item.id, 1)}
                                      className="w-6 h-6 rounded-lg bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <button onClick={() => onRemoveEquipment(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors p-1">
                                  <X className="w-4 h-4" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                      <div className="flex justify-between items-center flex-row-reverse">
                        <div className="text-right">
                          <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest block mb-1">إجمالي الطلب</span>
                        </div>
                        <div className="text-left">
                          <motion.span 
                            key={totalPrice}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white text-2xl font-black font-numbers tracking-tighter inline-block"
                          >
                            {totalPrice.toLocaleString()}
                          </motion.span>
                          <span className="text-zinc-500 text-[10px] font-bold uppercase ml-1">ج.م</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {(selectedPkg || selectedBeverages.length > 0 || selectedDrinks.length > 0 || selectedExtraServices.length > 0) && (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onMenuOrder}
                            className="royal-btn-primary w-full py-4.5 text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl"
                          >
                            <WhatsAppIcon className="w-4.5 h-4.5 text-black" />
                            <span>تأكيد البيانات وإرسال الطلب</span>
                          </motion.button>
                        )}
                        {selectedEquipItems.length > 0 && (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onShare(selectedEquipItems)}
                            className="royal-btn-secondary w-full py-3.5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-[#25d366]" />
                            <span>طلب المعدات فقط</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-zinc-600"
                    >
                      <ShoppingBasket className="w-10 h-10 opacity-20" />
                    </motion.div>
                    <p className="text-zinc-500 text-xs font-bold">السلة فارغة حالياً</p>
                    <button onClick={() => { setIsOpen(false); navigateTo('portal'); }} className="text-[#c5a059] text-[10px] font-black uppercase tracking-widest underline">تصفح القوائم</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button 
          layoutId="cart-button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)} 
          className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-[0_10px_40px_rgba(197,160,89,0.4)] flex items-center justify-center gold-shimmer group relative bg-royal-gold pointer-events-auto"
        >
          <ShoppingBasket className="w-6 h-6 md:w-7 md:h-7 text-black" />
          {hasItems && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-black text-royal-gold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-black border border-royal-gold animate-bounce"
            >
              {totalItemsCount}
            </motion.span>
          )}
        </motion.button>
      )}
    </div>
  );
};

const NavItem: React.FC<{ id: string; label: string; active: boolean; onClick: () => void }> = ({ id, label, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${active ? 'text-[#c5a059]' : 'text-zinc-500 hover:text-white'}`}>
    {label}
    {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-royal-gold rounded-full"></span>}
  </button>
);

const EquipmentCard: React.FC<{ 
  item: EquipmentItem; 
  selected: boolean; 
  quantity: number;
  onToggle: (id: string) => void; 
  onQuantityChange: (id: string, delta: number) => void;
  onQuantitySet: (id: string, value: number) => void;
  onShare: (item: EquipmentItem) => void; 
  onZoom: (image: string) => void;
  selectedItems: string[];
  quantities: Record<string, number>;
  displayOnly?: boolean;
}> = ({ item, selected, quantity, onToggle, onQuantityChange, onQuantitySet, onShare, onZoom, selectedItems, quantities, displayOnly }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const images = item.images || [item.image];

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImgIdx(prev => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`break-inside-avoid bg-[#0c0c0c] border rounded-[2rem] overflow-hidden card-shadow relative group transition-all duration-500 card-3d gsap-card-reveal gsap-card-interactive ${selected ? 'border-royal-gold/40 ring-1 ring-royal-gold/20' : 'border-white/5'}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden cursor-zoom-in" onClick={() => onZoom(images[currentImgIdx])}>
        <AnimatePresence mode="wait">
          <motion.img 
            key={images[currentImgIdx]}
            src={images[currentImgIdx]} 
            alt={item.id} 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/800x600/111/c5a059?text=${item.id}`;
            }}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIdx ? 'bg-royal-gold w-6' : 'bg-white/20 w-2'}`}
              />
            ))}
          </div>
        )}

        {!displayOnly && (
          <button 
            onClick={() => onShare(item)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-green-500 hover:border-green-500 transition-all duration-300 group/share"
            title="اطلب عبر واتساب"
          >
            <WhatsAppIcon className="w-5 h-5 group-hover/share:scale-110 transition-transform" />
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start flex-row-reverse mb-6 gap-4">
          <div className="text-right flex-1">
            {item.name && <h4 className="text-white font-black text-base mb-2 font-header whitespace-pre-line leading-tight group-hover:text-royal-gold transition-colors">{item.name}</h4>}
            {item.price && (
              <div className="flex items-baseline gap-1.5 flex-row-reverse justify-start">
                <span className="text-royal-gold font-black text-2xl font-numbers tracking-tighter">{item.price}</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">EGP</span>
              </div>
            )}
            {item.note && <p className="text-[#c5a059]/70 text-[10px] font-bold mt-2 italic">{item.note}</p>}
          </div>
        </div>
        
        {item.options ? (
          <div className="space-y-4 mt-4">
            {item.options.map(opt => {
              const isOptSelected = selectedItems.includes(opt.id);
              const optQty = quantities[opt.id] || 1;
              return (
                <div key={opt.id} className={`p-5 rounded-[1.5rem] border transition-all duration-300 ${isOptSelected ? 'border-royal-gold/30 bg-royal-gold/5' : 'border-white/5 bg-white/5 hover:bg-white/[0.07]'}`}>
                  <div className="flex justify-between items-center flex-row-reverse mb-4">
                    <div className="text-right">
                      <div className={`text-sm font-black transition-colors ${isOptSelected ? 'text-royal-gold' : 'text-white'}`}>{opt.name}</div>
                      <div className="text-zinc-500 text-[11px] font-bold font-numbers mt-0.5">{opt.price} EGP</div>
                    </div>
                    {!displayOnly && (
                      <button 
                        onClick={() => onToggle(opt.id)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOptSelected ? 'bg-royal-gold border-royal-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'border-white/20 hover:border-white/40'}`}
                      >
                        {isOptSelected && <CheckIcon className="w-5 h-5 text-black" />}
                      </button>
                    )}
                  </div>
                  
                  {isOptSelected && !displayOnly && (
                    <div className="flex items-center justify-between flex-row-reverse bg-black/60 rounded-2xl p-2.5 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">الكمية</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onQuantityChange(opt.id, 1)}
                          className="w-9 h-9 min-w-[36px] rounded-lg bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold text-base"
                        >
                          +
                        </button>
                        <input 
                          type="number"
                          min="1"
                          value={optQty}
                          onChange={(e) => onQuantitySet(opt.id, parseInt(e.target.value) || 1)}
                          className="w-14 h-9 bg-white/5 border border-white/10 rounded-lg text-white text-center font-black font-numbers text-base focus:border-royal-gold/50 outline-none transition-colors"
                        />
                        <button 
                          onClick={() => onQuantityChange(opt.id, -1)}
                          className="w-9 h-9 min-w-[36px] rounded-lg bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all font-bold text-base"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : !displayOnly ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-row-reverse bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">الكمية المطلوبة</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, 1); }}
                  className="w-10 h-10 rounded-xl bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold text-xl"
                >
                  +
                </button>
                <input 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => onQuantitySet(item.id, parseInt(e.target.value) || 1)}
                  className="w-20 h-10 bg-white/5 border border-white/10 rounded-xl text-white text-center font-black font-numbers text-lg focus:border-royal-gold/50 outline-none transition-colors"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, -1); }}
                  className="w-10 h-10 rounded-xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all font-bold text-xl"
                >
                  -
                </button>
              </div>
            </div>

            <button 
              onClick={() => onToggle(item.id)}
              className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 ${
                selected 
                  ? 'royal-btn-primary scale-[1.01]' 
                  : 'royal-btn-secondary hover:border-royal-gold/60'
              }`}
            >
              {selected ? (
                <>
                  <CheckIcon className="w-4.5 h-4.5 text-black" />
                  <span>تمت الإضافة للسلة</span>
                </>
              ) : (
                <>
                  <ChafingDishIcon className="w-4.5 h-4.5 text-royal-gold" />
                  <span>إضافة للطلب الآن</span>
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            className="absolute top-4 left-4 bg-royal-gold text-black w-10 h-10 rounded-full shadow-2xl gold-shimmer flex items-center justify-center z-10 border-2 border-black/20"
          >
            <CheckIcon className="w-6 h-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'portal' | 'category' | 'tools' | 'contact'>('home');
  const [activeCategory, setActiveCategory] = useState<MenuPackage[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [activeEquipmentCat, setActiveEquipmentCat] = useState<EquipmentCategory | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // GSAP ScrollTrigger & Card Hover animations initializer
  useGsapScrollTrigger([view, activeCategory, activeEquipmentCat, categoryName]);

  // Parallax scroll effect for hanging lamp (factor of -0.1)
  const { scrollY } = useScroll();
  const lampY = useTransform(scrollY, [0, 1000], [0, -100]);

  // Scroll visibility handling - smooth hide on scroll down
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY.current;

          if (currentScrollY < 30) {
            setShowHeader(true);
            setScrolled(false);
          } else {
            setScrolled(true);
            if (delta > 8 && currentScrollY > 70) {
              // Scrolling down smoothly hides header
              setShowHeader(false);
            } else if (delta < -8) {
              // Scrolling up smoothly shows header
              setShowHeader(true);
            }
          }
          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // History API Sync
  useEffect(() => {
    // Initialize history state on first load to ensure back button works
    if (!window.history.state) {
      window.history.replaceState({ 
        view: 'home', 
        categoryName: '', 
        activeEquipmentCatId: null 
      }, '', '');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        const { view: targetView, categoryName: targetCatName, activeEquipmentCatId } = event.state;
        setView(targetView || 'home');
        setCategoryName(targetCatName || '');
        
        if (activeEquipmentCatId) {
          const found = EQUIPMENT_DATA.find(c => c.id === activeEquipmentCatId);
          setActiveEquipmentCat(found || null);
        } else {
          setActiveEquipmentCat(null);
        }
      } else {
        // Fallback to home if no state exists
        setView('home');
        setCategoryName('');
        setActiveEquipmentCat(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newView: typeof view, extra: any = {}) => {
    const state = { 
      view: newView, 
      categoryName: extra.categoryName || '', 
      activeEquipmentCatId: extra.activeEquipmentCatId || null 
    };
    window.history.pushState(state, '', '');
    setView(newView);
    if (extra.categoryName !== undefined) setCategoryName(extra.categoryName);
    if (extra.activeEquipmentCatId !== undefined) {
      const found = EQUIPMENT_DATA.find(c => c.id === extra.activeEquipmentCatId);
      setActiveEquipmentCat(found || null);
    } else if (newView === 'tools' && extra.activeEquipmentCatId === undefined) {
      // Keep existing or clear if not provided
    } else {
      setActiveEquipmentCat(null);
    }
  };

  const [calcPax, setCalcPax] = useState(25);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('');
  const [selectedExtraServices, setSelectedExtraServices] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [drinkQuantities, setDrinkQuantities] = useState<Record<string, number>>({});
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([]);
  const [beverageQuantities, setBeverageQuantities] = useState<Record<string, number>>({});
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentQuantities, setEquipmentQuantities] = useState<Record<string, number>>({});
  const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEquipmentOnlyOrder, setIsEquipmentOnlyOrder] = useState(false);
  const [pendingPkg, setPendingPkg] = useState<MenuPackage | null>(null);
  const [pendingEquipment, setPendingEquipment] = useState<EquipmentItem[] | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    message: '',
    agreedToDeposit: false
  });
  
  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, activeCategory, activeEquipmentCat]);
  
  useEffect(() => {
    setSelectedBeverages([]);
    setBeverageQuantities({});
  }, [selectedPkgId]);

  useEffect(() => {
    setDrinkQuantities(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = calcPax;
      });
      return next;
    });
  }, [calcPax]);

  const openCategory = (name: string, data: MenuPackage[]) => {
    setCategoryName(name);
    setActiveCategory(data);
    navigateTo('category', { categoryName: name });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allPackages = useMemo(() => [...BEVERAGES_MENU], []);
  const selectedPkg = useMemo(() => allPackages.find(p => p.id === selectedPkgId), [selectedPkgId, allPackages]);

  const handleBeverageQty = (item: string, delta: number) => {
    setBeverageQuantities(prev => ({ ...prev, [item]: Math.max(1, (prev[item] || 1) + delta) }));
  };

  const handleDrinkQty = (item: string, delta: number) => {
    setDrinkQuantities(prev => ({ ...prev, [item]: Math.max(1, (prev[item] || 1) + delta) }));
  };

  const handleServiceQty = (item: string, delta: number) => {
    setServiceQuantities(prev => ({ ...prev, [item]: Math.max(1, (prev[item] || 1) + delta) }));
  };

  const removeBeverage = (item: string) => setSelectedBeverages(prev => prev.filter(b => b !== item));
  const removeEquipment = (id: string) => setSelectedEquipment(prev => prev.filter(e => e !== id));
  const removeDrink = (item: string) => setSelectedDrinks(prev => prev.filter(d => d !== item));
  const removeService = (item: string) => setSelectedExtraServices(prev => prev.filter(s => s !== item));
  const removePkg = () => setSelectedPkgId('');

  const clearAll = () => {
    setSelectedPkgId('');
    setSelectedExtraServices([]);
    setSelectedDrinks([]);
    setSelectedBeverages([]);
    setBeverageQuantities({});
    setSelectedEquipment([]);
    setEquipmentQuantities({});
    setServiceQuantities({});
  };

  const calculateTotal = () => {
    let total = 0;
    
    if (selectedPkg) {
      total = selectedPkg.perPerson ? selectedPkg.price * calcPax : selectedPkg.price;
    }
    
    selectedExtraServices.forEach(srv => {
      const srvData = SERVICE_COSTS.find(s => s.label === srv);
      if (srvData) {
        const costNum = parseInt(srvData.price.replace(/[^0-9]/g, '') || '0');
        const qty = serviceQuantities[srv] || 1;
        
        const isPerPerson = srv.includes('Cover') || srv.includes('فرد');
        const isStaffOrQty = srv.includes('ويترز') || 
                            srv === 'شيف' || 
                            srv === 'باريستا' || 
                            srv.includes('شب') || 
                            srv.includes('بنت') || 
                            srv.includes('اشر') || 
                            srv.includes('هاوس') ||
                            srv.includes('جراب');

        if (isPerPerson) {
          total += costNum * calcPax;
        } else if (isStaffOrQty) {
          total += costNum * qty;
        } else {
          total += costNum;
        }
      }
    });

    selectedDrinks.forEach(drk => {
      const drkData = SOFT_DRINKS.find(d => d.name === drk);
      if (drkData) {
        const qty = drinkQuantities[drk] || 1;
        total += drkData.price * qty;
      }
    });

    selectedBeverages.forEach(bev => {
      const match = bev.match(/[—\(]\s*(\d+)\s*ج/);
      const price = match ? parseInt(match[1]) : 0;
      const qty = beverageQuantities[bev] || 1;
      total += price * qty;
    });

    selectedEquipment.forEach(id => {
      const equip = allEquipmentItems.find(e => e.id === id);
      if (equip && equip.price) {
        const qty = equipmentQuantities[id] || 1;
        total += equip.price * qty;
      }
    });

    return total;
  };

  const handleOrder = () => {
    setIsEquipmentOnlyOrder(false);
    setPendingPkg(null);
    setIsCustomerModalOpen(true);
  };

  const handleEquipmentOnlyOrder = () => {
    setIsEquipmentOnlyOrder(true);
    setPendingPkg(null);
    setIsCustomerModalOpen(true);
  };

  const handleSharePackage = (pkg: MenuPackage) => {
    setPendingPkg(pkg);
    setIsEquipmentOnlyOrder(false);
    setIsCustomerModalOpen(true);
  };

  const confirmAndSendOrder = () => {
    const pkgToUse = pendingPkg || selectedPkg;
    const pkgTitle = pkgToUse?.title || 'باقة مخصصة';
    const total = calculateTotal().toLocaleString();
    
    let details = `*طلب حجز من ملوك السعادة*\n\n`;
    
    if (pendingPkg) {
      details = `*استفسار عن باقة من ملوك السعادة*\n\n`;
      details += `*الباقة:* ${pendingPkg.title}\n`;
      if (pendingPkg.price > 0) {
        details += `*سعر الباقة:* ${pendingPkg.price.toLocaleString()} ج.م ${pendingPkg.perPerson ? 'للفرد' : ''}\n`;
      }
      details += `\n`;
    } else if (pendingEquipment) {
      details = `*طلب حجز معدات من ملوك السعادة*\n\n`;
      let grandTotal = 0;
      pendingEquipment.forEach((item) => {
        const qty = equipmentQuantities[item.id] || 1;
        const price = item.price || 0;
        const total = price * qty;
        grandTotal += total;
        details += `- ${item.name || item.id} (عدد ${qty}): ${total.toLocaleString()} ج.م\n`;
        if (item.image) {
          details += `  صورة: ${item.image}\n`;
        }
      });
      details += `\n*الإجمالي:* ${grandTotal.toLocaleString()} ج.م\n\n`;
    } else if (!isEquipmentOnlyOrder) {
      if (selectedPkg) {
        details += `*الباقة:* ${selectedPkg.title}\n`;
        if (selectedPkg.price > 0) {
          const pkgTotal = selectedPkg.perPerson ? selectedPkg.price * calcPax : selectedPkg.price;
          details += `*سعر الباقة:* ${selectedPkg.price.toLocaleString()} ج.م ${selectedPkg.perPerson ? 'للفرد' : ''}\n`;
          if (selectedPkg.perPerson) {
            details += `*إجمالي الباقة لـ ${calcPax} فرد:* ${pkgTotal.toLocaleString()} ج.م\n`;
          }
        }
        details += `\n`;
      } else {
        details += `*العدد:* ${calcPax} فرد\n\n`;
      }

      if (selectedExtraServices.length > 0) {
        details += `*الخدمات الإضافية:*\n`;
        selectedExtraServices.forEach(srv => {
          const srvData = SERVICE_COSTS.find(s => s.label === srv);
          if (srvData) {
            const qty = serviceQuantities[srv] || 1;
            const costNum = parseInt(srvData.price.replace(/[^0-9]/g, '') || '0');
            const isPerPerson = srv.includes('Cover') || srv.includes('فرد');
            const displayQty = isPerPerson ? calcPax : qty;
            const itemTotal = costNum * displayQty;
            
            details += `- ${srv} (${costNum.toLocaleString()} ج.م × ${displayQty}): ${itemTotal.toLocaleString()} ج.م\n`;
          }
        });
        details += `\n`;
      }

      if (selectedDrinks.length > 0) {
        details += `*المشروبات الفردية:*\n`;
        selectedDrinks.forEach(drk => {
          const drkData = SOFT_DRINKS.find(d => d.name === drk);
          if (drkData) {
            const qty = drinkQuantities[drk] || 1;
            const itemTotal = drkData.price * qty;
            details += `- ${drk} (${drkData.price.toLocaleString()} ج.م × ${qty}): ${itemTotal.toLocaleString()} ج.م\n`;
          }
        });
        details += `\n`;
      }

      if (selectedBeverages.length > 0) {
        details += `*المشروبات المختارة:*\n`;
        selectedBeverages.forEach(b => {
          const match = b.match(/[—\(]\s*(\d+)\s*ج/);
          const price = match ? parseInt(match[1]) : 0;
          const qty = beverageQuantities[b] || 1;
          const itemTotal = price * qty;
          if (price > 0) {
            details += `- ${b} (${price.toLocaleString()} ج.م × ${qty}): ${itemTotal.toLocaleString()} ج.م\n`;
          } else {
            details += `- ${b} (عدد ${qty})\n`;
          }
        });
        details += `\n`;
      }
    }

    if (selectedEquipment.length > 0 && !pendingPkg && !pendingEquipment) {
      details += `*المعدات المختارة:*\n`;
      selectedEquipment.forEach(id => {
        const equip = allEquipmentItems.find(e => e.id === id);
        if (equip) {
          const qty = equipmentQuantities[id] || 1;
          const price = equip.price || 0;
          if (price > 0) {
            details += `- ${equip.name || id} (عدد ${qty}): ${(price * qty).toLocaleString()} ج.م\n`;
          } else {
            details += `- ${equip.name || id} (عدد ${qty})\n`;
          }
          if (equip.image) {
            details += `  صورة: ${equip.image}\n`;
          }
        }
      });
      details += `\n`;
    }

    if (!pendingPkg && !pendingEquipment) {
      details += `*الإجمالي النهائي:* ${total} ج.م\n\n`;
    }
    
    details += `*بيانات العميل:*\n`;
    details += `- الاسم: ${customerInfo.name}\n`;
    details += `- الرقم: ${customerInfo.phone}\n`;
    details += `- ميعاد المناسبة: ${customerInfo.eventDate}\n`;
    if (customerInfo.eventLocation) {
      details += `- مكان المناسبة: ${customerInfo.eventLocation}\n`;
    }
    if (customerInfo.message) {
      details += `- ملاحظات: ${customerInfo.message}\n`;
    }
    
    if (customerInfo.agreedToDeposit) {
      details += `\n✅ العميل موافق على دفع 30% ديبوزت (عربون) لتأكيد الحجز.\n`;
    }
    
    details += `\nيرجى التواصل للتأكيد وتحديد الموعد.`;

    const message = encodeURIComponent(details);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
    setIsCustomerModalOpen(false);
    setPendingPkg(null);
    setPendingEquipment(null);
  };

  const handleShareEquipment = (items: EquipmentItem | EquipmentItem[]) => {
    const itemsArray = Array.isArray(items) ? items : [items];
    setPendingEquipment(itemsArray);
    setPendingPkg(null);
    setIsEquipmentOnlyOrder(true);
    setIsCustomerModalOpen(true);
  };

  const updateEquipmentQty = (id: string, delta: number) => {
    setEquipmentQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const updateEquipmentQtySet = (id: string, value: number) => {
    setEquipmentQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, value)
    }));
  };


  const allEquipmentItems = useMemo(() => {
    const items: EquipmentItem[] = [];
    EQUIPMENT_DATA.forEach(cat => {
      if (cat.items) {
        cat.items.forEach(item => {
          items.push(item);
          if (item.options) {
            item.options.forEach(opt => {
              items.push({
                id: opt.id,
                name: opt.name,
                price: opt.price,
                image: item.image,
                note: item.note
              });
            });
          }
        });
      }
      if (cat.sections) {
        cat.sections.forEach(sec => {
          sec.items.forEach(item => {
            items.push(item);
            if (item.options) {
              item.options.forEach(opt => {
                items.push({
                  id: opt.id,
                  name: opt.name,
                  price: opt.price,
                  image: item.image,
                  note: item.note
                });
              });
            }
          });
        });
      }
      if (cat.quickSelections) {
        cat.quickSelections.forEach(opt => {
          items.push({
            id: opt.id,
            name: opt.name,
            price: opt.price
          });
        });
      }
    });
    return items;
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 overflow-x-hidden relative">
      {/* Smooth Animated Luxury Ambient Gradient Backgrounds & Custom Drawings */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft floating gold and amber light emitters */}
        <div className="absolute top-[15%] left-[-15%] w-[55vw] h-[55vw] md:w-[35vw] md:h-[35vw] bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-[100px] rounded-full animate-float-glow-1" />
        <div className="absolute top-[50%] right-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-[radial-gradient(circle,rgba(197,160,89,0.05)_0%,transparent_70%)] blur-[130px] rounded-full animate-float-glow-2" />
        <div className="absolute bottom-[10%] left-[10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] blur-[110px] rounded-full animate-float-glow-1" />
        
        {/* Subtle royal dot-mesh pattern drawn on the background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(197,160,89,0.02)_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-40" />
      </div>

      <header 
        id="royal-header-main" 
        className={`fixed top-0 inset-x-0 z-[110] transition-all duration-500 ease-out px-3 sm:px-8 md:px-12 pr-[37px] pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 md:py-6 flex items-center justify-center bg-transparent ${
          showHeader ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Right Action: Cart Button (Only shown when not on home page) */}
        {view !== 'home' && (
          <div className="absolute right-3 sm:right-6 md:right-10 top-[max(0.75rem,env(safe-area-inset-top))] md:top-1/2 md:-translate-y-1/2 flex items-center justify-center z-10">
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              aria-label="سلة الطلبات"
              className="w-11 h-11 min-w-[44px] min-h-[44px] !pt-0 flex items-center justify-center touch-manipulation focus:outline-none cursor-pointer"
            >
              <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 md:w-11 md:h-11 rounded-full royal-btn-secondary !p-0 flex items-center justify-center text-white shadow-lg transition-all group relative border border-white/10">
                <ShoppingBasket className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-royal-gold group-hover:text-white transition-colors" />
                {(selectedEquipment.length + selectedBeverages.length + (selectedPkgId ? 1 : 0) + selectedDrinks.length + selectedExtraServices.length) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-royal-gold text-black w-4 h-4 rounded-full flex items-center justify-center text-[8.5px] font-black border border-black shadow-md font-numbers">
                    {selectedEquipment.length + selectedBeverages.length + (selectedPkgId ? 1 : 0) + selectedDrinks.length + selectedExtraServices.length}
                  </span>
                )}
              </div>
            </motion.button>
          </div>
        )}

        {/* Center/Main Navigation */}
        <nav className="flex items-center justify-center gap-4 sm:gap-8 md:gap-10 mx-auto">
          {[
            { v: 'home', l: 'الرئيسية' },
            { v: 'portal', l: 'المنيو' },
            { v: 'tools', l: 'المعدات' },
            { v: 'contact', l: 'تواصل معنا' }
          ].map(nav => (
            <button 
              key={nav.v} 
              onClick={() => { navigateTo(nav.v as any); if(nav.v === 'tools') setActiveEquipmentCat(null); }} 
              className={`text-xs md:text-sm font-bold tracking-wide transition-colors relative py-1 whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${
                view === nav.v || (nav.v === 'portal' && view === 'category') 
                  ? 'text-royal-gold font-black' 
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              {nav.l}
              {(view === nav.v || (nav.v === 'portal' && view === 'category')) && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-royal-gold rounded-full shadow-[0_0_8px_#c5a059]" />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="min-h-screen">
        {view === 'home' && (
          <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative min-h-[92vh] md:min-h-[95vh] flex flex-col justify-between items-center overflow-hidden pt-20 md:pt-24 pb-12 md:pb-16">
               {/* Premium Background Image with Luxury Vignette and Gradients */}
               <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#050505]">
                 <picture className="w-full h-full block">
                   <source media="(min-width: 768px)" srcSet="https://res.cloudinary.com/dhktkzpap/image/upload/v1784323411/bfe5c1c7-4080-44dc-bd9a-80f243fc9122_ne8rrq.png" />
                   <img 
                     src="https://res.cloudinary.com/dhktkzpap/image/upload/v1784656446/d88ceec3-56ac-422e-a7ad-812f3f216698_tf7hyo.png" 
                     alt="Molok El Saada Chafing Dish" 
                     className="w-full h-full object-cover object-center scale-100 filter brightness-[0.85] contrast-[1.05]" 
                     referrerPolicy="no-referrer"
                   />
                 </picture>
                 {/* Cinematic gradient overlay that keeps the center-bottom (chafing dish) visible while darkening top and bottom */}
                 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-[#050505]"></div>
                 {/* Radial lens vignette focusing on the chafing dish center */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(5,5,5,0.9)_100%)]"></div>
               </div>

               {/* Top Block: Logo and Subtitle positioned perfectly below the navigation bar */}
               <div className="container mx-auto px-6 flex flex-col justify-between items-center text-center relative z-10 flex-grow">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center pt-28 md:pt-44 relative z-20 w-full mb-8 md:mb-12"
                  >
                    {/* Interactive Parallax Hanging Lamp above the logo */}
                    <motion.div 
                      style={{ y: lampY }}
                      className="absolute top-[-160px] md:top-[-240px] left-1/2 -translate-x-1/2 z-10 w-[200px] md:w-[280px] pointer-events-none origin-top select-none"
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      <img 
                        src="https://road9media.com/templates/r9/images/furnitures/lamp.png" 
                        alt="Royal Chandelier" 
                        className="w-full h-auto drop-shadow-[0_15px_35px_rgba(197,160,89,0.35)] filter brightness-110 contrast-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Realistic Light Cone Emission shining down and illuminating the logo */}
                      <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[300px] md:w-[450px] h-[400px] md:h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.5)_0%,rgba(197,160,89,0.15)_40%,transparent_70%)] blur-3xl pointer-events-none rounded-full mix-blend-screen origin-top scale-y-[1.4]" />
                      <div className="absolute top-[88%] left-1/2 -translate-x-1/2 w-[200px] md:w-[300px] h-[300px] md:h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.5)_0%,rgba(197,160,89,0.22)_30%,transparent_65%)] blur-xl pointer-events-none rounded-full mix-blend-screen origin-top scale-y-[1.3] animate-pulse" style={{ animationDuration: '4s' }} />
                    </motion.div>

                    <motion.div
                      initial={{ rotate: -540, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      transition={{ 
                        rotate: { type: "spring", stiffness: 280, damping: 25 },
                        scale: { type: "spring", stiffness: 280, damping: 25 },
                        opacity: { duration: 0.4 }
                      }}
                      className="hover:scale-105 transition-transform duration-700 cursor-pointer relative z-20"
                    >
                      <BrandLogo className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_55px_rgba(197,160,89,0.55)]" showGlow={true} imgStyle={{ marginTop: '-40px' }} />
                    </motion.div>
                   
                    {/* ROYAL CATERING SINCE 2015 placed immediately under the logo */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-white font-numbers text-[12px] md:text-[15px] font-black uppercase tracking-[0.35em] whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,1)] text-center mt-2"
                    >
                      Royal Catering Since 2015
                    </motion.div>
                  </motion.div>

                  {/* Bottom Block: Description and CTA Buttons positioned beautifully at the bottom */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl flex flex-col items-center justify-center mt-auto"
                  >
                    {/* Royal Gold Decorative Divider SVG */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="my-5 md:my-7 flex justify-center items-center pointer-events-none select-none"
                    >
                      <svg 
                        width="200" 
                        height="46" 
                        viewBox="0 0 150 35" 
                        fill="none" 
                        stroke="#c5a059" 
                        strokeWidth="1.2"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-royal-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.5)] opacity-90"
                      >
                        <g transform="translate(145.064 31.002) rotate(180)">
                          <path 
                            className="frame-down-1" 
                            d="M206.648,18.673l5.782-6.08L206.648.5h-.132L200.7,12.593l5.815,6.08Z" 
                            transform="translate(-134.05)" 
                            strokeDasharray="43.891536712646484" 
                            style={{ strokeDashoffset: '0px' }}
                          />
                          <path 
                            className="frame-down-2" 
                            d="M13.849,11.806C12.23,8.634,7.8,8.7,7.8,8.7a7.286,7.286,0,1,0,.066,14.572H58.192a16.577,16.577,0,0,1,7.633,1.85A11.688,11.688,0,0,1,72.5,35.993h.066A11.6,11.6,0,0,1,79.24,25.122a16.478,16.478,0,0,1,7.633-1.85H137.2A7.286,7.286,0,1,0,137.262,8.7s-4.461-.066-6.047,3.139" 
                            transform="translate(0 -5.49)" 
                            strokeDasharray="203.66554260253906" 
                            style={{ strokeDashoffset: '0px' }}
                          />
                        </g>
                      </svg>
                    </motion.div>

                    {/* Coordinated description with strong readability shadows */}
                    <p className="text-zinc-100 text-[10px] leading-relaxed max-w-2xl mx-auto mb-10 font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)] px-4">
                      نحن متخصصون في تأجير أفخم معدات المناسبات وتقديم أرقى خدمات الضيافة والاستقبال الملكية لتليق بأهم لحظات حياتكم.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center w-full max-w-md mx-auto">
                      <motion.button 
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigateTo('portal')}
                        className="royal-btn-primary w-full sm:w-auto flex-1 py-4 px-8 text-xs md:text-sm font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 select-none"
                      >
                        <span>استعراض القوائم</span>
                        <ArrowRight className="w-4 h-4 rotate-180 text-black" />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigateTo('tools', { activeEquipmentCatId: null })}
                        className="royal-btn-secondary w-full sm:w-auto flex-1 py-4 px-8 text-xs md:text-sm font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 select-none"
                      >
                        <ChafingDishIcon className="w-4.5 h-4.5 text-royal-gold" />
                        <span>معرض المعدات</span>
                      </motion.button>
                    </div>
                  </motion.div>
               </div>
            </section>

            {/* Background image section blended with the Chafing Dish section above and the Footer below */}
            <div className="relative bg-[#050505] overflow-hidden">
              {/* Anti-pixelation smoothing layer with luxury atmospheric treatment */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
                <img 
                  src="https://res.cloudinary.com/dhktkzpap/image/upload/v1784662591/8aba16bcfe2f755902869df3346ef14a_z565po.jpg"
                  alt="Atmosphere"
                  className="w-full h-full object-cover object-center scale-105 filter blur-[1.5px] md:blur-[2px] brightness-[0.95] contrast-[1.12] opacity-85 md:opacity-80"
                  referrerPolicy="no-referrer"
                />

                {/* Ambient royal golden warmth to enhance the atmosphere and eliminate flat pixelation */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.16)_0%,rgba(5,5,5,0.75)_100%)] pointer-events-none" />

                {/* Seamless Top Blend connecting smoothly with the hero section above */}
                <div className="absolute inset-x-0 top-0 h-28 md:h-44 bg-gradient-to-b from-[#050505] via-[#050505]/75 to-transparent pointer-events-none" />

                {/* Seamless Bottom Blend connecting smoothly with the content below */}
                <div className="absolute inset-x-0 bottom-0 h-28 md:h-44 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10">
                {/* Redesigned Royal Booking/Reservation Section */}
                <BookingSection 
                  onBookNow={() => setIsCustomerModalOpen(true)}
                  onBrowseEquipment={() => navigateTo('tools', { activeEquipmentCatId: null })}
                />

                {/* Gallery Section - Royal Moments */}
                <section className="py-28 md:py-36 bg-transparent relative overflow-hidden gsap-section">
                  <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-24 gsap-reveal">
                       <h2 className="text-5xl md:text-[5.5rem] font-black text-white font-header mb-6 tracking-tighter leading-none">لحظات <span className="text-royal-gold gold-text-shimmer">ملكية</span></h2>
                       <div className="w-24 h-1 bg-royal-gold mx-auto mb-8"></div>
                       <p className="text-[#c5a059] text-xs font-black uppercase tracking-[0.6em] max-w-2xl mx-auto leading-relaxed">Our Pride in Every Detail</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 gsap-stagger-container">
                      {[
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774905127/IMG-20251215-WA0067_1_zc3ofs.jpg', class: 'col-span-2 row-span-2' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.08_AM_3_ophvez.jpg', class: 'col-span-1 row-span-1' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.08_AM_2_l8uylj.jpg', class: 'col-span-1 row-span-1' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.07_AM_mu08y8.jpg', class: 'col-span-1 row-span-1' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826482/WhatsApp_Image_2026-03-30_at_1.20.08_AM_vscdnh.jpg', class: 'col-span-1 row-span-1' },
                      ].map((img, i) => (
                        <div key={i} className={`${img.class} group relative overflow-hidden rounded-[2rem] md:rounded-[3rem] card-shadow border border-white/10 bg-black/50 gsap-stagger-item gsap-card-interactive`}>
                          <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Royal Event" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                            <div className="text-right w-full">
                              <span className="text-royal-gold font-bold text-xs uppercase tracking-widest block mb-2">Molok El Saada</span>
                              <h4 className="text-white font-black text-lg font-header">الفخامة في كل تفصيلة</h4>
                            </div>
                          </div>
                          <div className="absolute inset-0 border-0 group-hover:border-[8px] border-[#c5a059]/20 transition-all duration-500 rounded-[2rem] md:rounded-[3rem] pointer-events-none"></div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-12">
                       <button onClick={() => navigateTo('portal')} className="group flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-xs hover:text-[#c5a059] transition-colors">
                          <span className="w-12 h-px bg-white/20 group-hover:bg-[#c5a059]/50 transition-colors"></span>
                          استكشف خدمات الضيافة
                          <span className="w-12 h-px bg-white/20 group-hover:bg-[#c5a059]/50 transition-colors"></span>
                       </button>
                       <button onClick={() => navigateTo('tools', { activeEquipmentCatId: null })} className="group flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-xs hover:text-[#c5a059] transition-colors">
                          <span className="w-12 h-px bg-white/20 group-hover:bg-[#c5a059]/50 transition-colors"></span>
                          استكشف المعدات
                          <span className="w-12 h-px bg-white/20 group-hover:bg-[#c5a059]/50 transition-colors"></span>
                       </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>

          </div>
        )}

        {view === 'portal' && (
          <div className="container mx-auto px-6 py-32 animate-in slide-in-from-bottom-10 duration-700 gsap-section">
            <div className="text-center mb-16 gsap-reveal">
              <h2 className="text-5xl md:text-7xl font-black text-white font-header mb-6">قوائم الضيافة</h2>
              <p className="text-[#c5a059] text-xs font-black uppercase tracking-[0.6em]">Choose Your Royal Experience</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gsap-stagger-container">
                {[
                  { name: 'Beverages', displayName: 'مشروبات', icon: '☕', data: BEVERAGES_MENU, desc: 'ركن المشروبات الملكي' },
                  { name: 'Services', displayName: 'خدمات', icon: '🤵', data: [{ id: 'srv-cat', title: 'طاقم الخدمة والضيافة', price: -1, sections: [{ name: 'طاقم العمل', items: SERVICE_COSTS.map(s => s.label) }] }], desc: 'الويترز والشيف والباريستا' },
                ].map((cat, i) => (
                <div key={i} onClick={() => openCategory(cat.name, cat.data)} className="group bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] text-center cursor-pointer card-shadow relative overflow-hidden gsap-stagger-item gsap-card-interactive">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/5 rounded-bl-[10rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-7xl block mb-8 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">{cat.icon}</span>
                  <h3 className="text-xl font-black text-white group-hover:text-[#c5a059] transition-colors mb-4 font-header">{cat.displayName}</h3>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">{cat.desc}</p>
                  <div className="mt-10 h-0.5 w-12 bg-zinc-800 mx-auto group-hover:w-24 group-hover:bg-[#c5a059] transition-all"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'category' && (activeCategory.length > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-6 py-32 text-right gsap-section"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8 flex-row-reverse gsap-reveal">
              <motion.button 
                whileHover={{ x: 5 }}
                onClick={() => window.history.back()} 
                className="group flex items-center gap-3 text-[#c5a059] text-[10px] font-black uppercase tracking-widest"
              >
                <span className="w-8 h-8 rounded-full border border-[#c5a059]/30 flex items-center justify-center group-hover:bg-[#c5a059] group-hover:text-black transition-all">←</span> العودة للقوائم
              </motion.button>
              <h2 className="text-5xl font-black text-white font-header gold-text-shimmer">{categoryName}</h2>
              <div className="w-24 h-0.5 bg-[#c5a059] hidden md:block"></div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 gsap-stagger-container">
              {activeCategory.map((pkg, idx) => (
                <motion.div 
                  key={pkg.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-10 md:p-14 card-shadow relative overflow-hidden flex flex-col group hover:border-royal-gold/20 transition-all duration-500 gsap-stagger-item gsap-card-interactive"
                >
                  <div className="flex justify-between items-start mb-12 flex-wrap gap-6 flex-row-reverse">
                    <div className="text-right">
                      <h3 className="text-3xl font-black text-royal-gold font-header mb-4">{pkg.title}</h3>
                      <div className="flex gap-2 flex-row-reverse">
                        {pkg.minPeople && <span className="bg-white/10 text-[9px] font-bold px-3 py-1 rounded-full uppercase text-zinc-300 border border-white/10">Min. {pkg.minPeople} PAX</span>}
                        {!pkg.id.startsWith('ad-') && (!pkg.id.startsWith('bev-') || pkg.perPerson) && (
                          <span className="bg-[#c5a059]/10 text-[9px] font-bold px-3 py-1 rounded-full uppercase text-[#c5a059] border border-[#c5a059]/20">{pkg.perPerson ? 'Per Person' : 'Package Deal'}</span>
                        )}
                        <span className="bg-white/5 text-[9px] font-bold px-3 py-1 rounded-full uppercase text-zinc-400 border border-white/5 italic">
                          إضافات اختيارية متاحة بالحاسبة
                        </span>
                      </div>
                    </div>
                    {!pkg.id.startsWith('ad-') && (!pkg.id.startsWith('bev-') || pkg.perPerson) && (
                      <div className="text-left">
                        {(() => {
                          let perPersonPrice = pkg.price;

                          const hasPrice = perPersonPrice > 0 || pkg.price > 0;

                          if (!hasPrice && pkg.id !== 'srv-cat') {
                            return <div className="text-2xl font-black text-royal-gold font-header">السعر حسب اليوم</div>;
                          }

                          if (pkg.id === 'srv-cat') return null;

                          const total = pkg.perPerson ? perPersonPrice * calcPax : perPersonPrice;

                          return (
                            <>
                              <div className="text-5xl font-black text-white font-numbers tracking-tighter">{perPersonPrice.toLocaleString()}</div>
                              <div className="mt-2 text-right lg:text-left">
                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest block">EGP {pkg.perPerson ? '/ Person' : 'Total'}</span>
                                {pkg.perPerson && (
                                  <span className="text-[10px] text-royal-gold font-bold block mt-1">Total: {total.toLocaleString()} LE (for {calcPax} PAX)</span>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                    {(pkg.id.startsWith('bev-') && !pkg.perPerson) && (
                      <div className="text-left">
                        {(() => {
                          let totalSectionPrice = 0;
                          selectedBeverages.forEach(bev => {
                            if (pkg.sections.some(sec => sec.items.includes(bev))) {
                              const match = bev.match(/[—\(]\s*(\d+)\s*ج/);
                              const price = match ? parseInt(match[1]) : 0;
                              const qty = beverageQuantities[bev] || 1;
                              totalSectionPrice += price * qty;
                            }
                          });

                          if (totalSectionPrice === 0) {
                            return (
                              <div className="text-right lg:text-left">
                                <span className="text-royal-gold text-[10px] font-black uppercase tracking-widest block mb-1">اختر الأصناف</span>
                                <span className="text-zinc-500 text-[9px] font-bold block italic">لحساب التكلفة</span>
                              </div>
                            );
                          }

                          return (
                            <>
                              <div className="text-5xl font-black text-white font-numbers tracking-tighter">{totalSectionPrice.toLocaleString()}</div>
                              <div className="mt-2 text-right lg:text-left">
                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest block">EGP Total</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-12 flex-1">
                    {pkg.sections.map((sec, i) => (
                      <div key={i} className="text-right">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-6 flex items-center gap-4 flex-row-reverse">
                          <span className="flex-1 h-px bg-[#c5a059]/10"></span> {sec.name}
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sec.items.map((item, j) => {
                            const isBeverage = pkg.id.startsWith('bev-') && !pkg.perPerson;
                            const isService = pkg.id === 'srv-cat';
                            
                            if (isBeverage || isService) {
                              const isSelected = isBeverage
                                  ? selectedBeverages.includes(item)
                                  : selectedExtraServices.includes(item);
                              
                              const srvData = isService ? SERVICE_COSTS.find(s => s.label === item) : null;
                              const needsQty = isService ? (
                                item.includes('ويترز') || 
                                item === 'شيف' || 
                                item === 'باريستا' || 
                                item.includes('شب') || 
                                item.includes('بنت') || 
                                item.includes('اشر') ||
                                item.includes('هاوس') ||
                                item.includes('جراب')
                              ) : true;
                              
                              return (
                                <li key={j} className={`p-4 rounded-2xl border transition-all flex justify-between items-center flex-row-reverse ${isSelected ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-white/5 text-zinc-400 hover:text-zinc-200'}`}>
                                    <div className="flex-1 cursor-pointer text-right flex items-center justify-end gap-3" onClick={() => {
                                      if (isBeverage) {
                                        setSelectedBeverages(prev => {
                                          if (prev.includes(item)) return prev.filter(s => s !== item);
                                          return [...prev, item];
                                        });
                                        if (!selectedBeverages.includes(item)) {
                                          setBeverageQuantities(prev => ({ ...prev, [item]: 1 }));
                                        }
                                      } else if (isService) {
                                        setSelectedExtraServices(prev => {
                                          if (prev.includes(item)) return prev.filter(s => s !== item);
                                          return [...prev, item];
                                        });
                                        if (!selectedExtraServices.includes(item)) {
                                          setServiceQuantities(prev => ({ ...prev, [item]: 1 }));
                                        }
                                      }
                                    }}>
                                      <div className="text-right">
                                        <span className={`text-sm font-bold block transition-colors ${isSelected ? 'text-[#c5a059]' : ''}`}>{item}</span>
                                        {isService && srvData && (
                                          <span className="text-[10px] text-zinc-500 font-numbers">{srvData.price}</span>
                                        )}
                                      </div>
                                      {!isSelected && (
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:border-royal-gold hover:text-royal-gold transition-all">
                                          +
                                        </div>
                                      )}
                                    </div>
                                  
                                  {isSelected && needsQty && (
                                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isBeverage) {
                                            setBeverageQuantities(prev => ({ ...prev, [item]: Math.max(1, (prev[item] || 1) - 1) }));
                                          } else if (isService) {
                                            setServiceQuantities(prev => ({ ...prev, [item]: Math.max(1, (prev[item] || 1) - 1) }));
                                          }
                                        }}
                                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white text-xs"
                                      >
                                        -
                                      </button>
                                      <input 
                                        type="number"
                                        min="1"
                                        value={isBeverage ? (beverageQuantities[item] || 1) : (serviceQuantities[item] || 1)}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 1;
                                          if (isBeverage) {
                                            setBeverageQuantities(prev => ({ ...prev, [item]: val }));
                                          } else if (isService) {
                                            setServiceQuantities(prev => ({ ...prev, [item]: val }));
                                          }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-10 h-6 bg-white/5 border border-white/10 rounded text-white text-center font-numbers font-bold text-[10px] focus:border-royal-gold/50 outline-none"
                                      />
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isBeverage) {
                                            setBeverageQuantities(prev => ({ ...prev, [item]: (prev[item] || 1) + 1 }));
                                          } else if (isService) {
                                            setServiceQuantities(prev => ({ ...prev, [item]: (prev[item] || 1) + 1 }));
                                          }
                                        }}
                                        className="w-6 h-6 rounded-md bg-royal-gold flex items-center justify-center hover:scale-105 transition-transform text-black text-xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </li>
                              );
                            }
                            return (
                              <li key={j} className="text-zinc-300 text-sm flex flex-row-reverse items-start gap-3 group/item cursor-default">
                                <span className="text-[#c5a059] group-hover/item:scale-125 transition-transform mt-1.5">•</span>
                                <span className="group-hover/item:text-white transition-colors">{item}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {pkg.id === 'srv-cat' && (
                    <div className="mt-12 p-8 bg-royal-gold/5 border border-royal-gold/10 rounded-[2rem] text-right">
                      <div className="flex items-center gap-4 flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-royal-gold/20 flex items-center justify-center text-royal-gold">
                          <MapPinIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-royal-gold font-black text-xs block mb-1">النقل وتكاليف التوصيل</span>
                          <p className="text-zinc-400 text-sm font-bold">يتم تحديد تكلفة النقل حسب موقع المناسبة.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {pkg.id !== 'srv-cat' && (
                    <div className="mt-14 flex flex-col sm:flex-row gap-3 md:gap-4">
                      <button 
                        onClick={() => {
                          setSelectedPkgId(pkg.id);
                          setIsCartOpen(true);
                        }} 
                        className="royal-btn-secondary flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <ShoppingBasket className="w-4 h-4 text-royal-gold" />
                        <span>إضافة للسلة</span>
                      </button>
                      <button 
                        onClick={() => handleSharePackage(pkg)} 
                        className="royal-btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                      >
                        <WhatsAppIcon className="w-4 h-4 text-black" />
                        <span>اطلب الآن</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {categoryName === 'Beverages' && (
              <div className="mt-24 space-y-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
                {/* PAX Selection restored to Beverages Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-10 glass-card p-8 rounded-[2.5rem] border border-[#c5a059]/20 card-shadow text-right max-w-2xl mx-auto"
                >
                  <div className="flex justify-between items-center mb-6 flex-row-reverse">
                    <h4 className="text-white font-black font-header">عدد الأفراد (PAX)</h4>
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <motion.span 
                        key={calcPax}
                        initial={{ scale: 1.2, color: "#c5a059" }}
                        animate={{ scale: 1, color: "#c5a059" }}
                        className="text-royal-gold font-numbers text-3xl font-black"
                      >
                        {calcPax}
                      </motion.span>
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">فرد</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="25" 
                    max="1000" 
                    step="10" 
                    value={calcPax} 
                    onChange={e => setCalcPax(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c5a059]" 
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest flex-row-reverse">
                    <span>1000 PAX</span>
                    <span>25 PAX</span>
                  </div>
                </motion.div>

                <div className="text-center">
                  <h3 className="text-4xl font-black text-white font-header mb-4">
                    اختيار مشروبات فردية (بالفرد)
                  </h3>
                  <div className="w-24 h-1 bg-[#c5a059] mx-auto"></div>
                </div>
                
                {BEVERAGES_CATEGORIES.map((category, catIdx) => (
                  <div key={catIdx} className="space-y-12">
                    <div className="flex items-center gap-6 flex-row-reverse">
                      <h4 className="text-2xl font-black text-royal-gold whitespace-nowrap">{category.name}</h4>
                      <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {category.items.map((drink, idx) => {
                        const isSelected = selectedDrinks.includes(drink.name);
                        const qty = drinkQuantities[drink.name] || 1;
                        return (
                          <div 
                            key={idx}
                            onClick={() => {
                              if (!isSelected) {
                                setSelectedDrinks(prev => [...prev, drink.name]);
                                setDrinkQuantities(prev => ({ ...prev, [drink.name]: calcPax }));
                              } else {
                                setSelectedDrinks(prev => prev.filter(d => d !== drink.name));
                              }
                            }}
                            className={`p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer flex flex-col justify-between items-center text-center ${isSelected ? 'border-royal-gold bg-royal-gold/5 shadow-royal-gold/10' : 'border-white/5 bg-[#0c0c0c] hover:border-white/10'} card-shadow group`}
                          >
                            <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-6 transition-all duration-500 ${isSelected ? 'bg-royal-gold border-royal-gold' : 'border-white/10 group-hover:border-royal-gold/50'}`}>
                              {isSelected ? <CheckIcon className="w-6 h-6 text-black" /> : <span className="text-xl">🥤</span>}
                            </div>
                            <div>
                              <div className={`text-lg font-black mb-2 transition-colors duration-500 ${isSelected ? 'text-royal-gold' : 'text-white'}`}>{drink.name}</div>
                              <div className="text-zinc-500 text-xs font-numbers font-black tracking-widest">{drink.price} EGP / Item</div>
                            </div>
                            
                            {isSelected && (
                              <div className="mt-6 space-y-4 w-full animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center justify-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDrinkQuantities(prev => ({ ...prev, [drink.name]: Math.max(1, (prev[drink.name] || 1) - 1) }));
                                    }}
                                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="text-white font-black font-numbers min-w-[2rem]">{qty}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDrinkQuantities(prev => ({ ...prev, [drink.name]: (prev[drink.name] || 1) + 1 }));
                                    }}
                                    className="w-8 h-8 rounded-xl bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="text-[10px] font-black text-royal-gold uppercase tracking-[0.2em]">
                                  Total: {(drink.price * qty).toLocaleString()} LE
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {view === 'contact' && (
          <div className="container mx-auto px-6 py-32 animate-in fade-in duration-1000 text-center gsap-section">
            <div className="max-w-4xl mx-auto">
               <div className="flex justify-center mb-16 gsap-reveal">
                  <BrandLogo className="w-48 h-48 md:w-64 md:h-64" />
               </div>

               {/* Section: About Us (من نحن) */}
               <div className="mb-40 space-y-24 text-right">
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="bg-[#0c0c0c] border border-royal-gold/20 p-8 md:p-16 rounded-[3.5rem] relative overflow-hidden card-shadow gsap-card-interactive"
                 >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent"></div>
                   <span className="text-royal-gold text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">من نحن</span>
                   <h3 className="text-white text-3xl md:text-5xl font-black font-header mb-8 leading-tight">ملوك السعادة لخدمات الضيافة</h3>
                   <div className="space-y-6 text-zinc-300 text-lg md:text-xl leading-relaxed font-light">
                     <p>منذ عام 2015، وملوك السعادة لخدمات الضيافة والاستقبال بتقدّم تجربة ضيافة متكاملة بمستوى فندقي احترافي.</p>
                     <p>على مدار سنين اشتغلنا على الاف المناسبات المختلفة والاحداث الكبيرة، وكونّا خبرة حقيقية في إدارة التفاصيل وتقديم خدمة تليق بالعملاء الباحثين عن مستوى أرقي دائما.</p>
                   </div>
                 </motion.div>

                 {/* Section: Services (خدماتنا) */}
                 <div>
                   <div className="flex items-center gap-4 flex-row-reverse mb-12">
                     <h3 className="text-2xl font-black text-white font-header">خدماتنا</h3>
                     <div className="h-px bg-white/10 flex-1"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gsap-stagger-container">
                     {[
                       { title: 'فريق ضيافة واستقبال', desc: 'ويترز وكباتن بمظهر وسلوك احترافي يشرّف مناسبتك.' },
                       { title: 'تأجير معدات الكاترينج', desc: 'أعلى جودة وتنظيم مع أحدث التصميمات العالمية للبوفيه والمعدات.' },
                       { title: 'كوفي كورنر متكامل', desc: 'مشروبات ساخنة وباردة مُعدّة بأفضل الخامات العالمية.' },
                       { title: 'كورنر ضيافة عربي', desc: 'تجهيزات فخمة (قهوة عربية – تمور – مباخر – مشروبات تقليدية).' },
                       { title: 'توريدات فندقية', desc: 'حلول متكاملة للمناسبات الكبرى والمشروعات الفندقية.' },
                     ].map((item, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, x: 20 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: i * 0.1 }}
                         className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:border-royal-gold/30 transition-all group gsap-stagger-item gsap-card-interactive"
                       >
                         <h4 className="text-royal-gold font-black mb-3 font-header group-hover:scale-105 transition-transform origin-right">{item.title}</h4>
                         <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                       </motion.div>
                     ))}
                   </div>
                 </div>

                 {/* Section: Vision & System (رؤيتنا ونظام الخدمة) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gsap-stagger-container">
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="bg-royal-gold/5 border border-royal-gold/20 p-10 rounded-[3rem] relative gsap-stagger-item gsap-card-interactive"
                   >
                     <h3 className="text-royal-gold text-[10px] font-black uppercase tracking-widest mb-6">رؤيتنا</h3>
                     <p className="text-white text-xl font-bold leading-relaxed font-header">نقدّم خدمة راقية بثبات وجودة عالية، ونكون الاختيار الأول لكل عميل بيدوّر على تنفيذ من غير أخطاء ومستوى يفرق.</p>
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="bg-zinc-900/50 border border-white/10 p-10 rounded-[3rem] gsap-stagger-item gsap-card-interactive"
                   >
                     <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">نظام الخدمة</h3>
                     <p className="text-zinc-300 text-lg leading-relaxed">
                       سواء محتاج خدمة كاملة، أو معدات فقط، أو فريق ضيافة… <br/>
                       <span className="text-white font-black">إحنا جاهزين ننفّذ باحتراف.</span>
                     </p>
                   </motion.div>
                 </div>
               </div>

               <h2 className="text-6xl font-black text-white font-header mb-8 uppercase tracking-tighter gsap-reveal">إحجز الآن</h2>
               <p className="text-zinc-300 mb-20 text-lg leading-relaxed max-w-2xl mx-auto gsap-reveal">فريقنا جاهز لتصميم باقتك الخاصة والرد على كافة استفساراتكم لضمان ليلة عمر مثالية.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 gsap-stagger-container">
                  <a href="tel:01097356529" className="bg-[#0c0c0c] border border-white/5 p-16 rounded-[4rem] flex flex-col items-center card-shadow group hover:border-[#c5a059]/50 transition-all gsap-stagger-item gsap-card-interactive">
                     <span className="text-5xl mb-8 group-hover:scale-110 transition-transform">📞</span>
                     <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">اتصال مباشر</span>
                     <span className="text-3xl font-black text-white font-numbers tracking-tighter">01097356529</span>
                  </a>
                  <a href={WHATSAPP_BUSINESS_LINK} target="_blank" rel="noopener noreferrer" className="bg-[#0c0c0c] border border-white/5 p-16 rounded-[4rem] flex flex-col items-center card-shadow group hover:border-green-500/50 transition-all gsap-stagger-item gsap-card-interactive">
                     <WhatsAppIcon className="w-16 h-16 mb-8 text-[#25D366] group-hover:scale-110 transition-transform" />
                     <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">واتساب بيزنس</span>
                     <span className="text-3xl font-black text-[#c5a059] font-header">ارسل رسالة</span>
                  </a>
               </div>


				<div className="mb-20">
					<OfficeMap />
				</div>


               <div className="flex justify-center gap-12 mb-40">
                  <a href="https://www.facebook.com/share/1BQaYtSWYd/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
                     <div className="w-20 h-20 rounded-full bg-[#0c0c0c] border border-white/5 flex items-center justify-center card-shadow group-hover:border-[#1877F2]/50 transition-all group-hover:scale-110">
                        <svg className="w-10 h-10 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                     </div>
                     <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Facebook</span>
                  </a>
                  <a href="https://www.instagram.com/lkings.of.happinessl?igsh=bjZiY3RoeGNwcmQ0" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
                     <div className="w-20 h-20 rounded-full bg-[#0c0c0c] border border-white/5 flex items-center justify-center card-shadow group-hover:border-[#E4405F]/50 transition-all group-hover:scale-110">
                        <svg className="w-10 h-10 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                     </div>
                     <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Instagram</span>
                  </a>
               </div>

               {/* Complaints and Suggestions Section */}
               <div className="mt-32 pt-20 border-t border-white/5">
                 <a 
                   href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('لدي شكوى أو اقتراح:')}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="group inline-block"
                 >
                   <h3 className="text-3xl md:text-5xl font-black text-white font-header mb-6 tracking-tighter group-hover:text-royal-gold transition-all duration-300 transform group-hover:scale-105">
                     الشكاوى و الاقتراحات
                   </h3>
                 </a>
                 <div className="w-16 h-0.5 bg-royal-gold mx-auto mb-8"></div>
                 <p className="text-zinc-400 text-xl md:text-2xl font-light leading-relaxed italic">
                   أذا اسعدناك فتحدث عنا<br/>
                   وان لم نسعدك فتحدث الينا
                 </p>
               </div>
            </div>
          </div>
        )}
        
        {view === 'tools' && (
           <div className="container mx-auto px-6 py-32 animate-in fade-in duration-700 text-right">
             <div className="text-center mb-24">
               <h2 className="text-5xl md:text-7xl font-black text-white font-header mb-6">كتالوج المعدات الملكية</h2>
               <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.6em]">Visual Catalog</p>
             </div>

             {!activeEquipmentCat ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                 {EQUIPMENT_DATA.map(cat => (
                   <div key={cat.id} onClick={() => navigateTo('tools', { activeEquipmentCatId: cat.id })} className="group bg-[#0c0c0c] border border-white/5 p-10 rounded-[2.5rem] text-center cursor-pointer card-shadow relative overflow-hidden transition-all hover:border-[#c5a059]/30">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-royal-gold/5 rounded-bl-[8rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <span className="text-5xl block mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{cat.icon}</span>
                     <h3 className="text-lg font-black text-white mb-2 font-header">{cat.name}</h3>
                     <div className="mt-6 h-0.5 w-8 bg-[#c5a059]/20 mx-auto group-hover:w-16 group-hover:bg-[#c5a059] transition-all"></div>
                   </div>
                 ))}
               </div>
             ) : (
                <div>
                   <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 flex-row-reverse border-b border-white/5 pb-10">
                      <div className="text-right">
                         <h3 className="text-4xl font-black text-white font-header mb-2">{activeEquipmentCat.name}</h3>
                         <p className="text-[#c5a059] text-xs font-bold uppercase tracking-widest">تصفح المجموعة المختارة</p>
                      </div>
                      <div className="flex gap-4 flex-row-reverse items-center">
                        <button onClick={() => window.history.back()} className="royal-btn-secondary px-6 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2.5">
                           <ArrowRight className="w-4 h-4" />
                           <span>العودة</span>
                        </button>
                        {selectedEquipment.length > 0 && (
                          <button 
                            onClick={() => {
                              const allItems = activeEquipmentCat?.items || activeEquipmentCat?.sections?.flatMap(s => s.items) || [];
                              const itemsToOrder = allItems.filter(i => selectedEquipment.includes(i.id));
                              handleShareEquipment(itemsToOrder);
                            }}
                            className="royal-btn-primary px-8 py-3 text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2.5"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-black" />
                            <span>إرسال الطلب ({selectedEquipment.length})</span>
                          </button>
                        )}
                      </div>
                   </div>
                   
                   {activeEquipmentCat.extraInfo && (
                      <div className="mb-16 p-8 md:p-12 bg-[#0c0c0c] border border-[#c5a059]/20 rounded-[2.5rem] card-shadow text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>
                        <div className={`space-y-4 ${activeEquipmentCat.quickSelections ? 'mb-12' : ''}`}>
                          {activeEquipmentCat.extraInfo.map((info, idx) => (
                            <p key={idx} className="text-lg md:text-xl text-white font-black font-header leading-relaxed whitespace-pre-line">
                              {info}
                            </p>
                          ))}
                        </div>

                        {activeEquipmentCat.quickSelections && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-right" dir="rtl">
                            {activeEquipmentCat.quickSelections.map((item) => {
                              const isSelected = selectedEquipment.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => setSelectedEquipment(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                    isSelected 
                                      ? 'bg-royal-gold text-black border-royal-gold shadow-[0_10px_20px_rgba(197,160,89,0.2)]' 
                                      : 'bg-white/5 text-zinc-300 border-white/10 hover:border-royal-gold/40 hover:bg-white/10'
                                  }`}
                                >
                                   <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black shadow-inner' : 'border-white/20 bg-black/20'}`}>
                                        {isSelected && <CheckIcon className="w-3.5 h-3.5 text-royal-gold" />}
                                      </div>
                                      <span className="text-sm font-black tracking-tight">{item.name}</span>
                                   </div>
                                   <div className="flex flex-col items-end">
                                     <span className={`text-[10px] font-numbers font-black ${isSelected ? 'text-black/60' : 'text-royal-gold/60'}`}>{item.price} ج.م</span>
                                   </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                   
                   {activeEquipmentCat.items && (
                      activeEquipmentCat.displayMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {activeEquipmentCat.items.map((item) => {
                            const isSelected = selectedEquipment.includes(item.id);
                            const qty = equipmentQuantities[item.id] || 1;
                            return (
                              <div key={item.id} className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${isSelected ? 'border-royal-gold bg-royal-gold/5 shadow-royal-gold/10' : 'border-white/5 bg-[#0c0c0c] hover:border-white/10'} card-shadow`}>
                                <div className="flex justify-between items-center flex-row-reverse mb-6">
                                  <button 
                                    onClick={() => setSelectedEquipment(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                                    className="flex-1 text-right"
                                  >
                                    <h4 className={`text-lg font-black transition-colors ${isSelected ? 'text-royal-gold' : 'text-white'}`}>{item.name}</h4>
                                    {item.price && <p className="text-zinc-500 text-xs font-numbers font-black mt-1">{item.price} EGP</p>}
                                  </button>
                                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-royal-gold border-royal-gold' : 'border-white/20'}`}>
                                    {isSelected && <CheckIcon className="w-4 h-4 text-black" />}
                                  </div>
                                </div>
                                
                                {isSelected && (
                                  <div className="flex items-center justify-between bg-black/40 rounded-2xl p-4 flex-row-reverse animate-in fade-in zoom-in-95 duration-300">
                                    <div className="text-right">
                                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">العدد المطلوب</span>
                                      {item.price && <span className="text-royal-gold font-black font-numbers">{(item.price * qty).toLocaleString()} ج.م</span>}
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => updateEquipmentQty(item.id, 1)}
                                        className="w-10 h-10 rounded-xl bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold text-xl"
                                      >
                                        +
                                      </button>
                                      <input 
                                        type="number"
                                        min="1"
                                        value={qty}
                                        onChange={(e) => updateEquipmentQtySet(item.id, parseInt(e.target.value) || 1)}
                                        className="w-16 h-10 bg-white/5 border border-white/10 rounded-xl text-white text-center font-black font-numbers text-lg focus:border-royal-gold/50 outline-none transition-colors"
                                      />
                                      <button 
                                        onClick={() => updateEquipmentQty(item.id, -1)}
                                        className="w-10 h-10 rounded-xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all font-bold text-xl"
                                      >
                                        -
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                          {activeEquipmentCat.items.map((item) => (
                            <EquipmentCard 
                              key={item.id} 
                              item={item} 
                              selected={selectedEquipment.includes(item.id)}
                              quantity={equipmentQuantities[item.id] || 1}
                              onToggle={(id) => setSelectedEquipment(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                              onQuantityChange={(id, delta) => {
                                updateEquipmentQty(id, delta);
                                if (!selectedEquipment.includes(id)) {
                                  setSelectedEquipment(prev => prev.includes(id) ? prev : [...prev, id]);
                                }
                              }}
                              onQuantitySet={(id, val) => {
                                updateEquipmentQtySet(id, val);
                                if (!selectedEquipment.includes(id)) {
                                  setSelectedEquipment(prev => prev.includes(id) ? prev : [...prev, id]);
                                }
                              }}
                              onShare={(i) => handleShareEquipment([i])}
                              onZoom={(img) => setLightboxImage(img)}
                              selectedItems={selectedEquipment}
                              quantities={equipmentQuantities}
                            />
                          ))}
                        </div>
                      )
                   )}

                   {activeEquipmentCat.sections && activeEquipmentCat.sections.map((section, sIdx) => (
                      <div key={sIdx} className={sIdx > 0 ? "mt-24" : ""}>
                        {section.title && (
                          <div className="mb-12 text-right">
                            <h4 className="text-2xl md:text-3xl font-black text-royal-gold font-header whitespace-pre-line leading-relaxed">
                              {section.title}
                            </h4>
                            <div className="w-24 h-1 bg-[#c5a059] mt-6 mr-0"></div>
                          </div>
                        )}
                        {activeEquipmentCat.displayMode === 'grid' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item) => {
                              const isSelected = selectedEquipment.includes(item.id);
                              const qty = equipmentQuantities[item.id] || 1;
                              return (
                                <div key={item.id} className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${isSelected ? 'border-royal-gold bg-royal-gold/5 shadow-royal-gold/10' : 'border-white/5 bg-[#0c0c0c] hover:border-white/10'} card-shadow`}>
                                  <div className="flex justify-between items-center flex-row-reverse mb-6">
                                    <button 
                                      onClick={() => setSelectedEquipment(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                                      className="flex-1 text-right"
                                    >
                                      <h4 className={`text-lg font-black transition-colors ${isSelected ? 'text-royal-gold' : 'text-white'}`}>{item.name}</h4>
                                      {item.price && <p className="text-zinc-500 text-xs font-numbers font-black mt-1">{item.price} EGP</p>}
                                    </button>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-royal-gold border-royal-gold' : 'border-white/20'}`}>
                                      {isSelected && <CheckIcon className="w-4 h-4 text-black" />}
                                    </div>
                                  </div>
                                  
                                  {isSelected && (
                                    <div className="flex items-center justify-between bg-black/40 rounded-xl p-3 flex-row-reverse animate-in fade-in zoom-in-95 duration-300">
                                      <div className="text-right">
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">العدد المطلوب</span>
                                        {item.price && <span className="text-royal-gold font-black font-numbers">{(item.price * qty).toLocaleString()} ج.م</span>}
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <button 
                                          onClick={() => updateEquipmentQty(item.id, 1)}
                                          className="w-8 h-8 rounded-full bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold"
                                        >
                                          +
                                        </button>
                                        <input 
                                          type="number"
                                          min="1"
                                          value={qty}
                                          onChange={(e) => updateEquipmentQtySet(item.id, parseInt(e.target.value) || 1)}
                                          className="w-12 h-8 bg-white/5 border border-white/10 rounded-lg text-white text-center font-black font-numbers text-sm focus:border-royal-gold/50 outline-none transition-colors"
                                        />
                                        <button 
                                          onClick={() => updateEquipmentQty(item.id, -1)}
                                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all font-bold"
                                        >
                                          -
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                            {section.items.map((item) => (
                              <EquipmentCard 
                                key={item.id} 
                                item={item} 
                                selected={selectedEquipment.includes(item.id)}
                                quantity={equipmentQuantities[item.id] || 1}
                                onToggle={(id) => setSelectedEquipment(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                                onQuantityChange={(id, delta) => {
                                  updateEquipmentQty(id, delta);
                                  if (!selectedEquipment.includes(id)) {
                                    setSelectedEquipment(prev => prev.includes(id) ? prev : [...prev, id]);
                                  }
                                }}
                                onQuantitySet={(id, val) => {
                                  updateEquipmentQtySet(id, val);
                                  if (!selectedEquipment.includes(id)) {
                                    setSelectedEquipment(prev => prev.includes(id) ? prev : [...prev, id]);
                                  }
                                }}
                                onShare={(i) => handleShareEquipment([i])}
                                onZoom={(img) => setLightboxImage(img)}
                                selectedItems={selectedEquipment}
                                quantities={equipmentQuantities}
                                displayOnly={section.displayOnly}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                   ))}


                </div>
             )}
           </div>
        )}

        <AnimatePresence>
          {lightboxImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6" 
              onClick={() => setLightboxImage(null)}
            >
              <button className="absolute top-10 right-10 text-white hover:text-[#c5a059] transition-colors z-10">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={lightboxImage} 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
                alt="Zoomed View" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {view !== 'home' && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.history.back()}
            className="fixed bottom-[calc(env(safe-area-inset-bottom,0.75rem)+1.25rem)] right-4 md:right-10 z-[120] w-13 h-13 md:w-16 md:h-16 rounded-full royal-btn-secondary !p-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center group overflow-hidden border border-royal-gold/40 hover:border-royal-gold"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-royal-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-royal-gold group-hover:text-white transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-tighter relative z-10 text-zinc-300 group-hover:text-royal-gold transition-colors">عودة</span>
          </motion.button>
        )}
      </AnimatePresence>

      {view !== 'home' && (
        <FloatingCart 
          navigateTo={navigateTo}
          selectedEquipment={selectedEquipment}
          equipmentQuantities={equipmentQuantities}
          onQuantityChange={updateEquipmentQty}
          onRemoveEquipment={removeEquipment}
          onShare={handleEquipmentOnlyOrder}
          allEquipmentItems={allEquipmentItems}
          selectedBeverages={selectedBeverages}
          beverageQuantities={beverageQuantities}
          onBeverageQuantityChange={handleBeverageQty}
          onRemoveBeverage={removeBeverage}
          selectedDrinks={selectedDrinks}
          drinkQuantities={drinkQuantities}
          onDrinkQuantityChange={handleDrinkQty}
          onRemoveDrink={removeDrink}
          selectedExtraServices={selectedExtraServices}
          serviceQuantities={serviceQuantities}
          onServiceQuantityChange={handleServiceQty}
          onRemoveService={removeService}
          selectedPkg={selectedPkg}
          onRemovePkg={removePkg}
          calcPax={calcPax}
          onPaxChange={setCalcPax}
          onMenuOrder={handleOrder}
          totalPrice={calculateTotal()}
          onClearAll={clearAll}
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          onZoom={(img) => setLightboxImage(img)}
        />
      )}

      <CustomerInfoModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onConfirm={confirmAndSendOrder}
        info={customerInfo}
        setInfo={setCustomerInfo}
      />

      <footer className="py-24 md:py-36 bg-[#020202] text-center relative overflow-hidden">
         {/* Background Video with luxury atmospheric treatment */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video 
               autoPlay 
               loop 
               muted 
               playsInline 
               preload="auto"
               className="w-full h-full object-cover object-center scale-105"
               style={{ 
                  filter: 'blur(0.5px) brightness(0.65) contrast(1.1) saturate(1.05)'
               }}
            >
               <source src="https://res.cloudinary.com/dhktkzpap/video/upload/171262654_1788182400783352_jlqkjm.mp4" type="video/mp4" />
               <source src="https://res.cloudinary.com/dhktkzpap/video/upload/171262654_1788182400783352_jlqkjm.webm" type="video/webm" />
               {/* Embed iframe fallback */}
               <iframe 
                  src="https://player.cloudinary.com/embed/?cloud_name=dhktkzpap&public_id=171262654_1788182400783352_jlqkjm&player[muted]=true&player[autoplay]=true&player[loop]=true&player[controls]=false" 
                  className="w-full h-full object-cover border-0"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  title="Footer Background Video"
               />
            </video>
         </div>

         {/* Cinematic gradient blend connecting seamlessly with the page */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/45 to-[#020202] pointer-events-none" />
         {/* Subtle royal vignette */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(2,2,2,0.75)_100%)] pointer-events-none" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-royal-gold/8 blur-[130px] rounded-full pointer-events-none"></div>

         <div className="flex justify-center items-center mb-10 mx-auto max-w-full relative z-10" style={{ width: '916px', height: '132.9896px' }}>
            <BrandLogo className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]" showGlow={true} />
         </div>
         <h2 className="text-royal-gold font-black text-4xl md:text-5xl font-header mb-6 tracking-tighter relative z-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">ملوك السعادة</h2>
         <p className="text-zinc-200 text-[9px] md:text-[10px] font-black uppercase tracking-[0.8em] mb-8 relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">The Royal Taste of Happiness</p>
         
         <div className="flex justify-center gap-6 mb-12 relative z-10">
            <a href="tel:+201097356529" className="text-white hover:text-royal-gold transition-colors p-2.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
              <PhoneIcon className="w-5 h-5" />
            </a>
            <a href="https://wa.me/201097356529" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-2.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <a href="https://www.google.com/maps?q=30.0076434,31.2152192&z=17&hl=en" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-2.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
              <MapPinIcon className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/lkings.of.happinessl?igsh=bjZiY3RoeGNwcmQ0" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-2.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/share/1BQaYtSWYd/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-2.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
              <FacebookIcon className="w-5 h-5" />
            </a>
         </div>

         <p className="text-zinc-200 text-[9px] font-bold uppercase tracking-widest relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">© 2025 Molok El Saada. Designed for Royalty.</p>
      </footer>
    </div>
  );
};

export default App;
