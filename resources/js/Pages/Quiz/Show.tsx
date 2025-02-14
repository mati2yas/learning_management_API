import { Button } from "@/Components/ui/button"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft, Edit2, PlusCircle, Trash2 } from "lucide-react"
import { Head, Link, usePage } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import EditQuizQuestionAlert from "../Quiz-Question/EditQuizQuestionAlert"
import DeleteQuizQuestionAlert from "../Quiz-Question/DeleteQuizQuestionAlert"
import CreateQuizQuestionAlert from "../Quiz-Question/CreateQuizQuestionAlert"
import type { Quiz, QuizQuestion } from "@/types"
import { SessionToast } from "@/Components/SessionToast"
import PermissionAlert from "@/Components/PermissionAlert"

interface ShowProps {
  quiz: Quiz
  quiz_questions: QuizQuestion[]
  chapter_id: number
  canAddQuizQuestions: boolean,
  canUpdateQuizQuestions: boolean,
  canDeleteQuizQuestions: boolean,
  session: string
}
  
const Show = ({ quiz, quiz_questions, chapter_id,             canAddQuizQuestions,
  canUpdateQuizQuestions,
  canDeleteQuizQuestions,
   session}: ShowProps) => {


  const sortedQuestions = [...quiz_questions].sort((a, b) => a.question_number - b.question_number)

  const { flash } = usePage().props as unknown as { flash: { success?: string } };
 
  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Quiz: {quiz.title}</h1>
          <Link href={route("chapters.show", chapter_id)}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
            </Button>
          </Link>
        </div>
      }
    >
      <Head title="Quiz Detail" />

      {flash.success && (<SessionToast message={flash.success }  />)}

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quiz Questions</h2>
            {
              canAddQuizQuestions ? <CreateQuizQuestionAlert quizId={quiz.id} title={quiz.title} /> : <PermissionAlert 
              children={'Add Content'}
              permission='add a content'
              buttonVariant={'outline'}
              className='p-2 text-xs'
              icon={<PlusCircle className='w-5 h-5 mr-2' />}
            /> 
            }
            
          </div>
          {sortedQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
            <img src={'/images/Seminar-amico.svg'} alt="No data available" className="w-48 h-48" />
            <p className="text-gray-500 mt-4 text-lg">No Quizes available. Start creating one!</p>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedQuestions.map((question) => (
                <QuizQuestionCard key={question.id} question={question}   canUpdateQuizQuestions={canUpdateQuizQuestions}
                canDeleteQuizQuestions={canDeleteQuizQuestions}  />
              ))}
            </div>
          )}
        </div>
      </div>
    </Authenticated>
  )
}

interface QuizQuestionCardProps {
  question: QuizQuestion
  canUpdateQuizQuestions: boolean
  canDeleteQuizQuestions: boolean
}

const QuizQuestionCard = ({ question, canDeleteQuizQuestions, canUpdateQuizQuestions }: QuizQuestionCardProps) => {
  
  const options = JSON.parse(question.options as unknown as string)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Question {question.question_number}</span>
          <Badge variant="secondary">{options.length} Options</Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2">{question.text}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {question.question_image_url && (
          <img
            src={`${question.question_image_url.replace("/quizzes/", "/")}`}
            alt="Question"
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        )}
        <p className="font-semibold mb-2">Explanation:</p>
        <p className="text-sm text-gray-600 line-clamp-3">{question.text_explanation}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          {
              canUpdateQuizQuestions ?  <EditQuizQuestionAlert quiz_question={question} />: <PermissionAlert 
              children={'Edit'}
              permission='edit a quiz question'
              buttonVariant={'outline'}
              className='text-green-600 hover:text-green-700 hover:bg-green-50'
              buttonSize={'sm'}
              icon={<Edit2 className='w-4 h-4 mr-1' />}
            /> 
          }

          {
              canDeleteQuizQuestions ?  <DeleteQuizQuestionAlert id={question.id} question_number={question.question_number} />: <PermissionAlert 
              children={'Delete'}
              permission='delete a quiz question'
              buttonVariant={'outline'}
              className='text-red-600 hover:text-red-700 hover:bg-red-50'
              buttonSize={'sm'}
              icon={<Trash2 className='w-5 h-5 mr-2' />}
            /> 
          }
          
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
  )
}

export default Show

