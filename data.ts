
import { MenuPackage, EquipmentItem, EquipmentCategory, EquipmentOption, EquipmentSection } from './types';

// ... (KEEPING OPEN_BUFFET, SET_MENUS, HIGH_TEA, COFFEE_CORNER, DESSERTS as they are)
export const BEVERAGES_MENU: MenuPackage[] = [
  {
    id: 'bev-1',
    title: 'باكدج المشروبات الكلاسيك',
    price: 80,
    perPerson: true,
    minPeople: 25,
    sections: [
      { name: 'المشروبات الساخنة', items: ['شاي', 'شاي اخضر', 'نسكافيه', 'ينسون', 'نعناع', 'كركديه'] },
      { name: 'المشروبات الباردة', items: ['مياه معدنية صغيرة'] },
      { name: 'ملاحظات', items: ['شامل جميع الخامات والمعدات وطاقم الخدمة'] }
    ]
  },
  {
    id: 'bev-2',
    title: 'باكدج المشروبات المميزة (Premium)',
    price: 150,
    perPerson: true,
    minPeople: 25,
    isRecommended: true,
    sections: [
      { name: 'المشروبات الساخنة', items: ['شاي', 'شاي اخضر', 'قهوة تركي', 'نسكافيه', 'ينسون', 'نعناع', 'كركديه'] },
      { name: 'المشروبات الباردة', items: ['كانز (بيبسي/سيفن)', 'مياه معدنية صغيرة'] },
      { name: 'العصائر الفريش (اختيار نوعين)', items: ['مانجو', 'فراولة', 'جوافة', 'برتقال'] },
      { name: 'ملاحظات', items: ['شامل جميع الخامات والمعدات وطاقم الخدمة'] }
    ]
  },
  {
    id: 'bev-3',
    title: 'باكدج المشروبات الرويال (Royal)',
    price: 200,
    perPerson: true,
    minPeople: 25,
    sections: [
      { name: 'المشروبات الساخنة', items: ['جميع المشروبات الساخنة (شاي، قهوة، نسكافيه، كابتشينو، إلخ)'] },
      { name: 'المشروبات الباردة', items: ['كانز متنوع', 'مياه معدنية'] },
      { name: 'العصائر الفريش', items: ['جميع أنواع العصائر الفريش المتاحة'] },
      { name: 'ركن الموهيتو', items: ['موهيتو كلاسيك', 'موهيتو نكهات (رمان، بلو بيري، إلخ)'] },
      { name: 'ملاحظات', items: ['شامل جميع الخامات والمعدات وطاقم الخدمة'] }
    ]
  },
  {
    id: 'bev-4',
    title: 'باكدج الضيافة العربية الفاخرة',
    price: 250,
    perPerson: true,
    minPeople: 25,
    sections: [
      { name: 'الركن العربي', items: ['قهوة عربي بالهيل', 'تمر فاخر محشو مكسرات وشوكولاتة', 'شاي كرك'] },
      { name: 'المشروبات الساخنة والباردة', items: ['جميع المشروبات الساخنة', 'جميع العصائر الفريش', 'مشروبات سوفت متنوعة', 'مياه معدنية'] },
      { name: 'ركن الموهيتو', items: ['تشكيلة كاملة من الموهيتو'] },
      { name: 'ملاحظات', items: ['شامل جميع الخامات والمعدات وطاقم الخدمة بزي رسمي'] }
    ]
  }
];

export const BEVERAGES_CATEGORIES = [
  {
    name: 'مشروبات سوفت وموهيتو',
    items: [
      { name: 'مياه صغيرة', price: 10 },
      { name: 'مياه كبيرة', price: 20 },
      { name: 'كانز بيبسي/سيفن', price: 20 },
      { name: 'موهيتو نعناع كلاسيك', price: 80 },
      { name: 'موهيتو نعناع وليمون', price: 100 },
      { name: 'موهيتو رمان', price: 100 },
      { name: 'موهيتو بلو بيري', price: 100 },
      { name: 'موهيتو راسبيري', price: 100 },
    ]
  },
  {
    name: 'عصائر فريش',
    items: [
      { name: 'عصير مانجو فريش', price: 40 },
      { name: 'عصير فراولة فريش', price: 40 },
      { name: 'عصير جوافة فريش', price: 35 },
      { name: 'عصير برتقال فريش', price: 35 },
    ]
  },
  {
    name: 'مشروبات ساخنة',
    items: [
      { name: 'شاي', price: 20 },
      { name: 'شاي اخضر', price: 30 },
      { name: 'قهوة تركي', price: 30 },
      { name: 'نسكافيه', price: 30 },
      { name: 'قهوة فرنساوي', price: 40 },
      { name: 'كابتشينو', price: 50 },
      { name: 'ينسون', price: 20 },
      { name: 'كركديه', price: 20 },
      { name: 'نعناع', price: 20 },
    ]
  },
  {
    name: 'ضيافة عربية',
    items: [
      { name: 'شاي كرك', price: 60 },
      { name: 'قهوة عربي', price: 70 }
    ]
  }
];

export const SOFT_DRINKS = BEVERAGES_CATEGORIES.flatMap(cat => cat.items);

export const SERVICE_COSTS = [
  { label: 'ويترز شباب', price: '600 LE' },
  { label: 'ويترز بنات', price: '700 LE' },
  { label: 'شيف', price: '1000 LE' },
  { label: 'باريستا', price: '800 LE' },
  { label: 'شب زي عثماني أو خليجي', price: '800 LE' },
  { label: 'بنت زي خليجي', price: '1000 LE' },
  { label: 'هاوس شباب', price: '700 LE' },
  { label: 'هاوس بنات', price: '800 LE' },
  { label: 'شب Ashr / اشر', price: '800 LE' },
  { label: 'بنت Ashr / اشر', price: '1000 LE' },
  { label: 'بنت منع تصوير', price: '700 LE' },
  { label: 'خدمة منع التصوير (جراب)', price: '40 LE' },
  { label: 'ROYAL Setup', price: '3500 LE' },
  { label: 'LIGHT ROYAL Setup', price: '2500 LE' },
  { label: 'فرد عادي سيلفر', price: '20 LE' },
  { label: 'فرد عادي جولد', price: '30 LE' },
  { label: 'فرد كامل سيلفر', price: '50 LE' },
  { label: 'فرد كامل جولد', price: '70 LE' }
];

// --- NEW EQUIPMENT DATA ---

const HOT_IMAGES = [
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562344/hot00010_nl0idg.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562347/hot00011_qiyegl.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562348/hot00012_oxsz8s.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562349/hot00013_wf1z5k.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562352/hot00014_f19i24.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562352/hot00015_x5v3hb.jpg",
  "", // hot-7 (REMOVED)
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562356/hot00017_ejtj34.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562360/hot00018_em5slf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562361/hot00019_ubuy7g.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562364/hot00020_w6kaca.jpg",
  "", // hot-12 (REMOVED)
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562369/hot00022_v39m3g.jpg",
  "", // hot-14 (REMOVED)
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
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562340/hot00008_ayxkuf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775099953/WhatsApp_Image_2026-04-02_at_5.11.26_AM_2_e84vvf.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775099954/WhatsApp_Image_2026-04-02_at_5.11.26_AM_1_bhqaer.jpg"
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
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775189749/WhatsApp_Image_2026-04-03_at_1.56.01_AM_ljcexz.jpg",
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
  "https://res.cloudinary.com/du92er3s7/image/upload/f_auto,q_auto/IMG-20260328-WA0001_z36nvm",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773562336/hot00003_uhrb3e.jpg"
];

export const WOODEN_X_IMAGES = [
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774998179/WhatsApp_Image_2026-04-01_at_12.28.45_AM_2_ldjh5i.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774998179/WhatsApp_Image_2026-04-01_at_12.28.45_AM_1_p2276y.jpg",
  "https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774998179/WhatsApp_Image_2026-04-01_at_12.28.45_AM_spzzue.jpg"
];

const generateItems = (prefix: string, count: number, customImages?: string[], itemData?: Record<string, { name?: string; price?: number; note?: string; image?: string; options?: EquipmentOption[] }>) => {
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

const HOT_ITEM_DATA: Record<string, { name?: string; price?: number; note?: string; image?: string; options?: EquipmentOption[] }> = {
  'hot-1': { name: 'مدور هيدروليك جولد', price: 300 },
  'hot-2': { name: 'مستطيل هيدروليك جولد', price: 300 },
  'hot-3': { name: 'قفص فضي', price: 250 },
  'hot-4': { name: 'قفص جولد', price: 275 },
  'hot-5': { name: 'مدور 2 هيدروليك جولد', price: 300 },
  'hot-6': { name: 'هيدروليك فضي مستطيل & مدور', price: 300 },
  'hot-8': { name: 'قفص ذهبي', price: 275 },
  'hot-9': { name: 'سعودي مدور جولد', price: 275 },
  'hot-10': { name: 'مستطيل جولد', price: 275 },
  'hot-11': { name: 'هيدروليك مدور فضي', price: 300 },
  'hot-13': { name: 'سعودي جولد كبير', price: 275 },
  'hot-15': { name: 'سعودي مدور جولد', price: 275 },
  'hot-16': { name: 'قفص ذهبي', price: 275 },
  'hot-17': { name: 'قفص جولد', price: 275 },
  'hot-18': { name: 'مستطيل سيلفر', price: 200 },
  'hot-19': { name: 'نص كورة', price: 275 },
  'hot-22': { name: 'سعودي مستطيل (صغير 250 - كبير 300)', price: 250 },
  'hot-23': { name: 'سيلفر مدور', price: 250 },
  'hot-24': { name: 'سعودي صغير', price: 250 },
  'hot-25': { name: 'هيدروليك سيلفر مستطيل', price: 300 },
  'hot-28': { name: 'عثماني مدور', price: 275 },
  'hot-30': { name: 'مغربي جولد', price: 250 },
  'hot-31': { name: 'مغربي بعصفورة جولد', price: 250 },
  'hot-32': { 
    name: 'جولد معلق', 
    options: [
      { id: 'hot-32-mid', name: 'وسط', price: 250 },
      { id: 'hot-32-large', name: 'كبير', price: 275 }
    ]
  },
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
  'hot-44': { name: 'بولة شوربة نحاسي', price: 300 },
  'hot-45': { name: 'بولة شوربة كهرباء سيلفر', price: 250 },
};

const COFFEE_ITEM_DATA: Record<string, { name?: string; price?: number; note?: string; image?: string; options?: EquipmentOption[] }> = {
  'coffee-1': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-2': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-3': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-4': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-5': { name: 'طقم القهوة العربي كامل\nدلة + تمرية +مبخرة + طقم صواني جولد + 6فناجين واستاند', price: 1000 },
  'coffee-6': { name: 'ديسبنسر عصائر 5 لتر', price: 350 },
  'coffee-7': { name: 'ديسبنسر عصائر 3 لتر', price: 250 },
  'coffee-8': { 
    name: 'فناجين الشاي والقهوة',
    options: [
      { id: 'coffee-8-tea', name: 'فنجان شاي+ اندر لاين', price: 15 },
      { id: 'coffee-8-coffee', name: 'فنجان قهوه+ اندر لاين', price: 10 }
    ]
  },
  'coffee-9': { name: 'رماله قهوة تركي 500\nكوفي كورنر كامل لاي عدد\nمناسب لجميع المناسبات و الفعاليات' },
  'coffee-10': { 
    name: 'الكاتيل وماكينات القهوة',
    options: [
      { id: 'coffee-10-large', name: 'كاتيل كبير', price: 500 },
      { id: 'coffee-10-medium', name: 'كاتيل وسط', price: 400 },
      { id: 'coffee-10-small', name: 'كاتيل صغير', price: 300 },
      { id: 'coffee-10-turkish', name: 'قهوة تركي', price: 250 }
    ]
  },
};
const TABLE_ITEM_DATA: Record<string, { name?: string; price?: number; note?: string; image?: string; options?: EquipmentOption[] }> = {
  'table-1': { 
    name: 'كفر كامل جولد', 
    price: 80,
    note: 'شامل اطباق وقطع روستو وديزرت ورينج حسب الاختيار وشوبليت حسب الاختيار ونابكنز وكأس ألوان حسب الاختيار'
  },
  'table-5': { 
    name: 'كفر كامل سيلفر', 
    price: 40,
    note: 'شامل اطباق وقطع روستو وديزرت ورينج حسب الاختيار وشوبليت حسب الاختيار ونابكنز وكأس ألوان حسب الاختيار'
  },
  'table-8': {
    name: 'كفر عادي جولد',
    price: 30,
    note: 'طبق كبير طبق صغير 3 ق شوكة سكينة معلقة'
  },
  'table-9': {
    name: 'كفر عادي سيلفر',
    price: 20,
    note: 'طبق كبير طبق صغير 3 ق شوكة سكينة معلقة',
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775099954/WhatsApp_Image_2026-04-02_at_5.14.52_AM_duchmy.jpg'
  },
  'table-2': { name: 'كاس فينتاج جميع الالوان', price: 25 },
  'table-3': { name: 'كاس تركي جميع الالوان', price: 20 },
  'table-4': {},
  'table-6': {},
  'table-7': {},
};
const tableItems = generateItems('table', 23, TABLE_IMAGES, TABLE_ITEM_DATA);
const WOOD_ITEM_DATA: Record<string, { name?: string; price?: number; note?: string; image?: string; options?: EquipmentOption[] }> = {
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
  'wood-21': { 
    name: 'قفص جولد', 
    options: [
      { id: 'wood-21-opt-3', name: '3 دور', price: 200 },
      { id: 'wood-21-opt-2', name: '2 دور', price: 150 },
      { id: 'wood-21-opt-1', name: '1 دور', price: 100 },
      { id: 'wood-21-opt-full', name: 'طقم كامل', price: 400 }
    ]
  },
  'wood-22': { name: 'استاند جولد كبير 3 دور', price: 250 },
  'wood-23': { price: 200 },
  'wood-24': { price: 150 },
  'wood-25': { name: 'استاند راوند جولد 3 مستويات', price: 200 },
  'wood-26': { name: 'راوند جولد سداسي', price: 250 },
  'wood-27': { price: 200 },
  'wood-28': { name: 'استاند هرمي 8 رف جولد', price: 500 },
  'wood-29': { name: 'طقم جولد ثلاثي', price: 200 },
  'wood-30': { 
    name: 'سلم', 
    options: [
      { id: 'wood-30-opt-2', name: 'سلم 2دور', price: 150 },
      { id: 'wood-30-opt-3', name: '3 دور', price: 200 }
    ]
  },
  'wood-31': { name: 'استاند جولد سداسي', price: 250 },
  'wood-32': { name: 'طقم جولد ثلاثي', price: 200 },
  'wood-33': { 
    name: 'استاند هرمي جولد', 
    options: [
      { id: 'wood-33-opt-2', name: '2 دور', price: 200 },
      { id: 'wood-33-opt-3', name: '3 دور', price: 250 }
    ]
  },
  'wood-34': { price: 250 },
  'wood-35': { price: 250 },
  'wood-36': { price: 150 },
  'wood-37': { name: 'استاند ابل كامل 3ق جولد', price: 500 },
  'wood-38': { price: 200 },
  'wood-39': { price: 200 },
  'wood-40': { name: 'استاند بوكس ابيض واسود', price: 150 },
  'wood-41': { name: 'استاند بوكس ابيض واسود', price: 150 },
  'wood-42': { 
    name: 'استاند جولد درجات', 
    options: [
      { id: 'wood-42-opt-2', name: '2 دور', price: 200 },
      { id: 'wood-42-opt-3', name: '3 دور', price: 250 }
    ]
  },
  'wood-43': { name: 'استاند مكعبات خشبي', price: 150 },
  'wood-44': { name: 'خاتم صغير 3 دور', price: 150 },
  'wood-45': { name: 'مضارب خشبية مدور ومستطيل', price: 75 },
  'wood-46': { name: 'مرجيحة كاملة', price: 500 },
  'wood-47': { price: 200 },
  'wood-48': { price: 200 },
  'wood-49': { price: 150 },
  'wood-50': { name: 'مضارب خشبية مدور ومستطيل', price: 75 },
  'wood-51': { 
    name: 'استاند راوند اطقم ثلاثي', 
    options: [
      { id: 'wood-51-opt-single', name: 'السعر للقطعة', price: 100 },
      { id: 'wood-51-opt-set', name: 'الطقم 3قطع', price: 250 }
    ]
  },
  'wood-52': { price: 200 },
  'wood-53': { name: 'مدرج ثلاثي', price: 200 },
  'wood-54': { name: 'طقم ثلاثي تريهات', price: 200 },
  'wood-55': { name: 'خشبي عامودي 4 رف', price: 250 },
  'wood-56': { name: 'مدرج رباعي خشبي', price: 250 },
  'wood-57': { name: 'مدرج رباعي خشبي', price: 250 },
  'wood-58': { name: 'مدرج بثلاث شرائح جولد أو أكريليك', price: 200 },
  'wood-59': { name: 'طقم خشبي راوند ثلاثي', price: 200 },
  'wood-60': { 
    name: 'تريهات تقديم اسود مدور أو مستطيل', 
    price: 100,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775101742/WhatsApp_Image_2026-04-02_at_5.48.20_AM_qgycvo.jpg'
  },
  'wood-61': { 
    name: 'استاند مستويات 1', 
    price: 400,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775101740/WhatsApp_Image_2026-04-02_at_5.43.46_AM_q7oaqd.jpg'
  },
  'wood-62': { 
    name: 'استاند خشبي دائري 3 دور', 
    price: 250,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775101742/WhatsApp_Image_2026-04-02_at_5.43.47_AM_frh21q.jpg'
  },
  'wood-63': { 
    name: 'اورمة خشب اي شكل وأحجام مختلفة', 
    price: 75,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775101742/WhatsApp_Image_2026-04-02_at_5.43.47_AM_2_ytplb5.jpg'
  },
  'wood-64': { 
    name: 'اورمة خشب اي شكل وأحجام مختلفة', 
    price: 75,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775101742/WhatsApp_Image_2026-04-02_at_5.43.47_AM_3_asg4v9.jpg'
  },
  'wood-65': { 
    name: 'اورمة خشب اي شكل وأحجام مختلفة', 
    price: 75,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775101743/WhatsApp_Image_2026-04-02_at_5.43.51_AM_ijrtvj.jpg'
  },
  'wood-66': { 
    name: 'اورمة خشب اي شكل وأحجام مختلفة', 
    price: 75,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775101741/WhatsApp_Image_2026-04-02_at_5.43.47_AM_1_nupklt.jpg'
  },
  'wood-67': { 
    name: 'استاند ساقية سلطات 6 بوله', 
    price: 500,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1773563981/wood00001_tpemgf.jpg'
  },
  'wood-68': { 
    name: 'استاند مستويات 2', 
    price: 400,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775188788/WhatsApp_Image_2026-04-03_at_2.04.36_AM_baq0sx.jpg'
  },
  'wood-69': { 
    name: 'استاند مستويات 3', 
    price: 400,
    image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775188787/WhatsApp_Image_2026-04-03_at_2.06.13_AM_edh7jp.jpg'
  },
};
const HEAVY_ITEM_DATA: Record<string, { name?: string; price?: number; note?: string; image?: string; options?: EquipmentOption[] }> = {
  'heavy-1': { name: 'كارفن جولد مستطيل', price: 600 },
  'heavy-2': { name: 'الهوت كابن الإيطالي: سعة 44 وعاء سفنديش / 250 وجبة، 2 باب، هيتر سفلي وخلفي، بخار اختياري، مجهز للمطاعم والفنادق والمؤتمرات.', price: 3000 },
  'heavy-3': { name: 'الهوت كابن الإيطالي: سعة 44 وعاء سفنديش / 250 وجبة، 2 باب، هيتر سفلي وخلفي، بخار اختياري، مجهز للمطاعم والفنادق والمؤتمرات.', price: 3000 },
  'heavy-4': { 
    name: 'بوتجاز تاتش مسطح', 
    options: [
      { id: 'heavy-4-1', name: '1 بلاطة', price: 200 },
      { id: 'heavy-4-2', name: '2 بلاطة', price: 300 },
      { id: 'heavy-4-3', name: '3 بلاطة', price: 400 }
    ]
  },
  'heavy-5': { name: 'هيتر شوربة اسود', price: 200 },
  'heavy-6': { name: 'كارفن سيلفر 2 سبوت', price: 400 },
  'heavy-7': { name: 'كارفن سيلفر 2 عمود', price: 400 },
  'heavy-8': { name: 'كارفن جولد عامودي', price: 600 },
  'heavy-9': { name: 'كارفن سيلفر 2سبون مستطيل', price: 500 },
  'heavy-10': { name: 'كارفن جولد مستطيل 2 سبوت', price: 600 },
  'heavy-11': { name: 'كارفن سيلفر', price: 400 },
  'heavy-12': { name: 'كارفن جولد 1 سبوت', price: 350 },
  'heavy-13': { 
    name: 'كارفن جولد سبوت', 
    options: [
      { id: 'heavy-13-1', name: 'كارفن جولد 1 سبوت', price: 350 },
      { id: 'heavy-13-2', name: 'كارفن جولد 2 سبوت', price: 450 }
    ]
  },
};

const woodItems = generateItems('wood', 69, WOOD_IMAGES, WOOD_ITEM_DATA);
const woodIndices = [26, 29, 35, 39, 40, 42, 44, 45, 49, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 63, 64, 65, 67, 68, 69];
const woodSectionItems = woodIndices.map(i => woodItems[i]).filter(item => item && item.id !== 'wood-1');
const saladSectionItems = woodItems.filter((_, i) => !woodIndices.includes(i) && woodItems[i].id !== 'wood-1');

const heavyItems = generateItems('heavy', 13, HEAVY_IMAGES, HEAVY_ITEM_DATA);

const hotItems = generateItems('hot', 46, HOT_IMAGES, HOT_ITEM_DATA).filter(item => item.id !== 'hot-9' && item.id !== 'hot-46' && item.id !== 'hot-12' && item.id !== 'hot-14' && item.id !== 'hot-7');

export const EQUIPMENT_DATA: EquipmentCategory[] = [
  {
    id: 'hot-serving',
    name: 'ادوات عرض وحفظ الطعام الاوبن بوفيه',
    description: 'تشكيلة فاخرة من معدات تقديم الأطعمة الساخنة',
    icon: '🔥',
    items: [...hotItems.filter(item => !['hot-8', 'hot-16', 'hot-17', 'hot-19', 'hot-20', 'hot-21', 'hot-22', 'hot-26', 'hot-27', 'hot-29', 'hot-31', 'hot-33', 'hot-40'].includes(item.id)), heavyItems[3], heavyItems[4]]
  },
  {
    id: 'appetizers-salads',
    name: 'استاندات للمقبلات والفينجر فوود والسلطات',
    description: 'تقديم عصري للسلطات والمقبلات',
    icon: '🥗',
    items: [...saladSectionItems.filter(item => !item.name?.includes('خشب') && !item.name?.includes('خشبي')), hotItems.find(i => i.id === 'hot-40')].filter(Boolean) as EquipmentItem[]
  },
  {
    id: 'woodwork',
    name: 'الخشبيات',
    description: 'تشكيلة من الخشبيات الراقية للتقديم',
    icon: '🪵',
    items: [...woodSectionItems, ...saladSectionItems.filter(item => item.name?.includes('خشب') || item.name?.includes('خشبي'))]
  },
  {
    id: 'dining-hospitality',
    name: 'ادوات السفرة والضيافة',
    description: 'أدوات مائدة وضيافة بتصاميم ملكية',
    icon: '🍽️',
    extraInfo: [
      "أي قطعة خارج الكڤر سعرها يختلف عن الگفر الكامل والعادي"
    ],
    quickSelections: [
      { id: 'cut-s-1', name: 'معلقة ك سيلفر', price: 5 },
      { id: 'cut-s-2', name: 'شوكة ك سيلفر', price: 5 },
      { id: 'cut-s-3', name: 'سكينة ك سيلفر', price: 5 },
      { id: 'cut-s-4', name: 'معلقة ص سيلفر', price: 5 },
      { id: 'cut-s-5', name: 'شوكة ص سيلفر', price: 5 },
      { id: 'cut-g-1', name: 'شوكة ك جولد', price: 15 },
      { id: 'cut-g-2', name: 'معلقة ك جولد', price: 15 },
      { id: 'cut-g-3', name: 'سكينة ك جولد', price: 15 },
      { id: 'cut-g-4', name: 'معلقة ص جولد', price: 10 },
      { id: 'cut-g-5', name: 'سكينة ص جولد', price: 10 },
      { id: 'glass-1', name: 'كاس شفاف', price: 10 },
      { id: 'glass-2', name: 'كاس تركي', price: 20 },
      { id: 'glass-3', name: 'كاس فينتاج', price: 25 },
      { id: 'acc-1', name: 'نابكنز اي لون', price: 20 },
      { id: 'acc-2', name: 'شوبليت جولد', price: 20 },
      { id: 'acc-3', name: 'شوبليت زجاج', price: 25 },
      { id: 'acc-4', name: 'شوبليت عش الغراب', price: 15 },
      { id: 'acc-5', name: 'طبق كبير', price: 10 },
      { id: 'acc-6', name: 'طبق صغير', price: 7 },
      { id: 'acc-7', name: 'بولة ام علي', price: 7 },
      { id: 'acc-8', name: 'طفاية', price: 10 },
      { id: 'acc-9', name: 'رينج جولد أو سيلفر', price: 20 },
      { id: 'acc-10', name: 'رينج عش الغراب', price: 10 },
    ],
    sections: [
      {
        title: "كوليكشن كفرات السفرة (جولد & سيلفر)",
        items: [tableItems[0], tableItems[1], tableItems[2], tableItems[4], tableItems[7], tableItems[8]]
      },
      {
        title: "باقة راقية من الجيست نابكنز جميع الألوان والدرجات\n\nواجمل كوليكشن للشوبليت ترضي جميع الاذواق\nجولد اكتر من شكل & كريستال & خوص\n\nواجمل تصميمات الرينج جولد / سيلفر / خوص",
        items: [tableItems[3], ...tableItems.slice(5, 7), ...tableItems.slice(9)],
        displayOnly: true
      }
    ]
  },
  {
    id: 'coffee-hospitality',
    name: 'معدات المشروبات والعصائر',
    description: 'ركن القهوة والعصائر والضيافة العربية',
    icon: '☕',
    items: generateItems('coffee', 10, COFFEE_IMAGES, COFFEE_ITEM_DATA)
  },
  {
    id: 'heavy-hot',
    name: 'لايف استيشن',
    description: 'معدات الخدمة الشاقة والولائم الكبيرة',
    icon: '🍖',
    sections: [
      {
        items: [heavyItems[1], heavyItems[2], heavyItems[3]]
      },
      {
        title: "كوليكشن الكارفن",
        items: [heavyItems[0], ...heavyItems.slice(5, 11), heavyItems[12]]
      }
    ]
  },
  {
    id: 'chairs-tables',
    name: 'الكراسي والترابيزات',
    description: 'تشكيلة متنوعة من الكراسي والتربيزات لجميع المناسبات',
    icon: '🪑',
    items: [
      { 
        id: 'ct-x-collection', 
        name: 'كوليكشن خشب اكس', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1774998179/WhatsApp_Image_2026-04-01_at_12.28.45_AM_1_p2276y.jpg', 
        note: 'الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-x-set', name: 'طقم اكس كامل (ترابيزة + 10 كراسي)', price: 600 },
          { id: 'ct-x-table', name: 'ترابيزة اكس منفصلة', price: 300 },
          { id: 'ct-x-chair', name: 'كرسي اكس منفصل', price: 30 }
        ]
      },
      { 
        id: 'ct-napoleon-white-collection', 
        name: 'كوليكشن نابليون ابيض', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775000233/WhatsApp_Image_2026-04-01_at_1.23.55_AM_1_uu6nzp.jpg', 
        note: 'الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-napoleon-white-set', name: 'طقم نابليون ابيض كامل (ترابيزة + 10 كراسي)', price: 600 },
          { id: 'ct-napoleon-white-table', name: 'ترابيزة نابليون ابيض منفصلة', price: 300 },
          { id: 'ct-napoleon-white-chair', name: 'كرسي نابليون ابيض منفصل', price: 30 }
        ]
      },
      { 
        id: 'ct-cane-collection', 
        name: 'كوليكشن كانيه / عش النمل', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775000233/WhatsApp_Image_2026-04-01_at_1.34.41_AM_z6ls52.jpg', 
        note: 'الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-cane-set', name: 'طقم كامل (مربع أو مدور)', price: 800 },
          { id: 'ct-cane-chair', name: 'كرسي (مدور أو مربع)', price: 70 },
          { id: 'ct-cane-screen-chair', name: 'كرسي شاشة', price: 90 },
          { id: 'ct-cane-table', name: 'ترابيزة', price: 300 }
        ]
      },
      { 
        id: 'ct-acrylic-collection', 
        name: 'كوليكشن اكليرك', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775000658/WhatsApp_Image_2026-04-01_at_1.37.25_AM_tbbatw.jpg', 
        note: 'قاعدة ابيض او اسود - الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-acrylic-set', name: 'طقم اكليرك كامل', price: 1500 },
          { id: 'ct-acrylic-chair', name: 'كرسي اكليرك', price: 80 },
          { id: 'ct-acrylic-table', name: 'ترابيزة اكليرك', price: 600 }
        ]
      },
      { 
        id: 'ct-hightable-capitonne-collection', 
        name: 'هاي تيبول كابوتنيه', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775000658/WhatsApp_Image_2026-04-01_at_1.37.58_AM_fhvlgd.jpg', 
        note: 'الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-hightable-capitonne-set', name: 'طقم هاي تيبول كابوتنيه كامل', price: 1250 },
          { id: 'ct-hightable-capitonne-chair', name: 'كرسي كابوتنيه', price: 150 },
          { id: 'ct-hightable-capitonne-table', name: 'ترابيزة كابوتنيه', price: 500 }
        ]
      },
      { 
        id: 'ct-hightable-cane-collection', 
        name: 'هاي تيبول كانيه', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775000659/WhatsApp_Image_2026-04-01_at_1.39.01_AM_1_hikugm.jpg', 
        note: 'الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-hightable-cane-set', name: 'طقم هاي تيبول كانيه كامل', price: 1000 },
          { id: 'ct-hightable-cane-chair', name: 'كرسي كانيه', price: 100 },
          { id: 'ct-hightable-cane-table', name: 'ترابيزة كانيه', price: 500 }
        ]
      },
      { 
        id: 'ct-hightable-x-collection', 
        name: 'هاي تيبول اكس', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775000659/WhatsApp_Image_2026-04-01_at_1.39.01_AM_hjyocq.jpg', 
        note: 'الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-hightable-x-set', name: 'طقم هاي تيبول اكس كامل', price: 300 },
          { id: 'ct-hightable-x-chair', name: 'كرسي اكس', price: 30 },
          { id: 'ct-hightable-x-table', name: 'ترابيزة اكس', price: 180 }
        ]
      },
      { 
        id: 'ct-capitonne-collection', 
        name: 'طقم كابوتنيه', 
        image: 'https://res.cloudinary.com/dqrs3mdmi/image/upload/v1775001182/WhatsApp_Image_2026-04-01_at_1.52.15_AM_myy9dd.jpg', 
        note: 'الأسعار خارج النقل والتجهيز',
        options: [
          { id: 'ct-capitonne-set', name: 'طقم كابوتنيه كامل', price: 2000 },
          { id: 'ct-capitonne-chair', name: 'كرسي كابوتنيه', price: 145 },
          { id: 'ct-capitonne-table', name: 'ترابيزة كابوتنيه', price: 500 }
        ]
      }
    ]
  },
  {
    id: 'services',
    name: 'الخدمات',
    description: 'طاقم عمل محترف لخدمتكم',
    icon: '🤵',
    displayMode: 'grid',
    items: [
      { id: 'srv-1', name: 'ويترز شباب', price: 600 },
      { id: 'srv-2', name: 'ويترز بنات', price: 700 },
      { id: 'srv-3', name: 'باريستا', price: 800 },
      { id: 'srv-4', name: 'شيف', price: 1000 }
    ]
  }
];
