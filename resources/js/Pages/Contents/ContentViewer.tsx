import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ContentViewerProps {

  url: string;

  type: string;

}

const ContentViewer = ({ url }: ContentViewerProps) => {
  const [isVideo, setIsVideo] = useState(false)

  useEffect(() => {
    setIsVideo(url.match(/\.(mp4|webm|ogg)$/i) !== null)
  }, [url])

  if (!url) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Select content to view</p>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {isVideo ? (
          <video src={url} controls className="w-full h-auto" />
        ) : (
          <iframe src={url} className="w-full h-[400px] border-0" />
        )}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <Button variant="secondary" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContentViewer

