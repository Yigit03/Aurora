// app/(site)/exam/page.tsx

import { getExamQuestions } from './actions'
import ExamClient from './ExamClient'
import PageTitle from '@/components/layouts/PageTitle'

export const metadata = {
  title: 'Seviye Testi | Aurora Dil Eğitim Merkezi',
  description: 'Ücretsiz Almanca seviye tespitiyle başlangıç noktanızı belirleyin.',
}

export default async function ExamPage() {
  const questions = await getExamQuestions()

  return (
    <div>
      <PageTitle
        title="Almanca Seviye Testi"
        text="Ücretsiz seviye tespitiyle size en uygun kursu bulun"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ExamClient questions={questions} />
      </div>
    </div>
  )
}