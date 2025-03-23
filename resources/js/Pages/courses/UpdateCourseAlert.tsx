"use client"

import type React from "react"

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
import InputLabel from "@/Components/InputLabel"
import InputError from "@/Components/InputError"
import { fetchGrades, fetchDepartments, fetchBatches } from "@/api/courseManagement"
import { router } from "@inertiajs/react"

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
  grades: initialGrades,
  departments: initialDepartments,
  batches: initialBatches,
  thumbnail,
}: UpdateCourseAlertProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(thumbnail)
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)
  const [grades, setGrades] = useState(initialGrades)
  const [departments, setDepartments] = useState(initialDepartments)
  const [batches, setBatches] = useState(initialBatches)
  const [stream, setStream] = useState<string | null>(course.stream || null)

  const { data, setData, post, processing, errors, reset, progress, clearErrors, setError } = useForm({
    _method: "PATCH",
    course_name: course.course_name,
    category_id: course.category_id.toString(),
    grade_id: course.grade_id?.toString() || "",
    department_id: course.department_id?.toString() || "",
    batch_id: course.batch_id?.toString() || "",
    price_one_month: course.price_one_month?.toString(),
    on_sale_one_month: course.on_sale_one_month?.toString() || "",
    price_three_month: course.price_three_month?.toString(),
    on_sale_three_month: course.on_sale_three_month?.toString() || "",
    price_six_month: course.price_six_month?.toString(),
    on_sale_six_month: course.on_sale_six_month?.toString() || "",
    price_one_year: course.price_one_year?.toString(),
    on_sale_one_year: course.on_sale_one_year?.toString() || "",
    thumbnail: null as File | null,
    existing_thumbnail: thumbnail, // Add this line to keep track of the existing thumbnail
    stream: course.stream || null,
  })

  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview !== thumbnail) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview, thumbnail])

  const handleCategoryChange = async (value: string) => {
    setData("category_id", value)
    setData("grade_id", "")
    setData("department_id", "")
    setData("batch_id", "")
    setData("stream", null) // Reset stream when category changes
    setStream(null)

    try {
      const selectedCategory = categories.find((cat) => cat.id.toString() === value)
      if (selectedCategory) {
        if (selectedCategory.name === "lower_grades" || selectedCategory.name === "higher_grades") {
          const fetchedGrades = await fetchGrades(value)
          setGrades(fetchedGrades)
        } else if (selectedCategory.name === "university") {
          const fetchedDepartments = await fetchDepartments(value)
          setDepartments(fetchedDepartments)
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const handleGradeChange = (value: string) => {
    setData("grade_id", value)
    if (value !== "11" && value !== "12") {
      setData("stream", null)
      setStream(null)
    }
  }

  const handleDepartmentChange = async (value: string) => {
    setData("department_id", value)
    setData("grade_id", "")
    setData("batch_id", "")
    setData("stream", null) // Reset stream when department changes
    setStream(null)

    try {
      const fetchedBatches = await fetchBatches(value)
      setBatches(fetchedBatches)
    } catch (error) {
      console.error("Failed to fetch batches:", error)
    }
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
      setThumbnailPreview(thumbnail) // Reset to the original thumbnail if no new file is selected
      setFileSizeError(null)
    }
  }

  const handleStreamChange = (value: string) => {
    const streamValue = value === "none" ? null : value
    setData("stream", streamValue as "natural" | "social" | null)
    setStream(streamValue)
  }

  const validateForm = () => {
    clearErrors()
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

    const selectedCategory = categories.find((category) => category.id.toString() === data.category_id)
    if (selectedCategory) {
      if (selectedCategory.name === "university") {
        if (!data.department_id) {
          newErrors.department_id = "Department is required for university courses"
          isValid = false
        }
        if (!data.batch_id) {
          newErrors.batch_id = "Batch is required for university courses"
          isValid = false
        }
      } else if (selectedCategory.name === "lower_grades" || selectedCategory.name === "higher_grades") {
        if (!data.grade_id) {
          newErrors.grade_id = "Grade is required for this category"
          isValid = false
        }
        if (
          grades.some(
            (grade) =>
              grade.id.toString() === data.grade_id &&
              (grade.grade_name === "Grade 11" || grade.grade_name === "Grade 12"),
          ) &&
          data.stream === null
        ) {
          newErrors.stream = "Stream is required for Grade 11 and 12"
          isValid = false
        }
      }
    }

    // Validate price and sale price values
    Object.entries({
      one_month: "one_month",
      three_month: "three_month",
      six_month: "six_month",
      one_year: "one_year",
    }).forEach(([key, duration]) => {
      const priceKey = `price_${duration}` as keyof typeof data
      const saleKey = `on_sale_${duration}` as keyof typeof data

      // Check for negative prices
      if (data[priceKey] && Number.parseFloat(data[priceKey] as string) < 0) {
        newErrors[priceKey as keyof typeof errors] = "Price cannot be negative"
        isValid = false
      }

      // Check sale price only if it's provided (since it's optional)
      if (data[saleKey] && data[saleKey] !== "") {
        // Check for negative sale price
        if (Number.parseFloat(data[saleKey] as string) < 0) {
          newErrors[saleKey as keyof typeof errors] = "Sale price cannot be negative"
          isValid = false
        }

        // Check if sale price is greater than original price
        if (Number.parseFloat(data[saleKey] as string) >= Number.parseFloat(data[priceKey] as string)) {
          newErrors[saleKey as keyof typeof errors] = "Sale price must be less than original price"
          isValid = false
        }
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

    if (fileSizeError) {
      return
    }

    if (!validateForm()) {
      return // Stop form submission if validation fails
    }

    router.patch(route("courses.update", course.id), data, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        window.location.reload()
      },
      onError: (errors: any) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  const selectedCategory = categories.find((category) => category.id.toString() === data.category_id)

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
                  {categories.map((category) => {
                    const categoryNameMap: Record<string, string> = {
                      higher_grades: "High School",
                      lower_grades: "Elementary School",
                      random_courses: "Courses",
                      university: "University",
                    }

                    const formattedName =
                      categoryNameMap[category.name] ||
                      category.name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

                    return (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {formattedName}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
            </div>

            {(selectedCategory?.name === "lower_grades" || selectedCategory?.name === "higher_grades") && (
              <>
                <div>
                  <InputLabel htmlFor="grade_id" value="Grade" />
                  <Select
                    value={data.grade_id}
                    onValueChange={(e) => {
                      setData("grade_id", e)
                      setData("stream", null)
                      setStream(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {grade.grade_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.grade_id} className="mt-2" />
                </div>
                {grades.some(
                  (grade) =>
                    grade.id.toString() === data.grade_id &&
                    (grade.grade_name === "Grade 11" || grade.grade_name === "Grade 12"),
                ) && (
                  <div>
                    <InputLabel htmlFor="stream" value="Stream" />
                    <Select
                      value={data.stream || "none"}
                      onValueChange={(e) => {
                        handleStreamChange(e)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.stream} className="mt-2" />
                  </div>
                )}
              </>
            )}

            {selectedCategory && selectedCategory.name === "university" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={data.department_id} onValueChange={handleDepartmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments
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

                {data.department_id && (
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Select value={data.batch_id} onValueChange={(value) => setData("batch_id", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id.toString()}>
                            {batch.batch_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.batch_id && <p className="text-red-500 text-sm">{errors.batch_id}</p>}
                  </div>
                )}
              </>
            )}
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["one_month", "three_month", "six_month", "one_year"].map((duration) => (
                  <div key={duration} className="space-y-2">
                    <Label htmlFor={`price_${duration}`}>{`Price for ${duration.replace("_", " ")}`}</Label>
                    <Input
                      id={`price_${duration}`}
                      name={`price_${duration}`}
                      type="number"
                      value={data[`price_${duration}` as keyof typeof data] as string}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "" || Number.parseFloat(value) >= 0) {
                          setData(`price_${duration}` as keyof typeof data, value)

                          // If sale price exists, validate it against the new price
                          const salePrice = data[`on_sale_${duration}` as keyof typeof data] as string
                          if (
                            salePrice &&
                            salePrice !== "" &&
                            Number.parseFloat(salePrice) >= Number.parseFloat(value)
                          ) {
                            setError(
                              `on_sale_${duration}` as keyof typeof errors,
                              "Sale price must be less than original price",
                            )
                          } else {
                            clearErrors(`on_sale_${duration}` as keyof typeof data)
                          }
                        }
                      }}
                    />
                    {errors[`price_${duration}` as keyof typeof errors] && (
                      <p className="text-red-500 text-sm">{errors[`price_${duration}` as keyof typeof errors]}</p>
                    )}

                    <div className="mt-2">
                      <Label
                        htmlFor={`on_sale_${duration}`}
                      >{`Sale Price for ${duration.replace("_", " ")} (optional)`}</Label>
                      <Input
                        id={`on_sale_${duration}`}
                        name={`on_sale_${duration}`}
                        type="number"
                        value={data[`on_sale_${duration}` as keyof typeof data] as string}
                        onChange={(e) => {
                          const saleValue = e.target.value
                          const originalPrice = Number.parseFloat(
                            data[`price_${duration}` as keyof typeof data] as string,
                          )

                          // Clear the error when input changes
                          clearErrors(`on_sale_${duration}` as keyof typeof data)

                          // Allow empty value (optional) or non-negative values
                          if (saleValue === "" || Number.parseFloat(saleValue) >= 0) {
                            // Check if sale price is greater than original price
                            if (saleValue !== "" && Number.parseFloat(saleValue) >= originalPrice) {
                              setError(
                                `on_sale_${duration}` as keyof typeof errors,
                                "Sale price must be less than original price",
                              )
                            } else {
                              setData(`on_sale_${duration}` as keyof typeof data, saleValue)
                            }
                          }
                        }}
                      />
                      {errors[`on_sale_${duration}` as keyof typeof errors] && (
                        <p className="text-red-500 text-sm">{errors[`on_sale_${duration}` as keyof typeof errors]}</p>
                      )}
                    </div>
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

export default UpdateCourseAlert

