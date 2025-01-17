import React from 'react'
import { FileText, Youtube, File, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/Components/ui/button"

interface Content {
  id: number
  name: string
  url?: string
  content?: string
  type: 'youtube' | 'document' | 'text'
  order: number
}

interface ContentListProps {
  contents: Content[]
  onEdit: (content: Content) => void
  onDelete: (content: Content) => void
}

const ContentList: React.FC<ContentListProps> = ({ contents, onEdit, onDelete }) => {
  return (
    <ul className="space-y-2">
      {contents.map((content) => (
        <li key={content.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
          <div className="flex items-center">
            {content.type === 'youtube' && <Youtube className="w-5 h-5 mr-2 text-red-500" />}
            {content.type === 'document' && <File className="w-5 h-5 mr-2 text-blue-500" />}
            {content.type === 'text' && <FileText className="w-5 h-5 mr-2 text-green-500" />}
            <span className="mr-2">{content.order}.</span>
            <span>{content.name}</span>
          </div>
          <div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(content)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(content)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ContentList

