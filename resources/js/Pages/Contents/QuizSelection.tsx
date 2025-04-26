import React, { useState } from 'react'
import { Button } from '@/Components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Label } from '@/Components/ui/label'
import { Quiz, QuizQuestion } from '@/types'

interface QuizSectionProps {
  quiz: Quiz
}

const QuizSection = ({ quiz }: QuizSectionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  // const question = quiz.questions[currentQuestion]

  const handleSubmit = () => {
    // if (selectedAnswer === question.answer) {
    //   setShowExplanation(true)
    // }
  }

  const handleNext = () => {
    // setCurrentQuestion((prev) => (prev + 1) % quiz.questions.length)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  return (
    <div className="space-y-4">
      {/* <h3 className="font-semibold">{question.text}</h3> */}
      <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
        {/* {question.options.map((option: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`}>{option}</Label>
          </div>
        ))} */}
      </RadioGroup>
      <div className="flex space-x-2">
        <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
          Submit
        </Button>
        <Button onClick={handleNext} variant="outline">
          Next Question
        </Button>
      </div>
      {showExplanation && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="font-semibold">Explanation:</p>
          {/* <p>{question.text_explanation}</p> */}
        </div>
      )}
    </div>
  )
}

export default QuizSection

