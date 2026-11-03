import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { validateCustomerInfo } from './utils/order-utils.js';

export interface CustomerInfo {
  name: string;
  phone: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  agreedToDeposit: boolean;
}

export const EMPTY_CUSTOMER_INFO: CustomerInfo = {
  name: '',
  phone: '',
  eventDate: '',
  eventLocation: '',
  message: '',
  agreedToDeposit: false
};

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  info: CustomerInfo;
  setInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  mode?: 'appointment' | 'confirmation';
}

export const CustomerInfoModal: React.FC<CustomerInfoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  info,
  setInfo,
  mode = 'confirmation'
}) => {
  const isAppointment = mode === 'appointment';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const isOpenRef = useRef(isOpen);
  const locationRequestId = useRef(0);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (!isOpen) {
      locationRequestId.current += 1;
      setIsGettingLocation(false);
    }
    return () => {
      isOpenRef.current = false;
      locationRequestId.current += 1;
    };
  }, [isOpen]);

  const handleClose = () => {
    locationRequestId.current += 1;
    setIsGettingLocation(false);
    onCloseRef.current();
  };

  useEffect(() => {
    if (!isOpen) return;

    const wrapper = wrapperRef.current;
    const dialog = dialogRef.current;
    if (!wrapper || !dialog) return;

    const activeElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const bodyOverflow = document.body.style.overflow;
    const backgroundSiblings = Array.from(wrapper.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== wrapper)
      .map((element) => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute('aria-hidden')
      }));

    backgroundSiblings.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = 'hidden';
    setErrors({});
    setLocationStatus('');

    const focusFrame = window.requestAnimationFrame(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      backgroundSiblings.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      document.body.style.overflow = bodyOverflow;
      if (activeElement?.isConnected) activeElement.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const updateInfo = (patch: Partial<CustomerInfo>) => {
    setInfo((previous) => ({ ...previous, ...patch }));
    setErrors((previous) => {
      const next = { ...previous };
      Object.keys(patch).forEach((key) => delete next[key as keyof CustomerInfo]);
      return next;
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('هذا المتصفح لا يتيح تحديد الموقع. يمكنك كتابة العنوان أو المتابعة بدونه.');
      return;
    }

    const requestId = ++locationRequestId.current;
    setIsGettingLocation(true);
    setLocationStatus('سيطلب المتصفح إذنك لمشاركة موقعك الحالي.');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isOpenRef.current || requestId !== locationRequestId.current) return;
        const { latitude, longitude } = position.coords;
        const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        updateInfo({ eventLocation: locationLink });
        setIsGettingLocation(false);
        setLocationStatus('أُضيف رابط موقعك إلى حقل مكان المناسبة.');
      },
      () => {
        if (!isOpenRef.current || requestId !== locationRequestId.current) return;
        setIsGettingLocation(false);
        setLocationStatus('تعذر تحديد الموقع. يمكنك كتابة العنوان أو المتابعة بدونه.');
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 }
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCustomerInfo(info, !isAppointment);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = (['name', 'phone', 'eventDate', 'agreedToDeposit'] as const)
        .find((field) => nextErrors[field]);
      if (firstInvalidField === 'name') nameInputRef.current?.focus();
      else if (firstInvalidField) document.getElementById(`customer-${firstInvalidField}`)?.focus();
      return;
    }
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div ref={wrapperRef} id="customer-modal-root" className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-label="إغلاق نافذة بيانات الحجز"
            className="absolute inset-0 w-full h-full bg-black/85 backdrop-blur-md cursor-default"
          />
          <motion.form
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-dialog-title"
            aria-describedby="customer-dialog-description"
            noValidate
            onSubmit={handleSubmit}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="bg-[#0c0c0c] border border-[#c5a059]/40 w-full max-w-lg max-h-[min(92dvh,850px)] rounded-[1.75rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 text-right flex flex-col"
          >
            <div className="p-5 sm:p-6 border-b border-[#c5a059]/15 flex justify-between items-center gap-4">
              <div>
                <h2 id="customer-dialog-title" className="text-white font-black font-header text-xl">{isAppointment ? 'احجز موعدك' : 'تأكيد بيانات الحجز'}</h2>
                <p id="customer-dialog-description" className="text-zinc-300 text-xs mt-1">{isAppointment ? 'قولنا مناسبتك إمتى وفين، وهنجهزلك كوتيشن مناسب.' : 'املأ البيانات المطلوبة، ثم راجع الرسالة قبل إرسالها من WhatsApp.'}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="إغلاق نافذة بيانات الحجز"
                className="text-zinc-200 hover:text-white transition-colors rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                <label htmlFor="customer-name" className="text-xs text-zinc-200 font-bold block">الاسم ثنائي <span aria-hidden="true" className="text-royal-gold">*</span></label>
                <input
                  ref={nameInputRef}
                  id="customer-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'customer-name-help customer-name-error' : 'customer-name-help'}
                  value={info.name}
                  onChange={(event) => updateInfo({ name: event.target.value })}
                  className="w-full min-h-11 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-base focus:border-royal-gold/70 outline-none transition-all text-right"
                  placeholder="أدخل اسمك بالكامل (ثنائي على الأقل)"
                />
                <p id="customer-name-help" className="text-zinc-300 text-xs">أدخل الاسم الأول واسم العائلة كما يظهر في الحجز.</p>
                {errors.name && <p id="customer-name-error" className="text-red-300 text-sm" role="alert">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="customer-phone" className="text-xs text-zinc-200 font-bold block">رقم الهاتف <span aria-hidden="true" className="text-royal-gold">*</span></label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'customer-phone-error' : undefined}
                  value={info.phone}
                  onChange={(event) => updateInfo({ phone: event.target.value })}
                  className="w-full min-h-11 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-base focus:border-royal-gold/70 outline-none transition-all text-right"
                  placeholder="أدخل رقم هاتفك"
                />
                {errors.phone && <p id="customer-phone-error" className="text-red-300 text-sm" role="alert">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="customer-eventDate" className="text-xs text-zinc-200 font-bold block">ميعاد المناسبة <span aria-hidden="true" className="text-royal-gold">*</span></label>
                <input
                  id="customer-eventDate"
                  name="eventDate"
                  type="text"
                  autoComplete="off"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.eventDate)}
                  aria-describedby={errors.eventDate ? 'customer-eventDate-help customer-eventDate-error' : 'customer-eventDate-help'}
                  value={info.eventDate}
                  onChange={(event) => updateInfo({ eventDate: event.target.value })}
                  className="w-full min-h-11 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-base focus:border-royal-gold/70 outline-none transition-all text-right"
                  placeholder="مثال: الجمعة القادمة الساعة 8 مساءً"
                />
                <p id="customer-eventDate-help" className="text-zinc-300 text-xs">يمكن كتابة الموعد بصيغة طبيعية.</p>
                {errors.eventDate && <p id="customer-eventDate-error" className="text-red-300 text-sm" role="alert">{errors.eventDate}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center gap-3 flex-row-reverse">
                  <label htmlFor="customer-eventLocation" className="text-xs text-zinc-200 font-bold">مكان المناسبة أو اللوكيشن (اختياري)</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="text-sm min-h-[44px] px-3 text-royal-gold font-bold hover:underline disabled:opacity-60 rounded-lg"
                  >
                    {isGettingLocation ? 'جاري التحديد...' : 'استخدم موقعي الحالي'}
                  </button>
                </div>
                <input
                  id="customer-eventLocation"
                  name="eventLocation"
                  type="text"
                  autoComplete="street-address"
                  value={info.eventLocation}
                  onChange={(event) => updateInfo({ eventLocation: event.target.value })}
                  className="w-full min-h-11 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-base focus:border-royal-gold/70 outline-none transition-all text-right"
                  placeholder="أدخل العنوان أو رابط اللوكيشن"
                />
                <p className="text-zinc-300 text-xs" aria-live="polite">{locationStatus}</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="customer-message" className="text-xs text-zinc-200 font-bold block">ملاحظات إضافية (اختياري)</label>
                <textarea
                  id="customer-message"
                  name="message"
                  value={info.message}
                  onChange={(event) => updateInfo({ message: event.target.value })}
                  className="w-full min-h-[100px] bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-base focus:border-royal-gold/70 outline-none transition-all text-right resize-y"
                  placeholder="أدخل أي ملاحظات أو طلبات خاصة هنا..."
                />
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200 text-sm leading-relaxed">
                {isAppointment ? 'حتى لو المناسبة قربت أو الطلب متأخر، إحنا أسرع تنفيذ. هنجهزلك رسالة استفسار بالبيانات الأساسية عشان فريقنا يراجع تفاصيل مناسبتك ويجهزلك الكوتيشن. الرسالة هتتفتح في WhatsApp ومش هتتبعت تلقائياً؛ راجعها وابعتها بنفسك.' : 'سيُجهّز الموقع رسالة إلى رقم ملوك السعادة تحتوي الاسم ورقم الهاتف وموعد المناسبة والاختيارات وأسعارها وموافقتك على العربون؛ ويُضاف المكان والملاحظات إذا أدخلتهما. لا يُطلب موقعك إلا بعد ضغط زر «استخدم موقعي الحالي»، ومشاركته اختيارية. تُفتح الرسالة في WhatsApp ولا تُرسل إلى النشاط التجاري تلقائياً؛ راجعها ثم أرسلها بنفسك. يخضع تعامل WhatsApp مع الرسالة لسياساته.'}
              </div>

              {!isAppointment && <div className="pt-2 border-t border-white/10">
                <div className="flex items-start gap-3 cursor-pointer text-right min-h-[48px]">
                  <input
                    id="customer-agreedToDeposit"
                    name="agreedToDeposit"
                    type="checkbox"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.agreedToDeposit)}
                    aria-describedby={errors.agreedToDeposit ? 'customer-deposit-help customer-agreedToDeposit-error' : 'customer-deposit-help'}
                    checked={info.agreedToDeposit}
                    onChange={(event) => updateInfo({ agreedToDeposit: event.target.checked })}
                    className="mt-1 min-w-5 min-h-5 accent-[#c5a059]"
                  />
                  <label htmlFor="customer-agreedToDeposit" className="text-sm text-zinc-200 font-bold leading-relaxed">
                    أقر بالموافقة على دفع <span className="text-royal-gold">30% ديبوزت (عربون)</span> من إجمالي المبلغ لتأكيد الحجز.
                  </label>
                </div>
                <p id="customer-deposit-help" className="text-zinc-300 text-xs mr-8">هذا التأكيد سيُذكر في الرسالة الجاهزة ليراجعه فريق الحجز.</p>
                {errors.agreedToDeposit && <p id="customer-agreedToDeposit-error" className="text-red-300 text-sm mt-1 mr-8" role="alert">{errors.agreedToDeposit}</p>}
              </div>}
            </div>

            <div className="p-5 sm:p-6 bg-[#111] border-t border-[#c5a059]/15">
              <button
                type="submit"
                className="royal-btn-primary w-full min-h-[48px] py-4 text-sm font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2.5 shadow-xl"
              >
                <span>{isAppointment ? 'إرسال طلب الموعد' : 'تجهيز الطلب في WhatsApp'}</span>
                <Check className="w-5 h-5 text-black" aria-hidden="true" />
              </button>
              <p className="text-zinc-300 text-xs text-center mt-3">ستتمكن من مراجعة الرسالة قبل إرسالها.</p>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};
