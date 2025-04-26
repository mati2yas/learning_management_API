
import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useForm } from "@inertiajs/react";
import { User } from "./ShowDrawer";

interface AlertBanProps {
  user: User;
}

const AlertBan = ({user}: AlertBanProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  const {post, data, setData} = useForm({
    user_id: user.id
  })

  const submit:FormEventHandler =(e) =>{

    e.preventDefault()
    post(route('student-managements.ban'),{
      onSuccess: () => {
        closeDialog()
      },
      onError: (errors: any) => {
        console.log("Validation errors:", errors)
      },
    })

  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="bg-red-600 text-white p-2" onClick={() => setIsOpen(true)}>
          Ban
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will Ban <strong>{user.name + " "}</strong>
            
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction>
            <form onSubmit={submit}>
              <Button>
                Continue
              </Button>

            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertBan
