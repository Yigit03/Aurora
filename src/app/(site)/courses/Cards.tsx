// app/(site)/courses/Cards.tsx

import { supabase } from '@/lib/supabase'

export const revalidate = 60;

type check = {
  checkBg: string
  checkColor: string
}

const DEFAULT_THEME = {
  headerBg: "bg-gradient-to-br from-red-500 to-red-700",
  btnBg: "bg-gradient-to-r from-red-500 to-red-700",
  checkBg: "bg-red-50",
  checkColor: "text-red-600",
  levelColor: "text-red-100",
  cardBorder: "",
}

const POPULAR_THEME = {
  headerBg: "bg-gradient-to-br from-amber-400 to-orange-500",
  btnBg: "bg-gradient-to-r from-amber-400 to-orange-500",
  checkBg: "bg-amber-50",
  checkColor: "text-amber-600",
  levelColor: "text-amber-100",
  cardBorder: "ring-2 ring-amber-400 ring-offset-2",
}

function CheckIcon({ checkBg, checkColor }: check) {
  return (
    <span className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full flex-shrink-0 ${checkBg}`}>
      <svg className={`w-2.5 h-2.5 ${checkColor}`} viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.2 2.2L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export default async function Cards() {
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  const phone = "905462071948"
  const message = "Merhabalar, kurs fiyatları hakkında bilgi almak istiyorum \n -web-"
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  if (!courses || courses.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Henüz kurs bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
      <div className="flex flex-wrap gap-10 justify-center items-start">
        {courses.map((course) => {
          const t = course.is_popular ? POPULAR_THEME : DEFAULT_THEME
          const contentItems: string[] = course.content?.map((c: { item: string }) => c.item) ?? []

          return (
            <div
              key={course.id}
              className={`w-[340px] rounded-2xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] hover:-translate-y-1.5 transition-all duration-300 ${t.cardBorder}`}
            >
              {/* Header */}
              <div className={`relative px-6 pt-6 pb-5 min-h-[110px] flex flex-col justify-end overflow-hidden ${t.headerBg}`}>
                <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-8 left-[60%] w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

                {course.is_popular && (
                  <div className="absolute top-4 right-4 bg-white text-amber-500 text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                    ✦ En Popüler
                  </div>
                )}

                <p className={`text-xs font-medium tracking-widest uppercase mb-1 ${t.levelColor}`}>
                  {course.subtitle}
                </p>
                <h2 className="text-white text-xl font-black leading-snug">{course.title}</h2>
              </div>

              {/* Body */}
              <div className="px-6 pt-5 pb-6">
                <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium mb-4">
                  <UsersIcon />
                  {course.students ?? '0+ Öğrenci'}
                </div>

                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Kurs İçeriği</p>
                <ul className="flex flex-col gap-2 mb-5">
                  {contentItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[13.5px] text-gray-500 leading-snug">
                      <CheckIcon checkBg={t.checkBg} checkColor={t.checkColor} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="h-px bg-gray-100 my-4" />

                {/* Fiyat */}
                {course.price ? (
                  <p className="text-sm font-bold text-gray-700 mb-4">
                    {course.price.toLocaleString('tr-TR')} ₺
                  </p>
                ) : (
                  
                  <a  href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 mb-4 transition-colors duration-300 w-fit"
                  >
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Fiyat için iletişime geçin
                  </a>
                )}

                
                <a  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3.5 rounded-xl text-white text-sm font-extrabold tracking-wide text-center transition-all duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] ${t.btnBg}`}
                >
                  Kursa Kayıt Ol
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}