import { useState } from "react"
import { Head } from "@inertiajs/react"

import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { ArrowLeft, PlusCircle } from "lucide-react"
import YouTubeContentDialog from "./YoutTubeContentDialog" 
import TextContentDialog from "./TextContentDialog" 
import FileContentDialog from "./FIleContentDialog" 

import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Content, FileContent, TextContent, YoutubeContent } from "@/types"

interface ContentDetailProps {
  content: Content,
  youtube_contents?: YoutubeContent[]
  text_contents: TextContent[]
  file_contents: FileContent[]
}

const dummyYouTubeContents: YoutubeContent[] = [
  {
    id: 1,
    title: 'Dummy YouTube Video 1',
    url: 'https://www.youtube.com/watch?v=dummy1',
    content_id: 1
  },
  {
    id: 2,
    title: 'Dummy YouTube Video 2',
    url: 'https://www.youtube.com/watch?v=dummy2',
    content_id: 2
  },
];

const dummyTextContents: TextContent[] = [
  {
    id: 1,
    content_id: 1,
    title: 'Dummy Text Content 1',
    description: 'This is the description for dummy text content 1.',
  },
  {
    id: 2,
    content_id: 1,
    title: 'Dummy Text Content 2',
    description: 'This is the description for dummy text content 2.',
  },
];

const dummyFileContents: FileContent[] = [
  {
    id: 1,
    content_id: 1,
    title: 'Dummy File Content 1',
    file_url: 'https://example.com/dummyfile1.pdf',
  },
  {
    id: 2,
    content_id: 1,
    title: 'Dummy File Content 2',
    file_url: 'https://example.com/dummyfile2.pdf',
  },
];

export default function ContentDetail({
  content,
  youtube_contents = dummyYouTubeContents,
  text_contents=dummyTextContents,
  file_contents=dummyFileContents,
}: ContentDetailProps) {

  const [isYouTubeDialogOpen, setIsYouTubeDialogOpen] = useState(false)
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  return (
    <Authenticated 
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Content: {content.name}
          </h1>

          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
          </Button>
        </div>
      }
    >
      <Head title={`Content: ${content.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{content.name}</h1>
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="youtube">YouTube Content</TabsTrigger>
            <TabsTrigger value="text">Text Content</TabsTrigger>
            <TabsTrigger value="file">File Content</TabsTrigger>
          </TabsList>
          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <CardTitle>YouTube Content</CardTitle>
                <CardDescription>Manage YouTube content for this chapter.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsYouTubeDialogOpen(true)} className="mb-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add YouTube Content
                </Button>
                {youtube_contents.map((content) => (
                  <div key={content.id} className="mb-4 p-4 border rounded">
                    <h3 className="text-lg font-semibold">{content.title}</h3>
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {content.url}
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Text Content</CardTitle>
                <CardDescription>Manage text content for this chapter.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsTextDialogOpen(true)} className="mb-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Text Content
                </Button>
                {text_contents.map((content) => (
                  <div key={content.id} className="mb-4 p-4 border rounded">
                    <h3 className="text-lg font-semibold">{content.title}</h3>
                    <p className="mt-2">{content.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>File Content</CardTitle>
                <CardDescription>Manage file content for this chapter.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsFileDialogOpen(true)} className="mb-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add File Content
                </Button>
                {file_contents.map((content) => (
                  <div key={content.id} className="mb-4 p-4 border rounded">
                    <h3 className="text-lg font-semibold">{content.title}</h3>
                    <a
                      href={content.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download File
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

        <YouTubeContentDialog
          isOpen={isYouTubeDialogOpen}
          onClose={() => setIsYouTubeDialogOpen(false)}
          contentId={content.id}
        />
        <TextContentDialog isOpen={isTextDialogOpen} onClose={() => setIsTextDialogOpen(false)} contentId={content.id} />

        <FileContentDialog isOpen={isFileDialogOpen} onClose={() => setIsFileDialogOpen(false)} contentId={content.id} />

        </div>


      </div>

      
    </Authenticated>
  )
}

