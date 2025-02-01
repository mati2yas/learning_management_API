import { type FormEventHandler, useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { useForm } from "@inertiajs/react"
import PrimaryButton from "@/Components/PrimaryButton"
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
import type { Course } from "@/types/course"
import { Pencil } from "lucide-react"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent } from "@/Components/ui/card"
import Checkbox from "@/Components/Checkbox"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import InputError from "@/Components/InputError"

interface UpdateCourseAlertProps {
  categories: Category[]
  grades: Grade[]
  departments: Department[]
  batches: Batch[]
  course: Course
  thumbnail: string
}

export function UpdateCourseAlert({
  course,
  categories,
  grades,
  departments,
  batches,
  thumbnail,
}: UpdateCourseAlertProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(thumbnail)
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)
  const [onSaleChecked, setOnSaleChecked] = useState({
    month: false,
    three_month: false,
    six_month: false,
    one_year: false,
  })

  const { data, setData, post, processing, errors, reset, progress, clearErrors, setError } = useForm({
    _method: "PATCH",
    course_name: course.course_name,
    category_id: course.category_id.toString(),
    grade_id: course.grade_id?.toString() || "",
    department_id: course.department_id?.toString() || "",
    batch_id: course.batch_id?.toString() || "",
    price_one_month: course.price_one_month?.toString(),
    on_sale_month: course.on_sale_month?.toString(),
    price_three_month: course.price_three_month?.toString(),
    on_sale_three_month: course.on_sale_three_month?.toString(),
    price_six_month: course.price_six_month?.toString(),
    on_sale_six_month: course.on_sale_six_month?.toString(),
    price_one_year: course.price_one_year?.toString(),
    thumbnail: null as File | null,
  })

  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview !== thumbnail) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview, thumbnail])

  const handleCategoryChange = (value: string) => {
    setData("category_id", value)
    setData("grade_id", "")
    setData("department_id", "")
    setData("batch_id", "")
  }

  const handleGradeChange = (value: string) => {
    setData("grade_id", value)
    setData("department_id", "")
    setData("batch_id", "")
  }

  const handleDepartmentChange = (value: string) => {
    setData("department_id", value)
    setData("grade_id", "")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setFileSizeError("File size must not exceed 5MB")
        setData("thumbnail", null)
        setThumbnailPreview(null)
      } else {
        setFileSizeError(null)
        setData("thumbnail", file)
        const reader = new FileReader()
        reader.onload = () => {
          setThumbnailPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setData("thumbnail", null)
      setThumbnailPreview(null)
      setFileSizeError(null)
    }
  }

  const handleOnSaleChange = (duration: keyof typeof onSaleChecked) => {
    setOnSaleChecked((prev) => ({ ...prev, [duration]: !prev[duration] }))
    if (!onSaleChecked[duration]) {
      setData(`on_sale_${duration}` as keyof typeof data, "")
    }
    clearErrors(`on_sale_${duration}` as keyof typeof data)
  }


  useEffect(() => {
    const validateForm = () => {
      clearErrors()
      let isValid = true

      if (data.category_id === "university") {
        if (!data.department_id) {
          setError("department_id", "Department is required for university courses")
          isValid = false
        }
        if (!data.batch_id) {
          setError("batch_id", "Batch is required for university courses")
          isValid = false
        }
      } else if (["lower_grade", "higher_grade"].includes(data.category_id)) {
        if (!data.grade_id) {
          setError("grade_id", "Grade is required for this category")
          isValid = false
        }
      }

      Object.entries(onSaleChecked).forEach(([duration, checked]) => {
        if (checked && !data[`on_sale_${duration}` as keyof typeof data]) {
          setError(`on_sale_${duration}` as keyof typeof data, "Sale price is required when on sale is checked")
          isValid = false
        }
      })

      return isValid
    }

    validateForm()
  }, [data, onSaleChecked, clearErrors])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    if (fileSizeError) {
      return
    }

    const formData = new FormData()
    formData.append("_method", "PATCH")

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "thumbnail" && value instanceof File) {
          formData.append(key, value)
        } else if (key !== "_method") {
          formData.append(key, value.toString())
        }
      }
    })

    post(route("courses.update", course.id), {
      data: formData,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
      },
      onError: (errors: any) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsOpen(true)}>
          <Pencil className="w-5 h-5 mr-2" />
          Update Course
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Update Course</AlertDialogTitle>
          <AlertDialogDescription>Update the course details</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                name="course_name"
                value={data.course_name}
                onChange={(e) => setData("course_name", e.target.value)}
                required
              />
              {errors.course_name && <p className="text-red-500 text-sm">{errors.course_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={data.category_id} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name.replace(/_/g, " ").replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
            </div>

            {data.category_id && (
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select value={data.grade_id} onValueChange={handleGradeChange} disabled={!!data.department_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades
                      .filter((grade) => grade.category_id.toString() === data.category_id)
                      .map((grade) => (
                        <SelectItem className="flex justify-between" key={grade.id} value={grade.id.toString()}>
                          {grade.grade_name}
                          {(grade.grade_name === "Grade 11" || grade.grade_name === "Grade 12") && (
                            <span className="capitalize"> - {grade.stream}</span>
                          )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.grade_id && <p className="text-red-500 text-sm">{errors.grade_id}</p>}
              </div>
            )}

            {data.category_id && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={data.department_id} onValueChange={handleDepartmentChange} disabled={!!data.grade_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter((dept) => dept.category_id.toString() === data.category_id)
                      .sort((a, b) => a.department_name.localeCompare(b.department_name))
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.department_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.department_id && <p className="text-red-500 text-sm">{errors.department_id}</p>}
              </div>
            )}

            {data.department_id && (
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Select value={data.batch_id} onValueChange={(value) => setData("batch_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches
                      .filter((batch) => batch.department_id.toString() === data.department_id)
                      .map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.batch_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.batch_id && <p className="text-red-500 text-sm">{errors.batch_id}</p>}
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_one_month">Price for 1 Month</Label>
                  <Input
                    id="price_one_month"
                    name="price_one_month"
                    type="number"
                    value={data.price_one_month}
                    onChange={(e) => setData("price_one_month", e.target.value)}
                    required
                  />
                  {errors.price_one_month && <p className="text-red-500 text-sm">{errors.price_one_month}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_three_month">Price for Three Months</Label>
                  <Input
                    id="price_three_month"
                    name="price_three_month"
                    type="number"
                    value={data.price_three_month}
                    onChange={(e) => setData("price_three_month", e.target.value)}
                    required
                  />
                  {errors.price_three_month && <p className="text-red-500 text-sm">{errors.price_three_month}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_six_month">Price for Six Months</Label>
                  <Input
                    id="price_six_month"
                    name="price_six_month"
                    type="number"
                    value={data.price_six_month}
                    onChange={(e) => setData("price_six_month", e.target.value)}
                    required
                  />
                  {errors.price_six_month && <p className="text-red-500 text-sm">{errors.price_six_month}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_one_year">Price for One Year</Label>
                  <Input
                    id="price_one_year"
                    name="price_one_year"
                    type="number"
                    value={data.price_one_year}
                    onChange={(e) => setData("price_one_year", e.target.value)}
                    required
                  />
                  {errors.price_one_year && <p className="text-red-500 text-sm">{errors.price_one_year}</p>}
                </div>


                {Object.keys(onSaleChecked).map((duration) => (
                <div key={duration}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`on_sale_${duration}`}
                      checked={onSaleChecked[duration as keyof typeof onSaleChecked]}
                      onChange={() => handleOnSaleChange(duration as keyof typeof onSaleChecked)}
                    />
                    <label
                      htmlFor={`on_sale_${duration}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      On Sale {duration.replace("_", " ")}
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
                      <InputError message={errors[`on_sale_${duration}` as keyof typeof data]} className="mt-2" />
                    </div>
                  )}
                </div>
              ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Course Thumbnail</Label>
            <Input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            {thumbnailPreview ? (
              <div className="mt-2">
                <img
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail Preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-200"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No thumbnail selected.</p>
            )}
            {fileSizeError && <p className="text-red-500 text-sm">{fileSizeError}</p>}
            {progress && (
              <progress value={progress.percentage} max="100" className="w-full h-2 bg-gray-200 rounded-lg mt-2">
                {progress.percentage}%
              </progress>
            )}
            {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false)
                reset()
              }}
            >
              Cancel
            </AlertDialogCancel>
            <PrimaryButton type="submit" disabled={processing || !!fileSizeError}>
              Update Course
            </PrimaryButton>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

