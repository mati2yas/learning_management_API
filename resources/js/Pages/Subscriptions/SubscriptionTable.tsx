import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Subscription } from "@/types";



interface SubscriptionsTableProps {
  subscriptions: {
    data: Subscription[]
  };
}


export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {

  console.log(subscriptions)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Course/Exam</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Expiry Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.data.map((subscription) => (
          <TableRow key={subscription.id}>
            <TableCell>{subscription.subscription_request.user.name}</TableCell>
            <TableCell>{subscription.subscription_request.course ? subscription.subscription_request.course.name : subscription.subscription_request.exam_course?.name ?? 'N/A'}</TableCell>
            <TableCell>{subscription.subscription_start_date}</TableCell>
            <TableCell>{subscription.subscription_expiry_date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

