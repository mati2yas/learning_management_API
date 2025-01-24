import { Button } from "@/Components/ui/button"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft } from "lucide-react"
import { Head } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import EditQuizQuestionAlert from "../Quiz-Question/EditQuizQuestionAlert"
import DeleteQuizQuestionAlert from "../Quiz-Question/DeleteQuizQuestionAlert"
import CreateQuizQuestionAlert from "../Quiz-Question/CreateQuizQuestionAlert"
import { Quiz, QuizQuestion } from "@/types"

interface ShowProps {
  quiz: Quiz
  quiz_questions: QuizQuestion[]
}


// const dummyQuizQuestions: QuizQuestion[] = [
//   {
//     id: 1,
//     quiz_id: 1,
//     question_number: 1,
//     text: 'What is the capital of France?',
//     question_image_url: 'https://example.com/question1.jpg',
//     text_explanation: 'The capital of France is Paris.',
//     video_explanation_url: 'https://example.com/explanation1.mp4',
//     options: ['Paris', 'London', 'Berlin', 'Madrid'],
//     answer: ['Paris'],
//     created_at: '2023-01-01T00:00:00Z',
//     updated_at: '2023-01-01T00:00:00Z',
//   },
//   {
//     id: 2,
//     quiz_id: 1,
//     question_number: 2,
//     text: 'What is 2 + 2?',
//     question_image_url: 'https://example.com/question2.jpg',
//     text_explanation: '2 + 2 equals 4.',
//     video_explanation_url: 'https://example.com/explanation2.mp4',
//     options: ['3', '4', '5', '6'],
//     answer: ['4'],
//     created_at: '2023-01-01T00:00:00Z',
//     updated_at: '2023-01-01T00:00:00Z',
//   },
// ];

const Show = ({ quiz, quiz_questions }: ShowProps) => {
  console.log(quiz_questions)
  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Quiz: {quiz.title}</h1>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
          </Button>
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
                      src={question.question_image_url || "/placeholder.svg"}
                      alt="Question"
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="font-semibold mb-2">Explanation:</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{question.text_explanation}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <EditQuizQuestionAlert  />
                    <DeleteQuizQuestionAlert  />
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
              {/* <CreateQuizQuestionAlert  /> */}
            </div>
          )}
        </div>
      </div>
    </Authenticated>
  )
}

export default Show

