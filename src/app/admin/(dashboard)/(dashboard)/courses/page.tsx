// app/admin/(dashboard)/courses/page.tsx
import { cookies } from 'next/headers'
import { verifyAccesToken } from '@/lib/jwt'
import { getCourses } from './actions'
import Link from 'next/link'
import DeleteCourseButton from './DeleteCourseButton'

export default async function CoursesPage() {
  const courses = await getCourses()

    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    const currentUser = token ? await verifyAccesToken(token) : null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Kurslar</h1>
          <p className="text-slate-400 text-sm mt-1">Tüm kurs paketlerini yönetin</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kurs
        </Link>
      </div>

      {/* Kurs Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`relative rounded-2xl border p-6 flex flex-col gap-4 transition-all ${
              course.is_popular
                ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/40'
                : 'bg-slate-800 border-white/10'
            }`}
          >
            {/* Popüler Badge */}
            {course.is_popular && (
              <div className="absolute -top-3 left-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ Popüler
                </span>
              </div>
            )}

            {/* Üst Bilgi */}
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                course.is_popular ? 'text-blue-400' : 'text-slate-400'
              }`}>
                {course.subtitle}
              </p>
              <h3 className="text-lg font-bold text-white">{course.title}</h3>
              <p className="text-xs text-slate-400 mt-1">👥 {course.students}</p>
            </div>

            {/* İçerik Listesi */}
            <ul className="space-y-1.5">
              {course.content?.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg className={`w-4 h-4 shrink-0 ${course.is_popular ? 'text-blue-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item.item}
                </li>
              ))}
            </ul>

            {/* Fiyat */}
            <div className="mt-auto pt-4 border-t border-white/10">
              {course.price ? (
                <p className={`text-xl font-bold ${course.is_popular ? 'text-blue-400' : 'text-white'}`}>
                  {course.price.toLocaleString('tr-TR')} ₺
                </p>
              ) : (
                
                <a  href="https://wa.me/905XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.849L0 24l6.335-1.498A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.502-5.184-1.381l-.372-.22-3.862.913.961-3.752-.242-.386A9.959 9.959 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Fiyat için iletişime geçiniz
                </a>
              )}
            </div>

            {/* Durum + İşlemler */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                course.is_published
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-500/20 text-slate-400'
              }`}>
                {course.is_published ? 'Yayında' : 'Taslak'}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/courses/edit/${course.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Düzenle
                </Link>

                {currentUser?.role !== 'editor' && (
                  <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                )}     
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-white/10">
          <p className="text-slate-500 text-sm">Henüz kurs bulunmuyor</p>
          <Link href="/admin/courses/create" className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm">
            İlk kursu oluştur →
          </Link>
        </div>
      )}
    </div>
  )
}