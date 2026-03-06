// app/admin/(dashboard)/courses/edit/[id]/page.tsx

import { getCourseById } from '../../actions'
import EditCourseForm from './EditCourseForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = await getCourseById(id)

  if (!course) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Kurs Düzenle</h1>
          <p className="text-slate-400 text-sm mt-1">{course.title}</p>
        </div>
      </div>
      <EditCourseForm id={course.id} initialData={course} />
    </div>
  )
}