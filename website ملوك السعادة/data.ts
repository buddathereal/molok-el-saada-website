
import { MenuPackage } from './types';

export interface EquipmentItem {
  id: string;
  image: string;
  name?: string;
  price?: number;
}

export interface EquipmentSection {
  title?: string;
  items: EquipmentItem[];
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items?: EquipmentItem[];
  sections?: EquipmentSection[];
  extraInfo?: string[];
}

// ... (KEEPING OPEN_BUFFET, SET_MENUS, HIGH_TEA, COFFEE_CORNER, DESSERTS as they are)
export const OPEN_BUFFET: MenuPackage[] = [
  {
    id: 'ob-1',
    title: 'اوبن بوفيه (1)',
    price: 450,
    perPerson: true,
    minPeople: 50,
    sections: [
      { name: 'الطبق الرئيسي', items: ['استيشن ديك رومي لكل 50 فرد', 'كفتة مشوية', 'شيش طاووق', 'بيكاتا لحمة بصوص المشروم', 'فراخ بصوص الليمون', 'محاشي مشكلة', 'أرز بسمتي', 'مكرونة بشاميل'] },
      { name: 'الحلويات', items: ['أم علي', 'كريم كراميل', 'جاتوه سواريه', 'شرقي مشكل'] },
      { name: 'المقبلات', items: ['سمبوسك لحمة', 'كبيبة', 'ورق عنب', 'سمبوسك جبنة'] },
      { name: 'السلطات', items: ['فتوش', 'طحينة', 'بابا غنوج', 'بنجر', 'كول سلو', 'بطاطس مايونيز', 'سلطة خضراء', 'جريك سالاد', 'تبولة', 'مخلل'] },
      { name: 'المخبوزات', items: ['عيش شامي', 'عيش بلدي', 'عيش باتيبان'] }
    ]
  },
  {
    id: 'ob-2',
    title: 'اوبن بوفيه (2)',
    price: 550,
    perPerson: true,
    minPeople: 50,
    sections: [
      { name: 'الطبق الرئيسي', items: ['استيشن ديك رومي لكل 50 فرد', 'استيشن فخدة ضاني لكل 50 فرد', 'كفتة مشوية', 'شيش طاووق', 'بيكاتا لحمة بصوص المشروم', 'فراخ بصوص الليمون', 'بيف استروجناف', 'محاشي مشكلة', 'أرز بسمتي', 'استيشن باستا', 'وايت صوص', 'ريد صوص'] },
      { name: 'الحلويات', items: ['أم علي', 'كريم كراميل', 'جاتوه سواريه', 'شرقي مشكل', 'بروفترول'] },
      { name: 'المقبلات', items: ['سمبوسك جبنة', 'سمبوسك لحمة', 'كبيبة', 'ورق عنب', 'سبرنج رول'] },
      { name: 'السلطات', items: ['فتوش', 'طحينة', 'بابا غنوج', 'بنجر', 'كول سلو', 'بطاطس مايونيز', 'سلطة خضراء', 'جريك سالاد', 'تبولة', 'مخلل'] },
      { name: 'المخبوزات', items: ['عيش شامي', 'عيش بلدي', 'عيش باتيبان'] }
    ]
  },
  {
    id: 'ob-3',
    title: 'اوبن بوفيه (3)',
    price: 700,
    perPerson: true,
    minPeople: 50,
    sections: [
      { name: 'الطبق الرئيسي', items: ['استيشن ديك رومي لكل 50 فرد', 'استيشن فخدة ضاني لكل 50 فرد', 'كفتة مشوية', 'شيش طاووق', 'بيكاتا لحمة بصوص المشروم', 'فراخ بصوص الليمون', 'بيف استروجناف', 'تشيكن كوردن بلو', 'جلاش باللحمة', 'محاشي مشكلة', 'أرز بسمتي', 'استيشن باستا', 'وايت صوص', 'ريد صوص'] },
      { name: 'الحلويات', items: ['أم علي', 'كريم كراميل', 'جاتوه سواريه', 'حلو شرقي مشكل', 'بروفترول', 'فروت سالاد'] },
      { name: 'المقبلات', items: ['سمبوسك لحمة', 'سمبوسك جبنة', 'كبيبة', 'ورق عنب', 'سبرنج رول', 'كبات كنافة بالجمبري'] },
      { name: 'السلطات', items: ['فتوش', 'طحينة', 'بابا غنوج', 'بنجر', 'كول سلو', 'بطاطس مايونيز', 'سلطة خضراء', 'جريك سالاد', 'تبولة', 'مخلل'] },
      { name: 'المخبوزات', items: ['عيش شامي', 'عيش بلدي', 'عيش باتيبان'] }
    ]
  },
  {
    id: 'ob-4',
    title: 'اوبن بوفيه (4)',
    price: 800,
    perPerson: true,
    minPeople: 50,
    sections: [
      { name: 'الطبق الرئيسي', items: ['استيشن فخدة بتلو لكل 100 فرد', 'استيشن ديك رومي لكل 50 فرد', 'استيشن فخدة ضاني لكل 50 فرد', 'كفتة مشوية', 'شيش طاووق', 'بيكاتا لحمة بصوص المشروم', 'فراخ بصوص الليمون', 'بيف استروجناف', 'تشيكن كوردن بلو', 'جمبري بروفنسال', 'جلاش باللحمة', 'محاشي مشكلة', 'أرز بسمتي', 'استيشن باستا', 'وايت صوص', 'ريد صوص'] },
      { name: 'الحلويات', items: ['أم علي', 'كريم كراميل', 'جاتوه سواريه', 'حلو شرقي مشكل', 'بروفترول', 'فروت سالاد'] },
      { name: 'المقبلات', items: ['سمبوسك لحمة', 'سمبوسك جبنة', 'كبيبة', 'ورق عنب', 'سبرنج رول', 'جمبري كوكتيل'] },
      { name: 'السلطات', items: ['فتوش', 'طحينة', 'بابا غنوج', 'بنجر', 'كول سلو', 'بطاطس مايونيز', 'سلطة خضراء', 'جريك سالاد', 'تبولة', 'مخلل'] },
      { name: 'المخبوزات', items: ['عيش شامي', 'عيش بلدي', 'عيش باتيبان'] }
    ]
  },
  {
    id: 'ob-5',
    title: 'اوبن بوفيه (5)',
    price: 800,
    perPerson: true,
    minPeople: 50,
    sections: [
      { name: 'الطبق الرئيسي', items: ['استيشن فخدة بتلو لكل 100 فرد', 'استيشن ديك رومي لكل 50 فرد', 'استيشن فخدة ضاني لكل 50 فرد', 'كفتة مشوية', 'شيش طاووق', 'بيكاتا لحمة بصوص المشروم', 'فراخ بصوص الليمون', 'بيف استروجناف', 'تشيكن كوردن بلو', 'جمبري بروفنسال', 'جمبري بترافل', 'جلاش باللحمة', 'محاشي مشكلة', 'أرز بسمتي', 'استيشن باستا', 'وايت صوص', 'ريد صوص'] },
      { name: 'الحلويات', items: ['أم علي', 'كريم كراميل', 'جاتوه سواريه', 'حلو شرقي مشكل', 'بروفترول', 'فروت سالاد'] },
      { name: 'المقبلات', items: ['سمبوسك لحمة', 'سمبوسك جبنة', 'كبيبة', 'ورق عنب', 'سبرنج رول', 'جمبري كوكتيل', 'كبات كنافة بالجمبري'] },
      { name: 'السلطات', items: ['فتوش', 'طحينة', 'بابا غنوج', 'بنجر', 'كول سلو', 'بطاطس مايونيز', 'سلطة خضراء', 'جريك سالاد', 'تبولة', 'مخلل'] },
      { name: 'المخبوزات', items: ['عيش شامي', 'عيش بلدي', 'عيش باتيبان'] }
    ]
  }
];

export const SET_MENUS: MenuPackage[] = [
  {
    id: 'sm-1',
    title: 'سيت منيو (1)',
    price: 270,
    perPerson: true,
    sections: [
      { 
        name: 'الطبق الرئيسي', 
        items: [
          '3 شيش طاووق',
          '2 كفتة مشوي',
          'أرز بسمتي',
          'خضار سوتيه',
          '1 سمبوسك (لحمة أو جبنة)',
          '1 كبيبة'
        ] 
      },
      { 
        name: 'السلطات', 
        items: ['كول سلو', 'طحينة', 'بطاطس مايونيز', 'مخلل'] 
      },
      { 
        name: 'الحلويات', 
        items: ['2 قطعة جاتوه سواريه', '2 قطعة حلويات شرقي'] 
      },
      { 
        name: 'المخبوزات', 
        items: ['سبت عيش لكل ترابيزة'] 
      },
      {
        name: 'ملاحظات',
        items: [
          'الأسعار قد تختلف حسب عدد الأفراد',
          'يتم إضافة تكلفة النقل حسب المكان'
        ]
      }
    ]
  },
  {
    id: 'sm-2',
    title: 'سيت منيو (2)',
    price: 300,
    perPerson: true,
    sections: [
      { 
        name: 'الطبق الرئيسي', 
        items: [
          '3 شيش طاووق',
          'بيكاتا لحمة بصوص الماشروم',
          '2 كفتة مشوي',
          'أرز بسمتي',
          'خضار سوتيه',
          '1 سمبوسك (لحمة أو جبنة)',
          '1 كبيبة'
        ] 
      },
      { 
        name: 'السلطات', 
        items: ['كول سلو', 'طحينة', 'بطاطس مايونيز', 'مخلل'] 
      },
      { 
        name: 'الحلويات', 
        items: ['2 قطعة جاتوه سواريه', '2 قطعة حلويات شرقي'] 
      },
      { 
        name: 'المخبوزات', 
        items: ['سبت عيش لكل ترابيزة'] 
      }
    ]
  },
  {
    id: 'sm-3',
    title: 'سيت منيو (3) - سي فود',
    price: 400,
    perPerson: true,
    sections: [
      { 
        name: 'الطبق الرئيسي', 
        items: [
          'أرز صيادية',
          '2 قطعة جمبري بتر فلاي',
          'كاليماري مقلي',
          'فيليه سمك مشوي'
        ] 
      },
      { 
        name: 'السلطات', 
        items: ['سلطة تونة', 'سلطة بلدي', 'طحينة'] 
      },
      { 
        name: 'الحلويات', 
        items: ['تارت ليمون'] 
      },
      { 
        name: 'المخبوزات', 
        items: ['سبت عيش لكل ترابيزة'] 
      }
    ]
  }
];

export const HOT_ADDONS = [
  { label: 'سيرفيس محاشي مشكلة (لكل 10 أفراد)', price: 200 },
  { label: '2 قطعة سبرنج رول', price: 250 },
  { label: '20 قطعة كبيبة', price: 300 },
  { label: '20 قطعة سمبوسك', price: 250 },
  { label: 'سيرفيس ورق عنب (لكل 10 أفراد)', price: 200 }
];

export const PER_PERSON_ADDONS = [
  { label: 'إضافة صنف حلو إضافي', price: 35 },
  { label: 'إضافة صنف سلطة إضافي', price: 20 },
  { label: 'إضافة صنف مقبلات إضافي', price: 25 },
  { label: 'إضافة صنف رئيسي إضافي', price: 60 }
];

export const STATIONS_MENU: MenuPackage[] = [
  {
    id: 'st-1',
    title: 'استيشن فخدة بتلو',
    price: 0,
    note: 'السعر: حسب سعر اليوم',
    sections: [
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-2',
    title: 'استيشن خروف',
    price: 0,
    note: 'السعر: حسب سعر اليوم',
    sections: [
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-3',
    title: 'استيشن فخدة ضاني',
    price: 0,
    note: 'السعر: حسب سعر اليوم',
    sections: [
      { name: 'يشمل', items: ['أرز بالخلطة', 'مكسرات'] },
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-4',
    title: 'استيشن ديك رومي',
    price: 5000,
    note: 'الوزن: 12 كيلو',
    sections: [
      { name: 'يشمل', items: ['أرز بالخلطة', 'مكسرات'] },
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-5',
    title: 'استيشن باستا',
    price: 6000,
    note: 'يكفي 100 فرد',
    sections: [
      { name: 'الصوصات', items: ['وايت صوص', 'ريد صوص'] },
      { name: 'الإضافات', items: ['زيتون', 'فلفل', 'جبنة موزاريلا'] },
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-6',
    title: 'استيشن شاورما فراخ',
    price: 9000,
    note: 'يكفي 100 فرد',
    sections: [
      { name: 'يشمل', items: ['فراخ', 'عيش كايزر أو سوري', 'خيار مخلل', 'ثومية'] },
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-7',
    title: 'استيشن برجر',
    price: 10000,
    note: 'يكفي 100 فرد - 100 قطعة برجر',
    sections: [
      { name: 'يشمل', items: ['عيش كايزر', 'جبنة شيدر', 'خضار', 'صوص كاتشب'] },
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-8',
    title: 'استيشن شاورما لحمة',
    price: 11000,
    note: 'يكفي 100 فرد',
    sections: [
      { name: 'يشمل', items: ['لحمة', 'عيش كايزر أو سوري', 'خيار مخلل', 'ثومية'] },
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  },
  {
    id: 'st-9',
    title: 'استيشن مشويات على الفحم',
    price: 20000,
    note: 'يكفي 100 فرد',
    sections: [
      { name: 'يشمل', items: ['كفتة', 'شيش طاووق', 'حواوشي', 'فرنش فرايز'] },
      { name: 'الصوصات', items: ['طحينة', 'ثومية', 'كاتشب'] },
      { name: 'ملاحظات', items: ['تشمل الشيف + إيجار المعدات', 'غير شامل تكلفة النقل'] }
    ]
  }
];

export const HIGH_TEA: MenuPackage[] = [
  {
    id: 'ht-1',
    title: 'هاي تي (High Tea)',
    price: 50,
    perPerson: true,
    sections: [
      { 
        name: 'الساندوتشات (مقاس 18 سم)', 
        items: [
          'ساندوتش كفتة',
          'ساندوتش شيش',
          'ساندوتش برجر',
          'ساندوتش شاورما فراخ',
          'ساندوتش شاورما لحمة',
          'ساندوتش فاهيتا فراخ',
          'ساندوتش فراخ بانيه',
          'ساندوتش لحمة باردة (70 جنيه)'
        ] 
      },
      { 
        name: 'ملاحظات', 
        items: [
          'جميع الساندوتشات تقدم مع كاتشب ومايونيز',
          'يتم إضافة تكلفة النقل حسب المكان'
        ] 
      }
    ]
  }
];

export const COFFEE_CORNER: MenuPackage[] = [
  {
    id: 'cc-1',
    title: 'Standard Coffee Corner',
    price: 4500,
    sections: [
      { name: 'المشروبات الساخنة', items: ['قهوة تركي', 'نسكافيه بلاك/3ف1', 'شاي أنواع', 'هوت شوكليت'] }
    ]
  }
];

export const DESSERTS: MenuPackage[] = [
  {
    id: 'ds-1',
    title: 'ركن الحلويات الملكي',
    price: 6500,
    sections: [
      { name: 'شرقي', items: ['بسبوسة', 'كنافة', 'بقلاوة'] },
      { name: 'غربي', items: ['تشيز كيك', 'موس شوكولاتة', 'تارت فواكه'] }
    ]
  }
];

export const MEALS: MenuPackage[] = [
  {
    id: 'ml-1',
    title: 'وجبة داود باشا',
    price: 100,
    perPerson: true,
    sections: [
      { name: 'المكونات', items: ['داود باشا', 'أرز بالشعرية', 'خضار مشكل', 'بطاطس', 'سلطة', 'عيش'] }
    ]
  },
  {
    id: 'ml-2',
    title: 'وجبة كباب حلة',
    price: 100,
    perPerson: true,
    sections: [
      { name: 'المكونات', items: ['كباب حلة', 'أرز بالشعرية', 'خضار مشكل', 'بطاطس', 'سلطة', 'عيش'] }
    ]
  },
  {
    id: 'ml-3',
    title: 'وجبة ربع فراخ',
    price: 100,
    perPerson: true,
    sections: [
      { name: 'المكونات', items: ['ربع فرخة', 'أرز بالشوربة', 'خضار مشكل', 'سلطة', 'عيش'] }
    ]
  },
  {
    id: 'ml-4',
    title: 'وجبة سجق فراخ',
    price: 100,
    perPerson: true,
    sections: [
      { name: 'المكونات', items: ['سجق فراخ', 'مكرونة محمرة', 'بطاطس', 'سلطة', 'عيش'] }
    ]
  },
  {
    id: 'ml-5',
    title: 'وجبة كبدة إسكندراني',
    price: 100,
    perPerson: true,
    sections: [
      { name: 'المكونات', items: ['كبدة إسكندراني', 'مكرونة محمرة', 'بطاطس', 'سلطة', 'عيش'] }
    ]
  },
  {
    id: 'ml-6',
    title: 'وجبة فراخ بانيه',
    price: 100,
    perPerson: true,
    sections: [
      { name: 'المكونات', items: ['فراخ بانيه', 'مكرونة بشاميل', 'بطاطس', 'سلطة', 'عيش'] }
    ]
  }
];

export const ADDONS: MenuPackage[] = [
  {
    id: 'ad-1',
    title: 'سيفن دش (تكفي 25 فرد)',
    price: 0,
    sections: [
      { name: 'سيفن دش', items: ['ورق عنب — 600 ج', 'لحمة بالبصل — 2000 ج', 'كفتة داود باشا — 2000 ج', 'فاهيتا فراخ — 1500 ج', 'فراخ بانيه — 2000 ج'] }
    ]
  },
  {
    id: 'ad-2',
    title: 'مقبلات (تكفي 25 فرد)',
    price: 0,
    sections: [
      { name: 'مقبلات', items: ['كبيبة — 400 ج', 'سمبوسك جبنة — 300 ج', 'سمبوسك لحمة — 350 ج', 'سبرنج رول — 350 ج'] }
    ]
  },
  {
    id: 'ad-3',
    title: 'أطباق رئيسية إضافية (تكفي 25 فرد)',
    price: 0,
    sections: [
      { name: 'سيفن دش', items: ['أم علي — 1500 ج', 'بيف استرجانوف — 2500 ج', 'كوردن بلو — 2500 ج', 'شيش طاووق — 2000 ج', 'كفتة — 2000 ج', 'بيكاتا لحمة — 2500 ج', 'فراخ صوص ليمون — 2200 ج', 'جمبري بروفنسال — 3000 ج', 'جمبري بتر فلاي — 3500 ج'] }
    ]
  },
  {
    id: 'ad-4',
    title: 'أطباق جانبية (تكفي 25 فرد)',
    price: 0,
    sections: [
      { name: 'سيفن دش', items: ['جلاش باللحمة — 750 ج', 'مكرونة بشاميل — 750 ج', 'لازانيا — 750 ج', 'محاشي مشكل — 500 ج', 'بطاطس جراتان — 500 ج', 'خضار سوتيه — 500 ج', 'بطاطس ويجز — 500 ج', 'بطاطس بوريه — 500 ج'] }
    ]
  },
  {
    id: 'ad-5',
    title: 'حلويات (تكفي 100 فرد)',
    price: 0,
    sections: [
      { name: 'حلويات', items: ['نافورة شوكولاتة مع فواكه ومارشميلو — 2500 ج', 'حلويات شرقي — 2500 ج', 'جاتوه سواريه — 2500 ج'] }
    ]
  },
  {
    id: 'ad-6',
    title: 'مشروبات', 
    price: 0,
    sections: [
      { name: 'مشروبات', items: ['مشروب سوفت — 20 ج', 'مياه صغيرة — 10 ج', 'مياه كبيرة — 20 ج'] },
      { name: 'عصائر فريش', items: ['جوافة — 35 ج', 'مانجو — 40 ج', 'فراولة — 40 ج', 'برتقال — 40 ج'] },
      { name: 'مشروبات ساخنة', items: ['شاي — 20 ج', 'نسكافيه — 30 ج', 'قهوة تركي — 30 ج'] }
    ]
  },
  {
    id: 'ad-7',
    title: 'طاقم الخدمة',
    price: 0,
    sections: [
      { name: 'خدمة', items: ['ويترز شباب — 600 ج', 'ويترز بنات — 700 ج', 'باريستا — 800 ج', 'شيف — 1000 ج'] }
    ]
  }
];

export const FINGER_FOOD: MenuPackage[] = [
  {
    id: 'ff-1',
    title: 'فينجر فود (1)',
    price: 230,
    perPerson: true,
    sections: [
      { name: 'يشمل', items: ['ميني شاورما فراخ', 'ميني ساندوتش برجر', 'ميني ساندوتش شيش', 'ميني ساندوتش كفتة', 'سمبوسك (جبنة / لحمة)', 'ورق عنب', 'كول سلو – طحينة – ثومية'] },
      { name: 'الحلو', items: ['حلويات شرقي', 'جاتوه سواريه'] }
    ]
  },
  {
    id: 'ff-2',
    title: 'فينجر فود (2)',
    price: 270,
    perPerson: true,
    sections: [
      { name: 'يشمل', items: ['ميني كلاب ساندوتش', 'سبرنج رول جبنة مشكلة', 'سبرنج رول هوت دوج', 'ميني ساندوتش شاورما فراخ', 'ميني ساندوتش شاورما لحمة', 'كبيبة', 'سمبوسك (جبنة / لحمة)', 'ورق عنب', 'كول سلو – طحينة – ثومية'] },
      { name: 'الحلو', items: ['حلويات شرقي', 'جاتوه سواريه'] }
    ]
  }
];

export const SOFT_DRINKS = [
  { name: 'مشروب سوفت', price: 20 },
  { name: 'مياه صغيرة', price: 10 },
  { name: 'مياه كبيرة', price: 20 },
  { name: 'عصير جوافة فريش', price: 35 },
  { name: 'عصير مانجو فريش', price: 40 },
  { name: 'عصير فراولة فريش', price: 40 },
  { name: 'عصير برتقال فريش', price: 35 },
  { name: 'شاي', price: 20 },
  { name: 'نسكافيه', price: 30 },
  { name: 'قهوة تركي', price: 30 }
];

export const SERVICE_COSTS = [
  { label: 'ويترز شباب', price: '600 LE' },
  { label: 'ويترز بنات', price: '700 LE' },
  { label: 'شيف', price: '1000 LE' },
  { label: 'باريستا', price: '800 LE' },
  { label: 'ROYAL Setup', price: '3500 LE' },
  { label: 'LIGHT ROYAL Setup', price: '2500 LE' },
  { label: 'فرد عادي سيلفر', price: '20 LE' },
  { label: 'فرد عادي جولد', price: '30 LE' },
  { label: 'فرد كامل سيلفر', price: '50 LE' },
  { label: 'فرد كامل جولد', price: '70 LE' },
  { label: 'النقل', price: 'حسب المكان' }
];

// --- NEW EQUIPMENT DATA ---

const HOT_IMAGES = [
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562344/hot00010_nl0idg.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562347/hot00011_qiyegl.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562348/hot00012_oxsz8s.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562349/hot00013_wf1z5k.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562352/hot00014_f19i24.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562352/hot00015_x5v3hb.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562356/hot00016_z1xqje.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562356/hot00017_ejtj34.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562360/hot00018_em5slf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562361/hot00019_ubuy7g.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562364/hot00020_w6kaca.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562365/hot00021_dcmruc.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562369/hot00022_v39m3g.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562373/hot00023_b2l6ec.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562374/hot00024_loovkh.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562374/hot00025_kpond0.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562380/hot00026_bh9pui.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562381/hot00027_yk8nje.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562382/hot00028_ux0obc.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562389/hot00029_cjrzka.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562390/hot00030_hqtn5i.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562396/hot00031_qniooi.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562396/hot00032_maffya.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562400/hot00033_yk0alc.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562409/hot00034_oohaup.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562409/hot00035_cuuaej.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562412/hot00036_zjqhu1.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562418/hot00037_tlwitr.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562419/hot00038_mvhs7g.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562419/hot00039_ataun8.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562428/hot00040_hpxivf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562428/hot00041_ehftxl.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562429/hot00042_z97ska.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562438/hot00043_ywk6ju.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562439/hot00044_zmjxlx.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562442/hot00045_l7egjs.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562449/hot00046_hv8mjs.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562449/hot00047_bal9tw.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562453/hot00048_heuf65.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562463/hot00049_glt3br.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562337/hot00004_zwp8xd.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562340/hot00007_abazwf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562340/hot00008_ayxkuf.jpg"
];

const WOOD_IMAGES = [
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563981/wood00001_tpemgf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563981/wood00002_rv6ocf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563981/wood00003_owa892.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563982/wood00004_js6dxf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563981/wood00005_mdlyme.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563985/wood00006_uorkgh.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563988/wood00007_e4juuy.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563989/wood00008_b4v45f.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563989/wood00009_uoilwf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563995/wood00010_cmfl8a.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563996/wood00011_d7gut6.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563996/wood00012_ygkitn.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564002/wood00013_kciehn.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564003/wood00014_bzguyz.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564003/wood00015_pccjvk.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564019/wood00016_ddd0fb.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564019/wood00017_q30kq5.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564020/wood00018_r8eoao.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564020/wood00019_t1wb8z.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564020/wood00020_uav5is.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564033/wood00021_eylwy2.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564075/wood00022_jz3yaa.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564076/wood00023_znsmlq.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564076/wood00024_luap91.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564077/wood00025_tmgint.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564076/wood00026_xfabcm.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564095/wood00027_glw0zj.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564096/wood00028_fubf6u.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564101/wood00029_qs26ui.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564112/wood00030_imwi7o.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564113/wood00031_xuanxv.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564114/wood00032_rfkdx4.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564131/wood00033_rkv67g.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564132/wood00034_zhzlx3.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564132/wood00035_puonzi.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564151/wood00036_sjgdip.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564152/wood00037_hdjq7h.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564160/wood00038_hhuns3.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564176/wood00039_mnv0x2.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564176/wood00040_nwfzlk.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564177/wood00041_sfojo4.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564177/wood00042_xcnkmo.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564201/wood00043_vp43r2.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564202/wood00044_ppwtku.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564202/wood00045_zxssd9.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564223/wood00046_zfkl02.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564223/wood00047_cirhf5.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564224/wood00048_h4chmb.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564244/wood00049_p0qbuq.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564245/wood00050_ht1qww.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564246/wood00051_oswpab.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564266/wood00052_ekwhep.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564266/wood00053_bigdkb.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564267/wood00054_bdyus3.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564267/wood00055_szqdwm.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564292/wood00056_bwibdu.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564293/wood00057_expndw.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564293/wood00058_lh6gkw.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773564294/wood00059_kaaz51.jpg"
];

const COFFEE_IMAGES = [
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567167/coffee00001_snxhuf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567168/coffee00002_wibl7g.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567174/coffee00003_ldyif3.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567178/coffee00004_vgqhoj.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567182/coffee00005_eipppf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567153/coffee00006_df7kjr.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567153/coffee00007_chdoq5.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567156/coffee00008_imgxoe.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567160/coffee00009_efgxvk.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567163/coffee00010_ayoulg.jpg"
];

const TABLE_IMAGES = [
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566934/table00001_pcvysg.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566936/table00002_mlp9tb.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566937/table00003_jpfhpb.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566941/table00004_rszmtr.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566944/table00005_xf8xxb.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566947/table00006_fzjgzc.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566951/table00007_g8t4ud.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566952/table00008_aikqey.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566959/table00009_p9cnja.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566962/table00010_idli2v.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566967/table00011_vzcmq8.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566968/table00012_glnnhr.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566978/table00013_iv2nrt.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566983/table00014_wxhgdn.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566989/table00015_wizy1h.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566991/table00016_ov0jdi.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773566999/table00017_l5jqoi.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567001/table00018_bjct8o.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567010/table00019_rnjh2e.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567012/table00020_e2uoan.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567022/table00021_dwwwnn.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567024/table00022_xwq2ys.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567182/table00023_b14oai.jpg"
];

const HEAVY_IMAGES = [
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567628/hevay00001_qqhm2l.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567632/hevay00002_smsgfu.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567603/hevay00003_sr6dhp.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567604/hevay00004_pc5fec.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773567624/hevay00005_t1j4rk.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562336/hot00001_oxjd6s.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562337/hot00002_ao59pg.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562336/hot00003_uhrb3e.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562339/hot00005_w7tn8u.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562337/hot00006_ob1dwe.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562343/hot00009_w2druy.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562463/hot00050_opqsw0.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562463/hot00051_cdruyc.jpg",
  "https://res.cloudinary.com/du92er3s7/image/upload/f_auto,q_auto/IMG-20260328-WA0001_z36nvm"
];

const generateItems = (prefix: string, count: number, customImages?: string[], itemData?: Record<string, { name?: string; price?: number }>) => {
  return Array.from({ length: count }, (_, i) => {
    const id = `${prefix}-${i + 1}`;
    const data = itemData?.[id];
    return {
      id,
      image: customImages?.[i] || `/images/${id}.jpg`,
      ...data
    };
  });
};

const HOT_ITEM_DATA: Record<string, { name?: string; price?: number }> = {
  'hot-1': { name: 'مدور هيدروليك جولد', price: 300 },
  'hot-2': { name: 'مستطيل هيدروليك جولد', price: 300 },
  'hot-3': { name: 'قفص فضي', price: 275 },
  'hot-4': { name: 'قفص جولد', price: 275 },
  'hot-5': { name: 'مدور 2 هيدروليك جولد', price: 300 },
  'hot-6': { name: 'هيدروليك فضي مستطيل & مدور', price: 300 },
  'hot-7': { name: 'سعودي مدور جولد', price: 275 },
  'hot-8': { name: 'قفص ذهبي', price: 275 },
  'hot-9': { name: 'سعودي مدور جولد', price: 275 },
  'hot-10': { name: 'مستطيل جولد', price: 275 },
  'hot-11': { name: 'هيدروليك مدور فضي', price: 300 },
  'hot-12': { name: 'مستطيل جولد', price: 275 },
  'hot-13': { name: 'سعودي جولد كبير', price: 300 },
  'hot-14': { name: 'مستطيل جولد', price: 275 },
  'hot-15': { name: 'سعودي مدور جولد', price: 275 },
  'hot-16': { name: 'قفص ذهبي', price: 275 },
  'hot-17': { name: 'قفص جولد', price: 275 },
  'hot-18': { name: 'مستطيل سيلفر', price: 200 },
  'hot-19': { name: 'نص كورة', price: 275 },
  'hot-22': { name: 'سعودي مستطيل (صغير 250 - كبير 300)', price: 250 },
  'hot-23': { name: 'سيلفر مدور', price: 250 },
  'hot-24': { name: 'سعودي صغير', price: 250 },
  'hot-25': { name: 'هيدروليك سيلفر مستطيل', price: 300 },
  'hot-28': { name: 'عثماني مدور', price: 250 },
  'hot-30': { name: 'مغربي جولد', price: 275 },
  'hot-31': { name: 'مغربي بعصفورة جولد', price: 250 },
  'hot-32': { name: 'جولد معلق (وسط 275 - كبير 300)', price: 275 },
  'hot-33': { name: 'سعودي جولد كبير', price: 300 },
  'hot-34': { name: 'سخان شوربة جولد أو سيلفر', price: 300 },
  'hot-35': { name: 'سخان شوربة وصوص جولد', price: 350 },
  'hot-36': { name: 'شوايه سفره جولد أو سيلفر', price: 100 },
  'hot-37': { name: 'سيرفيس جولد', price: 150 },
  'hot-38': { name: 'سخان شوربة وصوص مزدوج سيلفر', price: 250 },
  'hot-39': { name: 'سيرفيس سفرة وسط (مستطيل - بيضاوي - مدور)', price: 150 },
  'hot-40': { name: 'استاند مقبلات نحاسي', price: 150 },
  'hot-41': { name: 'سفنديش متر ونص للخروف الكامل', price: 600 },
  'hot-42': { name: 'سفنديش خروف وسط', price: 400 },
  'hot-43': { name: 'سفنديش رومي جولد', price: 350 },
};

const COFFEE_ITEM_DATA: Record<string, { name?: string; price?: number }> = {
  'coffee-1': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-2': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-3': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-4': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-5': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-6': { name: 'ديسبنسر عصائر 5 لتر', price: 350 },
  'coffee-7': { name: 'ديسبنسر عصائر 3 لتر', price: 250 },
  'coffee-8': { name: 'فنجان شاي+ اندر لاين 15\nفنجان قهوه+ اندر لاين 10' },
  'coffee-9': { name: 'رماله قهوة تركي 500\nكوفي كورنر كامل لاي عدد\nمناسب لجميع المناسبات و الفعاليات' },
  'coffee-10': { name: 'كاتيل كبير 500\nوسط 400\nصغير 300\nقهوة تركي 250' },
};
const TABLE_ITEM_DATA: Record<string, { name?: string; price?: number }> = {
  'table-1': { name: 'كفر جولد 10ق حسب الاختيار', price: 80 },
  'table-2': { name: 'كاس فينتاج جميع الالوان' },
  'table-3': { name: 'كاس تركي جميع الالوان' },
  'table-4': { name: 'القطعة خارج الكفر (سيلفر)', price: 10 },
  'table-5': { name: 'كفر سيلفر 10ق حسب الاختيار', price: 40 },
  'table-6': { name: 'القطعة خارج الكفر جولد', price: 20 },
  'table-7': {},
};
const tableItems = generateItems('table', 23, TABLE_IMAGES, TABLE_ITEM_DATA);
const WOOD_ITEM_DATA: Record<string, { name?: string; price?: number }> = {
  'wood-2': { name: 'استاند سلطات فردي+ بولة اكليرك غويطة', price: 100 },
  'wood-3': { name: 'استاند سلطات 2 بولة', price: 150 },
  'wood-4': { name: 'استاند سلطات 3 بولة', price: 200 },
  'wood-5': { name: 'استاند فردي جولد + اي شكل بولة', price: 100 },
  'wood-6': { name: 'سرافيس وبولات مقبلات وسلطات', price: 50 },
  'wood-7': { name: 'استاند سلطات ومقبلات جولد 2 بولة صيني ابيض', price: 200 },
  'wood-8': { price: 100 },
  'wood-9': { price: 100 },
  'wood-10': { price: 100 },
  'wood-11': { name: 'استاند سلطات 3 بولات', price: 200 },
  'wood-12': { name: 'استاند سلطات+ 3 بولة جولد استانلس', price: 250 },
  'wood-13': { name: 'استاند سلطات 3 بولة', price: 200 },
  'wood-14': { name: 'بولة سلطة جولد', price: 50 },
  'wood-15': { name: 'استاند سلطات 2 دور', price: 100 },
  'wood-16': { name: 'ورق شجر جولد للمقبلات', price: 50 },
  'wood-17': { name: 'استاند 2 دور', price: 100 },
  'wood-18': { price: 100 },
  'wood-19': { price: 150 },
  'wood-20': { price: 100 },
  'wood-21': { name: 'قفص جولد', price: 200 },
  'wood-22': { name: 'استاند جولد كبير 3 دور', price: 250 },
  'wood-23': { price: 200 },
  'wood-24': { price: 150 },
  'wood-25': { name: 'استاند راوند جولد 3 مستويات', price: 200 },
  'wood-26': { name: 'راوند جولد سداسي', price: 250 },
  'wood-27': { price: 200 },
  'wood-28': { name: 'استاند هرمي 8 رف جولد', price: 500 },
  'wood-29': { name: 'طقم جولد ثلاثي', price: 200 },
  'wood-30': { name: 'سلم أو مدرج (2-3 دور)', price: 200 },
  'wood-31': { name: 'استاند جولد سداسي', price: 250 },
  'wood-32': { name: 'طقم جولد ثلاثي', price: 200 },
  'wood-33': { name: 'استاند (2-3 دور)', price: 250 },
  'wood-34': { price: 250 },
  'wood-35': { price: 250 },
  'wood-36': { price: 150 },
  'wood-37': { name: 'استاند ابل كامل 3ق جولد', price: 500 },
  'wood-38': { price: 200 },
  'wood-39': { price: 200 },
  'wood-40': { name: 'استاند بوكس ابيض واسود', price: 150 },
  'wood-41': { name: 'استاند بوكس ابيض واسود', price: 150 },
  'wood-42': { name: 'استاند (2-3 دور)', price: 200 },
  'wood-43': { name: 'استاند مكعبات خشبي', price: 150 },
  'wood-44': { name: 'استاند راوند / خاتم صغير', price: 250 },
  'wood-45': { name: 'مضارب خشبية مدور ومستطيل', price: 75 },
  'wood-46': { name: 'مرجيحة كاملة', price: 500 },
  'wood-47': { price: 200 },
  'wood-48': { price: 200 },
  'wood-49': { price: 150 },
  'wood-50': { name: 'مضارب خشبية مدور ومستطيل', price: 75 },
  'wood-51': { price: 100 },
  'wood-52': { price: 200 },
  'wood-53': { name: 'مدرج ثلاثي', price: 200 },
  'wood-54': { name: 'طقم ثلاثي تريهات', price: 200 },
  'wood-55': { name: 'خشبي عامودي 4 رف', price: 150 },
  'wood-56': { name: 'مدرج رباعي خشبي', price: 250 },
  'wood-57': { name: 'مدرج رباعي خشبي', price: 250 },
  'wood-58': { name: 'مدرج بثلاث شرائح جولد أو أكريليك', price: 200 },
  'wood-59': { name: 'طقم خشبي راوند ثلاثي', price: 200 },
};
const HEAVY_ITEM_DATA: Record<string, { name?: string; price?: number }> = {
  'heavy-1': { name: 'كارفن جولد مستطيل', price: 600 },
  'heavy-2': { name: 'الهوت كابن الإيطالي: سعة 44 وعاء سفنديش / 250 وجبة، 2 باب، هيتر سفلي وخلفي، بخار اختياري، مجهز للمطاعم والفنادق والمؤتمرات.', price: 2000 },
  'heavy-3': { name: 'الهوت كابن الإيطالي: سعة 44 وعاء سفنديش / 250 وجبة، 2 باب، هيتر سفلي وخلفي، بخار اختياري، مجهز للمطاعم والفنادق والمؤتمرات.', price: 2000 },
  'heavy-4': { name: 'بوتاجاز سطحي تاتش: للايف باستا استيشن (1 عين 250 / 2 عين 500)', price: 250 },
  'heavy-6': { name: 'كارفن سيلفر 2 سبوت', price: 400 },
  'heavy-7': { name: 'كارفن سيلفر 2 عمود', price: 400 },
  'heavy-8': { name: 'كارفن سيلفر', price: 600 },
  'heavy-9': { name: 'كارفن سيلفر 2سبون مستطيل', price: 500 },
  'heavy-10': { name: 'كارفن جولد مستطيل 2 سبوت', price: 600 },
  'heavy-11': { name: 'كارفن سيلفر', price: 400 },
  'heavy-12': { name: 'كارفن جولد 1 سبوت', price: 350 },
  'heavy-13': { name: 'كارفن جولد 1 سبوت 350\nكارفن جولد 2 سبوت 450' },
  'heavy-14': { name: 'كرسي اكس 30\nترابيزة 300\nطقم كامل 600\nالسعر يختلف حسب العدد' },
};

const woodItems = generateItems('wood', 59, WOOD_IMAGES, WOOD_ITEM_DATA);
const woodIndices = [26, 29, 35, 39, 40, 42, 44, 45, 49, 52, 53, 54, 55, 56, 58];
const woodSectionItems = woodIndices.map(i => woodItems[i]);
const saladSectionItems = woodItems.filter((_, i) => !woodIndices.includes(i));

const heavyItems = generateItems('heavy', 14, HEAVY_IMAGES, HEAVY_ITEM_DATA);

const hotItems = generateItems('hot', 43, HOT_IMAGES, HOT_ITEM_DATA);

export const EQUIPMENT_DATA: EquipmentCategory[] = [
  {
    id: 'hot-serving',
    name: 'معدات تقديم السخن',
    description: 'تشكيلة فاخرة من معدات تقديم الأطعمة الساخنة',
    icon: '🔥',
    items: hotItems.filter(item => !['hot-19', 'hot-21', 'hot-26', 'hot-27', 'hot-29', 'hot-40'].includes(item.id))
  },
  {
    id: 'coffee-arabic',
    name: 'الكوفي كورنر والقهوة العربي',
    description: 'أدوات مائدة وكوفي كورنر بتصاميم ملكية',
    icon: '☕',
    items: generateItems('coffee', 10, COFFEE_IMAGES, COFFEE_ITEM_DATA)
  },
  {
    id: 'dining-hospitality',
    name: 'معدات السفرة والضيافة',
    description: 'أدوات مائدة وضيافة بتصاميم ملكية',
    icon: '🍽️',
    sections: [
      {
        title: "كوليكشن كفرات السفرة (جولد & سيلفر)",
        items: tableItems.slice(0, 6)
      },
      {
        title: "باقة راقية من الجيست نابكنز جميع الألوان والدرجات\n\nواجمل كوليكشن للشوبليت ترضي جميع الاذواق\nجولد اكتر من شكل & كريستال & خوص\n\nواجمل تصميمات الرينج جولد / سيلفر / خوص",
        items: tableItems.slice(6)
      }
    ]
  },
  {
    id: 'salads-wood',
    name: 'معدات تقديم السلطات والخشبيات',
    description: 'تقديم عصري للسلطات والمقبلات بلمسات خشبية',
    icon: '🥗',
    sections: [
      {
        items: [...saladSectionItems, hotItems.find(i => i.id === 'hot-40')].filter(Boolean) as EquipmentItem[]
      },
      {
        title: "الاخشاب",
        items: woodSectionItems
      }
    ]
  },
  {
    id: 'heavy-hot',
    name: 'معدات تقيلة وتسخين',
    description: 'معدات الخدمة الشاقة والولائم الكبيرة',
    icon: '🍖',
    sections: [
      {
        items: [heavyItems[1], heavyItems[2], heavyItems[3], heavyItems[4], heavyItems[13]]
      },
      {
        title: "كوليكشن الكارفن",
        items: [heavyItems[0], ...heavyItems.slice(5, 13)]
      }
    ]
  },
  {
    id: 'chairs-tables',
    name: 'الكراسي والتربيزات',
    description: 'تشكيلة متنوعة من الكراسي والتربيزات لجميع المناسبات',
    icon: '🪑',
    items: [
      { id: 'ct-1', name: 'كرسي نابليون جولد', price: 50, image: 'https://picsum.photos/seed/gold-chair/800/600' },
      { id: 'ct-2', name: 'كرسي نابليون سيلفر', price: 45, image: 'https://picsum.photos/seed/silver-chair/800/600' },
      { id: 'ct-3', name: 'كرسي فينيكس شفاف', price: 60, image: 'https://picsum.photos/seed/clear-chair/800/600' },
      { id: 'ct-4', name: 'تربيزة مدورة (10 أفراد)', price: 300, image: 'https://picsum.photos/seed/round-table/800/600' },
      { id: 'ct-5', name: 'تربيزة مستطيلة بوفيه', price: 250, image: 'https://picsum.photos/seed/rect-table/800/600' },
      { id: 'ct-6', name: 'تربيزة كوكتيل مضيئة', price: 350, image: 'https://picsum.photos/seed/cocktail-table/800/600' },
      { id: 'ct-7', name: 'كنبة عثماني', price: 500, image: 'https://picsum.photos/seed/ottoman/800/600' }
    ]
  }
];
