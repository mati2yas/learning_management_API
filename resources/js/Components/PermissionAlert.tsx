import { useState, ReactNode } from "react"
import { AlertDialog, AlertDialogFooter, AlertDialogHeader,AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button";
// import { Button } from "@headlessui/react"

interface PermissionAlertProps {
  icon?: ReactNode
  children: ReactNode;
  permission: string;
  className?: string,
  buttonVariant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
  buttonSize?: "default" | "icon" | "sm" | "lg" | null | undefined,
}

function PermissionAlert({ children, permission, className, buttonVariant="default", icon, buttonSize }: PermissionAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={buttonVariant}
          onClick={() => setIsOpen(true)}
          className={`${className}`}
          size={buttonSize}
        >
          {icon}
          {children}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permission Denied</AlertDialogTitle>
          <AlertDialogDescription>
            Oops! You don't have the permission to {permission}. You should contact the super admin.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PermissionAlert;