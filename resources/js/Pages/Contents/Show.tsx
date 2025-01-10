import React from 'react'
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Chapter, Content, Quiz } from "@/types"
import { BookOpen, Clock, List, Grid, ArrowLeft } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Progress } from "@/Components/ui/progress"
import ContentViewer from './ContentViewer'
import QuizSection from '@/Components/QuizSection'

interface ChapterDetailProps {
  chapter: Chapter
  contents: Content[]
  quiz: Quiz | null
}

const ChapterDetail = ({ chapter, contents, quiz }: ChapterDetailProps) => {
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
      <Head title={`Chapter: ${chapter.title}`} />
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
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress value={60} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chapter Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="list" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="list"><List className="w-4 h-4 mr-2" /> List View</TabsTrigger>
                      <TabsTrigger value="grid"><Grid className="w-4 h-4 mr-2" /> Grid View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="list">
                      <div className="space-y-4">
                        {contents.map((content, index) => (
                          <ContentListItem key={content.id} content={content} index={index} />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="grid">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contents.map((content, index) => (
                          <ContentGridItem key={content.id} content={content} index={index} />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Content Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentViewer url={contents[0]?.url || ''} />
                </CardContent>
              </Card>

              {quiz && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chapter Quiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuizSection quiz={quiz} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

interface ContentItemProps {
  content: Content
  index: number
}

const ContentListItem = ({ content, index }: ContentItemProps) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-4">
      {index + 1}
    </div>
    <div className="flex-grow">
      <h3 className="font-semibold">{content.name}</h3>
      <p className="text-sm text-gray-600">{getContentTypeLabel(content.url)}</p>
    </div>
    <Button variant="outline" size="sm">View</Button>
  </div>
)

const ContentGridItem = ({ content, index }: ContentItemProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-2">
          {index + 1}
        </div>
        <h3 className="font-semibold">{content.name}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">{getContentTypeLabel(content.url)}</p>
      <Button variant="outline" size="sm" className="w-full">View Content</Button>
    </CardContent>
  </Card>
)

const getContentTypeLabel = (url: string): string => {
  if (url.match(/\.(mp4|webm|ogg)$/i)) return 'Video'
  if (url.match(/\.(pdf)$/i)) return 'PDF Document'
  return 'Document'
}

export default ChapterDetail

