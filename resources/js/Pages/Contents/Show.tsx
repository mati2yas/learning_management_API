import { useState } from "react"
import { Head, Link } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { ArrowLeft, PlusCircle } from "lucide-react"
import YouTubeContentDialog from "./YoutTubeContentDialog"
import FileContentDialog from "./FIleContentDialog"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { Content, FileContent, YoutubeContent } from "@/types"
import EditYoutubeAlert from "../Youtube-Content/EditYoutubeAlert"
import DeleteYoutubeAlert from "../Youtube-Content/DeleteYoutubeAlert"
import EditFileContentAlert from "../File-Content/EditFileContentAlert"
import DeleteFileContentAlert from "../File-Content/DeleteFIleContentAlert"

interface ContentDetailProps {
  content: Content
  youtube_contents?: YoutubeContent[]
  file_contents?: FileContent[]
  chapter_id: number
}

export default function ContentDetail({ content, youtube_contents, file_contents, chapter_id }: ContentDetailProps) {

  // console.log()
  const [isYouTubeDialogOpen, setIsYouTubeDialogOpen] = useState(false)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      })
      .catch(() => alert("An error occurred while downloading the file."))
  }

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Content: {content.name}</h1>
          <Link href={route("chapters.show", chapter_id)}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
            </Button>
          </Link>
        </div>
      }
    >
      <Head title={`Content -  ${content.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">{content.name}</h1>
            <Tabs defaultValue="youtube" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="youtube">Video Content</TabsTrigger>
                <TabsTrigger value="file">File Content</TabsTrigger>
              </TabsList>
              <TabsContent value="youtube">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Content</CardTitle>
                    <CardDescription>Manage Video content for this chapter.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsYouTubeDialogOpen(true)} className="mb-4">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Video Content
                    </Button>

                    {youtube_contents &&
                      Array.isArray(youtube_contents) &&
                      youtube_contents.map((content) => (
                        <div key={content.id} className="mb-4 p-4 border rounded flex justify-between">
                          <div>
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
                          <div>
                            <EditYoutubeAlert youtube_content={content} />
                            <DeleteYoutubeAlert title={content.title} id={content.id} />
                          </div>
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
                    {file_contents &&
                      Array.isArray(file_contents) &&
                      file_contents.map((content) => (
                        <div key={content.id} className="mb-4 p-4 border rounded flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{content.title}</h3>
                            <Button
                              variant="link"
                              className="text-blue-500 hover:underline p-0"
                              onClick={() => {
                                console.log(content.file_url)
                                return handleFileDownload('/'+'storage/'+content.file_url, content.title)}}
                            >
                              Download File
                            </Button>
                          </div>
                          <div>
                            <EditFileContentAlert file_content={content} />
                            <DeleteFileContentAlert id={content.id} title={content.title} />
                          </div>
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
          <FileContentDialog
            isOpen={isFileDialogOpen}
            onClose={() => setIsFileDialogOpen(false)}
            contentId={content.id}
          />
        </div>
      </div>
    </Authenticated>
  )
}

