import React from 'react'
import {  YoutubeContent } from '@/types'
import DeleteQuizAlert from '../Quiz/DeleteQuizAlert';


interface YoutubeContentListProps {
  youtube_contents: YoutubeContent[]
}

const YoutubeContentList: React.FC<YoutubeContentListProps> = ({ youtube_contents }) => {
  return (
    <>
      {youtube_contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img src={'/images/Video tutorial-bro.svg'} alt="No data available" className="w-48 h-48" />
            <p className="text-gray-500 mt-4 text-lg">No Contents available. Start creating one!</p>
          </div>
      ) : (
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
      )}



    </>
  )
}

export default YoutubeContentList

