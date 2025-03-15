import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import React from "react"

interface DeleteAlertComponentProps {
  description: string
  warning: string
  trigger: React.ReactNode
  action: React.ReactNode
}

const DeleteAlertComponent = ({ trigger, description, action, warning}: DeleteAlertComponentProps) => {

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
        {trigger}
    </AlertDialogTrigger>
    
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{warning}</AlertDialogTitle>
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-500">  
            {action}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteAlertComponent
