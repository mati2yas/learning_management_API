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

const ApproveAlert = ({id}:{id:number}) => {
  const {processing} = useForm()

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className="bg-green-500 text-white">Approve</Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action will approve the subscription request. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>

        <AlertDialogAction>
          <Link href={route('subscriptions.approve', id)} method="post">
            <Button className="bg-green-500 text-white" disabled={processing}>
              Approve
            </Button>
          </Link>
        </AlertDialogAction>

      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default ApproveAlert
