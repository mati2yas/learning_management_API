import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import type { ExamQuestion } from "@/types"

interface QuestionCardProps {
  question: ExamQuestion
  getExamCourseName: (id: number) => string
  getChapterTitle: (id: number) => string
  getExamYear: (id: number) => string|number
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, getExamCourseName, getChapterTitle, getExamYear }) => {
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
          {Object.entries(JSON.parse(question.options as unknown as string)).map(([key, value]) => (
            <div
              key={key}
              className={`p-2 rounded ${
                JSON.parse(question.answers as unknown as string).includes(key) ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              {key}: {value as string}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionCard

