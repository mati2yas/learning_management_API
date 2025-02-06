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
import { Button } from "@/Components/ui/button"
import { Link, useForm } from "@inertiajs/react"

const RejectAlert = ({id}:{id:number}) => {
  const { processing } = useForm()

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive">Reject</Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action will reject the subscription request. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>

        <AlertDialogAction className=" bg-transparent border-none ">
          <Link href={route('subscriptions.reject', id)} method="post">
            <Button variant="destructive" disabled={processing}>
              Reject
            </Button>
          </Link>
        </AlertDialogAction>

      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default RejectAlert
