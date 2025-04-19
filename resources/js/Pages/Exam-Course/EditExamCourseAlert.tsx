"use client"

import { type FormEventHandler, useState, useEffect, useCallback, useMemo } from "react"
import { useForm } from "@inertiajs/react"
import axios from "axios"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
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
import { Edit2, X } from "lucide-react"
import type { ExamCourse, ExamGrade, ExamType } from "@/types"
import { ScrollArea } from "@/Components/ui/scroll-area"
import {  usePage } from "@inertiajs/react"

const EditExamCourseAlert = ({
  examTypes,
  examGrades,
  examCourse,
}: {
  examTypes: ExamType[]
  examGrades: ExamGrade[]
  examCourse: ExamCourse
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [chapters, setChapters] = useState<{ title: string; sequence_order: number }[]>(examCourse.exam_chapters || [])
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([])
  const [chapterErrors, setChapterErrors] = useState<{ [key: number]: string }>({})
  const [duplicateError, setDuplicateError] = useState<string | null>(null)

  const { data, setData, put, processing, errors, reset } = useForm({
    exam_type_id: examCourse.exam_type_id,
    exam_grade_id: examCourse.exam_grade_id,
    course_name: examCourse.course_name,
    exam_chapters: chapters,
    exam_course_id: examCourse.id.toString(),
    stream: examCourse.stream || null,
  })


  const addChapter = useCallback(() => {
    setChapters((prev) => {
      if (prev.length < 50) {
        return [...prev, { title: "", sequence_order: prev.length + 1 }]
      }
      return prev
    })
  }, [])

  const removeChapter = useCallback((index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index))
    // Also remove any errors for this chapter
    setChapterErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }, [])

  const updateChapter = useCallback((index: number, field: string, value: string) => {
    setChapters((prev) => {
      const newChapters = [...prev]
      newChapters[index] = { ...newChapters[index], [field]: value }
      return newChapters
    })

    // Clear error for this chapter if it now has a value
    if (field === "title" && value.trim()) {
      setChapterErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[index]
        return newErrors
      })
    }
  }, [])

  useEffect(() => {
    setData("exam_chapters", chapters)
  }, [chapters, setData])

  const formatCourseTitle = (title: string): string => {
    if (!title) return ""

    // List of words that should not be capitalized (prepositions, articles, conjunctions)
    const lowercaseWords = [
      "a",
      "an",
      "the",
      "and",
      "but",
      "or",
      "for",
      "nor",
      "on",
      "at",
      "to",
      "by",
      "from",
      "in",
      "of",
      "with",
      "about",
      "as",
      "into",
      "like",
      "through",
      "after",
      "over",
      "between",
      "against",
      "during",
    ]

    // Split the title into words
    const words = title.toLowerCase().split(" ")

    // Capitalize each word unless it's in the lowercaseWords list (except for the first word)
    return words
      .map((word, index) => {
        // Always capitalize the first word
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1)
        }

        // Don't capitalize words in the lowercaseWords list
        if (lowercaseWords.includes(word)) {
          return word
        }

        // Capitalize other words
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(" ")
  }

  const fetchExamCourses = useCallback(async (examTypeId: string, examGradeId: string, stream: string | null) => {
    try {
      const response = await axios.get(`/api/exam-courses-create/${examTypeId}/${examGradeId}`, {
        params: { stream },
      })
      setExamCourses(response.data)
    } catch (error) {
      console.error("Error fetching exam courses:", error)
    }
  }, [])

  useEffect(() => {
    if (data.exam_type_id && data.exam_grade_id) {
      fetchExamCourses(data.exam_type_id.toString(), data.exam_grade_id.toString(), data.stream)
    } else {
      setExamCourses([])
    }
  }, [data.exam_type_id, data.exam_grade_id, data.stream, fetchExamCourses])

  // Validate chapters before submission
  const validateChapters = useCallback(() => {
    const newErrors: { [key: number]: string } = {}
    let isValid = true

    // Only validate if there are chapters
    if (chapters.length > 0) {
      chapters.forEach((chapter, index) => {
        if (!chapter.title.trim()) {
          newErrors[index] = "Chapter title cannot be empty"
          isValid = false
        }
      })
    }

    setChapterErrors(newErrors)
    return isValid
  }, [chapters])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    // Reset duplicate error
    setDuplicateError(null)

    // First validate chapters
    if (!validateChapters()) {
      return // Stop submission if validation fails
    }

    // Check for duplicate course name
    if (data.course_name) {
      const normalizedNewName = data.course_name.toLowerCase()
      const duplicateCourse = examCourses.find(
        (course) => course.course_name.toLowerCase() === normalizedNewName && course.id !== examCourse.id, // Exclude the current course
      )

      if (duplicateCourse) {
        setDuplicateError("This course name already exists")
        return // Stop submission
      }
    }

    // Filter out any empty chapters before submission (as an extra precaution)
    const filteredChapters = chapters.filter((chapter) => chapter.title.trim() !== "")
    setData("exam_chapters", filteredChapters)

    put(route("exam-courses.update", examCourse.id),  {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
        setChapterErrors({})
      },
      onError: (errors) => {
        console.log("validation errors:", errors)
      },
    })
  }

  const showExamGrade = useMemo(() => {
    const selectedExamType = examTypes.find((type) => type.id === Number(data.exam_type_id))
    return selectedExamType && ["6th Grade Ministry", "8th Grade Ministry", "ESSLCE"].includes(selectedExamType.name)
  }, [data.exam_type_id, examTypes])

  const showStreamDropdown = useMemo(() => {
    const selectedGrade = examGrades.find((grade) => grade.id === Number(data.exam_grade_id))
    return selectedGrade && (selectedGrade.grade === 11 || selectedGrade.grade === 12)
  }, [data.exam_grade_id, examGrades])

  const getFilteredExamGrades = useMemo(() => {
    const selectedExamType = examTypes.find((type) => type.id === Number(data.exam_type_id))
    if (!selectedExamType) return []

    switch (selectedExamType.name) {
      case "6th Grade Ministry":
        return examGrades.filter((grade) => [5, 6].includes(grade.grade))
      case "8th Grade Ministry":
        return examGrades.filter((grade) => [7, 8].includes(grade.grade))
      case "ESSLCE":
        return examGrades.filter((grade) => grade.grade >= 9 && grade.grade <= 12)
      default:
        return []
    }
  }, [data.exam_type_id, examTypes, examGrades])

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => setIsOpen(true)}
        >
          <Edit2 className="h-4 w-4 mr-1" /> Edit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-[95vw] w-full sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle>Edit Exam Course</AlertDialogTitle>
          <AlertDialogDescription>Edit exam course details and chapters</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="flex-grow px-6 overflow-y-auto">
          <form onSubmit={submit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exam_type_id">Exam Type</Label>
              <Select
                value={data.exam_type_id.toString()}
                onValueChange={(value) => {
                  setData("exam_type_id", Number(value))
                  if (!showExamGrade) {
                    setData("exam_grade_id", Number(""))
                  }
                  setData("exam_course_id", "")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.exam_type_id && <p className="text-red-500 text-sm">{errors.exam_type_id}</p>}
            </div>

            {showExamGrade && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="exam_grade_id">Exam Grade</Label>
                  <Select
                    value={data.exam_grade_id?.toString()}
                    onValueChange={(value) => {
                      setData("exam_grade_id", Number(value))
                      if (!showStreamDropdown) {
                        setData("stream", null)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Exam Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredExamGrades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          Grade - {grade.grade}
                          {grade.stream ? ` - ${grade.stream}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.exam_grade_id && <p className="text-red-500 text-sm">{errors.exam_grade_id}</p>}
                </div>
                {showStreamDropdown && (
                  <div className="space-y-2">
                    <Label htmlFor="stream">Stream</Label>
                    <Select
                      value={data.stream || ""}
                      onValueChange={(value) =>
                        setData("stream", value === "null" ? null : (value as "natural" | "social" | null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.stream && <p className="text-red-500 text-sm">{errors.stream}</p>}
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="course_name">Course Name</Label>
              <Input
                id="course_name"
                value={data.course_name}
                onChange={(e) => {
                  const formattedName = formatCourseTitle(e.target.value)
                  setData("course_name", formattedName)
                  // Clear duplicate error when user types
                  if (duplicateError) setDuplicateError(null)
                }}
                placeholder="Enter course name"
                className={duplicateError ? "border-red-500" : ""}
              />
              {duplicateError && <p className="text-red-500 text-sm">{duplicateError}</p>}
              {errors.course_name && <p className="text-red-500 text-sm">{errors.course_name}</p>}
            </div>

            <div className="space-y-2">
              <Label>Chapters</Label>
              {Object.keys(chapterErrors).length > 0 && (
                <p className="text-red-500 text-sm">Please fill in all chapter titles or remove empty chapters.</p>
              )}
              {chapters.map((chapter, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={chapter.title}
                      onChange={(e) => updateChapter(index, "title", e.target.value)}
                      placeholder={`Chapter ${index + 1}`}
                      className={chapterErrors[index] ? "border-red-500" : ""}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeChapter(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {chapterErrors[index] && <p className="text-red-500 text-xs">{chapterErrors[index]}</p>}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addChapter}
                disabled={chapters.length >= 50}
                className="w-full"
              >
                Add Chapter
              </Button>
              {chapters.length >= 50 && (
                <p className="text-sm text-muted-foreground mt-2">Maximum of 50 chapters allowed.</p>
              )}
            </div>
          </form>
        </ScrollArea>

        <div className="flex justify-end space-x-2 p-6 pt-2 border-t">
          <AlertDialogCancel
            onClick={() => {
              setIsOpen(false)
              reset()
              setChapterErrors({})
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button type="submit" disabled={processing || Object.keys(chapterErrors).length > 0} onClick={submit}>
            Update
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditExamCourseAlert
