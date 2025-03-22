import { type FormEventHandler, useState } from "react"
import { Button } from "@/Components/ui/button"
import { useForm } from "@inertiajs/react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Plus } from "lucide-react"

const CreateBankAlert = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { data, setData, post, processing, errors, reset } = useForm({
    bank_name: "",
    bank_account_number: "",
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("banks.store"), {
      onSuccess: () => {
        setIsOpen(false)
        reset()
      },
      onError: (errors) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Bank
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Bank Account</AlertDialogTitle>
          <AlertDialogDescription>Enter the bank details below</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={data.bank_name}
                onChange={(e) => setData("bank_name", e.target.value)}
                placeholder="Enter bank name"
                required
              />
              {errors.bank_name && <p className="text-sm font-medium text-destructive">{errors.bank_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_account_number">Account Number</Label>
              <Input
                id="bank_account_number"
                value={data.bank_account_number}
                onChange={(e) => setData("bank_account_number", e.target.value)}
                placeholder="Enter account number"
                required
              />
              {errors.bank_account_number && (
                <p className="text-sm font-medium text-destructive">{errors.bank_account_number}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-x-2 pt-4">
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false)
                reset()
              }}
            >
              Cancel
            </AlertDialogCancel>

            <Button type="submit" disabled={processing}>
              Add Bank
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateBankAlert

