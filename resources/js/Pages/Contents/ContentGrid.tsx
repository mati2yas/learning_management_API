import React from 'react'
import { FileText, Youtube, File, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Content } from '@/types'
import EditContentAlert from './EditContentAlert'
import DeleteContentAlert from './DeleteContentAlert'


interface ContentGridProps {
  contents: Content[]
}

const ContentGrid: React.FC<ContentGridProps> = ({ contents }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contents.length > 0 ? (
          contents.map((content) => (
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
        ))
      ): (
      <div className="w-full flex justify-center items-center">
        <h2 className="text-lg font-semibold w-full  pl-2 h-10 pt-3">No contents found.</h2>
      </div>
    )}
    </div>
  )
}

export default ContentGrid

