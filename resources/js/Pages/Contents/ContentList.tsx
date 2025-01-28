import React from 'react'
import { FileText, Youtube, File, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { 
  Table,   
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,} from '@/Components/ui/table'
  import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from '@inertiajs/react';

dayjs.extend(relativeTime);
import { Content } from '@/types'
import EditContentAlert from './EditContentAlert';
import DeleteContentAlert from './DeleteContentAlert';


interface ContentListProps {
  contents: Content[]
}

const ContentList: React.FC<ContentListProps> = ({ contents }) => {

  const sortedContents = [...contents].sort((a,b) => a.order - b.order);

  return (
    <div className="space-y-2">
      <Table>
        <TableCaption className="pb-4">A list of your recent Contents.</TableCaption>
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
          {sortedContents.length > 0 ? (
            sortedContents.map((content) => (
              <TableRow key={content.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className='font-medium'>
                  {content.order}
                </TableCell>
                <TableCell className="font-semibold text-gray-700">{content.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 text-nowrap">
                    {content.contents_count} items
                  </span>
                </TableCell>
                <TableCell className='text-nowrap'>{dayjs(content.created_at).fromNow()}</TableCell>
                <TableCell className='text-nowrap'>{dayjs(content.updated_at).fromNow()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={route('contents.show', content.id)}>
                      <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <EditContentAlert content={content} />
                    <DeleteContentAlert id={content.id} name={content.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                No content found
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        </Table>
    </div>
  )
}

export default ContentList

