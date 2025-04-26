import { useState } from "react"
import { useForm } from "@inertiajs/react" 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"

interface TextContentDialogProps {
  isOpen: boolean
  onClose: () => void
  contentId: number
}

export default function TextContentDialog({ isOpen, onClose, contentId }: TextContentDialogProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    description: "",
    content_id: contentId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("text-content.store"), {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Text Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={processing}>
              Add Content
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

