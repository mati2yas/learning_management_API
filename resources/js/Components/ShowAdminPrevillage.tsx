import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { allPermissions } from '@/constants/allPermissions';
import { Link } from "@inertiajs/react"

interface Permission {
  name: string
}

// interface User {
//   id: number
//   name: string
//   permissions: Permission[]
// }

interface ShowPrivilegeProps {
  user: any
}

interface PermissionGroup {
  title: string
  permissions: Permission[]
}

const permissionGroups: PermissionGroup[] = [
  {
    title: "Courses",
    permissions: allPermissions.filter((p) => p.name.includes("courses")),
  },
  {
    title: "Chapters",
    permissions: allPermissions.filter((p) => p.name.includes("chapters")),
  },
  {
    title: "Content",
    permissions: allPermissions.filter((p) => p.name.includes("content")),
  },
  {
    title: "Subscriptions",
    permissions: allPermissions.filter((p) => p.name.includes("subscription")),
  },
  {
    title: "Quizzes",
    permissions: allPermissions.filter((p) => p.name.includes("quizzes") || p.name.includes("quiz questions")),
  },
  {
    title: "Exams Questions",
    permissions: allPermissions.filter((p) => p.name.includes("exam questions")),
  },
  {
    title: "Exams Courses",
    permissions: allPermissions.filter((p) => p.name.includes("exam courses")),
  },
  {
    title: "Exams",
    permissions: allPermissions.filter((p) => p.name.includes("exams")),
  },
  {
    title: "Workers management",
    permissions: allPermissions.filter((p) => p.name.includes("worker")),
  },

  {
    title: "Contents",
    permissions: allPermissions.filter((p) => p.name === "can view contents"),
  },
  {
    title: "Ban User",
    permissions: allPermissions.filter((p) => p.name === "can ban"),
  },
  {
    title: "Unban User",
    permissions: allPermissions.filter((p) => p.name === "can unban"),
  },
  {
    title: "views",
    permissions: allPermissions.filter((p) => p.name.includes('can view'))
  }
]


// console.log(allPermissions.filter((p) => p.name.includes("exams")))

function ShowAdminPrivilege({ user }: ShowPrivilegeProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Privileges</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Privileges</DialogTitle>
          <DialogDescription>
            Privileges for <span className="font-semibold">{user.name}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-[60vh]">
          {permissionGroups.map((group, groupIndex) => (
            <Card key={groupIndex} className="mb-4">
              <CardHeader>
                <CardTitle>{group.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.permissions.map((permission, index) => {
                    const isChecked = user.permissions.some((userPermission: string) => userPermission === permission.name)

                    // console.log(user.permissions)
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox checked={isChecked} disabled />
                        <label className="text-sm">
                          {permission.name
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>

        <div className="mt-4 flex justify-end">
          <Button asChild>
            <Link prefetch href={`/user-managements/${user.id}/edit`}>Edit Privileges</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShowAdminPrivilege

