import React from 'react'
import { Card, CardContent } from "@/Components/ui/card"
import { Content } from '@/types'
import EditContentAlert from './EditContentAlert'
import DeleteContentAlert from './DeleteContentAlert'


interface ContentGridProps {
  contents: Content[]
}

const ContentGrid: React.FC<ContentGridProps> = ({ contents }) => {

  return (
    <>
         
      {contents.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {contents.map((content) => (
          <Card key={content.id}>
            <CardContent className="p-4 flex flex-col items-center">

              <span className="mt-2 text-lg font-semibold">{content.order}. {content.name}</span>

              <div className="mt-4 flex space-x-2">
                <EditContentAlert 
                  content={content}
                />

                <DeleteContentAlert 
                  id={content.id}
                  name={content.name}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      ): (
        <div className="flex flex-col items-center justify-center py-16">
        <img src={'/images/Content-rafiki.svg'} alt="No data available" className="w-48 h-48" />
        <p className="text-gray-500 mt-4 text-lg">No Contents available. Start creating one!</p>
      </div>
    )}
   
    </>

  )
}

export default ContentGrid

