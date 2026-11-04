import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { EquipmentItem } from '../types';
import { cloudinarySrcSet, handleSafeImageError, LOCAL_IMAGE_FALLBACK, optimizeCloudinaryImage } from '../utils/images';
import { ChafingDishIcon, CheckIcon, WhatsAppIcon } from './Icons';

export const EquipmentCard: React.FC<{
  item: EquipmentItem;
  selected: boolean;
  quantity: number;
  onToggle: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
  onQuantitySet: (id: string, value: number) => void;
  onShare: (items: EquipmentItem | EquipmentItem[]) => void;
  onZoom: (image: string) => void;
  selectedItems: string[];
  quantities: Record<string, number>;
  displayOnly?: boolean;
}> = ({ item, selected, quantity, onToggle, onQuantityChange, onQuantitySet, onShare, onZoom, selectedItems, quantities, displayOnly }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const images = (item.images ?? (item.image ? [item.image] : []))
    .filter((image): image is string => typeof image === 'string' && image.length > 0);
  const currentImage = images[currentImgIdx] ?? null;

  const handleShareSelected = () => {
    const selectedOptions = (item.options ?? [])
      .filter((option) => selectedItems.includes(option.id))
      .map((option) => ({ id: option.id, name: option.name, price: option.price, image: item.image, note: item.note }));
    onShare(selectedOptions.length > 0 ? selectedOptions : [item]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`min-w-0 h-full flex flex-col bg-[#0c0c0c] border rounded-2xl sm:rounded-3xl overflow-hidden card-shadow relative group transition-all duration-500 card-3d gsap-card-reveal gsap-card-interactive ${selected ? 'border-royal-gold/45 ring-1 ring-royal-gold/25' : 'border-white/10'}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#121212]">
        <button type="button" disabled={!currentImage} aria-label={`تكبير صورة ${item.name || 'المعدة'}`} onClick={() => { if (currentImage) onZoom(currentImage); }} className="absolute inset-0 w-full h-full cursor-zoom-in disabled:cursor-default">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage ?? item.id}
            src={currentImage ? optimizeCloudinaryImage(currentImage, 720) : LOCAL_IMAGE_FALLBACK}
            srcSet={currentImage ? cloudinarySrcSet(currentImage) : undefined}
            sizes="(min-width: 1280px) 400px, 33vw"
            alt={item.name || 'معدات ملوك السعادة'}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
            onError={handleSafeImageError}
          />
        </AnimatePresence>
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>

        {images.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIdx ? 'bg-royal-gold w-6' : 'bg-white/25 w-2'}`}
              />
            ))}
          </div>
        )}

        {!displayOnly && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleShareSelected(); }}
            aria-label={`طلب ${item.name ?? 'المعدة'} عبر WhatsApp`}
            className="absolute top-1 right-1 sm:top-3.5 sm:right-3.5 w-11 h-11 min-w-[44px] min-h-[44px] bg-black/65 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-green-500 hover:border-green-500 transition-all duration-300 group/share"
            title="اطلب عبر واتساب"
          >
            <WhatsAppIcon className="w-5 h-5 group-hover/share:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {(item.name || item.price || item.note || item.options || !displayOnly) && (
        <div className="p-2 sm:p-5 lg:p-6 min-w-0 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
          {(item.name || item.price || item.note) && (
            <div className="text-right">
              {item.name && <h4 className="text-white font-bold text-xs sm:text-base lg:text-lg break-words mb-2 font-header whitespace-pre-line leading-snug group-hover:text-royal-gold transition-colors">{item.name}</h4>}
              {item.price && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-royal-gold font-extrabold text-sm sm:text-xl lg:text-2xl font-numbers">{item.price}</span>
                  <span className="text-zinc-400 text-xs font-bold">ج.م</span>
                </div>
              )}
              {item.note && <p className="text-[#c5a059]/85 text-xs font-medium mt-2 leading-relaxed">{item.note}</p>}
            </div>
          )}

          {item.options ? (
            <div className="space-y-3 mt-1">
              {item.options.map(opt => {
                const isOptSelected = selectedItems.includes(opt.id);
                const optQty = quantities[opt.id] || 1;
                return (
                  <div key={opt.id} className={`p-1 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 ${isOptSelected ? 'border-royal-gold/40 bg-royal-gold/10' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'}`}>
                    <div className="flex flex-wrap justify-between items-center gap-1 sm:gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-bold transition-colors ${isOptSelected ? 'text-royal-gold' : 'text-white'}`}>{opt.name}</div>
                        <div className="text-zinc-400 text-xs font-bold font-numbers mt-0.5">{opt.price} ج.م</div>
                      </div>
                      {!displayOnly && (
                        <button
                          type="button"
                          onClick={() => onToggle(opt.id)}
                          aria-label={`اختيار ${opt.name}`}
                          aria-pressed={isOptSelected}
                          className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${isOptSelected ? 'bg-royal-gold border-royal-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'border-white/25 hover:border-white/50'}`}
                        >
                          {isOptSelected ? <CheckIcon className="w-5 h-5 text-black" /> : <span className="text-zinc-300 font-bold text-base">+</span>}
                        </button>
                      )}
                    </div>

                    {isOptSelected && !displayOnly && (
                      <div className="flex flex-wrap gap-2 items-center justify-between bg-black/60 rounded-xl p-1 sm:p-2.5 mt-3 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="text-xs font-bold text-zinc-300">الكمية</span>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <button
                            type="button"
                            aria-label={`تقليل كمية ${opt.name}`}
                            onClick={() => onQuantityChange(opt.id, -1)}
                            className="w-11 h-11 shrink-0 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all font-bold text-base"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={optQty}
                            aria-label={`كمية ${opt.name}`}
                            onChange={(e) => onQuantitySet(opt.id, parseInt(e.target.value) || 1)}
                            className="w-14 h-11 bg-white/5 border border-white/15 rounded-lg text-white text-center font-bold font-numbers text-sm focus:border-royal-gold/60 outline-none transition-colors"
                          />
                          <button
                            type="button"
                            aria-label={`زيادة كمية ${opt.name}`}
                            onClick={() => onQuantityChange(opt.id, 1)}
                            className="w-11 h-11 shrink-0 rounded-lg bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold text-base"
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
          ) : !displayOnly ? (
            <div className="space-y-3.5 mt-auto pt-2">
              <div className="flex flex-wrap gap-2 items-center justify-between bg-white/5 rounded-2xl p-1 sm:p-3 border border-white/10 group-hover:border-white/15 transition-colors">
                <span className="text-xs font-bold text-zinc-300">الكمية المطلوبة</span>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    aria-label={`تقليل كمية ${item.name || 'المعدة'}`}
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, -1); }}
                    className="w-11 h-11 shrink-0 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all font-bold text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    aria-label={`كمية ${item.name || 'المعدة'}`}
                    onChange={(e) => onQuantitySet(item.id, parseInt(e.target.value) || 1)}
                    className="w-14 h-11 bg-white/5 border border-white/15 rounded-xl text-white text-center font-bold font-numbers text-base focus:border-royal-gold/60 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={`زيادة كمية ${item.name || 'المعدة'}`}
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, 1); }}
                    className="w-11 h-11 shrink-0 rounded-xl bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggle(item.id)}
                className={`w-full min-h-[44px] !px-1 py-3.5 rounded-2xl !text-xs sm:!text-sm font-bold transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 ${
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
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            className="absolute top-1 left-1 sm:top-3.5 sm:left-3.5 bg-royal-gold text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-2xl gold-shimmer flex items-center justify-center z-10 border-2 border-black/20"
          >
            <CheckIcon className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

