import { Head, usePage } from '@inertiajs/react'
import Authenticated from './AuthenticatedLayout'
import { SessionToast } from '@/Components/SessionToast'
import { ErrorToast } from '@/Components/ErrorToast'

interface MainLayoutProps {
  tabTitle: string
  pageTitle: string
  children: React.ReactNode
  headerAction?: React.ReactNode
  navLinks?: React.ReactNode
}

const MainLayout = ({children, tabTitle, pageTitle, headerAction, navLinks}: MainLayoutProps) => {

  const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } }

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">{pageTitle}</h1>
            {navLinks}
          </div>

          <div className="flex gap-2">
            {headerAction}
          </div>
        </div>
        }
      >

      <Head title={tabTitle}/>

      {flash.success && (<SessionToast message={flash.success }  />)}

      {flash.error && (<ErrorToast message={flash.error} />)}

      <div className="py-12">
        <div className="mx-auto max-w-[1300px] sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
      
    </Authenticated>
  )
}

export default MainLayout
