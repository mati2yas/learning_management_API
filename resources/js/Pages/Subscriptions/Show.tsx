"use client"

import { useState } from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog"
import type { SubscriptionRequest } from "@/types"
import RejectAlert from "./RejectAlert"
import ApproveAlert from "./ApproveAlert"
import PermissionAlert from "@/Components/PermissionAlert"
import { ArrowLeft } from "lucide-react"

const Show = ({
  subscription,
  canApprove,
  canReject,
}: {
  subscription: { data: SubscriptionRequest }
  canApprove: boolean
  canReject: boolean
}) => {
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
          <h1 className="font-bold text-xl">Subscription Request Details</h1>

          <div className="flex items-center space-x-2">
            <Link prefetch href={route("subscriptions.index")}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>

            <Badge className={`${getStatusColor(subscription.data.status)} text-white`}>
              {subscription.data.status}
            </Badge>
          </div>
        </div>
      }
    >
      <Head title="Subscription Request Details" />
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>{subscription.data.user?.name}'s Request</CardTitle>
              <CardDescription>
                Submitted on {new Date(subscription.data.created_at ?? "").toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Requested Courses</h3>
                  <p className="capitalize">
                    {subscription.data.courses.map((course) => (
                      <Badge
                        key={course.name}
                        className="bg-white/80 text-black font-semibold px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        {course.name}
                      </Badge>
                    ))}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Requested Exam Course</h3>
                  <p className="capitalize">
                    {subscription.data.exams?.map((exam) => (
                      <Badge
                        key={`${exam.exam_type}-${exam.exam_course}`}
                        className="bg-white/80 text-black font-semibold px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        {exam.exam_type} - {exam.exam_course}
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
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2">Proof of Payment</h3>
                  <span>
                    <span className="font-bold">Transaction ID -</span> {subscription.data.transaction_id}
                  </span>
                </div>

                <Dialog open={isImageFullscreen} onOpenChange={setIsImageFullscreen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-48 p-0 overflow-hidden">
                      <img
                        src={"/" + subscription.data.proof_of_payment || "/placeholder.svg"}
                        alt="Proof of Payment"
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="w-full h-full max-h-[calc(90vh-2rem)] overflow-auto p-4">
                      <img
                        src={"/" + subscription.data.proof_of_payment || "/placeholder.svg"}
                        alt="Proof of Payment"
                        className="w-auto h-auto max-w-full max-h-[calc(90vh-4rem)] mx-auto object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {subscription.data.status === "Pending" && (
                <>
                  {canReject ? (
                    <RejectAlert id={subscription.data.id} />
                  ) : (
                    <PermissionAlert
                      buttonVariant={"destructive"}
                      permission="reject a subscription"
                      children={"Reject"}
                    />
                  )}

                  {canApprove ? (
                    <ApproveAlert id={subscription.data.id} />
                  ) : (
                    <PermissionAlert
                      permission="reject a subscription"
                      children={"Approve"}
                      className="bg-green-500 text-white"
                    />
                  )}
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

