import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { CreateCourseAlert } from './createCourseAlert'

interface Category {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  name: string;
  category_id: number;
}

interface Department {
  id: number;
  name: string;
  category_id: number;
}

interface Batch {
  id: number;
  name: string;
  department_id: number;
}

interface CreateCourseAlertProps {
  categories: Category[];
  grades: Grade[];
  departments: Department[];
  batches: Batch[];
}

const Index = ({categories, grades, departments, batches  }: CreateCourseAlertProps) => {
  return (
    <Authenticated
      header={      
        <div className='flex justify-between'>
          <h1>Courses</h1>
          <CreateCourseAlert
            categories={categories}
            grades={grades}
            departments={departments}
            batches={batches}
          />
        </div>
      }
    >

      <Head title='Stations' />

    </Authenticated>
  )
}

export default Index
