import { useForm } from "@inertiajs/react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import { type FormEventHandler, useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { ScrollArea } from "@/Components/ui/scroll-area"
import InputError from "@/Components/InputError"
import type { ExamChapter, ExamCourse, ExamGrade, ExamType, ExamYear } from "@/types"
import InputLabel from "@/Components/InputLabel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import axios from "axios"
import QuestionForm from "./QuestionForm"

interface CreateExamQuestionAlertProps {
  exam_types?: ExamType[]
}

const CreateExamQuestionAlert = ({ exam_types = [] }: CreateExamQuestionAlertProps) => {

  const [isOpen, setIsOpen] = useState(false)
  const [examYears, setExamYears] = useState<ExamYear[]>([])
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([])
  const [examGrades, setExamGrades] = useState<ExamGrade[]>([])
  const [examChapters, setExamChapters] = useState<ExamChapter[]>([])

  const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm<{
    exam_type_id: string
    exam_year_id: string
    exam_course_id: string
    exam_grade_id: string
    exam_chapter_id: string
    questions: {
      question_text: string
      question_image_url?: string
      text_explanation: string
      video_explanation_url: string
      options: string[]
      answer: string[]
    }[]
  } & Record<string, any>>({
    exam_type_id: "",
    exam_year_id: "",
    exam_course_id: "",
    exam_grade_id: "",
    exam_chapter_id: "",
    questions: [
      {
        question_text: "",
        text_explanation: "",
        video_explanation_url: "",
        options: [],
        answer: [],
      },
    ],
  })

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    reset()
    setExamYears([])
    setExamCourses([])
    setExamGrades([])
    setExamChapters([])
    clearErrors()
  }

  const fetchExamYears = async (examTypeId: string) => {
    try {
      const response = await axios.get(`/api/exam-years/${examTypeId}`)
      setExamYears(response.data)
    } catch (error) {
      console.error("Error fetching exam years:", error)
    }
  }

  const fetchExamCourses = async (examYearId: string) => {
    try {
      const response = await axios.get(`/api/exam-courses/${examYearId}`)
      setExamCourses(response.data)
    } catch (error) {
      console.error("Error fetching exam courses:", error)
    }
  }

  const fetchExamGrades = async (examCourseId: string) => {
    try {
      const response = await axios.get(`/api/exam-grades/${examCourseId}`)
      setExamGrades(response.data)
    } catch (error) {
      console.error("Error fetching exam grades:", error)
    }
  }

  const fetchExamChapters = async (examGradeId: string) => {
    try {
      const response = await axios.get(`/api/exam-chapters/${examGradeId}`)
      setExamChapters(response.data)
    } catch (error) {
      console.error("Error fetching exam chapters:", error)
    }
  }

  const handleExamTypeChange = (value: string) => {
    setData("exam_type_id", value)
    setData("exam_year_id", "")
    setData("exam_course_id", "")
    setData("exam_grade_id", "")
    setData("exam_chapter_id", "")
    setExamYears([])
    setExamCourses([])
    setExamGrades([])
    setExamChapters([])
    fetchExamYears(value)
  }

  const handleExamYearChange = (value: string) => {
    setData("exam_year_id", value)
    setData("exam_course_id", "")
    setData("exam_grade_id", "")
    setData("exam_chapter_id", "")
    setExamCourses([])
    setExamGrades([])
    setExamChapters([])
    fetchExamCourses(value)
  }

  const handleExamCourseChange = (value: string) => {
    setData("exam_course_id", value)
    setData("exam_grade_id", "")
    setData("exam_chapter_id", "")
    setExamGrades([])
    setExamChapters([])
    if (data.exam_type_id !== "ngat") {
      fetchExamGrades(value)
    }
  }

  const handleExamGradeChange = (value: string) => {
    setData("exam_grade_id", value)
    setData("exam_chapter_id", "")
    setExamChapters([])
    fetchExamChapters(value)
  }

  const addQuestion = () => {
    setData("questions", [
      ...data.questions,
      {
        question_text: "",
        text_explanation: "",
        video_explanation_url: "",
        options: [],
        answer: [],
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setData(
      "questions",
      data.questions.filter((_, i) => i !== index),
    )
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...data.questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setData("questions", updatedQuestions)
  }

  const validateForm = (): boolean => {
    let isValid = true
    clearErrors()

    if (!data.exam_type_id) {
      setError("exam_type_id", "Exam type is required")
      isValid = false
    }

    if (!data.exam_year_id) {
      setError("exam_year_id", "Exam year is required")
      isValid = false
    }

    if (!data.exam_course_id) {
      setError("exam_course_id", "Exam course is required")
      isValid = false
    }

    if (data.exam_type_id !== "ngat" && !data.exam_grade_id) {
      setError("exam_grade_id", "Exam grade is required")
      isValid = false
    }

    if (data.exam_type_id !== "ngat" && !data.exam_chapter_id) {
      setError("exam_chapter_id", "Exam chapter is required")
      isValid = false
    }

    data.questions.forEach((question, index) => {
      if (!question.question_text) {
        setError(`questions.${index}.question_text`, "Question text is required")
        isValid = false
      }
      if (!question.text_explanation) {
        setError(`questions.${index}.text_explanation`, "Explanation is required")
        isValid = false
      }
      if (question.options.length < 2) {
        setError(`questions.${index}.options`, "At least two options are required")
        isValid = false
      }
      if (question.options.some((option) => option.trim() === "")) {
        setError(`questions.${index}.options`, "All options must be non-empty")
        isValid = false
      }
      if (question.answer.length === 0) {
        setError(`questions[${index}].answer`, "At least one correct answer must be selected")
        isValid = false
      }
    })

    return isValid
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    post(route("exam-questions.store"), {
      preserveScroll: true,
      preserveState: false,
      onSuccess: () => {
        setIsOpen(false)
        resetForm()
      },
      onError: (errors) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Exam Questions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[900px] h-[90vh] p-0 flex flex-col">

        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle>Create New Exam Qu
            estions</AlertDialogTitle>
          <AlertDialogDescription>Fill in the details for the new exam questions.</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="flex-grow px-6 overflow-y-auto">

          <form onSubmit={submit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>
                <InputLabel htmlFor="exam-type" value="Exam Type" />
                <Select value={data.exam_type_id} onValueChange={handleExamTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {exam_types.map((examType) => (
                      <SelectItem key={examType.id} value={examType.id.toString()}>
                        {examType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.exam_type_id} className="mt-2" />
              </div>


              {data.exam_type_id && (
                <div>
                  <InputLabel htmlFor="exam-year" value="Exam Year" />
                  <Select value={data.exam_year_id} onValueChange={handleExamYearChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam year" />
                    </SelectTrigger>
                    <SelectContent>
                      {examYears.map((examYear) => (
                        <SelectItem key={examYear.id} value={examYear.id.toString()}>
                          {examYear.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.exam_year_id} className="mt-2" />
                </div>
              )}

              {data.exam_year_id && (
                <div>
                  <InputLabel htmlFor="exam-course" value="Exam Course" />
                  <Select value={data.exam_course_id} onValueChange={handleExamCourseChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam course" />
                    </SelectTrigger>
                    <SelectContent>
                      {examCourses.map((examCourse) => (
                        <SelectItem key={examCourse.id} value={examCourse.id.toString()}>
                          {examCourse.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.exam_course_id} className="mt-2" />
                </div>
              )}

              {data.exam_course_id && data.exam_type_id !== "ngat" && (
                <div>
                  <InputLabel htmlFor="exam-grade" value="Exam Grade" />
                  <Select value={data.exam_grade_id} onValueChange={handleExamGradeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {examGrades.map((examGrade) => (
                        <SelectItem key={examGrade.id} value={examGrade.id.toString()}>
                          Grade {examGrade.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.exam_grade_id} className="mt-2" />
                </div>
              )}

              {data.exam_grade_id && data.exam_type_id !== "ngat" && (
                <div>
                  <InputLabel htmlFor="exam-chapter" value="Exam Chapter" />
                  <Select value={data.exam_chapter_id} onValueChange={(value) => setData("exam_chapter_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {examChapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id.toString()}>
                          {chapter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.exam_chapter_id} className="mt-2" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              {data.questions.map((question, index) => (
                <QuestionForm
                  key={index}
                  index={index}
                  question={question}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                  errors={Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== undefined)) as Record<string, string>}
                />
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Question
            </Button>
          </form>
        </ScrollArea>
        
        <AlertDialogFooter className="px-6 py-4">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={processing} onClick={submit}>
            Create Questions
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateExamQuestionAlert

