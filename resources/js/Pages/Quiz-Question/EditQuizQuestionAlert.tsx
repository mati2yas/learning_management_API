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
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"
import { type FormEventHandler, useState, useEffect } from "react"
import { Edit2, PlusCircle, X } from "lucide-react"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Checkbox } from "@/Components/ui/checkbox"
import InputError from "@/Components/InputError"
import type { QuizQuestion } from "@/types"

interface EditQuizQuestionAlertProps {
  quiz_question: QuizQuestion
}

const EditQuizQuestionAlert = ({ quiz_question }: EditQuizQuestionAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const parsedOptions = JSON.parse(quiz_question.options as unknown as string)
  const parsedAnswer = JSON.parse(quiz_question.answer as unknown as string)
  const [isMultipleChoice, setIsMultipleChoice] = useState(parsedAnswer.length > 1)
  const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(quiz_question.question_image_url)

  const { data, setData, post, processing, errors, reset } = useForm<{
    _method: string
    quiz_id: number
    question_number: number
    text: string
    question_image_url: File | null | string
    text_explanation: string
    video_explanation_url: string
    options: string[]
    answer: string[]
  }>({
    _method: "PATCH",
    quiz_id: quiz_question.quiz_id,
    question_number: quiz_question.question_number,
    text: quiz_question.text,
    question_image_url: quiz_question.question_image_url,
    text_explanation: quiz_question.text_explanation,
    video_explanation_url: quiz_question.video_explanation_url,
    options: parsedOptions,
    answer: parsedAnswer,
  })

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    reset()
    setIsMultipleChoice(parsedAnswer.length > 1)
    setQuestionImagePreview(quiz_question.question_image_url)
  }

  const addOption = () => {
    setData("options", [...data.options, ""])
  }

  const removeOption = (index: number) => {
    setData(
      "options",
      data.options.filter((_, i) => i !== index),
    )
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...data.options]
    newOptions[index] = value
    setData("options", newOptions)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setData("question_image_url", file)
      const reader = new FileReader()
      reader.onload = () => {
        setQuestionImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnswerTypeChange = (value: string) => {
    const newIsMultipleChoice = value === "multiple"
    setIsMultipleChoice(newIsMultipleChoice)
    setData("answer", newIsMultipleChoice ? [] : [data.answer[0] || ""])
  }

  const handleSingleAnswerChange = (value: string) => {
    setData("answer", [value])
  }

  const handleMultipleAnswerChange = (option: string, checked: boolean) => {
    const newAnswers = checked ? [...data.answer, option] : data.answer.filter((answer) => answer !== option)
    setData("answer", newAnswers)
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route("quiz-questions.update", quiz_question.id), {
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
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => setIsOpen(true)}
        >
          <Edit2 className="h-4 w-4 mr-1" /> Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle>Edit Quiz Question</AlertDialogTitle>
          <AlertDialogDescription>Update the details for this quiz question.</AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[calc(90vh-130px)] overflow-y-auto px-6">
          <form onSubmit={submit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question_number">Question Number</Label>
                <Input
                  id="question_number"
                  type="number"
                  value={data.question_number}
                  onChange={(e) => setData("question_number", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="question_image_url">Image (optional)</Label>
                <Input id="question_image_url" type="file" name="question_image_url" onChange={handleImageChange} />
                {questionImagePreview && (
                  <div className="mt-2">
                    <img
                      src={questionImagePreview.startsWith("data:") ? questionImagePreview : `/storage/${questionImagePreview}`}
                      alt="Question Preview"
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                )}
                <InputError message={errors.question_image_url} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Question Text</Label>
              <Textarea id="text" value={data.text} onChange={(e) => setData("text", e.target.value)} required />
              <InputError message={errors.text} />
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
                {data.options.map((option, index) => (
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
              <RadioGroup value={isMultipleChoice ? "multiple" : "single"} onValueChange={handleAnswerTypeChange}>
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
                data.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`answer-${index}`}
                      checked={data.answer.includes(option)}
                      onCheckedChange={(checked) => handleMultipleAnswerChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`answer-${index}`}>{option}</Label>
                  </div>
                ))
              ) : (
                <RadioGroup value={data.answer[0]} onValueChange={handleSingleAnswerChange}>
                  {data.options.map((option, index) => (
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

export default EditQuizQuestionAlert

