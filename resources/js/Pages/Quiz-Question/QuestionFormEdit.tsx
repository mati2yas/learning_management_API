import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import InputError from "@/Components/InputError"
import { X } from "lucide-react"
import type React from "react" // Added import for React

interface QuestionFormProps {
  question: {
    question_text: string
    question_image_url?: string | null
    text_explanation: string
    video_explanation_url: string
    options: string[]
    answer: string[]
  }
  updateQuestion: (field: string, value: any) => void
  errors: Record<string, string>
}

const QuestionFormEdit = ({ question, updateQuestion, errors }: QuestionFormProps) => {
  const addOption = () => {
    updateQuestion("options", [...question.options, ""])
  }

  const removeOption = (index: number) => {
    updateQuestion(
      "options",
      question.options.filter((_, i) => i !== index),
    )
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[index] = value
    updateQuestion("options", newOptions)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateQuestion("question_image_url", e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question_text">Question Text</Label>
        <Textarea
          id="question_text"
          value={question.question_text}
          onChange={(e) => updateQuestion("question_text", e.target.value)}
          required
        />
        <InputError message={errors.question_text} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="question_image_url">Image (optional)</Label>
        <Input id="question_image_url" type="file" name="question_image_url" onChange={handleImageChange} />
        {question.question_image_url && (
          <div className="mt-2">
            <img
              src={
                typeof question.question_image_url === "string"
                  ? question.question_image_url
                  : URL.createObjectURL(question.question_image_url)
              }
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
            value={question.text_explanation}
            onChange={(e) => updateQuestion("text_explanation", e.target.value)}
            required
          />
          <InputError message={errors.text_explanation} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_explanation_url">Video Explanation URL (optional)</Label>
          <Input
            id="video_explanation_url"
            type="url"
            value={question.video_explanation_url}
            onChange={(e) => updateQuestion("video_explanation_url", e.target.value)}
          />
          <InputError message={errors.video_explanation_url} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {question.options.map((option, index) => (
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
        <Label>Correct Answer(s)</Label>
        {question.options.length > 0 && (
          <RadioGroup value={question.answer[0]} onValueChange={(value) => updateQuestion("answer", [value])}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`answer-${index}`} />
                <Label htmlFor={`answer-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        <InputError message={errors.answer} />
      </div>
    </div>
  )
}

export default QuestionFormEdit

