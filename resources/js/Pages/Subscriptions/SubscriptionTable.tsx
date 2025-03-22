import { Badge } from "@/Components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import type { Subscription } from "@/types"

interface SubscriptionsTableProps {
  subscriptions: {
    data: Subscription[]
  }
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Exams</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Subscription Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.data.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">{subscription.subscription_request.user.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {subscription.subscription_request.courses
                    ? subscription.subscription_request.courses.map((course, index) => (
                        <Badge key={index} variant="outline" className="px-2 py-1">
                          {course.name}
                        </Badge>
                      ))
                    : "N/A"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {subscription.subscription_request.exams
                    ? subscription.subscription_request.exams.map((exam, index) => (
                        <Badge key={index} variant="outline" className="px-2 py-1">
                          {exam.name}
                        </Badge>
                      ))
                    : "N/A"}
                </div>
              </TableCell>
              <TableCell>{new Date(subscription.subscription_start_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(subscription.subscription_end_date).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{subscription.subscription_request.subscription_type}</TableCell>
              <TableCell>
                <Badge
                  variant={subscription.status.toLowerCase() === "active" ? "default" : "destructive"}
                  className={
                    subscription.status.toLowerCase() === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                  }
                >
                  {subscription.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

