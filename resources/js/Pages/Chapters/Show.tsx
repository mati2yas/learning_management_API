import React from 'react'
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { BookOpen, Clock, List, Grid, ArrowLeft, Plus } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import ContentList from '../Contents/ContentList'
import ContentGrid from '../Contents/ContentGrid'
import { Chapter, Content, Quiz } from '@/types'
import CreateContentAlert from '../Contents/CreateContentAlert'
import QuizList from '../Quiz/QuizList'



interface ChapterDetailProps {
  chapter: Chapter
  contents: Content[]
  quizzes: Quiz[]
}

const Show: React.FC<ChapterDetailProps> = ({ 
  chapter,  
  contents,
  quizzes,
}) => {

  function setIsAddQuizModalOpen(arg0: boolean): void {
    throw new Error('Function not implemented.')
  }

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
      <Head title={`Chapter ${chapter.title}`} />
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
                    {/* <span>{contents.length} Contents</span> */}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {/* <span>Estimated Time: {chapter.estimated_time} mins</span> */}
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

                  {/* <Button onClick={() => {}}>
                    <Plus className="mr-2 h-4 w-4" /> Add Content
                  </Button> */}

                  <CreateContentAlert id={chapter.id} title={chapter.title}/>

                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list"><List className="w-4 h-4 mr-2" /> List View</TabsTrigger>
                    <TabsTrigger value="grid"><Grid className="w-4 h-4 mr-2" /> Grid View</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list">

                    <ContentList 
                      contents={contents} 
                    />

                  </TabsContent>
                  <TabsContent value="grid">
                    <ContentGrid 
                      contents={contents}
                    />
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

      {/* <AddQuizModal 
        isOpen={isAddQuizModalOpen} 
        onClose={() => setIsAddQuizModalOpen(false)} 
      /> */}


    </AuthenticatedLayout>
  )
}

export default Show