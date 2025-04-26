"use client"

import { useState } from "react"
import { useForm } from "@inertiajs/react"
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
import { AlertCircle } from "lucide-react"


interface ApproveAlertProps {
  id: number
}

const ApproveAlert = ({ id }: ApproveAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const { post, processing } = useForm()

  const handleApprove = () => {
    post(route("subscriptions.approve", id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
      },
      onError: (errors) => {
        setError(errors.message || "An error occurred while approving the subscription.")
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600 text-white">Approve</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will approve the subscription request. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="text-red-500 text-sm flex items-center mb-4">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? "Approving..." : "Approve"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ApproveAlert