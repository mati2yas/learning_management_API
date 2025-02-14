"use client"

import { useState } from "react"
import { Head, Link, usePage } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { ArrowLeft, PlusCircle } from "lucide-react"

import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { Content, FileContent, YoutubeContent } from "@/types"
import EditYoutubeAlert from "../Youtube-Content/EditYoutubeAlert"
import DeleteYoutubeAlert from "../Youtube-Content/DeleteYoutubeAlert"
import EditFileContentAlert from "../File-Content/EditFileContentAlert"

import { SessionToast } from "@/Components/SessionToast"
import DeleteFileContentAlert from "../File-Content/DeleteFIleContentAlert"
import FileContentDialog from "./FIleContentDialog"
import YouTubeContentDialog from "./YoutTubeContentDialog"

interface ContentDetailProps {
  content: Content
  youtube_contents?: YoutubeContent[]
  file_contents?: FileContent[]
  chapter_id: number
  session: string
}

export default function ContentDetail({
  content,
  youtube_contents,
  file_contents,
  chapter_id,
  session,
}: ContentDetailProps) {
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

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const { flash } = usePage().props as unknown as { flash: { success?: string } };

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

      {flash.success && (<SessionToast message={flash.success }  />)}

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

                    {(youtube_contents ?? []).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <img
                          src={"/images/Video tutorial-bro.svg"}
                          alt="No data available"
                          className="w-[27rem] h-48"
                        />
                        <p className="text-gray-500 mt-4 text-lg">No Contents available. Start creating one!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {youtube_contents &&
                          Array.isArray(youtube_contents) &&
                          youtube_contents
                            .sort((a, b) => a.youtube_number - b.youtube_number)
                            .map((content) => {
                              const videoId = extractVideoId(content.url)
                              return (
                                <Card key={content.id} className="overflow-hidden">
                                  <CardHeader className="p-4">
                                    <CardTitle className="text-base font-medium truncate">{content.youtube_number}.  {content.title}</CardTitle>
                                  </CardHeader>
                                  {videoId && (
                                    <div className="aspect-video">
                                      <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={content.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    </div>
                                  )}
                                  <CardContent className="p-4">
                                    <a
                                      href={content.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline text-sm block truncate"
                                    >
                                      {content.url}
                                    </a>
                                    <div className="flex justify-end space-x-2 mt-2">
                                      <EditYoutubeAlert youtube_content={content} />
                                      <DeleteYoutubeAlert title={content.title} id={content.id} />
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                      </div>
                    )}
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

                    {(file_contents ?? []).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <img src={"/images/Files sent-rafiki.svg"} alt="No data available" className="w-[50rem] h-48" />
                        <p className="text-gray-500 mt-4 text-lg">No Contents available. Start creating one!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {file_contents &&
                          Array.isArray(file_contents) &&
                          file_contents
                            .sort((a, b) => a.file_number - b.file_number)
                            .map((content) => (
                              <Card key={content.id}>
                                <CardHeader className="p-4">
                                  <CardTitle className="text-base font-medium truncate">{content.file_number}. {content.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <Button
                                    variant="outline"
                                    className="w-full mb-2"
                                    onClick={() =>
                                      handleFileDownload("/" + "storage/" + content.file_url, content.title)
                                    }
                                  >
                                    Download File
                                  </Button>
                                  <div className="flex justify-end space-x-2">
                                    <EditFileContentAlert file_content={content} />
                                    <DeleteFileContentAlert id={content.id} title={content.title} />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                      </div>
                    )}
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

