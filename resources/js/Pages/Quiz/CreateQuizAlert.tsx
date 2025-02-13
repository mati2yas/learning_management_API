import { type FormEventHandler, useState, useEffect, useCallback } from "react"
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

const MAX_QUIZZES = 10

const CreateMultipleQuizzesAlert = ({ id, chapter_title }: CreateMultipleQuizzesAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [quizTitles, setQuizTitles] = useState<string[]>([""])

  const { data, setData, post, processing, errors, reset } = useForm({
    chapter_id: id,
    quizzes: [] as { title: string }[],
  })

  useEffect(() => {
    setData("chapter_id", id)
  }, [id, setData])

  const updateFormData = useCallback(() => {
    const quizzes = quizTitles.filter((title) => title.trim() !== "").map((title) => ({ title }))
    setData("quizzes", quizzes)
  }, [setData])

  const addQuizTitle = useCallback(() => {
    setQuizTitles((prev) => {
      const newTitles = prev.length < MAX_QUIZZES ? [...prev, ""] : prev
      updateFormData()
      return newTitles
    })
  }, [updateFormData])

  const removeQuizTitle = useCallback(
    (index: number) => {
      setQuizTitles((prev) => {
        const newTitles = prev.filter((_, i) => i !== index)
        updateFormData()
        return newTitles
      })
    },
    [updateFormData],
  )

  const updateQuizTitle = useCallback(
    (index: number, value: string) => {
      setQuizTitles((prev) => {
        const newTitles = [...prev]
        newTitles[index] = value
        updateFormData()
        return newTitles
      })
    },
    [updateFormData],
  )


  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route("quizzes.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false)
        reset()
        setQuizTitles([""])
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
          <AlertDialogDescription>Add up to {MAX_QUIZZES} quiz titles</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {quizTitles.map((title, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Label htmlFor={`quiz-${index}`} className="sr-only">
                Quiz Title
              </Label>
              <Input
                id={`quiz-${index}`}
                value={title}
                onChange={(e) => updateQuizTitle(index, e.target.value)}
                placeholder={`Quiz ${index + 1} Title`}
                required
              />
              {index > 0 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeQuizTitle(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {quizTitles.length < MAX_QUIZZES && (
            <Button type="button" variant="outline" onClick={addQuizTitle}>
              Add Another Quiz
            </Button>
          )}

          <div className="flex justify-end space-x-2">
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false)
                reset()
                setQuizTitles([""])
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

