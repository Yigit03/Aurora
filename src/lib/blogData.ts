// ─────────────────────────────────────────────────────────────
// blogData.ts
// Bu dosya blog ile ilgili tüm tip tanımlarını ve örnek verileri
// tek bir yerden yönetmek için oluşturuldu.
// Gerçek projede bu veriler API'den gelir, buradaki mock data silinir.
// ─────────────────────────────────────────────────────────────

// "export" → bu interface'i başka dosyalarda da kullanabilmek için dışa aktarıyoruz
// "interface" → TypeScript'e bir blog yazısının hangi alanlardan oluştuğunu tanımlıyoruz
// Bunu yapmak zorunda değiliz ama yaparsak hata yapmamızı engeller:
// Örneğin "title" yerine "baslik" yazarsak TypeScript hemen uyarır
export interface BlogPost {
  slug: string;         // URL'de görünen benzersiz kimlik → "yeminli-tercume-nedir"
  title: string;        // Yazının başlığı → "Yeminli Tercüme Nedir?"
  excerpt: string;      // Kart üzerinde gösterilen kısa özet
  content: string;      // Yazının tam içeriği (HTML formatında)
  category: string;     // Hangi kategoriye ait → "Yeminli Tercüme"
  author: string;       // Yazarın adı → "Aurora Dil Merkezi"
  date: string;         // Yayın tarihi → "12 Ocak 2025"
  coverImage: string;   // Kapak görselinin URL'i
  readingTime: number;  // Tahmini okuma süresi (dakika cinsinden)
}

// Blog listesinde gösterilecek filtre kategorileri
// "Tümü" seçilince filtre sıfırlanır, diğerleri ilgili yazıları getirir
// BlogList.tsx bu diziyi import edip filtre butonlarını oluşturmak için kullanır
export const CATEGORIES = [
  "Tümü",
  "Yazılı Tercüme",
  "Sözlü Tercüme",
  "Yeminli Tercüme",
  "Akademik Çeviri",
  "Dil Öğrenimi",
];

// Gerçek API bağlantısı olmadığı için geliştirme aşamasında kullandığımız örnek veriler
// Her obje yukarıda tanımladığımız BlogPost interface'ine uymak zorunda
// Uymayan bir alan olursa TypeScript derleme hatası verir
export const BLOG_POSTS: BlogPost[] = [

  // ── 1. Blog Yazısı ──────────────────────────────────────────
  {
    slug: "yeminli-tercume-nedir",                          // blog/yeminli-tercume-nedir → bu URL'i oluşturur
    title: "Yeminli Tercüme Nedir ve Ne Zaman Gereklidir?", // sayfanın <h1> başlığı
    excerpt:                                                 // BlogCard'da görünen kısa açıklama
      "Resmi belgeleriniz için yeminli tercüme sürecini, kimler yapabilir ve hangi durumlarda gerektiğini kapsamlı şekilde açıklıyoruz.",
    content: `                                               
      <p>Yeminli tercüme, noter veya mahkeme tarafından tanınan yetkili bir tercüman tarafından yapılan ve resmi mühür ile imza ile onaylanan çeviridir. Pasaport, diploma, doğum belgesi, vekaletname gibi resmi belgeler için zorunludur.</p>
      <h2>Kimler Yeminli Tercüme Yapabilir?</h2>
      <p>Türkiye'de yeminli tercümanlar, ilgili mahkeme tarafından yemin ettirilerek görevlendirilir. Bu tercümanlar belirli dil çiftlerinde uzmanlaşmıştır ve imzaladıkları belgeler resmi geçerliliğe sahiptir.</p>
      <h2>Ne Zaman Gereklidir?</h2>
      <p>Yurt dışında okumak, çalışmak veya ikamet etmek için başvuru yaparken; mahkeme süreçlerinde; resmi kurumlara belge sunarken yeminli tercüme zorunludur.</p>
    `,                                                       // backtick (`) → içine HTML yazabilmek için template literal kullandık
    category: "Yeminli Tercüme",                            // CATEGORIES dizisindeki değerlerden biri olmalı
    author: "Aurora Dil Merkezi",                           // yazar bilgisi BlogCard ve BlogDetails'ta gösterilir
    date: "12 Ocak 2025",                                   // string olarak tutuyoruz, formatlama gerektirmiyor
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80", // Unsplash'tan ücretsiz görsel
    readingTime: 5,                                          // dakika cinsinden, elle hesaplanmış tahmini süre
  },

  // ── 2. Blog Yazısı ──────────────────────────────────────────
  {
    slug: "almanca-is-basvurusu-icin-cv-tercumesi",
    title: "Almanya'da İş Başvurusu için CV Tercümesi Nasıl Yapılır?",
    excerpt:
      "Almanya'da iş ararken profesyonel bir CV tercümesinin önemi ve dikkat edilmesi gereken noktalar hakkında bilmeniz gereken her şey.",
    content: `
      <p>Almanya iş pazarında öne çıkmak için CV'nizin yalnızca dilsel değil, kültürel açıdan da doğru tercüme edilmesi gerekmektedir.</p>
      <h2>Kültürel Uyarlama</h2>
      <p>Alman iş kültüründe özlük bilgileri, fotoğraf kullanımı ve bölüm sıralaması Türkiye'den farklıdır. Profesyonel bir tercüman bu farkları gözetir.</p>
    `,
    category: "Yazılı Tercüme",
    author: "Aurora Dil Merkezi",
    date: "28 Ocak 2025",
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    readingTime: 4,
  },

  // ── 3. Blog Yazısı ──────────────────────────────────────────
  {
    slug: "simultane-tercume-nedir",
    title: "Simultane Tercüme: Konferanslarda Dil Engelini Aşmanın Yolu",
    excerpt:
      "Uluslararası konferanslarda kullanılan simultane tercüme sistemi nasıl çalışır, hangi ekipmanlar gerekir ve nasıl bir tercüman seçilmelidir?",
    content: `
      <p>Simultane tercüme, konuşmacının konuşması sürerken eş zamanlı olarak yapılan çeviridir. Özel kabin ve ekipman gerektirir.</p>
    `,
    category: "Sözlü Tercüme",
    author: "Aurora Dil Merkezi",
    date: "5 Şubat 2025",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    readingTime: 6,
  },

  // ── 4. Blog Yazısı ──────────────────────────────────────────
  {
    slug: "akademik-makale-tercumesi",
    title: "Akademik Makale Tercümesinde Dikkat Edilmesi Gereken 5 Nokta",
    excerpt:
      "Hakemli bir dergiye makale göndermeden önce tercüme sürecinde yapılan en yaygın hatalar ve bunlardan nasıl kaçınılacağı.",
    content: `
      <p>Akademik tercüme, teknik terminoloji bilgisi gerektiren özel bir alandır. Alan uzmanı bir tercüman seçimi kritik önem taşır.</p>
    `,
    category: "Akademik Çeviri",
    author: "Aurora Dil Merkezi",
    date: "14 Şubat 2025",
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    readingTime: 7,
  },

  // ── 5. Blog Yazısı ──────────────────────────────────────────
  {
    slug: "almanca-ogrenmenin-en-etkili-yollari",
    title: "Almanca Öğrenmenin En Etkili Yolları: Başlangıç Rehberi",
    excerpt:
      "Sıfırdan Almanca öğrenmeye başlayanlar için kanıtlanmış yöntemler, kaynak önerileri ve hız kazandıracak pratik ipuçları.",
    content: `
      <p>Almanca, düzenli pratik ve doğru kaynaklar ile herkesin öğrenebileceği bir dildir. Başlangıç için yapı taşlarını doğru atmak büyük önem taşır.</p>
    `,
    category: "Dil Öğrenimi",
    author: "Aurora Dil Merkezi",
    date: "22 Şubat 2025",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    readingTime: 8,
  },

  // ── 6. Blog Yazısı ──────────────────────────────────────────
  {
    slug: "hukuki-belge-tercumesi",
    title: "Hukuki Belge Tercümesinde Doğruluk Neden Bu Kadar Önemli?",
    excerpt:
      "Sözleşme, dava belgesi veya patent gibi hukuki metinlerde bir çeviri hatası nasıl büyük sonuçlara yol açabilir?",
    content: `
      <p>Hukuki belgelerde her kelime önem taşır. Yanlış bir tercüme, hukuki geçerliliği doğrudan etkileyebilir ve telafisi güç zararlara yol açabilir.</p>
    `,
    category: "Yazılı Tercüme",
    author: "Aurora Dil Merkezi",
    date: "3 Mart 2025",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80",
    readingTime: 5,
  },

];