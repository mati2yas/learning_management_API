
import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog"
import { SubscriptionRequest } from "@/types"
import RejectAlert from "./RejectAlert"
import ApproveAlert from "./ApproveAlert"
import PermissionAlert from "@/Components/PermissionAlert"

const Show = ({ subscription, canApprove, canReject }: { 
  subscription: { data: SubscriptionRequest };
  canApprove: boolean;
  canReject: boolean; }) => {

  // console.log(subscription)

  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const { processing } = useForm()


  const getStatusColor = (status: SubscriptionRequest["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500"
      case "Approved":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
    }
  }

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Subscription Request Details</h1>
          <Badge className={`${getStatusColor(subscription.data.status )} text-white`}>{subscription.data.status }</Badge>
        </div>
      }
    >
      <Head title="Subscription Request Details" />
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>{subscription.data.user?.name }'s Request</CardTitle>
              <CardDescription>Submitted on {new Date(subscription.data.created_at ?? "").toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Requested Courses</h3>
                  <p className="capitalize">
                    {subscription.data.courses.map((course)=>(
                      <Badge className="bg-white/80 text-black font-semibold px-3 py-1 rounded-full">
                        {course.name}
                      </Badge>
                    ))}
                   
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Requested Exam Course</h3>
                  <p className="capitalize">
                    {subscription.data.exam_course?.map((course)=>(
                      <Badge className="bg-white/80 text-black font-semibold px-3 py-1 rounded-full">
                        {course.name}
                      </Badge>
                    ))}
                   
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Total Price</h3>
                  <p>Birr - {subscription.data.total_price}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between"><h3 className="font-semibold mb-2"> Proof of Payment</h3> <span><span className=" font-bold">Transaction ID -</span>  {subscription.data.transaction_id}</span></div>
                
                <Dialog open={isImageFullscreen} onOpenChange={setIsImageFullscreen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-48 p-0 overflow-hidden">
                      <img
                        src={'/'+subscription.data.proof_of_payment || "/placeholder.svg"}
                        alt="Proof of Payment"
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <img
                      src={'/'+subscription.data.proof_of_payment || "/placeholder.svg"}
                      alt="Proof of Payment"
                      className="w-full h-auto"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {subscription.data.status === "Pending" && (
                <>
                  {/* <Link href={route('subscriptions.reject', subscription.data.id)} method="post">
                    <Button variant="destructive" disabled={processing}>
                      Reject
                    </Button>
                  </Link> */}
                  {
                    canReject ?  <RejectAlert id={subscription.data.id} /> : <PermissionAlert
                      buttonVariant={'destructive'}
                      permission="reject a subscription"
                      children={'Reject'}
                    />
                  }

                 

                  {/* <Link href={route('subscriptions.approve', subscription.data.id)} method="post">
                    <Button variant={"secondary"} className=" bg-green-500" disabled={processing}>
                      Approve
                    </Button>
                  </Link> */}
                  {
                    canApprove ?  <ApproveAlert id={subscription.data.id} /> : <PermissionAlert 
                      permission="reject a subscription"
                      children={'Approve'}
                      className="bg-green-500 text-white"
                    />
                  }
                 
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Authenticated>
  )
}

export default Show

