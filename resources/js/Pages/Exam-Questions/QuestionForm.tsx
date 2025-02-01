import React from "react"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"
import { Input } from "@/Components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Checkbox } from "@/Components/ui/checkbox"
import InputError from "@/Components/InputError"
import { PlusCircle, X } from "lucide-react"

interface QuestionFormProps {
  index: number
  question: {
    question_text: string
    text_explanation: string
    question_image_url?: string
    video_explanation_url: string
    options: string[]
    answer: string[]
  }
  updateQuestion: (index: number, field: string, value: any) => void
  removeQuestion: (index: number) => void
  errors: Record<string, string>
}

const QuestionForm: React.FC<QuestionFormProps> = ({ index, question, updateQuestion, removeQuestion, errors }) => {
  const [isMultipleChoice, setIsMultipleChoice] = React.useState(question.answer.length > 1)

  const addOption = () => {
    const newOptions = [...question.options, ""]
    updateQuestion(index, "options", newOptions)
  }

  const removeOption = (optionIndex: number) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex)
    updateQuestion(index, "options", newOptions)
  }

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[optionIndex] = value
    updateQuestion(index, "options", newOptions)
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
          value={question.question_text}
          onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
          required
        />
        <InputError message={errors[`questions.${index}.question_text`]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`text_explanation_${index}`}>Explanation</Label>
        <Textarea
          id={`text_explanation_${index}`}
          value={question.text_explanation}
          onChange={(e) => updateQuestion(index, "text_explanation", e.target.value)}
          required
        />
        <InputError message={errors[`questions.${index}.text_explanation`]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`video_explanation_url_${index}`}>Video Explanation URL (optional)</Label>
        <Input
          id={`video_explanation_url_${index}`}
          type="url"
          value={question.video_explanation_url}
          onChange={(e) => updateQuestion(index, "video_explanation_url", e.target.value)}
        />
        <InputError message={errors[`questions.${index}.video_explanation_url`]} />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <Input
                value={option}
                onChange={(e) => updateOption(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
                required
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
        <InputError message={errors[`questions.${index}.options`]} />
      </div>

      <div className="space-y-2">
        <Label>Answer Type</Label>
        <RadioGroup
          value={isMultipleChoice ? "multiple" : "single"}
          onValueChange={(value) => {
            setIsMultipleChoice(value === "multiple")
            updateQuestion(index, "answer", value === "multiple" ? [] : "")
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id={`single_${index}`} />
            <Label htmlFor={`single_${index}`}>Single Choice</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple" id={`multiple_${index}`} />
            <Label htmlFor={`multiple_${index}`}>Multiple Choice</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Correct Answer(s)</Label>
        {isMultipleChoice ? (
          question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <Checkbox
                id={`answer_${index}_${optionIndex}`}
                checked={question.answer.includes(option)}
                onCheckedChange={(checked) => {
                  const newAnswer = checked ? [...question.answer, option] : question.answer.filter((a) => a !== option)
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
        <InputError message={errors[`questions.${index}.answer`]} />
      </div>
      
    </div>
  )
}

export default QuestionForm

