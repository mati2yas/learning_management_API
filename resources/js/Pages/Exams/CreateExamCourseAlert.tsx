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
import { PlusCircle, X } from "lucide-react"
import type { ExamCourse, ExamGrade, ExamType } from "@/types"
import { ScrollArea } from "@/Components/ui/scroll-area"

declare const route: (name: string, params?: any) => string

const CreateExamCourseAlert = ({
  examTypes,
  examGrades,
}: {
  examTypes: ExamType[]
  examGrades: ExamGrade[]
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [chapters, setChapters] = useState<{ title: string; sequence_order: number }[]>([])
  const [isNewCourse, setIsNewCourse] = useState(false)
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([])
  const [chapterErrors, setChapterErrors] = useState<{ [key: number]: string }>({})

  const { data, setData, post, processing, errors, reset } = useForm({
    exam_type_id: "",
    exam_grade_id: "",
    course_name: "",
    exam_course_id: "",
    exam_chapters: chapters,
    stream: null as string | null,
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

  const showExamGrade = useMemo(() => {
    const selectedExamType = examTypes.find((type) => type.id.toString() === data.exam_type_id)
    return selectedExamType && ["6th Grade Ministry", "8th Grade Ministry", "ESSLCE"].includes(selectedExamType.name)
  }, [data.exam_type_id, examTypes])

  const getFilteredExamGrades = useMemo(() => {
    const selectedExamType = examTypes.find((type) => type.id.toString() === data.exam_type_id)
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

  useEffect(() => {
    if (data.exam_type_id && data.exam_grade_id) {
      const selectedGrade = getFilteredExamGrades.find((grade) => grade.id.toString() === data.exam_grade_id)
      fetchExamCourses(
        data.exam_type_id,
        data.exam_grade_id,
        selectedGrade && (selectedGrade.grade === 11 || selectedGrade.grade === 12) ? data.stream : null,
      )
    } else {
      setExamCourses([])
    }
  }, [data.exam_type_id, data.exam_grade_id, data.stream, fetchExamCourses, getFilteredExamGrades])

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

    // First validate chapters
    if (!validateChapters()) {
      return // Stop submission if validation fails
    }

    // Filter out any empty chapters before submission (as an extra precaution)
    const filteredChapters = chapters.filter((chapter) => chapter.title.trim() !== "")
    setData("exam_chapters", filteredChapters)

    post(route("exam-courses.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
        setChapters([])
        setIsNewCourse(false)
        setChapterErrors({})
      },
      onError: (errors) => {
        console.log("validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add Exam Course/Chapters
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-[95vw] w-full sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle>Create Courses/Chapters</AlertDialogTitle>
          <AlertDialogDescription>Add exam course details and chapters</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="flex-grow px-6 overflow-y-auto">
          <div className=" pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exam_type_id">Exam Type</Label>
              <Select
                value={data.exam_type_id}
                onValueChange={(value) => {
                  setData("exam_type_id", value)
                  setData("exam_grade_id", "")
                  setData("exam_course_id", "")
                  setData("stream", null)
                  setIsNewCourse(false)
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
                    value={data.exam_grade_id}
                    onValueChange={(value) => {
                      setData("exam_grade_id", value)
                      setData("exam_course_id", "")
                      const selectedGrade = getFilteredExamGrades.find((grade) => grade.id.toString() === value)
                      setData(
                        "stream",
                        selectedGrade && (selectedGrade.grade === 11 || selectedGrade.grade === 12) ? null : null,
                      )
                      setIsNewCourse(false)
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
                {getFilteredExamGrades.some(
                  (grade) => grade.id.toString() === data.exam_grade_id && (grade.grade === 11 || grade.grade === 12),
                ) && (
                  <div className="space-y-2">
                    <Label htmlFor="stream">Stream</Label>

                    <Select
                      value={data.stream || ""}
                      onValueChange={(value) => setData("stream", value === "null" ? null : value)}
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
              <Label htmlFor="exam_course">Exam Course</Label>
              {isNewCourse ? (
                <Input
                  id="course_name"
                  value={data.course_name}
                  onChange={(e) => setData("course_name", e.target.value)}
                  placeholder="Enter new course name"
                />
              ) : (
                <Select
                  value={data.exam_course_id}
                  onValueChange={(value) => {
                    if (value === "new") {
                      setIsNewCourse(true)
                      setData("exam_course_id", "")
                      setData("course_name", "")
                    } else {
                      const selectedCourse = examCourses.find((course) => course.id.toString() === value)
                      setData((prevData) => ({
                        ...prevData,
                        exam_course_id: value,
                        course_name: selectedCourse ? selectedCourse.course_name : "",
                      }))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or create new course" />
                  </SelectTrigger>
                  <SelectContent>
                    {examCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.course_name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">Create New Course</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {errors.course_name && <p className="text-red-500 text-sm">{errors.course_name}</p>}
              {errors.exam_course_id && <p className="text-red-500 text-sm">{errors.exam_course_id}</p>}
            </div>

            <div className="space-y-2">
              <Label>Chapters (Optional)</Label>
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
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 p-6 pt-2 border-t">
          <AlertDialogCancel
            onClick={() => {
              setIsOpen(false)
              reset()
              setChapters([])
              setIsNewCourse(false)
              setChapterErrors({})
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button type="button" disabled={processing || Object.keys(chapterErrors).length > 0} onClick={submit}>
            Create
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateExamCourseAlert
