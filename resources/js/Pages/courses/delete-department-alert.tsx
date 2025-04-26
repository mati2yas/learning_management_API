import DeleteAlertComponent from "@/Components/DeleteAlertComponent"
import { Button } from "@/Components/ui/button"
import { Link } from "@inertiajs/react"
import { Trash2 } from "lucide-react"


interface DeleteDepartmentAlertProps {
  id: number
  
}

export default function DeleteDepartmentAlert({ id }: DeleteDepartmentAlertProps) {
  return (
    <DeleteAlertComponent 
      description={"This action cannot be undone. This will permanently delete the department from the servers."} 
      warning={"Are you absolutely sure?"} 
      trigger={
        <Button variant="outline" size="sm" className="text-destructive" title="Delete">
          <Trash2 className="h-4 w-4 mr-1" /> 
        </Button>
      } 
      action={
        <>
         <Trash2 />
          <Link  href={route('departments.destroy', id)} method="delete" >Continue</Link>
        </>
      }
    

    />
  )
}

