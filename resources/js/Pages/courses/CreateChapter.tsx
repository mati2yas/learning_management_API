import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/Components/ui/textarea";

interface CreateChapterAlertProps {
  id: number;
  course_name: string;
}

const CreateChapter = ({id, course_name}:CreateChapterAlertProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, post, processing, errors, reset} = useForm({
    title: '',
    order: '',
    description: '',
    course_id: id,
  });


  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('chapters.store'), {
      onSuccess: () => {
          // toast('A course has been created')
          setIsOpen(false); // Only close on successful submission
          reset();
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
      },
    });
  };


  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add Chapter
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Chapter for {course_name}</AlertDialogTitle>
          <AlertDialogDescription>
            Fill all the required data
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className=" justify-center ">
          <form onSubmit={submit}>

            <div className="mb-4 w-full">
              <InputLabel htmlFor="title" value="Chapter Title" />
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


            <div className="mb-4">
              <InputLabel htmlFor="order" value="Chapter Order" />
              <TextInput
                id="order"
                name="order"
                type="number"
                className="w-full"
                value={data.order}
                onChange={(e) => setData('order', e.target.value)}
                required
              />
              <InputError message={errors.order} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="description" value="Chapter Description" />
              <Textarea
                id="description"
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
              <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel onClick={() => {
              setIsOpen(false);
              reset();
            }}>
                Cancel
              </AlertDialogCancel>

                <PrimaryButton type="submit" disabled={processing}>
                  Add Chapter
                </PrimaryButton>
          
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateChapter
