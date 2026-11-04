import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBasket, X } from 'lucide-react';
import { SERVICE_COSTS, SOFT_DRINKS } from '../data';
import type { EquipmentItem, MenuPackage } from '../types';
import { handleSafeImageError, optimizeCloudinaryImage } from '../utils/images';
import { BrandLogo } from './BrandMedia';
import { GuestCountInput } from './GuestCountInput';
import { WhatsAppIcon } from './Icons';

export const FloatingCart: React.FC<{
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
  drinkQuantities: Record<string, number>;
  onDrinkQuantityChange: (item: string, delta: number) => void;
  onRemoveDrink: (item: string) => void;
  selectedExtraServices: string[];
  serviceQuantities: Record<string, number>;
  onServiceQuantityChange: (item: string, delta: number) => void;
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
  const selectedEquipItems = useMemo(() => {
    return allEquipmentItems.filter(item => selectedEquipment.includes(item.id));
  }, [selectedEquipment, allEquipmentItems]);

  const hasItems = selectedEquipment.length > 0 || selectedBeverages.length > 0 || selectedPkg !== undefined || selectedDrinks.length > 0 || selectedExtraServices.length > 0;
  const totalItemsCount = selectedEquipment.length + selectedBeverages.length + (selectedPkg ? 1 : 0) + selectedDrinks.length + selectedExtraServices.length;

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] left-4 right-4 sm:right-auto sm:left-8 z-[100] flex justify-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="bg-[#0c0c0c]/95 backdrop-blur-2xl border border-[#c5a059]/30 w-full sm:w-[370px] md:w-[410px] max-h-[78dvh] sm:max-h-[650px] h-[76dvh] sm:h-[640px] rounded-3xl md:rounded-[2.25rem] shadow-[0_30px_100px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden origin-bottom-left text-right pointer-events-auto"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-white/[0.02] border-b border-[#c5a059]/15 flex flex-col gap-4">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <BrandLogo className="w-10 h-10 shrink-0" showGlow={false} />
                  <div className="text-right">
                    <h4 className="text-white text-base font-bold font-header gold-text-shimmer">
                      سلة الطلبات
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-zinc-400 font-semibold">
                        {totalItemsCount} {totalItemsCount === 1 ? 'صنف مختار' : 'أصناف مختارة'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasItems && (
                    <button
                      type="button"
                      onClick={onClearAll}
                      className="text-xs text-red-400 font-bold hover:text-red-300 transition-colors px-2 min-h-[44px]"
                    >
                      مسح الكل
                    </button>
                  )}
                  <button type="button" aria-label="إغلاق سلة الطلبات" onClick={() => setIsOpen(false)} className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="w-5 h-5 text-zinc-300" />
                  </button>
                </div>
              </div>

              {hasItems && (
                <p className="text-xs text-zinc-300 leading-relaxed">الأصناف بتتحفظ على جهازك. لو دي اختيارات قديمة، استخدم «مسح الكل».</p>
              )}

              {/* PAX Selection in Cart */}
              <div className="bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-2.5 gap-3">
                  <label htmlFor="cart-pax" className="text-xs sm:text-sm font-bold text-royal-gold">عدد الأفراد (PAX)</label>
                  <div className="flex items-center gap-2">
                    <GuestCountInput
                      label="عدد الأفراد في السلة"
                      value={calcPax}
                      onChange={onPaxChange}
                      className="w-20 min-h-11 bg-white/5 border border-royal-gold/30 rounded-lg px-2 text-center text-white font-bold font-numbers text-base sm:text-lg focus:border-royal-gold outline-none"
                    />
                    <span className="text-zinc-300 text-xs font-bold">فرد</span>
                  </div>
                </div>
                <input
                  id="cart-pax"
                  type="range"
                  min="25"
                  max="1000"
                  step="1"
                  value={calcPax}
                  onChange={(e) => onPaxChange(parseInt(e.target.value))}
                  className="w-full accent-royal-gold h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 flex flex-col p-5 sm:p-6 overflow-hidden">
                {hasItems ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-5 pl-1 custom-scrollbar">
                      {/* Menu Package */}
                      {selectedPkg && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-2.5"
                        >
                          <h6 className="text-xs font-bold text-zinc-400 border-b border-white/10 pb-2">الضيافة المختارة</h6>
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 hover:border-royal-gold/25 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 text-right">
                                <h5 className="text-white text-sm font-bold mb-1 font-header">{selectedPkg.title}</h5>
                                <div className="flex flex-col gap-1">
                                  <p className="text-royal-gold text-xs font-bold">
                                    {selectedPkg.perPerson ? (
                                      <>
                                        {selectedPkg.price} ج.م للفرد × {calcPax} فرد
                                      </>
                                    ) : (
                                      <>سعر الباقة: {selectedPkg.price} ج.م</>
                                    )}
                                  </p>
                                  <p className="text-white text-xs sm:text-sm font-bold">
                                    الإجمالي: {(selectedPkg.perPerson ? selectedPkg.price * calcPax : selectedPkg.price).toLocaleString()} ج.م
                                  </p>
                                </div>
                              </div>
                              <button type="button" aria-label={`إزالة باقة ${selectedPkg.title} من السلة`} onClick={onRemovePkg} className="text-zinc-400 hover:text-red-300 transition-colors p-1 flex items-center justify-center">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Other Selected Items (Beverages) */}
                      {selectedBeverages.length > 0 && (
                        <div className="space-y-2.5">
                          <h6 className="text-xs font-bold text-zinc-400 border-b border-white/10 pb-2">الأصناف المختارة</h6>
                          <AnimatePresence mode="popLayout">
                            {selectedBeverages.map((item, idx) => {
                              const match = item.match(/—\s*(\d+)\s*ج/);
                              const price = match ? parseInt(match[1]) : 0;
                              const qty = beverageQuantities[item] || 1;
                              return (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  key={`b-${idx}`}
                                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 group hover:border-royal-gold/30 transition-all"
                                >
                                  <div className="flex-1 text-right">
                                    <h5 className="text-white text-xs sm:text-sm font-bold leading-snug mb-1">{item}</h5>
                                    {price > 0 && <p className="text-royal-gold text-xs font-bold mb-2">{(price * qty).toLocaleString()} ج.م</p>}
                                    <div className="flex items-center gap-2.5">
                                      <button
                                        type="button"
                                        aria-label={`تقليل كمية ${item}`}
                                        onClick={() => onBeverageQuantityChange(item, -1)}
                                        className="w-11 h-11 shrink-0 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-sm font-bold"
                                      >
                                        -
                                      </button>
                                      <span className="text-white font-bold font-numbers text-sm min-w-[1.25rem] text-center">{qty}</span>
                                      <button
                                        type="button"
                                        aria-label={`زيادة كمية ${item}`}
                                        onClick={() => onBeverageQuantityChange(item, 1)}
                                        className="w-11 h-11 shrink-0 rounded-lg bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-sm font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <button type="button" aria-label={`إزالة ${item} من السلة`} onClick={() => onRemoveBeverage(item)} className="text-zinc-400 hover:text-red-300 transition-colors p-1.5 flex items-center justify-center">
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
                        <div className="space-y-2.5">
                          <h6 className="text-xs font-bold text-zinc-400 border-b border-white/10 pb-2">الإضافات والخدمات</h6>
                          <AnimatePresence mode="popLayout">
                            {selectedDrinks.map((item, idx) => {
                              const drkData = SOFT_DRINKS.find(d => d.name === item);
                              const price = drkData?.price || 0;
                              const qty = drinkQuantities[item] || 1;
                              return (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  key={`drk-${idx}`}
                                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                                >
                                  <div className="flex-1 text-right">
                                    <h5 className="text-white text-xs sm:text-sm font-bold leading-snug mb-1">{item}</h5>
                                    {price > 0 && (
                                      <div className="mb-2">
                                        <p className="text-zinc-400 text-xs font-medium">{price} ج.م × {qty}</p>
                                        <p className="text-royal-gold text-xs font-bold">{(price * qty).toLocaleString()} ج.م</p>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2.5">
                                      <button
                                        type="button"
                                        aria-label={`تقليل كمية ${item}`}
                                        onClick={() => onDrinkQuantityChange(item, -1)}
                                        className="w-11 h-11 shrink-0 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-sm font-bold"
                                      >
                                        -
                                      </button>
                                      <span className="text-white font-bold font-numbers text-sm min-w-[1.25rem] text-center">{qty}</span>
                                      <button
                                        type="button"
                                        aria-label={`زيادة كمية ${item}`}
                                        onClick={() => onDrinkQuantityChange(item, 1)}
                                        className="w-11 h-11 shrink-0 rounded-lg bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-sm font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <button type="button" aria-label={`إزالة ${item} من السلة`} onClick={() => onRemoveDrink(item)} className="text-zinc-400 hover:text-red-300 transition-colors p-1.5 flex items-center justify-center">
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
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  key={`srv-${idx}`}
                                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                                >
                                  <div className="flex-1 text-right">
                                    <h5 className="text-white text-xs sm:text-sm font-bold leading-snug mb-1">{item}</h5>
                                    {costNum > 0 && (
                                      <div className="mb-2">
                                        <p className="text-zinc-400 text-xs font-medium">{costNum} ج.م × {displayQty}</p>
                                        <p className="text-royal-gold text-xs font-bold">{(costNum * displayQty).toLocaleString()} ج.م</p>
                                      </div>
                                    )}
                                    {!isPerPerson && (
                                      <div className="flex items-center gap-2.5">
                                        <button
                                          type="button"
                                          aria-label={`تقليل كمية ${item}`}
                                          onClick={() => onServiceQuantityChange(item, -1)}
                                          className="w-11 h-11 shrink-0 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-sm font-bold"
                                        >
                                          -
                                        </button>
                                        <span className="text-white font-bold font-numbers text-sm min-w-[1.25rem] text-center">{qty}</span>
                                        <button
                                          type="button"
                                          aria-label={`زيادة كمية ${item}`}
                                          onClick={() => onServiceQuantityChange(item, 1)}
                                          className="w-11 h-11 shrink-0 rounded-lg bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-sm font-bold"
                                        >
                                          +
                                        </button>
                                      </div>
                                    )}
                                    {isPerPerson && <p className="text-zinc-400 text-xs font-medium">حسب عدد الأفراد</p>}
                                  </div>
                                  <button type="button" aria-label={`إزالة ${item} من السلة`} onClick={() => onRemoveService(item)} className="text-zinc-400 hover:text-red-300 transition-colors p-1.5 flex items-center justify-center">
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
                        <div className="space-y-2.5">
                          <h6 className="text-xs font-bold text-zinc-400 border-b border-white/10 pb-2">المعدات</h6>
                          <AnimatePresence mode="popLayout">
                            {selectedEquipItems.map(item => (
                              <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={item.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 group hover:border-royal-gold/30 transition-all"
                              >
                                {item.image && (
                                  <img
                                    src={optimizeCloudinaryImage(item.image, 160)}
                                    alt={item.name || 'صنف مختار'}
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-12 h-12 shrink-0 rounded-xl object-cover bg-[#141414] border border-white/10 cursor-zoom-in hover:scale-105 transition-transform"
                                    onClick={() => { if (item.image) onZoom(item.image); }}
                                    onError={handleSafeImageError}
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="flex-1 text-right min-w-0">
                                  <h5 className="text-white text-xs sm:text-sm font-bold leading-snug mb-1">{item.name}</h5>
                                  {item.price && (
                                    <div className="mb-2">
                                      <p className="text-zinc-400 text-xs font-medium">{item.price} ج.م × {equipmentQuantities[item.id] || 1}</p>
                                      <p className="text-royal-gold text-xs font-bold">{(item.price * (equipmentQuantities[item.id] || 1)).toLocaleString()} ج.م</p>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2.5">
                                    <button
                                      type="button"
                                      aria-label={`تقليل كمية ${item.name}`}
                                      onClick={() => onQuantityChange(item.id, -1)}
                                      className="w-11 h-11 shrink-0 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-sm font-bold"
                                    >
                                      -
                                    </button>
                                    <span className="text-white font-bold font-numbers text-sm min-w-[1.25rem] text-center">{equipmentQuantities[item.id] || 1}</span>
                                    <button
                                      type="button"
                                      aria-label={`زيادة كمية ${item.name}`}
                                      onClick={() => onQuantityChange(item.id, 1)}
                                      className="w-11 h-11 shrink-0 rounded-lg bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors text-sm font-bold"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <button type="button" aria-label={`إزالة ${item.name} من السلة`} onClick={() => onRemoveEquipment(item.id)} className="text-zinc-400 hover:text-red-300 transition-colors p-1.5 flex items-center justify-center shrink-0">
                                  <X className="w-4 h-4" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-zinc-300 text-sm font-bold">إجمالي الطلب</span>
                        <div className="flex items-baseline gap-1.5">
                          <motion.span
                            key={totalPrice}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white text-2xl font-extrabold font-numbers inline-block"
                          >
                            {totalPrice.toLocaleString()}
                          </motion.span>
                          <span className="text-royal-gold text-xs font-bold">ج.م</span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {(selectedPkg || selectedBeverages.length > 0 || selectedDrinks.length > 0 || selectedExtraServices.length > 0) && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onMenuOrder}
                            className="royal-btn-primary w-full py-3.5 text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-xl"
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
                            className="royal-btn-secondary w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5"
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
                      <ShoppingBasket className="w-10 h-10 opacity-25" />
                    </motion.div>
                    <p className="text-zinc-400 text-sm font-bold">السلة فارغة حالياً</p>
                    <button onClick={() => { setIsOpen(false); navigateTo('portal'); }} className="text-[#c5a059] text-sm font-bold underline underline-offset-4">تصفح الضيافة</button>
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
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(true)}
          aria-label="فتح سلة الطلبات"
          aria-expanded={isOpen}
          className="w-13 h-13 md:w-15 md:h-15 rounded-full shadow-[0_12px_36px_rgba(197,160,89,0.4)] flex items-center justify-center gold-shimmer group relative bg-royal-gold pointer-events-auto"
        >
          <ShoppingBasket className="w-6 h-6 md:w-7 md:h-7 text-black" />
          {hasItems && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-black text-royal-gold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-extrabold font-numbers border border-royal-gold"
            >
              {totalItemsCount}
            </motion.span>
          )}
        </motion.button>
      )}
    </div>
  );
};

