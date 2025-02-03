import React from 'react'
import { Button } from "@/Components/ui/button"
import { Eye, View } from 'lucide-react'
import { Quiz } from '@/types'
import EditQuizAlert from './EditQuizAlert';
import DeleteQuizAlert from './DeleteQuizAlert';
import { Link } from '@inertiajs/react';


interface QuizListProps {
  quizzes: Quiz[]
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  return (
    <div className="space-y-4">
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div key={quiz.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-grow">
              <h3 className="font-semibold">{quiz.title}</h3>
              <p className="text-sm text-gray-600">{quiz.title} questions</p>
            </div>
            <div className="flex space-x-2">
                
                <EditQuizAlert quiz={quiz}/>
                <DeleteQuizAlert title={quiz.title} id={quiz.id} />
  
              <Link href={route('quizzes.show', quiz.id)}>
                <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
  
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
        <img src={'/images/Online test-bro.svg'} alt="No data available" className="w-48 h-48" />
        <p className="text-gray-500 mt-4 text-lg">No Quiz available. Start creating one!</p>
      </div>
      )}

    </div>
  )
}

export default QuizList

