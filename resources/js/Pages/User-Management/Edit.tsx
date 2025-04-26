

import { type FormEventHandler, useState } from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { GroupedPermissions } from "./GroupedPermission"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { allPermissions } from '@/constants/allPermissions';

interface User {
  id: number
  name: string
  email: string
  permissions: string[]
}

interface EditUser {
  user: {
    data: User
  }
}


const permissionGroups = [
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
    title: "Exam Questions",
    permissions: allPermissions.filter((p) => p.name.includes("exam questions")),
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

export default function Edit({ user }: EditUser) {
  const userData = user.data
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const { data, setData, put, processing, errors } = useForm({
    name: userData.name,
    email: userData.email,
    password: "",
    password_confirmation: "",
    permissions: userData.permissions || [],
  })

  const handlePermissionChange = (permission: string) => {
    const updatedPermissions = data.permissions.includes(permission)
      ? data.permissions.filter((p) => p !== permission)
      : [...data.permissions, permission]

    setData("permissions", updatedPermissions)
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    put(route("user-managements.update", { user_management: userData.id }))
  }

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Edit User</h1>
          <Link
            prefetch
            className="p-2 text-xs  border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground flex "
            href={route("user-managements.index")}
          >
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Back
          </Link>
        </div>
      }
    >
      <Head title="Edit User Privileges" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 gap-8">
            <form onSubmit={submit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Jon Doe"
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="admin@example.com"
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={data.password}
                          onChange={(e) => setData("password", e.target.value)}
                          placeholder="Leave blank to keep current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="password_confirmation"
                          type={showPassword2 ? "text" : "password"}
                          value={data.password_confirmation}
                          onChange={(e) => setData("password_confirmation", e.target.value)}
                          placeholder="Leave blank to keep current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword2(!showPassword2)}
                        >
                          {showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password_confirmation && (
                        <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <GroupedPermissions
                    permissionGroups={permissionGroups}
                    selectedPermissions={data.permissions}
                    onPermissionChange={handlePermissionChange}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  Update User
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

