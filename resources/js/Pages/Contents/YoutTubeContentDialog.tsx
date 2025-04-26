import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card } from "@/Components/ui/card"

interface YouTubeContentDialogProps {
  isOpen: boolean
  onClose: () => void
  contentId: number
}

export default function YouTubeContentDialog({ isOpen, onClose, contentId }: YouTubeContentDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    youtube_number: 1,
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={data.title} onChange={(e) => setData("title", e.target.value)} />
              {errors.title && <p className="text-sm font-medium text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                value={data.youtube_number === 0 ? "" : data.youtube_number}
                onChange={(e) => {
                  const inputValue = e.target.value
                  // If the input is empty, set to empty string temporarily
                  if (inputValue === "") {
                    setData("youtube_number", 0)
                  } else {
                    const newValue = Number.parseInt(inputValue, 10)
                    if (!isNaN(newValue)) {
                      setData("youtube_number", newValue)
                    }
                  }
                }}
                type="number"
                min="1"
              />
              {errors.youtube_number && <p className="text-sm font-medium text-destructive">{errors.youtube_number}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={data.url}
                onChange={(e) => setData("url", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {errors.url && <p className="text-sm font-medium text-destructive">{errors.url}</p>}
            </div>

            {videoId && (
              <Card className="overflow-hidden mt-4">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </Card>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={processing}>
              Add Content
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

