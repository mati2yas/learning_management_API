import React from 'react'
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'

interface Content {
  id: number
  name: string
  type: string
  url: string
}

interface ContentGridProps {
  contents: Content[]
}

const ContentGrid: React.FC<ContentGridProps> = ({ contents }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {contents.map((content, index) => (
        <Card key={content.id}>
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-2">
                {index + 1}
              </div>
              <h3 className="font-semibold">{content.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ContentGrid

