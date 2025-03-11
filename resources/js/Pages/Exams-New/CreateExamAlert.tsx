import { type FormEventHandler, useState } from "react"
import { Button } from "@/Components/ui/button"
import { useForm } from "@inertiajs/react"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import type { ExamCourse, ExamYear } from "@/types"
import { ScrollArea } from "@/Components/ui/scroll-area"
import Checkbox from "@/Components/Checkbox"
import { Plus } from "lucide-react"

interface CreateExamAlertProps {
  examCourses: {id: number, course_name: string}[]
  examYears: {id: number, year: string}[]
  exam_type_id: number
}

export function CreateExamAlert({ examCourses, examYears, exam_type_id }: CreateExamAlertProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [onSaleChecked, setOnSaleChecked] = useState({
    one_month: false,
    three_month: false,
    six_month: false,
    one_year: false,
  })

  const [stream, setStream] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset, progress, setError, clearErrors } = useForm({
    exam_course_id: "",
    exam_type_id: exam_type_id,
    exam_year_id: "",
    price_one_month: "",
    on_sale_one_month: "",
    price_three_month: "",
    on_sale_three_month: "",
    price_six_month: "",
    on_sale_six_month: "",
    price_one_year: "",
    on_sale_one_year: "",
    exam_duration: "",
    stream: null as string | null,
  })



  const handleOnSaleChange = (duration: keyof typeof onSaleChecked) => {
    setOnSaleChecked((prev) => ({ ...prev, [duration]: !prev[duration] }))
    if (!onSaleChecked[duration]) {
      setData(`on_sale_${duration}` as keyof typeof data, "")
    }
    clearErrors(`on_sale_${duration}`)
  }

  const handleExamCourseChange = (value: string) => {
    setData("exam_course_id", value)
  }

  const handleExamYearChange = (value: string) => {
    setData("exam_year_id", value)
  }


  const handleStreamChange = (value: string) => {
    const streamValue = value === "none" ? null : value
    setData("stream", streamValue)
    setStream(streamValue)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors: Partial<typeof errors> = {}

    if (!data.exam_course_id) {
      newErrors.exam_course_id = "Category is required"
      isValid = false
    }


    Object.entries(onSaleChecked).forEach(([duration, checked]) => {
      if (checked && !data[`on_sale_${duration}` as keyof typeof data]) {
        newErrors[`on_sale_${duration}` as keyof typeof errors] = "Sale price is required when on sale is checked"
        isValid = false
      }
    })

    // Set all errors at once
    Object.entries(newErrors).forEach(([key, value]) => {
      setError(key as keyof typeof errors, value)
    })

    return isValid
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return // Stop form submission if validation fails
    }

    post(route("exams-new.store"), {
      preserveState: true, // This will keep the form data and errors after submission
      preserveScroll: true,
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
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          Add Exam
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] flex flex-col h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create an Exam</AlertDialogTitle>
          <AlertDialogDescription>Fill all the required data</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="flex-grow px-4 overflow-y-auto">
          <form onSubmit={submit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <InputLabel htmlFor="exam-course" value="Course" />
                <Select value={data.exam_course_id} onValueChange={handleExamCourseChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {examCourses.map((examCourse) => {
                      return (
                        <SelectItem key={examCourse.id} value={examCourse.id.toString()}>
                          {examCourse.course_name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <InputError message={errors.exam_course_id} className="mt-2" />
              </div>


              <div>
                <InputLabel htmlFor="exam-year" value="Year" />
                <Select value={data.exam_type_id.toString()} onValueChange={handleExamYearChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {examYears.map((examYear) => {
                      return (
                        <SelectItem key={examYear.id} value={examYear.id.toString()}>
                          {examYear.year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <InputError message={errors.exam_course_id} className="mt-2" />
              </div>

            </div>

            <div>
              <InputLabel htmlFor="exam-duration" value="Duration" />
              <TextInput
                id="exam-duration"
                name="exam_duration"
                type="text"
                value={data.exam_duration}
                onChange={(e) => setData("exam_duration", e.target.value)}
                required
                className="w-full"
              />
              <InputError message={errors.exam_duration} className="mt-2" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["one_month", "three_month", "six_month", "one_year"].map((duration) => (
                <div key={duration}>
                  <InputLabel htmlFor={`price_${duration}`} value={`Price for ${duration.replace("_", " ")}`} />
                  <TextInput
                    id={`price_${duration}`}
                    name={`price_${duration}`}
                    type="number"
                    value={data[`price_${duration}` as keyof typeof data] as string}
                    onChange={(e) => setData(`price_${duration}` as keyof typeof data, e.target.value)}
                    required
                    className="w-full"
                  />
                  <InputError message={errors[`price_${duration}` as keyof typeof errors]} className="mt-2" />

                  <div className="flex items-center mt-2">
                    <Checkbox
                      id={`on_sale_${duration}`}
                      checked={onSaleChecked[duration as keyof typeof onSaleChecked]}
                      onChange={() => handleOnSaleChange(duration as keyof typeof onSaleChecked)}
                    />
                    <label
                      htmlFor={`on_sale_${duration}`}
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      On Sale
                    </label>
                  </div>

                  {onSaleChecked[duration as keyof typeof onSaleChecked] && (
                    <div className="mt-2">
                      <InputLabel
                        htmlFor={`on_sale_${duration}`}
                        value={`Sale Price for ${duration.replace("_", " ")}`}
                      />
                      <TextInput
                        id={`on_sale_${duration}`}
                        name={`on_sale_${duration}`}
                        type="number"
                        value={data[`on_sale_${duration}` as keyof typeof data] as string}
                        onChange={(e) => setData(`on_sale_${duration}` as keyof typeof data, e.target.value)}
                        className="w-full"
                      />
                      <InputError message={errors[`on_sale_${duration}` as keyof typeof errors]} className="mt-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>

   
          </form>
        </ScrollArea>

        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
          <AlertDialogCancel
            onClick={() => {
              setIsOpen(false)
              reset()
            }}
          >
            Cancel
          </AlertDialogCancel>
          <PrimaryButton type="button" className="bg-primary hover:bg-primary/90" disabled={processing} onClick={submit}>
          <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </PrimaryButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateExamAlert

