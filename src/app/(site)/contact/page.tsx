import React from 'react'
import PageTitle from '@/components/layouts/PageTitle';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

export const metadata = {
  title: "İletişim | Aurora Dil Eğitim Merkezi",
  description: "Profesyonel eğitmenlerle online Almanca öğrenin..."
};

function Contact() {
  return (
    <div>
      <PageTitle title="İletişim" text="20 yıllık deneyimimizle online Almanca eğitiminde öncü konumdayız" />
      
      <section className="py-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            {/* Form — geniş taraf */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ContactForm />
            </div>

            {/* Info — dar taraf */}
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact