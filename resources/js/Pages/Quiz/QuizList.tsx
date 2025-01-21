import React from 'react'
import { Button } from "@/Components/ui/button"
import { Pencil, Trash2, View } from 'lucide-react'
import { Quiz } from '@/types'

const dummyQuizzes: Quiz[] = [
  {
    id: 1,
    chapter_id: 0,
    title: '',
 
  },
  {
    id: 2,
    chapter_id: 0,
    title: '',
  
  },
];

interface QuizListProps {
  quizzes: Quiz[]
}

const QuizList: React.FC<QuizListProps> = ({ quizzes=dummyQuizzes }) => {
  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex-grow">
            <h3 className="font-semibold">{quiz.title}</h3>
            <p className="text-sm text-gray-600">{quiz.title} questions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>

            <Button variant="outline" size="sm">
              <View className="h-4 w-4 mr-2" /> View
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuizList

