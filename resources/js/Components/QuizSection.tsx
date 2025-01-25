
import { useState, useEffect, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'
import { Quiz } from '@/types'

interface QuizQuestion {
  text_explanation: ReactNode
  question_number: number
  text: string
  question_image_url: string | null
  options: string[]
  answer: number
}

interface QuizSectionProps {
  quiz: Quiz;
}

export default function QuizSection({ quiz }: QuizSectionProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)



  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setShowExplanation(true)
    }
  }

  const handleNext = () => {
    setCurrentQuestion(prev => (prev + 1) % questions.length)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  if (questions.length === 0) return null

  const question = questions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.text}</p>
        {question.question_image_url && (
          <img src={question.question_image_url} alt="Question" className="mb-4 rounded-md" />
        )}
        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-4 space-x-2">
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
            <p>{questions[currentQuestion].text_explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

