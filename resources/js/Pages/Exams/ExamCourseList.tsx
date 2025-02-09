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
import { Link, router } from '@inertiajs/react';
import React from "react";
import { ExamCourse } from "@/types";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import TextInput from "@/Components/TextInput";
import Dropdown from "@/Components/Dropdown";

dayjs.extend(relativeTime);

interface ExamCourseListProps {
  
  examCourses: ExamCourse[]

  canEdit: boolean
  canDelete: boolean
  canView: boolean

  users: UsersResponse,
  queryParams?: any,
  success: string,
}

interface user{
  id: number,
  name: string,
  created_at: string,
  updated_at: string,
  station?: {name: string}
  creator?: {name: string},
  updater?: {name: string},
  permissions: string[]
}

interface UsersResponse{
  data: user[]
  links: any
  meta: {links: any[]}
}

const ExamCourseList: React.FC<ExamCourseListProps> =({users, queryParams={}, success, examCourses}) =>{

  console.log(examCourses)

  const searchFieldChanged = (name: string, value: any) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route('exam-courses.index'), queryParams);
  };

  const sortChanged = (name: string) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    router.get(route('exam-courses.index'), queryParams);
  };

  const onKeyDown = (name: string, e: any) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged(name, e.target.value);
  };

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Exams</h1>
          <div className="flex gap-2">

          </div>
        </div>
      }
    >
      <div className="py-12">
        <div className="max-w-[1300px] mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-900">
            <div className="p-6 text-gray-900 dark:text-gray-100">

              {}

            <Table>
                <TableCaption>A list of exam courses</TableCaption>
                <TableHeader>

                  <TableRow>
                    <TableHead onClick={() => sortChanged('id')} className='text-nowrap'>
                      <div className='flex items-center gap-x-1'>
                        #No
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className='w-[200px]' onClick={()=> sortChanged('name')}>
                      <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Name</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead >

                    <TableHead onClick={()=> sortChanged('email')} className=' text-nowrap'>
                      <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Email</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead>

                    <TableHead onClick={()=> sortChanged('create_at')} className=' text-nowrap'>
                      <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Registration Date</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className='text-nowrap'>Privillages</TableHead>
                    <TableHead className='text-nowrap'>Creator</TableHead>
                    <TableHead className='text-nowrap'>Updater</TableHead>
                    <TableHead className='text-nowrap'>Actions</TableHead>
                  </TableRow>

                </TableHeader>

                <TableHeader>
                  <TableHead></TableHead>
                  <TableHead className='w-10'>
                    <TextInput 
                      className=' w-full'
                      placeholder='Admin Name'
                      defaultValue={queryParams.name}
                      onBlur={(e)=> searchFieldChanged('name', e.target.value)}
                      onKeyDown={(e) => onKeyDown('name', e)}
                    />
                  </TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableHeader>

                <TableBody>
                  {users.data.map((user,index)=>(
                    <TableRow key={index}>
                      <TableCell className=' text-nowrap'>
                        {index+1}
                      </TableCell>
                      <TableCell className=' text-nowrap'>
                        {user.name}
                      </TableCell>
                      <TableCell className=' text-nowrap'>
                        {user.station?.name || 'N/A'}
                      </TableCell>
                      <TableCell className=' text-nowrap'>
                        {dayjs(user.created_at).fromNow() || 'N/A'}
                      </TableCell>


                      <TableCell className=' text-nowrap'>
                        {user.creator?.name || 'N/A'}
                      </TableCell>
                      <TableCell className=' text-nowrap'>
                        {user.updater?.name || 'N/A'}
                      </TableCell>
                      <TableCell className='flex gap-x-3 items-center'>
                        <Dropdown>
                          <Dropdown.Trigger>
                          <button>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                          </Dropdown.Trigger>

                          <Dropdown.Content >
                            <Dropdown.Link
                              as='button'
                              href={route('user-managements.edit', user.id)} 
                              method='get'
                            >
                              Edit
                            </Dropdown.Link>
                            {/* <Dropdown.Link as='button' href={route('user-managements.destroy',user.id )} method="delete">
                              Delete
                            </Dropdown.Link> */}
                            {/* <AlertDelete user={user} /> */}
                          </Dropdown.Content>
                        </Dropdown>
                        
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </div>
          </div>
        </div>
      </div>

    </Authenticated>
  )
}