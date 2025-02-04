import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { PlusCircle } from "lucide-react"
import QuizQuestionForm from "./QuizQuestionFrom"

interface CreateQuizQuestionAlertProps {
  quizId: number
  title: string
}

interface QuestionData {
  id: string
  question_number: number
  text: string
  text_explanation: string
  video_explanation_url: string
  options: string[]
  answer: string[]
  image_explanation_url: string | null
  question_image_url: string | null
}

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const CreateQuizQuestionAlert = ({ quizId, title }: CreateQuizQuestionAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm<{
    quiz_id: number
    questions: QuestionData[]
  }>({
    quiz_id: quizId,
    questions: [
      {
        id: generateUniqueId(),
        question_number: 1,
        text: "",
        text_explanation: "",
        video_explanation_url: "",
        image_explanation_url: null,
        question_image_url: null,
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

  const addQuestion = () => {
    setData("questions", [
      ...data.questions,
      {
        id: generateUniqueId(),
        question_number: data.questions.length + 1,
        text: "",
        question_image_url: null,
        text_explanation: "",
        video_explanation_url: "",
        image_explanation_url: null,
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

  const resetForm = () => {
    reset()
    clearErrors()
  }

  const validateForm = (): boolean => {
    let isValid = true
    clearErrors()

    data.questions.forEach((question, index) => {
      if (question.question_number <= 0) {
        setError(`questions.${index}.question_number` as any, "Question number must be greater than 0")
        isValid = false
      }
      if (question.text.trim() === "") {
        setError(`questions.${index}.text` as any, "Question text is required")
        isValid = false
      }
      if (question.text_explanation.trim() === "") {
        setError(`questions.${index}.text_explanation` as any, "Explanation is required")
        isValid = false
      }

      if (question.options.length > 0) {
        if (question.options.some((option) => option.trim() === "")) {
          setError(`questions.${index}.options` as any, "All options must be non-empty")
          isValid = false
        }
        if (question.answer.length === 0) {
          setError(`questions.${index}.answer` as any, "Please select at least one answer when options are provided")
          isValid = false
        }
      }
    })

    return isValid
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // console.log("Submitting data:", data)

    post(route("quiz-questions.store"), {
      preserveScroll: true,
      preserveState: false,
      onSuccess: () => {
        setIsOpen(false)
        resetForm()
      },
      onError: (errors: any) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 flex flex-col">
        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle>Create New Quiz Questions for {title}</AlertDialogTitle>
          <AlertDialogDescription>Fill in the details for the new quiz questions.</AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="flex-grow px-6 overflow-y-auto">
          <form onSubmit={submit} className="space-y-4 py-4">
            <div className="space-y-4">
              {data.questions.map((question, index) => (
                <QuizQuestionForm
                  key={question.id}
                  index={index}
                  question={question}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                  errors={errors}
                />
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Question
            </Button>
          </form>
        </ScrollArea>

        <div className="p-6 border-t">
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing} onClick={submit}>
              Create Quiz Questions
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateQuizQuestionAlert

