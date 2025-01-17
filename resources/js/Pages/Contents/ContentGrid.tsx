import React from 'react'
import { FileText, Youtube, File, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"

interface Content {
  id: number
  name: string
  url?: string
  content?: string
  type: 'youtube' | 'document' | 'text'
  order: number
}

interface ContentGridProps {
  contents: Content[]
  onEdit: (content: Content) => void
  onDelete: (content: Content) => void
}

const ContentGrid: React.FC<ContentGridProps> = ({ contents, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contents.map((content) => (
        <Card key={content.id}>
          <CardContent className="p-4 flex flex-col items-center">
            {content.type === 'youtube' && <Youtube className="w-12 h-12 text-red-500" />}
            {content.type === 'document' && <File className="w-12 h-12 text-blue-500" />}
            {content.type === 'text' && <FileText className="w-12 h-12 text-green-500" />}
            <span className="mt-2 text-lg font-semibold">{content.order}. {content.name}</span>
            <span className="mt-1 text-sm text-gray-500 capitalize">{content.type}</span>
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(content)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(content)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ContentGrid

