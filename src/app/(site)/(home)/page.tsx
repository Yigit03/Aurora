import Hero from './Hero';
import ExamsList from './ExamList';
import Features from './Features';
import CTASection from '@/components/layouts/Cta';

export const metadata = {
  title: "Anasayfa | Aurora Dil Eğitim Merkezi",
  description: "Profesyonel eğitmenlerle online Almanca öğrenin..."
};


function Home() {
  return (
    <>
      <Hero />
      <ExamsList />
      <Features />
      <CTASection textTitle='Almanca Öğrenme Yolculuğunuza Bugün Başlayın!' text='Ücretsiz deneme dersi ile başlayın ve farkı hemen görün' buttonTitle='Ücretsiz Deneme Dersi Al!' buttonVariant='cta' route='/contact' />
    </>     
  )
}

export default Home