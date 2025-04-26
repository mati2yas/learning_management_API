import type React from "react"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { useForm } from "@inertiajs/react"
import { Edit } from "lucide-react"
import { useEffect, useState } from "react"

interface Batch {
  id: number
  batch_name: string
}

interface Department {
  id: number
  department_name: string
  category_id: number
  batches: Batch[]
}

interface EditDepartmentAlertProps {
  department: Department
}

const EditDepartmentAlert = ({ department }: EditDepartmentAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const batchOptions = [
    { id: "Freshman", label: "Freshman" },
    { id: "1st_year", label: "1st Year" },
    { id: "2nd_year", label: "2nd Year" },
    { id: "3rd_year", label: "3rd Year" },
    { id: "4th_year", label: "4th Year" },
    { id: "5th_year", label: "5th Year" },
    { id: "6th_year", label: "6th Year" },
    { id: "7th_year", label: "7th Year" },
    { id: "8th_year", label: "8th Year" },
  ]

  // Convert existing batch names to the format used in checkboxes
  const getSelectedBatches = () => {
    return department.batches.map((batch) => {
      // Convert batch name to lowercase and replace spaces with underscores
      const batchId = batch.batch_name.toLowerCase().replace(" ", "_")
      // Handle "Freshman" specially
      return batchId === "freshman" ? "freshman" : batchId
    })
  }

  const { data, setData, put, processing, errors, reset } = useForm({
    department_name: department.department_name,
    category_id: department.category_id,
    selected_batches: getSelectedBatches(),
  })

  // Reset form when department changes
  useEffect(() => {
    setData({
      department_name: department.department_name,
      category_id: department.category_id,
      selected_batches: getSelectedBatches(),
    })
  }, [department])

  const handleBatchChange = (batchId: string, checked: boolean) => {
    if (checked) {
      setData("selected_batches", [...data.selected_batches, batchId])
    } else {
      setData(
        "selected_batches",
        data.selected_batches.filter((id) => id !== batchId),
      )
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route("departments.update", department.id), {
      onSuccess: () => {
        reset()
        setIsOpen(false)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          <Edit className="w-4 h-4 mr-2" /> 
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Department</AlertDialogTitle>
          <AlertDialogDescription>Update department information and associated batches</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="justify-center">
          <form onSubmit={submit}>
            <div className="mb-4 w-full">
              <InputLabel htmlFor="department_name" value="Department Name" />
              <TextInput
                id="department_name"
                name="department_name"
                value={data.department_name}
                className="w-full"
                onChange={(e) => setData("department_name", e.target.value)}
                required
              />
              <InputError message={errors.department_name} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="batches" value="Available Batches" className="mb-2" />
              <div className="grid grid-cols-2 gap-2">
                {batchOptions.map((batch) => (
                  <div key={batch.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${batch.id}`}
                      checked={data.selected_batches.includes(batch.id)}
                      onCheckedChange={(checked) => handleBatchChange(batch.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`edit-${batch.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {batch.label}
                    </label>
                  </div>
                ))}
              </div>
              <InputError message={errors.selected_batches} className="mt-2" />
            </div>

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel
                onClick={() => {
                  setIsOpen(false)
                  reset()
                }}
              >
                Cancel
              </AlertDialogCancel>

              <PrimaryButton type="submit" disabled={processing}>
                Update Department
              </PrimaryButton>
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditDepartmentAlert

