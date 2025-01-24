import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Edit2 } from "lucide-react";
import {  Quiz, YoutubeContent } from "@/types";

interface EditQuizAlertProps {
  quiz: Quiz;
}

const EditQuizAlert = ({quiz}:EditQuizAlertProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, put, processing, errors, reset} = useForm({
    title: quiz.title,
    chapter_id: quiz.chapter_id,
  });


  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('quizzes.update', quiz.id), {
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
          <AlertDialogTitle>Edit Quiz {quiz.title}</AlertDialogTitle>
          <AlertDialogDescription>
            Fill all the required data
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center items-center">
          <form onSubmit={submit}>
            <div className="mb-4">
              <InputLabel htmlFor="title" value="Chapter Title" />
              <TextInput
                id="title"
                name="title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              <InputError message={errors.title} className="mt-2" />
            </div>


            {/* <div className="mb-4">
              <InputLabel htmlFor="order" value="Chapter Order" />
              <input
                id="order"
                name="order"
                type="number"
                value={data.order}
                onChange={(e) => setData('order', e.target.value)}
                required
              />
              <InputError message={errors.order} className="mt-2" />
            </div> */}

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel onClick={() => {
              setIsOpen(false);
              reset();
            }}>
                Cancel
              </AlertDialogCancel>
             
                <PrimaryButton type="submit" disabled={processing}>
                  Edit Chapter
                </PrimaryButton>

            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditQuizAlert;
