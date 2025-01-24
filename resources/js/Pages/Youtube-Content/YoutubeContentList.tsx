import React from 'react'
import { Button } from "@/Components/ui/button"
import { View } from 'lucide-react'
import { Quiz, YoutubeContent } from '@/types'
import { Link } from '@inertiajs/react';
import EditQuizAlert from './EditQuizAlert';
import DeleteQuizAlert from '../Quiz/DeleteQuizAlert';


interface YoutubeContentListProps {
  youtube_contents: YoutubeContent[]
}

const YoutubeContentList: React.FC<YoutubeContentListProps> = ({ youtube_contents }) => {
  return (
    <div className="space-y-4">
      {youtube_contents.map((youtube_content) => (
        <div key={youtube_content.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex-grow">
            <h3 className="font-semibold">{youtube_content.title}</h3>
            <a className="text-sm text-gray-600" href={youtube_content.url}>{youtube_content.url}</a>
          </div>
          <div className="flex space-x-2">
             
              {/* <EditQuizAlert quiz={youtube_content}/> */}
              <DeleteQuizAlert title={youtube_content.title} id={youtube_content.id} />

          </div>
        </div>
      ))}
    </div>
  )
}

export default YoutubeContentList

