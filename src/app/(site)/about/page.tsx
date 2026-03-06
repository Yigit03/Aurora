import type { Metadata } from "next";
import PageTitle from "@/components/layouts/PageTitle";
import AboutInstructor from "./AboutInstructor";
import AboutStats from "./AboutStats";
import CTASection from "@/components/layouts/Cta";

export const metadata: Metadata = {
  title: "Hakkımızda - Aurora Dil Eğitim Merkezi | Almanca Eğitim Uzmanları",
  description:
    "Aurora Dil Eğitim Merkezi olarak 10 yıllık deneyimimizle online Almanca eğitiminde öncü konumdayız. Uzman eğitmenimiz Havva Tenger ve modern öğretim yöntemlerimizle tanışın.",
};

export default function AboutPage() {
  return (
    <div>
      <PageTitle title="Hakkımızda" text="20 yıllık deneyimimizle online Almanca eğitiminde öncü konumdayız" />
      <AboutInstructor />
      <AboutStats />
      <CTASection textTitle="Misyonumuz " text="Aurora Dil Eğitim Merkezi olarak misyonumuz, kaliteli ve erişilebilir Almanca eğitimi sunarak öğrencilerimizin kişisel ve profesyonel hedeflerine ulaşmalarına yardımcı olmaktır. Modern teknoloji ve geleneksel öğretim yöntemlerini harmanlayarak, her seviyeden öğrenciye uygun, etkili ve keyifli bir öğrenme deneyimi yaşatmayı hedefliyoruz." buttonTitle="" buttonVariant="none" route="" />
    </div>
  );
}