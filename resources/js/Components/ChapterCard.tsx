import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Chapter } from '@/types';
import { Link } from '@inertiajs/react';

interface ChapterCardProps {
  chapter: Chapter;
}

const ChapterCard = ({
  chapter
}:ChapterCardProps) => {
  return (
  <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{chapter.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{chapter.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{chapter.contents_count} lessons</span>
          <Link href={route('chapters.show', chapter.id)}>
            <Button variant="outline" size="sm">View</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChapterCard
