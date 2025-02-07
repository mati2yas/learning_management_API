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

  const { data, setData, post, processing, errors, reset } = useForm({
    exam_type_id: "",
    exam_grade_id: "",
    course_name: "",
    exam_course_id: "",
    exam_chapters: chapters,
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

  const showExamGrade = useMemo(() => {
    const selectedExamType = examTypes.find((type) => type.id.toString() === data.exam_type_id)
    return selectedExamType && !["NGAT", "EXIT"].includes(selectedExamType.name.toUpperCase())
  }, [data.exam_type_id, examTypes])

  useEffect(() => {
    if (data.exam_type_id && showExamGrade) {
      fetchExamCourses(data.exam_type_id)
    } else {
      setExamCourses([])
    }
  }, [data.exam_type_id, fetchExamCourses, showExamGrade])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route("exam-courses.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
        setChapters([])
        setIsNewCourse(false)
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

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Courses/Chapters</AlertDialogTitle>
          <AlertDialogDescription>Add exam course details and chapters</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exam_type_id">Exam Type</Label>
            <Select
              value={data.exam_type_id}
              onValueChange={(value) => {
                setData("exam_type_id", value)
                if (!showExamGrade) {
                  setData("exam_grade_id", "")
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
                value={data.exam_grade_id}
                onValueChange={(value) => {
                  setData("exam_grade_id", value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam Grade" />
                </SelectTrigger>
                <SelectContent>
                  {examGrades.map((grade) => (
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
                setChapters([])
                setIsNewCourse(false)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={processing}>
              Create
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateExamCourseAlert

