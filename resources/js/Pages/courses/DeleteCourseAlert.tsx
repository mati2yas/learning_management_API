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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import WarningText from "@/Components/WarningText";
import { useForm } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import { FormEventHandler, useState } from "react";

interface DeleteCourseAlertProps {
  id: number;
}

const DeleteCourseAlert = ({id}: DeleteCourseAlertProps) => {

  const [isOpen, setIsOpen] = useState(false)

  const {data, setData, post, processing, errors, reset} = useForm({
    _method: "delete",
    password: "",
  });

  const handleDelete: FormEventHandler = (e) =>{
    e.preventDefault();
      
      if(!data.password.trim()){
        setData("password", "")
        return
      }
      post(route("courses.destroy", id), {
        onSuccess: () => {
          // Handle success
        },
      })
  }

  return (
  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
          This action cannot be undone. This will permanently delete the <WarningText text={'course data '}/>
           and remove <WarningText text={'its associated chapters and quizes data'} /> from the servers. 
        </AlertDialogDescription>
      </AlertDialogHeader>

      <form onSubmit={handleDelete}>
        <div className="space-y-4 py-3">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Please enter your password to confirm
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className={errors.password ? "border-red-500" : ""}
              disabled={processing}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() =>reset()}>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={(e) =>{
            e.preventDefault()
            handleDelete(e)
          }} disabled={processing}>

              <Trash2 />
              Continue
          
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>

    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteCourseAlert
