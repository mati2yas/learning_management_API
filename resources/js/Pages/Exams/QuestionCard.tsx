

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import type { ExamGrade, ExamQuestion, ExamType, ExamYear } from "@/types"
import DeleteExamQuestionAlert from "./DeleteExamQuestionAlert"
import { Link } from "@inertiajs/react"
import { PencilIcon, Trash2, X } from "lucide-react"
import { Dialog, DialogContent } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import PermissionAlert from "@/Components/PermissionAlert"


interface QuestionCardProps {
  question: ExamQuestion & {
    options: string
    answer: string
    question_image_url: string | null
  }
  examTypes: ExamType[]
  examGrades: ExamGrade[]
  examYears: ExamYear[]
  canEdit: boolean
  canDelete: boolean
  getExamCourseName: (id: number) => string
  getChapterTitle: (id: number) => string
  getExamYear: (id: number) => string | number
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  examTypes,
  examGrades,
  examYears,
  canEdit,
  canDelete,
  getExamCourseName,
  getChapterTitle,
  getExamYear,
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false)

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

  const getImageUrl = (url: string | null) => {
    if (!url) return undefined
    return url.startsWith("/id") ? `https://picsum.photos${url.replace("storage/", "")}` : url
  }

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
        {question.question_image_url && (
          <div className="mb-4">
            <div
              className="relative aspect-video overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => setIsImageOpen(true)}
            >
              <img
                src={getImageUrl(question.question_image_url) || "/placeholder.svg"}
                alt="Question Image"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
          <DialogContent className="max-w-4xl w-full p-0">
            <div className="relative w-full h-full max-h-[90vh] overflow-hidden">
              <img
                src={getImageUrl(question.question_image_url) || "/placeholder.svg"}
                alt="Question Image"
                className="w-full h-full object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setIsImageOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        <div className="flex gap-2 mt-4">
          {canEdit ? (
            <Link
              prefetch
              className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 flex items-center justify-center rounded-md"
              href={route("exams.edit", question.id)}
            >
              <PencilIcon className="h-4 w-4" />
            </Link>
          ) : (
            <PermissionAlert
              children={undefined}
              permission={"can update exam question"}
              icon={<PencilIcon className="h-4 w-4" />}
              className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 flex items-center justify-center rounded-md"
            />
          )}

          {canDelete ? (
            <DeleteExamQuestionAlert id={question.id} />
          ) : (
            <PermissionAlert
              children={""}
              permission={"can delete exam question"}
              icon={<Trash2 className="w-4 h-4" />}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionCard

