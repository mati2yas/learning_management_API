import type React from "react"
import { type FormEventHandler, useEffect, useState } from "react"
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
import type { Category, Grade, Department, Batch } from "@/types"
import { ScrollArea } from "@/Components/ui/scroll-area"
import Checkbox from "@/Components/Checkbox"
import { fetchCategories, fetchGrades, fetchDepartments, fetchBatches } from "@/api/courseManagement"


export function CreateCourseAlert() {
  // const { route } = usePage()
  const [isOpen, setIsOpen] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [onSaleChecked, setOnSaleChecked] = useState({
    one_month: false,
    three_month: false,
    six_month: false,
    one_year: false,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [batches, setBatches] = useState<Batch[]>([])

  const { data, setData, post, processing, errors, reset, progress, setError, clearErrors } = useForm({
    course_name: "",
    category_id: "",
    grade_id: "",
    department_id: "",
    batch_id: "",
    price_one_month: "",
    on_sale_one_month: "",
    price_three_month: "",
    on_sale_three_month: "",
    price_six_month: "",
    on_sale_six_month: "",
    price_one_year: "",
    on_sale_one_year: "",
    thumbnail: null as File | null,
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    loadCategories()
  }, [])

  const handleCategoryChange = async (value: string) => {
    setData("category_id", value)
    setData("grade_id", "")
    setData("department_id", "")
    setData("batch_id", "")

    const selectedCategory = categories.find((category) => category.id.toString() === value)
    if (!selectedCategory) return

    try {
      if (selectedCategory.name === "lower_grades" || selectedCategory.name === "higher_grades") {
        const fetchedGrades = await fetchGrades(value)
        setGrades(fetchedGrades)
      } else if (selectedCategory.name === "university") {
        const fetchedDepartments = await fetchDepartments(value)
        setDepartments(fetchedDepartments)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const handleDepartmentChange = async (value: string) => {
    setData("department_id", value)
    setData("batch_id", "")

    try {
      const fetchedBatches = await fetchBatches(value)
      setBatches(fetchedBatches)
    } catch (error) {
      console.error("Failed to fetch batches:", error)
    }
  }

  const handleOnSaleChange = (duration: keyof typeof onSaleChecked) => {
    setOnSaleChecked((prev) => ({ ...prev, [duration]: !prev[duration] }))
    if (!onSaleChecked[duration]) {
      setData(`on_sale_${duration}` as keyof typeof data, "")
    }
    clearErrors(`on_sale_${duration}`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData("thumbnail", e.target.files[0])

      const reader = new FileReader()
      reader.onload = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors: Partial<typeof errors> = {}

    if (!data.course_name) {
      newErrors.course_name = "Course name is required"
      isValid = false
    }

    if (!data.category_id) {
      newErrors.category_id = "Category is required"
      isValid = false
    }

    if (data.category_id === "3") {
      // Assuming 3 is the ID for university
      if (!data.department_id) {
        newErrors.department_id = "Department is required for university courses"
        isValid = false
      }
      if (!data.batch_id) {
        newErrors.batch_id = "Batch is required for university courses"
        isValid = false
      }
    } else if (["1", "2"].includes(data.category_id)) {
      // Assuming 1 and 2 are IDs for lower and higher grades
      if (!data.grade_id) {
        newErrors.grade_id = "Grade is required for this category"
        isValid = false
      }
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

    post(route("courses.store"), {
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

  const selectedCategory = categories.find((category) => category.id.toString() === data.category_id)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          Add Course
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] flex flex-col h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Course</AlertDialogTitle>
          <AlertDialogDescription>Fill all the required data</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="flex-grow px-4 overflow-y-auto">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <InputLabel htmlFor="course_name" value="Course Name" />
              <TextInput
                id="course_name"
                name="course_name"
                value={data.course_name}
                onChange={(e) => setData("course_name", e.target.value)}
                required
                className="w-full"
              />
              <InputError message={errors.course_name} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="category" value="Category" />
                <Select value={data.category_id} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.category_id} className="mt-2" />
              </div>

              {selectedCategory?.name === "university" && (
                <>
                  <div>
                    <InputLabel htmlFor="department_id" value="Department" />
                    <Select value={data.department_id} onValueChange={handleDepartmentChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id.toString()}>
                            {department.department_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputError message={errors.department_id} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="batch_id" value="Batch" />
                    <Select value={data.batch_id} onValueChange={(e) => setData("batch_id", e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id.toString()}>
                            {batch.batch_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputError message={errors.batch_id} className="mt-2" />
                  </div>
                </>
              )}

              {(selectedCategory?.name === "lower_grades" || selectedCategory?.name === "higher_grades") && (
                <div>
                  <InputLabel htmlFor="grade_id" value="Grade" />
                  <Select value={data.grade_id} onValueChange={(e) => setData("grade_id", e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {grade.grade_name}
                          {grade.stream && ` - ${grade.stream}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.grade_id} className="mt-2" />
                </div>
              )}
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

            <div>
              <InputLabel htmlFor="thumbnail" value="Course Thumbnail" />
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full"
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Thumbnail Preview"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
              {progress && (
                <progress value={progress.percentage} max="100">
                  {progress.percentage}%
                </progress>
              )}
              <InputError message={errors.thumbnail} className="mt-2" />
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
          <PrimaryButton type="button" disabled={processing} onClick={submit}>
            Add Course
          </PrimaryButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateCourseAlert

