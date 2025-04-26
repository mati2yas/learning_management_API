
import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import InputError from "@/Components/InputError"
import EditQuizAlert from '../Quiz/EditQuizAlert';

interface EditQuizAlertProps {
  isOpen: boolean
  onClose: () => void
  contentId: number
}

export default function YouTubeContentDialog({ isOpen, onClose, contentId }: EditQuizAlertProps) {

  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    url: "",
    content_id: contentId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("youtube-content.store"), {
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
          <DialogTitle>Add YouTube Content</DialogTitle>
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
              <InputError message={errors.title} className="mt-2" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
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

