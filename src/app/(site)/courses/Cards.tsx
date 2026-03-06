"use client"

type check = {
  checkBg : string,
  checkColor : string,
}

// Varsayılan tema (kırmızı) - tüm kartlar
const DEFAULT_THEME = {
  headerBg: "bg-gradient-to-br from-red-500 to-red-700",
  btnBg: "bg-gradient-to-r from-red-500 to-red-700",
  checkBg: "bg-red-50",
  checkColor: "text-red-600",
  levelColor: "text-red-100",
  cardBorder: "",
};

// Popüler kart teması (altın/amber)
const POPULAR_THEME = {
  headerBg: "bg-gradient-to-br from-amber-400 to-orange-500",
  btnBg: "bg-gradient-to-r from-amber-400 to-orange-500",
  checkBg: "bg-amber-50",
  checkColor: "text-amber-600",
  levelColor: "text-amber-100",
  cardBorder: "ring-2 ring-amber-400 ring-offset-2",
};

function CheckIcon({ checkBg, checkColor } : check) {
  return (
    <span className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full flex-shrink-0 ${checkBg}`}>
      <svg className={`w-2.5 h-2.5 ${checkColor}`} viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.2 2.2L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function CourseCard({
  level = "A1 - Başlangıç",
  title = "Almanca'ya İlk Adım",
  studentCount = "750+ Öğrenci",
  contentItems = [
    "Temel kelime hazinesi",
    "Basit günlük konuşmalar",
    "Alfabe ve telaffuz",
    "Temel gramer kuralları",
    "Kendini tanıtma",
    "Sayılar ve tarihler",
  ],
  priceText = "Fiyat için iletişime geçiniz.",
  enrollLabel = "Kursa Kayıt Ol",
  onEnroll = () => {},
  isPopular = false,
  popularLabel = "En Popüler",
}) {
  const t = isPopular ? POPULAR_THEME : DEFAULT_THEME;

  const phone = "905462071948";
  const message = "Merhabalar, kurs fiyatları hakkında bilgi almak istiyorum \n -web-";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`w-[340px] rounded-2xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] hover:-translate-y-1.5 transition-all duration-300 ${t.cardBorder}`}>
      {/* Header */}
      <div className={`relative px-6 pt-6 pb-5 min-h-[110px] flex flex-col justify-end overflow-hidden ${t.headerBg}`}>
        <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 left-[60%] w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

        {isPopular && (
          <div className="absolute top-4 right-4 bg-white text-amber-500 text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
            ✦ {popularLabel}
          </div>
        )}

        <p className={`text-xs font-medium tracking-widest uppercase mb-1 ${t.levelColor}`}>{level}</p>
        <h2 className="text-white text-xl font-black leading-snug">{title}</h2>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium mb-4">
          <UsersIcon />
          {studentCount}
        </div>

        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Kurs İçeriği</p>
        <ul className="flex flex-col gap-2 mb-5">
          {contentItems.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-[13.5px] text-gray-500 leading-snug">
              <CheckIcon checkBg={t.checkBg} checkColor={t.checkColor} />
              {item}
            </li>
          ))}
        </ul>

        <div className="h-px bg-gray-100 my-4" />

        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-500 mb-4 hover:text-orange-500 delay-50 duration-300">{priceText}</a>

        <button
          onClick={onEnroll}
          className={`w-full py-3.5 rounded-xl text-white text-sm font-extrabold tracking-wide cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] border-0 ${t.btnBg}`}
        >
          {enrollLabel}
        </button>
      </div>
    </div>
  );
}

// --- Demo ---
export default function Cards() {
  const cards = [
    {
      level: "A1 - Başlangıç",
      title: "Almanca'ya İlk Adım",
      studentCount: "1000+ Öğrenci",
      contentItems: ["Temel kelime hazinesi", "Basit günlük konuşmalar", "Alfabe ve telaffuz", "Temel gramer kuralları", "Kendini tanıtma", "Sayılar ve tarihler"],
    },
    {
      level: "A2 - Temel",
      title: "Günlük Almanca",
      studentCount: "750+ Öğrenci",
      isPopular: true,
      contentItems: ["Genişletilmiş kelime hazinesi", "Geçmiş zaman kullanımı", "Alışveriş ve restoran diyalogları", "Aile ve arkadaş ilişkileri", "Seyahat konuşmaları", "Basit yazılı metinler"],
    },
    {
      level: "B1 - Orta",
      title: "Akıcı Almanca",
      studentCount: "500+ Öğrenci",
      contentItems: ["Karmaşık gramer yapıları", "İş hayatında Almanca", "Haber ve makale okuma", "Görüş bildirme", "Gelecek planları", "Kültürel konular"],
    },
        {
      level: "B2 - Orta",
      title: "İleri Almanca",
      studentCount: "500+ Öğrenci",
      contentItems: ["Karmaşık gramer yapıları", "İş hayatında Almanca", "Haber ve makale okuma", "Görüş bildirme", "Gelecek planları", "Kültürel konular"],
    },
        {
      level: "C1 - Orta",
      title: "Profesyonel Almanca",
      studentCount: "500+ Öğrenci",
      contentItems: ["Karmaşık gramer yapıları", "İş hayatında Almanca", "Haber ve makale okuma", "Görüş bildirme", "Gelecek planları", "Kültürel konular"],
    },
        {
      level: "C2 - Orta",
      title: "Anadil Seviyesi Almanca",
      studentCount: "500+ Öğrenci",
      contentItems: ["Karmaşık gramer yapıları", "İş hayatında Almanca", "Haber ve makale okuma", "Görüş bildirme", "Gelecek planları", "Kültürel konular"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
      <div className="flex flex-wrap gap-10 justify-center items-start">
        {cards.map((props, i) => (
          <CourseCard key={i} {...props} onEnroll={() => alert(`${props.title} kursuna kayıt!`)} />
        ))}
      </div>
    </div>
  );
}