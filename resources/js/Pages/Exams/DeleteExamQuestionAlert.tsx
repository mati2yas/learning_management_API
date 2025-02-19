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

const DeleteExamQuestionAlert = ({id}:{id:number}) => {
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button 
        variant="outline"
        size={'icon'}
        
      >
        <Trash2 className="w-4 h-4" />
        
      </Button>

    </AlertDialogTrigger>
    
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your the Exam Question from the servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-500">

            <Trash2 />
            <Link  href={route('exam-questions.destroy', id)} method="delete" >Continue</Link>
        
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteExamQuestionAlert
