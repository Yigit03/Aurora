import InterpretingCardList from "./InterpretingCardList";
import CTASection from "@/components/layouts/Cta";
import PageTitle from "@/components/layouts/PageTitle";

const STATS = [
  { value: "20+", label: "Yıllık Deneyim" },
  { value: "500+", label: "Tamamlanan Proje" },
  { value: "2+", label: "Dil Çifti" },
  { value: "99%", label: "Müşteri Memnuniyeti" },
];

export const metadata = {
  title: "Tercüme | Aurora Dil Eğitim Merkezi",
  description: "Profesyonel eğitmenlerle online Almanca öğrenin..."
};

const whatsappNumber = "905462071948";
const whatsappMsg = encodeURIComponent("Merhaba, çeviri projem için teklif almak istiyorum. \n -web-");
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

export default function InterpretingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <PageTitle title="Çeviri ve Tercümanlık" text="Almanca CV, İş Yazışmalarında ve kurumsal çeviride profesyonel destek" />

      {/* ── Stats ── */}
      <section className="bg-red-600 border-y border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-sm text-white mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hizmet Alanları ── */}
      <section id="hizmetler" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-5">
            <h2 className="text-4xl font-black text-gray-900 mb-5">
              Hizmet Alanlarımız
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
              Farklı sektörlerdeki uzmanlık gerektiren çeviri ihtiyaçlarınıza
              profesyonel çözümler üretiyoruz.
            </p>
          </div>

          <InterpretingCardList />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <CTASection 
      textTitle="Çeviri Projeniz İçin Teklif Alın!" 
      text="Proje detaylarınızı bize gönderin, size özel en uygun fiyat teklifini hazırlayalım." 
      route={whatsappUrl}
      buttonTitle="Teklif Alın!" 
      buttonVariant="cta" />
    </main>
  );
}