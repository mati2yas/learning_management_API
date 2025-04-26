"use client"

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
import { PlusCircle } from "lucide-react"
import { useState } from "react"

interface CreateDepartmentAlertProps {
  categoryId: number
}

const CreateDepartmentAlert = ({ categoryId }: CreateDepartmentAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm({
    department_name: "",
    category_id: categoryId,
    selected_batches: [] as string[],
  })

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
    post(route("departments.store"), {
      onSuccess: () => {
        reset()
        setIsOpen(false)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add Department
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Department</AlertDialogTitle>
          <AlertDialogDescription>Fill all the required data</AlertDialogDescription>
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
                      id={batch.id}
                      checked={data.selected_batches.includes(batch.id)}
                      onCheckedChange={(checked) => handleBatchChange(batch.id, checked as boolean)}
                    />
                    <label
                      htmlFor={batch.id}
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
                Add Department
              </PrimaryButton>
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateDepartmentAlert

