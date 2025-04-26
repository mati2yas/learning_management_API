import {FormEventHandler, useState } from "react"
import { useForm } from "@inertiajs/react"
import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button"
import InputError from "@/Components/InputError"
import { YoutubeContent } from "@/types"
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import { Edit2 } from "lucide-react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

interface EditYoutubeAlertProps {
  youtube_content: YoutubeContent
}

export default function EditYoutubeAlert({ youtube_content }: EditYoutubeAlertProps) {

  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    youtube_number: youtube_content.youtube_number,
    title: youtube_content.title,
    url: youtube_content.url,
    content_id: youtube_content.content_id,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('youtube-contents.update', youtube_content.id), {
      onSuccess: () => {
          // toast('A course has been created')
          setIsOpen(false); // Only close on successful submission
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
      },
    });
  };
  

  return (
  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => setIsOpen(true)}>
          <Edit2 className="h-4 w-4 mr-1" /> Edit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Video Content {youtube_content.title}</AlertDialogTitle>
          <AlertDialogDescription>
            Fill all the required data
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <form onSubmit={submit}>
            <div className="mb-4">
              <InputLabel htmlFor="title" value="Video Title" />
              <TextInput
                id="title"
                name="title"
                value={data.title}
                className="w-full"
                onChange={(e) => setData('title', e.target.value)}
                required
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
                className="col-span-3 w-full"
                type="number"
              />
              <InputError message={errors.youtube_number} className="mt-2" />
            </div>


            <div className="mb-4">
              <InputLabel htmlFor="url" value="Video URL" />
              <TextInput
                id="url"
                name="url"
                type="url"
                className="w-full"
                value={data.url}
                onChange={(e) => setData('url', e.target.value)}
                required
              />
              <InputError message={errors.url} className="mt-2" />
            </div>

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel onClick={() => {
              setIsOpen(false);
              reset();
            }}>
                Cancel
              </AlertDialogCancel>
             
                <PrimaryButton type="submit" disabled={processing}>
                  Edit Video
                </PrimaryButton>

            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

