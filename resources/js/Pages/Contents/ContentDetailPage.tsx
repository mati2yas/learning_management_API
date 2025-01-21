import React from 'react'
import { Head } from '@inertiajs/react' 
import ContentViewer from './ContentViewer'
import ChapterSidebar from '@/Components/ChapterSidebar'
import QuizSection from '@/Components/QuizSection'

interface Content {
  content_id: string
  chapter_id: string
  name: string
  order: number
  url: string
}

interface Chapter {
  chapter_id: string
  crs_id: string
  order: number
  title: string
  contents: Content[]
}

interface Quiz {
  id: number
  quiz_id: string
  chapter_id: number
  questions: QuizQuestion[]
}

interface QuizQuestion {
  question_number: number
  quiz_id: string
  text: string
  question_image_url: string | null
  text_explanation: string
  video_explanation_url: string | null
  options: string[]
  answer: number
}

interface ContentDetailPageProps {
  content: Content
  chapters: Chapter[]
  quiz: Quiz
}

export default function ContentDetailPage({ content, chapters, quiz }: ContentDetailPageProps) {
  return (
    <>
      <Head title={content.name} />
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <ChapterSidebar currentContentId={content.content_id} chapters={chapters} />
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold mb-6">{content.name}</h1>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <ContentViewer url={content.url} type={''} />
            </div>
            <div>
              {/* <QuizSection quiz={quiz} /> */}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

