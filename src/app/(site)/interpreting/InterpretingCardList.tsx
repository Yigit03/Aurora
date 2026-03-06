import InterpretingCard, { InterpretingCardProps } from "./InterpretingCard";
import { FileText, MessageSquare, Scale, Briefcase, GraduationCap } from "lucide-react";

const SERVICES: InterpretingCardProps[] = [
  {
    icon: <FileText size={28} />,
    title: "Yazılı Tercüme",
    description:
      "Akademik makaleler, hukuki metinler, teknik dokümanlar ve daha fazlası için profesyonel yazılı çeviri hizmetleri.",
    features: [
      "Akademik & bilimsel metinler",
      "Hukuki belgeler",
      "Teknik dokümanlar",
      "Web sitesi & pazarlama içerikleri",
    ],
    accentColor: "text-red-600",
    iconBg: "bg-red-50",
  },
  {
    icon: <MessageSquare size={28} />,
    title: "Sözlü Tercüme",
    description:
      "Toplantılarınız, konferanslarınız ve iş görüşmelerinizde profesyonel, ardıl ve simultane çeviri hizmetleri sunarak iletişiminizi sorunsuz hâle getiriyoruz.",
    features: [
      "Ardıl tercüme",
      "Simultane tercüme",
      "Konferans & zirve desteği",
      "İş görüşmeleri",
    ],
    accentColor: "text-red-500",
    iconBg: "bg-amber-50",
  },
  {
    icon: <Scale size={28} />,
    title: "Yeminli Tercüme",
    description:
      "Resmi belgeleriniz (pasaport, diploma, vekaletname vb.) için yeminli tercümanlarımız tarafından onaylı çeviri.",
    features: [
      "Pasaport & kimlik belgeleri",
      "Diploma & transkript",
      "Vekaletname & sözleşmeler",
      "Mahkeme belgeleri",
    ],
    accentColor: "text-red-600",
    iconBg: "bg-red-50",
  },
  {
    icon: <Briefcase size={28} />,
    title: "İş & Kurumsal Çeviri",
    description:
      "Kurumsal yazışmalar, raporlar ve iş belgeleri için güvenilir ve hızlı çeviri hizmetleri.",
    features: [
      "İş yazışmaları",
      "Yıllık raporlar",
      "Sunum & brifing dokümanları",
      "İnsan kaynakları belgeleri",
    ],
    accentColor: "text-red-500",
    iconBg: "bg-amber-50",
  },
  {
    icon: <GraduationCap size={28} />,
    title: "Akademik Çeviri",
    description:
      "Tez, makale ve akademik başvuru dosyalarınız için alan uzmanı akademisyenler tarafından gerçekleştirilen çeviri.",
    features: [
      "Lisansüstü tezler",
      "Hakemli dergi makaleleri",
      "Burs başvuru dosyaları",
      "Ders notları & ders kitapları",
    ],
    accentColor: "text-red-600",
    iconBg: "bg-red-50",
  },
];

export default function InterpretingCardList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES.map((service, i) => (
        <InterpretingCard key={i} {...service} />
      ))}
    </div>
  );
}