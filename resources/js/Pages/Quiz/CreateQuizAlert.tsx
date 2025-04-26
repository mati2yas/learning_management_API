import { useState, type FormEventHandler, useEffect } from "react"
import { useForm } from "@inertiajs/react"
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
import { PlusCircle, X } from "lucide-react"

interface CreateMultipleQuizzesAlertProps {
  id: number
  chapter_title: string
}

interface QuizData {
  title: string
  exam_duration?: number | null // Made duration optional
}

const MAX_QUIZZES = 10
const DEFAULT_DURATION = 30

const CreateMultipleQuizzesAlert = ({ id, chapter_title }: CreateMultipleQuizzesAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [quizData, setQuizData] = useState<QuizData[]>([{ title: "", exam_duration: DEFAULT_DURATION }])

  const { data, setData, post, processing, errors, reset } = useForm({
    chapter_id: id,
    quizzes: [] as { title: string; exam_duration?: number | null }[],
  })

  useEffect(() => {
    setData("chapter_id", id)
    updateFormData()
  }, [id, setData])

  const updateFormData = () => {
    const quizzes = quizData
      .filter((quiz) => quiz.title.trim() !== "")
      .map((quiz) => ({
        title: quiz.title,
        exam_duration: quiz.exam_duration || null, // Allow null for duration
      }))
    setData("quizzes", quizzes)
  }

  const addQuizData = () => {
    if (quizData.length < MAX_QUIZZES) {
      setQuizData((prev) => [...prev, { title: "", exam_duration: DEFAULT_DURATION }])
    }
  }

  const removeQuizData = (index: number) => {
    setQuizData((prev) => prev.filter((_, i) => i !== index))
  }

  const updateQuizTitle = (index: number, value: string) => {
    setQuizData((prev) => {
      const newData = [...prev]
      newData[index] = { ...newData[index], title: value }
      return newData
    })
  }

  const updateQuizDuration = (index: number, value: string) => {
    setQuizData((prev) => {
      const newData = [...prev]
      // Allow empty string to represent no duration
      const duration = value === "" ? null : Number.parseInt(value) || null
      newData[index] = {
        ...newData[index],
        exam_duration: duration,
      }
      return newData
    })
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    // Ensure form data is up-to-date before submission
    const quizzes = quizData
      .filter((quiz) => quiz.title.trim() !== "")
      .map((quiz) => ({
        title: quiz.title,
        exam_duration: quiz.exam_duration || null, // Allow null for duration
      }))
    setData("quizzes", quizzes)

    post(route("quizzes.store", id.toString()), {
      // Replace with your actual route logic. This assumes a route like /quizzes/:id
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
        setQuizData([{ title: "", exam_duration: DEFAULT_DURATION }])
      },
      onError: (errors) => {
        console.log("Validation errors:", errors)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add Quizzes
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Quizzes for {chapter_title}</AlertDialogTitle>
          <AlertDialogDescription>Add up to {MAX_QUIZZES} quiz titles with optional duration</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {quizData.map((quiz, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor={`quiz-${index}`} className="sr-only">
                  Quiz Title
                </Label>
                <Input
                  id={`quiz-${index}`}
                  value={quiz.title}
                  onChange={(e) => updateQuizTitle(index, e.target.value)}
                  placeholder={`Quiz ${index + 1} Title`}
                  required
                />
              </div>
              <div className="w-24">
                <Label htmlFor={`duration-${index}`} className="sr-only">
                  Duration (minutes)
                </Label>
                <Input
                  id={`duration-${index}`}
                  type="number"
                  min="1"
                  value={quiz.exam_duration === null ? "" : quiz.exam_duration}
                  onChange={(e) => updateQuizDuration(index, e.target.value)}
                  placeholder="Minutes"
                  // removed required attribute
                />
              </div>
              {index > 0 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeQuizData(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {quizData.length < MAX_QUIZZES && (
            <Button type="button" variant="outline" onClick={addQuizData}>
              Add Another Quiz
            </Button>
          )}

          <div className="flex justify-end space-x-2">
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false)
                reset()
                setQuizData([{ title: "", exam_duration: DEFAULT_DURATION }])
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={processing}>
              Create Quizzes
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateMultipleQuizzesAlert
