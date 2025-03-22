import type React from "react"

import { useState } from "react"
import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Progress } from "@/Components/ui/progress"

interface FileContentDialogProps {
  isOpen: boolean
  onClose: () => void
  contentId: number
}

export default function FileContentDialog({ isOpen, onClose, contentId }: FileContentDialogProps) {
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)
  const [fileTypeError, setFileTypeError] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset, progress } = useForm({
    file_number: 0,
    title: "",
    file_url: null as File | null,
    content_id: contentId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("file-contents.store"), {
      onSuccess: () => {
        reset()
        onClose()
      },
      onError: (errors) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file type
      if (file.type !== "application/pdf") {
        setFileTypeError("Only PDF files are allowed")
        setData("file_url", null)
        return
      }

      // Check file size
      if (file.size > 1000 * 1024 * 1024) {
        setFileSizeError("File size must not exceed 1GB")
        setData("file_url", null)
        return
      }

      setFileSizeError(null)
      setFileTypeError(null)
      setData("file_url", file)
    } else {
      setData("file_url", null)
      setFileSizeError(null)
      setFileTypeError(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add PDF Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={data.title} onChange={(e) => setData("title", e.target.value)} />
              {errors.title && <p className="text-sm font-medium text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_number">Order</Label>
              <Input
                id="file_number"
                value={data.file_number === 0 ? "" : data.file_number}
                onChange={(e) => {
                  const inputValue = e.target.value
                  // If the input is empty, set to empty string temporarily
                  if (inputValue === "") {
                    setData("file_number", 0)
                  } else {
                    const newValue = Number.parseInt(inputValue, 10)
                    if (!isNaN(newValue)) {
                      setData("file_number", newValue)
                    }
                  }
                }}
                type="number"
                min="1"
              />
              {errors.file_number && <p className="text-sm font-medium text-destructive">{errors.file_number}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_url">PDF File</Label>
              <Input id="file_url" type="file" accept=".pdf,application/pdf" onChange={handleFileChange} />
              {fileTypeError && <p className="text-sm font-medium text-destructive">{fileTypeError}</p>}
              {fileSizeError && <p className="text-sm font-medium text-destructive">{fileSizeError}</p>}
              {progress && <Progress value={progress.percentage} className="h-2 mt-2" />}
              {errors.file_url && <p className="text-sm font-medium text-destructive">{errors.file_url}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={processing || !!fileSizeError || !!fileTypeError}>
              Add Content
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

