import { useState } from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { SubscriptionRequest } from "@/types"


const Show = ({ subscription }: { subscription: { data: SubscriptionRequest } }) => {

  console.log(subscription)

  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const { post, processing } = useForm()

  const handleStatusUpdate = (newStatus: "Approved" | "Rejected") => {
    post(
      route("subscriptions.update", subscription.data.id),
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Status Updated",
            description: `The request has been ${newStatus.toLowerCase()}.`,
          })
        },
      },
    )
  }

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
                  <h3 className="font-semibold">Requested Item</h3>
                  <p className="capitalize">{subscription.data.course?.name || subscription.data.exam_course?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Total Price</h3>
                  <p>Birr - {subscription.data.total_price}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Proof of Payment</h3>
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
                  <Button variant="destructive" onClick={() => handleStatusUpdate("Rejected")} disabled={processing}>
                    Reject
                  </Button>
                  <Button onClick={() => handleStatusUpdate("Approved")} disabled={processing}>
                    Approve
                  </Button>
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

