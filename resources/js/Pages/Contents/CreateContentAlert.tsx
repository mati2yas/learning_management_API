import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";

interface CreateContentAlertProps {
  id: number;
  title: string;
}

const CreateContentAlert = ({id, title}:CreateContentAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data, setData, post, processing, errors, reset} = useForm({
    name: '',
    order: '',
    chapter_id: id,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('contents.store'), {
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
          <PlusCircle className="w-5 h-5 mr-2" /> Add Content
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a content for {title}</AlertDialogTitle>
          <AlertDialogDescription>
            Fill all the required data
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className=" justify-center items-center">
          <form onSubmit={submit}>

            <div className="mb-4">
              <InputLabel htmlFor="name" value="Content Title" />
              <TextInput
                id="name"
                name="name"
                className="w-full"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              <InputError message={errors.name} className="mt-2" />
            </div>


            <div className="mb-4">
              <InputLabel htmlFor="order" value="Content Order" />
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

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel onClick={() => {
              setIsOpen(false);
              reset();
            }}>
                Cancel
              </AlertDialogCancel>

                <PrimaryButton type="submit" disabled={processing}>
                  Add Content
                </PrimaryButton>
          
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateContentAlert
