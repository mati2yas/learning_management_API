import React, { useState } from 'react'
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { BookOpen, Clock, List, Grid, ArrowLeft, Plus } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import ContentList from '../Contents/ContentList'
import ContentGrid from '../Contents/ContentGrid'
import QuizList from '../Quiz/QuizList'
import AddContentModal from '../Contents/AddContentModal'
import AddQuizModal from '../Quiz/AddQuizModal'

// Dummy data (to be used alongside real prop data for future integration)
const dummyChapter = {
  id: 1,
  title: "Introduction to React Hooks",
  description: "Learn the basics of React Hooks and how they can simplify your React components.",
  estimated_time: 45,
}

const dummyContents = [
  { id: 1, name: "What are React Hooks?", url: "https://example.com/video1.mp4", type: "video" },
  { id: 2, name: "useState Hook", url: "https://example.com/doc1.pdf", type: "pdf" },
  { id: 3, name: "useEffect Hook", url: "https://example.com/video2.mp4", type: "video" },
  { id: 4, name: "Custom Hooks", url: "https://example.com/doc2.pdf", type: "pdf" },
]

const dummyQuizzes = [
  {
    id: 1,
    title: "React Hooks Basics",
    questionCount: 5,
  },
  {
    id: 2,
    title: "Advanced Hooks Usage",
    questionCount: 8,
  },
]

interface ChapterDetailProps {
  chapter: typeof dummyChapter
  contents: typeof dummyContents
  quizzes: typeof dummyQuizzes
}

const Show: React.FC<ChapterDetailProps> = ({ 
  chapter = dummyChapter, 
  contents = dummyContents, 
  quizzes = dummyQuizzes 
}) => {
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false)
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false)

  return (
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-semibold">Chapter: {chapter.title}</h1>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
          </Button>
        </div>
      }
    >
      <Head title={`Admin: Chapter ${chapter.title}`} />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold mb-4">{chapter.title}</h2>
                <p className="text-gray-600 mb-4">{chapter.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span>{contents.length} Contents</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Estimated Time: {chapter.estimated_time} mins</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Chapter Contents</CardTitle>
                  <Button onClick={() => setIsAddContentModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list"><List className="w-4 h-4 mr-2" /> List View</TabsTrigger>
                    <TabsTrigger value="grid"><Grid className="w-4 h-4 mr-2" /> Grid View</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list">
                    <ContentList contents={contents} />
                  </TabsContent>
                  <TabsContent value="grid">
                    <ContentGrid contents={contents} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Chapter Quizzes</CardTitle>
                  <Button onClick={() => setIsAddQuizModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Quiz
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <QuizList quizzes={quizzes} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddContentModal 
        isOpen={isAddContentModalOpen} 
        onClose={() => setIsAddContentModalOpen(false)} 
      />
      <AddQuizModal 
        isOpen={isAddQuizModalOpen} 
        onClose={() => setIsAddQuizModalOpen(false)} 
      />
    </AuthenticatedLayout>
  )
}

export default Show