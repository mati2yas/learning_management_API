
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { useState } from 'react'
import { SubscriptionRequestsTable } from './SubscriptionRequestsTable'
import { SubscriptionsTable } from './SubscriptionTable'
import { Subscription } from '@/types'
import { SubscriptionRequest } from '../../types/index';
import { SessionToast } from '@/Components/SessionToast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { ErrorToast } from '@/Components/ErrorToast'

interface SubscriptionIndexProps {
  subscriptions: {
    data: Subscription[]
  }

  subscriptionRequests: {
    data: SubscriptionRequest[]
    links: Array<{
      url: string | null;
      active: boolean;
      label: string;
    }>;
    meta: any;
  }

  filters: {
    status: string;
  }
}

const Index = ({subscriptions,subscriptionRequests, filters }:SubscriptionIndexProps) => {

  const { flash } = usePage().props as unknown as { flash: { success?: string, error?: string } };

  console.log(subscriptionRequests)

  const {data, setData} = useForm({
    status: filters.status || '',
  });
  
  const [activeTab, setActiveTab] = useState("requests")

  const handleStatusChange = (value: string) =>{
    const statusValue = value === 'all' ? '' : value;
    setData('status', statusValue)
    updateFilters({ status: statusValue });
  }

  const updateFilters = (newFilters: Partial<typeof data>) => {
    router.get(route('subscriptions.index'), { ...data, ...newFilters }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <Authenticated
        header={
          <div className='flex justify-between'>
            <h1 className=' font-bold'>Subscription Requests</h1>
        </div>
        }
      >
      <Head title='user management' />
      
      {flash.success && (<SessionToast message={flash.success }  />)}

      {flash.error && (<ErrorToast message={flash.error} />)}


      <div className="py-12">
        <div className="max-w-[1300px] mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-900">

            <div className='w-full sm:w-auto'>
                <Select value={data.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value='all'>
                      All Status
                    </SelectItem>
                    <SelectItem value='approved'>
                      Approved
                    </SelectItem>
                    <SelectItem value='rejected'>
                      Rejected
                    </SelectItem>
                    <SelectItem value='pending'>
                      Pending
                    </SelectItem>
                  </SelectContent>

                </Select>
            </div>


            <div className="p-6 text-gray-900 dark:text-gray-100">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">

                  <TabsTrigger value="requests">Subscription Requests</TabsTrigger>
                  <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                </TabsList>

                <TabsContent value="requests">
                  <SubscriptionRequestsTable
                  subscriptionRequests={subscriptionRequests}  />
                </TabsContent>

                <TabsContent value="subscriptions">
                  <SubscriptionsTable subscriptions={subscriptions}  />
                </TabsContent>
              </Tabs>

            </div>
          </div>




          <div className="mt-6 flex justify-center items-center space-x-2">
            {subscriptionRequests.meta.links?.map((link: { url: any; active: any; label: any }, index: React.Key | null | undefined) => (
              <Link
                key={index}
                href={link.url || '#'}
                className={`px-4 py-2 border rounded ${
                  link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
                preserveScroll
                preserveState
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </Authenticated>
  )
}

export default Index
