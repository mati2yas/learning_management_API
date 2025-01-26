import React from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'



const Index: React.FC = () => {
  return(
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
          <React.Fragment>
            <h1 className="text-2xl font-semibold">Exams</h1>
            
          </React.Fragment>
        </div>
        }
      >
        <Head title="Exams" />
        <div className="py-12">
          <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
            <div>Exams Here</div>
          </div>
        </div>

    </AuthenticatedLayout>
  )
}

export default Index

