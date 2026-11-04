import React, { useState, useRef, useEffect, useMemo, useReducer } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { ChevronRight, ArrowRight, ArrowLeft, ShoppingBasket, Sparkles, Award, Crown, Compass, Gem } from 'lucide-react';
import { BEVERAGES_MENU, SOFT_DRINKS, SERVICE_COSTS, SERVICE_SECTIONS, EQUIPMENT_DATA, BEVERAGES_CATEGORIES } from './data';
import type { MenuPackage, EquipmentCategory, EquipmentItem } from './types';
import { useGsapScrollTrigger } from './useGsap';
import { BookingSection } from './BookingSection';
import {
  buildEquipmentOrderSummary,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateOrderTotal,
  clampGuestCount,
  initialOrderContext,
  normalizeQuantity,
  openWhatsAppMessage,
  orderContextReducer,
  resolveEquipmentSelections,
  validateCustomerInfo
} from './utils/order-utils.js';
import { normalizeNavigationHistoryState } from './utils/navigation-history.js';
import { BrandLogo, LazyFooterVideo } from './components/BrandMedia';
import { FloatingCart } from './components/FloatingCart';
import { EquipmentCard } from './components/EquipmentCard';
import { ChafingDishIcon, CheckIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from './components/Icons';
import { cloudinarySrcSet, handleSafeImageError, LOCAL_LAMP_ASSET, optimizeCloudinaryImage } from './utils/images';
import { CART_STORAGE_KEY, readCart } from './utils/cart-storage';

// --- CONFIGURATION ---
const WHATSAPP_PHONE = "201097356529";
const WHATSAPP_BUSINESS_LINK = "https://wa.me/201097356529";

type AppView = 'home' | 'portal' | 'category' | 'tools' | 'contact';

const OfficeMap = React.lazy(async () => {
  const { OfficeMap: LazyOfficeMap } = await import('./OfficeMap');
  return { default: LazyOfficeMap };
});
const CustomerInfoModal = React.lazy(async () => {
  const { CustomerInfoModal: LazyCustomerInfoModal } = await import('./CustomerInfoModal');
  return { default: LazyCustomerInfoModal };
});

const EMPTY_CUSTOMER_INFO = {
  name: '',
  phone: '',
  eventDate: '',
  eventLocation: '',
  message: '',
  agreedToDeposit: false
};

const NAV_ITEMS: Array<{ v: AppView; l: string }> = [
  { v: 'home', l: 'الرئيسية' },
  { v: 'portal', l: 'الضيافة' },
  { v: 'tools', l: 'المعدات' },
  { v: 'contact', l: 'تواصل معنا' }
];

const SERVICE_CATEGORY_PACKAGE: MenuPackage = {
  id: 'srv-cat',
  title: 'خدمات الضيافة الملكية',
  price: -1,
  sections: SERVICE_SECTIONS
};

const PORTAL_CATEGORIES: Array<{
  id: string;
  displayName: string;
  icon: string;
  data: MenuPackage[];
  desc: string;
}> = [
  { id: 'Beverages', displayName: 'مشروبات', icon: '☕', data: BEVERAGES_MENU, desc: 'ركن المشروبات الملكي' },
  { id: 'Services', displayName: 'خدمات', icon: '🤵', data: [SERVICE_CATEGORY_PACKAGE], desc: 'الويترز والشيف والباريستا' }
];

// --- Shared Components ---

const NavItem: React.FC<{ id: string; label: string; active: boolean; onClick: () => void }> = ({ id, label, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 text-xs sm:text-sm font-bold transition-all relative ${active ? 'text-[#c5a059]' : 'text-zinc-400 hover:text-white'}`}>
    {label}
    {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-royal-gold rounded-full"></span>}
  </button>
);

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const activeCategoryMeta = useMemo(
    () => PORTAL_CATEGORIES.find((category) => category.id === categoryId) ?? null,
    [categoryId]
  );
  const activeCategory = activeCategoryMeta?.data ?? [];
  const categoryName = activeCategoryMeta?.id ?? '';
  const categoryDisplayName = activeCategoryMeta?.displayName ?? 'الضيافة';
  const [activeEquipmentCat, setActiveEquipmentCat] = useState<EquipmentCategory | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const pageTitle = view === 'home'
    ? 'ملوك السعادة'
    : view === 'portal'
      ? 'الضيافة'
      : view === 'category'
        ? categoryDisplayName
        : view === 'tools'
          ? activeEquipmentCat?.name ?? 'المعدات'
          : 'تواصل معنا';

  // GSAP ScrollTrigger & Card Hover animations initializer
  useGsapScrollTrigger([view, categoryId, activeEquipmentCat?.id]);

  useEffect(() => {
    document.title = view === 'home'
      ? 'ملوك السعادة لخدمات الضيافة'
      : `${pageTitle} | ملوك السعادة`;
  }, [pageTitle, view]);


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

  // History API Sync: restore stable catalogue keys, never copied display labels.
  useEffect(() => {
    const applyHistoryState = (rawState: unknown) => {
      const state = normalizeNavigationHistoryState(
        rawState,
        PORTAL_CATEGORIES.map((category) => category.id),
        EQUIPMENT_DATA.map((category) => category.id)
      );
      const nextEquipmentCategory = state.activeEquipmentCatId
        ? EQUIPMENT_DATA.find((category) => category.id === state.activeEquipmentCatId) ?? null
        : null;

      setView(state.view);
      setCategoryId(state.categoryId);
      setActiveEquipmentCat(state.view === 'tools' ? nextEquipmentCategory : null);
    };

    const initialState = window.history.state;
    if (!initialState || typeof initialState.view !== 'string') {
      window.history.replaceState(
        { view: 'home', categoryId: null, activeEquipmentCatId: null },
        '',
        `${window.location.pathname}${window.location.search}${window.location.hash}`
      );
    }
    applyHistoryState(window.history.state);

    const handlePopState = (event: PopStateEvent) => applyHistoryState(event.state);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (
    newView: AppView,
    extra: { categoryId?: string | null; activeEquipmentCatId?: string | null } = {}
  ) => {
    const nextCategoryId = newView === 'category' && PORTAL_CATEGORIES.some((category) => category.id === extra.categoryId)
      ? extra.categoryId ?? null
      : null;
    const nextEquipmentCatId = newView === 'tools' ? extra.activeEquipmentCatId ?? null : null;
    const state = { view: newView, categoryId: nextCategoryId, activeEquipmentCatId: nextEquipmentCatId };
    window.history.pushState(
      state,
      '',
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    );
    setView(newView);
    setCategoryId(nextCategoryId);
    setActiveEquipmentCat(
      nextEquipmentCatId ? EQUIPMENT_DATA.find((category) => category.id === nextEquipmentCatId) ?? null : null
    );
  };

  const [savedCart] = useState(readCart);
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [calcPax, setCalcPax] = useState(savedCart?.calcPax ?? 25);
  const [selectedPkgId, setSelectedPkgId] = useState<string>(savedCart?.selectedPkgId ?? '');
  const [selectedExtraServices, setSelectedExtraServices] = useState<string[]>(savedCart?.selectedExtraServices ?? []);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>(savedCart?.selectedDrinks ?? []);
  const [drinkQuantities, setDrinkQuantities] = useState<Record<string, number>>(savedCart?.drinkQuantities ?? {});
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>(savedCart?.selectedBeverages ?? []);
  const [beverageQuantities, setBeverageQuantities] = useState<Record<string, number>>(savedCart?.beverageQuantities ?? {});
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(savedCart?.selectedEquipment ?? []);
  const [equipmentQuantities, setEquipmentQuantities] = useState<Record<string, number>>(savedCart?.equipmentQuantities ?? {});
  const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>(savedCart?.serviceQuantities ?? {});
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, calcPax, selectedPkgId, selectedExtraServices, selectedDrinks, drinkQuantities, selectedBeverages, beverageQuantities, selectedEquipment, equipmentQuantities, serviceQuantities }));
    } catch { /* Storage may be disabled or full; the cart still works for this visit. */ }
  }, [calcPax, selectedPkgId, selectedExtraServices, selectedDrinks, drinkQuantities, selectedBeverages, beverageQuantities, selectedEquipment, equipmentQuantities, serviceQuantities]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerFormMode, setCustomerFormMode] = useState<'appointment' | 'confirmation'>('confirmation');
  const [orderContext, dispatchOrderContext] = useReducer(orderContextReducer, initialOrderContext);
  const pendingPkg = orderContext.kind === 'package-inquiry' ? orderContext.pendingPackage : null;
  const pendingEquipment = orderContext.kind === 'equipment-inquiry' ? orderContext.pendingEquipment : null;
  const isEquipmentOnlyOrder = orderContext.kind === 'equipment-inquiry';
  const [customerInfo, setCustomerInfo] = useState({ ...EMPTY_CUSTOMER_INFO });
  const [orderNotice, setOrderNotice] = useState('');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view, categoryId, activeEquipmentCat?.id]);

  useEffect(() => {
    setSelectedBeverages([]);
    setBeverageQuantities({});
  }, [selectedPkgId]);

  useEffect(() => {
    if (!orderNotice) return;
    const timeout = window.setTimeout(() => setOrderNotice(''), 6000);
    return () => window.clearTimeout(timeout);
  }, [orderNotice]);

  const openCategory = (id: string) => {
    navigateTo('category', { categoryId: id });
  };

  const allPackages = useMemo(() => [...BEVERAGES_MENU], []);
  const selectedPkg = useMemo(() => allPackages.find(p => p.id === selectedPkgId), [selectedPkgId, allPackages]);

  const handleBeverageQty = (item: string, delta: number) => {
    setBeverageQuantities(prev => ({ ...prev, [item]: normalizeQuantity((prev[item] || 1) + delta) }));
  };

  const handleDrinkQty = (item: string, delta: number) => {
    setDrinkQuantities(prev => ({ ...prev, [item]: normalizeQuantity((prev[item] || 1) + delta) }));
  };

  const handleServiceQty = (item: string, delta: number) => {
    setServiceQuantities(prev => ({ ...prev, [item]: normalizeQuantity((prev[item] || 1) + delta) }));
  };

  const removeBeverage = (item: string) => setSelectedBeverages(prev => prev.filter(b => b !== item));
  const removeEquipment = (id: string) => setSelectedEquipment(prev => prev.filter(e => e !== id));
  const removeDrink = (item: string) => setSelectedDrinks(prev => prev.filter(d => d !== item));
  const removeService = (item: string) => setSelectedExtraServices(prev => prev.filter(s => s !== item));
  const removePkg = () => setSelectedPkgId('');

  const clearAll = () => {
    setCalcPax(25);
    setSelectedPkgId('');
    setSelectedExtraServices([]);
    setSelectedDrinks([]);
    setDrinkQuantities({});
    setSelectedBeverages([]);
    setBeverageQuantities({});
    setSelectedEquipment([]);
    setEquipmentQuantities({});
    setServiceQuantities({});
  };

  const calculateTotal = () => {
    const lines: Array<{ unitPrice: number | string; quantity: number | string }> = [];

    if (selectedPkg) {
      lines.push({ unitPrice: selectedPkg.price, quantity: selectedPkg.perPerson ? clampGuestCount(calcPax) : 1 });
    }

    selectedExtraServices.forEach((service) => {
      const serviceData = SERVICE_COSTS.find((item) => item.label === service);
      if (!serviceData) return;
      const unitPrice = Number.parseInt(serviceData.price.replace(/[^0-9]/g, '') || '0', 10);
      const isPerPerson = service.includes('Cover') || service.includes('فرد');
      const isStaffOrQty = service.includes('ويترز') || service === 'شيف' || service === 'باريستا' ||
        service.includes('شب') || service.includes('بنت') || service.includes('اشر') ||
        service.includes('هاوس') || service.includes('جراب');
      const quantity = isPerPerson ? clampGuestCount(calcPax) : isStaffOrQty ? normalizeQuantity(serviceQuantities[service]) : 1;
      lines.push({ unitPrice, quantity });
    });

    selectedDrinks.forEach((drinkName) => {
      const drink = SOFT_DRINKS.find((item) => item.name === drinkName);
      if (drink) lines.push({ unitPrice: drink.price, quantity: normalizeQuantity(drinkQuantities[drinkName]) });
    });

    selectedBeverages.forEach((beverage) => {
      const match = beverage.match(/[—(]\s*(\d+)\s*ج/);
      if (match) lines.push({ unitPrice: Number.parseInt(match[1], 10), quantity: normalizeQuantity(beverageQuantities[beverage]) });
    });

    selectedEquipment.forEach((id) => {
      const equipment = allEquipmentItems.find((item) => item.id === id);
      if (equipment?.price) lines.push({ unitPrice: equipment.price, quantity: normalizeQuantity(equipmentQuantities[id]) });
    });

    return calculateOrderTotal(lines);
  };

  const handleStartBooking = (mode: 'appointment' | 'confirmation' = 'confirmation') => {
    dispatchOrderContext({ type: 'start-booking' });
    setCustomerInfo({ ...EMPTY_CUSTOMER_INFO });
    setOrderNotice('');
    setCustomerFormMode(mode);
    setIsCustomerModalOpen(true);
  };

  const handleOrder = () => {
    const hasCartItems = Boolean(
      selectedPkgId || selectedBeverages.length || selectedDrinks.length ||
      selectedExtraServices.length || selectedEquipment.length
    );
    if (!hasCartItems) {
      setOrderNotice('السلة فارغة؛ اختر باقة أو صنفاً قبل متابعة الطلب.');
      return;
    }
    handleStartBooking('confirmation');
  };

  const handleEquipmentOnlyOrder = () => {
    const resolved = resolveEquipmentSelections(selectedEquipment, allEquipmentItems);
    const expectedCount = new Set(selectedEquipment).size;
    if (resolved.length === 0 || resolved.length !== expectedCount) {
      setOrderNotice('تعذر تجهيز الطلب لأن بعض اختيارات المعدات غير موجودة في الكتالوج. حدّث الصفحة ثم أعد الاختيار.');
      return;
    }
    dispatchOrderContext({ type: 'start-equipment-inquiry', items: null });
    setCustomerInfo({ ...EMPTY_CUSTOMER_INFO });
    setCustomerFormMode('confirmation');
    setIsCustomerModalOpen(true);
  };

  const handleSharePackage = (pkg: MenuPackage) => {
    dispatchOrderContext({ type: 'start-package-inquiry', package: pkg });
    setCustomerInfo({ ...EMPTY_CUSTOMER_INFO });
    setCustomerFormMode('confirmation');
    setIsCustomerModalOpen(true);
  };

  const confirmAndSendOrder = () => {
    if (Object.keys(validateCustomerInfo(customerInfo, customerFormMode === 'confirmation')).length > 0) return;

    const isAppointment = customerFormMode === 'appointment';
    const isPackageInquiry = orderContext.kind === 'package-inquiry';
    const isEquipmentInquiry = orderContext.kind === 'equipment-inquiry';
    const header = isAppointment
      ? '*طلب حجز موعد وتجهيز كوتيشن من ملوك السعادة*'
      : isPackageInquiry
      ? '*استفسار عن باقة من ملوك السعادة*'
      : isEquipmentInquiry
        ? '*طلب حجز معدات من ملوك السعادة*'
        : '*طلب حجز من ملوك السعادة*';
    const sections: string[] = [];

    if (isPackageInquiry && pendingPkg) {
      sections.push(`*الباقة:* ${pendingPkg.title}`);
      if (pendingPkg.price > 0) {
        sections.push(`*سعر الباقة:* ${pendingPkg.price.toLocaleString()} ج.م${pendingPkg.perPerson ? ' للفرد' : ''}`);
      }
    } else if (isEquipmentInquiry) {
      const requestedIds = pendingEquipment
        ? pendingEquipment.map((item) => item.id)
        : selectedEquipment;
      const equipment = resolveEquipmentSelections(requestedIds, allEquipmentItems);
      const expectedCount = new Set(requestedIds).size;
      if (equipment.length === 0 || equipment.length !== expectedCount) {
        setOrderNotice('تعذر تجهيز الطلب لأن بعض اختيارات المعدات غير موجودة في الكتالوج. لم تُفتح رسالة WhatsApp.');
        return;
      }
      const summary = buildEquipmentOrderSummary(equipment, equipmentQuantities);
      if (summary.itemCount === 0 || !summary.lines.trim()) {
        setOrderNotice('لا توجد معدات صالحة في الطلب. لم تُفتح رسالة WhatsApp.');
        return;
      }
      sections.push(`*المعدات المختارة:*\n${summary.lines}`);
      if (summary.total > 0) {
        sections.push(`*إجمالي المعدات ذات السعر المدرج:* ${summary.total.toLocaleString()} ج.م`);
      }
    } else if (isAppointment) {
      sections.push(`*نوع الطلب:* حجز موعد وتجهيز كوتيشن`);
      sections.push(`*العدد المتوقع:* ${clampGuestCount(calcPax)} فرد`);
    } else {
      const pkgToUse = selectedPkg;
      if (pkgToUse) {
        sections.push(`*الباقة:* ${pkgToUse.title}`);
        if (pkgToUse.price > 0) {
          const packageTotal = pkgToUse.perPerson ? pkgToUse.price * calcPax : pkgToUse.price;
          sections.push(`*سعر الباقة:* ${pkgToUse.price.toLocaleString()} ج.م${pkgToUse.perPerson ? ' للفرد' : ''}`);
          if (pkgToUse.perPerson) {
            sections.push(`*إجمالي الباقة لـ ${calcPax} فرد:* ${packageTotal.toLocaleString()} ج.م`);
          }
        }
      } else {
        sections.push(`*العدد:* ${clampGuestCount(calcPax)} فرد`);
      }

      if (selectedExtraServices.length > 0) {
        const serviceLines = selectedExtraServices.map((service) => {
          const serviceData = SERVICE_COSTS.find((entry) => entry.label === service);
          if (!serviceData) return `- ${service}: السعر غير مدرج في القائمة`;
          const price = Number.parseInt(serviceData.price.replace(/[^0-9]/g, ''), 10) || 0;
          const quantityBased = service.includes('ويترز') || service === 'شيف' || service === 'باريستا' ||
            service.includes('شب') || service.includes('بنت') || service.includes('اشر') ||
            service.includes('هاوس') || service.includes('جراب');
          const perPerson = service.includes('Cover') || service.includes('فرد');
          const quantity = perPerson ? clampGuestCount(calcPax) : quantityBased ? normalizeQuantity(serviceQuantities[service]) : 1;
          if (price <= 0) return `- ${service} (عدد ${quantity}): السعر غير مدرج`;
          return `- ${service} (${price.toLocaleString()} ج.م × ${quantity}): ${(price * quantity).toLocaleString()} ج.م`;
        });
        sections.push(`*الخدمات الإضافية:*\n${serviceLines.join('\n')}`);
      }

      if (selectedDrinks.length > 0) {
        const drinkLines = selectedDrinks.map((drink) => {
          const item = SOFT_DRINKS.find((entry) => entry.name === drink);
          const quantity = normalizeQuantity(drinkQuantities[drink]);
          if (!item || item.price <= 0) return `- ${drink} (عدد ${quantity}): السعر غير مدرج`;
          return `- ${drink} (${item.price.toLocaleString()} ج.م × ${quantity}): ${(item.price * quantity).toLocaleString()} ج.م`;
        });
        sections.push(`*المشروبات الفردية:*\n${drinkLines.join('\n')}`);
      }

      if (selectedBeverages.length > 0) {
        const beverageLines = selectedBeverages.map((beverage) => {
          const match = beverage.match(/[—(]\s*(\d+)\s*ج/);
          const price = match ? Number.parseInt(match[1], 10) : 0;
          const quantity = normalizeQuantity(beverageQuantities[beverage]);
          if (price <= 0) return `- ${beverage} (عدد ${quantity}): السعر غير مدرج`;
          return `- ${beverage} (${price.toLocaleString()} ج.م × ${quantity}): ${(price * quantity).toLocaleString()} ج.م`;
        });
        sections.push(`*المشروبات المختارة:*\n${beverageLines.join('\n')}`);
      }

      if (selectedEquipment.length > 0) {
        const equipment = resolveEquipmentSelections(selectedEquipment, allEquipmentItems);
        const expectedCount = new Set(selectedEquipment).size;
        if (equipment.length !== expectedCount) {
          setOrderNotice('تعذر تجهيز الطلب لأن بعض اختيارات المعدات غير موجودة في الكتالوج. لم تُفتح رسالة WhatsApp.');
          return;
        }
        const summary = buildEquipmentOrderSummary(equipment, equipmentQuantities);
        if (summary.lines.trim()) sections.push(`*المعدات المختارة:*\n${summary.lines}`);
      }

      const total = calculateTotal();
      if (total > 0) sections.push(`*الإجمالي النهائي:* ${total.toLocaleString()} ج.م`);
    }

    let message: string;
    try {
      message = buildWhatsAppOrderMessage({ header, sections, customerInfo });
    } catch {
      setOrderNotice('أضف اختياراً واحداً على الأقل قبل تجهيز رسالة WhatsApp.');
      return;
    }

    const whatsappUrl = buildWhatsAppUrl(WHATSAPP_PHONE, message);
    const openedWindow = openWhatsAppMessage(whatsappUrl);
    if (!openedWindow) {
      setOrderNotice('لم يفتح WhatsApp. اسمح بالنوافذ المنبثقة لهذا الموقع ثم أعد المحاولة. لم يتم إرسال بياناتك.');
      return;
    }

    setIsCustomerModalOpen(false);
    dispatchOrderContext({ type: 'reset' });
    setCustomerInfo({ ...EMPTY_CUSTOMER_INFO });
    clearAll();
    setOrderNotice('جهّز الموقع الرسالة في WhatsApp فقط؛ راجعها ثم أرسلها من داخل التطبيق.');
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
    dispatchOrderContext({ type: 'reset' });
    setCustomerInfo({ ...EMPTY_CUSTOMER_INFO });
    setCustomerFormMode('confirmation');
  };

  const handleShareEquipment = (items: EquipmentItem | EquipmentItem[]) => {
    const requested = Array.isArray(items) ? items : [items];
    const requestedIds = requested.map((item) => item.id);
    const resolved = resolveEquipmentSelections(requestedIds, allEquipmentItems);
    if (requestedIds.length === 0 || resolved.length !== new Set(requestedIds).size) {
      setOrderNotice('تعذر تجهيز الطلب لأن بعض اختيارات المعدات غير موجودة في الكتالوج.');
      return;
    }
    dispatchOrderContext({ type: 'start-equipment-inquiry', items: resolved });
    setCustomerInfo({ ...EMPTY_CUSTOMER_INFO });
    setIsCustomerModalOpen(true);
  };

  const updateEquipmentQty = (id: string, delta: number) => {
    setEquipmentQuantities(prev => ({
      ...prev,
      [id]: normalizeQuantity((prev[id] || 1) + delta)
    }));
  };

  const updateEquipmentQtySet = (id: string, value: number) => {
    setEquipmentQuantities(prev => ({
      ...prev,
      [id]: normalizeQuantity(value)
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
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#050505] text-zinc-200 overflow-x-hidden relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[300] focus:bg-[#f7e1a0] focus:text-black focus:px-4 focus:py-3 focus:rounded-xl">تخطي إلى المحتوى</a>
      {/* Smooth Animated Luxury Ambient Gradient Backgrounds & Custom Drawings */}
      <div aria-hidden="true" className="ambient-background fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft floating gold and amber light emitters */}
        <div className="absolute top-[15%] left-[-15%] w-[55vw] h-[55vw] md:w-[35vw] md:h-[35vw] bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-[100px] rounded-full animate-float-glow-1" />
        <div className="absolute top-[50%] right-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-[radial-gradient(circle,rgba(197,160,89,0.05)_0%,transparent_70%)] blur-[130px] rounded-full animate-float-glow-2" />
        <div className="absolute bottom-[10%] left-[10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] blur-[110px] rounded-full animate-float-glow-1" />

        {/* Subtle royal dot-mesh pattern drawn on the background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(197,160,89,0.02)_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-40" />
      </div>

      <header
        id="royal-header-main"
        className={`fixed top-0 inset-x-0 z-[110] transition-all duration-500 ease-out px-3 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 flex items-center justify-center ${
          showHeader ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-2 sm:gap-5 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 max-w-full ${
            scrolled
              ? 'nav-glass shadow-[0_12px_36px_rgba(0,0,0,0.75)]'
              : 'bg-black/45 backdrop-blur-md border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.45)]'
          }`}
        >
          {/* Navigation Links */}
          <nav aria-label="القائمة الرئيسية" className="flex min-w-0 items-center justify-center gap-0 sm:gap-3 md:gap-5">
            {NAV_ITEMS.map((nav) => {
              const isCurrent = view === nav.v || (nav.v === 'portal' && view === 'category');
              return (
                <button
                  key={nav.v}
                  type="button"
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => navigateTo(nav.v)}
                  className={`min-h-[44px] px-2 sm:px-3.5 text-xs sm:text-sm md:text-[15px] transition-colors relative py-1 whitespace-nowrap rounded-full ${
                    isCurrent
                      ? 'text-royal-gold font-extrabold'
                      : 'text-zinc-200 hover:text-white font-semibold'
                  }`}
                >
                  {nav.l}
                  {isCurrent && (
                    <span className="absolute bottom-1 inset-x-2.5 h-0.5 bg-royal-gold rounded-full shadow-[0_0_8px_#c5a059]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Cart Button (shown when not on home page) */}
          {view !== 'home' && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              aria-label="سلة الطلبات"
              className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-full royal-btn-secondary !p-0 flex items-center justify-center text-white shadow-lg transition-all group relative border border-royal-gold/30"
            >
              <ShoppingBasket className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-royal-gold group-hover:text-white transition-colors" />
              {(selectedEquipment.length + selectedBeverages.length + (selectedPkgId ? 1 : 0) + selectedDrinks.length + selectedExtraServices.length) > 0 && (
                <span className="absolute -top-1 -left-1 bg-royal-gold text-black w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-extrabold border border-black shadow-md font-numbers">
                  {selectedEquipment.length + selectedBeverages.length + (selectedPkgId ? 1 : 0) + selectedDrinks.length + selectedExtraServices.length}
                </span>
              )}
            </motion.button>
          )}
        </div>
      </header>

      <main id="main-content" className="min-h-screen" tabIndex={-1}>
        <h1 className="sr-only">{pageTitle}</h1>
        {view === 'home' && (
          <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative min-h-[90svh] md:min-h-[94vh] flex flex-col justify-between items-center overflow-hidden pt-20 sm:pt-24 pb-12 md:pb-16">
               {/* Premium Background Image with Luxury Vignette and Gradients */}
               <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#050505]">
                 <picture className="w-full h-full block">
                   <source media="(min-width: 768px)" srcSet={cloudinarySrcSet("https://res.cloudinary.com/dhktkzpap/image/upload/v1784323411/bfe5c1c7-4080-44dc-bd9a-80f243fc9122_ne8rrq.png")} sizes="100vw" />
                   <img
                     src={optimizeCloudinaryImage("https://res.cloudinary.com/dhktkzpap/image/upload/v1784656446/d88ceec3-56ac-422e-a7ad-812f3f216698_tf7hyo.png", 960)}
                     srcSet={cloudinarySrcSet("https://res.cloudinary.com/dhktkzpap/image/upload/v1784656446/d88ceec3-56ac-422e-a7ad-812f3f216698_tf7hyo.png")}
                     sizes="100vw"
                     alt=""
                     aria-hidden="true"
                     width={1440}
                     height={900}
                     className="w-full h-full object-cover object-center scale-100 filter brightness-[0.85] contrast-[1.05]"
                     loading="eager"
                     fetchPriority="high"
                     decoding="async"
                     referrerPolicy="no-referrer"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                     }}
                   />
                 </picture>
                 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]"></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(5,5,5,0.9)_100%)]"></div>
               </div>

               {/* Hero Content */}
               <div className="royal-container flex flex-col justify-between items-center text-center relative z-10 flex-grow">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center relative z-20 w-full mb-6 md:mb-10"
                  >
                    {/* Keep the chandelier and logo centered in the same layout flow. */}
                    <div
                      aria-hidden="true"
                      className="relative z-10 w-[105px] sm:w-[130px] md:w-[160px] pointer-events-none select-none shrink-0"
                    >
                      {/* Continue the suspension from the top of the hero, behind the navigation. */}
                      <svg className="absolute bottom-full left-1/2 -translate-x-1/2 w-3 h-20 sm:h-24" viewBox="0 0 12 96" preserveAspectRatio="none" fill="none">
                        <defs>
                          <pattern id="hero-chain-links" width="12" height="16" patternUnits="userSpaceOnUse">
                            <rect x="3" y="1" width="6" height="12" rx="3" stroke="#c5a059" strokeWidth="1.5" />
                            <path d="M6 11v5" stroke="#8b6914" strokeWidth="1.5" />
                          </pattern>
                        </defs>
                        <rect width="12" height="96" fill="url(#hero-chain-links)" />
                      </svg>
                      <img
                        src={LOCAL_LAMP_ASSET}
                        alt=""
                        width={280}
                        height={340}
                        loading="eager"
                        decoding="async"
                        className="w-full h-auto drop-shadow-[0_15px_35px_rgba(197,160,89,0.4)]"
                      />
                      <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[280px] md:w-[440px] h-[360px] md:h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.5)_0%,rgba(197,160,89,0.15)_40%,transparent_70%)] blur-3xl pointer-events-none rounded-full mix-blend-screen origin-top scale-y-[1.4]" />
                      <div className="absolute top-[88%] left-1/2 -translate-x-1/2 w-[180px] md:w-[290px] h-[280px] md:h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.5)_0%,rgba(197,160,89,0.22)_30%,transparent_65%)] blur-xl pointer-events-none rounded-full mix-blend-screen origin-top scale-y-[1.3] animate-pulse" style={{ animationDuration: '4s' }} />
                    </div>

                    <motion.div
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="-mt-5 sm:-mt-6 hover:scale-105 transition-transform duration-700 relative z-20"
                    >
                      <BrandLogo className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 drop-shadow-[0_0_55px_rgba(197,160,89,0.55)]" showGlow={true} eager={true} />
                    </motion.div>

                    {/* Tagline */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      dir="ltr"
                      className="text-zinc-100 font-numbers text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-[0.28em] drop-shadow-[0_2px_8px_rgba(0,0,0,1)] text-center mt-2"
                    >
                      Royal Catering Since 2015
                    </motion.div>
                  </motion.div>

                  {/* Bottom Block: Description and CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-3xl flex flex-col items-center justify-center mt-auto w-full"
                  >
                    {/* Royal Gold Decorative Divider SVG */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="my-4 md:my-6 flex justify-center items-center pointer-events-none select-none"
                    >
                      <svg
                        width="190"
                        height="44"
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

                    {/* Readable Hero Description */}
                    <p className="text-zinc-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-9 font-semibold drop-shadow-[0_2px_14px_rgba(0,0,0,0.98)] px-2">
                      نحن متخصصون في تأجير أفخم معدات المناسبات وتقديم أرقى خدمات الضيافة والاستقبال الملكية لتليق بأهم لحظات حياتكم.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-stretch sm:items-center w-full max-w-lg mx-auto">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigateTo('portal')}
                        className="royal-btn-primary w-full sm:w-auto flex-1 min-h-[50px] py-3.5 px-7 text-sm sm:text-base font-extrabold select-none"
                      >
                        <span>استعراض الضيافة</span>
                        <ArrowRight className="w-4 h-4 rotate-180 text-black" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigateTo('tools', { activeEquipmentCatId: null })}
                        className="royal-btn-secondary w-full sm:w-auto flex-1 min-h-[50px] py-3.5 px-7 text-sm sm:text-base font-bold select-none"
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
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
                <img
                  src={optimizeCloudinaryImage("https://res.cloudinary.com/dhktkzpap/image/upload/v1784662591/8aba16bcfe2f755902869df3346ef14a_z565po.jpg", 1440)}
                  srcSet={cloudinarySrcSet("https://res.cloudinary.com/dhktkzpap/image/upload/v1784662591/8aba16bcfe2f755902869df3346ef14a_z565po.jpg")}
                  sizes="100vw"
                  alt=""
                  aria-hidden="true"
                  width={1440}
                  height={960}
                  className="w-full h-full object-cover object-center scale-105 filter blur-[1.5px] md:blur-[2px] brightness-[0.95] contrast-[1.12] opacity-85 md:opacity-80"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.16)_0%,rgba(5,5,5,0.75)_100%)] pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-28 md:h-44 bg-gradient-to-b from-[#050505] via-[#050505]/75 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-28 md:h-44 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10">
                <BookingSection
                  onBookNow={() => handleStartBooking('appointment')}
                  onBrowseEquipment={() => navigateTo('tools', { activeEquipmentCatId: null })}
                />

                {/* Gallery Section - Royal Moments */}
                <section className="py-20 sm:py-24 md:py-32 bg-transparent relative overflow-hidden gsap-section">
                  <div className="royal-container relative z-10">
                    <div className="text-center mb-14 md:mb-20 gsap-reveal">
                       <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-header mb-4 leading-tight">لحظات <span className="text-royal-gold gold-text-shimmer">ملكية</span></h2>
                       <div className="w-20 h-1 bg-royal-gold mx-auto mb-5 rounded-full"></div>
                       <p dir="ltr" className="text-[#c5a059] text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] font-numbers max-w-2xl mx-auto">Our Pride in Every Detail</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-7 gsap-stagger-container">
                      {[
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774905127/IMG-20251215-WA0067_1_zc3ofs.jpg', class: 'col-span-2 row-span-2' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.08_AM_3_ophvez.jpg', class: 'col-span-1 row-span-1' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.08_AM_2_l8uylj.jpg', class: 'col-span-1 row-span-1' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826480/WhatsApp_Image_2026-03-30_at_1.20.07_AM_mu08y8.jpg', class: 'col-span-1 row-span-1' },
                        { url: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774826482/WhatsApp_Image_2026-03-30_at_1.20.08_AM_vscdnh.jpg', class: 'col-span-1 row-span-1' },
                      ].map((img, i) => (
                        <div key={i} className={`${img.class} aspect-square group relative overflow-hidden rounded-3xl md:rounded-[2.25rem] card-shadow border border-white/10 bg-[#111] gsap-stagger-item gsap-card-interactive`}>
                          <img
                            src={optimizeCloudinaryImage(img.url, 960)}
                            srcSet={cloudinarySrcSet(img.url)}
                            sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                            width={960}
                            height={960}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            alt={`تجهيزات ملوك السعادة للمناسبات ${i + 1}`}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={handleSafeImageError}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5 sm:p-7">
                            <div className="text-right w-full">
                              <span dir="ltr" className="text-royal-gold font-bold text-xs uppercase tracking-[0.2em] font-numbers block mb-1.5">Molok El Saada</span>
                              <h4 className="text-white font-bold text-base sm:text-lg font-header">الفخامة في كل تفصيلة</h4>
                            </div>
                          </div>
                          <div className="absolute inset-0 border-0 group-hover:border-[6px] border-[#c5a059]/20 transition-all duration-500 rounded-3xl md:rounded-[2.25rem] pointer-events-none"></div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                       <button onClick={() => navigateTo('portal')} className="group flex items-center gap-4 text-white font-bold text-sm sm:text-base hover:text-[#c5a059] transition-colors">
                          <span className="w-10 sm:w-12 h-px bg-white/25 group-hover:bg-[#c5a059]/60 transition-colors"></span>
                          استكشف خدمات الضيافة
                          <span className="w-10 sm:w-12 h-px bg-white/25 group-hover:bg-[#c5a059]/60 transition-colors"></span>
                       </button>
                       <button onClick={() => navigateTo('tools', { activeEquipmentCatId: null })} className="group flex items-center gap-4 text-white font-bold text-sm sm:text-base hover:text-[#c5a059] transition-colors">
                          <span className="w-10 sm:w-12 h-px bg-white/25 group-hover:bg-[#c5a059]/60 transition-colors"></span>
                          استكشف المعدات
                          <span className="w-10 sm:w-12 h-px bg-white/25 group-hover:bg-[#c5a059]/60 transition-colors"></span>
                       </button>
                    </div>
                  </div>
                </section>
                <section className="royal-container py-10" aria-label="استكشف خدماتنا">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    {[
                      [String(BEVERAGES_MENU.length), 'باقات مشروبات معروضة'],
                      [String(EQUIPMENT_DATA.length), 'أقسام في كتالوج المعدات'],
                      ['واتساب', 'للتواصل وطلب عرض سعر']
                    ].map(([value, label]) => <div key={label} className="rounded-2xl border border-[#c5a059]/25 bg-[#0c0c0c] p-6"><strong className="block text-2xl font-bold text-[#c5a059]">{value}</strong><span className="text-zinc-300 text-sm">{label}</span></div>)}
                  </div>
                </section>
                <section className="royal-container py-16 sm:py-20" aria-labelledby="faq-title">
                  <h2 id="faq-title" className="text-center text-3xl sm:text-4xl font-bold font-header text-white mb-8">أسئلة شائعة</h2>
                  <div className="max-w-3xl mx-auto space-y-3">
                    {[
                      ['إزاي أطلب عرض سعر؟', 'اختار احتياجاتك من الضيافة أو المعدات، وأرسل تفاصيل الطلب عبر واتساب. تقدر كمان تطلب استشارة وتقولنا موعد ومكان مناسبتك.'],
                      ['إيه الخدمات المتاحة؟', 'تقدر تتصفح باقات المشروبات وخدمات الضيافة وكتالوج المعدات من الموقع.'],
                      ['هل أقدر أعاين المعدات؟', 'أيوه، موقع المكتب والمخازن للمعاينة موجود في صفحة تواصل معنا. تواصل معانا لترتيب التفاصيل.'],
                      ['هل الأسعار لكل الأصناف ظاهرة؟', 'الأسعار المتاحة موضحة في الكتالوج، وبالنسبة للأصناف بدون سعر تواصل معانا للاستفسار.']
                    ].map(([question, answer]) => <details key={question} className="rounded-2xl bg-[#0c0c0c] border border-white/10 p-5 text-right"><summary className="cursor-pointer font-bold text-white">{question}</summary><p className="text-zinc-300 mt-3 leading-relaxed">{answer}</p></details>)}
                  </div>
                </section>
              </div>
            </div>

          </div>
        )}

        {view === 'portal' && (
          <div className="royal-container pt-28 sm:pt-32 pb-24 animate-in slide-in-from-bottom-10 duration-700 gsap-section">
            <div className="text-center mb-14 md:mb-16 gsap-reveal">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-header mb-4">قوائم الضيافة</h2>
              <div className="w-20 h-1 bg-royal-gold mx-auto mb-5 rounded-full"></div>
              <p dir="ltr" className="text-[#c5a059] text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] font-numbers">Choose Your Royal Experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto gsap-stagger-container">
              {PORTAL_CATEGORIES.map((cat) => (
                <button type="button" key={cat.id} onClick={() => openCategory(cat.id)} aria-label={`استعراض ${cat.displayName}`} className="w-full group bg-[#0c0c0c] border border-white/10 hover:border-[#c5a059]/40 p-8 sm:p-10 md:p-12 rounded-3xl md:rounded-[2.5rem] text-center cursor-pointer card-shadow relative overflow-hidden gsap-stagger-item gsap-card-interactive">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/5 rounded-bl-[10rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-6xl sm:text-7xl block mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">{cat.icon}</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#c5a059] transition-colors mb-3 font-header">{cat.displayName}</h3>
                  <p className="text-zinc-300 text-sm sm:text-base font-medium leading-relaxed">{cat.desc}</p>
                  <div className="mt-8 h-0.5 w-12 bg-zinc-800 mx-auto group-hover:w-24 group-hover:bg-[#c5a059] transition-all"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'category' && (activeCategory.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="royal-container pt-28 sm:pt-32 pb-24 text-right gsap-section"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 md:mb-16 gap-4 pb-6 border-b border-white/10 gsap-reveal">
              <div className="flex items-center gap-4">
                <span className="w-1.5 h-10 bg-[#c5a059] rounded-full hidden sm:block"></span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-header gold-text-shimmer">{categoryDisplayName}</h2>
              </div>
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => window.history.back()}
                className="group flex items-center gap-2.5 text-[#c5a059] text-xs sm:text-sm font-bold"
              >
                <span className="w-9 h-9 rounded-full border border-[#c5a059]/30 flex items-center justify-center group-hover:bg-[#c5a059] group-hover:text-black transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span>العودة للقوائم</span>
              </motion.button>
            </div>

            <div className={`grid grid-cols-1 ${activeCategory.length > 1 ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'} gap-6 md:gap-8 gsap-stagger-container`}>
              {activeCategory.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#0c0c0c] border border-white/10 rounded-3xl md:rounded-[2.25rem] p-6 sm:p-8 md:p-10 card-shadow relative overflow-hidden flex flex-col group hover:border-royal-gold/30 transition-all duration-500 gsap-stagger-item gsap-card-interactive"
                >
                  <div className="flex justify-between items-start mb-8 sm:mb-10 flex-wrap gap-5">
                    <div className="text-right">
                      <h3 className="text-2xl sm:text-3xl font-bold text-royal-gold font-header mb-3">{pkg.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {pkg.minPeople && <span className="bg-white/10 text-xs font-semibold px-3 py-1 rounded-full text-zinc-200 border border-white/10">أقل عدد <span className="font-numbers font-bold">{pkg.minPeople}</span> فرد</span>}
                        {!pkg.id.startsWith('ad-') && (!pkg.id.startsWith('bev-') || pkg.perPerson) && (
                          <span className="bg-[#c5a059]/10 text-xs font-bold px-3 py-1 rounded-full text-[#c5a059] border border-[#c5a059]/25">{pkg.perPerson ? 'سعر الفرد' : 'باقة متكاملة'}</span>
                        )}
                      </div>
                    </div>
                    {!pkg.id.startsWith('ad-') && (!pkg.id.startsWith('bev-') || pkg.perPerson) && (
                      <div className="text-left">
                        {(() => {
                          let perPersonPrice = pkg.price;

                          const hasPrice = perPersonPrice > 0 || pkg.price > 0;

                          if (!hasPrice && pkg.id !== 'srv-cat') {
                            return <div className="text-xl sm:text-2xl font-bold text-royal-gold font-header">السعر حسب اليوم</div>;
                          }

                          if (pkg.id === 'srv-cat') return null;

                          const total = pkg.perPerson ? perPersonPrice * calcPax : perPersonPrice;

                          return (
                            <>
                              <div className="text-4xl sm:text-5xl font-extrabold text-white font-numbers tracking-tight">{perPersonPrice.toLocaleString()}</div>
                              <div className="mt-1.5 text-left">
                                <span className="text-xs text-zinc-400 font-bold block">ج.م {pkg.perPerson ? '/ للفرد' : 'إجمالي'}</span>
                                {pkg.perPerson && (
                                  <span className="text-xs text-royal-gold font-bold block mt-1">الإجمالي: <span className="font-numbers">{total.toLocaleString()}</span> ج.م (<span className="font-numbers">{calcPax}</span> فرد)</span>
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
                              <div className="text-right sm:text-left">
                                <span className="text-royal-gold text-xs font-bold block mb-1">اختر الأصناف</span>
                                <span className="text-zinc-400 text-xs font-medium block">لحساب التكلفة</span>
                              </div>
                            );
                          }

                          return (
                            <>
                              <div className="text-4xl sm:text-5xl font-extrabold text-white font-numbers tracking-tight">{totalSectionPrice.toLocaleString()}</div>
                              <div className="mt-1 text-left">
                                <span className="text-xs text-zinc-400 font-bold block">ج.م إجمالي</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-8 sm:space-y-10 flex-1">
                    {pkg.sections.map((sec, i) => (
                      <div key={i} className="text-right">
                        <h4 className="text-sm sm:text-base font-bold text-[#c5a059] mb-4 flex items-center gap-3">
                          <span>{sec.name}</span>
                          <span className="flex-1 h-px bg-[#c5a059]/20"></span>
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                                <li key={j} className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex justify-between items-center gap-3 ${isSelected ? 'border-[#c5a059] bg-[#c5a059]/10' : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/20 hover:text-white'}`}>
                                    <button type="button" aria-pressed={isSelected} className="flex-1 min-h-[44px] cursor-pointer text-right flex items-center justify-between gap-3" onClick={() => {
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
                                        <span className={`text-sm font-bold block transition-colors leading-relaxed ${isSelected ? 'text-[#c5a059]' : 'text-zinc-100'}`}>{item}</span>
                                        {isService && srvData && (
                                          <span className="text-xs text-zinc-400 font-semibold mt-0.5 block">{srvData.price}</span>
                                        )}
                                      </div>
                                      {!isSelected && (
                                        <span aria-hidden="true" className="w-8 h-8 shrink-0 rounded-full border border-white/15 flex items-center justify-center text-zinc-300 hover:border-royal-gold hover:text-royal-gold transition-all font-bold">
                                          +
                                        </span>
                                      )}
                                    </button>

                                  {isSelected && needsQty && (
                                    <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 shrink-0">
                                      <button
                                        type="button"
                                        aria-label={`زيادة كمية ${item}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isBeverage) {
                                            setBeverageQuantities(prev => ({ ...prev, [item]: (prev[item] || 1) + 1 }));
                                          } else if (isService) {
                                            setServiceQuantities(prev => ({ ...prev, [item]: (prev[item] || 1) + 1 }));
                                          }
                                        }}
                                        className="w-11 h-11 shrink-0 rounded-lg bg-royal-gold flex items-center justify-center hover:scale-105 transition-transform text-black font-bold text-sm"
                                      >
                                        +
                                      </button>
                                      <input
                                        aria-label={`كمية ${item}`}
                                        type="number"
                                        min="1"
                                        value={isBeverage ? (beverageQuantities[item] || 1) : (serviceQuantities[item] || 1)}
                                        onChange={(e) => {
                                          const val = normalizeQuantity(e.target.value);
                                          if (isBeverage) {
                                            setBeverageQuantities(prev => ({ ...prev, [item]: val }));
                                          } else if (isService) {
                                            setServiceQuantities(prev => ({ ...prev, [item]: val }));
                                          }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-12 h-11 bg-white/5 border border-white/10 rounded-lg text-white text-center font-numbers font-bold text-sm focus:border-royal-gold/50 outline-none"
                                      />
                                      <button
                                        type="button"
                                        aria-label={`تقليل كمية ${item}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isBeverage) {
                                            setBeverageQuantities(prev => ({ ...prev, [item]: Math.max(1, (prev[item] || 1) - 1) }));
                                          } else if (isService) {
                                            setServiceQuantities(prev => ({ ...prev, [item]: Math.max(1, (prev[item] || 1) - 1) }));
                                          }
                                        }}
                                        className="w-11 h-11 shrink-0 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white font-bold text-sm"
                                      >
                                        -
                                      </button>
                                    </div>
                                  )}
                                </li>
                              );
                            }
                            return (
                              <li key={j} className="text-zinc-200 text-sm sm:text-base flex items-start gap-2.5 group/item cursor-default leading-relaxed">
                                <span className="text-[#c5a059] group-hover/item:scale-125 transition-transform mt-1">•</span>
                                <span className="group-hover/item:text-white transition-colors">{item}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {pkg.id === 'srv-cat' && (
                    <div className="mt-10 p-6 sm:p-7 bg-royal-gold/5 border border-royal-gold/20 rounded-2xl text-right">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 shrink-0 rounded-full bg-royal-gold/20 flex items-center justify-center text-royal-gold">
                          <MapPinIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-royal-gold font-bold text-sm block mb-1">النقل وتكاليف التوصيل</span>
                          <p className="text-zinc-300 text-sm font-medium">يتم تحديد تكلفة النقل حسب موقع المناسبة.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {pkg.id !== 'srv-cat' && (
                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setSelectedPkgId(pkg.id);
                          setIsCartOpen(true);
                        }}
                        className="royal-btn-secondary flex-1 py-3.5 text-xs sm:text-sm font-bold"
                      >
                        <ShoppingBasket className="w-4 h-4 text-royal-gold" />
                        <span>إضافة للسلة</span>
                      </button>
                      <button
                        onClick={() => handleSharePackage(pkg)}
                        className="royal-btn-primary flex-1 py-3.5 text-xs sm:text-sm font-extrabold shadow-lg"
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
              <div className="mt-16 sm:mt-20 space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
                {/* PAX Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 sm:p-8 rounded-3xl border border-[#c5a059]/25 card-shadow text-right max-w-2xl mx-auto"
                >
                  <div className="flex justify-between items-center mb-5 gap-4">
                    <label htmlFor="beverage-pax" id="beverage-pax-label" className="text-white text-lg sm:text-xl font-bold font-header">عدد الأفراد (PAX)</label>
                    <div className="flex items-center gap-2">
                      <input
                        aria-label="عدد الأفراد في الضيافة"
                        type="number"
                        min="25"
                        max="1000"
                        step="1"
                        value={calcPax}
                        onChange={e => setCalcPax(clampGuestCount(e.target.value))}
                        className="w-24 min-h-11 bg-white/5 border border-royal-gold/40 rounded-xl px-2 text-center text-royal-gold font-numbers text-xl sm:text-2xl font-extrabold focus:border-royal-gold outline-none"
                      />
                      <span className="text-zinc-400 text-xs sm:text-sm font-bold">فرد</span>
                    </div>
                  </div>
                  <input
                    id="beverage-pax"
                    aria-labelledby="beverage-pax-label"
                    aria-valuetext={`${calcPax} فرد`}
                    type="range"
                    min="25"
                    max="1000"
                    step="1"
                    value={calcPax}
                    onChange={e => setCalcPax(clampGuestCount(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c5a059]"
                  />
                  <div className="flex justify-between mt-3 text-xs font-bold text-zinc-400 font-numbers">
                    <span>25 فرد</span>
                    <span>1000 فرد</span>
                  </div>
                </motion.div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl font-bold text-white font-header mb-4">
                    اختيار مشروبات فردية (بالفرد)
                  </h3>
                  <div className="w-20 h-1 bg-[#c5a059] mx-auto rounded-full"></div>
                </div>

                {BEVERAGES_CATEGORIES.map((category, catIdx) => (
                  <div key={catIdx} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <h4 className="text-xl sm:text-2xl font-bold text-royal-gold font-header whitespace-nowrap">{category.name}</h4>
                      <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                      {category.items.map((drink, idx) => {
                        const isSelected = selectedDrinks.includes(drink.name);
                        const qty = drinkQuantities[drink.name] || 1;
                        return (
                          <div
                            key={idx}
                            className={`p-6 sm:p-7 rounded-3xl border transition-all duration-500 flex flex-col justify-between items-center text-center ${isSelected ? 'border-royal-gold bg-royal-gold/10 shadow-royal-gold/10' : 'border-white/10 bg-[#0c0c0c] hover:border-white/20'} card-shadow group`}
                          >
                            <button
                              type="button"
                              aria-pressed={isSelected}
                              className="w-full min-h-[44px] flex flex-col items-center text-center"
                              onClick={() => {
                                if (!isSelected) {
                                  setSelectedDrinks((previous) => [...previous, drink.name]);
                                  setDrinkQuantities((previous) => ({
                                    ...previous,
                                    [drink.name]: normalizeQuantity(previous[drink.name] ?? 1)
                                  }));
                                } else {
                                  setSelectedDrinks((previous) => previous.filter((name) => name !== drink.name));
                                  setDrinkQuantities((previous) => {
                                    const next = { ...previous };
                                    delete next[drink.name];
                                    return next;
                                  });
                                }
                              }}
                            >
                              <span aria-hidden="true" className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 transition-all duration-500 ${isSelected ? 'bg-royal-gold border-royal-gold' : 'border-white/15 group-hover:border-royal-gold/50'}`}>
                                {isSelected ? <CheckIcon className="w-6 h-6 text-black" /> : <span className="text-xl">🥤</span>}
                              </span>
                              <span className={`text-base sm:text-lg font-bold mb-1.5 transition-colors duration-500 ${isSelected ? 'text-royal-gold' : 'text-white'}`}>{drink.name}</span>
                              <span className="text-zinc-400 text-xs sm:text-sm font-bold"><span className="font-numbers text-zinc-200">{drink.price}</span> ج.م / للصنف</span>
                            </button>

                            {isSelected && (
                              <div className="mt-5 space-y-3 w-full animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center justify-center gap-3 bg-black/50 p-2 rounded-2xl border border-white/10">
                                  <button
                                    type="button"
                                    aria-label={`زيادة كمية ${drink.name}`}
                                    onClick={() => {
                                      setDrinkQuantities((previous) => ({
                                        ...previous,
                                        [drink.name]: normalizeQuantity((previous[drink.name] || 1) + 1)
                                      }));
                                    }}
                                    className="w-10 h-10 rounded-xl bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-colors font-bold text-lg"
                                  >
                                    +
                                  </button>
                                  <output aria-live="polite" className="text-white font-extrabold font-numbers text-base min-w-[2rem]">{qty}</output>
                                  <button
                                    type="button"
                                    aria-label={`تقليل كمية ${drink.name}`}
                                    onClick={() => {
                                      setDrinkQuantities((previous) => ({
                                        ...previous,
                                        [drink.name]: normalizeQuantity((previous[drink.name] || 1) - 1)
                                      }));
                                    }}
                                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white font-bold text-lg"
                                  >
                                    -
                                  </button>
                                </div>
                                <div className="text-xs font-bold text-royal-gold">
                                  الإجمالي: <span className="font-numbers">{(drink.price * qty).toLocaleString()}</span> ج.م
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
          <div className="royal-container pt-28 sm:pt-32 pb-24 animate-in fade-in duration-1000 text-center gsap-section">
            <div className="max-w-4xl mx-auto">
               <div className="flex justify-center mb-12 sm:mb-14 gsap-reveal">
                  <BrandLogo className="w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56" />
               </div>

               {/* Section: About Us (من نحن) */}
               <div className="mb-20 sm:mb-24 space-y-14 sm:space-y-16 text-right">
                 <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="bg-[#0c0c0c] border border-royal-gold/25 p-7 sm:p-10 md:p-14 rounded-3xl md:rounded-[2.5rem] relative overflow-hidden card-shadow gsap-card-interactive"
                 >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royal-gold/50 to-transparent"></div>
                   <span className="text-royal-gold text-xs sm:text-sm font-bold mb-3 block">من نحن</span>
                   <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold font-header mb-6 leading-snug">ملوك السعادة لخدمات الضيافة</h3>
                   <div className="space-y-4 text-zinc-200 text-base sm:text-lg leading-relaxed font-normal">
                     <p>منذ عام <span className="font-numbers font-bold text-royal-gold">2015</span>، وملوك السعادة لخدمات الضيافة والاستقبال بتقدّم تجربة ضيافة متكاملة بمستوى فندقي احترافي.</p>
                     <p>على مدار سنين اشتغلنا على آلاف المناسبات المختلفة والأحداث الكبيرة، وكوّنّا خبرة حقيقية في إدارة التفاصيل وتقديم خدمة تليق بالعملاء الباحثين عن مستوى أرقى دائماً.</p>
                   </div>
                 </motion.div>

                 {/* Section: Services (خدماتنا) */}
                 <div>
                   <div className="flex items-center gap-4 mb-8">
                     <h3 className="text-2xl sm:text-3xl font-bold text-white font-header">خدماتنا</h3>
                     <div className="h-px bg-white/10 flex-1"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 gsap-stagger-container">
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
                         transition={{ delay: i * 0.08 }}
                         className="bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-3xl hover:border-royal-gold/35 transition-all group gsap-stagger-item gsap-card-interactive"
                       >
                         <h4 className="text-royal-gold text-lg sm:text-xl font-bold mb-2.5 font-header">{item.title}</h4>
                         <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                       </motion.div>
                     ))}
                   </div>
                 </div>

                 {/* Section: Vision & System (رؤيتنا ونظام الخدمة) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gsap-stagger-container">
                   <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="bg-royal-gold/5 border border-royal-gold/25 p-7 sm:p-9 rounded-3xl relative gsap-stagger-item gsap-card-interactive"
                   >
                     <h3 className="text-royal-gold text-xs sm:text-sm font-bold mb-4">رؤيتنا</h3>
                     <p className="text-white text-lg sm:text-xl font-bold leading-relaxed font-header">نقدّم خدمة راقية بثبات وجودة عالية، ونكون الاختيار الأول لكل عميل بيدوّر على تنفيذ من غير أخطاء ومستوى يفرق.</p>
                   </motion.div>
                   <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="bg-zinc-900/50 border border-white/10 p-7 sm:p-9 rounded-3xl gsap-stagger-item gsap-card-interactive"
                   >
                     <h3 className="text-zinc-400 text-xs sm:text-sm font-bold mb-4">نظام الخدمة</h3>
                     <p className="text-zinc-200 text-base sm:text-lg leading-relaxed">
                       سواء محتاج خدمة كاملة، أو معدات فقط، أو فريق ضيافة… <br/>
                       <span className="text-white font-bold">إحنا جاهزين ننفّذ باحتراف.</span>
                     </p>
                   </motion.div>
                 </div>
               </div>

               <h2 className="text-4xl sm:text-5xl font-bold text-white font-header mb-4 gsap-reveal">احجز الآن</h2>
               <p className="text-zinc-300 mb-12 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto gsap-reveal">فريقنا جاهز لتصميم باقتك الخاصة والرد على كافة استفساراتكم لضمان ليلة عمر مثالية.</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 gsap-stagger-container">
                  <a href="tel:01097356529" className="bg-[#0c0c0c] border border-white/10 p-8 sm:p-12 rounded-3xl flex flex-col items-center card-shadow group hover:border-[#c5a059]/50 transition-all gsap-stagger-item gsap-card-interactive">
                     <span className="text-4xl sm:text-5xl mb-5 group-hover:scale-110 transition-transform">📞</span>
                     <span className="text-zinc-400 text-xs sm:text-sm font-bold mb-2.5">اتصال مباشر</span>
                     <span dir="ltr" className="text-2xl sm:text-3xl font-extrabold text-white font-numbers tracking-wider">01097356529</span>
                  </a>
                  <a href={WHATSAPP_BUSINESS_LINK} target="_blank" rel="noopener noreferrer" className="bg-[#0c0c0c] border border-white/10 p-8 sm:p-12 rounded-3xl flex flex-col items-center card-shadow group hover:border-green-500/50 transition-all gsap-stagger-item gsap-card-interactive">
                     <WhatsAppIcon className="w-12 h-12 sm:w-14 sm:h-14 mb-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                     <span className="text-zinc-400 text-xs sm:text-sm font-bold mb-2.5">واتساب بيزنس</span>
                     <span className="text-2xl sm:text-3xl font-bold text-[#c5a059] font-header">أرسل رسالة</span>
                  </a>
               </div>

               <div className="mb-14">
                 <OfficeMap />
               </div>

               <div className="flex justify-center gap-8 sm:gap-12 mb-16">
                  <a href="https://www.facebook.com/share/1BQaYtSWYd/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0c0c0c] border border-white/10 flex items-center justify-center card-shadow group-hover:border-[#1877F2]/50 transition-all group-hover:scale-110">
                        <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                     </div>
                     <span dir="ltr" className="text-zinc-400 text-xs font-bold uppercase tracking-widest font-numbers">Facebook</span>
                  </a>
                  <a href="https://www.instagram.com/lkings.of.happinessl?igsh=bjZiY3RoeGNwcmQ0" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0c0c0c] border border-white/10 flex items-center justify-center card-shadow group-hover:border-[#E4405F]/50 transition-all group-hover:scale-110">
                        <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                     </div>
                     <span dir="ltr" className="text-zinc-400 text-xs font-bold uppercase tracking-widest font-numbers">Instagram</span>
                  </a>
               </div>

               {/* Complaints and Suggestions Section */}
               <div className="pt-14 border-t border-white/10">
                 <a
                   href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('لدي شكوى أو اقتراح:')}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group inline-block"
                 >
                   <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-header mb-4 group-hover:text-royal-gold transition-all duration-300">
                     الشكاوى والاقتراحات
                   </h3>
                 </a>
                 <div className="w-16 h-1 bg-royal-gold mx-auto mb-6 rounded-full"></div>
                 <p className="text-zinc-300 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
                   إذا أسعدناك فتحدث عنا<br/>
                   وإن لم نسعدك فتحدث إلينا
                 </p>
               </div>
            </div>
          </div>
        )}

        {view === 'tools' && (
           <div className="royal-container pt-28 sm:pt-32 pb-24 animate-in fade-in duration-700 text-right">
             <div className="text-center mb-14 md:mb-16">
               <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-header mb-4">كتالوج المعدات الملكية</h2>
               <div className="w-20 h-1 bg-royal-gold mx-auto mb-5 rounded-full"></div>
               <p dir="ltr" className="text-[#c5a059] text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] font-numbers">Visual Catalog</p>
             </div>

             <div className="mb-8 max-w-3xl mx-auto">
               <label htmlFor="equipment-search" className="block text-sm text-zinc-300 font-bold mb-2">ابحث في المعدات والأقسام</label>
               <input id="equipment-search" type="search" value={equipmentSearch} onChange={e => setEquipmentSearch(e.target.value)} placeholder="مثلاً: ترابيزة أو كوفي" className="w-full rounded-2xl bg-[#111] border border-white/20 focus:border-[#c5a059] text-white p-4 outline-none" />
             </div>
             <nav aria-label="أقسام المعدات" className="flex gap-2 overflow-x-auto pb-4 mb-8">
               <button type="button" aria-current={!activeEquipmentCat ? 'page' : undefined} onClick={() => { setEquipmentSearch(''); navigateTo('tools'); }} className={`shrink-0 min-h-[44px] rounded-full border px-4 py-2 text-sm font-bold ${!activeEquipmentCat ? 'bg-[#c5a059] text-black border-[#c5a059]' : 'border-white/20 text-white'}`}>كل الأقسام</button>
               {EQUIPMENT_DATA.map(cat => <button type="button" key={cat.id} aria-current={activeEquipmentCat?.id === cat.id ? 'page' : undefined} onClick={() => { setEquipmentSearch(''); navigateTo('tools', { activeEquipmentCatId: cat.id }); }} className={`shrink-0 min-h-[44px] rounded-full border px-4 py-2 text-sm font-bold ${activeEquipmentCat?.id === cat.id ? 'bg-[#c5a059] text-black border-[#c5a059]' : 'border-white/20 text-white'}`}>{cat.name}</button>)}
             </nav>
             {equipmentSearch.trim() ? (() => {
               const term = equipmentSearch.trim().toLocaleLowerCase('ar');
               const matches = EQUIPMENT_DATA.flatMap(cat => {
                 const items = [...(cat.items ?? []), ...(cat.sections ?? []).flatMap(section => section.items), ...(cat.quickSelections ?? [])];
                 const matched = items.filter(item => [item.name, 'note' in item ? item.note : '', ...('options' in item ? (item.options ?? []).map(option => option.name) : [])].some(text => text?.toLocaleLowerCase('ar').includes(term)));
                 return cat.name.toLocaleLowerCase('ar').includes(term) && !matched.length ? [{ cat, name: cat.name, id: cat.id }] : matched.map(item => ({ cat, name: item.name || 'صنف بدون اسم', id: item.id }));
               });
               return <div aria-live="polite">{matches.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{matches.map(({cat, name, id}) => <button key={`${cat.id}-${id}`} onClick={() => { setEquipmentSearch(''); navigateTo('tools', { activeEquipmentCatId: cat.id }); }} className="text-right p-5 rounded-2xl bg-[#111] border border-white/10 hover:border-[#c5a059] text-white"><span className="font-bold block">{name}</span><span className="text-[#c5a059] text-sm">{cat.name} ← عرض القسم</span></button>)}</div> : <p className="text-center text-zinc-300 py-8">مفيش نتائج مطابقة. جرّب كلمة تانية.</p>}</div>;
             })() : !activeEquipmentCat ? (

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                 {EQUIPMENT_DATA.map(cat => (
                   <button type="button" key={cat.id} onClick={() => navigateTo('tools', { activeEquipmentCatId: cat.id })} className="group bg-[#0c0c0c] border border-white/10 p-7 sm:p-8 rounded-3xl text-center cursor-pointer card-shadow relative overflow-hidden transition-all hover:border-[#c5a059]/40 flex flex-col items-center justify-between">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-royal-gold/5 rounded-bl-[8rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <span className="text-5xl block mb-5 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">{cat.icon}</span>
                     <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#c5a059] transition-colors mb-2 font-header">{cat.name}</h3>
                     <div className="mt-4 h-0.5 w-8 bg-[#c5a059]/30 mx-auto group-hover:w-16 group-hover:bg-[#c5a059] transition-all"></div>
                   </button>
                 ))}
               </div>
             ) : (
                <div>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-5 border-b border-white/10 pb-8">
                      <div className="text-right">
                         <h3 className="text-3xl sm:text-4xl font-bold text-white font-header mb-2">{activeEquipmentCat.name}</h3>
                         <p className="text-[#c5a059] text-xs sm:text-sm font-semibold">تصفح المجموعة المختارة</p>
                      </div>
                      <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
                        {selectedEquipment.length > 0 && (
                          <button
                            onClick={() => {
                              const allItems = activeEquipmentCat?.items || activeEquipmentCat?.sections?.flatMap(s => s.items) || [];
                              const itemsToOrder = allItems.filter(i => selectedEquipment.includes(i.id));
                              handleShareEquipment(itemsToOrder);
                            }}
                            className="royal-btn-primary px-6 py-3 text-xs sm:text-sm font-extrabold shadow-xl"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-black" />
                            <span>إرسال الطلب (<span className="font-numbers">{selectedEquipment.length}</span>)</span>
                          </button>
                        )}
                        <button onClick={() => window.history.back()} className="royal-btn-secondary px-5 py-3 text-xs sm:text-sm font-bold">
                           <ArrowRight className="w-4 h-4" />
                           <span>العودة للأقسام</span>
                        </button>
                      </div>
                   </div>

                   {activeEquipmentCat.extraInfo && (
                      <div className="mb-12 p-6 sm:p-10 bg-[#0c0c0c] border border-[#c5a059]/25 rounded-3xl card-shadow text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>
                        <div className={`space-y-3 ${activeEquipmentCat.quickSelections ? 'mb-8' : ''}`}>
                          {activeEquipmentCat.extraInfo.map((info, idx) => (
                            <p key={idx} className="text-base sm:text-lg md:text-xl text-white font-bold font-header leading-relaxed whitespace-pre-line">
                              {info}
                            </p>
                          ))}
                        </div>

                        {activeEquipmentCat.quickSelections && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-right" dir="rtl">
                            {activeEquipmentCat.quickSelections.map((item) => {
                              const isSelected = selectedEquipment.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  aria-pressed={isSelected}
                                  onClick={() => setSelectedEquipment(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                    isSelected
                                      ? 'bg-royal-gold text-black border-royal-gold shadow-[0_10px_20px_rgba(197,160,89,0.2)]'
                                      : 'bg-white/5 text-zinc-200 border-white/10 hover:border-royal-gold/40 hover:bg-white/10'
                                  }`}
                                >
                                   <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black shadow-inner' : 'border-white/25 bg-black/20'}`}>
                                        {isSelected && <CheckIcon className="w-3.5 h-3.5 text-royal-gold" />}
                                      </div>
                                      <span className="text-sm font-bold">{item.name}</span>
                                   </div>
                                   <span className={`text-xs font-numbers font-bold ${isSelected ? 'text-black/80' : 'text-royal-gold'}`}>{item.price} ج.م</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                   {activeEquipmentCat.items && (
                      activeEquipmentCat.displayMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                          {activeEquipmentCat.items.map((item) => {
                            const isSelected = selectedEquipment.includes(item.id);
                            const qty = equipmentQuantities[item.id] || 1;
                            return (
                              <div key={item.id} className={`p-6 sm:p-7 rounded-3xl border transition-all duration-500 ${isSelected ? 'border-royal-gold bg-royal-gold/10 shadow-royal-gold/10' : 'border-white/10 bg-[#0c0c0c] hover:border-white/20'} card-shadow`}>
                                <div className="flex justify-between items-center gap-3 mb-4">
                                  <button
                                    onClick={() => setSelectedEquipment(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                                    className="flex-1 min-h-[44px] text-right"
                                    aria-pressed={isSelected}
                                  >
                                    <h4 className={`text-base sm:text-lg font-bold transition-colors ${isSelected ? 'text-royal-gold' : 'text-white'}`}>{item.name}</h4>
                                    {item.price && <p className="text-zinc-400 text-xs sm:text-sm font-bold mt-1"><span className="font-numbers text-zinc-200">{item.price}</span> ج.م</p>}
                                  </button>
                                  <div className={`w-6 h-6 shrink-0 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-royal-gold border-royal-gold' : 'border-white/20'}`}>
                                    {isSelected && <CheckIcon className="w-4 h-4 text-black" />}
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="flex flex-wrap items-center justify-between bg-black/50 rounded-2xl p-3.5 gap-3 animate-in fade-in zoom-in-95 duration-300 border border-white/10">
                                    <div className="text-right">
                                      <span className="text-xs text-zinc-400 font-semibold block mb-0.5">العدد المطلوب</span>
                                      {item.price && <span className="text-royal-gold text-sm font-bold"><span className="font-numbers">{(item.price * qty).toLocaleString()}</span> ج.م</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        aria-label={`زيادة كمية ${item.name || 'المعدة'}`}
                                        onClick={() => updateEquipmentQty(item.id, 1)}
                                        className="w-11 h-11 shrink-0 rounded-xl bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold text-lg"
                                      >
                                        +
                                      </button>
                                      <input
                                        type="number"
                                        min="1"
                                        value={qty}
                                        aria-label={`كمية ${item.name || 'المعدة'}`}
                                        onChange={(e) => updateEquipmentQtySet(item.id, parseInt(e.target.value) || 1)}
                                        className="w-14 h-11 bg-white/5 border border-white/10 rounded-xl text-white text-center font-extrabold font-numbers text-base focus:border-royal-gold/50 outline-none transition-colors"
                                      />
                                      <button
                                        type="button"
                                        aria-label={`تقليل كمية ${item.name || 'المعدة'}`}
                                        onClick={() => updateEquipmentQty(item.id, -1)}
                                        className="w-11 h-11 shrink-0 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all font-bold text-lg"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
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
                              onShare={(items) => handleShareEquipment(items)}
                              onZoom={(img) => setLightboxImage(img)}
                              selectedItems={selectedEquipment}
                              quantities={equipmentQuantities}
                            />
                          ))}
                        </div>
                      )
                   )}

                   {activeEquipmentCat.sections && activeEquipmentCat.sections.map((section, sIdx) => (
                      <div key={sIdx} className={sIdx > 0 ? "mt-16 sm:mt-20" : ""}>
                        {section.title && (
                          <div className="mb-8 text-right">
                            <h4 className="text-2xl sm:text-3xl font-bold text-royal-gold font-header whitespace-pre-line leading-relaxed">
                              {section.title}
                            </h4>
                            <div className="w-20 h-1 bg-[#c5a059] mt-3 rounded-full"></div>
                          </div>
                        )}
                        {activeEquipmentCat.displayMode === 'grid' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {section.items.map((item) => {
                              const isSelected = selectedEquipment.includes(item.id);
                              const qty = equipmentQuantities[item.id] || 1;
                              return (
                                <div key={item.id} className={`p-6 sm:p-7 rounded-3xl border transition-all duration-500 ${isSelected ? 'border-royal-gold bg-royal-gold/10 shadow-royal-gold/10' : 'border-white/10 bg-[#0c0c0c] hover:border-white/20'} card-shadow`}>
                                  <div className="flex justify-between items-center gap-3 mb-4">
                                    <button
                                      onClick={() => setSelectedEquipment(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                                      className="flex-1 min-h-[44px] text-right"
                                      aria-pressed={isSelected}
                                    >
                                      <h4 className={`text-base sm:text-lg font-bold transition-colors ${isSelected ? 'text-royal-gold' : 'text-white'}`}>{item.name}</h4>
                                      {item.price && <p className="text-zinc-400 text-xs sm:text-sm font-bold mt-1"><span className="font-numbers text-zinc-200">{item.price}</span> ج.م</p>}
                                    </button>
                                    <div className={`w-6 h-6 shrink-0 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-royal-gold border-royal-gold' : 'border-white/20'}`}>
                                      {isSelected && <CheckIcon className="w-4 h-4 text-black" />}
                                    </div>
                                  </div>

                                  {isSelected && (
                                    <div className="flex flex-wrap items-center justify-between bg-black/50 rounded-2xl p-3 gap-3 animate-in fade-in zoom-in-95 duration-300 border border-white/10">
                                      <div className="text-right">
                                        <span className="text-xs text-zinc-400 font-semibold block mb-0.5">العدد المطلوب</span>
                                        {item.price && <span className="text-royal-gold text-sm font-bold"><span className="font-numbers">{(item.price * qty).toLocaleString()}</span> ج.م</span>}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                        aria-label={`زيادة كمية ${item.name || 'المعدة'}`}
                                        onClick={() => updateEquipmentQty(item.id, 1)}
                                          className="w-11 h-11 shrink-0 rounded-full bg-royal-gold/15 text-royal-gold flex items-center justify-center hover:bg-royal-gold hover:text-black transition-all font-bold"
                                        >
                                          +
                                        </button>
                                        <input
                                          type="number"
                                          min="1"
                                          value={qty}
                                          aria-label={`كمية ${item.name || 'المعدة'}`}
                                          onChange={(e) => updateEquipmentQtySet(item.id, parseInt(e.target.value) || 1)}
                                          className="w-12 h-11 bg-white/5 border border-white/10 rounded-lg text-white text-center font-extrabold font-numbers text-sm focus:border-royal-gold/50 outline-none transition-colors"
                                        />
                                        <button
                                          type="button"
                                        aria-label={`تقليل كمية ${item.name || 'المعدة'}`}
                                        onClick={() => updateEquipmentQty(item.id, -1)}
                                          className="w-11 h-11 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
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
                                onShare={(items) => handleShareEquipment(items)}
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
              <button aria-label="إغلاق الصورة" className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-[#c5a059] transition-colors z-10 p-2 rounded-full bg-white/10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={optimizeCloudinaryImage(lightboxImage, 1600)}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                alt="معاينة مكبرة للصنف"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleSafeImageError}
              />
            </motion.div>
        )}
      </AnimatePresence>
      </main>

      {orderNotice && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+6rem)] z-[250] mx-auto max-w-xl rounded-2xl border border-[#c5a059]/40 bg-[#111]/95 px-5 py-4 text-center text-sm font-semibold text-white shadow-2xl"
        >
          {orderNotice}
        </div>
      )}

      <AnimatePresence>
        {view !== 'home' && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.history.back()}
            className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] right-4 sm:right-8 z-[120] w-14 h-14 sm:w-15 sm:h-15 rounded-full royal-btn-secondary !p-0 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center group overflow-hidden border border-royal-gold/40 hover:border-royal-gold"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-royal-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ArrowRight className="w-5 h-5 relative z-10 text-royal-gold group-hover:text-white transition-colors" />
            <span className="text-[11px] font-bold relative z-10 text-zinc-200 group-hover:text-royal-gold transition-colors">عودة</span>
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

      {isCustomerModalOpen && (
        <React.Suspense fallback={<div role="status" className="fixed inset-x-4 bottom-6 z-[250] rounded-2xl bg-[#111] p-4 text-center text-sm">جارٍ تجهيز نموذج الحجز…</div>}>
          <CustomerInfoModal
            isOpen={isCustomerModalOpen}
            onClose={closeCustomerModal}
            onConfirm={confirmAndSendOrder}
            info={customerInfo}
            setInfo={setCustomerInfo}
            mode={customerFormMode}
          />
        </React.Suspense>
      )}

      <footer className="py-20 sm:py-24 md:py-32 bg-[#020202] text-center relative overflow-hidden">
         {/* Lazy-loaded Background Video with instant Poster & Data-Saver / Reduced-Motion protection */}
         <LazyFooterVideo />

         {/* Subtle center shading with a separate vignette and soft top/bottom fades. */}
         <div aria-hidden="true" className="absolute inset-0 z-[1] pointer-events-none" style={{
           background: 'linear-gradient(to bottom, rgba(5,5,5,0.85) 0%, transparent 25%, transparent 75%, rgba(2,2,2,0.85) 100%), radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%), rgba(0,0,0,0.4)'
         }} />

         <div className="royal-container relative z-10 flex flex-col items-center">
           <div className="flex justify-center items-center mb-5">
              <BrandLogo className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]" showGlow={true} />
           </div>
           <h2 className="text-royal-gold font-bold text-3xl sm:text-4xl md:text-5xl font-header mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">ملوك السعادة</h2>
           <p dir="ltr" className="text-zinc-200 text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] sm:tracking-[0.42em] font-numbers mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">The Royal Taste of Happiness</p>

           <div className="flex justify-center gap-4 sm:gap-5 mb-10">
              <a href="tel:+201097356529" aria-label="اتصال هاتفي" className="text-white hover:text-royal-gold transition-colors p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
                <PhoneIcon className="w-5 h-5" />
              </a>
              <a href="https://wa.me/201097356529" aria-label="واتساب" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a href="https://www.google.com/maps?q=30.0076434,31.2152192&z=17&hl=en" aria-label="الموقع على الخريطة" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
                <MapPinIcon className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/lkings.of.happinessl?igsh=bjZiY3RoeGNwcmQ0" aria-label="إنستجرام" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1BQaYtSWYd/" aria-label="فيسبوك" target="_blank" rel="noopener noreferrer" className="text-white hover:text-royal-gold transition-colors p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:border-royal-gold shadow-lg">
                <FacebookIcon className="w-5 h-5" />
              </a>
           </div>

           <p dir="ltr" className="text-zinc-300 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] font-numbers drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">© 2025 Molok El Saada. Designed for Royalty.</p>
         </div>
      </footer>
    </div>
    </MotionConfig>
  );
};

export default App;
