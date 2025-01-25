import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';


const Index = () => {
  return (
    <AuthenticatedLayout
      header={
        <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-semibold">User Management</h1>
            <div></div>
        </div>
      }
    >
      <Head title='User management' />

      <div className='py-12'>
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            User Management!
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  )
}

export default Index
