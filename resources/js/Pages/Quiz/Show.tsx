import { Button } from '@/Components/ui/button'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { ArrowLeft } from 'lucide-react'
import { Head } from '@inertiajs/react';

const Show = () => {
  return (
    <Authenticated header={
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold">
        Quize: 
      </h1>

      <Button variant="outline" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
      </Button>
    </div>
    }>

      <Head title="Quiz Detail" />
      <div className='py-12'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>

    
        </div>
      </div>
      
    </Authenticated>
  )
}

export default Show
