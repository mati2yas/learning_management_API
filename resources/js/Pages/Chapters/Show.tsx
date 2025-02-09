import React from 'react'
import { Head, Link } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { BookOpen, List, Grid, ArrowLeft, Clapperboard, PlusCircle } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import ContentList from '../Contents/ContentList'
import ContentGrid from '../Contents/ContentGrid'
import { Chapter, Content, Quiz } from '@/types'
import CreateContentAlert from '../Contents/CreateContentAlert'
import QuizList from '../Quiz/QuizList'
import CreateQuizAlert from '../Quiz/CreateQuizAlert'
import PermissionAlert from '@/Components/PermissionAlert'
import { SessionToast } from '@/Components/SessionToast'

interface ChapterDetailProps {
  chapter: Chapter
  contents: Content[]
  quizzes: Quiz[]
  course_id: number
  contentsCount: number
  quizzesCount: number

  canAddContents: boolean
  canUpdateContents:boolean
  canDeleteContents:boolean
  canViewContents: boolean

  canAddQuizzes: boolean
  canUpdateQuizzes: boolean
  canDeleteQuizzes: boolean



  session: string
}

const Show: React.FC<ChapterDetailProps> = ({ 
  chapter,  
  contents,
  quizzes,
  course_id,
  contentsCount,
  quizzesCount,

  canAddContents,
  canUpdateContents,
  canDeleteContents,
  canViewContents,
  
  canAddQuizzes,
  canUpdateQuizzes,
  canDeleteQuizzes,
  session,
}) => {

  console.log(session)

  return (
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-semibold">Chapter: {chapter.title}</h1>

        <Link href={route('courses.show', course_id)}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
          </Button>
        </Link>
        </div>
      }
    >
      <Head title={`Chapter - ${chapter.title}`} />
      {
        session ? <SessionToast message={session}/> : null
      }
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
                    <span>{contentsCount} Contents</span>
                  </div>
                  <div className="flex items-center">
                    <Clapperboard className="w-5 h-5 mr-2" />
                    <span>{quizzesCount} quizzes</span>
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

                  {
                    canAddContents ?  <CreateContentAlert id={chapter.id} title={chapter.title}/> : <PermissionAlert 
                      children={'Add Content'}
                      permission='add a content'
                      buttonVariant={'outline'}
                      className='p-2 text-xs'
                      icon={<PlusCircle className='w-5 h-5 mr-2' />}
                    />
                  }

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
                      canEdit={canUpdateContents} 
                      canDelete={canDeleteContents} 
                      canView={canViewContents}
                    />

                  </TabsContent>
                  <TabsContent value="grid">

                    <ContentGrid 
                      contents={contents}
                      canDelete={canDeleteContents}
                      canEdit={canUpdateContents}
                      canView={canViewContents}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Chapter Quizzes</CardTitle>

                    {
                      canAddQuizzes ?  <CreateQuizAlert id={chapter.id} chapter_title={chapter.title}/> : <PermissionAlert 
                        children={'Add Quizzes'}
                        permission='add a quiz'
                        buttonVariant={'outline'}
                        className='p-2 text-xs'
                        icon={<PlusCircle className='w-5 h-5 mr-2' />}
                      />
                    }
                    {/* <CreateQuizAlert id={chapter.id} chapter_title={chapter.title}/> */}
                </div>
              </CardHeader>
              <CardContent>
                <QuizList quizzes={quizzes} canAddQuizzes={canAddQuizzes} canUpdateQuizzes={canUpdateQuizzes} canDeleteQuizzes={canDeleteQuizzes} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  )
}

export default Show