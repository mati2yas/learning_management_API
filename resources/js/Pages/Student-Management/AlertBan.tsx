
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import PrimaryLink from "@/Components/PrimaryLink";

interface User {
  id: number;
  name: string;
}

interface AlertBanProps {
  user: User;
}

const AlertBan = ({user}: AlertBanProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

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
            <PrimaryLink
              href={route("student-managements.ban", {
                user_management: user.id,
              })}
              
              onSuccess={closeDialog} // Close dialog after deletion
            >
              Continue
            </PrimaryLink>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertBan
