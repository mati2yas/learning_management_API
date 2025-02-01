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
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"
import { type FormEventHandler, useState, useEffect } from "react"
import { PencilIcon, X } from "lucide-react"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Checkbox } from "@/Components/ui/checkbox"
import InputError from "@/Components/InputError"
import { Input } from "@/Components/ui/input"
import type { ExamChapter, ExamCourse, ExamGrade, ExamType, ExamYear, ExamQuestion } from "@/types"
import InputLabel from "@/Components/InputLabel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import axios from "axios"

interface EditExamQuestionAlertProps {
  exam_types: ExamType[]
  question: ExamQuestion
}

const EditExamQuestionAlert = ({ exam_types, question }: EditExamQuestionAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<string[]>(JSON.parse(question.options))
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>(JSON.parse(question.answer))
  const [isMultipleChoice, setIsMultipleChoice] = useState(Array.isArray(JSON.parse(question.answer)))
  const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(question.question_image_url)
  const [examYears, setExamYears] = useState<ExamYear[]>([])
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([])
  const [examGrades, setExamGrades] = useState<ExamGrade[]>([])
  const [examChapters, setExamChapters] = useState<ExamChapter[]>([])

  const { data, setData, put, processing, errors, reset, clearErrors, setError } = useForm<{
    exam_type_id: string
    exam_year_id: string
    exam_course_id: string
    exam_grade_id: string
    exam_chapter_id: string
    question_text: string
    video_explanation_url: string
    question_image_url: File | null | string
    text_explanation: string
    options: string[]
    answer: string[]
  }>({
    exam_type_id: question.exam_year_id.toString(),
    exam_year_id: question.exam_year_id.toString(),
    exam_course_id: question.exam_course_id.toString(),
    exam_grade_id: question.exam_grade_id?.toString() || "",
    exam_chapter_id: question.exam_chapter_id?.toString() || "",
    question_text: question.question_text,
    video_explanation_url: question.video_explanation_url || "",
    question_image_url: question.question_image_url || null,
    text_explanation: question.text_explanation,
    options: JSON.parse(question.options),
    answer: JSON.parse(question.answer),
  })

  useEffect(() => {
    if (isOpen) {
      fetchExamYears(data.exam_type_id)
      if (data.exam_year_id) fetchExamCourses(data.exam_year_id)
      if (data.exam_course_id) fetchExamGrades(data.exam_course_id)
      if (data.exam_grade_id) fetchExamChapters(data.exam_grade_id)
    }
  }, [isOpen, data.exam_course_id]) // Added data.exam_course_id to dependencies

  const resetForm = () => {
    reset()
    setOptions(JSON.parse(question.options))
    setCorrectAnswer(JSON.parse(question.answer))
    setIsMultipleChoice(Array.isArray(JSON.parse(question.answer)))
    setQuestionImagePreview(question.question_image_url)
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

  const addOption = () => {
    const newOptions = [...options, ""]
    setOptions(newOptions)
    setData("options", newOptions)
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    setData("options", newOptions)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    setData("options", newOptions)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData("question_image_url", e.target.files[0])
      const reader = new FileReader()
      reader.onload = () => {
        setQuestionImagePreview(reader.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    clearErrors()

    if (data.text_explanation.trim() === "") {
      setError("text_explanation", "Explanation is required")
      isValid = false
    }

    if (options.length < 2) {
      setError("options", "At least two options are required")
      isValid = false
    }

    if (options.some((option) => option.trim() === "")) {
      setError("options", "All options must be non-empty")
      isValid = false
    }

    if (isMultipleChoice && (correctAnswer as string[]).length === 0) {
      setError("answer", "At least one correct answer must be selected")
      isValid = false
    }

    if (!isMultipleChoice && (correctAnswer as string).trim() === "") {
      setError("answer", "A correct answer must be selected")
      isValid = false
    }

    return isValid
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Filter out empty options
    const validOptions = options.filter((option) => option.trim() !== "")

    // Format answer based on selection type
    const formattedAnswer = isMultipleChoice
      ? (correctAnswer as string[]).filter((answer) => answer.trim() !== "")
      : [correctAnswer as string].filter((answer) => answer.trim() !== "")

    // Update the data object
    setData("options", validOptions)
    setData("answer", formattedAnswer)

    put(route("exam-questions.update", question.id), {
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
        <Button variant="outline" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle>Edit Exam Question</AlertDialogTitle>
          <AlertDialogDescription>Update the details for this exam question.</AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[calc(90vh-130px)] overflow-y-auto px-6">
          <form onSubmit={submit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="question_text">Question Text</Label>
              <Textarea
                id="question_text"
                value={data.question_text}
                onChange={(e) => setData("question_text", e.target.value)}
                required
              />
              <InputError message={errors.question_text} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question_image_url">Image (optional)</Label>
              <Input id="question_image_url" type="file" name="question_image_url" onChange={handleImageChange} />
              {questionImagePreview && (
                <div className="mt-2">
                  <img
                    src={questionImagePreview || "/placeholder.svg"}
                    alt="Question Preview"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
              <InputError message={errors.question_image_url} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="text_explanation">Explanation</Label>
                <Textarea
                  id="text_explanation"
                  value={data.text_explanation}
                  onChange={(e) => setData("text_explanation", e.target.value)}
                  required
                />
                <InputError message={errors.text_explanation} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video_explanation_url">Video Explanation URL (optional)</Label>
                <Input
                  id="video_explanation_url"
                  type="url"
                  value={data.video_explanation_url}
                  onChange={(e) => setData("video_explanation_url", e.target.value)}
                />
                <InputError message={errors.video_explanation_url} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addOption}>
                  Add Option
                </Button>
              </div>
              <InputError message={errors.options} />
            </div>

            <div className="space-y-2">
              <Label>Answer Type</Label>
              <RadioGroup
                value={isMultipleChoice ? "multiple" : "single"}
                onValueChange={(value) => {
                  setIsMultipleChoice(value === "multiple")
                  setCorrectAnswer(value === "multiple" ? [] : "")
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple">Multiple Choice</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Correct Answer(s)</Label>
              {isMultipleChoice ? (
                options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`answer-${index}`}
                      checked={(correctAnswer as string[]).includes(option)}
                      onCheckedChange={(checked) => {
                        const newAnswer = checked
                          ? [...(correctAnswer as string[]), option]
                          : (correctAnswer as string[]).filter((a) => a !== option)
                        setCorrectAnswer(newAnswer)
                        setData("answer", newAnswer)
                      }}
                    />
                    <Label htmlFor={`answer-${index}`}>{option}</Label>
                  </div>
                ))
              ) : (
                <RadioGroup
                  value={correctAnswer as string}
                  onValueChange={(value) => {
                    setCorrectAnswer(value)
                    setData("answer", [value])
                  }}
                >
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`answer-${index}`} />
                      <Label htmlFor={`answer-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              <InputError message={errors.answer} />
            </div>
          </form>
        </ScrollArea>
        <AlertDialogFooter className="px-6 py-4">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={processing} onClick={submit}>
            Update
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditExamQuestionAlert

