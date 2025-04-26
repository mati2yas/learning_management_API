import DeleteAlertComponent from "@/Components/DeleteAlertComponent";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { Trash2 } from "lucide-react";

interface DeleteExamAlertProps {
  id: number;
}

const DeleteExamAlert = ({id}: DeleteExamAlertProps) => {
  return (
    <DeleteAlertComponent 
    
      description={"This action cannot be undone. This will permanently delete the exam from the servers."} 
      warning={"Are you absolutely sure?"} 

      trigger={
        <Button variant="outline" size="sm" className="text-destructive" title="Delete">
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      } 

      action={
        <>
         <Trash2 />
          <Link  href={route('exams-new.destroy', id)} method="delete" >Continue</Link>
        </>
      }    
      />
  )
}

export default DeleteExamAlert
