import {FormEventHandler, useEffect, useState } from "react"
import { useForm } from "@inertiajs/react"
import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button"
import InputError from "@/Components/InputError"
import { FileContent, YoutubeContent } from "@/types"
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import { Edit2 } from "lucide-react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Input } from "@headlessui/react";

interface EditFileContentAlertProps {
  file_content: FileContent
}

export default function EditFileContentAlert({ file_content }: EditFileContentAlertProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset, progress } = useForm({
    _method: "PATCH",
    title: file_content.title,
    file_url: null as File | null,
    content_id: file_content.content_id,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('file-contents.update', file_content.id), {
      onSuccess: () => {
          // toast('A course has been created')
          setIsOpen(false); // Only close on successful submission
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
      },
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 50 * 1024 * 1024) {
        setFileSizeError("File size must not exceed 50MB")
        setData("file_url", null)
       
      } else {
        setFileSizeError(null)
        setData("file_url", file)
        const reader = new FileReader()
      }
    } else {
      setData("file_url", null)
      setFileSizeError(null)
    }
  }


  return (
  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => setIsOpen(true)}>
          <Edit2 className="h-4 w-4 mr-1" /> Edit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit File Content {file_content.title}</AlertDialogTitle>
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
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              <InputError message={errors.title} className="mt-2" />
            </div>


            <div className="mb-4">
              <InputLabel htmlFor="file_url" value="File Content" />
              <Input
                id="file_url"
                name="file_url"
                type="file"
                onChange={handleFileChange}
                required
              />

              {fileSizeError && <p className="text-red-500 text-sm">{fileSizeError}</p>}

              {progress && (
                <progress value={progress.percentage} max="100" className="w-full h-2 bg-gray-200 rounded-lg mt-2">
                  {progress.percentage}%
                </progress>
              )}

              <InputError message={errors.file_url} className="mt-2" />
            </div>

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel onClick={() => {
              setIsOpen(false);
              reset();
            }}>
                Cancel
              </AlertDialogCancel>
             
                <PrimaryButton type="submit" disabled={processing}>
                  Edit Content
                </PrimaryButton>

            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

