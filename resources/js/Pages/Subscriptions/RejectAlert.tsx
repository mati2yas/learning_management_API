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
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { AlertCircle } from "lucide-react"

interface RejectAlertProps {
  id: number
}

const RejectAlert = ({ id }: RejectAlertProps) => {
  
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data, setData, post, processing, reset } = useForm({
    message: "",
  })

  const validateForm = (): boolean => {
    if (data.message.trim().length === 0) {
      setError("Rejection message is required.")
      return false
    }
    if (data.message.trim().length < 10) {
      setError("Rejection message must be at least 10 characters long.")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      post(route("subscriptions.reject", id), {
        onSuccess: () => {
          setIsOpen(false)
          reset()
        },
        onError: (errors) => {
          setError(errors.message)
        },
      })
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Rejection Message</Label>
              <Input
                id="message"
                value={data.message}
                onChange={(e) => setData("message", e.target.value)}
                placeholder="Enter reason for rejection"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" variant="destructive" disabled={processing}>
                Reject
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RejectAlert

