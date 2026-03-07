"use client"; // [BLOK 1: DIRECTIVE]
import Link from "next/link";
// Bu ifade, Next.js gibi çerçevelerde bileşenin sunucuda değil, 
// tarayıcı tarafında (Client-side) çalışacağını belirtir. 
// Etkileşim (onClick gibi) içeren bileşenler için zorunludur.

import React from "react"; // [BLOK 2: IMPORT]
// React kütüphanesini içeri aktarıyoruz. JSX yapısını kullanabilmemiz için temel gerekliliktir.

// [BLOK 3: TYPE DEFINITIONS]
// TypeScript kullanarak bileşenin alabileceği değerleri önceden tanımlıyoruz. 
// Bu sayede yanlış bir değer girildiğinde kod daha yazım aşamasında hata verir.

// Sadece bu üç seçenekten biri seçilebilir:
export type ButtonVariant = "primary" | "secondary"  | "danger" | "outline" | "cta" | "none" ;

//whatsapp yönlendirme
const phoneNumber = 905462071948;
const url = `https://wa.me/${phoneNumber}?text=Merhaba, çeviri projem için teklif almak istiyorum. \n -web-`;
// Bileşenin dışarıdan alacağı (props) özelliklerin listesi:
type ButtonProps = {
  title: string;           // Butonun içinde yazacak metin (Zorunlu)
  variant?: ButtonVariant; // Görünüm stili (Opsiyonel - soru işareti bu anlama gelir)
  // onClick?: () => void;
  route: string;    // Tıklama anında çalışacak fonksiyon (Opsiyonel)
};

// [BLOK 4: COMPONENT DEFINITION]
// Ana fonksiyonumuz. Props'ları "destructuring" yöntemiyle parçalayarak alıyoruz.
export default function Button({
  title,
  variant = "primary", // Eğer variant gönderilmezse varsayılan olarak "primary" kabul et.
  // onClick,
  route,
}: ButtonProps) {
  
  // [BLOK 5: STYLING LOGIC]
  // Tailwind CSS sınıflarını yönetiyoruz. 
  
  // Her butonun sahip olacağı ortak sınıflar (Padding, yuvarlak köşeler vb.):
  const baseClass = "px-6 py-2 rounded-lg font-semibold transition-all";

  // Seçilen varyanta göre değişecek renk sınıflarını bir obje içinde eşleştiriyoruz:
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-2 border-red-600 text-red-600 hover:bg-red-50",
    cta: "bg-white text-orange-500 hover:bg-orange-50 shadow-md",
    none: "display-none",
  };

  // [BLOK 6: RENDERING]
  // HTML buton etiketini oluşturup sınıfları ve eventleri (onClick) bağlıyoruz.
  return (
    <Link href={`${route}`}>
    {/*Template literal kullanarak sabit sınıflar ile dinamik sınıfları birleştiriyoruz:*/} 
    <button className={`${baseClass} ${variants[variant]} cursor-pointer`} >
      {title}
    </button>
    </Link>
  );
}