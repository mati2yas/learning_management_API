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

interface DeleteChapterAlertProps {
  id: number;
  name: string;
}

const DeleteChapterAlert = ({id, name}:DeleteChapterAlertProps) => {
  return (
    <AlertDialog>
    <AlertDialogTrigger>
      <Button 
        variant="outline"
        size={"sm"}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        Delete
      </Button>

    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete <span className=" font-bold">{name } </span> 
           and remove the course data from the servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-500">

            <Trash2 />
            <Link  href={route('chapters.destroy', id)} method="delete" >Continue</Link>
        
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteChapterAlert
