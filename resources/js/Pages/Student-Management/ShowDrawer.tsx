import { useState } from "react"
import { Button } from "@/Components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { Ban, ChevronDown, ChevronUp } from "lucide-react"
import { ExamCourse } from "@/types"
import AlertUnBan from "./AlertUnBan"
import PermissionAlert from "@/Components/PermissionAlert"
import AlertBan from "./AlertBan"

interface Course {
  id: number
  name: string
}

interface SubscriptionRequest {
  id: number
  exam_course: ExamCourse[] | null
  total_price: number
  proof_of_payment: string
  transaction_id: string
  status: "Pending" | "Approved" | "Rejected"
  created_at: string
  updated_at: string
  subscription: {
    id: number
    subscription_start_date: string
    subscription_end_date: string
    created_at: string
    updated_at: string
  } | null
}

interface User {
  id: number
  name: string
  avatar: string
  bio: string
  email: string
  bannedUser: boolean
  subscriptionRequests: SubscriptionRequest[]
  created_at: string
  updated_at: string
}

interface UserDetailProps {
  user: User
  canBan: boolean
  canUnban: boolean
}

export default function UserDetailDrawer({ user, canBan, canUnban }: UserDetailProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [expandedRequests, setExpandedRequests] = useState<number[]>([])

  const toggleRequestExpansion = (requestId: number) => {
    setExpandedRequests((prev) =>
      prev.includes(requestId) ? prev.filter((id) => id !== requestId) : [...prev, requestId],
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">View User Details</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>View and manage user information</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center space-x-4">
            {
              user.avatar ? <img src={'/storage/'+user.avatar} className="w-20 h-50 rounded-full"/> :             <Avatar className="h-20 w-20">
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            }

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.bio? user.bio : null}</p>
              {/* <p className="text-gray-500">Gender: {user.gender}</p> */}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscription Requests</h3>
            {user.subscriptionRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Request #{request.id}</span>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        request.status === "Approved"
                          ? "outline"
                          : request.status === "Rejected"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {request.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => toggleRequestExpansion(request.id)}>
                      {expandedRequests.includes(request.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {expandedRequests.includes(request.id) && (
                  <div className="mt-2 space-y-2">
                    {/* <p>Courses: {request.courses.map((course) => course.name).join(", ")}</p> */}
                    {request.exam_course && (
                      <p>Exam Courses: {request.exam_course.map((course) => course.course_name).join(", ")}</p>
                    )}
                    <p>Total Price: ETB {request.total_price}</p>
                    <p>Transaction ID: {request.transaction_id}</p>
                    <p>Created: {request.created_at}</p>
                    {request.status === "Approved" && request.subscription && (
                      <div className="mt-2 p-2 bg-green-50 rounded-md">
                        <p className="font-semibold">Subscription Details:</p>
                        <p>Start Date: {request.subscription.subscription_start_date}</p>
                        <p>End Date: {request.subscription.subscription_end_date}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>

          {
            user.bannedUser ?(
              canUnban ?
            <AlertUnBan user={user} /> : <PermissionAlert children={'UnBan'}
            permission='can unban a user' 
            buttonVariant={'outline'}
            className='bg-green-600 text-white p-2'/>
          ): (
              canBan ?
            <AlertBan user={user}/> : <PermissionAlert children={'Ban'} permission={'can ban a user'}
            buttonVariant={'outline'} className='bg-red-600 text-white p-2' />
          )
          }
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

