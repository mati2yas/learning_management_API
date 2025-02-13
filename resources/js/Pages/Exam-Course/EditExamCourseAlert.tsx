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
import { usePage } from "@inertiajs/react"

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
  const [isNewCourse, setIsNewCourse] = useState(false)
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([])


  const { data, setData, put, processing, errors, reset } = useForm({
    exam_type_id: examCourse.exam_type_id,
    exam_grade_id: examCourse.exam_grade_id,
    course_name: examCourse.course_name,
    exam_chapters: chapters,
    exam_course_id: examCourse.id.toString(),
  })

  const addChapter = useCallback(() => {
    setChapters((prev) => [...prev, { title: "", sequence_order: prev.length + 1 }])
  }, [])

  const removeChapter = useCallback((index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateChapter = useCallback((index: number, field: string, value: string) => {
    setChapters((prev) => {
      const newChapters = [...prev]
      newChapters[index] = { ...newChapters[index], [field]: value }
      return newChapters
    })
  }, [])

  useEffect(() => {
    setData("exam_chapters", chapters)
  }, [chapters, setData])

  const fetchExamCourses = useCallback(async (examTypeId: string) => {
    try {
      const response = await axios.get(`/api/exam-courses/${examTypeId}`)
      setExamCourses(response.data)
    } catch (error) {
      console.error("Error fetching exam courses:", error)
    }
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    put(route("exam-courses.update", examCourse.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
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

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Exam Course</AlertDialogTitle>
          <AlertDialogDescription>Edit exam course details and chapters</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submit} className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="exam_grade_id">Exam Grade</Label>
              <Select
                value={data.exam_grade_id.toString()}
                onValueChange={(value) => {
                  setData("exam_grade_id", Number(value))
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
          )}

          <div className="space-y-2">
            <Label htmlFor="course_name">Course Name</Label>
            <Input
              id="course_name"
              value={data.course_name}
              onChange={(e) => setData("course_name", e.target.value)}
              placeholder="Enter course name"
            />
            {errors.course_name && <p className="text-red-500 text-sm">{errors.course_name}</p>}
          </div>

          <div className="space-y-2">
            <Label>Chapters</Label>
            {chapters.map((chapter, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={chapter.title}
                  onChange={(e) => updateChapter(index, "title", e.target.value)}
                  placeholder={`Chapter ${index + 1}`}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeChapter(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addChapter}>
              Add Chapter
            </Button>
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
            <Button type="submit" disabled={processing}>
              Update
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditExamCourseAlert

