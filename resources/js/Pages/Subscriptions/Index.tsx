
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { useState } from 'react'
import { SubscriptionRequestsTable } from './SubscriptionRequestsTable'
import { SubscriptionsTable } from './SubscriptionTable'
import { Subscription } from '@/types'
import { SubscriptionRequest } from '../../types/index';

interface SubscriptionIndexProps {
  subscriptions: {
    data: Subscription[]
  }
  subscriptionRequests: {
    data: SubscriptionRequest[]
  }
}

const Index = ({subscriptions,subscriptionRequests }:SubscriptionIndexProps) => {
  
  console.log(subscriptionRequests)
  const [activeTab, setActiveTab] = useState("requests")

  return (
    <Authenticated
        header={
          <div className='flex justify-between'>
            <h1 className=' font-bold'>Subscription Requests</h1>
        </div>
        }
      >
      <Head title='user management' />
      
      <div className="py-12">
        <div className="max-w-[1300px] mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-900">
            <div className="p-6 text-gray-900 dark:text-gray-100">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="requests">Subscription Requests</TabsTrigger>
                  <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                </TabsList>
                <TabsContent value="requests">
                  <SubscriptionRequestsTable subscriptionRequests={subscriptionRequests}  />
                </TabsContent>
                <TabsContent value="subscriptions">
                  <SubscriptionsTable subscriptions={subscriptions}  />
                </TabsContent>
              </Tabs>

            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

export default Index
