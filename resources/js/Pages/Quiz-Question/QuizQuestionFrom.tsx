import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"
import { Input } from "@/Components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Checkbox } from "@/Components/ui/checkbox"
import InputError from "@/Components/InputError"
import { PlusCircle, X } from "lucide-react"

interface QuizQuestionFormProps {
  index: number
  question: {
    image_explanation_url: any
    id: string
    question_number: number
    text: string
    question_image_url: string | null
    text_explanation: string
    video_explanation_url: string
    options: string[]
    answer: string[]
  }
  updateQuestion: (index: number, field: string, value: any) => void
  removeQuestion: (index: number) => void
  errors: Record<string, string>
}

const QuizQuestionForm: React.FC<QuizQuestionFormProps> = ({
  index,
  question,
  updateQuestion,
  removeQuestion,
  errors,
}) => {
  const [answerType, setAnswerType] = useState<"no_options" | "single" | "multiple">(
    question.options.length === 0 ? "no_options" : question.answer.length > 1 ? "multiple" : "single",
  )

  useEffect(() => {
    const newAnswerType =
      question.options.length === 0 ? "no_options" : question.answer.length > 1 ? "multiple" : "single"
    setAnswerType(newAnswerType)
  }, [question.options.length, question.answer.length])

  const addOption = () => {
    const newOptions = [...question.options, ""]
    updateQuestion(index, "options", newOptions)
  }

  const removeOption = (optionIndex: number) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex)
    updateQuestion(index, "options", newOptions)
    const newAnswer = question.answer.filter((ans) => ans !== question.options[optionIndex])
    updateQuestion(index, "answer", newAnswer)
  }

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[optionIndex] = value
    updateQuestion(index, "options", newOptions)
    // Update answer if the changed option was selected
    if (question.answer.includes(question.options[optionIndex])) {
      const newAnswer = question.answer.map((ans) => (ans === question.options[optionIndex] ? value : ans))
      updateQuestion(index, "answer", newAnswer)
    }
  }

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, field: "question_image_url" | "image_explanation_url") => {
      const file = event.target.files?.[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("File size should not exceed 5 MB")
          event.target.value = ""
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          updateQuestion(index, field, base64String)
        }
        reader.readAsDataURL(file)
      }
    },
    [index, updateQuestion],
  )

  const handleAnswerTypeChange = (value: "no_options" | "single" | "multiple") => {
    setAnswerType(value)
    if (value === "no_options") {
      updateQuestion(index, "options", [])
      updateQuestion(index, "answer", [])
    } else {
      if (question.options.length === 0) {
        updateQuestion(index, "options", [""])
      }
      if (value === "single" && question.answer.length > 1) {
        updateQuestion(index, "answer", question.answer.slice(0, 1))
      } else if (value === "multiple" && question.answer.length === 1) {
        // Keep the existing answer when switching from single to multiple
        updateQuestion(index, "answer", question.answer)
      }
    }
  }

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Question {index + 1}</h3>
        <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`question_text_${index}`}>Question Text</Label>
        <Textarea
          id={`question_text_${index}`}
          value={question.text}
          onChange={(e) => updateQuestion(index, "text", e.target.value)}
          required
        />
        <InputError>{errors[`questions.${index}.text`]}</InputError>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`question_image_url_${index}`}>Question Image</Label>
        <Input
          id={`question_image_url_${index}`}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "question_image_url")}
        />
        {question.question_image_url && (
          <img src={question.question_image_url || "/placeholder.svg"} alt="Question" className="mt-2 max-w-xs" />
        )}
        <InputError>{errors[`questions.${index}.question_image`]}</InputError>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`text_explanation_${index}`}>Explanation(optional)</Label>
        <Textarea
          id={`text_explanation_${index}`}
          value={question.text_explanation}
          onChange={(e) => updateQuestion(index, "text_explanation", e.target.value)}
        />
        <InputError>{errors[`questions.${index}.text_explanation`]}</InputError>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`video_explanation_url_${index}`}>Video Explanation URL (optional)</Label>
        <Input
          id={`video_explanation_url_${index}`}
          type="url"
          value={question.video_explanation_url}
          onChange={(e) => updateQuestion(index, "video_explanation_url", e.target.value)}
        />
        <InputError>{errors[`questions.${index}.video_explanation_url`]}</InputError>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`image_explanation_url_${index}`}>Image Explanation</Label>
        <Input
          id={`image_explanation_url_${index}`}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "image_explanation_url")}
        />
        {question.image_explanation_url && (
          <img src={question.image_explanation_url || "/placeholder.svg"} alt="Explanation" className="mt-2 max-w-xs" />
        )}
        <InputError>{errors[`questions.${index}.image_explanation_url`]}</InputError>
      </div>

      <div className="space-y-2">
        <Label>Answer Type</Label>
        <RadioGroup value={answerType} onValueChange={handleAnswerTypeChange}>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id={`single_${index}`} />
              <Label htmlFor={`single_${index}`}>Single Choice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple" id={`multiple_${index}`} />
              <Label htmlFor={`multiple_${index}`}>Multiple Choice</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {answerType !== "no_options" && (
        <>
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(optionIndex)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addOption}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Correct Answer(s)</Label>
            {answerType === "multiple" ? (
              question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`answer_${index}_${optionIndex}`}
                    checked={question.answer.includes(option)}
                    onCheckedChange={(checked) => {
                      const newAnswer = checked
                        ? [...question.answer, option]
                        : question.answer.filter((a) => a !== option)
                      updateQuestion(index, "answer", newAnswer)
                    }}
                  />
                  <Label htmlFor={`answer_${index}_${optionIndex}`}>{option}</Label>
                </div>
              ))
            ) : (
              <RadioGroup
                value={question.answer[0] || ""}
                onValueChange={(value) => updateQuestion(index, "answer", [value])}
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`answer_${index}_${optionIndex}`} />
                    <Label htmlFor={`answer_${index}_${optionIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default QuizQuestionForm

