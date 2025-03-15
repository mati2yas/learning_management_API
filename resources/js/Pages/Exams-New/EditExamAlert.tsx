import { Exam } from "@/types"
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
import { ScrollArea } from "@/Components/ui/scroll-area"
import Checkbox from "@/Components/Checkbox"
import { Edit, Pencil } from "lucide-react"

interface EditExamAlertProps {
  exam: Exam,
  examCourses: {id: number, course_name: string}[]
  examYears: {id: number, year: string}[]
}

const EditExamAlert = ({exam, examCourses, examYears}: EditExamAlertProps) => {

  const [isOpen, setIsOpen] = useState(false)
  const [onSaleChecked, setOnSaleChecked] = useState({
    one_month: !!exam.on_sale_one_month,
    three_month: !!exam.on_sale_three_month,
    six_month: !!exam.on_sale_six_month,
    one_year: !!exam.on_sale_one_year,
  })

  const [stream, setStream] = useState<string | null>(null)

  const { data, setData, put, errors, processing, reset, setError } = useForm({
    exam_course_id: exam.exam_course_id,
    exam_type_id: exam.exam_type_id,
    exam_duration: exam.exam_duration,
    exam_year_id: exam.exam_year_id,
    price_one_month: exam.price_one_month,
    price_three_month: exam.price_three_month,
    price_six_month: exam.price_six_month,
    price_one_year: exam.price_one_year,
    on_sale_one_month: exam.on_sale_one_month,
    on_sale_three_month: exam.on_sale_three_month,
    on_sale_six_month: exam.on_sale_six_month,
    on_sale_one_year: exam.on_sale_one_year,
    stream: exam.stream || null,
  })

  const handleOnSaleChange = (duration: keyof typeof onSaleChecked) => {
    setOnSaleChecked((prev) => ({ ...prev, [duration]: !prev[duration] }))
    if (!onSaleChecked[duration]) {
      // When checking the box, set the on-sale price to the regular price
      setData(`on_sale_${duration}` as keyof typeof data, data[`price_${duration}` as keyof typeof data] || "")
    } else {
      // When unchecking the box, clear the on-sale price
      setData(`on_sale_${duration}` as keyof typeof data, "")
    }
  }

  const handleStreamChange = (value: string) => {
    const streamValue = value === "none" ? null : value
    setData("stream", streamValue as "natural" | "social" | null)
    setStream(streamValue)
  }

  const handleExamCourseChange = (value: string) => {
    setData("exam_course_id", Number(value))
  }

  const handleExamYearChange = (value: string) => {
    setData("exam_year_id", Number(value))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors: Partial<typeof errors> = {}

    if (!data.exam_course_id) {
      newErrors.exam_course_id = "Course is required"
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

    if (!validateForm()) {
      return // Stop form submission if validation fails
    }

    put(route("exams-new.update", exam.id), {
      preserveState: true, // This will keep the form data and errors after submission
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
        window.location.reload() 
      },
      onError: (errors) => {
        console.log("Validation errors:", errors)
      },
    })
  }


  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size={'sm'} className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] flex flex-col h-[90vh] p-0 gap-0 overflow-hidden">
        <AlertDialogHeader className="px-6 py-4 border-b">
          <AlertDialogTitle className="text-xl font-semibold">Edit an Exam</AlertDialogTitle>
          <AlertDialogDescription>Fill in the required information to create a new exam</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="flex-grow px-6 py-4 overflow-y-auto">
          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <InputLabel htmlFor="exam-course" value="Course" className="font-medium" />
                <Select value={data.exam_course_id?.toString()} onValueChange={handleExamCourseChange}>
                  <SelectTrigger className="w-full h-10 border rounded-md">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {examCourses.map((examCourse) => (
                      <SelectItem key={examCourse.id} value={examCourse.id.toString()}>
                        {examCourse.course_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.exam_course_id} className="mt-1" />
              </div>

              <div className="space-y-2">
                <InputLabel htmlFor="exam-year" value="Year" className="font-medium" />
                <Select value={data.exam_year_id?.toString()} onValueChange={handleExamYearChange}>
                  <SelectTrigger className="w-full h-10 border rounded-md">
                    <SelectValue placeholder="Select a Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {examYears.map((examYear) => (
                      <SelectItem key={examYear.id} value={examYear.id.toString()}>
                        {examYear.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.exam_year_id} className="mt-1" />
              </div>
            </div>

            <div className="space-y-2">
              <InputLabel htmlFor="exam-duration" value="Duration (minutes)" className="font-medium" />
              <TextInput
                id="exam-duration"
                name="exam_duration"
                type="number"
                value={data.exam_duration}
                onChange={(e) => setData("exam_duration", Number(e.target.value))}
                required
                className="w-full h-10 px-3 border rounded-md"
              />
              <InputError message={errors.exam_duration} className="mt-1" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {["one_month", "three_month", "six_month", "one_year"].map((duration) => (
                  <div key={duration} className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium capitalize">{duration.replace("_", " ")}</h4>

                    <div className="space-y-2">
                      <InputLabel htmlFor={`price_${duration}`} value="Regular Price" className="text-sm" />
                      <TextInput
                        id={`price_${duration}`}
                        name={`price_${duration}`}
                        type="number"
                        value={data[`price_${duration}` as keyof typeof data] as string}
                        onChange={(e) => setData(`price_${duration}` as keyof typeof data, e.target.value)}
                        required
                        className="w-full h-9"
                      />
                      <InputError
                        message={errors[`price_${duration}` as keyof typeof errors]}
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div className="flex items-center mt-2">
                      <Checkbox
                        id={`on_sale_${duration}`}
                        checked={onSaleChecked[duration as keyof typeof onSaleChecked]}
                        onChange={() => handleOnSaleChange(duration as keyof typeof onSaleChecked)}
                        className="h-4 w-4"
                      />
                      <label htmlFor={`on_sale_${duration}`} className="ml-2 text-sm font-medium">
                        On Sale
                      </label>
                    </div>

                    {onSaleChecked[duration as keyof typeof onSaleChecked] && (
                      <div className="space-y-2">
                        <InputLabel htmlFor={`on_sale_${duration}`} value="Sale Price" className="text-sm" />
                        <TextInput
                          id={`on_sale_${duration}`}
                          name={`on_sale_${duration}`}
                          type="number"
                          value={data[`on_sale_${duration}` as keyof typeof data] as string}
                          onChange={(e) => setData(`on_sale_${duration}` as keyof typeof data, e.target.value)}
                          className="w-full h-9"
                        />
                        <InputError
                          message={errors[`on_sale_${duration}` as keyof typeof errors]}
                          className="mt-1 text-xs"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 dark:bg-gray-800">
          <AlertDialogCancel
            className="px-4 py-2 border rounded-md"
            onClick={() => {
              setIsOpen(false)
              reset()
            }}
          >
            Cancel
          </AlertDialogCancel>
          <PrimaryButton
            type="button"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center"
            disabled={processing}
            onClick={submit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Exam
          </PrimaryButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditExamAlert
