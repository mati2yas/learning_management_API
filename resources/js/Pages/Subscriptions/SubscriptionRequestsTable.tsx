import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { SubscriptionRequest } from "@/types";
import { Link } from "@inertiajs/react";



interface SubscriptionRequestsTableProps {
  subscriptionRequests: {
    data: SubscriptionRequest[]
  };
}


export function SubscriptionRequestsTable({subscriptionRequests}: SubscriptionRequestsTableProps) {

  console.log(subscriptionRequests)

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500"
      case "Approved":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Course/Exam</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Proof of Payment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptionRequests && subscriptionRequests.data.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.user.name}</TableCell>
            <TableCell>{request.course?.name ?? request.exam_course?.name ?? "N/A"}</TableCell>
            <TableCell>${request.total_price}</TableCell>
            <TableCell>
              <img
                src={request.proof_of_payment || "/placeholder.svg"}
                alt="Proof of Payment"
                className="w-12 h-12 object-cover rounded"
              />
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
            </TableCell>
            <TableCell>
              <Link href={route('subscriptions.show', request.id)}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

