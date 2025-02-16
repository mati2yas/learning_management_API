import { type FormEventHandler, useState, type ChangeEvent, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { useForm } from "@inertiajs/react"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Pencil } from "lucide-react"
import type { CarouselContent } from "@/types"
import { Textarea } from "@/Components/ui/textarea"
import { usePage } from "@inertiajs/react"

interface EditCarouselContentAlertProps {
  content: CarouselContent
}

const EditCarouselContentAlert = ({ content }: EditCarouselContentAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)


  const { data, setData, post, processing, errors, reset } = useForm({
    _method: "PATCH",
    tag: content.tag,
    image_url: null as File | null,
    status: content.status,
    order: content.order,
  })

  useEffect(() => {
    setImagePreview(`/storage/${content.image_url}`)
  }, [content.image_url])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData("image_url", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setData("image_url", null)
      setImagePreview(`/storage/${content.image_url}`)
    }
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("carousel-contents.update", content.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
      },
      onError: (errors) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Carousel Content</AlertDialogTitle>
          <AlertDialogDescription>Update the carousel content item</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submit}>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            <div className="mb-4">
              <InputLabel htmlFor="tag" value="Tag" />
              <Textarea
                className="w-full"
                id="tag"
                name="tag"
                value={data.tag}
                onChange={(e) => setData("tag", e.target.value)}
                required
              />
              <InputError message={errors.tag} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="image_url" value="Image" />
              <input id="image_url" type="file" onChange={handleImageChange} className="mt-1 block w-full" />
              <InputError message={errors.image_url} className="mt-2" />
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="mt-2 max-w-full h-auto max-h-40 object-contain"
                />
              )}
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="status" value="Status" />
              <select
                id="status"
                name="status"
                value={data.status}
                onChange={(e) => setData("status", e.target.value as "active" | "not-active")}
                className="mt-1 block w-full"
                required
              >
                <option value="active">Active</option>
                <option value="not-active">Not Active</option>
              </select>
              <InputError message={errors.status} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="order" value="Order" />
              <TextInput
                id="order"
                name="order"
                type="number"
                value={data.order.toString()}
                onChange={(e) => setData("order", Number.parseInt(e.target.value, 10))}
                required
              />
              <InputError message={errors.order} className="mt-2" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-x-2">
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false)
                reset()
              }}
            >
              Cancel
            </AlertDialogCancel>

            <PrimaryButton type="submit" disabled={processing}>
              Update Content
            </PrimaryButton>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditCarouselContentAlert

