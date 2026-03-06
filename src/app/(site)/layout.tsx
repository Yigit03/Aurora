import Header from "@/components/layouts/Header";
// Header bileşenini mutlak (alias) yol kullanarak içeri aktarır.
// Sayfanın üst kısmında (header/navbar) gösterilecek layout bileşenidir.

import Footer from "@/components/layouts/Footer";
// Footer bileşenini mutlak yol üzerinden içeri aktarır.
// Sayfanın alt kısmında (footer) gösterilecek layout bileşenidir.

export default function siteLayout(
    {children,}:{children:React.ReactNode,}
)
// Bu fonksiyon bir React Function Component’tir ve default export edilir.
// Next.js App Router'da layout olarak kullanılmak üzere tanımlanmıştır.
// Parametre olarak `children` alır; bu, bu layout’un içine render edilecek tüm sayfa içeriğini temsil eder.
// `React.ReactNode` tipi, JSX, string, fragment gibi render edilebilir tüm React içeriklerini kapsar.
{
    return(
        <div className="min-h-screen flex flex-col" >
         {/* Tüm sayfayı saran ana container'dır.
         `min-h-screen` → en az ekran yüksekliği kadar olur.
         `flex flex-col` → içindeki elemanları dikey (column) düzende dizer. */}

            <Header />
             {/* Üst kısımda Header bileşenini render eder.
             Genellikle logo, navigasyon ve kullanıcı aksiyonları burada yer alır. */}

            <main className="flex-1" >
             {/* Sayfanın ana içerik alanıdır.
             `flex-1` → Header ve Footer dışında kalan tüm dikey alanı doldurur. */}

                {children}
                 {/* Bu layout’u kullanan sayfanın veya nested layout’un içeriği burada render edilir.
                 Dinamik olarak değişen sayfa içeriğini temsil eder. */}

            </main>
             {/* Ana içerik alanının kapanışı. */}

            <Footer />
             {/* Sayfanın alt kısmında Footer bileşenini render eder.
             Telif hakkı, linkler, ek bilgiler genellikle burada bulunur. */}

        </div>
        // Sayfanın tamamını saran ana container'ın kapanışı.
    )
    // JSX çıktısını return eder; React bu yapıyı DOM'a render eder.
}