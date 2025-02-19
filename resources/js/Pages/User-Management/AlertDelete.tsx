
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import PrimaryLink from "@/Components/PrimaryLink";

interface User {
  id: number;
  name: string;
}

interface AlertDeleteProps {
  user: User;
}

export function AlertDelete({ user }: AlertDeleteProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="bg-red-600 text-white p-2" onClick={() => setIsOpen(true)}>
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <strong>{user.name + " "}</strong>
            account and remove your data from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction>
            <PrimaryLink
              href={route("user-managements.destroy", {
                user_management: user.id,
              })}
              method={"delete"}
              onSuccess={closeDialog} // Close dialog after deletion
            >
              Continue
            </PrimaryLink>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
