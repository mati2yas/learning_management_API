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
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { Trash2 } from "lucide-react";

interface DeleteCourseAlertProps {
  id: number;
}

const DeleteCourseAlert = ({id}: DeleteCourseAlertProps) => {

  return (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button 
        variant="destructive"
        className="w-full"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        Delete Course
      </Button>

    </AlertDialogTrigger>
    
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove the course data from the servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-500">

            <Trash2 />
            <Link  href={route('courses.destroy', id)} method="delete" >Continue</Link>
        
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteCourseAlert
