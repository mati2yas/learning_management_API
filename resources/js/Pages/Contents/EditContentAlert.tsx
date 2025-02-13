import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Edit2 } from "lucide-react";
import { Content } from "@/types"

interface EditContentAlertProps{
  content: Content;
}

const EditContentAlert = ({content}: EditContentAlertProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const { data, setData, put, processing, errors, reset} = useForm({
    name: content.name,
    order: content.order,
    chapter_id: content.chapter_id,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('contents.update', content.id), {
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
          <AlertDialogTitle>Edit Content {content.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Fill all the required data
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div >
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
                onChange={(e) => setData('order', Number(e.target.value))}
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
                  Edit Content
                </PrimaryButton>

            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditContentAlert
