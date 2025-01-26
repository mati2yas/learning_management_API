import { Button } from "@/Components/ui/button"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft } from "lucide-react"
import { Head, Link } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import EditQuizQuestionAlert from "../Quiz-Question/EditQuizQuestionAlert"
import DeleteQuizQuestionAlert from "../Quiz-Question/DeleteQuizQuestionAlert"
import CreateQuizQuestionAlert from "../Quiz-Question/CreateQuizQuestionAlert"
import { Quiz, QuizQuestion } from "@/types"

interface ShowProps {
  quiz: Quiz
  quiz_questions: QuizQuestion[]
  chapter_id: number
}

const Show = ({ quiz, quiz_questions, chapter_id }: ShowProps) => {

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Quiz: {quiz.title}</h1>

          <Link href={route('chapters.show', chapter_id)}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
            </Button>
          </Link>
        </div>
      }
    >
      <Head title="Quiz Detail" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Content Here */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quiz Questions</h2>
            <CreateQuizQuestionAlert quizId={quiz.id} title={quiz.title} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quiz_questions.map((question) => (
              <Card key={question.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Question {question.question_number}</span>
                    <Badge variant="secondary">{JSON.parse(question.options as unknown as string).length} Options</Badge>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{question.text}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {question.question_image_url && (
                    <img
                      src={
                       '/' + 'storage/' + question.question_image_url.replace('/quizzes/', '/')
                      }
                      alt="Question"
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="font-semibold mb-2">Explanation:</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{question.text_explanation}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <EditQuizQuestionAlert quiz_question={question} />
                    <DeleteQuizQuestionAlert id={question.id} question_number={question.question_number}  />
                  </div>
                  {question.video_explanation_url && (
                    <Button variant="link" size="sm" asChild>
                      <a href={question.video_explanation_url} target="_blank" rel="noopener noreferrer">
                        Watch Explanation
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          {quiz_questions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No questions added to this quiz yet.</p>
            </div>
          )}
        </div>
      </div>
    </Authenticated>
  )
}

export default Show

