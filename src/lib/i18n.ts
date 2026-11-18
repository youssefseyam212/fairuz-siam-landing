import type { Lang } from './data';

interface Slide { eb: string; t: string; p: string; b: string }

const en = {
  announce: 'Pre-orders are open · Reserve a piece from the Fall 2026 collection and get an early discount',
  collections: 'Collections', pieces: 'The pieces', ourStory: 'Our story', about: 'About us', home: 'Home',
  menu: 'Menu', closeMenu: 'Close menu', prev: 'Previous', next: 'Next', skip: 'Skip to content', discover: 'Discover', isNew: 'New',
  ring: 'Ring', earrings: 'Earrings', necklace: 'Necklace', bracelet: 'Bracelet',
  slides: [
    { eb: 'Fall 2026 · Pre-orders open', t: 'Every shape holds a story', p: 'Jewelry inspired by cultures, heritage and the beauty of forms repeated through time.', b: 'Pre-order now' },
    { eb: 'The Fayrouz collection', t: 'The stone that gave us our name', p: 'Turquoise, worn for protection from Sinai to Samarkand, set in shapes that carry its story.', b: 'Pre-order Fayrouz' },
    { eb: 'New this season', t: 'The past, worn differently', p: 'Four new pieces for the season, made by hand in Cairo.', b: 'See the pieces' },
  ] as Slide[],
  heroTitle: 'Every shape holds a story',
  colsTitle: 'The collections', colsSub: 'Four stones, four stories. Each collection begins with one gem and the cultures that treasured it.',
  sigTitle: 'The pieces', sigSub: 'Choose a piece to reserve it. Each one is made to order in our atelier.',
  storyEb: 'Our story', manifesto: 'Every culture leaves behind a shape, a symbol, a memory. Fairuz Siam gathers them, reimagines them, and carries their stories forward.',
  aboutTitle: 'Jewelry shaped by stories', aboutBody: 'Fairuz Siam is jewelry made of stories, inspired by cultures, heritage, and the beauty of forms repeated through time. Each piece carries its own rhythm, shape, and meaning, turning tradition into something personal and modern. Made to be worn as more than jewelry, it becomes a form of expression, empowering every woman to wear her story, her way.',
  readStory: 'Read our story',
  craftTitle: 'Made by hand in Cairo',
  craft: [['Handmade', 'Each piece is shaped and set by hand in our Cairo atelier.'], ['Stones chosen one by one', 'Every stone is picked for its colour and the way it holds light.'], ['Made to be worn', 'Gold vermeil and sterling silver, finished for every day.']] as [string, string][],
  giftEb: 'Gifting', giftTitle: 'A thoughtful finishing touch', giftBody: 'Every piece arrives in a Fayrouz Blue pouch with a handwritten card. Add your message when you pre-order and we will write it for you.', giftBtn: 'Pre-order a gift',

  // about page
  abTitle: 'Jewelry made of stories',
  abNameEb: 'Our name', abNameTitle: 'The stone that gave us our name',
  abNameBody: 'Fairuz is the Arabic word for turquoise, a stone worn for protection from Sinai to Samarkand. Like the stone, every piece we make is meant to be kept close and carried with meaning.',
  abStonesTitle: 'Four stones, four stories', abStonesSub: 'Each collection starts with a single gem and the places that treasured it.',
  abFactsTitle: 'At a glance',
  abFacts: [['Atelier', 'Cairo, Egypt'], ['Made', 'By hand, in small numbers'], ['Metals', 'Gold vermeil and sterling silver'], ['Stones', 'Garnet, blue topaz, turquoise, emerald'], ['Brand identity', 'Maram Elsayed']] as [string, string][],

  // pre-order
  po: 'Pre-order', poEb: 'Pre-order · Fall 2026', poTitle: 'Reserve your piece',
  poSub: 'Every piece is made by hand in our Cairo atelier. Reserve yours now and get an early pre-order discount. We will contact you to confirm the details. Nothing is charged today.',
  poPiece: 'The piece', poHelp: 'Not sure yet, help me choose', poAny: (c: string) => `Any piece from ${c}`,
  poMetal: 'Metal', gold: 'Gold vermeil', silver: 'Sterling silver',
  poSize: 'Ring size (EU)', poSizeUnsure: 'Not sure yet',
  fullName: 'Full name', phone: 'Mobile number (WhatsApp)', email: 'Email (optional)', poNote: 'Notes or gift message (optional)',
  poSend: 'Reserve my piece', poSending: 'Sending…', poClose: 'Close',
  poPrivacy: 'We only use your details to contact you about this pre-order.',
  poDoneTitle: 'Thank you. Your piece is reserved.', poDoneBody: (p: string) => `We will contact you on ${p} to confirm your piece, metal and size.`,
  poCodeLabel: 'Your pre-order discount', poCodeBody: (pct: number) => `${pct}% off your piece. Keep this code: we will apply it when we confirm your order.`,
  poExisting: 'This number already has a reservation, so here is your code again.',
  poPreview: 'Design preview: this request was not saved and the code above is a sample.',
  poCopy: 'Copy code', poCopied: 'Copied', poDoneBtn: 'Back to the site',
  poErr: 'We could not send your request. Please try again in a moment.', poRate: 'Too many attempts. Please wait a few minutes and try again.',
  eName: 'Enter your full name.', ePhone: 'Enter an Egyptian mobile number, like 010 1234 5678.', eEmail: 'Enter an email address, like name@example.com.',
  bandTitle: 'Be the first to wear it', bandSub: 'Pre-orders for the Fall 2026 collection are open. Reserve your piece today and get an early discount.',

  // footer
  worn: 'Worn stories', closing: 'Made to mean something.', atelierLoc: 'Atelier in Cairo, Egypt',
  fExplore: 'Explore', fVisit: 'The atelier', fVisitBody: 'Handmade jewelry from Cairo, delivered across Egypt.',
  svc: ['Handmade in Cairo', 'Stones chosen one by one', 'Delivery across Egypt'],
  copy: '© 2026 Fairuz Siam', credit: 'Brand identity by Maram Elsayed',
  titleHome: 'Fairuz Siam · Handmade jewelry from Cairo', titleAbout: 'About us · Fairuz Siam',
};

export type Dict = typeof en;
export type DictKey = keyof Dict;

const ar: Dict = {
  announce: 'الطلب المسبق متاح الآن · احجزي قطعة من مجموعة خريف ٢٠٢٦ واحصلي على خصم مبكر',
  collections: 'المجموعات', pieces: 'القطع', ourStory: 'حكايتنا', about: 'من نحن', home: 'الرئيسية',
  menu: 'القائمة', closeMenu: 'إغلاق القائمة', prev: 'السابق', next: 'التالي', skip: 'انتقلي إلى المحتوى', discover: 'اكتشفي', isNew: 'جديد',
  ring: 'خاتم', earrings: 'أقراط', necklace: 'قلادة', bracelet: 'سوار',
  slides: [
    { eb: 'خريف ٢٠٢٦ · الطلب المسبق متاح', t: 'لكل شكلٍ حكاية', p: 'مجوهرات مستوحاة من الثقافات والتراث وجمال الأشكال التي تتكرر عبر الزمن.', b: 'اطلبي مسبقاً الآن' },
    { eb: 'مجموعة فيروز', t: 'الحجر الذي منحنا اسمنا', p: 'الفيروز، الذي ارتُدي للحماية من سيناء إلى سمرقند، مرصّع في أشكال تحمل حكايته.', b: 'اطلبي من فيروز' },
    { eb: 'جديد هذا الموسم', t: 'الماضي، يُرتدى بطريقة مختلفة', p: 'أربع قطع جديدة لهذا الموسم، مصنوعة يدوياً في القاهرة.', b: 'شاهدي القطع' },
  ],
  heroTitle: 'لكل شكلٍ حكاية',
  colsTitle: 'المجموعات', colsSub: 'أربعة أحجار، أربع حكايات. تبدأ كل مجموعة بحجر واحد وبالثقافات التي اعتزّت به.',
  sigTitle: 'القطع', sigSub: 'اختاري قطعة لتحجزيها. تُصنع كل قطعة حسب الطلب في مشغلنا.',
  storyEb: 'حكايتنا', manifesto: 'كل ثقافة تترك وراءها شكلاً، ورمزاً، وذكرى. فيروز صيام تجمعها، وتعيد تخيّلها، وتحمل حكاياتها إلى الأمام.',
  aboutTitle: 'مجوهرات تشكّلها الحكايات', aboutBody: 'فيروز صيام مجوهرات مصنوعة من الحكايات، مستوحاة من الثقافات والتراث وجمال الأشكال التي تتكرر عبر الزمن. تحمل كل قطعة إيقاعها وشكلها ومعناها الخاص، فتحوّل التقاليد إلى شيء شخصي وعصري. صُممت لتُرتدى كأكثر من مجرد مجوهرات، فتصبح وسيلة للتعبير تمنح كل امرأة القدرة على ارتداء حكايتها بطريقتها.',
  readStory: 'اقرئي حكايتنا',
  craftTitle: 'مصنوعة يدوياً في القاهرة',
  craft: [['صنع يدوي', 'تُشكَّل كل قطعة وتُرصَّع يدوياً في مشغلنا بالقاهرة.'], ['أحجار مختارة واحداً واحداً', 'يُنتقى كل حجر للونه وللطريقة التي يحتضن بها الضوء.'], ['صُنعت لتُرتدى', 'فضة مطلية بالذهب وفضة إسترليني، بلمسة نهائية تناسب كل يوم.']],
  giftEb: 'الإهداء', giftTitle: 'لمسة أخيرة مدروسة', giftBody: 'تصل كل قطعة في حقيبة قماشية بلون الفيروز مع بطاقة مكتوبة بخط اليد. أضيفي رسالتك عند الطلب المسبق وسنكتبها لكِ.', giftBtn: 'اطلبي هدية مسبقاً',

  abTitle: 'مجوهرات مصنوعة من الحكايات',
  abNameEb: 'اسمنا', abNameTitle: 'الحجر الذي منحنا اسمنا',
  abNameBody: 'الفيروز حجر ارتُدي للحماية من سيناء إلى سمرقند. ومثل هذا الحجر، صُنعت كل قطعة لدينا لتبقى قريبة منكِ وتحمل معنى.',
  abStonesTitle: 'أربعة أحجار، أربع حكايات', abStonesSub: 'تبدأ كل مجموعة بحجر واحد وبالأماكن التي اعتزّت به.',
  abFactsTitle: 'لمحة سريعة',
  abFacts: [['المشغل', 'القاهرة، مصر'], ['الصنع', 'يدوياً، وبكميات صغيرة'], ['المعادن', 'فضة مطلية بالذهب وفضة إسترليني'], ['الأحجار', 'العقيق الأحمر، التوباز الأزرق، الفيروز، الزمرد'], ['هوية العلامة', 'مرام السيد']],

  po: 'اطلبي مسبقاً', poEb: 'طلب مسبق · خريف ٢٠٢٦', poTitle: 'احجزي قطعتك',
  poSub: 'تُصنع كل قطعة يدوياً في مشغلنا بالقاهرة. احجزي قطعتك الآن واحصلي على خصم الطلب المسبق. سنتواصل معكِ لتأكيد التفاصيل. لن يُحصَّل أي مبلغ اليوم.',
  poPiece: 'القطعة', poHelp: 'لم أقرر بعد، ساعديني في الاختيار', poAny: (c: string) => `أي قطعة من ${c}`,
  poMetal: 'المعدن', gold: 'فضة مطلية بالذهب', silver: 'فضة إسترليني',
  poSize: 'مقاس الخاتم (أوروبي)', poSizeUnsure: 'لست متأكدة بعد',
  fullName: 'الاسم الكامل', phone: 'رقم الموبايل (واتساب)', email: 'البريد الإلكتروني (اختياري)', poNote: 'ملاحظات أو رسالة إهداء (اختياري)',
  poSend: 'احجزي قطعتي', poSending: 'جارٍ الإرسال…', poClose: 'إغلاق',
  poPrivacy: 'نستخدم بياناتك فقط للتواصل معكِ بخصوص هذا الطلب.',
  poDoneTitle: 'شكراً لكِ. تم حجز قطعتك.', poDoneBody: (p: string) => `سنتواصل معكِ على ${p} لتأكيد القطعة والمعدن والمقاس.`,
  poCodeLabel: 'خصم الطلب المسبق', poCodeBody: (pct: number) => `خصم ${new Intl.NumberFormat('ar-EG').format(pct)}٪ على قطعتك. احتفظي بهذا الكود، وسنطبّقه عند تأكيد طلبك.`,
  poExisting: 'هذا الرقم لديه حجز بالفعل، وهذا هو الكود الخاص بكِ مرة أخرى.',
  poPreview: 'معاينة التصميم: لم يُحفظ هذا الطلب، والكود أعلاه مجرد مثال.',
  poCopy: 'نسخ الكود', poCopied: 'تم النسخ', poDoneBtn: 'العودة إلى الموقع',
  poErr: 'تعذّر إرسال طلبك. حاولي مرة أخرى بعد قليل.', poRate: 'محاولات كثيرة. انتظري بضع دقائق ثم حاولي مرة أخرى.',
  eName: 'أدخلي اسمك الكامل.', ePhone: 'أدخلي رقم موبايل مصري، مثل 010 1234 5678.', eEmail: 'أدخلي بريداً إلكترونياً، مثل name@example.com.',
  bandTitle: 'كوني أول من يرتديها', bandSub: 'الطلب المسبق لمجموعة خريف ٢٠٢٦ متاح الآن. احجزي قطعتك اليوم واحصلي على خصم مبكر.',

  worn: 'حكايات تُرتدى', closing: 'صُنعت لتحمل معنى.', atelierLoc: 'المشغل في القاهرة، مصر',
  fExplore: 'تصفّحي', fVisit: 'المشغل', fVisitBody: 'مجوهرات مصنوعة يدوياً في القاهرة، مع التوصيل داخل مصر.',
  svc: ['صُنعت يدوياً في القاهرة', 'أحجار مختارة واحداً واحداً', 'التوصيل داخل مصر'],
  copy: '© ٢٠٢٦ فيروز صيام', credit: 'هوية العلامة من تصميم مرام السيد',
  titleHome: 'فيروز صيام · مجوهرات مصنوعة يدوياً في القاهرة', titleAbout: 'من نحن · فيروز صيام',
};

export const T: Record<Lang, Dict> = { en, ar };

export type ThemeMode = 'system' | 'light' | 'dark';
export const THEMES: ThemeMode[] = ['system', 'light', 'dark'];
export const TLBL: Record<Lang, Record<ThemeMode, string>> = {
  en: { system: 'Theme: match device', light: 'Theme: light', dark: 'Theme: dark' },
  ar: { system: 'المظهر: حسب الجهاز', light: 'المظهر: فاتح', dark: 'المظهر: داكن' },
};
