
import { useState } from 'react'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Button } from '@/Components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Chapter {
  chapter_id: string
  title: string
  contents: { content_id: string; name: string }[]
}

interface ChapterSidebarProps {
  currentContentId: string
  chapter: string
}

export default function ChapterSidebar({ currentContentId, chapterId }: ChapterSidebarProps) {

  const [isOpen, setIsOpen] = useState(true)



  return (
    <div className={`relative transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'}`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      <ScrollArea className="h-screen p-4 bg-muted">
        {chapters.map(chapter => (
          <div key={chapter.chapter_id} className="mb-4">
            <h3 className="font-semibold mb-2">{chapter.title}</h3>
            <ul className="space-y-1">
              {chapter.contents.map(content => (
                <li key={content.content_id}>
                  <Link href={`/content/${content.content_id}`}>
                    <Button
                      variant={currentContentId === content.content_id ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                    >
                      {content.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

