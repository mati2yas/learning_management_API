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
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"
import { type FormEventHandler, useState, useEffect } from "react"
import { Edit2, PlusCircle, X } from "lucide-react"
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
  const [answerType, setAnswerType] = useState<"no_options" | "single" | "multiple">(
    parsedOptions?.length === 0 ? "no_options" : parsedAnswer?.length > 1 ? "multiple" : "single",
  )
  const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(quiz_question.question_image_url)
  const [imageExplanationPreview, setImageExplanationPreview] = useState<string | null>(
    quiz_question.image_explanation_url,
  )

  const { data, setData, post, processing, errors, reset } = useForm<{
    _method: string
    quiz_id: number
    question_number: number
    text: string
    question_image_url: File | null | string
    text_explanation: string
    video_explanation_url: string
    image_explanation_url: File | null | string
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
    image_explanation_url: quiz_question.image_explanation_url,
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
    setAnswerType(parsedOptions.length === 0 ? "no_options" : parsedAnswer.length > 1 ? "multiple" : "single")
    setQuestionImagePreview(quiz_question.question_image_url)
    setImageExplanationPreview(quiz_question.image_explanation_url)
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "question_image_url" | "image_explanation_url",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setData(field, file)
      const reader = new FileReader()
      reader.onload = () => {
        if (field === "question_image_url") {
          setQuestionImagePreview(reader.result as string)
        } else {
          setImageExplanationPreview(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnswerTypeChange = (value: "no_options" | "single" | "multiple") => {
    setAnswerType(value)
    if (value === "no_options") {
      setData("options", [])
      setData("answer", [])
    } else {
      if (data.options.length === 0) {
        setData("options", [""])
      }
      if (value === "single" && data.answer.length > 1) {
        setData("answer", data.answer.slice(0, 1))
      } else if (value === "multiple" && data.answer.length === 1) {
        setData("answer", data.answer)
      }
    }
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === "question_image_url" || key === "image_explanation_url") {
        if (value instanceof File) {
          formData.append(key, value)
        }
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else if (value !== null) {
        formData.append(key, value.toString())
      }
    })

    post(route("quiz-questions.update", quiz_question.id), {
      data: formData,
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
      <AlertDialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Quiz Question</AlertDialogTitle>
          <AlertDialogDescription>Update the details for this quiz question.</AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={submit} className="space-y-4 py-4 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="question_number">Question Number</Label>
            <Input
              id="question_number"
              type="number"
              value={data.question_number}
              onChange={(e) => setData("question_number", Number.parseInt(e.target.value))}
            />
            <InputError message={errors.question_number} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Question Text</Label>
            <Textarea id="text" value={data.text} onChange={(e) => setData("text", e.target.value)} required />
            <InputError message={errors.text} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question_image_url">Question Image (optional)</Label>
            <Input
              id="question_image_url"
              name="question_image_url"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "question_image_url")}
            />
            {questionImagePreview && (
              <img src={ questionImagePreview || "/placeholder.svg"} alt="Question Preview" className="mt-2 max-w-xs" />
            )}
            <InputError message={errors.question_image_url} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text_explanation">Text Explanation</Label>
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

          <div className="space-y-2">
            <Label htmlFor="image_explanation_url">Image Explanation (optional)</Label>
            <Input
              id="image_explanation_url"
              name="image_explanation_url"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "image_explanation_url")}
            />
            {imageExplanationPreview && (
              <img
                src={imageExplanationPreview || "/placeholder.svg"}
                alt="Explanation Preview"
                className="mt-2 max-w-xs"
              />
            )}
            <InputError message={errors.image_explanation_url} />
          </div>

          <div className="space-y-2">
            <Label>Answer Type</Label>
            <RadioGroup value={answerType} onValueChange={handleAnswerTypeChange}>
              <div className="flex flex-col space-y-2">
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no_options" id="no_options" />
                  <Label htmlFor="no_options">No Options (Free Text)</Label>
                </div> */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple">Multiple Choice</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {answerType !== "no_options" && (
            <>
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
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
                <InputError message={errors.options} />
              </div>

              <div className="space-y-2">
                <Label>Correct Answer(s)</Label>
                {answerType === "multiple" ? (
                  data.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`answer-${index}`}
                        checked={data.answer.includes(option)}
                        onCheckedChange={(checked) => {
                          const newAnswer = checked ? [...data.answer, option] : data.answer.filter((a) => a !== option)
                          setData("answer", newAnswer)
                        }}
                      />
                      <Label htmlFor={`answer-${index}`}>{option}</Label>
                    </div>
                  ))
                ) : (
                  <RadioGroup value={data.answer[0] || ""} onValueChange={(value) => setData("answer", [value])}>
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
            </>
          )}
        </form>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={processing} onClick={submit}>
            Update
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditQuizQuestionAlert

