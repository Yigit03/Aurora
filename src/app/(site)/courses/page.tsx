import React from 'react'
import PageTitle from '@/components/layouts/PageTitle';
import CTASection from '@/components/layouts/Cta';
import Cards from './Cards';

export const metadata = {
  title: "Kurslar | Aurora Dil Eğitim Merkezi",
  description: "Profesyonel eğitmenlerle online Almanca öğrenin..."
};

function Courses() {
  return (
    <div>
      <PageTitle title="Almanca Kurslarımız" text="Goethe ve Telc sertifikasyon sınavlarına odaklı kurslarımız" />
      <Cards />
      <CTASection 
      textTitle='Hangi seviyede olduğunuzu biliyor musunuz?' 
      text='Ücretsiz seviye tespit sınavı ile seviyenizi ve size en uygun kursu öğrenin!'
      buttonTitle='Ücretsiz teste katıl!'
      buttonVariant='cta'
      route='/exam'
      />
    </div>
  )
}

export default Courses