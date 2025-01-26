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
import { PlusCircle, X } from "lucide-react"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Checkbox } from "@/Components/ui/checkbox"
import InputError from "@/Components/InputError"
import { Input } from "@/Components/ui/input"

interface CreateQuizQuestionAlertProps {
  quizId: number
  title: string
}

const CreateQuizQuestionAlert = ({ quizId, title }: CreateQuizQuestionAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>("")
  const [isMultipleChoice, setIsMultipleChoice] = useState(false)
  const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm<{
    quiz_id: number
    question_number: number
    text: string
    question_image_url: File | null
    text_explanation: string
    video_explanation_url: string
    options: string[]
    answer: string[]
  }>({
    quiz_id: quizId,
    question_number: 0,
    text: "",
    question_image_url: null,
    text_explanation: "",
    video_explanation_url: "",
    options: [],
    answer: [],
  })

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    reset()
    setOptions([])
    setCorrectAnswer(isMultipleChoice ? [] : "")
    setQuestionImagePreview(null)
    setIsMultipleChoice(false)
    setData("options", [])
    setData("answer", [])
    clearErrors()
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

    if (data.question_number <= 0) {
      setError("question_number", "Question number must be greater than 0")
      isValid = false
    }

    if (data.text.trim() === "") {
      setError("text", "Question text is required")
      isValid = false
    }

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

    post(route("quiz-questions.store"), {
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
          Add Question
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle>Create New Quiz Question</AlertDialogTitle>
          <AlertDialogDescription>Fill in the details for the new quiz question.</AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[calc(90vh-130px)] overflow-y-auto px-6">
          <form onSubmit={submit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question_number">Question Number</Label>
                <Input
                  required
                  id="question_number"
                  type="number"
                  value={data.question_number}
                  onChange={(e) => setData("question_number", Number.parseInt(e.target.value))}
                />
                <InputError message={errors.question_number} />
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
                defaultValue="single"
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
            Create
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateQuizQuestionAlert

