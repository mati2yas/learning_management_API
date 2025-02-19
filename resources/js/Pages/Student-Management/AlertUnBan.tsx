
import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import PrimaryLink from "@/Components/PrimaryLink";
import { useForm } from "@inertiajs/react";

interface User {
  id: number;
  name: string;
}

interface AlertUnbanProps {
  user: User;
}

const AlertUnBan = ({user}: AlertUnbanProps 
) => {

  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  const {post, data, setData} = useForm({
    user_id: user.id
  })

  const submit:FormEventHandler =(e) =>{

    e.preventDefault()
    post(route('student-managements.unban'),{
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
        <Button variant={"outline"} className="bg-green-600 text-white p-2" onClick={() => setIsOpen(true)}>
          UnBan
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
             This will UnBan <strong>{user.name + " "}</strong>
            
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

export default AlertUnBan
