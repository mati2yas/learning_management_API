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
import {  useForm } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

interface DeleteChapterAlertProps {
  id: number;
  course_name: string;
}

const DeleteExamCourseAlert = ({id, course_name}:DeleteChapterAlertProps) => {

  const [isOpen, setIsOpen] = useState(false)

  const {data, setData, post, processing, errors, reset} = useForm({
    _method: "delete",
    password: "",
  })


  const handleDelete: FormEventHandler = (e) =>{
    e.preventDefault();
      
      if(!data.password.trim()){
        setData("password", "")
        return
      }
      post(route("exam-courses.destroy", id), {
        onSuccess: () => {
          // Handle success
        },
      })
  }



  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
          This action cannot be undone. This will permanently delete <span className=" font-bold">{course_name} </span> 
          and remove <strong>the associated exam with it.</strong>
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

export default DeleteExamCourseAlert
