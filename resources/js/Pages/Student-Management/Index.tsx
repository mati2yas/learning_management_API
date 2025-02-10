import Dropdown from '@/Components/Dropdown'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Head, Link, router } from '@inertiajs/react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import dayjs from 'dayjs'
import realativeTime from 'dayjs/plugin/relativeTime'

import TextInput from '@/Components/TextInput'
import Authenticated from '@/Layouts/AuthenticatedLayout'
// import { AlertDelete } from './AlertDelete'
import ShowAdminPrevillage from '@/Components/ShowAdminPrevillage'
import AlertBan from './AlertBan'
import ShowDrawer from './ShowDrawer'

dayjs.extend(realativeTime)

interface user{
  email: string
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

interface IndexProps{
  users: UsersResponse,
  queryParams?: any,
  success: string,
}

const Index = ({users, queryParams={}, success}: IndexProps) => {

  queryParams = queryParams || {}

  // console.log(users)
  const searchFieldChanged = (name: string, value: any) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route('user-managements.index'), queryParams);
  };

  const sortChanged = (name: string) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }
    router.get(route('user-managements.index'), queryParams);
  };

  const onKeyDown = (name: string, e: any) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged(name, e.target.value);
  };


  return (
    <Authenticated
      header={
        <div className='flex justify-between'>
          <h1 className=' font-bold'>User Management</h1>
          <Link href={route('user-managements.create')}>Add Users</Link>
      </div>
      }
    >

    <Head title='student management' />
    <div className="py-12">
        <div className="max-w-[1300px] mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-900">
            <div className="p-6 text-gray-900 dark:text-gray-100">

            <Table>
                <TableCaption>A list of users</TableCaption>
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
                    {/* <TableHead onClick={()=> sortChanged('gender')} className='text-nowrap'>
                    <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Gender</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead> */}
                    <TableHead onClick={()=> sortChanged('email')} className=' text-nowrap'>
                      <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Email</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead>
                    {/* <TableHead onClick={()=> sortChanged('phone_no')} className='text-nowrap'>
                      <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Phone Number</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead> */}

                    {/* <TableHead className=' text-nowrap'>Station</TableHead> */}
                    {/* <TableHead onClick={()=> sortChanged('salary')} className='text-nowrap'>
                      <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Salary</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead> */}

                    <TableHead onClick={()=> sortChanged('create_at')} className=' text-nowrap'>
                      <div className='flex items-center gap-x-1'>
                        <span className='text-nowrap'>Registration Date</span>
                        <div className=' hover:cursor-pointer'>
                          <ChevronUpIcon className='w-4' />
                          <ChevronDownIcon className='w-4 -mt-3' />
                        </div>
                      </div>
                    </TableHead>
                   
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
                        {user.email || 'N/A'}
                      </TableCell>
                      <TableCell className=' text-nowrap'>
                        {dayjs(user.created_at).fromNow() || 'N/A'}
                      </TableCell>
                      <TableCell className='text-nowrap'>
                        {<>
                        {/* <ShowAdminPrevillage 
                          user={user}
                        /> */}
                        </>}
                      </TableCell>
                      <TableCell className=' text-nowrap'>
                        {user.creator?.name || 'N/A'}
                      </TableCell>
                      <TableCell className=' text-nowrap'>
                        {user.updater?.name || 'N/A'}
                      </TableCell>
                      <TableCell className='flex gap-x-3 items-center'>
                        <ShowDrawer />
                        <AlertBan user={user}/>
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

export default Index
