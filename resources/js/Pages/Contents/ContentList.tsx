import React from 'react'
import { FileText, Youtube, File, Edit, Trash2, Eye, Edit2 } from 'lucide-react'
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
import PermissionAlert from '@/Components/PermissionAlert';


interface ContentListProps {
  contents: Content[]
  canEdit: boolean
  canDelete: boolean
  canView: boolean
}

const ContentList: React.FC<ContentListProps> = ({ contents, canEdit, canDelete, canView }) => {

  const sortedContents = [...contents].sort((a,b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sortedContents.length > 0 ? (
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

                          {
                          canView ?                           <Link href={route('contents.show', content.id)}>
                                <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                           : <PermissionAlert
                              children={'View'}
                              buttonSize={'sm'}
                              permission='view a content'
                              className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                              icon={<Eye className='h-4 w-4 mr-1' />}
                              buttonVariant={'outline'}

                            />
                          }


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
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
        <img src={'/images/Content-rafiki.svg'} alt="No data available" className="w-48 h-48" />
        <p className="text-gray-500 mt-4 text-lg">No Contents available. Start creating one!</p>
      </div>
      )}

    </div>
  )
}

export default ContentList

