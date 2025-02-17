"use client"

import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import InputError from "@/Components/InputError"

interface YouTubeContentDialogProps {
  isOpen: boolean
  onClose: () => void
  contentId: number
}

export default function YouTubeContentDialog({ isOpen, onClose, contentId }: YouTubeContentDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    youtube_number: 0,
    title: "",
    url: "",
    content_id: contentId,
  })

  const [videoId, setVideoId] = useState("")

  useEffect(() => {
    // Extract video ID from URL
    const extractVideoId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      return match && match[2].length === 11 ? match[2] : null
    }

    const id = extractVideoId(data.url)
    setVideoId(id || "")
  }, [data.url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("youtube-contents.store"), {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Video Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                className="col-span-3"
              />
              <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
              <Label htmlFor="order" className="text-right">
                Order
              </Label>
              <Input
                id="order"
                value={data.youtube_number}
                onChange={(e) => setData("youtube_number", Number(e.target.value))}
                className="col-span-3"
                type="number"
              />
              <InputError message={errors.youtube_number} className="mt-2" />
            </div>

            <div>
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={data.url}
                onChange={(e) => setData("url", e.target.value)}
                className="col-span-3"
              />
              <InputError message={errors.url} className="mt-2" />
            </div>

            {videoId && (
              <div className="aspect-video">
                <iframe
                  width="90%"
                  height="90%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={processing}>
              Add Content
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

