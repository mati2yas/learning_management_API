import React from 'react'
import { Card, CardContent } from "@/Components/ui/card"
import { Content } from '@/types'
import EditContentAlert from './EditContentAlert'
import DeleteContentAlert from './DeleteContentAlert'
import PermissionAlert from '@/Components/PermissionAlert'
import { Edit2, Trash2 } from 'lucide-react'


interface ContentGridProps {
  contents: Content[]
  canEdit: boolean
  canDelete: boolean
}

const ContentGrid: React.FC<ContentGridProps> = ({ contents, canDelete, canEdit }) => {

  return (
    <>
         
      {contents.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {contents.map((content) => (
          <Card key={content.id}>
            <CardContent className="p-4 flex flex-col items-center">

              <span className="mt-2 text-lg font-semibold">{content.order}. {content.name}</span>

              <div className="mt-4 flex space-x-2">
              {
                canEdit ? <EditContentAlert content={content} /> : <PermissionAlert
                  children={'Edit'}
                  buttonSize={'sm'}
                  permission='edit a content'
                  className='text-green-600 hover:text-green-700 hover:bg-green-50'
                  icon={<Edit2 className='h-4 w-4 mr-1' />}
                  buttonVariant={'outline'}

                />
              }
                <EditContentAlert 
                  content={content}
                />

                {
                  canDelete ? <DeleteContentAlert id={content.id} name={content.name} /> : <PermissionAlert
                    children={'Delete'}
                    buttonSize={'sm'}
                    permission='edit a content'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    icon={<Trash2 className='h-4 w-4 mr-1' />}
                    buttonVariant={'outline'}
                  />
                }

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

