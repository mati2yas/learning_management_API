import React from 'react'
import { Button } from "@/Components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'

interface Content {
  id: number
  name: string
  type: string
  url: string
}

interface ContentListProps {
  contents: Content[]
}

const ContentList: React.FC<ContentListProps> = ({ contents }) => {
  return (
    <div className="space-y-4">
      {contents.map((content, index) => (
        <div key={content.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-4">
            {index + 1}
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold">{content.name}</h3>
            <p className="text-sm text-gray-600">{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContentList

