
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { OPEN_BUFFET, SET_MENUS, HIGH_TEA, FINGER_FOOD, COFFEE_CORNER, DESSERTS, SOFT_DRINKS, SERVICE_COSTS, EQUIPMENT_DATA, HOT_ADDONS, PER_PERSON_ADDONS, STATIONS_MENU, MEALS, ADDONS, EquipmentCategory, EquipmentItem } from './data';
import { MenuPackage } from './types';

// --- CONFIGURATION ---
const USER_LOGO_URL = "https://i.postimg.cc/xj33dFYd/Picsart-26-01-31-03-15-31-627.png"; 
const WHATSAPP_PHONE = "201097653529";
const WHATSAPP_BUSINESS_LINK = "https://api.whatsapp.com/message/DGJGT3UAUR6UE1?autoload=1&app_absent=0";

// --- Shared Components ---

const BrandLogo: React.FC<{ className?: string; showGlow?: boolean }> = ({ 
  className = "w-20 h-20", 
  showGlow = true
}) => {
  return (
    <div className={`${className} relative flex items-center justify-center overflow-visible group transition-transform duration-700`}>
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
        />
      ) : (
        <span className="text-[#c5a059] font-black text-xs font-header">ملوك السعادة</span>
      )}
    </div>
  );
};

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ChafingDishIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h18" />
    <path d="M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    <path d="M12 2v4" />
    <path d="M7 20v2" />
    <path d="M17 20v2" />
  </svg>
);

const FloatingAssistant: React.FC<{
  selectedEquipment: string[];
  equipmentQuantities: Record<string, number>;
  onQuantityChange: (id: string, delta: number) => void;
  onShare: (items: EquipmentItem[]) => void;
  allEquipmentItems: EquipmentItem[];
}> = ({ selectedEquipment, equipmentQuantities, onQuantityChange, onShare, allEquipmentItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'basket'>('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'مرحباً بك في عالم ملوك السعادة. يسعدني مساعدتك في تخطيط ضيافتك الملكية اليوم.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedItems = useMemo(() => {
    return allEquipmentItems.filter(item => selectedEquipment.includes(item.id));
  }, [selectedEquipment, allEquipmentItems]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const prevLength = useRef(selectedEquipment.length);
  // Automatically switch to basket tab and open it when an item is added for the first time
  useEffect(() => {
    if (selectedEquipment.length > prevLength.current) {
      setActiveTab('basket');
      setIsOpen(true);
    }
    prevLength.current = selectedEquipment.length;
  }, [selectedEquipment.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'أنت المساعد الملكي لشركة ملوك السعادة. رد بأسلوب راقٍ جداً، مهذب، وباللهجة المصرية المحببة. ركز على الفخامة والجودة والضيافة الكريمة.'
        }
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "عذراً، هل يمكنك تكرار طلبك؟" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "للمساعدة الفورية، يمكنكم مراسلتنا عبر الواتساب." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasItems = selectedEquipment.length > 0;

  return (
    <div className="fixed bottom-28 left-6 md:bottom-10 md:left-10 z-[100]">
      {isOpen ? (
        <div className="bg-[#0c0c0c] border border-[#c5a059]/30 w-[320px] md:w-[380px] h-[550px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 origin-bottom-left text-right">
          {/* Header */}
          <div className="p-6 bg-[#111] border-b border-[#c5a059]/10 flex justify-between items-center flex-row-reverse">
            <div className="flex items-center gap-3 flex-row-reverse">
              <BrandLogo className="w-10 h-10" showGlow={false} />
              <div className="text-right">
                <h4 className="text-white text-xs font-black uppercase tracking-widest">
                  {activeTab === 'chat' ? 'مساعدك الملكي' : 'سلة المعدات'}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold">
                    {activeTab === 'chat' ? 'Online Now' : `${selectedItems.length} Items Selected`}
                  </span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-black/40 p-1 border-b border-white/5">
            <button 
              onClick={() => setActiveTab('basket')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'basket' ? 'bg-[#c5a059] text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              <ChafingDishIcon className="w-3 h-3" />
              السلة
              {hasItems && <span className="bg-black text-[#c5a059] text-[8px] px-1.5 py-0.5 rounded-full">{selectedItems.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-[#c5a059] text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              المساعد
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'chat' ? (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 text-right">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-[#c5a059]/10 text-zinc-200 border border-[#c5a059]/10'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-[#111] border-t border-white/5">
                  <div className="relative">
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="كيف يمكننا خدمتك؟" className="w-full bg-black border border-white/10 rounded-full py-3 px-5 text-xs text-white outline-none focus:border-[#c5a059]/50 transition-all text-right pl-12" />
                    <button onClick={handleSend} disabled={isLoading} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-royal-gold rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {selectedItems.length > 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                      {selectedItems.map(item => (
                        <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between flex-row-reverse gap-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 text-right">
                            <h5 className="text-white text-[10px] font-black leading-tight mb-1">{item.name}</h5>
                            <div className="flex items-center gap-3 justify-end">
                              <button 
                                onClick={() => onQuantityChange(item.id, 1)}
                                className="w-6 h-6 rounded-full bg-royal-gold/10 text-royal-gold flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                              <span className="text-white font-numbers text-xs">{equipmentQuantities[item.id] || 1}</span>
                              <button 
                                onClick={() => onQuantityChange(item.id, -1)}
                                className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => onShare(selectedItems)}
                      className="mt-6 w-full bg-royal-gold text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl gold-shimmer text-[10px]"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      ارسل الطلب للواتساب
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-zinc-600">
                      <ChafingDishIcon className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="text-zinc-500 text-xs font-bold">السلة فارغة حالياً</p>
                    <button onClick={() => setIsOpen(false)} className="text-[#c5a059] text-[10px] font-black uppercase tracking-widest underline">تصفح المعدات</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all gold-shimmer group relative ${hasItems ? 'bg-royal-gold' : 'bg-royal-gold'}`}
        >
          {hasItems ? (
            <>
              <ChafingDishIcon className="w-8 h-8 text-black" />
              <span className="absolute -top-1 -right-1 bg-black text-royal-gold w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border border-royal-gold animate-bounce">
                {selectedItems.length}
              </span>
            </>
          ) : (
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          )}
        </button>
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
  onShare: (item: EquipmentItem) => void; 
  onZoom: (image: string) => void;
}> = ({ item, selected, quantity, onToggle, onQuantityChange, onShare, onZoom }) => (
  <div className="break-inside-avoid bg-[#0c0c0c] border border-white/5 rounded-[1.5rem] overflow-hidden card-shadow relative group">
    <img 
      src={item.image} 
      alt={item.id} 
      onClick={() => onZoom(item.image)}
      className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105 cursor-zoom-in" 
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.src = `https://placehold.co/800x600/111/c5a059?text=${item.id}`;
      }}
    />
    
    <div className="p-5 border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="flex justify-between items-start flex-row-reverse mb-4 gap-4">
        <div className="text-right flex-1">
          {item.name && <h4 className="text-white font-black text-sm mb-1 font-header whitespace-pre-line leading-tight">{item.name}</h4>}
          {item.price && (
            <div className="flex items-baseline gap-1 flex-row-reverse justify-start">
              <span className="text-royal-gold font-black text-lg font-numbers">{item.price}</span>
              <span className="text-zinc-500 text-[10px] font-bold uppercase">EGP</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Quantity Selector & Action Buttons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-row-reverse bg-white/5 rounded-2xl p-3 border border-white/5">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">الكمية</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, 1); }}
              className="w-10 h-10 rounded-full bg-royal-gold/10 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold text-lg"
            >
              +
            </button>
            <span className="text-white font-black text-lg font-numbers min-w-[1.5rem] text-center">{quantity}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, -1); }}
              className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all font-bold text-lg"
            >
              -
            </button>
          </div>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => onToggle(item.id)}
             className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${selected ? 'bg-royal-gold text-black scale-[1.02]' : 'bg-white/10 text-white hover:bg-white/20'}`}
           >
             {selected ? (
               <>
                 <ChafingDishIcon className="w-4 h-4" />
                 <span>تم الاختيار</span>
               </>
             ) : (
               'أضف للطلب'
             )}
           </button>
           <button 
             onClick={() => onShare(item)}
             className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg shrink-0"
             title="اطلب عبر واتساب"
           >
             <WhatsAppIcon className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>

    {selected && (
      <div className="absolute top-4 left-4 bg-royal-gold text-black p-2 rounded-full shadow-xl gold-shimmer animate-in zoom-in duration-300">
        <ChafingDishIcon className="w-4 h-4" />
      </div>
    )}
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'portal' | 'category' | 'tools' | 'contact' | 'calculator'>('home');
  const [activeCategory, setActiveCategory] = useState<MenuPackage[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [calcPax, setCalcPax] = useState(100);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('');
  const [selectedExtraServices, setSelectedExtraServices] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedHotAddons, setSelectedHotAddons] = useState<string[]>([]);
  const [selectedPerPersonAddons, setSelectedPerPersonAddons] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentQuantities, setEquipmentQuantities] = useState<Record<string, number>>({});
  const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const [activeEquipmentCat, setActiveEquipmentCat] = useState<EquipmentCategory | null>(null);

  const openCategory = (name: string, data: MenuPackage[]) => {
    setCategoryName(name);
    setActiveCategory(data);
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allPackages = useMemo(() => [...OPEN_BUFFET, ...SET_MENUS, ...HIGH_TEA, ...FINGER_FOOD, ...STATIONS_MENU, ...MEALS, ...ADDONS], []);
  const selectedPkg = useMemo(() => allPackages.find(p => p.id === selectedPkgId), [selectedPkgId, allPackages]);

  const calculateTotal = () => {
    if (!selectedPkg) return 0;
    let total = selectedPkg.perPerson ? selectedPkg.price * calcPax : selectedPkg.price;
    
    selectedExtraServices.forEach(srv => {
      const srvData = SERVICE_COSTS.find(s => s.label === srv);
      if (srvData) {
        const costNum = parseInt(srvData.price.replace(/[^0-9]/g, '') || '0');
        const qty = serviceQuantities[srv] || 1;
        
        if (srv.includes('Cover') || srv.includes('فرد')) {
          total += costNum * calcPax;
        } else if (srv.includes('ويترز') || srv === 'شيف' || srv === 'باريستا') {
          total += costNum * qty;
        } else {
          total += costNum;
        }
      }
    });

    selectedDrinks.forEach(drk => {
      const drkData = SOFT_DRINKS.find(d => d.name === drk);
      if (drkData) {
        total += drkData.price * calcPax;
      }
    });

    selectedHotAddons.forEach(addon => {
      const addonData = HOT_ADDONS.find(a => a.label === addon);
      if (addonData) {
        total += addonData.price;
      }
    });

    selectedPerPersonAddons.forEach(addon => {
      const addonData = PER_PERSON_ADDONS.find(a => a.label === addon);
      if (addonData) {
        total += addonData.price * calcPax;
      }
    });

    return total;
  };

  const handleOrder = () => {
    const pkgTitle = selectedPkg?.title || 'باقة مخصصة';
    const total = calculateTotal().toLocaleString();
    
    let details = `*طلب حجز من ملوك السعادة*\n\n`;
    details += `*الباقة:* ${pkgTitle}\n`;
    if (selectedPkg) {
      details += `*سعر الباقة:* ${selectedPkg.price.toLocaleString()} ج.م ${selectedPkg.perPerson ? 'للفرد' : ''}\n`;
    }
    details += `*العدد:* ${calcPax} فرد\n\n`;

    if (selectedExtraServices.length > 0) {
      details += `*الخدمات الإضافية:*\n`;
      selectedExtraServices.forEach(srv => {
        const srvData = SERVICE_COSTS.find(s => s.label === srv);
        if (srvData) {
          const qty = serviceQuantities[srv] || 1;
          const costNum = parseInt(srvData.price.replace(/[^0-9]/g, '') || '0');
          if (srv.includes('ويترز') || srv === 'شيف' || srv === 'باريستا') {
            details += `- ${srv} (عدد ${qty}): ${(costNum * qty).toLocaleString()} ج.م\n`;
          } else if (srv.includes('Cover') || srv.includes('فرد')) {
            details += `- ${srv} (لـ ${calcPax} فرد): ${(costNum * calcPax).toLocaleString()} ج.م\n`;
          } else {
            details += `- ${srv}: ${srvData.price}\n`;
          }
        }
      });
      details += `\n`;
    }

    if (selectedDrinks.length > 0) {
      details += `*المشروبات (لـ ${calcPax} فرد):*\n`;
      selectedDrinks.forEach(drk => {
        const drkData = SOFT_DRINKS.find(d => d.name === drk);
        if (drkData) {
          details += `- ${drk}: ${(drkData.price * calcPax).toLocaleString()} ج.م\n`;
        }
      });
      details += `\n`;
    }

    if (selectedHotAddons.length > 0) {
      details += `*إضافات سخنة:*\n`;
      selectedHotAddons.forEach(addon => {
        const addonData = HOT_ADDONS.find(a => a.label === addon);
        if (addonData) {
          details += `- ${addon}: ${addonData.price.toLocaleString()} ج.م\n`;
        }
      });
      details += `\n`;
    }

    if (selectedPerPersonAddons.length > 0) {
      details += `*إضافات اختيارية (بالفرد):*\n`;
      selectedPerPersonAddons.forEach(addon => {
        const addonData = PER_PERSON_ADDONS.find(a => a.label === addon);
        if (addonData) {
          details += `- ${addon}: ${addonData.price.toLocaleString()} ج.م × ${calcPax} = ${(addonData.price * calcPax).toLocaleString()} ج.م\n`;
        }
      });
      details += `\n`;
    }

    details += `*الإجمالي النهائي:* ${total} ج.م\n\n`;
    details += `يرجى التواصل للتأكيد وتحديد الموعد.`;

    const message = encodeURIComponent(details);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
  };

  const sharePackage = (pkg: MenuPackage) => {
    const msg = `أرغب في حجز باقة: ${pkg.title}
يرجى التواصل معي للتفاصيل.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const updateEquipmentQty = (id: string, delta: number) => {
    setEquipmentQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const shareEquipment = (items: EquipmentItem | EquipmentItem[]) => {
    const itemsArray = Array.isArray(items) ? items : [items];
    if (itemsArray.length === 0) return;
    
    let details = "";
    let grandTotal = 0;

    itemsArray.forEach((item, index) => {
      const qty = equipmentQuantities[item.id] || 1;
      const price = item.price || 0;
      const total = price * qty;
      grandTotal += total;

      details += `اسم المعدة: ${item.name || item.id}\n`;
      details += `العدد: ${qty}\n`;
      if (price > 0) {
        details += `السعر توتال: ${total} ج.م\n`;
      }
      details += `لينك الصورة: ${item.image}\n`;
      if (index < itemsArray.length - 1) details += `------------------\n`;
    });

    if (itemsArray.length > 1 && grandTotal > 0) {
      details += `\n*الإجمالي الكلي: ${grandTotal} ج.م*`;
    }

    const message = encodeURIComponent(details);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
  };

  const allEquipmentItems = useMemo(() => {
    const items: EquipmentItem[] = [];
    EQUIPMENT_DATA.forEach(cat => {
      if (cat.items) items.push(...cat.items);
      if (cat.sections) {
        cat.sections.forEach(sec => items.push(...sec.items));
      }
    });
    return items;
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 overflow-x-hidden">
      <header className="sticky top-0 z-[90] nav-glass px-6 md:px-12 py-4 flex justify-between items-center text-right">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('home')}>
          <div className="hover:scale-105 transition-transform">
            <BrandLogo className="w-14 h-14 md:w-20 md:h-20" showGlow={false} />
          </div>
          <div className="hidden sm:block text-right">
            <h1 className="text-white font-black text-lg md:text-xl tracking-tighter font-header">ملوك السعادة</h1>
            <p className="text-[8px] text-[#c5a059] uppercase tracking-[0.4em] font-numbers font-bold">Royal Excellence</p>
          </div>
        </div>
        
        <nav className="hidden lg:flex gap-4">
          <NavItem id="home" label="الرئيسية" active={view === 'home'} onClick={() => setView('home')} />
          <NavItem id="portal" label="المنيو" active={view === 'portal' || view === 'category'} onClick={() => setView('portal')} />
          <NavItem id="calculator" label="الحاسبة" active={view === 'calculator'} onClick={() => setView('calculator')} />
          <NavItem id="tools" label="المعدات" active={view === 'tools'} onClick={() => { setView('tools'); setActiveEquipmentCat(null); }} />
          <NavItem id="contact" label="تواصل معنا" active={view === 'contact'} onClick={() => setView('contact')} />
        </nav>

        <button onClick={() => setView('calculator')} className="bg-royal-gold text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl gold-shimmer hover:scale-105 transition-transform">
           احجز الآن
        </button>
      </header>

      <main className="min-h-screen">
        {view === 'home' && (
          <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative h-[95vh] flex items-center overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.15)_0%,_transparent_70%)]"></div>
               <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c5a059]/10 blur-[120px] rounded-full animate-pulse"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c5a059]/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
               </div>
               
               <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 text-right relative z-10">
                  <div className="order-2 lg:order-1 text-right">
                    <div className="inline-flex items-center gap-3 mb-8 flex-row-reverse">
                      <span className="w-12 h-px bg-[#c5a059]"></span>
                      <span className="text-[#c5a059] text-xs font-black uppercase tracking-[0.5em]">Royal Catering Since 2015</span>
                    </div>
                    <h2 className="text-white text-6xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-8 font-header select-none">ملوك<br/><span className="text-royal-gold gold-text-glow">السعادة</span></h2>
                    <p className="text-zinc-300 text-lg md:text-2xl max-w-xl ml-auto leading-relaxed mb-12 font-light">
                      نحن لا نقدم الطعام فحسب، بل نصمم تجربة ضيافة ملكية تليق بأهم لحظات حياتكم. جودة المذاق وفخامة العرض هما سر تميزنا.
                    </p>
                    <div className="flex flex-wrap justify-end gap-6">
                       <button onClick={() => setView('portal')} className="bg-royal-gold text-black px-12 py-5 rounded-full font-black uppercase tracking-widest shadow-[0_0_30px_rgba(197,160,89,0.3)] gold-shimmer text-xs hover:scale-105 transition-all duration-500">استعراض القوائم الملكية</button>
                       <button onClick={() => setView('calculator')} className="border border-white/10 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white/5 transition-all text-xs backdrop-blur-sm">حساب ميزانيتك</button>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 flex justify-center">
                     <div className="relative group animate-float">
                        <div className="absolute inset-0 bg-[#c5a059]/20 blur-[120px] rounded-full scale-125 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <BrandLogo className="w-72 h-72 md:w-[600px] md:h-[600px]" />
                     </div>
                  </div>
               </div>
               
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
                 <span className="text-[8px] text-[#c5a059] uppercase tracking-widest font-bold">Scroll</span>
                 <div className="w-px h-12 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
               </div>
            </section>

            {/* Royal Process Section */}
            <section className="py-32 bg-[#050505] relative">
              <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-right">
                  <h2 className="text-4xl md:text-6xl font-black text-white font-header mb-16 tracking-tighter">رحلتك نحو <span className="text-royal-gold">الكمال</span></h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                      { step: '01', title: 'الاستشارة الملكية', desc: 'نجلس معك لنفهم رؤيتك وتفاصيل مناسبتك الخاصة.' },
                      { step: '02', title: 'تصميم القائمة', desc: 'نصمم قائمة طعام مخصصة تناسب ذوقك وميزانيتك.' },
                      { step: '03', title: 'التنفيذ الفاخر', desc: 'نهتم بكل التفاصيل من التحضير وحتى التقديم النهائي.' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-4">
                        <span className="text-6xl font-black text-royal-gold/20 font-numbers">{item.step}</span>
                        <div>
                          <h4 className="text-white text-xl font-black mb-3 font-header">{item.title}</h4>
                          <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery Section - Royal Moments */}
            <section className="py-40 bg-[#080808] border-y border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              </div>
              
              <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                   <h2 className="text-6xl md:text-[5.5rem] font-black text-white font-header mb-6 tracking-tighter leading-none">لحظات <span className="text-royal-gold">ملكية</span></h2>
                   <div className="w-24 h-1 bg-royal-gold mx-auto mb-8"></div>
                   <p className="text-[#c5a059] text-sm font-black uppercase tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">شاهد فخامة الخدمة وجودة التقديم في مناسبات عملائنا</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774905127/IMG-20251215-WA0067_1_zc3ofs.jpg', class: 'col-span-2 row-span-2' },
                    { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.08_AM_3_ophvez.jpg', class: 'col-span-1 row-span-1' },
                    { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.08_AM_2_l8uylj.jpg', class: 'col-span-1 row-span-1' },
                    { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.07_AM_mu08y8.jpg', class: 'col-span-1 row-span-1' },
                    { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826482/WhatsApp_Image_2026-03-30_at_1.20.08_AM_vscdnh.jpg', class: 'col-span-1 row-span-1' },
                  ].map((img, i) => (
                    <div key={i} className={`${img.class} group relative overflow-hidden rounded-[2rem] md:rounded-[3rem] card-shadow border border-white/5 cursor-zoom-in`} onClick={() => setLightboxImage(img.url)}>
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

                <div className="mt-20 text-center">
                   <button onClick={() => setView('portal')} className="group flex items-center gap-4 mx-auto text-white font-black uppercase tracking-[0.3em] text-xs hover:text-[#c5a059] transition-colors">
                      <span className="w-12 h-px bg-white/20 group-hover:bg-[#c5a059]/50 transition-colors"></span>
                      استكشف المنيو الكامل
                      <span className="w-12 h-px bg-white/20 group-hover:bg-[#c5a059]/50 transition-colors"></span>
                   </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'portal' && (
          <div className="container mx-auto px-6 py-32 animate-in slide-in-from-bottom-10 duration-700">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black text-white font-header mb-6">قوائم الضيافة</h2>
              <p className="text-[#c5a059] text-xs font-black uppercase tracking-[0.6em]">Choose Your Royal Experience</p>
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                {[
                  { name: 'Open Buffet', icon: '🍽️', data: OPEN_BUFFET, desc: 'البوفيه المفتوح الفاخر' },
                  { name: 'Set Menu', icon: '🍱', data: SET_MENUS, desc: 'الوجبات المحددة الأنيقة' },
                  { name: 'High Tea', icon: '🥪', data: HIGH_TEA, desc: 'الضيافة الخفيفة والحلويات' },
                  { name: 'Finger Food', icon: '🍢', data: FINGER_FOOD, desc: 'سناكس وساندوتشات ميني' },
                  { name: 'Stations Menu', icon: '👨‍🍳', data: STATIONS_MENU, desc: 'استيشنات الطهي المباشر' },
                  { name: 'Meals', icon: '🍱', data: MEALS, desc: 'الوجبات الفردية المتكاملة' },
                  { name: 'Additions', icon: '✨', data: ADDONS, desc: 'إضافات متنوعة لكل المناسبات' },
                ].map((cat, i) => (
                <div key={i} onClick={() => openCategory(cat.name, cat.data)} className="group bg-[#0c0c0c] border border-white/5 p-10 rounded-[3rem] text-center cursor-pointer card-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/5 rounded-bl-[10rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-7xl block mb-8 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">{cat.icon}</span>
                  <h3 className="text-xl font-black text-white group-hover:text-[#c5a059] transition-colors mb-4 font-header">{cat.name}</h3>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">{cat.desc}</p>
                  <div className="mt-10 h-0.5 w-12 bg-zinc-800 mx-auto group-hover:w-24 group-hover:bg-[#c5a059] transition-all"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'category' && (activeCategory.length > 0) && (
          <div className="container mx-auto px-6 py-32 animate-in fade-in duration-500 text-right">
            <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8 flex-row-reverse">
              <button onClick={() => setView('portal')} className="group flex items-center gap-3 text-[#c5a059] text-[10px] font-black uppercase tracking-widest">
                <span className="w-8 h-8 rounded-full border border-[#c5a059]/30 flex items-center justify-center group-hover:bg-[#c5a059] group-hover:text-black transition-all">←</span> العودة للقوائم
              </button>
              <h2 className="text-5xl font-black text-white font-header">{categoryName}</h2>
              <div className="w-24 h-0.5 bg-[#c5a059] hidden md:block"></div>
            </div>

            {(categoryName === 'Open Buffet' || categoryName === 'Finger Food') && (
              <div className="mb-16 bg-[#0c0c0c] border border-[#c5a059]/20 p-8 rounded-[2.5rem] card-shadow text-right max-w-2xl mx-auto">
                <h4 className="text-[#c5a059] font-black mb-4 text-lg border-b border-white/5 pb-2">التجهيزات والنقل</h4>
                <div className="space-y-2 text-zinc-300 text-sm font-bold">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span>ROYAL Setup</span>
                    <span className="text-white">3500 LE</span>
                  </div>
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span>LIGHT ROYAL Setup</span>
                    <span className="text-white">2500 LE</span>
                  </div>
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span>النقل</span>
                    <span className="text-white">حسب المكان</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 text-[#c5a059] text-xs">
                    المشروبات والخدمات الإضافية في نهاية السيكشن
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {activeCategory.map((pkg) => (
                <div key={pkg.id} className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-10 md:p-14 card-shadow relative overflow-hidden flex flex-col">
                  {/* ... existing package content ... */}
                  <div className="flex justify-between items-start mb-12 flex-wrap gap-6 flex-row-reverse">
                    <div className="text-right">
                      <h3 className="text-3xl font-black text-royal-gold font-header mb-4">{pkg.title}</h3>
                      <div className="flex gap-2 flex-row-reverse">
                        {pkg.minPeople && <span className="bg-white/10 text-[9px] font-bold px-3 py-1 rounded-full uppercase text-zinc-300 border border-white/10">Min. {pkg.minPeople} PAX</span>}
                        <span className="bg-[#c5a059]/10 text-[9px] font-bold px-3 py-1 rounded-full uppercase text-[#c5a059] border border-[#c5a059]/20">{pkg.perPerson ? 'Per Person' : 'Package Deal'}</span>
                        <span className="bg-white/5 text-[9px] font-bold px-3 py-1 rounded-full uppercase text-zinc-400 border border-white/5 italic">إضافات اختيارية متاحة بالحاسبة</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-5xl font-black text-white font-numbers tracking-tighter">{pkg.price.toLocaleString()}</div>
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2 block">EGP {pkg.perPerson ? '/ Person' : 'Total'}</span>
                    </div>
                  </div>
                  <div className="space-y-12 flex-1">
                    {pkg.sections.map((sec, i) => (
                      <div key={i} className="text-right">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-6 flex items-center gap-4 flex-row-reverse">
                          <span className="flex-1 h-px bg-[#c5a059]/10"></span> {sec.name}
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sec.items.map((item, j) => (
                            <li key={j} className="text-zinc-300 text-sm flex flex-row-reverse items-start gap-3 group/item cursor-default">
                              <span className="text-[#c5a059] group-hover/item:scale-125 transition-transform mt-1.5">•</span>
                              <span className="group-hover/item:text-white transition-colors">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-14 flex gap-4">
                    <button 
                      onClick={() => { setSelectedPkgId(pkg.id); setView('calculator'); }} 
                      className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                    >
                      احسب التكلفة
                    </button>
                    <button 
                      onClick={() => sharePackage(pkg)} 
                      className="flex-1 py-5 rounded-2xl bg-royal-gold text-black font-black uppercase tracking-widest shadow-xl gold-shimmer text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      اطلب الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(categoryName === 'Finger Food' || categoryName === 'High Tea' || categoryName === 'Set Menu') && (
              <div className="mt-24 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="text-center">
                  <h3 className="text-4xl font-black text-white font-header mb-4">
                    إضافات اختيارية {categoryName === 'High Tea' ? 'للهاي تي' : categoryName === 'Set Menu' ? 'للسيت منيو' : 'لفينجر فود'}
                  </h3>
                  <div className="w-24 h-1 bg-[#c5a059] mx-auto"></div>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 ${categoryName === 'Set Menu' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8`}>
                  {categoryName === 'Set Menu' && (
                    <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] card-shadow">
                      <h4 className="text-[#c5a059] font-black mb-6 text-lg border-b border-white/5 pb-4">إضافات سخنة</h4>
                      <ul className="space-y-4">
                        {HOT_ADDONS.map((item, i) => (
                          <li key={i} className="flex justify-between items-center flex-row-reverse text-zinc-300">
                            <span className="font-bold">{item.label}</span>
                            <span className="font-numbers text-[#c5a059] font-black">{item.price} LE</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] card-shadow">
                    <h4 className="text-[#c5a059] font-black mb-6 text-lg border-b border-white/5 pb-4">المشروبات والعصائر</h4>
                    <ul className="space-y-4">
                      {SOFT_DRINKS.map((item, i) => (
                        <li key={i} className="flex justify-between items-center flex-row-reverse text-zinc-300">
                          <span className="font-bold">{item.name}</span>
                          <span className="font-numbers text-[#c5a059] font-black">{item.price} LE</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] card-shadow">
                    <h4 className="text-[#c5a059] font-black mb-6 text-lg border-b border-white/5 pb-4">طاقم الخدمة</h4>
                    <ul className="space-y-4">
                      {SERVICE_COSTS.filter(s => s.label.includes('ويترز') || s.label === 'شيف' || s.label === 'باريستا').map((item, i) => (
                        <li key={i} className="flex justify-between items-center flex-row-reverse text-zinc-300">
                          <span className="font-bold">{item.label}</span>
                          <span className="font-numbers text-[#c5a059] font-black">{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] card-shadow">
                    <h4 className="text-[#c5a059] font-black mb-6 text-lg border-b border-white/5 pb-4">
                      {categoryName === 'High Tea' || categoryName === 'Set Menu' ? 'الكوڤير والأطباق' : 'التجهيزات والنقل'}
                    </h4>
                    <ul className="space-y-4">
                      {categoryName === 'High Tea' || categoryName === 'Set Menu' ? (
                        SERVICE_COSTS.filter(s => s.label.includes('فرد')).map((item, i) => (
                          <li key={i} className="flex justify-between items-center flex-row-reverse text-zinc-300">
                            <span className="font-bold">{item.label}</span>
                            <span className="font-numbers text-[#c5a059] font-black">{item.price}</span>
                          </li>
                        ))
                      ) : (
                        SERVICE_COSTS.filter(s => s.label.includes('Setup') || s.label === 'النقل').map((item, i) => (
                          <li key={i} className="flex justify-between items-center flex-row-reverse text-zinc-300">
                            <span className="font-bold">{item.label}</span>
                            <span className="font-numbers text-[#c5a059] font-black">{item.price}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="text-center pt-8">
                  <button 
                    onClick={() => setView('calculator')}
                    className="px-12 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl"
                  >
                    انتقل للحاسبة لإضافة هذه الخدمات
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'calculator' && (
          <div className="container mx-auto px-6 py-32 animate-in slide-in-from-bottom-10">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black text-white font-header mb-6">حاسبة الضيافة الملكية</h2>
              <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.6em]">Premium Quote Generator</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto items-start">
               <div className="lg:col-span-8 space-y-8 text-right order-2 lg:order-1">
                  <div className="bg-[#0c0c0c] p-8 md:p-12 rounded-[3rem] border border-white/5 card-shadow">
                    <h4 className="text-xl font-black text-white font-header mb-8 border-b border-white/5 pb-4">1. اختيار الباقة المفضلة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-right">
                       {allPackages.map(pkg => (
                         <button key={pkg.id} onClick={() => setSelectedPkgId(pkg.id)} className={`p-6 rounded-[2rem] border text-right transition-all group ${selectedPkgId === pkg.id ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}>
                            <div className={`text-lg font-black mb-1 transition-colors ${selectedPkgId === pkg.id ? 'text-[#c5a059]' : 'text-white'}`}>{pkg.title}</div>
                            <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{pkg.price.toLocaleString()} EGP {pkg.perPerson ? '/ Person' : ''}</div>
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="bg-[#0c0c0c] p-8 md:p-12 rounded-[3rem] border border-white/5 card-shadow">
                    <h4 className="text-xl font-black text-white font-header mb-8 border-b border-white/5 pb-4">2. عدد الضيوف (PAX)</h4>
                    <div className="flex flex-col gap-6">
                       <div className="flex justify-between items-center px-4 flex-row-reverse">
                          <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Guest Count</span>
                          <span className="text-3xl font-black text-[#c5a059] font-numbers">{calcPax}</span>
                       </div>
                       <input type="range" min="50" max="1000" step="10" value={calcPax} onChange={e => setCalcPax(parseInt(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c5a059]" />
                    </div>
                  </div>
                  <div className="bg-[#0c0c0c] p-8 md:p-12 rounded-[3rem] border border-white/5 card-shadow">
                    <h4 className="text-xl font-black text-white font-header mb-8 border-b border-white/5 pb-4">3. إضافات اختيارية: المشروبات والعصائر</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {SOFT_DRINKS.map(drk => (
                         <button key={drk.name} onClick={() => setSelectedDrinks(prev => prev.includes(drk.name) ? prev.filter(d => d !== drk.name) : [...prev, drk.name])} className={`p-6 rounded-[2rem] border text-right flex justify-between items-center transition-all flex-row-reverse ${selectedDrinks.includes(drk.name) ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-white/5 text-zinc-400 hover:text-zinc-200'}`}>
                            <span className={`font-bold transition-colors ${selectedDrinks.includes(drk.name) ? 'text-[#c5a059]' : ''}`}>{drk.name}</span>
                            <span className="text-xs font-numbers font-black">{drk.price} LE</span>
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="bg-[#0c0c0c] p-8 md:p-12 rounded-[3rem] border border-white/5 card-shadow">
                    <h4 className="text-xl font-black text-white font-header mb-8 border-b border-white/5 pb-4">4. إضافات اختيارية: التجهيزات والخدمات</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {SERVICE_COSTS.map(srv => {
                         const needsQty = srv.label.includes('ويترز') || srv.label === 'شيف' || srv.label === 'باريستا';
                         const isSelected = selectedExtraServices.includes(srv.label);
                         
                         return (
                           <div key={srv.label} className={`p-6 rounded-[2rem] border transition-all ${isSelected ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-white/5'}`}>
                             <div className="flex justify-between items-center flex-row-reverse mb-4">
                               <button 
                                 onClick={() => setSelectedExtraServices(prev => prev.includes(srv.label) ? prev.filter(s => s !== srv.label) : [...prev, srv.label])}
                                 className="flex-1 text-right"
                               >
                                 <span className={`font-bold transition-colors block ${isSelected ? 'text-[#c5a059]' : 'text-zinc-400'}`}>{srv.label}</span>
                                 <span className="text-[10px] font-numbers font-black text-zinc-500">{srv.price}</span>
                               </button>
                               <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-royal-gold border-royal-gold' : 'border-white/20'}`}>
                                 {isSelected && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                               </div>
                             </div>
                             
                             {isSelected && needsQty && (
                               <div className="flex items-center justify-between bg-black/40 rounded-xl p-3 flex-row-reverse animate-in fade-in zoom-in-95 duration-200">
                                 <div className="text-right">
                                   <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">العدد</span>
                                   <span className="text-[10px] text-[#c5a059] font-bold">{(parseInt(srv.price.replace(/[^0-9]/g, '') || '0') * (serviceQuantities[srv.label] || 1)).toLocaleString()} ج.م</span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                   <button 
                                     onClick={() => setServiceQuantities(prev => ({ ...prev, [srv.label]: Math.max(1, (prev[srv.label] || 1) - 1) }))}
                                     className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10"
                                   >
                                     -
                                   </button>
                                   <span className="text-white font-black font-numbers w-4 text-center">{serviceQuantities[srv.label] || 1}</span>
                                   <button 
                                     onClick={() => setServiceQuantities(prev => ({ ...prev, [srv.label]: (prev[srv.label] || 1) + 1 }))}
                                     className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10"
                                   >
                                     +
                                   </button>
                                 </div>
                               </div>
                             )}
                           </div>
                         );
                       })}
                    </div>
                  </div>

                  {selectedPkg?.id.startsWith('sm-') && (
                    <div className="bg-[#0c0c0c] p-8 md:p-12 rounded-[3rem] border border-white/5 card-shadow animate-in slide-in-from-bottom-5">
                      <h4 className="text-xl font-black text-white font-header mb-8 border-b border-white/5 pb-4">5. إضافات اختيارية: إضافات سخنة</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {HOT_ADDONS.map(addon => (
                           <button key={addon.label} onClick={() => setSelectedHotAddons(prev => prev.includes(addon.label) ? prev.filter(a => a !== addon.label) : [...prev, addon.label])} className={`p-6 rounded-[2rem] border text-right flex justify-between items-center transition-all flex-row-reverse ${selectedHotAddons.includes(addon.label) ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-white/5 text-zinc-400 hover:text-zinc-200'}`}>
                              <span className={`font-bold transition-colors ${selectedHotAddons.includes(addon.label) ? 'text-[#c5a059]' : ''}`}>{addon.label}</span>
                              <span className="text-xs font-numbers font-black">{addon.price} LE</span>
                           </button>
                         ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#0c0c0c] p-8 md:p-12 rounded-[3rem] border border-white/5 card-shadow animate-in slide-in-from-bottom-5">
                    <h4 className="text-xl font-black text-white font-header mb-8 border-b border-white/5 pb-4">5. إضافات اختيارية (بالفرد) - Min. 50 PAX</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {PER_PERSON_ADDONS.map(addon => (
                         <button key={addon.label} onClick={() => setSelectedPerPersonAddons(prev => prev.includes(addon.label) ? prev.filter(a => a !== addon.label) : [...prev, addon.label])} className={`p-6 rounded-[2rem] border text-right flex justify-between items-center transition-all flex-row-reverse ${selectedPerPersonAddons.includes(addon.label) ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-white/5 text-zinc-400 hover:text-zinc-200'}`}>
                            <span className={`font-bold transition-colors ${selectedPerPersonAddons.includes(addon.label) ? 'text-[#c5a059]' : ''}`}>{addon.label}</span>
                            <div className="text-right">
                              <span className="text-xs font-numbers font-black block">{addon.price} LE</span>
                              <span className="text-[9px] text-zinc-500 uppercase font-bold">Per Person</span>
                            </div>
                         </button>
                       ))}
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-4 lg:sticky lg:top-32 order-1 lg:order-2">
                  <div className="bg-royal-gold p-[1px] rounded-[3.5rem] card-shadow">
                    <div className="bg-black rounded-[3.45rem] p-10 text-right">
                       <h4 className="text-2xl font-black text-white font-header mb-10">ملخص الحجز</h4>
                       <div className="space-y-6 mb-16 text-right">
                          <div className="flex justify-between items-center pb-4 border-b border-white/5 flex-row-reverse">
                             <span className="text-white font-bold text-sm">{selectedPkg?.title || 'يرجى اختيار باقة'}</span>
                             <span className="text-zinc-400 text-[9px] uppercase font-black tracking-widest">Package</span>
                          </div>
                          <div className="flex justify-between items-center pb-4 border-b border-white/5 flex-row-reverse">
                             <span className="text-white font-bold font-numbers">{calcPax}</span>
                             <span className="text-zinc-400 text-[9px] uppercase font-black tracking-widest">PAX Count</span>
                          </div>
                       </div>
                       <div className="mb-10 text-right">
                          <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest block mb-1">Total Quotation</span>
                          <div className="flex items-baseline gap-2 flex-row-reverse">
                             <span className="text-5xl font-black text-white font-numbers tracking-tighter">{calculateTotal().toLocaleString()}</span>
                             <span className="text-zinc-400 font-bold text-xs uppercase">EGP</span>
                          </div>
                       </div>
                       <button onClick={() => handleOrder()} className="w-full bg-royal-gold text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl gold-shimmer text-xs hover:scale-[1.05] transition-transform">
                         <WhatsAppIcon className="w-5 h-5" />
                         ارسل الطلب للواتساب
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'contact' && (
          <div className="container mx-auto px-6 py-32 animate-in fade-in duration-1000 text-center">
            <div className="max-w-4xl mx-auto">
               <div className="flex justify-center mb-16">
                  <BrandLogo className="w-48 h-48 md:w-64 md:h-64" />
               </div>
               <h2 className="text-6xl font-black text-white font-header mb-8 uppercase tracking-tighter">تواصل مع <span className="text-royal-gold">ملوك السعادة</span></h2>
               <p className="text-zinc-300 mb-20 text-lg leading-relaxed max-w-2xl mx-auto">فريقنا جاهز لتصميم باقتك الخاصة والرد على كافة استفساراتكم لضمان ليلة عمر مثالية.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                  <a href="tel:01097356529" className="bg-[#0c0c0c] border border-white/5 p-16 rounded-[4rem] flex flex-col items-center card-shadow group hover:border-[#c5a059]/50 transition-all">
                     <span className="text-5xl mb-8 group-hover:scale-110 transition-transform">📞</span>
                     <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">اتصال مباشر</span>
                     <span className="text-3xl font-black text-white font-numbers tracking-tighter">01097356529</span>
                  </a>
                  <a href={WHATSAPP_BUSINESS_LINK} target="_blank" rel="noopener noreferrer" className="bg-[#0c0c0c] border border-white/5 p-16 rounded-[4rem] flex flex-col items-center card-shadow group hover:border-green-500/50 transition-all">
                     <WhatsAppIcon className="w-16 h-16 mb-8 text-[#25D366] group-hover:scale-110 transition-transform" />
                     <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">واتساب بيزنس</span>
                     <span className="text-3xl font-black text-[#c5a059] font-header">ارسل رسالة</span>
                  </a>
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
                   <div key={cat.id} onClick={() => setActiveEquipmentCat(cat)} className="group bg-[#0c0c0c] border border-white/5 p-10 rounded-[2.5rem] text-center cursor-pointer card-shadow relative overflow-hidden transition-all hover:border-[#c5a059]/30">
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
                        <button onClick={() => setActiveEquipmentCat(null)} className="group flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-[#c5a059] transition-colors">
                           <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#c5a059]/30 transition-all">←</span> العودة
                        </button>
                        {selectedEquipment.length > 0 && (
                          <button 
                            onClick={() => {
                              const allItems = activeEquipmentCat?.items || activeEquipmentCat?.sections?.flatMap(s => s.items) || [];
                              const itemsToOrder = allItems.filter(i => selectedEquipment.includes(i.id));
                              shareEquipment(itemsToOrder);
                            }}
                            className="bg-royal-gold text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest gold-shimmer shadow-xl hover:scale-105 transition-transform"
                          >
                            إرسال الطلب ({selectedEquipment.length})
                          </button>
                        )}
                      </div>
                   </div>
                   
                   {activeEquipmentCat.items && (
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
                            onShare={(i) => shareEquipment([i])}
                            onZoom={(img) => setLightboxImage(img)}
                          />
                        ))}
                      </div>
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
                              onShare={(i) => shareEquipment([i])}
                              onZoom={(img) => setLightboxImage(img)}
                            />
                          ))}
                        </div>
                      </div>
                   ))}

                   {activeEquipmentCat.extraInfo && (
                      <div className="mt-20 p-10 md:p-16 bg-[#0c0c0c] border border-[#c5a059]/20 rounded-[3rem] card-shadow text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>
                        <div className="space-y-8">
                          {activeEquipmentCat.extraInfo.map((info, idx) => (
                            <p key={idx} className="text-xl md:text-2xl text-white font-black font-header leading-relaxed">
                              {info}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
             )}
           </div>
        )}

        {lightboxImage && (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setLightboxImage(null)}>
            <button className="absolute top-10 right-10 text-white hover:text-[#c5a059] transition-colors">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <img 
              src={lightboxImage} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" 
              alt="Zoomed View" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </main>

      <FloatingAssistant 
        selectedEquipment={selectedEquipment}
        equipmentQuantities={equipmentQuantities}
        onQuantityChange={updateEquipmentQty}
        onShare={shareEquipment}
        allEquipmentItems={allEquipmentItems}
      />

      <footer className="py-32 bg-[#020202] border-t border-white/5 text-center relative overflow-hidden">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-white/5 blur-[150px] rounded-full"></div>
         <div className="flex justify-center mb-10">
            <BrandLogo className="w-24 h-24 md:w-32 md:h-32" showGlow={true} />
         </div>
         <h2 className="text-royal-gold font-black text-4xl font-header mb-6 tracking-tighter">ملوك السعادة</h2>
         <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.8em] mb-12">The Royal Taste of Happiness</p>
         <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest">© 2025 Molok El Saada. Designed for Royalty.</p>
      </footer>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 nav-glass px-8 py-4 rounded-full flex gap-10 md:gap-16 z-[100] shadow-2xl max-w-[95vw] overflow-x-auto scrollbar-hide flex-row-reverse items-center">
         {[
           { v: 'home', l: 'الرئيسية' },
           { v: 'portal', l: 'المنيو' },
           { v: 'calculator', l: 'احسب' },
           { v: 'tools', l: 'المعدات' },
           { v: 'contact', l: 'تواصل معنا' }
         ].map(nav => (
           <button key={nav.v} onClick={() => { setView(nav.v as any); if(nav.v === 'tools') setActiveEquipmentCat(null); }} className={`text-[10px] font-black uppercase tracking-widest transition-all relative group whitespace-nowrap ${view === nav.v || (nav.v === 'portal' && view === 'category') ? 'text-[#c5a059]' : 'text-zinc-500 hover:text-white'}`}>
              {nav.l}
              {(view === nav.v || (nav.v === 'portal' && view === 'category')) && <span className="absolute -bottom-2 left-0 w-full h-1 bg-royal-gold rounded-full shadow-lg"></span>}
           </button>
         ))}
      </div>
    </div>
  );
};

export default App;
