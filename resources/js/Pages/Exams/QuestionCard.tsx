import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import type { ExamQuestion } from "@/types"

interface QuestionCardProps {
  question: ExamQuestion & {
    options: string
    answer: string
  }
  getExamCourseName: (id: number) => string
  getChapterTitle: (id: number) => string
  getExamYear: (id: number) => string | number
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, getExamCourseName, getChapterTitle, getExamYear }) => {
  const parseJsonString = (jsonString: string): string[] => {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      console.error("Error parsing JSON string:", error)
      return []
    }
  }

  const options = parseJsonString(question.options)
  const answers = parseJsonString(question.answer)

  console.log("Raw options:", question.options)
  console.log("Parsed options:", options)
  console.log("Raw answers:", question.answer)
  console.log("Parsed answers:", answers)

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{question.question_text}</CardTitle>

        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{getExamCourseName(question.exam_course_id)}</Badge>
          <Badge variant="outline">{getChapterTitle(question.exam_chapter_id)}</Badge>
          <Badge variant="outline">{getExamYear(question.exam_year_id)}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-colors ${
                answers.includes(option)
                  ? "bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800 text-green-900 dark:text-green-100"
                  : "bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700"
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionCard

