"use client"

import { type FormEventHandler, useState } from "react"
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
import { Edit2 } from "lucide-react"
import type { CarouselContent } from "@/types"


interface EditCarouselContentAlertProps {
  content: CarouselContent
}

const EditCarouselContentAlert = ({ content }: EditCarouselContentAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { data, setData, put, processing, errors, reset } = useForm({
    tag: content.tag,
    image_url: content.image_url,
    status: content.status,
    order: content.order,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    put(route("carousel-contents.update", content.id), {
      onSuccess: () => {
        setIsOpen(false)
      },
      onError: (errors) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => setIsOpen(true)}
        >
          <Edit2 className="h-4 w-4 mr-1" /> Edit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Carousel Content</AlertDialogTitle>
          <AlertDialogDescription>Update the carousel content details</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center items-center">
          <form onSubmit={submit}>
            <div className="mb-4">
              <InputLabel htmlFor="tag" value="Tag" />
              <TextInput
                id="tag"
                name="tag"
                value={data.tag}
                onChange={(e) => setData("tag", e.target.value)}
                required
              />
              <InputError message={errors.tag} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="image_url" value="Image URL" />
              <TextInput
                id="image_url"
                name="image_url"
                value={data.image_url}
                onChange={(e) => setData("image_url", e.target.value)}
                required
              />
              <InputError message={errors.image_url} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="status" value="Status" />
              <select
                id="status"
                name="status"
                value={data.status}
                onChange={(e) => setData("status", e.target.value as "active" | "non-active")}
                className="mt-1 block w-full"
                required
              >
                <option value="active">Active</option>
                <option value="non-active">Not Active</option>
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
                onChange={(e) => setData("order", Number.parseInt(e.target.value))}
                required
              />
              <InputError message={errors.order} className="mt-2" />
            </div>

            <div className="mt-6 flex gap-x-2">
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
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditCarouselContentAlert

