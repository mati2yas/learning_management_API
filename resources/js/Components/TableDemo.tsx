import { Edit2, Eye, Trash2 } from 'lucide-react'
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Chapter } from '@/types';
import EditChapterAlert from '@/Pages/Chapters/EditChapterAlert';
import DeleteChapterAlert from '@/Pages/Chapters/DeleteChapterAlert';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from '@inertiajs/react';
import PermissionAlert from './PermissionAlert';

dayjs.extend(relativeTime);

interface TableDemoProps {
  chapters: Chapter[];
  canEditChapter: boolean
  canDeleteChapter: boolean
}

export function EnhancedTableDemo({
  chapters,
  canEditChapter,
  canDeleteChapter
}: TableDemoProps) {
  // Sort chapters by order number
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {sortedChapters.length > 0 ? (
              <Table>
              <TableCaption className="pb-4">A list of your recent Chapters.</TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[100px] font-bold">No.</TableHead>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Contents</TableHead>
                  <TableHead className='font-bold'>Created At</TableHead>
                  <TableHead className='font-bold'>Updated At</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedChapters.map((chapter) => (
                  <TableRow key={chapter.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{chapter.order}</TableCell>
                    <TableCell className="font-semibold text-gray-700">{chapter.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 text-nowrap">
                        {chapter.contents_count} items
                      </span>
                    </TableCell>
                    <TableCell className=' text-nowrap' >{dayjs(chapter.created_at).fromNow()}</TableCell>
                    <TableCell className=' text-nowrap' >{dayjs(chapter.updated_at).fromNow()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link prefetch href={route('chapters.show', chapter.id)}>
                          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
      
                        {
                          canEditChapter ? <EditChapterAlert chapter={chapter} /> : <PermissionAlert
                            children={'Edit'}
                            buttonVariant={'outline'}
                            className='text-green-600 hover:text-green-700 hover:bg-green-50bg-transparent'
                            buttonSize={'sm'}
                            permission='update a chapter'
                            icon={<Edit2 className='h-4 w-4 mr-1' />}
                          />
                        }
                        {/* <EditChapterAlert chapter={chapter} /> */}

                        {
                          canDeleteChapter ? 
                          <DeleteChapterAlert id={chapter.id} name={chapter.title} />
                          : <PermissionAlert
                            children={'Delete'}
                            buttonVariant={'outline'}
                            buttonSize={'sm'}
                            icon={<Trash2 className="w-5 h-5 mr-2" />}
                            permission='delete a course'
                            className='text-red-600 hover:text-red-700 hover:bg-red-50'
                          />
                        }
                        {/* <DeleteChapterAlert id={chapter.id} name={chapter.title} /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      ): (
          <div className="flex flex-col items-center justify-center py-16">
          <img src={'/images/Course app-rafiki.svg'} alt="No data available" className="w-48 h-48" />
          <p className="text-gray-500 mt-4 text-lg">No chapters available. Start creating one!</p>
        </div>
      )}

    </div>
  )
}
