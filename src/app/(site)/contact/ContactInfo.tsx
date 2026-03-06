import { Phone, Mail, Clock, Instagram, Facebook, Linkedin } from "lucide-react";

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

interface WorkDay {
  days: string;
  hours: string;
}

const INFO_ITEMS: InfoItem[] = [
  {
    icon: <Phone size={18} />,
    label: "Telefon",
    value: "+90 546 207 19 48",
    href: "tel:+905462071948",
  },
  {
    icon: <Mail size={18} />,
    label: "E-posta",
    value: "info@auroradil.com",
    href: "mailto:info@auroradil.com",
  },
];

const WORK_HOURS: WorkDay[] = [
  { days: "Pazartesi – Cuma", hours: "09:00 – 18:00" },
  { days: "Cumartesi", hours: "10:00 – 14:00" },
  { days: "Pazar", hours: "Kapalı" },
];

const SOCIALS = [
  { icon: <Instagram size={18} />, label: "Instagram", href: "https:/instagram.com/@auroradilcom"},
  { icon: <Facebook size={18} />, label: "Facebook", href: "#" },
  { icon: <Linkedin size={18} />, label: "LinkedIn", href: "#" },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-12 -left-8 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative flex flex-col gap-8 h-full">
        {/* Header */}
        <div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-4">
            İletişim Bilgileri
          </span>
          <h3 className="text-2xl font-black leading-snug">
            Sizi Dinlemeye Hazırız 
          </h3>
          <p className="text-red-100 text-sm mt-2 leading-relaxed">
            Sorularınız için bize aşağıdaki kanallardan ulaşabilirsiniz.
          </p>
        </div>

        {/* Contact items */}
        <div className="flex flex-col gap-4">
          {INFO_ITEMS.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="flex items-center gap-4 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors duration-200 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-red-200 font-medium">{item.label}</p>
                <p className="text-sm font-bold group-hover:underline underline-offset-2">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20" />

        {/* Working hours */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-red-200" />
            <span className="text-xs font-bold tracking-widest uppercase text-red-200">
              Çalışma Saatleri
            </span>
          </div>
          {WORK_HOURS.map((wh, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-red-100">{wh.days}</span>
              <span className={`font-bold ${wh.hours === "Kapalı" ? "text-red-300" : "text-white"}`}>
                {wh.hours}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20" />

        {/* Socials */}
        <div className="flex flex-col gap-3 mt-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-red-200">
            Sosyal Medya
          </span>
          <div className="flex gap-3">
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                aria-label={s.label}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}